/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { find } from 'lodash';
import { Room } from '../lib/CSEChat';
import { ChatMessage, chatType } from './ChatMessage';
import { UserInfo } from './User';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';
import ChatClient from '../lib/ChatClient';
import messageType from '../lib/messageType';
import { chatConfig } from './ChatConfig';
import { chatState } from './ChatState';
import { events } from '../../../';
import { isArray } from 'util';

interface LoginInfo {
  username?: string;
  password?: string;
  loginToken?: string;
}

class ChatSession {
  public rooms: ChatRoomInfo[] = [];
  public currentRoom: RoomId = undefined;
  public reconnecting: boolean = false;
  public connected: boolean = false;
  public client: ChatClient = null;
  public me: string = 'me';
  public latency: number;
  public windowActive = true;

  private SCROLLBACK_THRESHOLD : number = 50;
  private SCROLLBACK_PAGESIZE : number = 100;

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

  public diagnostics = () : void => {
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

  public connect(username: string, password: string) {
    this.internalConnect({ username, password });
  }

  public connectWithToken(loginToken: string) {
    this.internalConnect({ loginToken });
  }

  public onping(ping: any) {
    this.latency = (Date.now() - ping.now);
    events.fire('chat-session-update', this);
    // this.diagnostics();
  }

  public onconnect(): void {
    // TODO: if no rooms yet, this won't work.
    this.me = this.client.chat.client.jid._local;
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
          const arrayOfMessages = args.message.map(msg =>
            new ChatMessage(chatType.SYSTEM, 'system', 'system', args.message, false, new Date()));
          this.recv(arrayOfMessages);
          return;
        }
        this.recv(new ChatMessage(chatType.SYSTEM, 'system', 'system', args.message, false, new Date()));
        break;
      case messageType.COMBAT_LOG:
        if (isArray(args.message)) {
          const arrayOfMessages = args.message.map(msg =>
            new ChatMessage(chatType.COMBAT, 'combat', '', msg, false, new Date()));
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
    const rooms : RoomId[] = [];
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId.type === chatType.GROUP) {
        rooms.push(this.rooms[i].roomId);
        this.rooms[i].players = 0;
      }
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

  public onrooms(items: Room[]) {
    events.fire('chat-room-list', items);
  }

  // Broadcast a message to all rooms
  public broadcast(message: ChatMessage) : void {
    message.type = chatType.BROADCAST;
    // send message to current tab
    const rooms = this.rooms;
    if (rooms.length) {
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].add(message);
      }
      events.fire('chat-session-update', this);
    } else {
      // TODO: What to do here?
    }
  }

  // Receive a message from a room or user.
  public recv(message: ChatMessage | ChatMessage[]) : void {
    if (isArray(message)) {
      message.forEach((m) => {
        // check for a broadcast message (private message sent by "")
        if (m.type === chatType.PRIVATE && m.nick === 'chat.camelotunchained.com/warning') {
          this.broadcast(m);
        } else {
          const roomId = new RoomId(m.roomName, m.type);
          const room : ChatRoomInfo = this.getRoom(roomId);
          room.push(m);  // increments unread
          if (!this.currentRoom) {
            this.currentRoom = roomId;
          }
          if (this.windowActive && this.currentRoom.same(roomId)) {
            room.seen();
          }
        }
      });
      events.fire('chat-session-update', this);
      return;
    }
    // check for a broadcast message (private message sent by "")
    if (message.type === chatType.PRIVATE && message.nick === 'chat.camelotunchained.com/warning') {
      this.broadcast(message);
    } else {
      const tempRoomId = new RoomId(message.roomName, message.type);
      const room = this.getRoom(tempRoomId);
      const roomId = room.roomId;

      room.push(message);  // increments unread
      if (!this.currentRoom) {
        this.currentRoom = roomId;
      }
      if (this.windowActive && this.currentRoom.same(roomId)) {
        room.seen();
      }
      events.fire('chat-session-update', this);
    }
  }

  // Deal with presence messages
  public presence(type: number, user: UserInfo) : void {
    // find the room this user is in, don't create room unless this is an available presence
    const roomId = new RoomId(user.roomName, chatType.GROUP);
    const room: ChatRoomInfo = this.getRoom(roomId, type === messageType.AVAILIBLE);
    if (room) {
      // enter or leave
      if (type === messageType.AVAILIBLE) {
        room.addUser(user);
        room.add(new ChatMessage(chatType.AVAILABLE, '', user.name));
      } else {
        room.removeUser(user);
        room.add(new ChatMessage(chatType.UNAVAILABLE, '', user.name));
      }
      events.fire('chat-session-update', this);
    }
  }

  public setCurrentRoom(roomId: RoomId) : void {
    this.currentRoom = roomId;
    events.fire('chat-session-update', this);
  }

  public findRoom(roomId: RoomId) : ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId && this.rooms[i].roomId.same(roomId)) {
        return this.rooms[i];
      }
    }
  }

  public getRoom(roomId: RoomId, add: boolean = true) : ChatRoomInfo {
    let room : ChatRoomInfo = this.findRoom(roomId);
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

  public deleteRoom(roomId: RoomId) : ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId.same(roomId)) {
        const room = this.rooms[i];
        this.rooms.splice(i,1);
        return room;
      }
    }
  }

  public send(text: string, roomName: string) : void {
    this.client.sendMessageToRoom(text, roomName);
  }

  public sendMessage(text: string, user: string) : void {
    this.client.sendMessageToUser(text, user);
    const roomId = new RoomId(user, chatType.PRIVATE);
    const message = new ChatMessage(chatType.PRIVATE, user, this.me, text);
    this.getRoom(roomId).add(message);
    this.joinRoom(roomId);
    events.fire('chat-session-update', this);
  }

  public joinRoom(roomId: RoomId) : void {
    if (!this.findRoom(roomId)) {
      const room: ChatRoomInfo = this.getRoom(roomId, true);
      this.client.joinRoom(room.roomId);
      room.seen();
      room.startScrollback();
      this.setCurrentRoom(room.roomId);
      return;
    }
    const room: ChatRoomInfo = this.getRoom(roomId);
    room.seen();
    room.startScrollback();
    this.setCurrentRoom(room.roomId);
  }

  public leaveRoom(roomId: RoomId) : void {
    const room = this.deleteRoom(roomId);
    if (room) {
      switch (roomId.type) {
        case chatType.GROUP:
          this.client.leaveRoom(roomId.name);
          break;
        case chatType.PRIVATE:
          // no-op
          break;
      }
      if (roomId.same(this.currentRoom)) {
        if (this.rooms.length) {
          this.currentRoom = this.rooms[0].roomId;
          this.rooms[0].seen();
          this.rooms[0].startScrollback();
        } else {
          this.currentRoom = undefined;
        }
      }
      events.fire('chat-session-update', this);
    }
  }

  // get list of all users from rooms the user has joined
  public getAllUsers() : string[] {
    const allUsers: string[] = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (allUsers.indexOf(user.info.name) < 0) allUsers.push(user.info.name);
      });
    });
    return allUsers;
  }

  private internalConnect(login: LoginInfo) {
    events.on('system_message', (msg: string | string[]) => this.onchat({ type: messageType.SYSTEM, message: msg }));
    events.on('combatlog_message', (msg: string | string[]) => this.onchat({ type: messageType.COMBAT_LOG, message: msg }));

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
      
      // if (!patcher.hasRealApi()) {
      //   if (username === "") username = window.prompt('username?');
      //   if (password === "###") password = window.prompt('password?');
      // }
      if (login.loginToken) {
        this.client.connectWithToken(login.loginToken);
      } else {
        this.client.connect(login.username, login.password);
      }
    }
  }
}

export default ChatSession;
