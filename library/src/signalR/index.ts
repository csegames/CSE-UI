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
import { findIndexWhere } from '../util/arrayutils'
export * from './SignalRHub';
export * from './hubs/groupsHub';
export * from './hubs/patcherHub';
export * from './hubs/warbandsHub';


const hubsDef: HubDef = {};

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
export const initializeSignalR = () => {
  if (initialized) return;
  initialized = true;
  $(() => {
    ($ as any).connection(client.signalRHost);
    ($ as any).connection.hub.url = client.signalRHost;
    ($ as any).connection.hub.start();
  })
};

export const reinitializeSignalR = () => {
  initialized = false;
  initializeSignalR();
};

export const initializeSignalRHubs = (...hubs: {name: string, callback: InitCallback}[]) => {
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

export const unregisterSignalRHubs = (...hubNames: string[]) => {
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

