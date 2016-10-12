/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-30 12:32:11
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-12 17:42:00
 */

import client from '../core/client';
import {SignalRHub} from './SignalRHub';

import warbandsHub from './hubs/warbandsHub';
import * as warbandEvents from './hubs/warbandsHub';

import groupsHub from './hubs/groupsHub';
import * as groupEvents from './hubs/groupsHub';
const GROUPS_HUB = 'hubs/groups';


const hubsDef: HubDef = {};

hubsDef[GROUPS_HUB] =  {
  init: (cb: InitCallback) => groupsHub.initializeHub(cb),
  unregister: () => groupsHub.unregisterEvents(),
};

interface HubDef {
  [id: string]: {
    init: (cb: InitCallback) => void;
    unregister: () => void;
  }
};

export interface InitCallback {
  (succeeded: boolean): any;
}

const initializedHubs: string[] = [];

let initialized = false;
const initializeSignalR = () => {
  if (initialized) return;
  initialized = true;
  $(() => {
    ($ as any).connection(client.signalRHost);
    ($ as any).connection.hub.url = client.signalRHost;
    ($ as any).connection.hub.start();
  })
};

const reinitializeSignalR = () => {
  initialized = false;
  initializeSignalR();
};

function findIndexWhere<T>(arr: T[], predicate: (a: T) => boolean): number {
  if (!arr) return -1;
  let i = arr.length;
  while(--i >= 0) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

const initializeSignalRHubs = (...hubs: {name: string, callback: InitCallback}[]) => {
  for (let i = 0; i < hubs.length; ++i) {
    if (findIndexWhere(initializedHubs, h => h == hubs[i].name) == -1) {
      const hub = hubs[i];
      const def = hubsDef[hub.name];
      if (typeof def === 'undefined' || def == null || typeof def.init !== 'function') continue;
      def.init(hub.callback);
      initializedHubs.push(hub.name);
    }
  }
}

const unregisterSignalRHubs = (...hubNames: string[]) => {
  for (let i = 0; i < hubNames.length; ++i) {
    var index = findIndexWhere(initializedHubs, name => name == hubNames[i]);
    if (index != -1) {
      const def = hubsDef[hubNames[i]];
      if (typeof def === 'undefined' || def == null || typeof def.unregister !== 'function') continue;
      def.unregister();
      initializedHubs.splice(index, 1);
    }
  }
}

export default Object.assign({}, {
  initializeSignalR,
  reinitializeSignalR,
  initializeSignalRHubs,
  unregisterSignalRHubs,
  SignalRHub,
  warbandsHub,
  GROUPS_HUB,
}, warbandEvents, groupEvents);
