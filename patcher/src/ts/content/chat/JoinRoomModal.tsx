/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events from '../../../../../shared/lib/events';
import { Room } from '../../chat/CSEChat';
import ChatSession from './ChatSession';
import JoinRoomList from './JoinRoomList';

export interface JoinRoomModalProps {
  closeModal: () => void;
  joinRoom: (roomName: string) => void;
  getRooms: () => void;
}

export interface JoinRoomModalState {
  rooms: Room[];
  filter: string;
}

class JoinRoomModal extends React.Component<JoinRoomModalProps, JoinRoomModalState> {

  constructor(props: JoinRoomModalProps) {
    super(props);
    this.state = this.initialState();
  }

  initialState(): JoinRoomModalState {
    return {
      rooms: [],
      filter: ""
    }
  }

  componentDidMount() : void {
    const input : HTMLInputElement = this.refs['roomInput'] as HTMLInputElement;
    const join : HTMLInputElement = this.refs['join'] as HTMLInputElement;
    // without this timeout, the label doesn't animate up above the input box
    setTimeout(() => {
      input.focus();
    }, 500);
    join.disabled = true;
    input.addEventListener('keyup', (ev: KeyboardEvent) => {
      join.disabled = input.value.length === 0;
      if (input.value.length > 0 && ev.keyCode === 13) {
        this.props.joinRoom(input.value);
      } else {
        this.setState({ filter: input.value } as any);
      }
    });
    this.getRooms();
  }

  getRooms = () : void => {
    events.once('chat-room-list', this.gotRooms);
    this.props.getRooms();
  }

  gotRooms = (rooms: Room[]) : void => {
    this.setState({ rooms: rooms } as any);
  }

  joinRoom = () => {
    var input : HTMLInputElement = this.refs['roomInput'] as HTMLInputElement;
    this.props.joinRoom(input.value);
  }

  selectRoom = (room: Room) => {
    this.props.joinRoom(room.jid.split('@')[0]);
  }

  render() {
    return (
      <div className="modal-dialog join-room-modal">
        <div className="input-field">
          <input id="room" type="text" ref="roomInput"/>
          <label htmlFor="room">Room Name</label>
          <JoinRoomList rooms={this.state.rooms} filter={this.state.filter} selectRoom={this.selectRoom}/>
        </div>
        <button className="wave-effects btn-flat" onClick={this.joinRoom} ref="join">JOIN ROOM</button>
        <button className="wave-effects btn-flat" onClick={this.props.closeModal} >CANCEL</button>
      </div>
    );
  }
}

export default JoinRoomModal;
