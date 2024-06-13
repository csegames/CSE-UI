/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Decimal,
  EquippedItem,
  Item,
  MyEquippedItems,
  StatGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { MoveItemRequestLocationType } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { MoveItemRequest } from '../components/items/itemUtils';

interface EquippedItemsState {
  shouldEquippedItemsRefresh: boolean;
  equippedItemsPendingRefreshes: number;
  armorClass: Decimal | null;
  itemCount: number | null;
  items: (EquippedItem | null)[] | null;
  readiedGearSlots: (string | null)[] | null;
  resistances: (StatGQL | null)[] | null;
  totalMass: Decimal | null;
}

const DefaultEquippedItemsState: EquippedItemsState = {
  shouldEquippedItemsRefresh: false,
  equippedItemsPendingRefreshes: 0,
  armorClass: null,
  itemCount: null,
  items: null,
  readiedGearSlots: null,
  resistances: null,
  totalMass: null
};

export const equippedItemsSlice = createSlice({
  name: 'equippedItems',
  initialState: DefaultEquippedItemsState,
  reducers: {
    setShouldEquippedItemsRefresh: (state: EquippedItemsState, action: PayloadAction<boolean>) => {
      state.shouldEquippedItemsRefresh = action.payload;
    },
    addEquippedItemsPendingRefresh: (state) => {
      state.equippedItemsPendingRefreshes++;
    },
    resolveEquippedItemsPendingRefresh: (state) => {
      state.equippedItemsPendingRefreshes--;
    },
    updateEquippedItems: (state, action: PayloadAction<MyEquippedItems>) => {
      state.armorClass = action.payload.armorClass;
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
      state.readiedGearSlots = action.payload.readiedGearSlots;
      state.resistances = action.payload.resistances;
      state.totalMass = action.payload.totalMass;
    },
    moveEquippedItems: (state, action: PayloadAction<[MoveItemRequest, Item][]>) => {
      if (!state.items) {
        return;
      }
      action.payload.forEach(([move, item]) => {
        const gearSlots: string[] = !move.GearSlotIDTo ? null : [move.GearSlotIDTo];

        if (move.LocationTo == MoveItemRequestLocationType.Equipment && item.location.equipped) {
          // item is currently equipped, but moving to a different equip spot
          const itemIndex = state.items.findIndex((equippedItem) => equippedItem.item.id == item.id);
          if (itemIndex !== -1) {
            state.items[itemIndex] = {
              gearSlots,
              item: {
                ...item,
                location: {
                  ...item.location,
                  equipped: {
                    ...item.location.equipped,
                    gearSlots
                  }
                }
              }
            };
          }
        } else if (move.LocationTo == MoveItemRequestLocationType.Equipment) {
          // item isn't currently equipped, but is being equipped
          state.items.push({
            gearSlots,
            item: {
              ...item,
              location: {
                ...item.location,
                inventory: null,
                equipped: {
                  characterID: item.location.inventory.characterID,
                  gearSlots
                }
              }
            }
          });
        } else if (item.location.equipped) {
          // item is being unequipped
          const itemIndex = state.items.findIndex((equippedItem) => equippedItem.item.id == item.id);
          if (itemIndex !== -1) {
            state.items.splice(itemIndex, 1);
          }
        }
      });
    }
  }
});

export const {
  setShouldEquippedItemsRefresh,
  addEquippedItemsPendingRefresh,
  resolveEquippedItemsPendingRefresh,
  updateEquippedItems,
  moveEquippedItems
} = equippedItemsSlice.actions;
