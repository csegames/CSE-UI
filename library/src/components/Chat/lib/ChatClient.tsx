/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { findIndex } from 'lodash';
import { CSEChat, Room } from './CSEChat';
import Config from './Config';
import EventEmitter from './EventEmitter';
import RoomId from '../components/RoomId';
import { chatType } from '../components/ChatMessage';

const GLOBAL_ROOM_ID = new RoomId('_global', chatType.GROUP);
const CUBE_ROOM_ID = new RoomId('_cube', chatType.GROUP);
const DEFAULT_ROOM_LIST : RoomId[] = [ GLOBAL_ROOM_ID, CUBE_ROOM_ID ];

class ChatClient {
  chat: CSEChat = null;
  connected: boolean = false;
  updated: number = 0;
  errorListener: any = null;
  config: Config = null;
  emitter: EventEmitter = new EventEmitter();

  private _connect(rooms: RoomId[]): void {

    if (this.chat) {
      console.warn("ChatClient:connect() called when already connected.");
      return;
    }

    this.chat = new CSEChat(this.config);

    this.errorListener = this.chat.on('error', (err: any) => this._onerror(err));
    this.chat.once('online', () => this._online(rooms));
    this.chat.connect();
  }

  private _online(rooms: RoomId[]): void {
    this.connected = true;
    this._initializeEvents();
    this._fire('connect');
    rooms = rooms.concat(this.getStoredRooms());
    const joining : any = {};
    rooms.forEach((room: RoomId) => {
      if (!joining[room.name]) {
        joining[room.name] = true;
        this.chat.joinRoom(room.name + this.config.serviceAddress);
      }
    });
  }

  private _onerror(err:any) {
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

  private _initializeEvents(): void {
    this.chat.on('presence', (presence: any) => this._fire('presence', presence));
    this.chat.on('message', (message: any) => this._fire('message', message));
    this.chat.on('groupmessage', (message: any) => this._fire('groupmessage', message));
    this.chat.on('ping', (ping: any) => this._fire('ping', ping));
    this.chat.on('rooms', (rooms: Room[]) => this._fire('rooms', rooms));
  }

  private _disconnect(): void {
    if (this.chat) {
      this.chat.removeListener(this.errorListener);
      this.chat.disconnect();
      this.chat = null;
    }
    this.connected = false;
  }

  private _fire(topic: string, data?: any): void {
    this.emitter.emit(topic, data);
    this.updated = Date.now();
  }

  public on(topic: string, handler: (data?: any) => void): any {
    return this.emitter.on(topic, handler);
  }

  public off(id: any): void {
    this.emitter.removeListener(id);
  }

  public connectWithToken(loginToken: string, nick: string = "", rooms: RoomId[] = DEFAULT_ROOM_LIST) {
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
    nick: string = "",
    rooms: RoomId[] = DEFAULT_ROOM_LIST
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

  public reconnect(rooms: RoomId[]): void {
    this._connect(rooms);
  }

  public getNick() : string {
    return this.chat.client.jid._local;
  }


  public getStoredRooms(): RoomId[] {
    try {
      var storedRooms = localStorage.getItem("CSE_CHAT_Stored_channels");
      if (storedRooms) {
        return JSON.parse(storedRooms);
      }
      return [];
    } catch(err) {
      // Just reset stored channels, there was some bad/old data in there.
      localStorage.setItem("CSE_CHAT_Stored_channels", "");
      return [];
    }
  }
  public removeFromStoredRooms(room: string): void {
      var storedRooms = this.getStoredRooms();
      var idx = findIndex(storedRooms, _room => _room.name === room);
      if (idx != -1) {
        storedRooms.splice(idx, 1);
      }
      this.setStoredRooms(storedRooms);
  }
  public addToStoredRooms(room: RoomId): void {
      var storedRooms = this.getStoredRooms();
      var idx = findIndex(storedRooms, _room => _room.name === room.name);
      if (idx != -1){
        return;
      }
      storedRooms.push(room);
      this.setStoredRooms(storedRooms);
  }
  public setStoredRooms(rooms: RoomId[]): void {
      if (rooms.length > 0){
        localStorage.setItem("CSE_CHAT_Stored_channels", JSON.stringify(rooms));
      } else {
        localStorage.removeItem("CSE_CHAT_Stored_channels");
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

  public joinRoom(roomId: RoomId): void {
    if (!this.chat) {
      console.warn('ChatClient:joinRoom() called when not connected.');
      return;
    }
    this.chat.joinRoom(roomId.name + this.chat.config.serviceAddress);

    this.addToStoredRooms(roomId);
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

  private internalConnect(rooms: RoomId[]): void {

    if (this.chat) {
      console.warn('ChatClient:connect() called when already connected.');
      return;
    }

    this.chat = new CSEChat(this.config);

    this.errorListener = this.chat.on('error', (err: any) => this.internalOnError(err));
    this.chat.once('online', () => this.internalOnline(rooms));
    this.chat.connect();
  }

  private internalOnline(rooms: RoomId[]): void {
    this.connected = true;
    this.internalInitEvents();
    this.internalFire('connect');
    let newRooms = rooms;
    newRooms = newRooms.concat(this.getStoredRooms());
    const joining : any = {};
    newRooms.forEach((room: RoomId) => {
      if (!joining[room.name]) {
        joining[room.name] = true;
        this.chat.joinRoom(room.name + this.config.serviceAddress);
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
