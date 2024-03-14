/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { RootState } from './store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { GraphQLQueryRequest, query } from '@csegames/library/dist/_baseGame/graphql/query';
import { queryConf, subsConf, webConf } from '../dataSources/networkConfiguration';
import { RetryTracker } from '@csegames/library/dist/_baseGame/utils/retryTracker';
import {
  Subscriptions,
  SubscriptionRequest,
  SubscriptionResult
} from '@csegames/library/dist/_baseGame/graphql/subscription';
import { InitTopic, setInitialized } from './initializationSlice';
import { RequestConfig, RequestResult } from '@csegames/library/dist/_baseGame/types/Request';

const START_DELAY = 250;
const MAX_DELAY = 10000;
const MAX_RETRIES: number = undefined;

const subs = Subscriptions.create(subsConf());

interface ReactProps {
  onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void;
}

interface InjectedProps {
  dispatch?: Dispatch;
  reduxState?: RootState;
}

type Props = ReactProps & InjectedProps;

class RootStateListener extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return <></>;
  }

  componentDidMount() {
    this.props.onReduxUpdate(this.props.reduxState, this.props.dispatch);
  }

  componentDidUpdate() {
    this.props.onReduxUpdate(this.props.reduxState, this.props.dispatch);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    reduxState: state
  };
}

const ReduxStateListener = connect(mapStateToProps)(RootStateListener);

/**
 * This is a base class that provides ready access to dispatch and reduxState.
 * Inheritors should be added to render functions describing their lifecycle,
 * such as inside the "SharedContextProviders' render function for always
 * on connections.
 */
export default abstract class ExternalDataSource<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected dispatch: Dispatch;
  protected reduxState: RootState;
  private handles: ListenerHandle[] = [];
  private isMounted: boolean;

  render() {
    // The thing returned from a connect() call can be rendered, but not directly inherited from.
    // Thus this extra wrapper layer.
    return <ReduxStateListener onReduxUpdate={this.onReduxUpdate.bind(this)} />;
  }

  componentDidMount(): void {
    this.isMounted = true;
    this.bind().then(
      (value) => {
        // if we unmounted before this connection completed, immediately disconnect
        if (this.isMounted) {
          this.handles = value;
        } else {
          for (const handle of value) {
            handle.close();
          }
        }
      },
      (error) => console.error(`network connection failed: ${error}`)
    );
  }

  componentWillUnmount(): void {
    for (const handle of this.handles) {
      handle.close();
    }
    this.handles = [];
    this.isMounted = false;
  }

  protected abstract bind(): Promise<ListenerHandle[]>;

  protected async subscribe<T>(request: SubscriptionRequest, handler: (update: T) => void): Promise<ListenerHandle> {
    return subs.add<T>(request, (update: SubscriptionResult<T>) => {
      if (update.ok && update.data) {
        handler(update.data);
        return;
      }
      console.warn('Subscription update failure', request, update.errors);
    });
  }

  protected onDisconnect(handler: () => void): ListenerHandle {
    return subs.onDisconnect(handler);
  }

  protected onInitialize(handler: () => void): ListenerHandle {
    return subs.onInitialize(handler);
  }

  // note : all calls should be converted to queries as time permits
  // the first attempt is handled synchronously, retries occur in the background until success or the handle is closed
  protected async call<T>(
    request: (config: RequestConfig) => Promise<RequestResult>,
    handler: (result: RequestResult) => void,
    topic?: InitTopic,
    maxRetries?: number
  ): Promise<ListenerHandle> {
    const tracker = RetryTracker.create(START_DELAY, MAX_DELAY, maxRetries ?? MAX_RETRIES);
    const result = await request(webConf);
    if (result.ok && result.data) {
      handler(result);
      if (topic) this.dispatch(setInitialized({ topic, result: true }));
    } else if (tracker.shouldRetry) {
      if (topic) this.dispatch(setInitialized({ topic, result: false }));
      this.retryCall(request, handler, tracker, result.statusText, topic);
    }
    return Promise.resolve(tracker);
  }

  private async retryCall<T>(
    request: (config: RequestConfig) => Promise<RequestResult>,
    handler: (result: RequestResult) => void,
    tracker: RetryTracker,
    msg: string,
    topic?: InitTopic
  ): Promise<void> {
    do {
      console.warn('Call failure', msg, topic);
      await tracker.onFailed();
      const result = await request(webConf);
      if (result.ok) {
        handler(result);
        if (topic) this.dispatch(setInitialized({ topic, result: true }));
        return;
      }
    } while (tracker.shouldRetry);
  }

  // the first attempt is handled synchronously, retries occur in the background until success or the handle is closed
  protected async query<T>(
    request: GraphQLQueryRequest,
    handler: (result: T) => void,
    topic?: InitTopic,
    maxRetries?: number
  ): Promise<ListenerHandle> {
    const tracker = RetryTracker.create(START_DELAY, MAX_DELAY, maxRetries ?? MAX_RETRIES);
    const result = await query<T>(request, queryConf);
    if (result.ok && result.data) {
      handler(result.data);
      if (topic) this.dispatch(setInitialized({ topic, result: true }));
    } else if (tracker.shouldRetry) {
      this.retryQuery(request, handler, tracker, result.statusText, topic);
      if (topic) this.dispatch(setInitialized({ topic, result: false }));
    }
    return Promise.resolve(tracker);
  }

  private async retryQuery<T>(
    request: GraphQLQueryRequest,
    handler: (result: T) => void,
    tracker: RetryTracker,
    msg: string,
    topic?: InitTopic
  ): Promise<void> {
    do {
      console.warn('Query failure', request, msg);
      await tracker.onFailed();
      const result = await query<T>(request, queryConf);
      if (result.ok && result.data) {
        handler(result.data);
        if (topic) this.dispatch(setInitialized({ topic, result: true }));
        return;
      }
    } while (tracker.shouldRetry);
  }

  /**
   * Can be overridden in subclasses to give ready access to data change events.
   * Remember to call super.onReduxUpdate or else the base functionality will break!
   * @param reduxState
   * @param dispatch
   */
  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    this.dispatch = dispatch;
    this.reduxState = reduxState;
  }
}
