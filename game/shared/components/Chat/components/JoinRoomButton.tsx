/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { JoinRoomModal } from './JoinRoomModal';

export interface JoinRoomButtonState {
  showJoinRoomModal: boolean;
}

export interface JoinRoomButtonProps {
  key: string;
  join: (roomId: string) => void;
  getRooms: () => void;
}

export class JoinRoomButton extends React.Component<JoinRoomButtonProps, JoinRoomButtonState> {
  constructor(props: JoinRoomButtonProps) {
    super(props);
    this.promptRoom = this.promptRoom.bind(this);
    this.state = { showJoinRoomModal: false };
  }

  public render() {
    const modal = this.state.showJoinRoomModal ? this.generateJoinRoomModal() : null;
    return (
      <div>
        <div className='chat-room-join-button' onClick={this.showModal}>+ Join Room</div>
        {modal}
      </div>
    );
  }

  private promptRoom(): void {
    const room = window.prompt('Room?');
    this.props.join(room);
  }

  private showModal = () => {
    this.setState({ showJoinRoomModal: true });
  }

  private closeModal = () => {
    this.setState({ showJoinRoomModal: false });
  }

  private joinRoom = (room: string) => {
    this.props.join(room);
    this.setState({ showJoinRoomModal: false });
  }

  private generateJoinRoomModal = () => {
    return (
      <div className='fullscreen-blackout' key='join-room'>
        <JoinRoomModal closeModal={this.closeModal} joinRoom={this.joinRoom} getRooms={this.props.getRooms} />
      </div>
    );
  }
}

export default JoinRoomButton;
