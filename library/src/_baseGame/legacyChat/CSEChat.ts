/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { isWebSocketUrl } from '../utils/urlUtils';
import { ReconnectingWebSocket, WebSocketSettings } from '../types/ReconnectingWebSocket';
import { Callback, EventEmitter } from '../types/EventEmitter';

import { chat } from './chat_proto';
import * as protobuf from 'protobufjs';
import { ListenerHandle } from '../listenerHandle';

const ClientMessages = chat.ChatClientUnionMessage.MessageTypes;
const ServerMessages = chat.ChatServerUnionMessage.MessageTypes;
const ActionType = chat.RoomActionRequest.ActionType;

export interface TimedMessage extends chat.IChatMessage {
  when: Date;
}

export interface ChatSettings {
  getCharacterID: () => string;
  getToken: () => string;
}

export type ChatSocketSettings = ChatSettings & WebSocketSettings;

export class CSEChat {
  private socket: ReconnectingWebSocket;
  private settings: ChatSocketSettings;
  private eventEmitter: EventEmitter;
  private messageQueue: any[] = [];

  public constructor() {
    this.eventEmitter = new EventEmitter((...params: any[]) => {
      if (this.settings?.verboseLogging) console.log(...params);
    });
  }

  public hasSender() {
    const id = this.settings?.getCharacterID();
    return id && id.length > 0;
  }

  public get connected() {
    return this.socket && this.socket.isOpen;
  }

  public connect(settings: ChatSocketSettings) {
    const url = settings.getUrl();
    if (!isWebSocketUrl(url)) {
      console.error('Attempted to connect chat to invalid URL: ' + url);
      return;
    }

    const prevSettings = this.settings;
    this.settings = settings;
    this.settings.protocols = ['chat-ws'];

    if (this.connected) {
      if (prevSettings.getUrl() === url) {
        return;
      }
      this.socket.close();
    }
    this.socket = new ReconnectingWebSocket(this.settings);
    this.socket.onOpen = () => {
      this.sendAuth();
      this.sendPing();
      this.requestDirectory();
      this.eventEmitter.trigger('connected');
      window.setTimeout(() => {
        if (this.messageQueue && this.messageQueue.length > 0) {
          const toSend = this.messageQueue.slice();
          this.messageQueue = [];
          toSend.forEach((m) => this.sendProtoMessage(m));
        }
      }, 100);
    };
    this.socket.onError = (err) => {
      this.eventEmitter.trigger('error', err);
    };
    this.socket.onMessage = (e) => this.handleMessage(e);
  }

  public disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.socket = null;
  }

  private sendAuth() {
    this.socket.send(
      JSON.stringify({
        characterID: this.settings.getCharacterID(),
        token: this.settings.getToken()
      })
    );
  }

  private sendPing() {
    if (!this.socket) {
      return;
    }

    this.sendProtoMessage(
      new chat.ChatServerUnionMessage({
        messageType: ServerMessages.PINGPONG,
        pingPong: chat.PingPongMessage.create({ ping: false })
      })
    );
  }

  // EVENT REGISTRATION

  public onError(callback: (error: { message: string }) => any) {
    return this.eventEmitter.on('error', callback);
  }

  public onConnected(callback: () => any) {
    if (this.connected) {
      window.setTimeout(callback, 1);
    }
    return this.eventEmitter.on('connected', callback);
  }

  public onChatMessage(callback: (msg: TimedMessage) => any) {
    return this.bindHandler(ClientMessages.CHATMESSAGE, callback);
  }
  public onRoomActionResponse(callback: (msg: chat.RoomActionResponse) => any) {
    return this.bindHandler(ClientMessages.ROOMACTION, callback);
  }
  public onRoomInfo(callback: (info: chat.RoomInfo) => any) {
    return this.bindHandler(ClientMessages.ROOMINFO, callback);
  }
  public onRoomJoined(callback: (info: chat.RoomJoined) => any) {
    return this.bindHandler(ClientMessages.JOINED, callback);
  }
  public onRoomLeft(callback: (info: chat.RoomLeft) => any) {
    return this.bindHandler(ClientMessages.LEFT, callback);
  }
  public onRoomRenamed(callback: (info: chat.RoomRenamed) => any) {
    return this.bindHandler(ClientMessages.RENAMED, callback);
  }
  public onRoleAdded(callback: (info: chat.RoomRoleAdded) => any) {
    return this.bindHandler(ClientMessages.ROLEADDED, callback);
  }
  public onRoleUpdated(callback: (info: chat.RoomRoleUpdated) => any) {
    return this.bindHandler(ClientMessages.ROLEUPDATED, callback);
  }
  public onRoleRemoved(callback: (info: chat.RoomRoleUpdated) => any) {
    return this.bindHandler(ClientMessages.ROLEREMOVED, callback);
  }
  public onRoleAssigned(callback: (info: chat.RoomRoleAssigned) => any) {
    return this.bindHandler(ClientMessages.ROLEASSIGNED, callback);
  }
  public onInviteReceived(callback: (info: chat.RoomInfo) => any) {
    return this.bindHandler(ClientMessages.INVITERECEIVED, callback);
  }
  public onRoomKicked(callback: (info: chat.RoomKickReceived) => any) {
    return this.bindHandler(ClientMessages.KICKED, callback);
  }
  public onRoomBanned(callback: (info: chat.RoomBanReceived) => any) {
    return this.bindHandler(ClientMessages.BANNED, callback);
  }
  public onRoomMuted(callback: (info: chat.RoomMuteReceived) => any) {
    return this.bindHandler(ClientMessages.MUTED, callback);
  }
  public onRoomOwnerChanged(callback: (info: chat.RoomOwnerChanged) => any) {
    return this.bindHandler(ClientMessages.OWNERCHANGED, callback);
  }
  public onDirectory(callback: (directory: chat.RoomDirectory) => any) {
    return this.bindHandler(ClientMessages.DIRECTORY, callback);
  }

  // MESSAGING
  public sendMessageToRoom(content: string, roomID: string) {
    const msg = chat.ChatMessage.create({
      content,
      senderID: this.settings.getCharacterID(),
      targetID: roomID,
      type: chat.ChatMessage.MessageTypes.Room
    });

    this.sendProtoMessage(
      chat.ChatServerUnionMessage.create({
        messageType: ServerMessages.CHAT,
        chat: msg
      })
    );
  }

  public sendDirectMessage(content: string, targetUserID: string | null, targetUserName: string | null) {
    const msg = chat.ChatMessage.create({
      content,
      senderID: this.settings.getCharacterID(),
      type: chat.ChatMessage.MessageTypes.Direct
    });
    if (targetUserID) msg.targetID = targetUserID;
    if (targetUserName) msg.targetName = targetUserName;

    this.sendProtoMessage(
      chat.ChatServerUnionMessage.create({
        messageType: ServerMessages.CHAT,
        chat: msg
      })
    );
  }

  public requestDirectory() {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.DIRECTORY
      })
    );
  }

  public createRoom(name: string, options: { public?: boolean; groupID?: string } = {}) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.CREATE,
        create: chat.RoomActionRequest.CreateRoom.create({
          ...options,
          name
        })
      })
    );
  }

  public deleteRoom(roomID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.DELETE,
        delete: chat.RoomActionRequest.DeleteRoom.create({
          roomID
        })
      })
    );
  }

  public renameRoom(roomID: string, newName: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.RENAME,
        rename: chat.RoomActionRequest.RenameRoom.create({
          roomID,
          name: newName
        })
      })
    );
  }

  public joinRoom(roomID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.JOIN,
        join: chat.RoomActionRequest.JoinRoom.create({
          roomID
        })
      })
    );
  }

  public leaveRoom(roomID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.LEAVE,
        leave: chat.RoomActionRequest.LeaveRoom.create({
          roomID
        })
      })
    );
  }

  public createRoomRole(roomID: string, name: string, permissions: number) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.CREATEROLE,
        createRole: chat.RoomActionRequest.CreateRole.create({
          roomID,
          name,
          permissions
        })
      })
    );
  }

  public updateRoomRole(
    roomID: string,
    roleName: string,
    permissions: number | null = null,
    newName: string | null = null
  ) {
    const updateRole = chat.RoomActionRequest.UpdateRole.create({ roomID, name: roleName });
    if (permissions) updateRole.permissions = permissions;
    if (newName) updateRole.rename = newName;

    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.UPDATEROLE,
        updateRole
      })
    );
  }

  public deleteRoomRole(roomID: string, name: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.DELETEROLE,
        deleteRole: chat.RoomActionRequest.DeleteRole.create({
          roomID,
          name
        })
      })
    );
  }

  public assignRoomRole(roomID: string, name: string, characterID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.ASSIGNROLE,
        assignRole: chat.RoomActionRequest.AssignRole.create({
          roomID,
          role: name,
          userID: characterID
        })
      })
    );
  }

  public inviteToRoom(roomID: string, characterID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.INVITEUSER,
        inviteUser: chat.RoomActionRequest.InviteUser.create({
          roomID,
          userID: characterID
        })
      })
    );
  }

  public kickFromRoom(roomID: string, userID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.KICKUSER,
        kickUser: chat.RoomActionRequest.KickUser.create({
          roomID,
          userID
        })
      })
    );
  }

  public muteInRoom(roomID: string, userID: string, durationSeconds?: number) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.MUTEUSER,
        muteUser: chat.RoomActionRequest.MuteUser.create({
          roomID,
          userID,
          seconds: durationSeconds
        })
      })
    );
  }

  public banFromRoom(roomID: string, userID: string, durationSeconds: number) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.BANUSER,
        banUser: chat.RoomActionRequest.BanUser.create({
          roomID,
          userID,
          seconds: durationSeconds
        })
      })
    );
  }

  public transferRoomOwnership(roomID: string, newOwnerID: string) {
    this.sendRoomAction(
      chat.RoomActionRequest.create({
        action: ActionType.TRANSFEROWNERSHIP,
        transferOwner: chat.RoomActionRequest.TransferOwnership.create({
          roomID,
          newOwnerID
        })
      })
    );
  }

  // INTERNALS

  private handleMessage(event: MessageEvent) {
    const msg = chat.ChatClientUnionMessage.decode(new Uint8Array(event.data, 0, event.data.byteLength));

    switch (msg.type) {
      case ClientMessages.CHATMESSAGE:
        this.triggerEvent(msg.type, { ...msg.chat, when: new Date() });
        return;

      case ClientMessages.PINGPONGMESSAGE:
        window.setTimeout(this.sendPing, 10000);
        return;

      case ClientMessages.ROOMACTION:
        this.triggerEvent(msg.type, msg.roomAction);
        return;

      case ClientMessages.ROOMINFO:
        this.triggerEvent(msg.type, msg.info);
        return;

      case ClientMessages.JOINED:
        this.triggerEvent(msg.type, msg.joined);
        return;

      case ClientMessages.LEFT:
        this.triggerEvent(msg.type, msg.left);
        return;

      case ClientMessages.RENAMED:
        this.triggerEvent(msg.type, msg.renamed);
        return;

      case ClientMessages.ROLEADDED:
        this.triggerEvent(msg.type, msg.roleAdded);
        return;

      case ClientMessages.ROLEUPDATED:
        this.triggerEvent(msg.type, msg.roleUpdated);
        return;

      case ClientMessages.ROLEREMOVED:
        this.triggerEvent(msg.type, msg.roleRemoved);
        return;

      case ClientMessages.ROLEASSIGNED:
        this.triggerEvent(msg.type, msg.roleAssigned);
        return;

      case ClientMessages.INVITERECEIVED:
        this.triggerEvent(msg.type, msg.invited);
        return;

      case ClientMessages.KICKED:
        this.triggerEvent(msg.type, msg.kicked);
        return;

      case ClientMessages.BANNED:
        this.triggerEvent(msg.type, msg.banned);
        return;

      case ClientMessages.MUTED:
        this.triggerEvent(msg.type, msg.muted);
        return;

      case ClientMessages.OWNERCHANGED:
        this.triggerEvent(msg.type, msg.ownerChanged);
        return;

      case ClientMessages.DIRECTORY:
        this.triggerEvent(msg.type, msg.directory);
        return;
    }
  }

  private bindHandler(type: chat.ChatClientUnionMessage.MessageTypes, callback: Callback): ListenerHandle {
    return this.eventEmitter.on(ClientMessages[type], callback);
  }

  private triggerEvent(type: chat.ChatClientUnionMessage.MessageTypes, msg: any) {
    if (!msg) {
      console.warn(`CSEChat | message null or undefined for message type ${ClientMessages[type]}`);
      return;
    }
    return this.eventEmitter.trigger(ClientMessages[type], msg);
  }

  private sendProtoMessage(msg: chat.ChatServerUnionMessage) {
    if (!this.connected) {
      this.messageQueue.push(msg);
    }

    if (!this.socket) {
      let message = null;

      try {
        message = JSON.stringify(msg);
      } catch (e) {
        console.error('Failed to stringify msg passed to sendProtoMessage', msg);
      }

      console.error("Tried to sendProtoMessage when we didn't have a socket? Message: ", message);
      return;
    }

    const writer = new protobuf.Writer();
    chat.ChatServerUnionMessage.encode(msg, writer);
    this.socket.send(writer.finish());
  }

  private sendRoomAction(roomAction: chat.RoomActionRequest) {
    this.sendProtoMessage(
      chat.ChatServerUnionMessage.create({
        messageType: ServerMessages.ROOMACTION,
        roomAction
      })
    );
  }
}
