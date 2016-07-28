/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../core/client';

// BEING HUBS
import warbandsHub from './hubs/warbandsHub';
import * as warbandEvents from './hubs/warbandsHub';
const WARBANDS_HUB = 'hubs/warbands';

// END HUBS

let didInitialize: boolean = false;
let hubs: string[] = [];

const initializeSignalR = () => {
  if (didInitialize) return;
  $(() => {
    ($ as any).connection(client.signalRHost);
    ($ as any).connection.hub.url = client.signalRHost;
    ($ as any).connection.hub.start();
  })
};

const reinitializeSignalR = () => {
  didInitialize = false;
  initializeSignalR();
};

const initializeSignalRHubs = (...hubs: {name: string, callback: (succeeded: boolean) => any}[]) => {
  for (let i = 0; i < hubs.length; ++i) {
    if (hubs.findIndex((hub) => hub.name == hubs[i].name) == -1) {
      switch(hubs[i].name) {
        case WARBANDS_HUB:
          warbandsHub.initializeHub(hubs[i].callback);
          hubs.push(hubs[i])
          break;
      }
    }
  }
}

const unregisterSignalRHubs = (...hubs: string[]) => {
  for (let i = 0; i < hubs.length; ++i) {
    var index = hubs.findIndex((hub: string) => hub == hubs[i]);
    if (index != -1) {
      switch(hubs[i]) {
        case WARBANDS_HUB:
          warbandsHub.unregisterEvents();
          hubs.splice(index, 1)
          break;
      }
    }
  }
}

export default Object.assign({}, {
  initializeSignalR,
  reinitializeSignalR,
  initializeSignalRHubs,
  unregisterSignalRHubs,
  WARBANDS_HUB,
}, warbandEvents);
