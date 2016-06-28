/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as events from '../../../../../shared/lib/events';
import { CSEChat, Config, Room } from '../../chat/CSEChat';
import { ChatMessage, chatType } from './ChatMessage';
import { UserInfo } from './User';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';
import ChatClient from '../../chat/ChatClient';
import messageType from '../../chat/messageType';
import { patcher } from '../../api/PatcherAPI';
import { chatConfig, ChatConfig } from './ChatConfig';
import { chatState } from './ChatState';

class ChatSession {

  SCROLLBACK_THRESHOLD : number = 50;
  SCROLLBACK_PAGESIZE : number = 100;

  rooms: ChatRoomInfo[] = [];
  currentRoom: RoomId = undefined;
  reconnecting: boolean = false;
  connected: boolean = false;
  client: ChatClient = null;
  me: string = "me";
  latency: number;
  windowActive = true;

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
        var room = this.getRoom(this.currentRoom);
        if (room) room.seen();
      }
  }

  diagnostics = () : void => {
    const memory : any = (window.performance as any).memory;
    const now : Date = new Date();
    console.log(now.toISOString());
    console.log(
      '| Memory Usage: ' + ((((memory.usedJSHeapSize/1024/1024)*100)|0)/100) + "MB"
      + ' Active: ' + this.windowActive
      + ' Latency: ' + this.latency
      + ' Reconnecting: ' + this.reconnecting
      + ' Rooms: ' + this.rooms.length
    );
    this.rooms.forEach((room: ChatRoomInfo) : void => {
      room.diagnostics();
    });
  }

  connect(username: string, password: string) {
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
      if (!patcher.hasRealApi()) {
        if (username === "") username = window.prompt('username?');
        if (password === "###") password = window.prompt('password?');
      }
      this.client.connect(username, password);
    }
  }

  onping(ping: any) {
    this.latency = (Date.now() - ping.now);
    events.fire('chat-session-update', this);
    this.diagnostics();
  }

  onconnect() : void {
    // TODO: if no rooms yet, this won't work.
    this.me = this.client.getNick();
    chatConfig.setNick(this.me);
    chatState.set('chat', this);
    this.broadcast(new ChatMessage(chatType.SYSTEM, '', '', 'Connected to chat server.'));
    this.connected = true;
    this.reconnecting = false;
  }

  onconnectfailed() {
    // if failed to connect and we are trying to re-connect, we should
    // retry
    if (this.reconnecting) {
      // connectFailed while reconnecting, try again
      this.reconnect();
    }
  }

  ondisconnect() {
    this.broadcast(new ChatMessage(chatType.SYSTEM, '', '', 'Disconnected from chat server.'));
    this.reconnect();
  }

  onchat(args: any): void {
    switch (args.type) {
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
            args.time
          )
        );
        break;
      case messageType.NONE:
        this.recv(new ChatMessage(chatType.SYSTEM, '', '', 'Unrecognised message type ' + args.type));
        break;
    }
  }

  reconnect() {
    this.reconnecting = true;

    // Build list of rooms to re-connect to
    const rooms : string[] = [];
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId.type === chatType.GROUP) {
        rooms.push(this.rooms[i].roomId.name);
        this.rooms[i].players = 0;
      }
    }
    // Reconnect in 1s
    setTimeout(() => { this.client.reconnect(rooms); }, 10000);
  }

  simulateDisconnect() {
    this.client.disconnect();
  }

  getRooms() {
    this.client.getRooms();
  }

  onrooms(items: Room[]) {
    events.fire('chat-room-list', items);
  }

  // Broadcast a message to all rooms
  broadcast(message: ChatMessage) : void {
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
  recv(message: ChatMessage) : void {
    // check for a broadcast message (private message sent by "")
    if (message.type === chatType.PRIVATE && message.nick === "chat.camelotunchained.com/warning") {
      this.broadcast(message);
    } else {
      const roomId = new RoomId(message.roomName, message.type);
      const room : ChatRoomInfo = this.getRoom(roomId);
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
  presence(type: number, user: UserInfo) : void {
    // find the room this user is in, don't create room unless this is an available presence
    const roomId = new RoomId(user.roomName, chatType.GROUP);
    const room : ChatRoomInfo = this.getRoom(roomId, type === messageType.AVAILIBLE);
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

  setCurrentRoom(roomId: RoomId) : void {
    this.currentRoom = roomId;
    events.fire('chat-session-update', this);
  }

  findRoom(roomId: RoomId) : ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId && this.rooms[i].roomId.same(roomId)) {
        return this.rooms[i];
      }
    }
  }

  getRoom(roomId: RoomId, add: boolean = true) : ChatRoomInfo {
    let room : ChatRoomInfo = this.findRoom(roomId);
    if (!room && add) {
      room = new ChatRoomInfo(
        roomId,
        this.SCROLLBACK_THRESHOLD,
        this.SCROLLBACK_PAGESIZE
      );
      this.rooms.push(room);
    }
    return room;
  }

  deleteRoom(roomId: RoomId) : ChatRoomInfo {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId.same(roomId)) {
        const room = this.rooms[i];
        this.rooms.splice(i,1);
        return room;
      }
    }
  }

  send(text: string, roomName: string) : void {
    this.client.sendMessageToRoom(text, roomName);
  }

  sendMessage(text: string, user: string) : void {
    this.client.sendMessageToUser(text, user);
    const roomId = new RoomId(user, chatType.PRIVATE);
    const message = new ChatMessage(chatType.PRIVATE, user, this.me, text);
    this.getRoom(roomId).add(message);
    this.joinRoom(roomId);
    events.fire('chat-session-update', this);
  }

  joinRoom(roomId: RoomId) : void {
    if (!this.findRoom(roomId)) {
      this.client.joinRoom(roomId.name);
    }
    const room: ChatRoomInfo = this.getRoom(roomId);
    room.seen();
    room.startScrollback();
    this.setCurrentRoom(roomId);
  }

  leaveRoom(roomId: RoomId) : void {
    const room = this.deleteRoom(roomId);
    if (room) {
      switch(roomId.type) {
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
  getAllUsers() : string[] {
    const allUsers: string[] = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (allUsers.indexOf(user.props.info.name) < 0) allUsers.push(user.props.info.name);
      });
    });
    return allUsers;
  }
}

export default ChatSession;
