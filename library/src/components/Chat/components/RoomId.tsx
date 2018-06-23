/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { chatType } from './ChatMessage';

class RoomId {
  public type: chatType;
  public name: string;

  constructor(name: string, type: chatType) {
    this.type = type;
    this.name = name.toLowerCase();
  }

  public same(roomId: RoomId) : boolean {
    return roomId 
      && this.type === roomId.type
      && this.name === roomId.name;
  }
}

export default RoomId;
