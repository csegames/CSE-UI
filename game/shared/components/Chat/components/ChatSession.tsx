/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChatMessage, chatType } from './ChatMessage';
import { UserInfo } from './User';
import ChatRoomInfo from './ChatRoomInfo';
import ChatClient from '../lib/ChatClient';
import messageType from '../lib/messageType';
import { chatConfig } from './ChatConfig';
import { chatState } from './ChatState';
import { isArray } from 'util';

export interface ChatOptions {
  url: string;
  characterID: string;
  characterName: string;
  shard: number;
  getAccessToken: () => string;
}

class ChatSession {
  public rooms: ChatRoomInfo[] = [];
  public currentRoom: string = undefined;
  public reconnecting: boolean = false;
  public connected: boolean = false;
  public client: ChatClient = null;
  public me: string = 'me';
  public latency: number;
  public windowActive = true;

  private SCROLLBACK_THRESHOLD: number = 50;
  private SCROLLBACK_PAGESIZE: number = 100;

  constructor() {
    this.onconnect = this.onconnect.bind(this);
    this.onconnectfailed = this.onconnectfailed.bind(this);
    this.onping = this.onping.bind(this);
    this.onchat = this.onchat.bind(this);
    this.ondisconnect = this.ondisconnect.bind(this);
    this.onrooms = this.onrooms.bind(this);

    window.onblur = () => this.windowActive = false;
    window.onfocus = () => {
      this.windowActive = true;
      const room = this.getRoom(this.currentRoom);
      if (room) room.seen();
    };
  }

  public diagnostics = (): void => {
    // const memory : any = (window.performance as any).memory;
    // const now : Date = new Date();
    // console.log(now.toISOString());
    // console.log(
    //   '| Memory Usage: ' + ((((memory.usedJSHeapSize/1024/1024)*100)|0)/100) + "MB"
    //   + ' Active: ' + this.windowActive
    //   + ' Latency: ' + this.latency
    //   + ' Reconnecting: ' + this.reconnecting
    //   + ' Rooms: ' + this.rooms.length
    // );
    // this.rooms.forEach((room: ChatRoomInfo) : void => {
    //   room.diagnostics();
    // });
  }

  public connect(connectOptions: ChatOptions) {
    game.on('systemMessage', (msg: string) => this.onchat({ type: messageType.SYSTEM, message: msg }));
    game.on('combatlog_message', (msg: string) => this.onchat({ type: messageType.COMBAT_LOG, message: msg }));

    this.me = connectOptions.characterName;

    if (!this.client) {
      this.client = new ChatClient();
      this.client.on('connect', this.onconnect);
      this.client.on('connectfailed', this.onconnectfailed);
      this.client.on('ping', this.onping);
      this.client.on('presence', this.onchat);
      this.client.on('message', this.onchat);
      this.client.on('groupmessage', this.onchat);
      this.client.on('disconnect', this.ondisconnect);
      this.client.on('rooms', this.onrooms);
      this.client.connect(connectOptions);
    }
  }

  public onping(ping: any) {
    this.latency = (Date.now() - ping.now);
    game.trigger('chat-session-update', this);
    // this.diagnostics();
  }

  public onconnect(): void {
    chatConfig.setNick(this.me);
    chatState.set('chat', this);
    this.broadcast(new ChatMessage(chatType.SYSTEM, '', '', 'Connected to chat server.'));
    this.connected = true;
    this.reconnecting = false;
  }

  public onconnectfailed() {
    // if failed to connect and we are trying to re-connect, we should
    // retry
    if (this.reconnecting) {
      // connectFailed while reconnecting, try again
      this.reconnect();
    }
  }

  public ondisconnect() {
    this.broadcast(new ChatMessage(chatType.SYSTEM, '', '', 'Disconnected from chat server.'));
    this.reconnect();
  }

  public onchat(args: any): void {
    switch (args.type) {
      case messageType.SYSTEM:
        if (isArray(args.message)) {
          const arrayOfMessages = args.message.map((msg: string) => {
            new ChatMessage(chatType.SYSTEM, 'system', 'system', msg, false, new Date());
          });
          this.recv(arrayOfMessages);
          return;
        }
        this.recv(new ChatMessage(chatType.SYSTEM, 'system', 'system', args.message, false, new Date()));
        break;
      case messageType.COMBAT_LOG:
        if (isArray(args.message)) {
          const arrayOfMessages = args.message.map((msg: string) => {
            return new ChatMessage(chatType.COMBAT, 'combat', '', msg, false, new Date());
          });
          this.recv(arrayOfMessages);
          return;
        }
        this.recv(new ChatMessage(chatType.COMBAT, 'combat', '', args.message, false, new Date()));
        break;
      case messageType.AVAILIBLE:
      case messageType.UNAVAILIBLE:
        this.presence(args.type, new UserInfo(args.roomName, args.sender.sender, args.sender.isCSE));
        break;
      case messageType.MESSAGE_CHAT:
      case messageType.MESSAGE_GROUP:
        this.recv(
          new ChatMessage(
            args.type === messageType.MESSAGE_CHAT ? chatType.PRIVATE : chatType.GROUP,
            args.roomName,
            args.sender.sender,
            args.message,
            args.sender.isCSE,
            args.time,
          ),
        );
        break;
      case messageType.NONE:
        this.recv(new ChatMessage(chatType.SYSTEM, '', '', 'Unrecognised message type ' + args.type));
        break;
    }
  }

  public reconnect() {
    this.reconnecting = true;

    // Build list of rooms to re-connect to
    const rooms: string[] = [];
    for (let i = 0; i < this.rooms.length; i++) {
      rooms.push(this.rooms[i].roomId);
      this.rooms[i].players = 0;
    }
    // Reconnect in 1s
    setTimeout(() => { this.client.reconnect(rooms); }, 10000);
  }

  public simulateDisconnect() {
    this.client.disconnect();
  }

  public getRooms() {
    this.client.getRooms();
  }

  public onrooms(rooms: { name: string; id: string; }[]) {
    if (!this.currentRoom) {
      this.setCurrentRoom(rooms[0].id);
    }
    game.trigger('chat-room-list', rooms);
  }

  // Broadcast a message to all rooms
  public broadcast(message: ChatMessage): void {
    message.type = chatType.BROADCAST;
    // send message to current tab
    const rooms = this.rooms;
    if (rooms.length) {
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].add(message);
      }
      game.trigger('chat-session-update', this);
    } else {
      // TODO: What to do here?
    }
  }

  // Receive a message from a room or user.
  public recv(message: ChatMessage | ChatMessage[]): void {
    if (isArray(message)) {
      message.forEach((m) => {
        // check for a broadcast message (private message sent by "")
        if (m.type === chatType.PRIVATE && m.nick === 'chat.camelotunchained.com/warning') {
          this.broadcast(m);
        } else {
          const room: ChatRoomInfo = this.getRoom(m.roomName);
          room.push(m);  // increments unread
          if (!this.currentRoom) {
            this.currentRoom = m.roomName;
          }
          if (this.windowActive && this.currentRoom == m.roomName) {
            room.seen();
          }
        }
      });
      game.trigger('chat-session-update', this);
      return;
    }
    // check for a broadcast message (private message sent by "")
    if (message.type === chatType.PRIVATE && message.nick === 'chat.camelotunchained.com/warning') {
      this.broadcast(message);
    } else {
      const room = this.getRoom(message.roomName);
      const roomId = room.roomId;

      room.push(message);  // increments unread
      if (!this.currentRoom) {
        this.currentRoom = roomId;
      }
      if (this.windowActive && this.currentRoom === message.roomName) {
        room.seen();
      }
      game.trigger('chat-session-update', this);
    }
  }

  // Deal with presence messages
  public presence(type: number, user: UserInfo): void {
    // find the room this user is in, don't create room unless this is an available presence
    // const roomId = new RoomInfo(user.roomName, chatType.GROUP);
    // const room: ChatRoomInfo = this.getRoom(roomId, type === messageType.AVAILIBLE);
    // if (room) {
    //   // enter or leave
    //   if (type === messageType.AVAILIBLE) {
    //     room.addUser(user);
    //     room.add(new ChatMessage(chatType.AVAILABLE, '', user.name));
    //   } else {
    //     room.removeUser(user);
    //     room.add(new ChatMessage(chatType.UNAVAILABLE, '', user.name));
    //   }

    //   game.trigger('chat-session-update', this);
    // }
  }

  public setCurrentRoom(room: string): void {
    this.currentRoom = room;
    game.trigger('chat-session-update', this);
  }

  public findRoom(roomId: string): ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId && this.rooms[i].roomId === roomId) {
        return this.rooms[i];
      }
    }
  }

  public getRoom(roomId: string, add: boolean = true): ChatRoomInfo {
    let room: ChatRoomInfo = this.findRoom(roomId);
    if (!room && add) {
      room = new ChatRoomInfo(
        roomId,
        this.SCROLLBACK_THRESHOLD,
        this.SCROLLBACK_PAGESIZE,
      );
      this.rooms.push(room);
    }
    return room;
  }

  public deleteRoom(roomName: string): ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId == roomName) {
        const room = this.rooms[i];
        this.rooms.splice(i,1);
        return room;
      }
    }
  }

  public sendToRoom(text: string, roomname: string) {
    this.client.sendMessageToRoom(text, roomname);
  }

  public sendToUser(text: string, username: string) {
    this.client.sendMessageToUser(text, username);
  }

  public joinRoom(toJoin: string): void {
    if (!this.findRoom(toJoin)) {
      const room: ChatRoomInfo = this.getRoom(toJoin, true);
      this.client.joinRoom(room.roomId);
      room.seen();
      room.startScrollback();
      this.setCurrentRoom(toJoin);
      return;
    }
    const room: ChatRoomInfo = this.getRoom(toJoin);
    room.seen();
    room.startScrollback();
    this.setCurrentRoom(toJoin);
  }

  public leaveRoom(roomId: string): void {
    const room = this.deleteRoom(roomId);
    this.client.leaveRoom(roomId);
    if (room) {
      if (roomId === this.currentRoom) {
        if (this.rooms.length) {
          this.currentRoom = this.rooms[0].roomId;
          this.rooms[0].seen();
          this.rooms[0].startScrollback();
        } else {
          this.currentRoom = undefined;
        }
      }
      game.trigger('chat-session-update', this);
    }
  }

  // get list of all users from rooms the user has joined
  public getAllUsers(): string[] {
    const allUsers: string[] = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (allUsers.indexOf(user.info.name) < 0) allUsers.push(user.info.name);
      });
    });
    return allUsers;
  }
}

export default ChatSession;
