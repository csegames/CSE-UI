/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {events} from '@csegames/camelot-unchained';

import * as React from 'react';

export class UserInfo {
  roomName: string;
  name: string;
  isCSE: string;
  constructor(roomName: string, name: string, isCSE: string) {
    this.roomName = roomName;
    this.name = name;
    this.isCSE = isCSE;
  }
}

export interface UserState {
}
export interface UserProps {
  info: UserInfo;
  key: number;
  selected?: boolean;
}

class User extends React.Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);
    this.PM = this.PM.bind(this);
  }
  render() {
    let classes : string[] = [ 'chat-info-user' ];
    if (this.props.selected) classes.push('chat-info-user-selected');
    if (this.props.info.isCSE) classes.push('chat-info-cseuser');
    return (
      <div className={classes.join(' ')} onClick={this.PM}>
        {this.props.info.name}
      </div>
    );
  }
  PM() : void {
    events.fire('cse-chat-private-message', this.props.info.name);
  }
}

export default User;
