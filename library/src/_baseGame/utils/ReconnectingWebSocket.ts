/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createEventEmitter, EventEmitter } from './EventEmitter';
import * as Raven from 'raven-js';
import { getBooleanEnv } from './env';
import { isWebSocketUrl } from './urlUtils';

export interface WebSocketOptions {
  // WebSocket url, default '/graphql'
  url: () => string;

  // WebSocket protocols, default value 'graphql-ws'
  protocols: string | string[];

  // Timeout in ms to wait between connection attempts, default 1000
  // set to -1 to disable reconnects
  startReconnectInterval: number;
  maxReconnectInterval: number;

  // How long to wait, in ms, before deciding that a connection attempt has
  // timed out, default 2000
  connectTimeout: number;

  // If true, logs actions taken, default false
  debug: boolean;

  onopen: (event: Event) => any;
  onclose: (event: CloseEvent) => any;
  onmessage: (event: MessageEvent) => any;
  onerror: (event: ErrorEvent) => any;
}

export const defaultWebSocketOptions: WebSocketOptions = {
  url: () => "/chat",
  protocols: "",
  startReconnectInterval: 10,
  maxReconnectInterval: 4000,
  connectTimeout: 100,
  debug: getBooleanEnv('CUUI_LIB_DEBUG_WEB_SOCKET', false),
  onopen: function(event: Event) {},
  onclose: function(event: CloseEvent) {},
  onmessage: function(event: MessageEvent) {},
  onerror: function(event: ErrorEvent) {}
};

export class ReconnectingWebSocket {
  private messageCount: number;
  private reconnectInterval: number;
  private startReconnectInterval: number;
  private maxReconnectInterval: number;
  private connectTimeoutInterval: number;
  private url: () => string;
  private protocols: string | string[];
  private socket: WebSocket;
  private state: number;
  private connectTimeoutHandle: number;
  private debug: boolean;
  private reconnecting: boolean;
  private wantConnect: boolean;
  private eventEmitter: EventEmitter;

  public get isOpen() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  public get readyState() {
    return this.socket ? this.socket.readyState : WebSocket.CONNECTING;
  }

  constructor(options?: Partial<WebSocketOptions>) {
    if (options && options.debug) {
      this.log(`constructor => ${options && JSON.stringify(options)}`);
    }
    const opts = withDefaults(options, defaultWebSocketOptions);
    this.url = opts.url;
    this.protocols = opts.protocols;
    this.connectTimeoutInterval = opts.connectTimeout;
    this.reconnectInterval = opts.startReconnectInterval;
    this.startReconnectInterval = opts.startReconnectInterval;
    this.maxReconnectInterval = opts.maxReconnectInterval;
    this.debug = opts.debug;

    const urlString = this.url();
    if (!urlString || !isWebSocketUrl(urlString)) {
      console.error('Trying to connect to a websocket using an invalid url: ' + this.url());
      return;
    }

    this.connect();
    this.eventEmitter = createEventEmitter();
  }

  public set onopen(callback: (event: Event) => any) {
    this.eventEmitter.on('open', callback);
  }
  private _onopen = (event: Event) => {
    this.eventEmitter.emit('open', event);
  }

  public set onclose(callback: (event: CloseEvent) => any) {
    this.eventEmitter.on('closed', callback);
  }
  private _onclose = (event: CloseEvent) => {
    this.eventEmitter.emit('closed', event);
  }

  public set onmessage(callback: (event: MessageEvent) => any) {
    this.eventEmitter.on('message', callback);
  }
  private _onmessage = (event: MessageEvent) => {
    this.eventEmitter.emit('message', event);
  }

  public set onerror(callback: (event: ErrorEvent) => any) {
    this.eventEmitter.on('error', callback);
  }
  private _onerror = (event: ErrorEvent) => {
    this.eventEmitter.emit('error', event);
  }

  public send = (data: any) => {
    if (this.debug) {
      this.log(`send => ${JSON.stringify(data)}`);
    }
    try {
      this.socket.send(data);
    } catch (err) {
      this.error(err);
    }
  };

  public close = () => {
    this.log("WS Explicitly closed??");
    if (!this.socket) {
      console.error('Tried to close a ReconnectingWebSocket that didnt have a socket to close');
      return;
    }

    this.wantConnect = false;
    this.socket.close();
    this.socket = null;
  };

  public refresh = () => {
    this.log("WARNING: REFRESHING WS CONN");
    this.socket.close();
    this.socket = null;
    this.connect();
  };

  private connect = () => {
    this.reconnecting = false;
    this.wantConnect = true;
    this.log(`connect => url: '${this.url()}', protocols: '${this.protocols}'`);

    try {
      this.socket = new WebSocket(this.url(), this.protocols);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onerror = this.error;
      this.socket.onmessage = this.message;
      this.socket.onclose = this.closed;
      this.socket.onopen = this.open;
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      if (!this.isOpen && this.wantConnect) {
        console.warn(
          "failed to connect to WebSocket within " +
            this.connectTimeoutInterval +
            " ms. Reconnecting in " +
            this.reconnectInterval +
            " ms. Url: " + this.url()
        );
        this.reconnect();
      }
    }, this.connectTimeoutInterval);
  };

  private reconnect = () => {
    if (!this.wantConnect || this.reconnecting) return;
    this.reconnecting = true;
    console.log(`Attempting to reconnect to WS ${this.url()}`)

    try {
      this.socket.close();
    } catch {
    }
    this.socket = null;
    if (this.reconnectInterval < 0) return;
    this.reconnectInterval = Math.min(this.reconnectInterval * 2, this.maxReconnectInterval);
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  };

  private message = (e: MessageEvent) => {
    if (this.debug) {
      this.log(`message => ${JSON.stringify(e)}`);
    }
    if (e.data) {
      ++this.messageCount;
      this._onmessage(e);
    }
    return false;
  };

  private error = (e: any) => {
    Raven.captureException(e);
    console.warn(`WS connection error on ${this.url()}`)
    if (!e) return;
    this._onerror(e);
    this.reconnect();
  };

  private open = (e: Event) => {
    console.log(`WS connection opened to ${this.url()}`)
    clearTimeout(this.connectTimeoutHandle);
    this.reconnectInterval = this.startReconnectInterval;
    this._onopen(e);
  };

  private closed = (e: CloseEvent) => {
    console.log(`WS connection closed at ${this.url()}`)
    this.reconnect();
    this._onclose(e);
  };

  private log = (message: string) => {
    console.log(`ReconnectingWebSocket | ${message}`);
  };
}
