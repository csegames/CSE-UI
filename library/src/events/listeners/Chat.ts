/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from '../classes/EventEmitter';
import HandlesChat from '../classes/HandlesChat';
import ChatMessage from '../../core/classes/ChatMessage';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  client.OnChat((type: number, from: string, body: string, nick: string, iscse: boolean) => {
    emitter.emit(topic, new ChatMessage({
      type: type,
      from: from,
      body: body,
      nick: nick,
      iscse: iscse
    }));
  });
}

export default class ChatListener {
  listening: boolean = false;
  type: string;
  handles: HandlesChat;
  constructor(handles: HandlesChat) {
    this.handles = handles;
  }
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.handles.topic);
    }
  }
}
