/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';


import BuildingEventTopics from './BuildingEventTopics';
import { EventEmitter } from '../../events/EventEmitter';
import client from '../../core/client';
import buildUIMode from '../../core/constants/buildUIMode';

import { getBlockForBlockId, getMaterialForBlockId } from '../../building/building';

function run(emitter: EventEmitter, topic: string) {
  if (client.OnBlockSelected) {
    client.OnBuildingModeChanged((mode: buildUIMode) => {
      emitter.emit(topic, { mode });
    });
  }
}

export default class BuildingModeListener {
  public listening: boolean = false;
  public ktype: string;
  public topic: string = BuildingEventTopics.handlesBuildingMode;

  public start(emitter: EventEmitter) {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
