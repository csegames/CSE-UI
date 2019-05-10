/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ChatSession from './ChatSession';

export class SlashCommand {
  private name: string;
  private args: string;
  private argv: string[];

  constructor(command: string) {
    this.name = command.split(' ')[0];
    this.args = command.substr(this.name.length + 1);
    this.argv = this.args.length ? this.args.split(' ') : [];
  }

  public exec(session: ChatSession): boolean {
    switch (this.name) {
      case 'w': case 't': case 'tell': case 'pm': case 'msg':  // which?
        if (this.argv.length > 1) {
          const user = this.argv[0];
          const message = this.args.substr(user.length + 1).trim();
          session.sendToUser(message, user);
        }
        return true;
      case 'join':
        if (this.argv.length === 1) {
          session.joinRoom(this.argv[0]);
        }
        return true;
      case 'leave':
        if (this.argv.length === 1) {
          session.leaveRoom(this.argv[0]);
          session.leaveRoom(this.argv[0]);
        } else {
          session.leaveRoom(session.currentRoom);
        }
        return true;
    }
    return false;  // command was not recognised
  }
}

export default SlashCommand;
