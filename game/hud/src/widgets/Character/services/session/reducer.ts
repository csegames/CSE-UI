/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-26 16:06:10
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-14 17:05:07
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
