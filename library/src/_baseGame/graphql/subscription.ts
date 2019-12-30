/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import { ReconnectingWebSocket, WebSocketOptions } from '../utils/ReconnectingWebSocket';
import { getBooleanEnv } from '../utils/env';
import { isCompositeType } from 'graphql';
import { generateID } from 'redux-typed-modules';
import { print } from 'graphql/index.js';

export interface Options<DataType> extends WebSocketOptions {
  // Data to send to the server on connection init
  initPayload: any;
  debug: boolean;
  onDataReceived: (data: DataType) => void;
  onError: (error: Error) => void;
  onClosed: () => void;
}

export function defaultSubscriptionOpts(): Options<any> {
  return {
    url: () => `${game.webAPIHost}/graphql`.replace(/(http)(s?:\/\/)/, 'ws$2'),
    protocols: 'graphql-ws',
    reconnectInterval: 15000,
    connectTimeout: 5000,
    initPayload: {
      shardID: game.shardID,
      token: game.accessToken,
    },
    debug: getBooleanEnv('CUUI_LIB_DEBUG_GRAPHQL_SUBSCRIPTION', false),
    onDataReceived: data => console.log(data),
    onError: e => console.error(e),
    onClosed: () => null,
    onopen: function(event: Event) {},
    onclose: function(event: CloseEvent) {},
    onmessage: function(event: MessageEvent) {},
    onerror: function(event: ErrorEvent) {},
  };
}


// Follows Apollo GraphQL Protocol -- https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md

// Game -> Server
const GQL_CONNECTION_INIT = 'connection_init';
const GQL_START = 'start';
const GQL_STOP = 'stop';
const GQL_CONNECTION_TERMINATE = 'connection_terminate';

// Server -> Game
const GQL_CONNECTION_ACK = 'connection_ack';
const GQL_CONNECTION_ERROR = 'connection_error';
// NOTE: The keep alive message type does not follow the standard due to connection optimizations
const GQL_CONNECTION_KEEP_ALIVE = 'ka';
const GQL_DATA = 'data';
const GQL_ERROR = 'error';
const GQL_COMPLETE = 'complete';

export interface OperationMessage {
  type: string;
  id?: string;
  payload?: any;
}

export interface SubscriptionResult<T> {
  data: T;
  ok: boolean;
  errors?: Error[];
}

export interface OnData<T> {
  (result: SubscriptionResult<T>): void;
}

export type OnError = (e: ErrorEvent) => void;

export interface SubscriptionHandle {
  id: string;
  start: OperationMessage;
  onError: OnError;
  onData: OnData<any>;
}

export interface Subscription {
  query: string;
  variables?: Dictionary<any>;
  operationName?: string;
}

export const defaultSubscription: Subscription = {
  operationName: null,
  query: '{}',
  variables: null,
};

function getFrameIdentifier(frame: OperationMessage | string) {
  const { id, type, payload } = typeof frame === 'string' ? JSON.parse(frame) : frame;
  const operationName = payload && payload.operationName;
  if (operationName) {
    return `${type}${operationName}`;
  }
  return `${type}${id}`;
}

export class SubscriptionManager {
  private socket: ReconnectingWebSocket;
  private initPayload: Dictionary<any>;
  private subscriptions: Dictionary<SubscriptionHandle> = {};
  private keepAliveTimeoutHandler: number;
  private debug: boolean = false;
  private messageQueue: string[] = [];
  private initMessages: string[] = [];
  private idCounter: number = 0;

  constructor(options: Partial<Options<any>>) {
    this.debug = options.debug || false;
    if (this.debug) {
      this.log(`initiating web socket connection on ${options.url} with protocols '${options.protocols}'`);
    }
    const defaultOpts = defaultSubscriptionOpts();
    const opts =  withDefaults(options, defaultOpts);
    this.socket = new ReconnectingWebSocket(opts);
    this.socket.onopen = this.init;
    this.socket.onmessage = this.messageHandler;
    this.socket.onerror = this.errorHandler;
    this.initPayload = opts.initPayload;
  }

  public subscribe = <T>(
    subscription: Subscription,
    onData: OnData<T>,
    onError?: OnError,
    options?: any) => {
    this.initPayload = options.initPayload;
    const id = `gql-subscription-operation-${this.idCounter++}`;

    let payload;
    if (typeof subscription === 'string' || subscription.hasOwnProperty('loc')) {
      payload = { query: subscription };
    } else {
      payload = subscription;
    }
    if (
      typeof payload.query === 'object' &&
      (payload.query.hasOwnProperty('loc') || payload.query.hasOwnProperty('definitions'))
    ) {
      payload.query =  print(payload.query);
    }

    const start = {
      payload,
      id,
      type: GQL_START,
    };

    if (this.debug) {
      this.log(`subscribe => ${JSON.stringify(start)}`);
    }

    this.subscriptions[id] = {
      id,
      start,
      onData,
      onError,
    };

    this.send(start);
    return id;
  }

  public stop = (id: string) => {
    if (this.debug) {
      this.log(`stop => ${id}`);
    }

    if (this.subscriptions[id]) {
      delete this.subscriptions[id];
    }

    this.send({
      id,
      type: GQL_STOP,
    });
  }

  private init = () => {
    if (this.debug) {
      this.log('init');
    }

    this.socket.send(JSON.stringify({
      type: GQL_CONNECTION_INIT,
      payload: this.initPayload,
    }));
    if (this.messageQueue.length > 0) {
      this.messageQueue.forEach((m) => {
        this.socket.send(m);
        this.initMessages.push(m);
      });
      this.messageQueue = [];
    }
  }

  private messageHandler = (e: MessageEvent) => {
    const op = JSON.parse(e.data) as OperationMessage;
    if (this.debug) {
      this.log(`messageHandler => op message: ${JSON.stringify(op)}`);
    }
    switch (op.type) {
      case GQL_CONNECTION_ACK: {
        // Use lodash for version
        _.values(this.subscriptions).forEach((s) => {
          // Check to see if the message has already been added to the messageQueue
          const inMessageQueue = _.findIndex(this.messageQueue, (message: string) => {
            return getFrameIdentifier(message) === getFrameIdentifier(s.start);
          }) !== -1;
          // Check to see if the start message has already been sent.
          const inInitMessages = _.findIndex(this.initMessages, (message: string) => {
            return getFrameIdentifier(message) === getFrameIdentifier(s.start);
          }) !== -1;
          if (!inMessageQueue && !inInitMessages) {
            this.send(s.start);
          }
        });
        break;
      }
      case GQL_DATA: {
        const subscription = this.subscriptions[op.id];
        if (subscription && subscription.onData) {
          let data = null;
          try {
            data = JSON.parse(op.payload.data).data;
          } catch (e) {
            console.error('GraphQL Subscription Parse Error', e);
          }
          const result = {
            data,
            ok: op.payload.errors === null,
            errors: op.payload.errors,
          };
          subscription.onData(result);
        }
        break;
      }
      case GQL_CONNECTION_KEEP_ALIVE: {
        clearTimeout(this.keepAliveTimeoutHandler);
        this.keepAliveTimeoutHandler = window.setTimeout(() => {
          this.socket.refresh();
        }, 5000);
        this.send({
          type: GQL_CONNECTION_KEEP_ALIVE,
        });
        break;
      }
      case GQL_CONNECTION_ERROR: {
        this.errorHandler(new ErrorEvent('GQL_CONNECTION_ERROR', {
          error: new Error('GQL_CONNECTION_ERROR'),
          message: JSON.stringify(op.payload),
        }));
        break;
      }
      case GQL_COMPLETE: {
        const subscription = this.subscriptions[op.id];
        if (subscription) {
          if (subscription.onError) {
            const message = `SubscriptionManager | GQL_COMPLETE received for id ${op.id} without acknowledged stop request`;
            subscription.onError(new ErrorEvent('GQL_COMPLETE', {
              message,
              error: new Error(message),
            }));
          }
          delete this.subscriptions[op.id];
        }
        break;
      }
      case GQL_ERROR: {
        const subscription = this.subscriptions[op.id];
        if (subscription && subscription[op.id].onError) {
          subscription[op.id].onError(new ErrorEvent('GQL_ERROR', {
            error: new Error(op.payload),
            message: op.payload,
          }));
        }
        break;
      }
    }
  }

  private errorHandler = (e: ErrorEvent) => {
    console.error(e);
  }

  private send = (op: OperationMessage) => {
    if (this.debug) {
      this.log(`send => op message: ${JSON.stringify(op)}`);
    }
    if (this.socket.isOpen) {
      this.socket.send(JSON.stringify(op));
    } else {
      this.messageQueue.push(JSON.stringify(op));
      if (this.debug) {
        this.log('op message queued due to socket not open');
      }
    }
  }

  private log = (...data: any[]) => {
    console.log(`SubscriptionManager`, ...data);
  }
}


// GLOBAL SINGLE INSTANCE
let subscriptionManager: SubscriptionManager = null;
export function subscribe<DataType>(
  subscription: Subscription,
  onData: OnData<DataType>,
  options?: Partial<Options<DataType>>,
  onError?: OnError,
) {

  if (!(window as any).WebSocket) {
    throw new Error('WebSockets not supported by this browser');
  }

  if (subscriptionManager === null) {
    subscriptionManager = new SubscriptionManager(options);
  }

  return {
    id: subscriptionManager.subscribe(subscription, onData, onError, options),
    subscriptions: subscriptionManager,
  };
}
