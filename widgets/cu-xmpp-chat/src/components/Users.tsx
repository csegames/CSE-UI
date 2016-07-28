/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Room from './Room';
import ChatRoomInfo from './ChatRoomInfo';
import { UserInfo } from './User';

export class UsersState {
}
export class UsersProps {
  key: string;
  room: ChatRoomInfo;
}

class Users extends React.Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);
  }
  render() {
    return (
      <div className="chat-tab-content chat-users">
        {this.props.room.users}
      </div>
    );
  }
}

export default Users;
