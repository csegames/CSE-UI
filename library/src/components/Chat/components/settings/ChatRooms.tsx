/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Prefixer from '../utils/Prefixer';
import {rooms, prefixes} from './chat-defaults';
const pre = new Prefixer(prefixes.rooms);

export interface ChatRoomsProps {
}

export interface ChatRoomsState {
  rooms: Array<string>;
}

class ChatRooms extends React.Component<ChatRoomsProps, ChatRoomsState> {

  constructor(props: ChatRoomsProps) {
    super(props);
    this.state = this.initializeState();
  }
  
  // initialize state from local storage
  initializeState = (): ChatRoomsState =>  {
    let state: any = {};
    let val = JSON.parse(localStorage.getItem(pre.prefix('autojoins')));
    state.rooms = val == null ? rooms : val;
    return state;
  }

  render() {
    return (
      <div>
        Hello from ChatRooms!
      </div>
    )
  }
}

export default ChatRooms;
