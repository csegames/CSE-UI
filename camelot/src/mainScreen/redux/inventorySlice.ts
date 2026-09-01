/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ItemActionTargetingTag {
  Repair = 'Asset.Activation.SelectItem.Repair'
}

export interface ItemActionTargetingData {
  /** The targeting tag of the item that instantiated this targeting action. */
  tag: ItemActionTargetingTag;
  /** The item whose targeting action is in progress (e.g. you're activating a Repair Kit). */
  sourceItem: Item;
  /**
   * Returns true if the source item is able to act upon the target item (e.g. Repair Kit targets gear, not potions).
   * If no function is specified, all items are presumed to be valid targets.
   */
  isValidTarget?: (sourceItem: Item, targetItem: Item) => boolean;
  /**
   * Gets triggered when an item is targeted, but before the item action is triggered (assuming a valid target).
   *
   * If an invalid target is passed in, this triggers, and the targeting action remains active.
   *
   * If you want an invalid target to cancel the targeting action, you must do so manually in this function, and
   * you should also manually trigger `onTargetingCanceled()` in that case, and possibly clientAPI.setCursorOverrideURL('').
   */
  onItemTargeted?: (targetItem: Item, data: ItemActionTargetingData) => void;
  /**
   * Gets triggered when the user hits Escape during a targeting action, but before the
   * itemActionTargetingData is cleared from Redux.
   */
  onTargetingCanceled?: () => void;
}

export interface InventoryStackSplit {
  itemInstanceID: string;
  amount: number;
}

interface InventoryState {
  accountBank: Item[];
  equipment: Item[];
  primary: Item[];
  stackSplit: InventoryStackSplit | null;
  wallet: Item[];
  /**
   * When an item action requires an item target (i.e. repair kit needs to target a damaged item),
   * this field tracks all data relevant to the in-progress targeting action.
   */
  itemActionTargetingData: ItemActionTargetingData | null;
}

const DefaultInventoryState: InventoryState = {
  accountBank: [],
  equipment: [],
  primary: [],
  stackSplit: null,
  wallet: [],
  itemActionTargetingData: null
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: DefaultInventoryState,
  reducers: {
    updateAccountBank: (state, action: PayloadAction<Item[]>) => {
      state.accountBank = action.payload;
    },
    updateEquipment: (state, action: PayloadAction<Item[]>) => {
      state.equipment = action.payload;
    },
    updatePrimaryInventory: (state, action: PayloadAction<Item[]>) => {
      state.primary = action.payload;
    },
    updateStackSplit: (state, action: PayloadAction<InventoryStackSplit | null>) => {
      state.stackSplit = action.payload;
    },
    updateWallet: (state, action: PayloadAction<Item[]>) => {
      state.wallet = action.payload;
    },
    updateItemActionTargeting: (state, action: PayloadAction<ItemActionTargetingData | null>) => {
      state.itemActionTargetingData = action.payload;
    }
  }
});

export const {
  updateAccountBank,
  updateEquipment,
  updatePrimaryInventory,
  updateStackSplit,
  updateWallet,
  updateItemActionTargeting
} = inventorySlice.actions;
