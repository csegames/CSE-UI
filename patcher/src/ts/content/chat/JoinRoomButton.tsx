/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import RoomId from './RoomId';
import { chatType } from './ChatMessage';
import JoinRoomModal from './JoinRoomModal';
import Animate from '../../../../../shared/components/Animate';

export interface JoinRoomButtonState {
  showJoinRoomModal: boolean;
}

export interface JoinRoomButtonProps {
  key: string;
  join: (roomId: RoomId) => void;
  getRooms: () => void;
}

class JoinRoomButton extends React.Component<JoinRoomButtonProps, JoinRoomButtonState> {
  constructor(props : JoinRoomButtonProps) {
    super(props);
    this.promptRoom = this.promptRoom.bind(this);
    this.state = { showJoinRoomModal: false };
  }

  showModal = () => {
    this.setState({ showJoinRoomModal: true } as any);
  }

  closeModal = () => {
    this.setState({ showJoinRoomModal: false } as any);
  }

  joinRoom = (room: string) => {
    this.props.join(new RoomId(room, chatType.GROUP));
    this.setState({ showJoinRoomModal: false } as any);
  }

  generateJoinRoomModal = () => {
    return (
      <div className='fullscreen-blackout' key='join-room'>
        <JoinRoomModal closeModal={this.closeModal} joinRoom={this.joinRoom} getRooms={this.props.getRooms} />
      </div>
    );
  }

  render() {
    let modal: any = this.state.showJoinRoomModal ? this.generateJoinRoomModal() : null;
    return (
      <div>
        <div className="chat-room-join-button" onClick={this.showModal}>+ Join Room</div>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {modal}
        </Animate>
      </div>
      );
  }

  promptRoom() : void {
    const room = window.prompt('Room?');
    this.props.join(new RoomId(room, chatType.GROUP));
  }
}

export default JoinRoomButton;
