/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CSEChat, Room } from './CSEChat';
import Config from './Config';
import EventEmitter from './EventEmitter';

const DEFAULT_ROOM_LIST : string[] = ['_global', '_cube'];

class ChatClient {
  public chat: CSEChat = null;
  public connected: boolean = false;
  public updated: number = 0;
  public errorListener: any = null;
  public config: Config = null;
  public emitter: EventEmitter = new EventEmitter();

  public on(topic: string, handler: (data?: any) => void): any {
    return this.emitter.on(topic, handler);
  }

  public off(id: any): void {
    this.emitter.removeListener(id);
  }

  public connectWithToken(loginToken: string, nick: string = '', rooms: string[] = DEFAULT_ROOM_LIST) {
    if (this.chat) {
      console.warn('ChatClient:connect() called when already connected.');
      return;
    }
    // this._fire('connecting');
    this.connected = false;
    this.updated = 0;
    this.config = new Config('', loginToken, nick);
    this.internalConnect(rooms);
  }

  public connect(
    username: string | (() => string),
    password: string | (() => string),
    nick: string = '',
    rooms: string[] = DEFAULT_ROOM_LIST,
  ): void {
    if (this.chat) {
      console.warn('ChatClient:connect() called when already connected.');
      return;
    }
    // this._fire('connecting');
    this.connected = false;
    this.updated = 0;
    this.config = new Config(username, password, nick);
    this.internalConnect(rooms);
  }

  public disconnect(): void {
    this.internalDisconnect();
    this.internalFire('disconnect');
  }

  public reconnect(rooms: string[]): void {
    this.internalConnect(rooms);
  }

  public getNick() : string {
    return this.chat.client.jid._local;
  }

  public getStoredRooms(): string[] {
    const storedRooms = localStorage.getItem('CSE_CHAT_Stored_channels');
    if (storedRooms != null) {
      return storedRooms.split(',');
    }
    return [];
  }
  public removeFromStoredRooms(room: string): void {
    const storedRooms = this.getStoredRooms();
    const idx = storedRooms.indexOf(room);
    if (idx !== -1) {
      storedRooms.splice(idx, 1);
    }
    this.setStoredRooms(storedRooms);
  }
  public addToStoredRooms(room: string): void {
    const storedRooms = this.getStoredRooms();
    const idx = storedRooms.indexOf(room);
    if (idx !== -1) {
      return;
    }
    storedRooms.push(room);
    this.setStoredRooms(storedRooms);
  }
  public setStoredRooms(rooms: string[]): void {
    if (rooms.length > 0) {
      localStorage.setItem('CSE_CHAT_Stored_channels', rooms.toString());
    } else {
      localStorage.removeItem('CSE_CHAT_Stored_channels');
    }
  }

  public sendMessageToRoom(message: string, roomName: string): void {
    if (!this.chat || !this.connected) {
      console.warn('ChatClient:sendMessageToRoom() called when not connected.');
      return;
    }
    this.chat.sendMessageToRoom(message, roomName);
  }

  // ChatAction.sendMessageToUser(...)
  public sendMessageToUser(message: string, userName: string): void {
    if (!this.chat || !this.connected) {
      console.warn('ChatClient:sendMessageToUser() called when not connected.');
      return;
    }
    this.chat.sendMessageToUser(message, userName);
  }

  public joinRoom(roomName: string): void {
    if (!this.chat) {
      console.warn('ChatClient:joinRoom() called when not connected.');
      return;
    }
    this.chat.joinRoom(roomName + this.chat.config.serviceAddress);

    this.addToStoredRooms(roomName);
  }

  public leaveRoom(roomName: string): void {
    if (!this.chat) {
      console.warn('ChatClient:leaveRoom() called when not connected.');
      return;
    }
    this.chat.leaveRoom(roomName + this.chat.config.serviceAddress);

    this.removeFromStoredRooms(roomName);
  }

  public getRooms() : void {
    if (!this.chat) {
      console.warn('ChatClient:leaveRoom() called when not connected.');
      return;
    }
    this.chat.getRooms();
  }

  private internalConnect(rooms: string[]): void {

    if (this.chat) {
      console.warn('ChatClient:connect() called when already connected.');
      return;
    }

    this.chat = new CSEChat(this.config);

    this.errorListener = this.chat.on('error', (err: any) => this.internalOnError(err));
    this.chat.once('online', () => this.internalOnline(rooms));
    this.chat.connect();
  }

  private internalOnline(rooms: string[]): void {
    this.connected = true;
    this.internalInitEvents();
    this.internalFire('connect');
    let newRooms = rooms;
    newRooms = newRooms.concat(this.getStoredRooms());
    const joining : any = {};
    newRooms.forEach((room: string) => {
      if (!joining[room]) {
        joining[room] = true;
        this.chat.joinRoom(room + this.config.serviceAddress);
      }
    });
  }

  private internalOnError(err:any) {
    return;
    // const connected: boolean = this.connected;
    // this._disconnect();
    // if (!connected) {
    //   // if not connected when we got the error, connect failed
    //   this._fire('connectfailed', err);
    // } else {
    //   // if connected when got the error, signal we were disconnected
    //   this._fire('disconnect');
    // }
  }

  private internalInitEvents(): void {
    this.chat.on('presence', (presence: any) => this.internalFire('presence', presence));
    this.chat.on('message', (message: any) => this.internalFire('message', message));
    this.chat.on('groupmessage', (message: any) => this.internalFire('groupmessage', message));
    this.chat.on('ping', (ping: any) => this.internalFire('ping', ping));
    this.chat.on('rooms', (rooms: Room[]) => this.internalFire('rooms', rooms));
  }

  private internalDisconnect(): void {
    if (this.chat) {
      this.chat.removeListener(this.errorListener);
      this.chat.disconnect();
      this.chat = null;
    }
    this.connected = false;
  }

  private internalFire(topic: string, data?: any): void {
    this.emitter.emit(topic, data);
    this.updated = Date.now();
  }
}

export default ChatClient;
