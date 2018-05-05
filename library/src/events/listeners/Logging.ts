/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from '../EventEmitter';
import { clientEventTopics } from '../defaultTopics';
import LogMessage from '../../core/classes/LogMessage';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  client.OnLogMessage((category: string, level: number, time: string, process: number, thread: number, message: string) => {
    emitter.emit(topic, new LogMessage({
      category,
      level,
      time,
      process,
      thread,
      message,
    }));
  });
}

export default class LoggingListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = clientEventTopics.handlesLogging;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
