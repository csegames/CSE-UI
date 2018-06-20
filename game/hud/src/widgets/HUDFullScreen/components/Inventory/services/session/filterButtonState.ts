/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Module } from 'redux-typed-modules';
import { defaultFilterButtonIcons, InventoryFilterButton } from '../../../../lib/constants';

export const types = {
  SET_FILTER_BUTTONS: 'charactersheets-inventory-SET_FILTER_BUTTONS',
};

export interface FilterButtonState {
  filterButtons: InventoryFilterButton[];
}

export function getInitialState() {
  const initialState: FilterButtonState = {
    filterButtons: defaultFilterButtonIcons,
  };
  return initialState;
}

export const module = new Module({
  initialState: getInitialState(),
});

export const setFilterButtons = module.createAction({
  type: types.SET_FILTER_BUTTONS,
  action: (action: { filterButtons: InventoryFilterButton[] }) => action,
  reducer: (state, action) => {
    const filterButtons = action.filterButtons;
    return {
      filterButtons,
    };
  },
});

export default module.createReducer();
