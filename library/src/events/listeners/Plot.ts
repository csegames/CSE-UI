/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from '../EventEmitter';
import { clientEventTopics } from '../defaultTopics';

declare const cuAPI: any;

function run(emitter: EventEmitter, topic: string) {
  cuAPI.OnPlotStatus((plotOwned: boolean, permissions: number, charID: string, entityID: string) => {
    emitter.emit(topic, {
      plotOwned,
      permissions,
      charID,
      entityID,
    });
  });
}

export default class PlotListener {
  public listening: boolean = false;
  public type: string;
  public topic: string = clientEventTopics.handlesPlot;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
