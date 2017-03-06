/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import clientInterface from './clientInterface';
import devClientInterface from './devClientInterface';
import {merge} from 'lodash';

// interface for window cuAPI
interface WindowInterface extends Window {
  cuAPI: clientInterface;
  opener: WindowInterface;
  cuOverrides: any;
  patcherAPI: any;
}

// declare window implements WindowInterface
declare var window: WindowInterface;

let client: clientInterface = null;

/**
 * Check if we have the client API object, this will be true when running within the CU game client, false otherwise. 
 */
export function hasClientAPI() {
  return (window.opener && window.opener.cuAPI) || window.cuAPI;
}

if (window.opener && window.opener.cuAPI) {
  client = window.opener.cuAPI; // bind the alias to parent (as this instance will only have basic cuAPI functions)
} else if (window.cuAPI) {
  client = window.cuAPI; // not a popout, so use existing cuAPI
} else {
  // create a mock cuAPI to return
  client = devClientInterface;

}

if (!client.apiVersion) client.apiVersion = 1;
if (!client.shardID) client.shardID = 1;
if (!client.characterID) client.characterID = 'Q3jItAvTU93AzbMFcCL200';
client.signalRHost = `${client.apiHost}/signalr`;

if (window.patcherAPI) {
  client = merge(client, window.patcherAPI);
}

if (window.cuOverrides) {
  client = merge(client, window.cuOverrides);
}

export default client;
