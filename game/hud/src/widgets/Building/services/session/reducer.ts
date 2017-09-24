/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import selectionReducer, {SelectionState} from './selection';
import buildingReducer, {BuildingState} from './building';

const selection = selectionReducer;
const building = buildingReducer;

export default combineReducers({
  selection,
  building,
});

export interface GlobalState {
  selection: SelectionState;
  building: BuildingState;
}
