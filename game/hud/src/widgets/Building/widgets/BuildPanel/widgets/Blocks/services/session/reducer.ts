/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import materialsReducer, {MaterialsState} from './materials';
import materialsReplaceReducer, {MaterialsReplaceState} from './materials-replace';
const materials = materialsReducer;
const replace = materialsReplaceReducer;

export default combineReducers({
  materials,
  replace,
});

export interface GlobalState {
  materials: MaterialsState;
  replace: MaterialsReplaceState;
}
