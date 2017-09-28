/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ql } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';

export const types = {
  SET_ITEM_SLOTS: 'charactersheets-inventory-SET_ITEM_SLOTS',
};

export interface ItemSlot {
  index: number;
  item?: ql.schema.Item;
  stack?: ql.schema.Item[];
}

export interface InventoryState {
  itemSlots: ItemSlot[];
}

export function getInitialState() {
  const initialState: InventoryState = {
    itemSlots: [],
  };
  return initialState;
}

export const module = new Module({
  initialState: getInitialState(),
});

export const setItemSlots = module.createAction({
  type: types.SET_ITEM_SLOTS,
  action: (action: { itemSlots: ItemSlot[] }) => action,
  reducer: (state, action) => {
    const { itemSlots } = action;
    return {
      itemSlots,
    };
  },
});

export default module.createReducer();
