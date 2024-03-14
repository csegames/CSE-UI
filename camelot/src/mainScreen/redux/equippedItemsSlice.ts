/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Decimal,
  EquippedItem,
  GearSlotDefRef,
  Item,
  MyEquippedItems,
  StatGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  MoveItemRequest,
  MoveItemRequestLocationType
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';

interface EquippedItemsState {
  shouldEquippedItemsRefresh: boolean;
  equippedItemsPendingRefreshes: number;
  armorClass: Decimal | null;
  itemCount: number | null;
  items: (EquippedItem | null)[] | null;
  readiedGearSlots: (GearSlotDefRef | null)[] | null;
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
        const gearSlots: GearSlotDefRef[] = move.To.GearSlotIDs.map(
          (gearSlotID): GearSlotDefRef => ({
            id: gearSlotID,
            gearSlotType: null,
            iconClass: null,
            name: null
          })
        );
        switch (move.From.Location) {
          case MoveItemRequestLocationType.Inventory:
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
            break;
          case MoveItemRequestLocationType.Equipment:
            const itemIndex = state.items.findIndex((equippedItem) =>
              equippedItem.item.location.equipped.gearSlots.some((gearSlot) =>
                move.From.GearSlotIDs.includes(gearSlot.id)
              )
            );
            if (move.To.Position !== -1) {
              state.items.splice(itemIndex, 1);
            } else {
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
            break;
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
