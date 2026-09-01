/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RequestConfig, RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { RetryTracker } from '@csegames/library/dist/_baseGame/utils/retryTracker';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { GraphQLResult } from '@csegames/library/dist/graphql/GraphQLResult';
import { DocumentNode } from '@csegames/library/dist/graphql/Protocol';
import { LoadingTopic, setInitialized } from './loadingSlice';
import { webConf } from './networkConfiguration';
import { store } from './store';
import { graphQL } from './graphQL';

const START_DELAY = 250;
const MAX_DELAY = 10000;
const MAX_RETRIES: number | undefined = undefined;

type GraphQLParams = {
  query: DocumentNode;
  variables?: Record<string, unknown>;
  operationName?: string;
};

type Constructor = new (...args: any[]) => {};

export function WithWebInterface<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    protected resetGraphQL() {
      if (graphQL.connected) {
        graphQL.reset();
      }
    }

    protected async subscribe<T>(request: GraphQLParams, handler: (update: T) => void): Promise<ListenerHandle> {
      return this.runIfOnline(undefined, () => {
        let reported = false;
        if (!graphQL.connected) graphQL.open();
        return graphQL.addSubscription(
          (update: GraphQLResult) => {
            if (update.data) {
              handler(update.data as T);
              return;
            }
            if (!reported || clientAPI.getDebugHints().verboseAPIErrors) {
              console.warn('Subscription update failure', JSON.stringify(request.query), update.errors);
              reported = true;
            }
          },
          request.query,
          request.variables,
          request.operationName
        );
      });
    }

    protected onDisconnect(handler: () => void): Promise<ListenerHandle> {
      return graphQL.onConnectedChanged((connected: boolean) => {
        if (!connected) handler();
      });
    }

    protected onInitialize(handler: () => void): Promise<ListenerHandle> {
      return graphQL.onConnectedChanged((connected: boolean) => {
        if (connected) handler();
      });
    }

    // note : all calls should be converted to queries as time permits
    // the first attempt is handled synchronously, retries occur in the background until success or the handle is closed
    protected async call<T>(
      request: (config: RequestConfig) => Promise<RequestResult>,
      handler: (result: RequestResult) => void,
      topic?: LoadingTopic,
      maxRetries?: number
    ): Promise<ListenerHandle> {
      return this.runIfOnline(topic, async () => {
        const tracker = RetryTracker.create(START_DELAY, MAX_DELAY, maxRetries ?? MAX_RETRIES);
        const result = await request(webConf);
        if (result.ok && result.data) {
          handler(result);
          if (topic) store.dispatch(setInitialized({ topic, result: true }));
        } else if (tracker.shouldRetry) {
          if (topic) store.dispatch(setInitialized({ topic, result: false }));
          this.retryCall(request, handler, tracker, result.statusText, topic);
        }
        return Promise.resolve(tracker);
      });
    }

    private async retryCall<T>(
      request: (config: RequestConfig) => Promise<RequestResult>,
      handler: (result: RequestResult) => void,
      tracker: RetryTracker,
      msg: string,
      topic?: LoadingTopic
    ): Promise<void> {
      do {
        if (tracker.failureCount === 0 || clientAPI.getDebugHints().verboseAPIErrors) {
          console.warn('Call failure', msg, topic);
        }
        await tracker.onFailed();
        const result = await request(webConf);
        if (result.ok) {
          handler(result);
          if (topic) store.dispatch(setInitialized({ topic, result: true }));
          return;
        }
      } while (tracker.shouldRetry);
    }

    // the first attempt is handled synchronously, retries occur in the background until success or the handle is closed
    protected query<T>(
      request: GraphQLParams,
      handler: (result: T) => void,
      topic?: LoadingTopic,
      maxRetries?: number
    ): Promise<ListenerHandle> {
      return this.runIfOnline(topic, () => {
        if (!graphQL.connected) graphQL.open();
        const tracker = RetryTracker.create(START_DELAY, MAX_DELAY, maxRetries ?? MAX_RETRIES);
        graphQL.sendQuery(request.query, request.variables).then(
          (resolved) => {
            if (resolved.data) {
              handler(resolved.data as T);
              if (topic) store.dispatch(setInitialized({ topic, result: true }));
              return Promise.resolve();
            }
            if (topic) store.dispatch(setInitialized({ topic, result: false }));
            if (!tracker.shouldRetry) return Promise.resolve();
            this.retryQuery(request, handler, tracker, topic);
          },
          (rejected) => {
            if (topic) store.dispatch(setInitialized({ topic, result: false }));
            if (!tracker.shouldRetry) return Promise.resolve();
            this.retryQuery(request, handler, tracker, topic);
          }
        );
        return Promise.resolve(tracker);
      });
    }

    private async retryQuery<T>(
      request: GraphQLParams,
      handler: (result: T) => void,
      tracker: RetryTracker,
      topic?: LoadingTopic
    ): Promise<void> {
      do {
        if (tracker.failureCount === 0 || clientAPI.getDebugHints().verboseAPIErrors) {
          console.warn('Query failure', request);
        }
        await tracker.onFailed();
        const result = await graphQL.sendQuery(request.query, request.variables);
        if (result.data) {
          handler(result.data as T);
          if (topic) store.dispatch(setInitialized({ topic, result: true }));
          return;
        }
      } while (tracker.shouldRetry);
    }

    private async runIfOnline(
      topic: LoadingTopic | undefined,
      onSuccess: () => Promise<ListenerHandle>
    ): Promise<ListenerHandle> {
      if (await clientAPI.isOfflineMode()) {
        if (topic) store.dispatch(setInitialized({ topic, result: false }));
        return Promise.resolve({ close: () => {} });
      }
      return onSuccess();
    }
  };
}
