/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import clientInterface from './clientInterface';

// interface for window cuAPI
interface WindowInterface extends Window {
  cuAPI: clientInterface;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare var window: WindowInterface;

let client: clientInterface = null;

export function hasClientAPI() {
  return (window.opener && window.opener.cuAPI) || window.cuAPI;
}

if (window.opener && window.opener.cuAPI) {
  client = window.opener.cuAPI; // bind the alias to parent (as this instance will only have basic cuAPI functions)
} else if (window.cuAPI) {
  client = window.cuAPI; // not a popout, so use existing cuAPI
} else {
  // create a mock cuAPI to return
}

export default client;
