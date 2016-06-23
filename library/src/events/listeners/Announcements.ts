/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from '../classes/EventEmitter';
import HandlesAnnouncements from '../classes/HandlesAnnouncements';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  client.OnAnnouncement((message: string, type: number) => {
    emitter.emit(topic, {
      message: message,
      type: type
    });
  });
}

export default class AnnouncementsListener {
  listening: boolean = false;
  type: string;
  handles: HandlesAnnouncements;
  constructor(handles: HandlesAnnouncements) {
    this.handles = handles;
  }
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.handles.topic);
    }
  }
}
