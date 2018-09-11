/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { withDefaults } from '../utils/withDefaults';
import { getBooleanEnv } from './env';
import * as Raven from 'raven-js';

export interface WebSocketOptions {
  // WebSocket url, default '/graphql'
  url: string;

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
}

export const defaultWebSocketOptions: WebSocketOptions = {
  url: '/ws',
  protocols: '',
  reconnectInterval: 5000,
  connectTimeout: 2000,
  debug: getBooleanEnv('CUUI_LIB_DEBUG_WEB_SOCKET', false),
};

export class ReconnectingWebSocket {
  private messageCount: number;
  private reconnectInterval: number;
  private connectTimeoutInterval: number;
  private url: string;
  private protocols: string | string[];
  private socket: WebSocket;
  private state: number;
  private connectTimeoutHandle: number;
  private debug: boolean;
  private reconnecting: boolean;

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
    const opts =  withDefaults(options, defaultWebSocketOptions);
    this.url = opts.url;
    this.protocols = opts.protocols;
    this.connectTimeoutInterval = opts.connectTimeout;
    this.reconnectInterval = opts.reconnectInterval;
    this.debug = opts.debug;
    this.connect();
  }

  public onopen = function(event: Event) {};
  public onclose = function(event: CloseEvent) {};
  public onmessage = function(event: MessageEvent) {};
  public onerror = function(event: ErrorEvent) {};

  public send = (data: any) => {
    if (this.debug) {
      this.log(`send => ${JSON.stringify(data)}`);
    }
    try {
      this.socket.send(data);
    } catch (err) {
      this.error(err);
    }
  }

  public close = () => {
    if (this.debug) {
      this.log('close');
    }
    this.socket.close();
  }

  public refresh = () => {
    if (this.debug) {
      this.log('refresh');
    }
    this.socket.close();
    this.connect();
  }

  private connect = () => {
    this.reconnecting = false;
    if (this.debug) {
      this.log(`connect => url: '${this.url}', protocols: '${this.protocols}'`);
    }
    this.socket = new WebSocket(this.url, this.protocols);
    this.socket.onerror = this.error;
    this.socket.onmessage = this.message;
    this.socket.onclose = this.closed;
    this.socket.onopen = this.open;
    this.connectTimeoutHandle = window.setTimeout(() => {
      if (!this.isOpen) {
        this.socket.close();
        this.reconnect();
        this.error(new Error('Connection Timeout'));
      }
    }, this.connectTimeoutInterval);
  }

  private reconnect = () => {
    if (this.reconnecting) return;
    this.reconnecting = true;

    if (this.debug) {
      this.log('reconnecting');
    }

    this.socket.close();
    if (this.reconnectInterval < 0) return;
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private message = (e: MessageEvent) => {
    if (this.debug) {
      this.log(`message => ${JSON.stringify(e)}`);
    }
    if (e.data) {
      ++this.messageCount;
      this.onmessage(e);
    }
    return false;
  }

  private error = (e: any) => {
    Raven.captureException(e);
    if (this.debug) {
      this.log(`error => ${JSON.stringify(e)}`);
    }
    if (!e) return;
    switch (e.code) {
      case 'ECONNREFUSED':
        this.reconnect();
        break;
      default:
        this.onerror(e);
        break;
    }
  }

  private open = (e: Event) => {
    if (this.debug) {
      this.log('connection open');
    }
    clearTimeout(this.connectTimeoutHandle);
    this.onopen(e);
  }

  private closed = (e: CloseEvent) => {
    if (this.debug) {
      this.log('connection closed');
    }
    this.reconnect();
    this.onclose(e);
  }

  private log = (message: string) => {
    console.log(`ReconnectingWebSocket | ${message}`);
  }
}
