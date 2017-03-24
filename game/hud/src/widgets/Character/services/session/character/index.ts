/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-05 16:01:23
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 14:08:45
 */

import { Module } from 'redux-typed-modules';
import { ItemInfo, InventoryItemsMap, ItemMap, StackMap } from '../../types/inventoryTypes';

export interface ValidItemMap {
  [slotType: string]: ItemMap;
}

export interface CharacterSheetState {
  potentialCharacterSlots: string[];
  equippedItems: ItemMap;
  validItems: ValidItemMap;
  inventoryItems: InventoryItemsMap;
  stacks: StackMap;
  expandedSlots: { item: ItemInfo, stack: string[] }[];
  expandedId: string;
}

export const types = {
  INITIALIZE_EQUIPPED_ITEMS: 'character-sheet/INITIALIZE_EQUIPPED_ITEMS',
  INITIALIZE_INVENTORY_ITEMS: 'character-sheet/INITIALIZE_INVENTORY_ITEMS',
  INITIALIZE_EXPANDED_ITEMS: 'character-sheet/INITIALIZE_EXPANDED_ITEMS',
  INITIALIZE_VALID_ITEMS: 'character-sheet/INITIALIZE_VALID_ITEMS',
  ON_FOCUS_POTENTIAL_CHARACTER_SLOTS: 'character-sheet/ON_FOCUS_POTENTIAL_CHARACTER_SLOTS',
  ON_DEFOCUS_POTENTIAL_CHARACTER_SLOTS: 'character-sheet/ON_DEFOCUS_POTENTIAL_CHARACTER_SLOTS',
  ON_EQUIP_ITEM: 'character-sheet/ON_EQUIP_ITEM',
  ON_UNEQUIP_ITEM: 'character-sheet/ON_UNEQUIP_ITEM',
};

export function getInitialState() {
  const initialState: CharacterSheetState = {
    potentialCharacterSlots: [],
    equippedItems: {},
    validItems: {},
    inventoryItems: {},
    stacks: {},
    expandedSlots: [],
    expandedId: '',
  };
  return initialState;
}

export const module = new Module({
  initialState: getInitialState(),
});

export const initializeEquippedItems = module.createAction({
  type: types.INITIALIZE_EQUIPPED_ITEMS,
  action: (action: { items: ItemMap }) => action,
  reducer: (state, action) => {
    const { items } = action;
    const equippedItems = {};
    const slots = {};

    Object.keys(items).forEach((key: string) => {
      const armor = items[key].stats.armor;
      const weapon = items[key].stats.weapon;

      if (armor) {
        const gearSlot = Object.keys(armor).filter((armorKey: string) =>
          armor[armorKey] !== null);

        Object.keys(armor).forEach((armorStat) => {
          if (armor[armorStat] === null) delete armor[armorStat];
        });

        slots[items[key].id] = {
          ...items[key],
          gearSlot,
        };

        return;
      } else if (weapon) {
        slots[items[key].id] = {
          ...items[key],
          gearSlot: ['weapon'],
        };
      } else {
        return;
      }
    });
    
    Object.keys(slots).forEach((key: string) => {
      slots[key].gearSlot.forEach((gearSlot: string) => {
        equippedItems[gearSlot] = slots[key];
      });
    });
    return {
      equippedItems,
    };
  },
});

export const initializeInventoryItems = module.createAction({
  type: types.INITIALIZE_INVENTORY_ITEMS,
  action: (action: { items: ItemInfo[] }) => action,
  reducer: (state, action) => {
    const { items } = action;
    const inventoryItems = {};
    const stacks = {};

    items.forEach((item: ItemInfo) => {

      const gearSlot = item.stats && (item.stats.armor ?
        Object.keys(item.stats.armor).filter(statType => item.stats.armor[statType] !== null).map(statType => statType) :
          item.stats.weapon && ['weapon']);
      const inventoryItem = item.stats ? {
        ...item,
        gearSlot,
      } : item;

      if (!inventoryItems[item.itemType]) {
        inventoryItems[item.itemType] = { [item.id]: inventoryItem };
      } else {
        inventoryItems[item.itemType][item.id] = inventoryItem;
      }
      const stackId = inventoryItem.name + inventoryItem.itemType;
      const stack = stacks[stackId] ? stacks[stackId].concat(inventoryItem.id) : [inventoryItem.id];
      stacks[stackId] = stack;
    });
    
    return {
      inventoryItems,
      stacks,
    };
  },
});

export const initializeExpandedItems = module.createAction({
  type: types.INITIALIZE_EXPANDED_ITEMS,
  action: (action: { id: string, container: { capacity?: number, items?: ItemInfo[] } }) => action,
  reducer: (state, action) => {
    if (action.id === state.expandedId) {
      return {
        expandedId: '',
        expandedSlots: [],
      };
    }
    const expandedItems = {};
    const expandedStacks = {};
    action.container.items.forEach((item) => {
      const gearSlot = item.stats && (item.stats.armor ?
        Object.keys(item.stats.armor).filter(statType => item.stats.armor[statType] !== null).map(statType => statType) :
          item.stats.weapon && ['weapon']);
      const inventoryItem = item.stats ? {
        ...item,
        gearSlot,
      } : item;

      if (!expandedItems[item.itemType]) {
        expandedItems[item.itemType] = { [item.id]: inventoryItem };
      } else {
        expandedItems[item.itemType][item.id] = inventoryItem;
      }
      const stackId = inventoryItem.name + inventoryItem.itemType;
      const stack = expandedStacks[stackId] ? expandedStacks[stackId].concat(inventoryItem.id) : [inventoryItem.id];
      expandedStacks[stackId] = stack;
    });

    const expandedSlots: { item: ItemInfo, stack: string[] }[] = [];
    const lengthOfItemSlots = Object.keys(expandedItems).length;
    Object.keys(expandedItems).forEach((itemType: string) => {
      Object.keys(expandedStacks).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .forEach((key: string) => {
        const stack = expandedStacks[key];
        const item = expandedItems[itemType][stack[0]];
        if (item) expandedSlots.push({ item, stack });
        return;
      });
    });
    for (let i = lengthOfItemSlots; i < action.container.capacity; i++) {
      expandedSlots.push({ item: null, stack: null });
    }
    return {
      expandedId: action.id,
      expandedSlots,
    };
  },
});

export const initializeValidItems = module.createAction({
  type: types.INITIALIZE_VALID_ITEMS,
  action: (action: { items: Partial<ItemInfo>[] }) => action,
  reducer: (state, action) => {
    const { items } = action;
    const validItems = {};

    items.forEach((item: ItemInfo) => {

      if (item.stats && (item.stats.armor || item.stats.weapon)) {
        const gearSlot = item.stats && (item.stats.armor ?
          Object.keys(item.stats.armor).filter(statType => item.stats.armor[statType] !== null).map(statType => statType) :
            item.stats.weapon && ['weapon']);
        const inventoryItem = {
          ...item,
          gearSlot,
        };

        inventoryItem.gearSlot.forEach((slotType: string) => {
          if (!validItems[slotType]) {
            validItems[slotType] = { [item.id]: inventoryItem };
          } else {
            validItems[slotType][item.id] = inventoryItem;
          }
        });
      }
    });

    return {
      validItems,
    };
  },
});

export const onFocusPotentialCharacterSlots = module.createAction({
  type: types.ON_FOCUS_POTENTIAL_CHARACTER_SLOTS,
  action: (action: { item: ItemInfo }) => action,
  reducer: (state, action) => {
    const potentialCharacterSlots = action.item.gearSlot;
    return {
      potentialCharacterSlots,
    };
  },
});

export const onDefocusPotentialCharacterSlots = module.createAction({
  type: types.ON_DEFOCUS_POTENTIAL_CHARACTER_SLOTS,
  action: () => {},
  reducer: (state, action) => {
    return {
      potentialCharacterSlots: [],
    };
  },
});

export const onEquipItem = module.createAction({
  type: types.ON_EQUIP_ITEM,
  action: (action: { item: ItemInfo }) => action,
  reducer: (state, action) => {
    const { item } = action;
    const equippedItems = state.equippedItems;
    const inventoryItems = state.inventoryItems;
    const validItems = state.validItems;
    const stacks = state.stacks;
    const prevEquippedItems: ItemMap = {};

    item.gearSlot.forEach((slot: string) => {
      if (equippedItems[slot] !== null) {
        prevEquippedItems[equippedItems[slot].id] = equippedItems[slot];
        validItems[slot][item.id] = equippedItems[slot];
        validItems[slot][equippedItems[slot].id] = validItems[slot][item.id];
      }
      delete validItems[slot][item.id];
      equippedItems[slot] = item;
    });

    delete inventoryItems[item.itemType][item.id];

    const stackId = item.name + item.itemType;
    stacks[stackId] = stacks[stackId].filter(itemId => itemId !== item.id);

    Object.keys(prevEquippedItems).forEach((itemId: string) => {
      const prevEquippedItem = prevEquippedItems[itemId];
      const prevEquippedStackId = prevEquippedItem.name + prevEquippedItem.itemType;
      stacks[prevEquippedStackId] = stacks[prevEquippedStackId] ?
        stacks[prevEquippedStackId].concat(prevEquippedItem.id) : [prevEquippedItem.id];

      if (inventoryItems[prevEquippedItem.itemType]) {
        inventoryItems[prevEquippedItem.itemType][prevEquippedItem.id] = prevEquippedItem;
      } else {
        inventoryItems[prevEquippedItem.itemType] = { [prevEquippedItem.id]: prevEquippedItem };
      }
    
      prevEquippedItem.gearSlot.forEach((slot) => {
        if (equippedItems[slot] === prevEquippedItem) equippedItems[slot] = null;
      });
    });

    return {
      equippedItems,
      inventoryItems,
      validItems,
      stacks,
    };
  },
});

export const onUnequipItem = module.createAction({
  type: types.ON_UNEQUIP_ITEM,
  action: (action: { item: ItemInfo, slot: string }) => action,
  reducer: (state, action) => {
    const { item, slot } = action;
    const equippedItems = state.equippedItems;
    const inventoryItems = state.inventoryItems;
    const validItems = state.validItems;
    const stacks = state.stacks;

    const equippedItem = equippedItems[slot];
    const stackId = equippedItem.name + equippedItem.itemType;
    if (inventoryItems[equippedItem.itemType]) {
      inventoryItems[equippedItem.itemType][equippedItem.id] = equippedItem;
    } else {
      inventoryItems[equippedItem.itemType] = { [equippedItem.id]: equippedItem };
    }

    stacks[stackId] = stacks[stackId] ? stacks[stackId].concat(equippedItem.id) : [equippedItem.id];
    if (validItems[slot]) validItems[slot][equippedItem.id] = equippedItem;

    item.gearSlot.forEach((itemSlot: string) => {
      equippedItems[itemSlot] = null;
    });

    return {
      equippedItems,
      inventoryItems,
      validItems,
      stacks,
    };
  },
});

export default module.createReducer();
