/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  ReconnectingWebSocket,
  WebSocketOptions
} from '../utils/ReconnectingWebSocket';
import { createEventEmitter, EventEmitter } from '../utils/EventEmitter';
import './chatProtoTypes';
import { isWebSocketUrl } from '../utils/urlUtils';
const chat = require('./chat_pb.js');

export interface Options extends Partial<WebSocketOptions> {
  // data to send to the server on connection init
  characterID: () => string;
  token: () => string;
}

export function defaultOpts(): Options {
  return {
    url: () => `ws://${game.serverHost}:9990/chat`,
    protocols: 'chat-ws',
    reconnectInterval: 500,
    connectTimeout: 5000,
    debug: false,

    characterID: () => '',
    token: () => ''
  };
}

function debounce(func: any, wait: number, immediate: boolean) {
  let timeout = null;
  return function() {
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
}

export class CSEChat {
  private socket: ReconnectingWebSocket;
  private options: Partial<Options>;
  private eventEmitter: EventEmitter;
  private characterID: () => string;
  private senderID: () => string;
  private initialized: boolean;
  private messageQueue: any[] = [];

  public constructor() {
    this.eventEmitter = createEventEmitter();
  }

  public initialize(options: Partial<Options>) {
    this.options = withDefaults(options, defaultOpts());

    const url = this.options.url();
    if (!url || !isWebSocketUrl(url)) {
      console.error('Attempted to initialize websocket connection with invalid URL: ' + url);
      return;
    }

    this.characterID = options.characterID;

    this.senderID = options.characterID;
    this.initialized = true;
  }

  public get connected() {
    return this.socket && this.socket.isOpen;
  }

  public connect() {
    if (!this.initialized) {
      console.error('Attempted to connect to chat when not initialized.');
      return;
    }
    if (this.socket) {
      return;
    }
    this.socket = new ReconnectingWebSocket(this.options);
    this.socket.onopen = () => {
      this.sendAuth();
      this.sendPing();
      this.requestDirectory();
      this.eventEmitter.emit('connected');
      setTimeout(() => {
        if (this.messageQueue && this.messageQueue.length > 0) {
          const toSend = this.messageQueue.slice();
          this.messageQueue = [];
          toSend.forEach(m => this.sendProtoMessage(m));
        }
      }, 100);
    }
    this.socket.onerror = (err) => {
      this.eventEmitter.emit('error', err);
    }
    this.socket.onmessage = e => this.handleMessage(e);
  }

  public disconnect() {
    if (!this.socket) {
      return;
    }
    this.socket.close();
    this.socket = null;
  }

  private sendAuth = () => {
    this.socket.send(
      JSON.stringify({
        characterID: this.characterID(),
        token: this.options.token()
      })
    );
  };

  private sendPing = () => {
    const pong = new chat.PingPongMessage();
    pong.setPing(false);
    const reply = new chat.ChatServerUnionMessage();
    reply.setMessagetype(2); // PINGPONG
    reply.setPingpong(pong);
    this.sendProtoMessage(reply);
  };

  // EVENT REGISTRATION

  public onError = (callback: (error: { message: string }) => any) => {
    return this.eventEmitter.on('error', callback);
  };

  public onConnected = (callback: () => any) => {
    if (this.connected) {
      setTimeout(callback, 1);
    }
    return this.eventEmitter.on('connected', callback);
  };

  public onChatMessage = (callback: (msg: ChatMessage) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.CHATMESSAGE
      ],
      callback
    );
  };

  public onRoomActionResponse = (callback: (msg: RoomActionResponse) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROOMACTION
      ],
      callback
    );
  };

  public onRoomInfo = (callback: (info: RoomInfo) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROOMINFO
      ],
      callback
    );
  };

  public onRoomJoined = (callback: (info: RoomJoined) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.JOINED
      ],
      callback
    );
  };

  public onRoomLeft = (callback: (info: RoomLeft) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.LEFT
      ],
      callback
    );
  };

  public onRoomRenamed = (callback: (info: RoomRenamed) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.RENAMED
      ],
      callback
    );
  };

  public onRoleAdded = (callback: (info: RoomRoleAdded) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROLEADDED
      ],
      callback
    );
  };

  public onRoleUpdated = (
    callback: (info: RoomRoleUpdated) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROLEUPDATED
      ],
      callback
    );
  };

  public onRoleRemoved = (
    callback: (info: RoomRoleUpdated) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROLEREMOVED
      ],
      callback
    );
  };

  public onRoleAssigned = (
    callback: (info: RoomRoleAssigned) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROLEASSIGNED
      ],
      callback
    );
  };

  public onInviteReceived = (callback: (info: RoomInfo) => any) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.ROOMINFO
      ],
      callback
    );
  };

  public onRoomKicked = (
    callback: (info: RoomKickReceived) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.KICKED
      ],
      callback
    );
  };

  public onRoomBanned = (
    callback: (info: RoomBanReceived) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.BANNED
      ],
      callback
    );
  };

  public onRoomMuted = (
    callback: (info: RoomMuteReceived) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.MUTED
      ],
      callback
    );
  };

  public onRoomOwnerChanged = (
    callback: (info: RoomOwnerChanged) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.OWNERCHANGED
      ],
      callback
    );
  };

  public onDirectory = (
    callback: (directory: RoomsDirectory) => any
  ) => {
    return this.eventEmitter.on(
      ChatClientUnionMessage_MessageTypes[
        ChatClientUnionMessage_MessageTypes.DIRECTORY
      ],
      callback
    );
  };

  // MESSAGING
  public sendMessageToRoom = (content: string, roomID: string) => {
    const chatMessage = new chat.ChatMessage();
    chatMessage.setType(2); // Room
    chatMessage.setContent(content);
    chatMessage.setSenderid(this.senderID());
    chatMessage.setTargetid(roomID);

    const union = new chat.ChatServerUnionMessage();
    union.setMessagetype(1); // CHAT
    union.setChat(chatMessage);
    this.sendProtoMessage(union);
  };

  public sendDirectMessage = (
    content: string,
    targetUserID: string | null,
    targetUserName: string | null
  ) => {
    const chatMessage = new chat.ChatMessage();
    chatMessage.setType(1); // Direct
    chatMessage.setContent(content);
    chatMessage.setSenderid(this.senderID());
    if (targetUserID) chatMessage.setTargetid(targetUserID);
    if (targetUserName) chatMessage.setTargetName(targetUserName);

    const union = new chat.ChatServerUnionMessage();
    union.setMessagetype(1); // CHAT
    union.setChat(chatMessage);
    this.sendProtoMessage(union);
  };

  public requestDirectory = () => {
    const action = new chat.RoomActionRequest();
    action.setAction(14);
    this.sendRoomAction(action);
  };

  public createRoom = (
    name: string,
    options: { public?: boolean; groupID?: string } = {}
  ) => {
    const create = new chat.RoomActionRequest.CreateRoom();
    create.setName(name);
    create.setIspublic(!!options.public);
    if (options.groupID) create.setForGroupID(options.groupID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(0);
    ra.setCreate(create);
    this.sendRoomAction(ra);
  };

  public deleteRoom = (roomID: string) => {
    const del = new chat.RoomActionRequest.DeleteRoom();
    del.setRoomid(roomID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(1);
    ra.setDelete(del);
    this.sendRoomAction(ra);
  };

  public renameRoom = (roomID: string, newName: string) => {
    const rn = new chat.RoomActionRequest.RenameRoom();
    rn.setRoomid(roomID);
    rn.setName(newName);

    const ra = new chat.RoomActionRequest();
    ra.setAction(2);
    ra.setRename(rn);
    this.sendRoomAction(ra);
  };

  public joinRoom = (roomID: string) => {
    const join = new chat.RoomActionRequest.JoinRoom();
    join.setRoomid(roomID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(3);
    ra.setJoin(join);
    this.sendRoomAction(ra);
  };

  public leaveRoom = (roomID: string) => {
    const leave = new chat.RoomActionRequest.LeaveRoom();
    leave.setRoomid(roomID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(4);
    ra.setLeave(leave);
    this.sendRoomAction(ra);
  };

  public createRoomRole = (
    roomID: string,
    name: string,
    permissions: number
  ) => {
    const cr = new chat.RoomActionRequest.CreateRole();
    cr.setRoomid(roomID);
    cr.setName(name);
    cr.setPermissions(permissions);

    const ra = new chat.RoomActionRequest();
    ra.setAction(5);
    ra.setCreaterole(cr);
    this.sendRoomAction(ra);
  };

  public updateRoomRole = (
    roomID: string,
    roleName: string,
    permissions: number | null = null,
    newName: string | null = null
  ) => {
    const ur = new chat.RoomActionRequest.UpdateRole();
    ur.setRoomid(roomID);
    ur.setName(name);
    if (permissions) ur.setPermissions(permissions);
    if (newName) ur.setRename(newName);

    const ra = new chat.RoomActionRequest();
    ra.setAction(6);
    ra.setUpdaterole(ur);
    this.sendRoomAction(ra);
  };

  public deleteRoomRole = (roomID: string, name: string) => {
    const cr = new chat.RoomActionRequest.DeleteRole();
    cr.setRoomid(roomID);
    cr.setName(name);

    const ra = new chat.RoomActionRequest();
    ra.setAction(7);
    ra.setDeleterole(cr);
    this.sendRoomAction(ra);
  };

  public assignRoomRole = (
    roomID: string,
    name: string,
    characterID: string
  ) => {
    const ar = new chat.RoomActionRequest.AssignRole();
    ar.setRoomid(roomID);
    ar.setName(name);
    ar.setUserid(characterID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(8);
    ra.setAssignrole(ar);
    this.sendRoomAction(ra);
  };

  public inviteToRoom = (roomID: string, characterID: string) => {
    const ar = new chat.RoomActionRequest.AssignRole();
    ar.setRoomid(roomID);
    ar.setName(name);
    ar.setUserid(characterID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(9);
    ra.setInviteuser(ar);
    this.sendRoomAction(ra);
  };

  public kickFromRoom = (roomID: string, userID: string) => {
    const kick = new chat.RoomActionRequest.KickUser();
    kick.setRoomid(roomID);
    kick.setUserid(userID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(10);
    ra.setKickuser(kick);
    this.sendRoomAction(ra);
  };

  public muteInRoom = (
    roomID: string,
    userID: string,
    durationSeconds: number | null = null
  ) => {
    const mute = new chat.RoomActionRequest.MuteUser();
    mute.setRoomid(roomID);
    mute.setUserid(userID);
    if (durationSeconds) mute.setSeconds(durationSeconds);

    const ra = new chat.RoomActionRequest();
    ra.setAction(12);
    ra.setMuteuser(mute);
    this.sendRoomAction(ra);
  };

  public banFromRoom = (
    roomID: string,
    userID: string,
    durationSeconds: number | null = null
  ) => {
    const ban = new chat.RoomActionRequest.BanUser();
    ban.setRoomid(roomID);
    ban.setUserid(userID);
    if (durationSeconds) ban.setSeconds(durationSeconds);

    const ra = new chat.RoomActionRequest();
    ra.setAction(11);
    ra.setBanuser(ban);
    this.sendRoomAction(ra);
  };

  public transferRoomOwnership = (roomID: string, newOwnerID: string) => {
    const transfer = new chat.RoomActionRequest.TransferOwnership();
    transfer.setRoomid(roomID);
    transfer.setNewownerid(newOwnerID);

    const ra = new chat.RoomActionRequest();
    ra.setAction(13);
    ra.setTransferowner(transfer);
    this.sendRoomAction(ra);
  };

  // INTERNALS

  private handleMessage(event: MessageEvent) {
    const msg = chat.ChatClientUnionMessage.deserializeBinary(
      new Uint8Array(event.data, 0, event.data.byteLength)
    );

    switch (msg.getType()) {
      case ChatClientUnionMessage_MessageTypes.CHATMESSAGE:
        const chat = msg.getChat();
        if (!chat) {
          console.warn(`CSEChat | message null or undefined for message type CHATMESSAGE`);
          return;
        }

        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.CHATMESSAGE
          ],
          {
            type: chat.getType(),
            content: chat.getContent(),
            senderFlag: chat.getSenderflag(),
            senderID: chat.getSenderid(),
            senderName: chat.getSendername(),
            targetID: chat.getTargetid(),
            targetName: chat.getTargetname(),
            when: new Date(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.PINGPONGMESSAGE: {
        setTimeout(this.sendPing, 10000);
        return;
      }
      case ChatClientUnionMessage_MessageTypes.ROOMACTION: {
        const roomAction = msg.getRoomaction();
        if (!roomAction) {
          console.warn(`CSEChat | message null or undefined for message type ROOMACTION`);
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROOMACTION
          ],
          {
            action: roomAction.getAction(),
            success: roomAction.getSuccess(),
            message: roomAction.getMessage(),
          }
        );
        return;
      }
      case ChatClientUnionMessage_MessageTypes.ROOMINFO:
        const info = msg.getInfo();
        if (!info) {
          console.warn(`CSEChat | message null or undefined for message type ROOMINFO`);
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROOMINFO
          ],
          {
            roomID: info.getRoomid(),
            name: info.getName(),
            category: info.getCategory(),
            roles: info.getRolesList().map(role => ({
              name: role.getName(),
              permissions: role.getPermissions(),
            })),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.JOINED:
        const joined = msg.getJoined();
        if (!joined) {
          console.warn(`CSEChat | message null or undefined for message type JOINED`);
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.JOINED
          ],
          {
            roomID: joined.getRoomid(),
            userID: joined.getUserid(),
            name: joined.getName(),
            role: joined.getRole(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.LEFT:
        const left = msg.getLeft();
        if (!left) {
          console.warn(`CSEChat | message null or undefined for message type LEFT`);
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.LEFT
          ],
          {
            roomID: left.getRoomid(),
            userID: left.getUserid(),
            name: left.getName(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.RENAMED:
        const renamed = msg.getRenamed();
        if (!renamed) {
          console.warn(`CSEChat | message null or undefined for message type RENAMED`);
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.RENAMED
          ],
          {
            roomID: renamed.getRoomid(),
            name: renamed.getName(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.ROLEADDED:
        const roleAdded = msg.getRoleadded();
        if (!roleAdded) {
          console.warn(
            `CSEChat | message null or undefined for message type ROLEADDED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROLEADDED
          ],
          {
            roomID: roleAdded.getRoomid(),
            name: roleAdded.getName(),
            permissions: roleAdded.getPermissions(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.ROLEUPDATED:
        const roleUpdated = msg.getRoleupdated();
        if (!roleUpdated) {
          console.warn(
            `CSEChat | message null or undefined for message type ROLEUPDATED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROLEUPDATED
          ],
          {
            roomID: roleUpdated.getRoomid(),
            name: roleUpdated.getName(),
            permissions: roleUpdated.getPermissions(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.ROLEREMOVED:
        const roleRemoved = msg.getRoleremoved();
        if (!roleRemoved) {
          console.warn(
            `CSEChat | message null or undefined for message type ROLEREMOVED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROLEREMOVED
          ],
          {
            roomID: roleRemoved.getRoomid(),
            name: roleRemoved.getName(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.ROLEASSIGNED:
        const roleAssigned = msg.getRoleassigned();
        if (!roleAssigned) {
          console.warn(
            `CSEChat | message null or undefined for message type ROLEASSIGNED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.ROLEASSIGNED
          ],
          {
            roomID: roleAssigned.getRoomid(),
            roleName: roleAssigned.getRolename(),
            userID: roleAssigned.getUserid(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.INVITERECEIVED:
        const invited = msg.getInvited();
        if (!invited) {
          console.warn(
            `CSEChat | message null or undefined for message type INVITERECEIVED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.INVITERECEIVED
          ],
          {
            roomID: invited.getRoomid(),
            roomName: invited.getRoomname(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.KICKED:
        const kicked = msg.getKicked();
        if (!kicked) {
          console.warn(
            `CSEChat | message null or undefined for message type KICKED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.KICKED
          ],
          {
            roomID: kicked.getRoomid(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.BANNED:
        const banned = msg.getBanned();
        if (!banned) {
          console.warn(
            `CSEChat | message null or undefined for message type BANNED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.BANNED
          ],
          {
            roomID: banned.getRoomid(),
            expiration: banned.getExpiration(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.MUTED:
        const muted = msg.getMuted();
        if (!muted) {
          console.warn(
            `CSEChat | message null or undefined for message type MUTED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.MUTED
          ],
          {
            roomID: muted.getRoomid(),
            expiration: muted.getExpiration(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.OWNERCHANGED:
        const ownerChanged = msg.getOwnerchanged();
        if (!ownerChanged) {
          console.warn(
            `CSEChat | message null or undefined for message type OWNERCHANGED`
          );
          return;
        }
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.OWNERCHANGED
          ],
          {
            roomID: ownerChanged.getRoomid(),
            userID: ownerChanged.getUserid(),
          }
        );
        return;
      case ChatClientUnionMessage_MessageTypes.DIRECTORY:
        const directory = msg.getDirectory();
        if (!directory) {
          console.warn(
            `CSEChat | message null or undefined for message type DIRECTORY`
          );
          return;
        }
        const dir = {
          rooms: directory.getRoomsList().map(info => ({
            roomID: info.getRoomid(),
            name: info.getName(),
            category: info.getCategory(),
          })),
        };
        this.eventEmitter.emit(
          ChatClientUnionMessage_MessageTypes[
            ChatClientUnionMessage_MessageTypes.DIRECTORY
          ],
          dir
        );
        return;
    }
  }

  private sendProtoMessage = (msg: any) => {
    if (!this.connected) {
      this.messageQueue.push(msg);
    };
    this.socket.send(msg.serializeBinary());
  };

  private sendRoomAction = (roomAction: any) => {
    const union = new chat.ChatServerUnionMessage();
    union.setMessagetype(3); // ROOMACTION
    union.setRoomaction(roomAction);
    this.sendProtoMessage(union);
  };
}
