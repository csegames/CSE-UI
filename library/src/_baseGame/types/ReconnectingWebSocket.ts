/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EventEmitter } from './EventEmitter';
import * as Raven from 'raven-js';
import { getBooleanEnv } from '../utils/env';
import { isWebSocketUrl } from '../utils/urlUtils';
import { RetryTracker } from '../utils/retryTracker';

const COHERENT_SAFETY_NET_TIMEOUT = 30000; // give coherent 30 seconds to connect, then reset the attempt because they silently stop trying
const START_DELAY = 250;
const MAX_DELAY = 10000;
const MAX_RETRIES: number = undefined;

export interface WebSocketRequirements {
  getUrl: () => string;
}

export interface WebSocketOptions {
  protocols: string[];
  verboseLogging: boolean;
}

export type WebSocketSettings = WebSocketRequirements & Partial<WebSocketOptions>;

const defaultWebSocketOptions: WebSocketOptions = {
  protocols: [],
  verboseLogging: getBooleanEnv('CUUI_LIB_DEBUG_WEB_SOCKET', false)
};

export class ReconnectingWebSocket {
  private settings: WebSocketSettings;
  private events: EventEmitter;
  private socket: WebSocket;
  private connectTimeoutHandle: number;
  private tracker: RetryTracker;

  public get isOpen() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  constructor(settings: WebSocketSettings) {
    this.settings = { ...defaultWebSocketOptions, ...settings };
    this.events = new EventEmitter(this.debugLog.bind(this));
    this.tracker = RetryTracker.create(START_DELAY, MAX_DELAY, MAX_RETRIES);

    const urlString = this.settings.getUrl();
    if (!isWebSocketUrl(urlString)) {
      console.error('Trying to connect to a websocket using an invalid url: ' + this.settings.getUrl());
      return;
    }

    this.connect();
  }

  public set onOpen(callback: (event: Event) => any) {
    this.events.on('opened', callback);
  }

  public set onClose(callback: (event: CloseEvent) => any) {
    this.events.on('closed', callback);
  }

  public set onMessage(callback: (event: MessageEvent) => any) {
    this.events.on('message', callback);
  }

  public set onError(callback: (event: ErrorEvent) => any) {
    this.events.on('errored', callback);
  }

  public send(data: any) {
    this.debugLog('send', data);
    try {
      this.socket.send(data);
    } catch (err) {
      this.errored(err);
    }
  }

  public refresh() {
    this.retryConnect(true);
  }

  private async retryConnect(isRetry: boolean = false): Promise<void> {
    if (this.tracker.shouldRetry) {
      await this.tracker.onFailed();
      this.connect(isRetry);
    }
  }

  // isRetry is a workaround for coherent bug where underlying socket stops trying to connect
  private connect(isRetry: boolean = false) {
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

    this.log(`Connecting to ${this.settings.getUrl()} for [${this.settings.protocols?.join(',')}]`);

    try {
      window.clearTimeout(this.connectTimeoutHandle);
      this.connectTimeoutHandle = window.setTimeout(this.retryConnect.bind(this, true), COHERENT_SAFETY_NET_TIMEOUT);
      this.socket = new WebSocket(this.settings.getUrl(), this.settings.protocols);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onerror = this.errored.bind(this);
      this.socket.onmessage = this.message.bind(this);
      this.socket.onclose = this.closed.bind(this);
      this.socket.onopen = this.opened.bind(this);
    } catch (e) {
      console.error(e);
    }
  }

  public close() {
    var status = this.socket?.readyState ?? WebSocket.CLOSED;
    window.clearTimeout(this.connectTimeoutHandle);
    this.connectTimeoutHandle = 0;
    if (status === WebSocket.CLOSED) {
      return;
    }
    this.log(`Disconnecting from ${this.settings.getUrl()}`);
    this.socket.onerror = () => {};
    this.socket.onclose = () => {};
    this.socket.onopen = () => {};
    this.socket.onmessage = () => {};
    if (status !== WebSocket.CLOSING) {
      try {
        this.socket.close();
      } catch (e) {
        console.error(e);
      }
    }
    this.socket = null;
    this.events.trigger('closed', { code: 1005, reason: 'connection attempt timed out', wasClean: false });
  }

  private message(e: MessageEvent) {
    this.debugLog(`message => ${JSON.stringify(e)}`);
    if (e.data) {
      this.events.trigger('message', e);
    }
    return false;
  }

  private async errored(e: ErrorEvent): Promise<void> {
    Raven.captureException(e);
    this.events.trigger('errored', e);
  }

  private opened(e: Event): void {
    console.log('opened');
    window.clearTimeout(this.connectTimeoutHandle);
    this.connectTimeoutHandle = 0;
    this.tracker = RetryTracker.create(START_DELAY, MAX_DELAY, MAX_RETRIES);
    this.events.trigger('opened', e);
  }

  private async closed(e: CloseEvent): Promise<void> {
    this.socket.onerror = () => {};
    this.socket.onclose = () => {};
    this.socket.onopen = () => {};
    this.socket.onmessage = () => {};
    this.socket = null;
    switch (
      e.code // https://www.iana.org/assignments/websocket/websocket.xhtml
    ) {
      case 1002:
      case 1003:
      case 3003:
        break;
      default:
        this.retryConnect(false);
        break;
    }
    this.events.trigger('closed', e);
  }

  private debugLog(...params: any[]): void {
    if (!this.settings.verboseLogging) return;
    this.log(params);
  }

  private log(...params: any[]): void {
    console.log('ReconnectingWebSocket:', ...params);
  }
}
