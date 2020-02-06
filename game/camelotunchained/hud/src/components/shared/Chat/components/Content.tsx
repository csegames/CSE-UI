/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import ChatText from './ChatText';
import ChatInput from './ChatInput';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';

export interface ContentState {
}
export interface ContentProps {
  room: ChatRoomInfo;                   // current room
  send: (roomId: RoomId, text: string) => void;
  slashCommand: (command: string) => void;
}

class Content extends React.Component<ContentProps, ContentState> {
  public render() {
    return (
      <div className='chat-content'>
        <ChatText ref='text' room={this.props.room}/>
        <ChatInput label='SEND' send={this.send} slashCommand={this.props.slashCommand} scroll={this.scroll}/>
      </div>
    );
  }

  private send = (text: string): void => {
    this.props.send(this.props.room.roomId, text);
  }

  private scroll = (): void => {
    const text: ChatText = (this.refs['text'] as ChatText);
    text.autoScrollToBottom();
  }
}

export default Content;
