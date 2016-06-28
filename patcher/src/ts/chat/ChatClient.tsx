/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CSEChat, Room } from './CSEChat';
import Config from './Config';
import messageType from './messageType';
import EventEmitter from '../../../../shared/lib/EventEmitter';
import {patcher} from '../api/PatcherAPI';

const DEFAULT_ROOM_LIST : string[] = ['_global', '_cube'];

class ChatClient {
  chat: CSEChat = null;
  connected: boolean = false;
  updated: number = 0;
  errorListener: any = null;
  config: Config = null;
  emitter: EventEmitter = new EventEmitter();

  private _connect(rooms: string[]): void {

    if (this.chat) {
      console.warn("ChatClient:connect() called when already connected.");
      return;
    }

    this.config.generateResource('patcher');
    this.chat = new CSEChat(this.config);

    this.errorListener = this.chat.on('error', (err: any) => this._onerror(err));
    this.chat.once('online', () => this._online(rooms));
    this.chat.connect();
  }

  private _online(rooms: string[]): void {
    this.connected = true;
    this._initializeEvents();
    this._fire('connect');
    rooms = rooms.concat(this.getStoredRooms());
    const joining : any = {};
    rooms.forEach((room: string) => {
      if (!joining[room]) {
        joining[room] = true;
        this.chat.joinRoom(room + this.config.serviceAddress);
      }
    });
  }

  private _onerror(err:any) {
    const connected: boolean = this.connected;
    this._disconnect();
    if (!connected) {
      // if not connected when we got the error, connect failed
      this._fire('connectfailed', err);
    } else {
      // if connected when got the error, signal we were disconnected
      this._fire('disconnect');
    }
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

  public connect(
    username: string | (() => string),
    password: string | (() => string),
    nick: string = "",
    rooms: string[] = DEFAULT_ROOM_LIST
  ): void {
    if (this.chat) {
      console.warn("ChatClient:connect() called when already connected.");
      return;
    }
    // this._fire("connecting");
    this.connected = false;
    this.updated = 0;
    this.config = new Config(username, password, nick);
    this._connect(rooms);
  }

  public disconnect(): void {
    this._disconnect();
    this._fire('disconnect');
  }

  public reconnect(rooms: string[]): void {
    this._connect(rooms);
  }

  public getNick() : string {
    return this.chat.config.getNick();
  }


  public getStoredRooms(): string[] {
     var storedRooms = localStorage.getItem("CSE_PATCHER_Stored_channels");
     if (storedRooms != null) {
        return storedRooms.split(",");
     }
     return [];
  }
  public removeFromStoredRooms(room: string): void {
      var storedRooms = this.getStoredRooms();
      var idx = storedRooms.indexOf(room);
      if (idx != -1) {
        storedRooms.splice(idx, 1);
      }
      this.setStoredRooms(storedRooms);
  }
  public addToStoredRooms(room: string): void {
      var storedRooms = this.getStoredRooms();
      var idx = storedRooms.indexOf(room);
      if (idx != -1){
        return;
      }
      storedRooms.push(room);
      this.setStoredRooms(storedRooms);
  }
  public setStoredRooms(rooms: string[]): void {
      if (rooms.length > 0){
        localStorage.setItem("CSE_PATCHER_Stored_channels", rooms.toString());
      } else {
        localStorage.removeItem("CSE_PATCHER_Stored_channels");
      }
  }



  public sendMessageToRoom(message: string, roomName: string): void {
    if (!this.chat || !this.connected) {
      console.warn("ChatClient:sendMessageToRoom() called when not connected.");
      return;
    }
    this.chat.sendMessageToRoom(message, roomName);
  }

  // ChatAction.sendMessageToUser(...)
  public sendMessageToUser(message: string, userName: string): void {
    if (!this.chat || !this.connected) {
      console.warn("ChatClient:sendMessageToUser() called when not connected.");
      return;
    }
    this.chat.sendMessageToUser(message, userName);
  }

  public joinRoom(roomName: string): void {
    if (!this.chat) {
      console.warn("ChatClient:joinRoom() called when not connected.");
      return;
    }
    this.chat.joinRoom(roomName + this.chat.config.serviceAddress);

    this.addToStoredRooms(roomName);
  }

  public leaveRoom(roomName: string): void {
    if (!this.chat) {
      console.warn("ChatClient:leaveRoom() called when not connected.");
      return;
    }
    this.chat.leaveRoom(roomName + this.chat.config.serviceAddress);

    this.removeFromStoredRooms(roomName);
  }

  public getRooms() : void {
    if (!this.chat) {
      console.warn("ChatClient:leaveRoom() called when not connected.");
      return;
    }
    this.chat.getRooms();
  }

};

export default ChatClient;
