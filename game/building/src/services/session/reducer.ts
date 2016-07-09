/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import selectionReducer, {SelectionState} from './selection';
const selection = selectionReducer;

export default combineReducers({
  selection,
});

export interface GlobalState {
  selection: SelectionState,
}
