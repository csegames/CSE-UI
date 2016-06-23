/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from '../classes/EventEmitter';
import HandlesInventory from '../classes/HandlesInventory';
import client from '../../core/client';
import Inventory from '../../core/classes/Inventory';
import Item from '../../core/classes/Item';

function run(emitter: EventEmitter, topic: string) {
  const inventory = new Inventory();
  client.OnInventoryAdded((item: Item) => {
    inventory.addItem(item);
    emitter.emit(topic, inventory);
  });
  client.OnInventoryRemoved((itemID: string) => {
    inventory.removeItem(itemID);
    emitter.emit(topic, inventory);
  });
}

export default class InventoryListener {
  listening: boolean = false;
  type: string;
  handles: HandlesInventory;
  constructor(handles: HandlesInventory) {
    this.handles = handles;
  }
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.handles.topic);
    }
  }
}
