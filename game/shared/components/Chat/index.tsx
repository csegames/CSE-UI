/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { throttle } from 'lodash';
import { parseMessageForSlashCommand } from '@csegames/library/lib/_baseGame';

import ChatSession, { ChatOptions } from './components/ChatSession';
import ChatRoomInfo from './components/ChatRoomInfo';
// import { chatType } from './components/ChatMessage';
import SlashCommand from './components/SlashCommand';
import { chatConfig, ChatConfig } from './components/ChatConfig';

import { Info } from './components/Info';
import { Content } from './components/Content';
import { initLocalStorage } from './components/settings/chat-defaults';

export interface ChatState {
  chat: ChatSession;
  now: number;
  config: ChatConfig;
}

export interface ChatProps extends ChatOptions {
  hideChat?: () => void;
}

export class Chat extends React.Component<ChatProps, ChatState> {
  private _eventHandlers: EventHandle[] = [];
  constructor(props: ChatProps) {
    super(props);
    this.state = this.initialState();

    // throttle chat updates
    this.update = throttle(this.update, 200);

    // load configuration (before subscribing to options updates!)
    chatConfig.refresh();

    // handle updates to chat session
    this._eventHandlers.push(game.on('chat-session-update', this.update));
    this._eventHandlers.push(game.on('chat-show-room', this.joinRoom));
    this._eventHandlers.push(game.on('chat-leave-room', (name: string) =>
      this.leaveRoom(name)));
    this._eventHandlers.push(game.on('chat-options-update', this.optionsUpdated));

    // Initialize chat settings in localStorage
    initLocalStorage();
  }

  public componentWillMount(): void {
    // hook up to chat
    this.state.chat.connect(this.props);
  }

  public componentDidMount(): void {
  }

  public componentWillUnmount() {
    this._eventHandlers.forEach((handle: EventHandle) => {
      handle.clear();
    });
  }

  // Render chat
  public render() {
    const current = this.state.chat.currentRoom;
    const room: ChatRoomInfo = current ? this.state.chat.getRoom(current) : undefined;
    console.log('is new chat');
    return (
      <div className='cse-chat no-select' data-input-group='block'>
        <div className='chat-frame'>
          <Info
            chat={this.state.chat}
            currentRoom={this.state.chat.currentRoom}
            selectRoom={this.selectRoom}
            leaveRoom={this.leaveRoom}
            />
          <Content
            room={room}
            send={this.sentToRoom}
            slashCommand={this.slashCommand}
            />
        </div>
      </div>
    );
  }

  private initialState(): ChatState {
    return {
      chat: (window)['_cse_chat_session'] || new ChatSession(),
      now: 0,
      config: chatConfig,
    };
  }

  // private sendToUser = (text: string, name: string) => {
  //   this.state.chat.sendToUser(text, name);
  // }

  private sentToRoom = (text: string, room: string) => {
    this.state.chat.sendToRoom(text, name);
  }

  private update = (chat: ChatSession): void => {
    this.setState({ chat, now: Date.now() });
  }

  private optionsUpdated = (config: ChatConfig): void => {
    this.setState({ config, now: Date.now() });
  }

  private selectRoom = (roomId: string): void => {
    this.state.chat.joinRoom(roomId);
  }

  private leaveRoom = (roomId: string): void => {
    this.state.chat.leaveRoom(roomId);
  }

  private joinRoom = (roomName: string, displayName?: string): void => {
    const roomId = roomName;
    this.state.chat.joinRoom(roomId);
  }

  private slashCommand = (command: string): boolean => {
    if (parseMessageForSlashCommand(command)) return true;
    const cmd = new SlashCommand(command);
    if (cmd.exec(this.state.chat)) return true;
    game.sendSlashCommand(command);
    return true;
  }
}
