/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { utils } from '@csegames/camelot-unchained';

import BuildingEventTopics from './BuildingEventTopics';

function run(emitter: utils.EventEmitter, topic: string) {
  game.on('building-copy', () => {
    emitter.emit(BuildingEventTopics.handlesBlueprintCopy, {});
  });
}

export default class BlueprintCopyListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = BuildingEventTopics.handlesBlueprintCopy;

  public start(emitter: utils.EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
