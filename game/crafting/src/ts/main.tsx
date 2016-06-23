/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {events, core, client} from 'camelot-unchained';

import {CraftingUI} from './components/crafting-ui';

events.on('init', () => {
  ReactDom.render(<CraftingUI/>, document.getElementById("cse-ui-crafting"));
});
