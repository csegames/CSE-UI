// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { getCharacterID } from '../_baseGame/utils/characterUtils';
import { RetryTracker } from '../_baseGame/utils/retryTracker';
import { ChatServiceListener } from './ChatServiceListener';
import { ChatServiceOptions } from './ChatServiceOptions';
import { IChatRequest, MessageTypes, ReceivedResponse, RoomRecord, SUBPROTOCOL } from './generated/uce-chat-v3';
import { parseResponse } from './ParseResponse';

const START_DELAY = 1000;
const MAX_DELAY = 60000;
const COHERENT_SAFETY_NET_TIMEOUT = 30000;

export interface ChatService {
  readonly server: URL | null;
  readonly serverTime: number | null;
  readonly connected: boolean;
  readonly rooms: RoomRecord[];
  addListener(listener: ChatServiceListener): Promise<void>;
  removeListener(listener: ChatServiceListener): Promise<void>;
  sendWhisper(playerName: string, text: string): Promise<void>;
  sendMessage(room: RoomRecord, text: string): Promise<void>;
  open(): Promise<void>;
  reset(): Promise<void>;
  close(): Promise<void>;
}

// 95%-100% of specified to avoid clumping
function jitter(input: number) {
  return input * ((Math.random() + 19) / 20);
}

export class ChatService {
  static create(options: ChatServiceOptions): ChatService {
    return new ChatServiceImpl(options);
  }
}

class ChatServiceImpl implements ChatService {
  private tracker = RetryTracker.create(START_DELAY, MAX_DELAY);
  private socket: WebSocket | null = null;
  private serviceUrl: URL | null = null;
  private serverTimeOffset: number | null = null;
  private hadConnection: boolean = false;
  private connectTimeoutHandle = 0;
  private keepAliveHandle = 0;
  private keepAliveSeconds = 0;
  private nextMessageID = 1;
  private scrollback: ReceivedResponse[] = [];
  private joinedRooms: RoomRecord[] = [];
  private supportedTags: string[] = [];
  private supportedScopes: string[] = [];
  private listeners: ChatServiceListener[] = [];
  private queue: IChatRequest[] = [];

  constructor(readonly options: ChatServiceOptions) {}

  public get server() {
    return this.serviceUrl;
  }

  public get serverTime(): number | null {
    return this.serverTimeOffset ? Date.now() + this.serverTimeOffset : null;
  }

  public get rooms() {
    return this.joinedRooms.slice();
  }

  public get tags() {
    return this.supportedTags.slice();
  }

  public get scopes() {
    return this.supportedScopes.slice();
  }

  public get connected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public async addListener(listener: ChatServiceListener): Promise<void> {
    if (this.listeners.includes(listener)) return;
    if (this.socket?.readyState === WebSocket.OPEN) {
      listener.onConnected();
    }
    for (const room of this.rooms) {
      listener.onJoined(room);
    }
    for (const received of this.scrollback) {
      if (this.rooms.find((r) => r.id === received.room.id) !== undefined) {
        listener.onReceived(received);
      }
    }
    this.listeners.push(listener);
  }

  public async removeListener(listener: ChatServiceListener): Promise<void> {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public sendWhisper(playerName: string, text: string): Promise<void> {
    return this.enqueue({
      type: MessageTypes.Send,
      id: this.nextMessageID++,
      scope: 'whisper',
      target: playerName,
      text
    });
  }

  public sendMessage(room: RoomRecord, text: string): Promise<void> {
    return this.enqueue({
      type: MessageTypes.Send,
      id: this.nextMessageID++,
      scope: room.scope,
      target: room.id,
      text
    });
  }

  public open(): Promise<void> {
    return this.retryConnect(false);
  }

  public async reset(): Promise<void> {
    await this.close();
    await this.retryConnect(false);
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

  private async enqueue(data: IChatRequest): Promise<void> {
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

  private send(data: IChatRequest): void {
    this.socket?.send(JSON.stringify(data));
  }

  private async retryConnect(isRetry: boolean = false): Promise<void> {
    if (this.tracker.shouldRetry) {
      await this.tracker.onFailed();
      await this.connect(isRetry);
    }
  }

  // isRetry is a workaround for coherent bug where underlying socket stops trying to connect
  private async connect(isRetry: boolean = false) {
    this.serviceUrl = await this.options.getServiceUrl();
    const url = this.socketUrl;
    if (url === null) {
      console.error(`Chat service URL has not been set`);
      return;
    }

    const token = this.options.getBearerToken();
    if (token === null) {
      console.error('Chat authorization token has not been set');
      return;
    }
    if (getCharacterID(token) === null) {
      console.error('No character has been set');
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
    url.pathname = '/socket';
    return url;
  }

  private errored(e: Event): void {
    console.log('socket error:', e);
  }

  private message(e: MessageEvent): void {
    try {
      var response = parseResponse(e.data);
      if (!response) return;

      switch (response.type) {
        case MessageTypes.Connected:
          this.serverTimeOffset = response.serverTime - Date.now();
          this.keepAliveSeconds = response.keepAliveSeconds;
          this.keepAliveHandle = window.setTimeout(
            this.sendKeepAlive.bind(this),
            jitter(response.keepAliveSeconds * 1000)
          );
          for (const listener of this.listeners) {
            listener.onConnected();
          }
          break;
        case MessageTypes.Errored:
          for (const listener of this.listeners) {
            listener.onError(response);
          }
          break;
        case MessageTypes.Listing:
          // note : should only be necessary if we've somehow lost context,
          // provided for completeness
          this.updateRooms(response.joinedRooms);
          break;
        case MessageTypes.Left:
          {
            const room = response.room;
            const idx = this.rooms.findIndex((r) => r.id === room.id && r.scope === room.scope);
            if (idx >= 0) {
              this.joinedRooms.splice(idx, 1);
              for (const listener of this.listeners) {
                listener.onLeft(room);
              }
            }
          }
          break;
        case MessageTypes.Joined:
          {
            const room = response.room;
            const idx = this.joinedRooms.findIndex((r) => r.id === room.id && r.scope === room.scope);
            if (idx < 0) {
              this.joinedRooms.push(room);
              for (const listener of this.listeners) {
                listener.onJoined(room);
              }
            }
          }
          break;
        case MessageTypes.Ping:
          this.send({ type: 'pong', id: response.id });
          break;
        case MessageTypes.Pong:
          break; // no-op
        case MessageTypes.Received:
          if (this.options.scrollbackSize > 0) {
            this.scrollback.push(response);
            if (this.scrollback.length == this.options.scrollbackSize) {
              this.scrollback.shift();
            }
          }
          for (const listener of this.listeners) {
            listener.onReceived(response);
          }
          break;
      }
    } catch (e) {
      this.errored(new ErrorEvent('error', { error: e }));
    }
  }

  private updateRooms(rooms: RoomRecord[]): void {
    var prev = this.joinedRooms;
    this.joinedRooms = rooms;
    for (const room of prev) {
      if (rooms.find((r) => r.id === room.id && r.scope === room.scope) === undefined) {
        for (const listener of this.listeners) {
          listener.onLeft(room);
        }
      }
    }
    for (const room of rooms) {
      if (prev.find((r) => r.id === room.id && r.scope === room.scope) === undefined) {
        for (const listener of this.listeners) {
          listener.onJoined(room);
        }
      }
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
      // uce subprotocol codes
      case 4401:
      case 4403:
        break;
      default:
        reconnecting = true;
        this.retryConnect(false);
        break;
    }
    const rooms = this.joinedRooms;
    this.joinedRooms = [];
    if (hadConnection) {
      for (const listener of this.listeners) {
        for (const room of rooms) {
          listener.onLeft(room);
        }
      }
      for (const listener of this.listeners) {
        listener.onDisconnected(reconnecting);
      }
    } else {
      for (const listener of this.listeners) {
        listener.onConnectionFailure(reconnecting);
      }
    }
    this.serviceUrl = null;
  }

  private opened(token: string, e: Event): void {
    window.clearTimeout(this.connectTimeoutHandle);
    this.connectTimeoutHandle = 0;
    this.send({ id: this.nextMessageID++, token, type: 'auth' });
    this.tracker = RetryTracker.create(START_DELAY, MAX_DELAY);
    this.hadConnection = true;
    const queued = this.queue;
    this.queue = [];
    for (const msg of queued) {
      this.enqueue(msg);
    }
  }

  private sendKeepAlive(): void {
    this.send({ type: 'ping', id: this.nextMessageID++ });
    this.keepAliveHandle = window.setTimeout(this.sendKeepAlive.bind(this), jitter(this.keepAliveSeconds * 1000));
  }
}
