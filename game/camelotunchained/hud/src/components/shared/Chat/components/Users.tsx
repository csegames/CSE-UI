/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import ChatRoomInfo from './ChatRoomInfo';
import User from './User';

export interface UsersState {
}

export interface UsersProps {
  key: string;
  room: ChatRoomInfo;
}

class Users extends React.Component<UsersProps, UsersState> {
  public render() {
    return (
      <div className='chat-tab-content chat-users'>
        {this.props.room.users.map((user, i) => {
          return (
            <User key={i} info={user.info} />
          );
        })}
      </div>
    );
  }
}

export default Users;
