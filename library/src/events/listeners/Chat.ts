/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from '../EventEmitter';
import { clientEventTopics } from '../defaultTopics';
import ChatMessage from '../../core/classes/ChatMessage';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  client.OnChat((type: number, from: string, body: string, nick: string, iscse: boolean) => {
    emitter.emit(topic, new ChatMessage({
      type,
      from,
      body,
      nick,
      iscse,
    }));
  });
}

export default class ChatListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = clientEventTopics.handlesChat;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
