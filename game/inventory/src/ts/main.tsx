/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, client} from 'camelot-unchained';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {InventoryWindow} from './components/inventory-window';

events.on('init', () => {
  ReactDOM.render(<InventoryWindow />, document.getElementById('inventory'));
  client.SubscribeInventory(true);
});
