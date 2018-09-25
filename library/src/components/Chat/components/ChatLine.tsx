/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events } from '../../../';
import * as React from 'react';
import { chatType, ChatMessage } from './ChatMessage';
import ChatLineParser from './ChatLineParser';
import CombatLogParser from './CombatLogParser';
import { chatConfig } from './ChatConfig';

export interface ChatLineState {
}

export interface ChatLineProps {
  message: ChatMessage;
  key: number;
}

class ChatLine extends React.Component<ChatLineProps, ChatLineState> {
  constructor(props: ChatLineProps) {
    super(props);
  }

  public render() {
    if (this.props.message.text === null) return null;
    let element: JSX.Element = null;
    const timestamp: JSX.Element = chatConfig.TIMESTAMPS ?
      <span className='chat-timestamp'>{ this.timestamp(this.props.message) }</span> : null;
    const chatLineClassName = this.props.message.isCSE ? 'chat-line cse-chat-line' : 'chat-line';
    switch (this.props.message.type) {
      case chatType.AVAILABLE:
        if (!chatConfig.JOIN_PARTS) break;
        element = (
          <div className={chatLineClassName}>
            <span className='chat-line-entry'>{this.props.message.nick} entered the room</span>
          </div>
        );
        break;
      case chatType.UNAVAILABLE:
        if (!chatConfig.JOIN_PARTS) break;
        element = (
          <div className={chatLineClassName}>
            <span className='chat-line-exit'>{this.props.message.nick} left the room</span>
          </div>
        );
        break;
      case chatType.GROUP:
        element = this.buildMessage(timestamp, this.props.message.text);
        break;
      case chatType.PRIVATE:
        element = this.buildMessage(timestamp, this.props.message.text, 'chat-private');
        break;
      case chatType.COMBAT:
        const cbparser = new CombatLogParser();
        element = (
          <div className={chatLineClassName}>
            {timestamp}
            <span key='0' className='chat-line-message'>{cbparser.parse(this.props.message.text)}</span>
          </div>
        );
        break;
      case chatType.SYSTEM:
      case chatType.BROADCAST:
        element = (
          <div className={chatLineClassName}>
            {timestamp}
            <span className='chat-line-system'>{this.props.message.text}</span>
          </div>
        );
        break;
      default:
        element = (
          <div className={chatLineClassName}>
            {timestamp}
            <span className='chat-line-system'>[ Unrecognised chat message type ]</span>
            <span className='chat-line-message'>{JSON.stringify(this.props.message)}</span>
          </div>
        );
    }
    return element;
  }

  private timestamp = (message: ChatMessage): string => {
    let s: string = '';
    const d: Date = message.when;
    if (message.isNewDay()) s += d.toLocaleDateString() + ' ';
    s += d.toLocaleTimeString();
    return s;
  }

  private buildMessage = (timestamp: JSX.Element, text: string, classes: string = null): JSX.Element => {
    const parser = new ChatLineParser();
    const isAction: boolean = parser.isAction(text);
    let nick: string = this.props.message.nick;
    let elements: JSX.Element[];
    if (isAction) {
      elements = parser.parseAction(text);
    } else {
      nick += ':';
      elements = [<span key='0' className='chat-line-message'>{parser.parse(text)}</span>];
    }
    const chatLineClassName = this.props.message.isCSE ? 'chat-line cse-chat-line' : 'chat-line';
    return (
      <div className={chatLineClassName + (classes ? ' ' + classes : '') }>
            {timestamp}
            <span className={`chat-line-nick ${this.props.message.isCSE ? 'cse' : ''}`} onClick={this.PM.bind(this) }>
              {nick}
            </span>
            {elements}
      </div>
    );
  }

  private PM = (): void => {
    events.fire('cse-chat-private-message', this.props.message.nick);
  }
}

export default ChatLine;
