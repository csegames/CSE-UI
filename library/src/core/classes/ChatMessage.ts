/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class ChatMessage  {
  type: number;
  from: string;
  body: string;
  nick: string;
  iscse: boolean;

  constructor(chatMessage = <ChatMessage>{}) {
    this.type = chatMessage.type;
    this.from = chatMessage.from;
    this.body = chatMessage.body;
    this.nick = chatMessage.nick;
    this.iscse = chatMessage.iscse;
  }

  static create() {
    let a = new ChatMessage();
    return a;
  }
}

export default ChatMessage;
