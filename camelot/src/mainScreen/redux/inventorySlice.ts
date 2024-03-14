/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Decimal, Item, MyInventory } from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  MoveItemRequest,
  MoveItemRequestLocationType
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { ItemStatID } from '../components/items/itemData';
import { getItemStatValue } from '../components/items/itemUtils';

export interface InventoryStackSplit {
  itemID: string;
  amount: number;
}

interface InventoryState {
  shouldInventoryRefresh: boolean;
  inventoryPendingRefreshes: number;
  stackSplit: InventoryStackSplit | null;
  itemCount: number | null;
  items: (Item | null)[] | null;
  nestedItemCount: number | null;
  totalMass: Decimal | null;
  itemsPerRow: number | null;
  emptyRows: number;
  searchValue: string;
}

const DefaultInventoryState: InventoryState = {
  shouldInventoryRefresh: false,
  inventoryPendingRefreshes: 0,
  stackSplit: null,
  itemCount: null,
  items: null,
  nestedItemCount: null,
  totalMass: null,
  itemsPerRow: null,
  emptyRows: 0,
  searchValue: ''
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: DefaultInventoryState,
  reducers: {
    setShouldInventoryRefresh: (state: InventoryState, action: PayloadAction<boolean>) => {
      state.shouldInventoryRefresh = action.payload;
    },
    addInventoryPendingRefresh: (state) => {
      state.inventoryPendingRefreshes++;
    },
    resolveInventoryPendingRefresh: (state) => {
      state.inventoryPendingRefreshes--;
    },
    updateInventory: (state, action: PayloadAction<MyInventory>) => {
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
      state.nestedItemCount = action.payload.nestedItemCount;
      state.totalMass = action.payload.totalMass;
    },
    moveInventoryItems: (state, action: PayloadAction<[MoveItemRequest, Item][]>) => {
      if (!state.items) {
        return;
      }
      action.payload.forEach(([move, item]) => {
        const endPosition = move.To.Position;
        const itemIndex = state.items.findIndex((inventoryItem) => inventoryItem.id === move.MoveItemID);
        switch (move.From.Location) {
          case MoveItemRequestLocationType.Inventory:
            if (endPosition === -1) {
              state.items.splice(itemIndex, 1);
            } else {
              const unitCount = item.statList.find((stat) => stat.statID === ItemStatID.UnitCount).value ?? 1;
              const moveCount = state.stackSplit?.amount ?? unitCount;
              state.items.push({
                ...item,
                location: {
                  ...item.location,
                  inventory: {
                    ...item.location.inventory,
                    position: endPosition
                  }
                },
                statList: [
                  ...item.statList.filter((stat) => stat.statID !== ItemStatID.UnitCount),
                  {
                    statID: ItemStatID.UnitCount,
                    value: moveCount
                  }
                ]
              });
              if (unitCount - moveCount === 0) {
                state.items.splice(itemIndex, 1);
              } else {
                state.items[itemIndex].statList = [
                  ...item.statList.filter((stat) => stat.statID !== ItemStatID.UnitCount),
                  {
                    statID: ItemStatID.UnitCount,
                    value: unitCount - moveCount
                  }
                ];
              }
            }
            break;
          case MoveItemRequestLocationType.Equipment:
            state.items.push({
              ...item,
              location: {
                ...item.location,
                equipped: null,
                inventory: {
                  ...item.location.inventory,
                  position: endPosition
                }
              }
            });
            break;
        }
      });
      state.itemCount = state.items.length;
      let totalMass = 0;
      state.items.forEach((item) => {
        totalMass += getItemStatValue(item, ItemStatID.TotalMass);
      });
      state.totalMass = totalMass;
    },
    updateStackSplit: (state, action: PayloadAction<InventoryStackSplit>) => {
      state.stackSplit = action.payload;
    },
    modifyInventoryEmptyRows: (state, action: PayloadAction<number>) => {
      state.emptyRows += action.payload;
    },
    updateInventoryEmptyRows: (state, action: PayloadAction<number>) => {
      state.emptyRows = action.payload;
    },
    updateInventoryItemsPerRow: (state, action: PayloadAction<number>) => {
      state.itemsPerRow = action.payload;
    },
    updateInventorySearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    }
  }
});

export const {
  setShouldInventoryRefresh,
  addInventoryPendingRefresh,
  resolveInventoryPendingRefresh,
  updateInventory,
  moveInventoryItems,
  updateStackSplit,
  modifyInventoryEmptyRows,
  updateInventoryEmptyRows,
  updateInventoryItemsPerRow,
  updateInventorySearchValue
} = inventorySlice.actions;
