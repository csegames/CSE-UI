/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events, client, registerSlashCommand, parseMessageForSlashCommand } from '@csegames/camelot-unchained';

import ChatSession from './components/ChatSession';
import ChatRoomInfo from './components/ChatRoomInfo';
import { ChatMessage, chatType } from './components/ChatMessage';
import SlashCommand from './components/SlashCommand';
import RoomId from './components/RoomId';
import { chatConfig, ChatConfig } from './components/ChatConfig';

import Info from './components/Info';
import Content from './components/Content';
import {initLocalStorage} from './components/settings/chat-defaults';

export interface ChatState {
  chat: ChatSession;
  now: number;
  config: ChatConfig;
}

export interface ChatProps {
  loginToken: string,
  hideChat?: () => void;
}

class Chat extends React.Component<ChatProps, ChatState> {
  _eventHandlers: any[] = [];
  constructor(props: ChatProps) {
    super(props);
    this.state = this.initialState();

    // load configuration (before subscribing to options updates!)
    chatConfig.refresh();

    // handle updates to chat session
    this._eventHandlers.push(events.on('chat-session-update', this.update));
    this._eventHandlers.push(events.on('chat-show-room', this.joinRoom));
    this._eventHandlers.push(events.on('chat-leave-room', (name: string) =>  this.leaveRoom(new RoomId(name, chatType.GROUP))));
    this._eventHandlers.push(events.on('chat-options-update', this.optionsUpdated));

    // Initialize chat settings in localStorage
    initLocalStorage();
  }

  initialState(): ChatState {
    return {
      chat: (window as any)['_cse_chat_session'] || new ChatSession(),
      now: 0,
      config: chatConfig
    }
  }

  // Get current tab
  getCurrentRoom = () : ChatRoomInfo => {
    return this.state.chat.getRoom(this.state.chat.currentRoom);
  }

  // Send a message to the current room, named room (not implemented) or user (not implemneted)
  send = (roomId: RoomId, text: string) : void => {
    switch (roomId.type) {
      case chatType.GROUP:
        this.state.chat.send(text, roomId.name);
        break;
      case chatType.PRIVATE:
        this.state.chat.sendMessage(text, roomId.name);
        break;
    }
  }

  update = (chat : ChatSession) : void => {
    this.setState({ chat: chat, now: Date.now() } as any);
  }

  optionsUpdated = (config: ChatConfig) : void => {
    this.setState({ config: config, now: Date.now() } as any);
  }

  selectRoom = (roomId: RoomId) : void => {
    this.state.chat.joinRoom(roomId);
  }

  leaveRoom = (roomId: RoomId) : void => {
    this.state.chat.leaveRoom(roomId);
  }

  joinRoom = (roomName: string) : void => {
    this.state.chat.joinRoom(new RoomId(roomName, chatType.GROUP));
  }

  slashCommand = (command: string) : boolean => {
    if (parseMessageForSlashCommand(command)) return true;
    const cmd = new SlashCommand(command);
    if (cmd.exec(this.state.chat)) return true;
    client.SendSlashCommand(command);
    return true;
  }

  close = () : void => {
    (window as any)["_cse_chat_session"] = this.state.chat;
    this.props.hideChat();
  }

  disconnect = () : void => {
    this.state.chat.simulateDisconnect();
  }

  getRooms = () : void => {
    this.state.chat.getRooms();
  }

  componentWillMount() : void {
    // hook up to chat
    this.state.chat.connectWithToken(this.props.loginToken);
  }
  componentDidMount() : void {
    if (!this.state.chat.currentRoom) {
      const roomId = new RoomId('_global', chatType.GROUP);
      this.state.chat.setCurrentRoom(roomId);
    }
  }

  componentWillUnmount() {
    this._eventHandlers.forEach((value: any) => {
      events.off(value);
    });
  }

  // Render chat
  render() {
    const current : RoomId = this.state.chat.currentRoom;
    const room : ChatRoomInfo = current ? this.state.chat.getRoom(current) : undefined;
    return (
      <div className="cse-chat no-select">
        <div className="chat-frame">
          <Info
            chat={this.state.chat}
            currentRoom={this.state.chat.currentRoom}
            selectRoom={this.selectRoom}
            leaveRoom={this.leaveRoom}
            />
          <Content
            room={room}
            send={this.send}
            slashCommand={this.slashCommand}
            />
        </div>
      </div>
    );
  }
}

export default Chat;
