/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {events} from '@csegames/camelot-unchained';

import ChatSession from './ChatSession';
import RoomId from './RoomId';
import { ChatMessage, chatType } from './ChatMessage';

class SlashCommand {
  name: string;
  args: string;
  argv: string[];
  constructor(command: string) {
    this.name = command.split(' ')[0];
    this.args = command.substr(this.name.length+1);
    this.argv = this.args.length ? this.args.split(' ') : [];
  }
  exec(session : ChatSession) : boolean {
    switch(this.name) {
      case 'w': case 't': case 'tell': case 'pm': case 'msg':  // which?
        if (this.argv.length > 1) {
          const user = this.argv[0];
          const message = this.args.substr(user.length+1).trim();
          session.sendMessage(message, user);
        }
        return true;
      case 'join':
        if (this.argv.length === 1) {
          session.joinRoom(new RoomId(this.argv[0], chatType.GROUP));
        }
        return true;
      case 'leave':
        if (this.argv.length === 1) {
          session.leaveRoom(new RoomId(this.argv[0], chatType.GROUP));
          session.leaveRoom(new RoomId(this.argv[0], chatType.PRIVATE));
        } else {
          session.leaveRoom(session.currentRoom);
        }
        return true;
    }
    return false;  // command was not recognised
  }
}

export default SlashCommand;
