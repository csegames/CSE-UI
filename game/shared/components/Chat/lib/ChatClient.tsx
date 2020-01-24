/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { findIndex } from 'lodash';
import { CSEChat } from '@csegames/library/lib/_baseGame/chat/CSEChat';
import EventEmitter from './EventEmitter';
import '@csegames/library/lib/_baseGame/chat/chatProtoTypes';

interface ChatOptions {
  url: string;
  characterID: string;
  characterName: string;
  shard: number;
  getAccessToken: () => string;
}

// tslint:disable
export class ChatClient {
  public chat: CSEChat = null;
  public updated: number = 0;
  public errorListener: any = null;
  public emitter: EventEmitter = new EventEmitter();
  
  private characterName: string;
  private connectOptions: ChatOptions | (() => ChatOptions);

  public get connected() {
    return this.chat && this.chat.connected;
  }

  public on(topic: string, handler: (data?: any) => void): any {
    return this.emitter.on(topic, handler);
  }

  public off(id: any): void {
    this.emitter.removeListener(id);
  }

  public connect(options: ChatOptions | (() => ChatOptions)) {
    if (this.chat) {
      console.warn('ChatClient:connect() called when already connected.');
      return;
    }
    this.updated = 0;
    this.connectOptions = options;
    const provided = typeof options === 'function' ? options() : options;
    const chatOpts = {
      url: provided.url,
      characterID: provided.characterID,
      token: provided.getAccessToken,
    }
    
    this.chat = new CSEChat();
    this.chat.initialize(chatOpts);

    this.chat.onConnected(this.onConnected.bind(this));
    this.chat.onError((err) => {
      console.error(`ChatClient | Error: ${err.message}`);
    });

    this.chat.connect();
  }

  private onConnected() {
    this.internalInitEvents();
    var rooms = this.getStoredRooms();
    rooms.forEach(room => {
      this.chat.joinRoom(room);
    })
  }

  private internalInitEvents(): void {

    this.chat.onChatMessage(msg => {
      switch (msg.type) {
        case ChatMessage_MessageTypes.Direct:
          this.internalFire('message', {
            type: 4,
            roomName: msg.targetID,
            sender: {
              sender: msg.senderName,
              isCSE: msg.senderFlag === ChatMessage_SenderFlag.CSE,
            },
            message: msg.content,
            time: new Date(),
          });
          return;
        case ChatMessage_MessageTypes.Room:
          this.internalFire('message', {
            type: 3,
            roomName: msg.targetID,
            sender: {
              sender: msg.senderName,
              isCSE: msg.senderFlag === ChatMessage_SenderFlag.CSE,
            },
            message: msg.content,
            time: new Date(),
          })
          return;
        case ChatMessage_MessageTypes.Announcement:
          this.internalFire('message', {
            type: -1,
            message: [msg.content],
          })
          return;
      }
    });

    this.chat.onDirectory(directory => {
      directory.rooms.forEach((r: { roomID: string }) => this.joinRoom(r.roomID));
      this.internalFire('rooms', directory.rooms);
    });

    // this.chat.on('presence', (presence: any) => this.internalFire('presence', presence));
    // this.chat.on('message', (message: any) => this.internalFire('message', message));
    // this.chat.on('groupmessage', (message: any) => this.internalFire('groupmessage', message));
    // this.chat.on('ping', (ping: any) => this.internalFire('ping', ping));
    // this.chat.on('rooms', (rooms: Room[]) => this.internalFire('rooms', rooms));
  }

  public disconnect(): void {
    this.internalFire('disconnect');
    if (this.chat) {
      this.chat.disconnect();
      this.chat = null;
    }
  }

  public reconnect(rooms: string[]): void {
    this.connect(this.connectOptions);
  }

  public getNick(): string {
    return this.characterName;
  }


  public getStoredRooms(): string[] {
    try {
      const storedRooms = localStorage.getItem('CSE_CHAT_Rooms');
      if (storedRooms) {
        return JSON.parse(storedRooms);
      }
      return [];
    } catch (err) {
      // Just reset stored channels, there was some bad/old data in there.
      localStorage.setItem('CSE_CHAT_Rooms', '');
      return [];
    }
  }
  public removeFromStoredRooms(roomId: string): void {
    const storedRooms = this.getStoredRooms();
    const idx = findIndex(storedRooms, _room => _room === roomId);
    if (idx !== -1) {
      storedRooms.splice(idx, 1);
    }
    this.setStoredRooms(storedRooms);
  }
  public addToStoredRooms(roomId: string): void {
    const storedRooms = this.getStoredRooms();
    const idx = findIndex(storedRooms, _room => _room === roomId);
    if (idx !== -1) {
      return;
    }
    storedRooms.push(roomId);
    this.setStoredRooms(storedRooms);
  }
  public setStoredRooms(rooms: string[]): void {
    if (rooms.length > 0) {
      localStorage.setItem('CSE_CHAT_Stored_channels', JSON.stringify(rooms));
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
    this.chat.sendDirectMessage(message, null, userName);
  }

  public joinRoom(roomId: string): void {
    if (!this.chat) {
      console.warn('ChatClient:joinRoom() called when not connected.');
      return;
    }
    this.chat.joinRoom(roomId);
    this.addToStoredRooms(roomId);
  }

  public leaveRoom(roomId: string): void {
    if (!this.chat) {
      console.warn('ChatClient:leaveRoom() called when not connected.');
      return;
    }
    this.chat.leaveRoom(roomId);

    this.removeFromStoredRooms(roomId);
  }

  public getRooms(): void {
    if (!this.chat) {
      console.warn('ChatClient:getRooms() called when not connected.');
      return;
    }
    this.chat.requestDirectory();
  }

  private internalFire(topic: string, data?: any): void {
    this.emitter.emit(topic, data);
    this.updated = Date.now();
  }
}

export default ChatClient;
