/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from '../EventEmitter';
import { clientEventTopics } from '../defaultTopics';
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
  public listening: boolean = false;
  public type: string;
  public topic: string = clientEventTopics.handlesEquippedGear;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
