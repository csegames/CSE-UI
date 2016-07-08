/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import bpReducer, {BlueprintsState} from './blueprints';
let blueprints = bpReducer;

export default combineReducers({
  blueprints,
});

export interface GlobalState {
  blueprints: BlueprintsState,
}
