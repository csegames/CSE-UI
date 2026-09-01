// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentNode, print } from 'graphql';
import { ListenerHandle } from '../_baseGame/listenerHandle';
import { RetryTracker } from '../_baseGame/utils/retryTracker';
import { GraphQLServiceOptions } from './GraphQLServiceOptions';
import { GraphQLResult } from './GraphQLResult';
import { ClientMessage, parseServerMessage, SubscribeMessage } from './Protocol';

const START_DELAY = 1000;
const MAX_DELAY = 60000;
const COHERENT_SAFETY_NET_TIMEOUT = 5000;
const SUBPROTOCOL = 'graphql-transport-ws';

export type GraphQLSubscriptionCallback = (next: GraphQLResult) => void;

export interface GraphQLService {
  readonly server: URL | null;
  readonly connected: boolean;
  sendQuery(query: DocumentNode, variables?: Record<string, unknown>): Promise<GraphQLResult>;
  addSubscription(
    callback: GraphQLSubscriptionCallback,
    query: DocumentNode,
    variables?: Record<string, unknown>,
    operationName?: string
  ): Promise<ListenerHandle>;
  onConnectedChanged(listener: (connected: boolean) => void): Promise<ListenerHandle>;
  open(): Promise<void>;
  reset(): Promise<void>;
  close(): Promise<void>;
}

// 95%-100% of specified to avoid clumping
function jitter(input: number) {
  return input * ((Math.random() + 19) / 20);
}

function getKeepAlive(payload?: Record<string, unknown> | null): number | null {
  return payload != null && typeof payload === 'object' && typeof payload['keepAlive'] === 'number'
    ? payload['keepAlive']
    : null;
}

export class GraphQLService {
  static create(options: GraphQLServiceOptions): GraphQLService {
    return new GraphQLServiceImpl(options);
  }
}

class GraphQLServiceImpl implements GraphQLService {
  private tracker = RetryTracker.create(START_DELAY, MAX_DELAY);
  private socket: WebSocket | null = null;
  private serviceUrl: URL | null = null;
  private hadConnection: boolean = false;
  private connectTimeoutHandle = 0;
  private keepAliveHandle = 0;
  private keepAliveSeconds: number | null = null;
  private nextSubscriptionID = 1;
  private subscriptions: SubscribeMessage[] = []; // to be replayed on reconnection
  private callbacks: Map<string, GraphQLSubscriptionCallback> = new Map();
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private queue: ClientMessage[] = [];

  constructor(readonly options: GraphQLServiceOptions) {}

  public get server() {
    return this.serviceUrl;
  }

  public get connected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public onConnectedChanged(listener: (connected: boolean) => void): Promise<ListenerHandle> {
    this.connectionListeners.push(listener);
    return Promise.resolve({
      close: () => {
        const idx = this.connectionListeners.indexOf(listener);
        if (idx >= 0) this.connectionListeners.splice(idx, 1);
      }
    });
  }

  public sendQuery(query: DocumentNode, variables?: Record<string, unknown>): Promise<GraphQLResult> {
    const id = `query-${this.nextSubscriptionID++}`;

    let deferredResolve: (value: GraphQLResult) => void;
    const promise = new Promise<GraphQLResult>((resolve) => {
      deferredResolve = resolve;
    });
    this.callbacks.set(id, (next) => {
      deferredResolve(next);
    });

    this.enqueue({
      id,
      type: 'subscribe',
      payload: {
        query: print(query),
        variables
      }
    });
    return promise;
  }

  public async addSubscription(
    callback: GraphQLSubscriptionCallback,
    query: DocumentNode,
    variables?: Record<string, unknown>,
    operationName?: string
  ) {
    const id = `${operationName || 'sub'}-${this.nextSubscriptionID++}`;
    this.callbacks.set(id, callback);
    const msg: SubscribeMessage = {
      id,
      type: 'subscribe',
      payload: {
        query: print(query),
        variables
      }
    };
    this.subscriptions.push(msg);
    await this.enqueue(msg);
    const { callbacks, subscriptions } = this;
    const enqueue = this.enqueue.bind(this);
    return {
      close() {
        callbacks.delete(id);
        const idx = subscriptions.indexOf(msg);
        if (idx !== -1) subscriptions.splice(idx, 1);
        enqueue({ id, type: 'complete' });
      }
    };
  }

  public open(): Promise<void> {
    return this.retryConnect(false);
  }

  public async reset(): Promise<void> {
    await this.close();
    await this.retryConnect(true); // purge existing queries
  }

  public async close(): Promise<void> {
    window.clearTimeout(this.connectTimeoutHandle);
    window.clearTimeout(this.keepAliveHandle);
    this.connectTimeoutHandle = 0;
    this.keepAliveHandle = 0;
    if (this.socket === null) return;
    switch (this.socket.readyState) {
      case WebSocket.CLOSED:
        this.closed(new CloseEvent('closed', { code: 1005, reason: 'connection attempt timed out', wasClean: false }));
        return;
      case WebSocket.CLOSING:
        return;
    }
    console.log(`Disconnecting from ${this.socketUrl}`);
    try {
      this.socket.close();
    } catch (e) {
      this.errored(new ErrorEvent('error', { error: e }));
    }
  }

  private async enqueue(data: ClientMessage): Promise<void> {
    try {
      if (this.socket?.readyState == WebSocket.OPEN) {
        this.send(data);
      } else {
        this.queue.push(data);
      }
    } catch (err) {
      this.errored(new ErrorEvent('error', { error: err }));
    }
  }

  private send(data: ClientMessage): void {
    this.socket?.send(JSON.stringify(data));
  }

  private async retryConnect(isRetry: boolean = false): Promise<void> {
    if (isRetry) {
      this.queue = [];
      for (const [id, callback] of Array.from(this.callbacks)) {
        // subscriptions will auto-resume if we ever get a successful connection
        if (this.subscriptions.find((s) => s.id == id)) continue;

        this.callbacks.delete(id);
        callback({ errors: [{ name: 'ServerConnectionReset', message: 'Could not connect to server' }] });
      }
    }
    if (this.tracker.shouldRetry) {
      await this.tracker.onFailed();
      await this.connect(isRetry);
    }
  }

  private async connect(isRetry: boolean = false) {
    this.serviceUrl = await this.options.getServiceUrl();
    const url = this.socketUrl;
    if (url === null) {
      console.error(`GraphQL service URL has not been set`);
      return;
    }
    const token = this.options.getBearerToken();
    if (token === null) {
      console.error('GraphQL authorization token has not been set');
      return;
    }

    switch (this.socket?.readyState ?? WebSocket.CLOSED) {
      case WebSocket.OPEN:
        return;
      case WebSocket.CONNECTING:
        if (!isRetry) {
          return;
        }
        this.close();
        break;
      case WebSocket.CLOSED:
        break;
      case WebSocket.CLOSING:
        this.socket = null;
        break;
    }

    console.log(`Connecting to ${url} for [${SUBPROTOCOL}]`);

    try {
      window.clearTimeout(this.connectTimeoutHandle);
      this.connectTimeoutHandle = window.setTimeout(this.retryConnect.bind(this, true), COHERENT_SAFETY_NET_TIMEOUT);
      window.clearTimeout(this.keepAliveHandle);
      this.keepAliveHandle = 0;
      const socket = new WebSocket(url, SUBPROTOCOL);
      this.socket = socket;
      socket.binaryType = 'arraybuffer';
      socket.onerror = this.errored.bind(this);
      socket.onmessage = this.message.bind(this);
      socket.onclose = this.closed.bind(this);
      socket.onopen = this.opened.bind(this, token);
    } catch (e) {
      this.errored(new ErrorEvent('error', { error: e }));
    }
  }

  private get socketUrl(): URL | null {
    if (!this.serviceUrl) return null;
    let url = new URL(this.serviceUrl);
    switch (url.protocol) {
      case 'http:':
        url.protocol = 'ws:';
        break;
      case 'https:':
        url.protocol = 'wss:';
        break;
    }
    url.pathname = '/graphql';
    return url;
  }

  private errored(e: Event): void {
    console.error('socket error:', e);
  }

  private message(e: MessageEvent): void {
    try {
      var response = parseServerMessage(e.data);
      if (!response) return;

      switch (response.type) {
        case 'connection_ack':
          this.keepAliveSeconds = getKeepAlive(response.payload);
          if (this.keepAliveSeconds) {
            this.keepAliveHandle = window.setTimeout(
              this.sendKeepAlive.bind(this),
              jitter(this.keepAliveSeconds * 1000)
            );
          }
          break;
        case 'ping':
          this.enqueue({ type: 'pong', payload: response.payload });
          break;
        case 'pong':
          break;
        case 'next': {
          const callback = this.callbacks.get(response.id);
          if (callback) {
            callback(response.payload);
          }
          break;
        }
        case 'error': {
          const callback = this.callbacks.get(response.id);
          if (callback) {
            callback({ errors: response.payload });
            this.callbacks.delete(response.id);
          }
          break;
        }
        case 'complete':
          {
            this.callbacks.delete(response.id);
          }
          break;
      }
    } catch (e) {
      this.errored(new ErrorEvent('error', { error: e }));
    }
  }

  private closed(e: CloseEvent): void {
    const hadConnection = this.hadConnection;
    this.hadConnection = false;
    if (this.socket) {
      this.socket.onerror = () => {};
      this.socket.onclose = () => {};
      this.socket.onopen = () => {};
      this.socket.onmessage = () => {};
    }
    this.socket = null;
    let reconnecting = false;
    switch (
      e.code // https://www.iana.org/assignments/websocket/websocket.xhtml
    ) {
      case 1002:
      case 1003:
      case 3003:
      // graphql subprotocol codes
      case 4401:
      case 4403:
        break;
      default:
        reconnecting = true;
        this.retryConnect(false);
        break;
    }
    this.serviceUrl = null;
    if (hadConnection) {
      for (const listener of this.connectionListeners) {
        listener(false);
      }
    }
  }

  private opened(token: string, e: Event): void {
    window.clearTimeout(this.connectTimeoutHandle);
    this.connectTimeoutHandle = 0;
    this.tracker = RetryTracker.create(START_DELAY, MAX_DELAY);
    this.send({ type: 'connection_init', payload: { token: this.options.getBearerToken() } });
    this.hadConnection = true;
    const queued = this.queue;
    this.queue = [];
    for (const msg of queued) {
      this.enqueue(msg);
    }
    // restore connections if any were active before a disconnection
    for (const msg of this.subscriptions) {
      if (!queued.includes(msg)) this.enqueue(msg);
    }
    for (const listener of this.connectionListeners) {
      listener(true);
    }
  }

  private sendKeepAlive(): void {
    this.send({ type: 'ping' });
    if (this.keepAliveSeconds) {
      this.keepAliveHandle = window.setTimeout(this.sendKeepAlive.bind(this), jitter(this.keepAliveSeconds * 1000));
    } else {
      this.keepAliveHandle = 0;
    }
  }
}
