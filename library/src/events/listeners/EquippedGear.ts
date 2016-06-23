/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from '../classes/EventEmitter';
import HandlesEquippedGear from '../classes/HandlesEquippedGear';
import client from '../../core/client';
import EquippedGear from '../../core/classes/EquippedGear';
import Item from '../../core/classes/Item';

function run(emitter: EventEmitter, topic: string) {
  const equippedgear = new EquippedGear();
  client.OnGearAdded((item: Item) => {
    equippedgear.addItem(item);
    emitter.emit(topic, equippedgear);
  });
  client.OnGearRemoved((itemID: string) => {
    equippedgear.removeItem(itemID);
    emitter.emit(topic, equippedgear);
  });
}

export default class EquippedGearListener {
  listening: boolean = false;
  type: string;
  handles: HandlesEquippedGear;
  constructor(handles: HandlesEquippedGear) {
    this.handles = handles;
  }
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.handles.topic);
    }
  }
}
