/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { findIndexWhere } from '../../_baseGame/utils/arrayUtils';
import { SignalRHub } from './SignalRHub';

export * from './SignalRHub';
import initPatcherHub, { createPatcherHub, getPatcherEventName } from './hubs/patcherHub';

declare const $: any;
const hubsDef: HubDef = {};

interface HubDef {
  [id: string]: {
    init: (cb: InitCallback) => void;
    unregister: () => void;
  };
}

interface InitCallback {
  (succeeded: boolean): any;
}

const initializedHubs: string[] = [];

let initialized = false;
const startSignalR = (signalRHost: string = camelotunchained.game.signalRHost()) => {
  return;
  if (initialized) return;
  initialized = true;
  if (game.debug) console.log('initializeSignalR called');
  $(() => {
    ($ as any).connection(signalRHost);
    ($ as any).connection.hub.url = signalRHost;
    ($ as any).connection.hub.start();
  });
};

const restartSignalR = (signalRHost: string = camelotunchained.game.signalRHost()) => {
  initialized = false;
  startSignalR(signalRHost);
};

const initializeSignalRHubs = (...hubs: { name: string, callback: InitCallback }[]) => {
  if (game.debug) console.log(`initializeSignalRHubs called on hubs ${hubs.map(h => h.name).join(',')}`);
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

const unregisterSignalRHubs = (...hubNames: string[]) => {
  if (game.debug) console.log(`unregisterSignalRHubs called on hubs ${hubNames.join(',')}`);
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

export interface SignalR {
  startSignalR: (signalRHost: string) => void;
  restartSignalR: (signalRHost: string) => void;
  initializeSignalRHubs: (...hubs: { name: string, callback: InitCallback }[]) => void;
  unregisterSignalRHubs: (...hubNames: string[]) => void;

  // Hubs
  patcherHub: SignalRHub;
  createPatcherHub: typeof createPatcherHub;
  getPatcherEventName: typeof getPatcherEventName;
}

export default function(): SignalR {
  return {
    patcherHub: initPatcherHub(),

    startSignalR,
    restartSignalR,
    initializeSignalRHubs,
    unregisterSignalRHubs,
    createPatcherHub,
    getPatcherEventName,
  };
}
