/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Design Notes: https://docs.google.com/document/d/1H_rSZLFEORrQ_HtJ3JeD12zewzwW5Px33wuN_7n9bDE/edit#

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { client, events } from 'camelot-unchained';
import { store } from './stores/Building';
import blocks from './stores/BlockStore';
import Dock from './dock/Dock';

const render = (): void => {
  ReactDOM.render(
    <Dock state={store.getState()}/>,
    document.getElementById('cse-ui-building')
  );
};

events.on('init', () => {

  // load block lists
  blocks.load();

  // monitor building mode
  // BUG? doesn't get called with current building mode!
  client.OnBuildingModeChanged((buildingMode: boolean) => {
    store.dispatch({ type: 'SET_BUILDING_MODE', mode: buildingMode } as any);
  });

  // Turn building mode off, except for C.U.B.E
  client.SetBuildingMode(client.patchResourceChannel === 27 ? 1 : 0);

  // subscribe to state changes, and render UI
  setTimeout(() => {
    store.subscribe(render);
    render();
  },10);
});

