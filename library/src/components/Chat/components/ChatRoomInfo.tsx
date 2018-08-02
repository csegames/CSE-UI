/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UserInfo } from './User';
import { ChatMessage, chatType } from './ChatMessage';
import { chatConfig } from './ChatConfig';
import RoomId from './RoomId';

export interface ChatRoomInfoMessage {
  key: number;
  message: ChatMessage;
}

export interface ChatRoomInfoUser {
  key: number;
  info: UserInfo;
}

class ChatRoomInfo {
  public messages: ChatRoomInfoMessage[] = [];
  public users: ChatRoomInfoUser[] = [];
  public key: number = 0;
  public roomId: RoomId;
  public type: chatType;
  public players: number = 0;
  public unread: number = 0;
  public scrollback: number = 0;
  public scrollbackPageSize: number;
  public scrollbackThreshold: number;

  constructor(roomId: RoomId, scrollbackThreshold: number = 50, scrollbackPageSize: number = 50) {
    this.roomId = roomId;
    this.scrollbackThreshold = scrollbackThreshold;
    this.scrollbackPageSize = scrollbackPageSize;
  }

  public diagnostics = () : void => {
    console.log('|  Room: ' + this.roomId.name
      + ' Players: ' + this.players
      + ' Unread: ' + this.unread
      + ' Messages: ' + this.messages.length
      + ' ScrollBack: ' + this.scrollback,
    );
  }

  public addUser = (user: UserInfo) : void => {
    let sortIndex: number = this.users.length;
    for (let i = 0; i < this.users.length; i++) {
      if (user.isCSE) {
        if (! this.users[i].info.isCSE) {
          sortIndex = i - 1 > -1 ? i-- : 0;
          break;
        }
      } else if (this.users[i].info.isCSE) {
        continue;
      }
      if (this.users[i].info.name > user.name) {
        sortIndex = i;
        break;
      }
    }
    this.users.splice(sortIndex, 0, { key: this.key++, info: user });
    this.players ++;
  }

  public removeUser = (user: UserInfo) : void => {
    const users: ChatRoomInfoUser[] = this.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].info.name === user.name) {
        users.splice(i,1);
        this.players --;
        break;
      }
    }
  }

  public add = (message: ChatMessage) : void => {
    message.checkIsNewDay(this.messages.length > 1 ? this.messages[this.messages.length - 2].message.when : undefined);
    // manage scrollback buffer size
    if (this.messages.length > chatConfig.SCROLLBACK_BUFFER_SIZE) {
      this.messages[0] = null;
      this.messages = this.messages.map((_message, i) => {
        if (this.messages[i + 1]) {
          const newMessage = {
            ...this.messages[i + 1],
            key: i,
          };
          return newMessage;
        }

        return { key: i, message };
      });
    } else {
      
      this.messages.push({
        key: this.messages.length - 1,
        message,
      });
    }
  }

  public push = (message: ChatMessage) : void => {
    this.add(message);
    this.unread ++;
  }

  public seen = () : void => {
    this.unread = 0;
  }

  public countVisibleMessages = () : number => {
    let count: number = 0;
    this.messages.forEach((message: ChatRoomInfoMessage) : void => {
      if (!chatConfig.JOIN_PARTS) {
        // not showing JOIN/PARTS so don't count these message types
        if (message.message.type === chatType.AVAILABLE) return;
        if (message.message.type === chatType.UNAVAILABLE) return;
      }
      count ++;
    });
    return count;
  }

  public startScrollback = () : void => {
    const count : number = this.countVisibleMessages();
    if (count > this.scrollbackThreshold) {
      this.scrollback = count - this.scrollbackThreshold;
    } else {
      this.scrollback = 0;
    }
  }

  public cancelScrollback = () : void => {
    this.scrollback = 0;
  }

  public nextScrollbackPage = () : void => {
    if (this.scrollbackPageSize > this.scrollback) {
      this.cancelScrollback();
    } else {
      this.scrollback -= this.scrollbackPageSize;
    }
  }
}

export default ChatRoomInfo;
