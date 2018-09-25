/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import RoomId from './RoomId';
import { chatType } from './ChatMessage';

export interface RoomState {
}
export interface RoomProps {
  key: number;
  roomId: RoomId;
  players: number;
  unread?: number;
  selected?: boolean;
  select: (roomId: RoomId) => void;
  leave: (roomId: RoomId) => void;
}

class Room extends React.Component<RoomProps, RoomState> {
  public render() {
    let players: JSX.Element = undefined;
    const classes: string[] = ['chat-room'];
    if (this.props.selected) classes.push('chat-room-selected');
    if (this.props.roomId.type === chatType.GROUP) {
      players = <li className='chat-room-players'>{this.props.players} players</li>;
    } else {
      players = <li className='chat-room-players'>(private)</li>;
    }
    return (
      <div className={classes.join(' ')} onClick={this.select}>
        <div className='chat-room-close' onClick={this.leave}></div>
        <ul>
          <li className='chat-room-name'>{this.props.roomId.displayName || this.props.roomId.name}</li>
          {players}
        </ul>
        <div className={this.props.unread ? 'chat-unread' : 'chat-hidden'}>{this.props.unread}</div>
      </div>
    );
  }

  private select = (e: any): void => {
    e.stopPropagation();
    if (!this.props.selected) {
      this.props.select(this.props.roomId);
    }
  }

  private leave = (e: any): void => {
    e.stopPropagation();
    this.props.leave(this.props.roomId);
  }
}

export default Room;
