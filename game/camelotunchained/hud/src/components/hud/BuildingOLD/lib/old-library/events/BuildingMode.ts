/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { utils } from '@csegames/library/lib/_baseGame';

import BuildingEventTopics from './BuildingEventTopics';

function run(emitter: utils.EventEmitter, topic: string) {
  camelotunchained.game.onBuildingModeChanged((mode) => {
    emitter.emit(topic, { mode });
  });
}

export default class BuildingModeListener {
  public listening: boolean = false;
  public ktype: string;
  public topic: string = BuildingEventTopics.handlesBuildingMode;

  public start(emitter: utils.EventEmitter) {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
