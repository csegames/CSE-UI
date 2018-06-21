/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from '../EventEmitter';
import { clientEventTopics } from '../defaultTopics';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  client.OnAnnouncement((message: string, type: number) => {
    emitter.emit(topic, {
      message,
      type,
    });
  });
}

export default class AnnouncementsListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = clientEventTopics.handlesAnnouncements;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
