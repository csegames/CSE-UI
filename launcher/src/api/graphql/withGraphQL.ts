/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DocumentNode } from 'graphql';
import { GraphQLService } from './GraphQLService';
import { GraphQLResult } from './GraphQLResult';
import { ListenerHandle } from '../../lib/ListenerHandle';
import { RetryTracker } from '../../lib/RetryTracker';

const START_DELAY = 250;
const MAX_DELAY = 10000;
const MAX_RETRIES: number | undefined = undefined;

export const graphQL = GraphQLService.create({
  getBearerToken() {
    return window.patcher.accessToken;
  },
  getServiceUrl() {
    const host = window.patcher.apiHost;
    try {
      return Promise.resolve(host ? new URL(host) : null);
    } catch {
      return Promise.resolve(null);
    }
  }
});

type GraphQLParams = {
  query: DocumentNode;
  variables?: Record<string, unknown>;
  operationName?: string;
};

type Constructor = new (...args: any[]) => {};

export function WithGraphQL<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    protected async subscribe<T>(request: GraphQLParams, handler: (update: T) => void): Promise<ListenerHandle> {
      if (!graphQL.connected) graphQL.open();

      return graphQL.addSubscription(
        (update: GraphQLResult) => {
          if (update.data) {
            handler(update.data as T);
            return;
          }
          console.warn('Subscription update failure', JSON.stringify(request.query), update.errors);
        },
        request.query,
        request.variables,
        request.operationName
      );
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

    // the first attempt is handled synchronously, retries occur in the background until success or the handle is closed
    protected query<T>(
      request: GraphQLParams,
      handler: (result: T) => void,
      maxRetries?: number
    ): Promise<ListenerHandle> {
      if (!graphQL.connected) graphQL.open();

      const tracker = RetryTracker.create(START_DELAY, MAX_DELAY, maxRetries ?? MAX_RETRIES);
      tracker.close();
      graphQL.sendQuery(request.query, request.variables).then(
        (resolved) => {
          if (resolved.data) {
            handler(resolved.data as T);
            return Promise.resolve();
          }
          if (!tracker.shouldRetry) return Promise.resolve();
          this.retryQuery(request, handler, tracker);
        },
        (rejected) => {
          if (!tracker.shouldRetry) return Promise.resolve();
          this.retryQuery(request, handler, tracker);
        }
      );
      return Promise.resolve(tracker);
    }

    private async retryQuery<T>(
      request: GraphQLParams,
      handler: (result: T) => void,
      tracker: RetryTracker
    ): Promise<void> {
      do {
        console.warn('Query failure', request);
        await tracker.onFailed();
        const result = await graphQL.sendQuery(request.query, request.variables);
        if (result.data) {
          handler(result.data as T);
          return;
        }
      } while (tracker.shouldRetry);
    }
  };
}
