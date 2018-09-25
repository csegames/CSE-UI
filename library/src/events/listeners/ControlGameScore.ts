/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EventEmitter } from '../EventEmitter';
import { getControlGame, getAllPlayers } from '../../restapi/RestAPI';
import { clientEventTopics } from '../defaultTopics';
import ControlGame from '../../core/classes/ControlGame';
import Population from '../../core/classes/Population';

const POLL_INTERVAL = 5000;
let timer: any;

function run(emitter: EventEmitter, topic: string) {
  let info: any = {};

  // Handle tick
  function tick() {
    let count = 2;

    // wait for both requests to finish before triggering
    // the event
    function done() {
      count--;
      if (count === 0) {
        emitter.emit(topic, info);
        info = {};
      }
    }

    // Get control game (score only)
    getControlGame(false)
      .then((data: ControlGame) => {
        info.score = new ControlGame(data);
        done();
      })
      .catch((error: Error) => {
        info.error = { status: (<any> error).response.status, reason: error.message };
        done();
      });

    // and player counts
    getAllPlayers()
      .then((data: Population) => {
        info.players = new Population(data);
        done();
      })
      .catch((error: Error) => {
        info.error = { status: (<any> error).response.status, reason: error.message };
        done();
      });
  }

  // if timer not running, start it
  if (!timer) {
    timer = setInterval(tick, POLL_INTERVAL);
  }
}

export default class ControlGameScoreListener {
  public listening: boolean = false;
  public topic: string = clientEventTopics.handlesControlGameScore;

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
