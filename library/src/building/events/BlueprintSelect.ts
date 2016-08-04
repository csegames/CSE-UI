/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";


import BuildingEventTopics from './BuildingEventTopics';
import EventEmitter from '../../events/EventEmitter'
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  if(client.OnBlockSelected)
  {
    client.OnBlueprintSelected(function() {
      //todo: how can i tell which blueprint was selected? There are no parameters. Also, it never seems to be called
      console.log("OnBlueprintSelected: "+JSON.stringify([].slice.call(arguments)));
    });
  }
}

export default class BlockSelectListener {
  listening: boolean = false;
  type: string;
  topic: string = BuildingEventTopics.handlesBlueprintSelect;
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
