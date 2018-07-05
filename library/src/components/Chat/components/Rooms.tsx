/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Room from './Room';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';

export interface RoomsState {
}

export interface RoomsProps {
  key: string;
  rooms: ChatRoomInfo[];
  current: RoomId;      // current room
  select: (roomId: RoomId) => void;
  leave: (roomId: RoomId) => void;
}

class Rooms extends React.Component<RoomsProps, RoomsState> {
  public render() {
    let unreadTotal = 0;
    const content : JSX.Element[] = [];
    const rooms = this.props.rooms;
    if (!rooms) return null;
    for (let i = 0; i < rooms.length; i++) {
      unreadTotal += rooms[i].unread;
      content.push(
        <Room
          key={i}
          roomId={rooms[i].roomId}
          players={rooms[i].players}
          unread={rooms[i].unread}
          selected={rooms[i].roomId.same(this.props.current)}
          select={this.props.select}
          leave={this.props.leave}
        />,
      );
    }

    // update title to display unread
    document.title = unreadTotal > 0 ? `(${unreadTotal}) Camelot Unchained` : 'Camelot Unchained';
    return (
      <div className='chat-tab-content chat-rooms'>
        {content}
      </div>
    );
  }
}

export default Rooms;
