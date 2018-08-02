/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import JoinRoomListItem from './JoinRoomListItem';
import { Room } from '../lib/CSEChat';

export interface JoinRoomListProps {
  rooms: Room[];
  filter: string;
  selectRoom: (room: Room) => void;
}

export interface JoinRoomListState {
}

class JoinRoomList extends React.Component<JoinRoomListProps, JoinRoomListState> {
  private hidden: string;

  public render() {
    const rooms: any[] = this.props.rooms;
    const filter: string = this.props.filter.toLowerCase();
    const names : JSX.Element[] = [];

    if (this.hidden !== filter) {
      this.hidden = undefined;            // filter changed, cancel hidden
      if (rooms.length && filter.length) {
        rooms.forEach((room: Room, index: number) => {
          const name : string = room.jid.split('@')[0];
          if (filter.length === 0 || name.toLowerCase().indexOf(filter) !== -1) {
            names.push(
              <JoinRoomListItem room={room} key={index} selectRoom={this.props.selectRoom}/>,
            );
          }
        });
      }
    }

    return (
      <div className='room-list-anchor' ref='anchor' style={{ display: names.length ? 'block' : 'none' }}>
        <div className='room-list'>{names}</div>
      </div>
    );
  }

  public componentDidMount() : void {
    document.addEventListener('mousedown', this.onmousedown, true);
  }

  public componentWillUnmount() : void {
    document.removeEventListener('mousedown', this.onmousedown, true);
  }

  private onmousedown = (e: MouseEvent) => {
    const el : HTMLElement = e.target as HTMLElement;
    if (el.className !== 'room-name') {
      // clicked outside dropdown list, hide it
      // until the filter text changes
      this.hidden = this.props.filter;
      this.forceUpdate();
    }
  }
}

export default JoinRoomList;
