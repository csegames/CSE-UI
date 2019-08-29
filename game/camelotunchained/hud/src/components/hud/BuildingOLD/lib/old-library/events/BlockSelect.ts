/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { utils } from '@csegames/library/lib/_baseGame';

import BuildingEventTopics from './BuildingEventTopics';

import * as building from '../building';

function run(emitter: utils.EventEmitter, topic: string) {
  camelotunchained.game.onSelectedBlockChanged((id) => {
    const material = building.getMaterialForBlockId(id);
    const block = building.getBlockForBlockId(id);
    emitter.emit(topic, { material, block });
  });
}

export default class BlockSelectListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = BuildingEventTopics.handlesBlockSelect;

  public start(emitter: utils.EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
