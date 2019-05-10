/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface JoinRoomListItemProps {
  room: { name: string };
  selectRoom: (room: { name: string }) => void;
}

export interface JoinRoomListItemState {
}

export class JoinRoomListItem extends React.Component<JoinRoomListItemProps, JoinRoomListItemState> {
  public render() {
    const name: string = this.props.room.name;
    return (<div className='room-name' onClick={this.selectRoom}>{name}</div>);
  }

  private selectRoom = () => {
    this.props.selectRoom(this.props.room);
  }
}

export default JoinRoomListItem;
