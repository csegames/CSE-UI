/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';


import BuildingEventTopics from './BuildingEventTopics';
import { EventEmitter } from '../../events/EventEmitter';
import client from '../../core/client';

import * as building from '../../building/building';
import BuildingMaterial from '../../building/classes/BuildingMaterial';
import BuildingBlock from '../../building/classes/BuildingBlock';

function run(emitter: EventEmitter, topic: string) {

  if (client.OnBlockSelected) {
    client.OnBlockSelected((blockid: number) => {
      const material = building.getMaterialForBlockId(blockid);
      const block = building.getBlockForBlockId(blockid);
      if (material) {
        emitter.emit(topic, { material, block });
      } else {
        emitter.emit(topic, building.getMissingMaterial(blockid));
      }
    });
  }
}

export default class BlockSelectListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = BuildingEventTopics.handlesBlockSelect;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
