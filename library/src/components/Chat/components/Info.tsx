/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Tabs from './Tabs';
import Rooms from './Rooms';
import JoinRoomButton from './JoinRoomButton';
import ChatSession from './ChatSession';
import Users from './Users';
import RoomId from './RoomId';
import Settings from './settings/Settings';

export const defaultInfoState = {
  currentTab: 'rooms',
};

export interface InfoState {
  currentTab: string;
}

export interface InfoProps {
  chat: ChatSession;
  currentRoom: RoomId;
  selectRoom: (roomId: RoomId) => void;
  leaveRoom: (roomId: RoomId) => void;
}

class Info extends React.Component<InfoProps, InfoState> {
  constructor(props: InfoProps) {
    super(props);
    this.state = defaultInfoState;
  }

  public render() {
    const content : JSX.Element[] = [];
    switch (this.state.currentTab) {
      case 'settings':
        content.push(<Settings key='setings' />);
        break;
      case 'users':
        content.push(<Users key='users' room={this.props.chat.getRoom(this.props.currentRoom)}/>);
        break;
      case 'rooms': default:
        content.push(
          <Rooms
            key='rooms' 
            rooms={this.props.chat.rooms}
            current={this.props.currentRoom}
            select={this.props.selectRoom}
            leave={this.props.leaveRoom}
          />,
        );
        content.push(<JoinRoomButton key='join-button' join={this.props.selectRoom} getRooms={this.getRooms}/>);
        break;
    }
    return (
      <div className='chat-info'>
        <Tabs current={this.state.currentTab} select={this.select}/>
        {content}
      </div>
    );
  }

  private getRooms = () => {
    this.props.chat.getRooms();   // handle callback
  }

  private select = (tab: string): void => {
    if (this.state.currentTab !== tab) {
      this.setState({ currentTab: tab });
    }
  }
}

export default Info;
