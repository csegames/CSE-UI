/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EventEmitter } from '../EventEmitter';
import { getControlGame } from '../../restapi/RestAPI';
import { clientEventTopics } from '../defaultTopics';
import ControlGame from '../../core/classes/ControlGame';

const POLL_INTERVAL = 5000;
let timer: any;

function run(emitter: EventEmitter, topic: string) {
  function tick() {
    // TODO: switch to using cu-restapi
    getControlGame(true)
      .then((data: ControlGame) => {
        const instance = new ControlGame(data);
        emitter.emit(topic, instance);
      })
      .catch((error: Error) => {
        emitter.emit(topic, { error: { status: (<any>error).response.status, reason: error.message } });
      });
  }

  if (!timer) {
    setInterval(tick, POLL_INTERVAL);
  }
}

export default class ControlGameListener {
  public listening: boolean = false;
  public topic: string = clientEventTopics.handlesControlGame;

  public start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }

  public stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      this.listening = false;
    }
  }
}
