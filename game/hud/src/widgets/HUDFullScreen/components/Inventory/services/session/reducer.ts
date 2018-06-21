/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux';

import inventoryReducer, { InventoryState } from './inventoryState';
const inventory = inventoryReducer;

import filterButtonReducer, { FilterButtonState } from './filterButtonState';
const filterButton = filterButtonReducer;

export interface CharacterState {
  inventory: InventoryState;
  filterButton: FilterButtonState;
}

export default combineReducers({
  inventory,
  filterButton,
});
