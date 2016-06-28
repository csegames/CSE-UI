/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../core/client';

// BEING HUBS
import warbandsHub from './hubs/warbands';

export const WARBANDS_HUB = 'hubs/warbands';

// END HUBS

let didInitialize: boolean = false;
let hubs: string[] = [];

export const initializeSignalR = () => {
  if (didInitialize) return;
  $(() => {
    ($ as any).connection(client.signalRHost);
    ($ as any).connection.hub.url = client.signalRHost;
    ($ as any).connection.hub.start();
  })
};

export const reinitializeSignalR = () => {
  didInitialize = false;
  initializeSignalR();
};

export const initializeSignalRHubs = (...hubs: string[]) => {
  for (let i = 0; i < hubs.length; ++i) {
    if (hubs.findIndex((hub: string) => hub == hubs[i]) == -1) {
      switch(hubs[i]) {
        case WARBANDS_HUB:
          warbandsHub.initializeHub();
          hubs.push(hubs[i])
          break;
      }
    }
  }
}

export const unregisterSignalRHubs = (...hubs: string[]) => {
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

export default {
  initializeSignalR,
  reinitializeSignalR,
  initializeSignalRHubs,
  unregisterSignalRHubs,
}
