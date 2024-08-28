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
  equippedItemsPendingRefreshes: number;
  armorClass: Decimal | null;
  itemCount: number | null;
  items: (EquippedItem | null)[] | null;
  readiedGearSlots: (string | null)[] | null;
  resistances: (StatGQL | null)[] | null;
}

const DefaultEquippedItemsState: EquippedItemsState = {
  equippedItemsPendingRefreshes: 0,
  armorClass: null,
  itemCount: null,
  items: null,
  readiedGearSlots: null,
  resistances: null,
};

export const equippedItemsSlice = createSlice({
  name: 'equippedItems',
  initialState: DefaultEquippedItemsState,
  reducers: {
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
    },
    moveEquippedItems: (state, action: PayloadAction<[MoveItemRequest, Item][]>) => {
      if (!state.items) {
        return;
      }
      action.payload.forEach(([move, item]) => {
        const gearSlots: string[] = !move.GearSlotIDTo ? null : [move.GearSlotIDTo];
        const gearSlotSetIndex: number = item.staticDefinition?.gearSlotSets?.findIndex((g) => g.gearSlots.includes(move.GearSlotIDTo)) ?? -1;

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
                    gearSlotSetIndex
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
                  gearSlotSetIndex
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
  addEquippedItemsPendingRefresh,
  resolveEquippedItemsPendingRefresh,
  updateEquippedItems,
  moveEquippedItems
} = equippedItemsSlice.actions;
