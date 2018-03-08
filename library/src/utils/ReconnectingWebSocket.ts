/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { withDefaults } from '../utils/withDefaults';

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
}

export const defaultWebSocketOptions: WebSocketOptions = {
  url: '/ws',
  protocols: '',
  reconnectInterval: 1000,
  connectTimeout: 2000,
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

  public get isOpen() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  public get readyState() {
    return this.socket ? this.socket.readyState : WebSocket.CONNECTING;
  }

  constructor(options?: Partial<WebSocketOptions>) {
    const opts =  withDefaults(options, defaultWebSocketOptions);
    this.url = opts.url;
    this.protocols = opts.protocols;
    this.connectTimeoutInterval = opts.connectTimeout;
    this.reconnectInterval = opts.reconnectInterval;
    this.connect();
  }

  public onopen = function(event: Event) {};
  public onclose = function(event: CloseEvent) {};
  public onmessage = function(event: MessageEvent) {};
  public onerror = function(event: ErrorEvent) {};

  public send = (data: any) => {
    try {
      this.socket.send(data);
    } catch (err) {
      this.error(err);
    }
  }

  public close = () => {
    this.socket.close();
  }

  private connect = () => {
    this.socket = new WebSocket(this.url, this.protocols);
    this.socket.onerror = this.error;
    this.socket.onmessage = this.onmessage;
    this.socket.onclose = this.closed;
    this.socket.onopen = this.open;
    this.connectTimeoutHandle = setTimeout(() => {
      if (!this.isOpen) {
        this.reconnect();
        this.error(new Error('Connection Timeout'));
      }
    }, this.connectTimeoutInterval);
  }

  private reconnect = () => {
    this.socket.close();
    if (this.reconnectInterval < 0) return;
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private message = (e: MessageEvent) => {
    ++this.messageCount;
    this.onmessage(e);
  }

  private error = (e: any) => {
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
    clearTimeout(this.connectTimeoutHandle);
    this.onopen(e);
  }

  private closed = (e: CloseEvent) => {
    this.onclose(e);
  }
}
