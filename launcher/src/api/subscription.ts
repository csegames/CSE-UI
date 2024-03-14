/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DocumentNode, print } from 'graphql/index.js';
import { Dictionary } from '../lib/Dictionary';
import { ListenerHandle } from '../lib/ListenerHandle';
import { ReconnectingWebSocket, WebSocketOptions, WebSocketRequirements } from '../lib/ReconnectingWebSocket';

interface SubscriptionRequirements extends WebSocketRequirements {
  getInitPayload: () => Dictionary<string>;
}

interface SubscriptionOptions extends WebSocketOptions {
  useKeepAlive: boolean;
}

export type SubscriptionSettings = SubscriptionRequirements & Partial<SubscriptionOptions>;

export interface Subscriptions {
  add<DataType>(subscription: SubscriptionRequest, onData: OnData<DataType>): ListenerHandle;
  onDisconnect(callback: () => void): ListenerHandle;
  onInitialize(callback: () => void): ListenerHandle;
}

export class Subscriptions {
  public static create(settings: SubscriptionSettings): Subscriptions {
    return new SubscriptionManager(settings);
  }
}

export interface SubscriptionRequest {
  query: DocumentNode;
  variables?: Dictionary<any>;
  operationName?: string;
}

export interface SubscriptionResult<T> {
  data: T;
  ok: boolean;
  errors?: Error[];
}

export interface OnData<T> {
  (result: SubscriptionResult<T>): void;
}

// Follows Apollo GraphQL Protocol -- https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md

const GQL_KEEPALIVE_TIMEOUT_MS = 15 * 1000;

type ClientMessageType = 'connection_init' | 'start' | 'stop' | 'connection_terminate';
interface ClientMessage {
  type: ClientMessageType;
  id?: string;
  payload?: any;
}

type ServerMessageType = 'connection_ack' | 'connection_error' | 'ka' | 'data' | 'error' | 'complete';
interface ServerMessage {
  type: ServerMessageType;
  id?: string;
  payload?: any;
}

interface SubscriptionBinding {
  id: string;
  start: ClientMessage;
  onData: OnData<any>;
}

const defaultSubscriptionOpts: SubscriptionOptions = {
  protocols: [],
  verboseLogging: false,
  useKeepAlive: true // set false for server debugging with breakpoints
};

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
  console.log(out.join(' '));
}

// used before logging these messages, which might contain auth information
function sanitize(op: ClientMessage): ClientMessage {
  if (!op.payload || !op.payload.hasOwnProperty('token')) {
    return op;
  }
  const clean: Dictionary<any> = {};
  for (const key of Object.keys(op.payload)) {
    clean[key] = key == 'token' ? '[REDACTED]' : op.payload[key];
  }
  return { type: op.type, id: op.id, payload: clean };
}

class SubscriptionManager implements Subscriptions {
  private socket: ReconnectingWebSocket;
  private getInitPayload: () => Dictionary<string>;
  private subscriptions: Dictionary<SubscriptionBinding> = {};
  private initCallbacks: Dictionary<() => void> = {};
  private discCallbacks: Dictionary<() => void> = {};
  private messageQueue: ClientMessage[] = [];
  private idCounter: number = 0;

  private log = logToConsole;
  private debugLog = logToDevNull;
  private onKeepAlive = ignoreKeepAlive;
  private keepAliveHandle: number = 0;

  constructor(settings: SubscriptionSettings) {
    const opts = this.updateOptions(settings);
    this.socket = new ReconnectingWebSocket(opts);
    this.socket.onOpen = this.init.bind(this);
    this.socket.onMessage = this.messageHandler.bind(this);
    this.socket.onError = this.errorHandler.bind(this);
    this.socket.onClose = this.closeHandler.bind(this);
    this.getInitPayload = opts.getInitPayload.bind(this);
  }

  public updateOptions = (settings: SubscriptionSettings): SubscriptionSettings => {
    const opts = { ...defaultSubscriptionOpts, ...settings };
    this.debugLog = opts.verboseLogging ? logToConsole : logToDevNull;
    if (opts.useKeepAlive) {
      this.onKeepAlive = this.resetOnTimeout;
    } else {
      this.clearKeepAlive();
      this.onKeepAlive = ignoreKeepAlive;
    }
    return opts;
  };

  public onDisconnect(callback: () => void): ListenerHandle {
    const id = this.idCounter++;
    this.discCallbacks[id] = callback;
    const subs = this;
    return {
      close() {
        delete subs.discCallbacks[id];
      }
    };
  }

  public onInitialize(callback: () => void): ListenerHandle {
    const id = this.idCounter++;
    this.initCallbacks[id] = callback;
    const subs = this;
    return {
      close() {
        delete subs.initCallbacks[id];
      }
    };
  }

  public add<T>(subscription: SubscriptionRequest, onData: OnData<T>): ListenerHandle {
    const id = `gql-subscription-${subscription.operationName || 'operation'}-${this.idCounter++}`;

    const start: ClientMessage = {
      payload: {
        query: print(subscription.query),
        variables: subscription.variables
      },
      id,
      type: 'start'
    };

    this.log(`subscribe => ${id}`);

    this.subscriptions[id] = {
      id,
      start,
      onData
    };

    this.sendOrQueue(start);
    const subs = this;
    return {
      close() {
        subs.remove(id);
      }
    };
  }

  private remove(id: string) {
    this.log(`remove => ${id}`);

    if (this.subscriptions[id]) {
      delete this.subscriptions[id];
    }

    this.sendOrQueue({
      id,
      type: 'stop'
    });
  }

  private init(e: Event) {
    // explicitly subscribe anything that hasn't been stopped yet
    for (const key in this.subscriptions) {
      const sub = this.subscriptions[key];
      if (this.messageQueue.indexOf(sub.start) === -1) {
        this.messageQueue.push(sub.start);
      }
    }

    this.log(`Sending ${this.messageQueue.length + 1} message${this.messageQueue.length ? 's' : ''} from init`);
    this.send({
      type: 'connection_init',
      payload: this.getInitPayload()
    });

    if (this.messageQueue.length > 0) {
      for (const op of this.messageQueue) {
        this.send(op);
      }
      this.messageQueue = [];
    }

    for (const callback of Object.values(this.initCallbacks)) {
      callback();
    }
  }

  private messageHandler(e: MessageEvent) {
    try {
      const op = JSON.parse(e.data) as ServerMessage;
      this.debugLog('recv <= ', op);
      switch (op.type) {
        case 'connection_ack': {
          this.log('Ack');
          break;
        }
        case 'data': {
          const subscription = this.subscriptions[op.id];
          if (subscription && subscription.onData) {
            const result = {
              data: this.parseData(op),
              ok: op.payload.errors === null,
              errors: op.payload.errors
            };
            subscription.onData(result);
          }
          break;
        }
        case 'ka': {
          this.onKeepAlive();
          break;
        }
        case 'connection_error': {
          this.errorHandler(
            new ErrorEvent('GQL_CONNECTION_ERROR', {
              error: new Error('GQL_CONNECTION_ERROR'),
              message: JSON.stringify(op.payload)
            })
          );
          break;
        }
        case 'complete': {
          const subscription = this.subscriptions[op.id];
          if (subscription) {
            delete this.subscriptions[op.id];
          }
          break;
        }
        case 'error': {
          const subscription = this.subscriptions[op.id];
          if (subscription) {
            const entry = Object.entries(subscription).find((entry) => {
              return entry[0] === op.id;
            });
            if (entry && entry[1].onError) {
              entry[1].onError(
                new ErrorEvent('GQL_ERROR', {
                  error: new Error(op.payload),
                  message: op.payload
                })
              );
            }
          }
          break;
        }
      }
    } catch (e) {
      this.log('Failed to parse message json', e.data);
    }
  }

  private parseData(op: ServerMessage) {
    if (!op.payload || !op.payload.data) {
      return null;
    }
    try {
      return JSON.parse(op.payload.data).data;
    } catch (e) {
      this.errorHandler(
        new ErrorEvent('GQL_DATA', {
          error: e,
          message: JSON.stringify(op.payload)
        })
      );
      return null;
    }
  }

  private errorHandler(e: ErrorEvent): void {
    if (e.message) {
      console.error(`Sub Error ${e.message}`);
    }
  }

  private closeHandler(e: CloseEvent): void {
    this.clearKeepAlive();
    for (const callback of Object.values(this.discCallbacks)) {
      callback();
    }
  }

  private send(op: ClientMessage): void {
    this.debugLog(`send => `, sanitize(op));
    this.socket.send(JSON.stringify(op));
  }

  private sendOrQueue(op: ClientMessage): void {
    if (this.socket.isOpen) {
      this.send(op);
    } else {
      this.debugLog(`queue = `, sanitize(op));
      this.messageQueue.push(op);
    }
  }

  private resetOnTimeout(): void {
    this.clearKeepAlive();
    this.keepAliveHandle = window.setTimeout(() => {
      this.log('GQL KeepAlive Timeout');
      this.socket.refresh();
    }, GQL_KEEPALIVE_TIMEOUT_MS);
  }

  private clearKeepAlive(): void {
    if (this.keepAliveHandle === 0) {
      return;
    }
    window.clearTimeout(this.keepAliveHandle);
    this.keepAliveHandle = 0;
  }
}
