/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import { ReconnectingWebSocket, WebSocketOptions } from '../utils/ReconnectingWebSocket';
import { getBooleanEnv } from '../utils/env';
import { print } from 'graphql/index.js';

export interface Options<DataType> extends WebSocketOptions {
  // Data to send to the server on connection init
  initPayload: any;
  debug: boolean;
  useKeepAlive: boolean;
  onDataReceived: (data: DataType) => void;
  onError: (error: Error) => void;
  onClosed: () => void;
}

export function defaultSubscriptionOpts(): Options<any> {
  return {
    url: () => `${game.webAPIHost}/graphql`.replace(/(http)(s?:\/\/)/, 'ws$2'),
    protocols: 'graphql-ws',
    startReconnectInterval: 500,
    maxReconnectInterval: 4000,
    connectTimeout: 500,
    initPayload: {
      token: game.accessToken,
      characterID: game.characterID,
    },
    debug: getBooleanEnv('CUUI_LIB_DEBUG_GRAPHQL_SUBSCRIPTION', false),
    useKeepAlive: getBooleanEnv('CUUI_LIB_TIMEOUT_GRAPHQL_SUBSCRIPTION', true), // set false for server debugging with breakpoints
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
const GQL_CONNECTION_KEEP_ALIVE = 'ka';
const GQL_DATA = 'data';
const GQL_ERROR = 'error';
const GQL_COMPLETE = 'complete';

const GQL_KEEPALIVE_TIMEOUT_MS = 15 * 1000;

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

function ignoreKeepAlive() {}

function logToDevNull(msg?: any, ...params: any[]) {}
function logToConsole(msg?: any, ...params: any[]) {
  const out: string[] = ['SubscriptionManager:'];
  if (msg) {
    params.unshift(msg);
  }
  for (const param of params) {
    if (typeof param == 'string') {
      out.push(param);
    } else {
      out.push(JSON.stringify(param));
    }
  }
  console.log(out.join(" "));
}

// used before logging these messages, which might contain auth information
function sanitize(op: OperationMessage): OperationMessage {
  if (!op.payload.hasOwnProperty('token'))  {
    return op;
  }
  const clean: Dictionary<any> = {};
  for (const key of Object.keys(op.payload)) {
    clean[key] = key == 'token' ? '[REDACTED]' : op.payload[key];
  }
  return {type: op.type, id: op.id, payload: clean};
}

export class SubscriptionManager {
  private socket: ReconnectingWebSocket;
  private initPayload: Dictionary<any>;
  private subscriptions: Dictionary<SubscriptionHandle> = {};
  private messageQueue: OperationMessage[] = [];
  private idCounter: number = 0;

  private log = logToConsole;
  private debugLog = logToDevNull;
  private onKeepAlive = ignoreKeepAlive;
  private keepAliveHandle: number = 0;
  
  constructor(options: Partial<Options<any>>) {
    const opts =  this.updateOptions(options);
    this.socket = new ReconnectingWebSocket(opts);
    this.socket.onopen = this.init;
    this.socket.onmessage = this.messageHandler;
    this.socket.onerror = this.errorHandler;
    this.initPayload = opts.initPayload;
  }

  public updateOptions = (options: Partial<Options<any>>): Options<any> => {
    const opts =  withDefaults(options, defaultSubscriptionOpts(), true);
    this.debugLog = opts.debug ? logToConsole : logToDevNull;
    if (opts.useKeepAlive) {
      this.onKeepAlive = this.resetOnTimeout;
    } else {
      window.clearTimeout(this.keepAliveHandle);
      this.onKeepAlive = ignoreKeepAlive;
      this.keepAliveHandle = 0;
    }
    return opts;
  }

  public subscribe = <T>(
    subscription: Subscription,
    onData: OnData<T>,
    onError?: OnError): string => {

    const id = `gql-subscription-${subscription.operationName || "operation"}-${this.idCounter++}`;
    const payload = typeof subscription === 'string' || subscription.hasOwnProperty('loc') ? { query: subscription } : subscription;

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

    this.log(`subscribe => ${id}`);

    this.subscriptions[id] = {
      id,
      start,
      onData,
      onError,
    };

    this.sendOrQueue(start);
    return id;
  }

  public stop = (id: string) => {
    this.log(`stop => ${id}`);

    if (this.subscriptions[id]) {
      delete this.subscriptions[id];
    }

    this.sendOrQueue({
      id,
      type: GQL_STOP,
    });
  }

  private init = () => {
    // explicitly subscribe anything that hasn't been stopped yet
    for (const sub of _.values(this.subscriptions)) {
      if (this.messageQueue.indexOf(sub.start) === -1) {
        this.messageQueue.push(sub.start);
      }
    }

    this.log(`Sending ${this.messageQueue.length+1} message${this.messageQueue.length ? 's' : ''} from init`);
    this.send({
      type:GQL_CONNECTION_INIT, 
      payload:this.initPayload
    });

    if (this.messageQueue.length > 0) {
      for (const op of this.messageQueue) {
        this.send(op);
      }
      this.messageQueue = [];
    }
  }

  private messageHandler = (e: MessageEvent) => {
    const op = tryParseJSON(e.data, true) as OperationMessage;
    this.debugLog('recv <= ', op);
    switch (op.type) {
      case GQL_CONNECTION_ACK: {
        this.log('Ack');
        break;
      }
      case GQL_DATA: {
        const subscription = this.subscriptions[op.id];
        if (subscription && subscription.onData) {
          const result = {
            data: this.parseData(op),
            ok: op.payload.errors === null,
            errors: op.payload.errors,
          };
          subscription.onData(result);
        }
        break;
      }
      case GQL_CONNECTION_KEEP_ALIVE: {
        this.onKeepAlive();
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

  private parseData(op: OperationMessage) {
    if (!op.payload || !op.payload.data) {
      return null;
    }
    try {
      return JSON.parse(op.payload.data).data;
    } catch (e) {
      this.errorHandler(new ErrorEvent('GQL_DATA', {
        error: e,
        message: JSON.stringify(op.payload),
      }));
      return null;
    }
  }

  private errorHandler = (e: ErrorEvent) => {
    console.error(`Sub Err: ${JSON.stringify(e)}`);
  }

  private send = (op: OperationMessage) => {
    this.debugLog(`send => `, sanitize(op));
    this.socket.send(JSON.stringify(op));
  }

  private sendOrQueue = (op: OperationMessage) => {
    if (this.socket.isOpen) {
      this.send(op);
    } else {
      this.debugLog(`queue = `, sanitize(op));
      this.messageQueue.push(op);
    }
  }

  private resetOnTimeout = () => {
    window.clearTimeout(this.keepAliveHandle);
    this.keepAliveHandle = window.setTimeout(() => {
      this.log('GQL KeepAlive Timeout');
      this.socket.refresh();
    }, GQL_KEEPALIVE_TIMEOUT_MS);
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
  } else if (options) {
    subscriptionManager.updateOptions(options);
  }

  return {
    id: subscriptionManager.subscribe(subscription, onData, onError),
    subscriptions: subscriptionManager,
  };
}
