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
  reconnectInterval: number;

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
  reconnectInterval: 500,
  connectTimeout: 5000,
  debug: getBooleanEnv('CUUI_LIB_DEBUG_WEB_SOCKET', false),
  onopen: function(event: Event) {},
  onclose: function(event: CloseEvent) {},
  onmessage: function(event: MessageEvent) {},
  onerror: function(event: ErrorEvent) {}
};

export class ReconnectingWebSocket {
  private messageCount: number;
  private reconnectInterval: number;
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
    this.reconnectInterval = opts.reconnectInterval;
    this.debug = opts.debug;

    const urlString = this.url();
    if (!urlString || !isWebSocketUrl(urlString)) {
      console.error('Trying to connect to a websocket using and invalid url: ' + this.url());
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
    if (this.debug) {
      this.log("close");
    }
    this.wantConnect = false;
    this.socket && this.socket.close();
  };

  public refresh = () => {
    if (this.debug) {
      this.log("refresh");
    }
    this.socket.close();
    this.connect();
  };

  private connect = () => {
    this.reconnecting = false;
    this.wantConnect = true;
    if (this.debug) {
      this.log(`connect => url: '${this.url()}', protocols: '${this.protocols}'`);
    }

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
        console.log(
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

    if (this.debug) {
      this.log("reconnecting");
    }

    this.socket = null;
    if (this.reconnectInterval < 0) return;
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
    if (this.debug) {
      this.log(`error => ${JSON.stringify(e)}`);
    }
    if (!e) return;
    this._onerror(e);
    this.reconnect();
  };

  private open = (e: Event) => {
    if (this.debug) {
      this.log("connection open");
    }
    clearTimeout(this.connectTimeoutHandle);
    this._onopen(e);
  };

  private closed = (e: CloseEvent) => {
    if (this.debug) {
      this.log("connection closed");
    }
    this.reconnect();
    this._onclose(e);
  };

  private log = (message: string) => {
    console.log(`ReconnectingWebSocket | ${message}`);
  };
}
