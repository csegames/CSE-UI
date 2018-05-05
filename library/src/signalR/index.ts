/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../core/client';
import { findIndexWhere } from '../utils/arrayUtils';

export * from './SignalRHub';
export * from './hubs/groupsHub';
export * from './hubs/patcherHub';

declare const $: any;

const hubsDef: HubDef = {};

interface HubDef {
  [id: string]: {
    init: (cb: InitCallback) => void;
    unregister: () => void;
  };
}

export interface InitCallback {
  (succeeded: boolean): any;
}

const initializedHubs: string[] = [];

let initialized = false;
export const initializeSignalR = (signalRHost: string = client.signalRHost) => {
  if (initialized) return;
  initialized = true;
  if (client.debug) console.log('initializeSignalR called');
  $(() => {
    ($ as any).connection(signalRHost);
    ($ as any).connection.hub.url = signalRHost;
    ($ as any).connection.hub.start();
  });
};

export const reinitializeSignalR = (signalRHost: string = client.signalRHost) => {
  initialized = false;
  initializeSignalR(signalRHost);
};

export const initializeSignalRHubs = (...hubs: { name: string, callback: InitCallback }[]) => {
  if (client.debug) console.log(`initializeSignalRHubs called on hubs ${hubs.map(h => h.name).join(',')}`);
  for (let i = 0; i < hubs.length; ++i) {
    if (findIndexWhere(initializedHubs, h => h === hubs[i].name) === -1) {
      const hub = hubs[i];
      const def = hubsDef[hub.name];
      if (typeof def === 'undefined' || def == null || typeof def.init !== 'function') continue;
      def.init(hub.callback);
      initializedHubs.push(hub.name);
    }
  }
};

export const unregisterSignalRHubs = (...hubNames: string[]) => {
  if (client.debug) console.log(`unregisterSignalRHubs called on hubs ${hubNames.join(',')}`);
  for (let i = 0; i < hubNames.length; ++i) {
    const index = findIndexWhere(initializedHubs, name => name === hubNames[i]);
    if (index !== -1) {
      const def = hubsDef[hubNames[i]];
      if (typeof def === 'undefined' || def == null || typeof def.unregister !== 'function') continue;
      def.unregister();
      initializedHubs.splice(index, 1);
    }
  }
};

