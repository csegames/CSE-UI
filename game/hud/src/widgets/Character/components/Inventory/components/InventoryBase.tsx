/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-13 11:12:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-09-13 10:53:08
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';
import { webAPI, client, ql } from 'camelot-unchained';

import { InventorySlotItemDef, CraftingSlotItemDef, SlotType, slotDimensions } from './InventorySlot';
import { InventoryRow } from './InventoryRow';

import { InventoryItemFragment, InventoryBaseQuery } from '../../../../../gqlInterfaces';
import { nullVal, InventoryFilterButton, emptyStackHash } from '../../../lib/constants';
import { UpdateInventoryItems } from '../../../lib/eventNames';
import {
  createMoveItemRequestToInventoryPosition,
  firstAvailableSlot,
  generateStackGroupID,
  getIcon,
  getItemDefinitionId,
  getItemInstanceID,
  getItemInventoryPosition,
  getItemMapID,
  getItemMass,
  getItemQuality,
  getItemUnitCount,
  hasActiveFilterButtons,
  hasFilterText,
  isCraftingItem,
  isStackedItem,
  itemHasPosition,
  shouldShowItem,
} from '../../../lib/utils';

export interface InventoryBaseStyle extends StyleDeclaration {
  InventoryBase: React.CSSProperties;
}

export const defaultInventoryBaseStyle: InventoryBaseStyle = {
  InventoryBase: {
    
  },
};

export interface SlotNumberToItem {
  [id: number]: {
    id: string;
    isStack: boolean;
    isCrafting: boolean;
    item?: InventoryItemFragment;
  };
}

export interface InventoryBaseProps {
  styles?: Partial<InventoryBaseStyle>;
  searchValue: string;
  activeFilters: {[id:string]:InventoryFilterButton};
  onChangeInventoryItems?: (inventoryItems: InventoryItemFragment[]) => void;
  inventoryItems?: InventoryItemFragment[];
}

export interface InventoryBaseWithQLProps extends GraphQLInjectedProps<InventoryBaseQuery> {
  styles?: Partial<InventoryBaseStyle>;
  searchValue: string;
  activeFilters: {[id:string]:InventoryFilterButton};
  onChangeInventoryItems?: (inventoryItems: InventoryItemFragment[]) => void;
  inventoryItems?: InventoryItemFragment[];
}

export interface ItemIDToInfo {
  [id: string]: {
    slot: number;
    icon: string;
  };
}

export interface InventoryBaseState {
  slotsPerRow: number;
  rowCount: number;
  slotCount: number;
  firstEmptyIndex: number;

  itemIdToInfo: ItemIDToInfo;
  slotNumberToItem: SlotNumberToItem;

  // map of item id to a stack group id
  // a stack group id is a `${stackHash}:${number}`
  // the stack group is used to identify items that
  // share a stack hash but not the same slot in
  // the inventory. The stack group id is used in 
  // the itemIdToInfo & slotNumberToItemId maps
  stackGroupIdToItemIDs: {[id:string]:string[]};
  itemIDToStackGroupID: {[id:string]:string};

  craftingNameToItemIDs: {[name:string]:string[]};
}

let stackGroupCounter = 0;

export function renderSlots(state: InventoryBaseState, props: InventoryBaseProps) {
  const ss = StyleSheet.create(defaultInventoryBaseStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.InventoryBase, custom.InventoryBase)}>
      Hello World!
    </div>
  );
}

export function defaultInventoryBaseState(): InventoryBaseState {
  return {
    slotsPerRow: 0,
    rowCount: 0,
    slotCount: 0,
    firstEmptyIndex: 0,
    itemIdToInfo: {},
    slotNumberToItem: {},
    stackGroupIdToItemIDs: {},
    itemIDToStackGroupID: {},
    craftingNameToItemIDs: {},
  };
}

export function createRowElementsForCraftingItems(state: InventoryBaseState, itemData: {items: InventoryItemFragment[]}) {
  const rows: JSX.Element[] = [];
  const rowData: CraftingSlotItemDef[][] = [];

  let slotIndex = 0;
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: CraftingSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const item = itemData.items[slotIndex];

      if (!item) {
        rowItems.push({slotType: SlotType.Empty, icon: ' '});
        continue;
      }
      rowItems.push({
        slotType: SlotType.CraftingItem,
        icon: getIcon(item),
        itemID: item.id,
        quality: getItemQuality(item),
        itemCount: getItemUnitCount(item),
        item,
      });
      ++slotIndex;
    }
    rows.push((
      <InventoryRow key={rowIndex} items={rowItems} />
    ));
    rowData.push(rowItems);
  }
  return {
    rows,
    rowData,
  };
}

export function createRowElements(state: InventoryBaseState, itemData: {items: InventoryItemFragment[]}) {
  const rows: JSX.Element[] = [];
  const rowData: InventorySlotItemDef[][] = [];

  const itemMap = itemData ? _.keyBy(itemData.items, i => i.id) : {};
  
  let slotIndex = 0;
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: InventorySlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const itemDef = state.slotNumberToItem[slotIndex++];
      if (!itemDef) {
        rowItems.push({slotType: SlotType.Empty, icon: ' '});
        continue;
      }
      
      if (itemDef.isCrafting) {
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: state.itemIdToInfo[itemDef.id].icon,
          groupStackHashID: itemDef.id,
          stackedItems: state.stackGroupIdToItemIDs[itemDef.id].map(id => itemMap[id]),
        });
        continue;
      }

      if (itemDef.isStack) {
        rowItems.push({
          slotType: SlotType.Stack,
          icon: state.itemIdToInfo[itemDef.id].icon,
          groupStackHashID: itemDef.id,
          stackedItems: state.stackGroupIdToItemIDs[itemDef.id].map(id => itemMap[id]),
          item: itemDef.item,
        });
        continue;
      }
      rowItems.push({
        slotType: SlotType.Standard,
        icon: state.itemIdToInfo[itemDef.id].icon,
        itemID: itemDef.id,
        item: itemDef.item,
      });
    }

    rows.push((
      <InventoryRow key={rowIndex} items={rowItems} />
    ));
    rowData.push(rowItems);
  }  
  return {
    rows,
    rowData,
  };
}

export function distributeItems(slotsData: {
                                slotsPerRow: number,
                                rowCount: number,
                                slotCount: number,
                              },
                              itemData: {
                                items: InventoryItemFragment[],
                              },
                              state: InventoryBaseState,
                              props: InventoryBaseProps): InventoryBaseState {
  if (!itemData || !itemData.items) {
    return {
      ...slotsData,
      itemIdToInfo: {},
      slotNumberToItem: {},
      stackGroupIdToItemIDs: {},
      itemIDToStackGroupID: {},
      craftingNameToItemIDs: {},
      firstEmptyIndex: 0,
    };
  }
  const items = props.inventoryItems && props.inventoryItems.length > 0 ? {items: props.inventoryItems} : itemData;
  if (hasActiveFilterButtons(props.activeFilters) || hasFilterText(props.searchValue)) {
    return distributeFilteredItems(slotsData, items, state, props);
  } else {
    return distributeItemsNoFilter(slotsData, items, state, props);
  }
}

// we are not filtering items here, put items based on slot position
export function distributeItemsNoFilter(slotsData: {
                                        slotsPerRow: number,
                                        rowCount: number,
                                        slotCount: number,
                                      },
                                      itemData: {
                                        items: InventoryItemFragment[],
                                      },
                                      state: InventoryBaseState,
                                      props: InventoryBaseProps): InventoryBaseState {
  const itemIdToInfo: {[id:string]:{slot:number,icon:string}} = {};
  const slotNumberToItem = {};
  const stackGroupIdToItemIDs = {};
  const itemIDToStackGroupID = {};
  const craftingNameToItemIDs = {};
  
  if (itemData.items && props.onChangeInventoryItems) {
    props.onChangeInventoryItems(itemData.items);
  }

  let firstEmptyIndex = 0;
  const moveRequests: webAPI.MoveItemRequest[] = [];

  // first we'll split up items into different categories for how the inventory handles things differently
  // such as stacks, crafting stuffs, and items with or without position
  const partitionedItems = partitionItems(itemData.items);
  // place normal items with a position into their slots positions.
  partitionedItems.positionedItems.forEach(item => {
    const wantPosition = getItemInventoryPosition(item);
    const id = getItemMapID(item, {stackHashToStackGroupID: partitionedItems.stackHashToGroupIDMap});

    if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition] !== id)) {
      partitionedItems.noPositionItems.push(item);
      return;
    }
    
    slotNumberToItem[wantPosition] = {
      id,
      isCrafting: isCraftingItem(item),
      isStack: isStackedItem(item),
      item,
    };
    itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };
  });

  // place stacked items with position into their slots positions.
  _.values(partitionedItems.stackedItemsWithPosition).forEach(itemArr => {
    itemArr.forEach(item => {
      const wantPosition = getItemInventoryPosition(item);
      const id = getItemMapID(item, {stackHashToStackGroupID: partitionedItems.stackHashToGroupIDMap});

      if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition] !== id)) {
        partitionedItems.noPositionStackedItems[id] = itemArr;
        return;
      }

      slotNumberToItem[wantPosition] = {
        id,
        isCrafting: isCraftingItem(item),
        isStack: isStackedItem(item),
        item,
      };
      itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };
    });
  });

  // place crafted items if they have a position into their spot.
  _.values(partitionedItems.craftingItems).forEach(craftingItemArr => {
    craftingItemArr.forEach(item => {
      const wantPosition = getItemInventoryPosition(item);
      const id = getItemMapID(item, {stackHashToStackGroupID: partitionedItems.stackHashToGroupIDMap});

      if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition] !== id)) {
        partitionedItems.noPositionItems.push(item);
        return;
      }
      
      slotNumberToItem[wantPosition] = {
        id,
        isCrafting: isCraftingItem(item),
        isStack: isStackedItem(item),
        item,
      };
      itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };
      if (!stackGroupIdToItemIDs[id]) {
        stackGroupIdToItemIDs[id] = [item.id];
      } else {
        stackGroupIdToItemIDs[id].push(item.id);
      }
    });
  });

  // splits the array of items into two arrays, [0] being those with an inventory position, [1] without
  const partitioned = _.partition(itemData.items, i => getItemInventoryPosition(i) > -1);

  // for items with a position, split out items that have a stack hash, [0] being those with stackHash, [1] without
  const positionedStacksPartitioned = _.partition(partitioned[0], i => i.stackHash !== emptyStackHash);

  // create a map of items that have a position, keyed by their item id
  const itemsWithPosition = _.keyBy(positionedStacksPartitioned[0], i => i.id);

  // array of items without a position
  let noPositionArr = [...partitionedItems.noPositionItems];

  _.values(partitionedItems.noPositionStackedItems).forEach(itemArr => {
    noPositionArr = _.every(itemArr, item => _.find(noPositionArr, item)) ? noPositionArr : noPositionArr.concat(itemArr);
  });

  // iterate over non-stacked items with a position, check if there are position conflicts, if so then they
  // get added to the no position array. Items are positioned first come first serve
  Object.keys(itemsWithPosition).forEach((key) => {
    const item = itemsWithPosition[key];

    const position = getItemInventoryPosition(item);
    let id = getItemMapID(item, {stackHashToStackGroupID: partitionedItems.stackHashToGroupIDMap});

    // check if something is in this position already...
    if (slotNumberToItem[position] && slotNumberToItem[position] !== id) {
      // if we're here then something else is in the slot and it's not this item or a stack of this item
      // so push this into the no position array and sort position out that way.
      noPositionArr.push(item);
      return;
    }

    // we will use stack hash if valid, otherwise item id as the id
    slotNumberToItem[position] = {
      id,
      isCrafting: isCraftingItem(item),
      isStack: isStackedItem(item),
      item,
    };
    itemIdToInfo[id] = { slot: position, icon: getIcon(item) };
  });
  
  // figure out next available position

  // now we sort out positions for every item that doesn't have a position.
  // after figuring out the position, we will tell the server the position
  // using a batched api request so that they will remain in these positions
  // in the future
  noPositionArr.forEach((item, index) => {
    const id = getItemMapID(item, {stackHashToStackGroupID: partitionedItems.stackHashToGroupIDMap});
    const itemInstanceId = getItemInstanceID(item);
    const stackHash = isCraftingItem(item) ? getItemDefinitionId(item) : item.stackHash;
    // first check if there is a matching stack hash, then use that position
    
    if (partitionedItems.stackHashToGroupIDMap[stackHash]) {
      const stackGroupID = partitionedItems.stackHashToGroupIDMap[stackHash][0].stackGroupID;
      const stackGroupPosition = itemIdToInfo[stackGroupID];
      
      if (stackGroupPosition) {
        moveRequests.push(createMoveItemRequestToInventoryPosition(item, stackGroupPosition.slot));
        
        if (!_.find(stackGroupIdToItemIDs[stackGroupID], itemId => itemInstanceId === itemId)) {
          stackGroupIdToItemIDs[stackGroupID] = !stackGroupIdToItemIDs[stackGroupID] ? [itemInstanceId] :
            stackGroupIdToItemIDs[stackGroupID].concat(itemInstanceId);
        }        

        itemIDToStackGroupID[itemInstanceId] = stackGroupID;

        slotNumberToItem[stackGroupPosition.slot] = {
          id,
          isCrafting: isCraftingItem(item),
          isStack: isStackedItem(item),
          item,
        };

        itemIdToInfo[id] = stackGroupPosition;
        itemIdToInfo[itemInstanceId] = stackGroupPosition;
        return;
      } else {
        const firstAvailSlot = firstAvailableSlot(firstEmptyIndex, slotNumberToItem);
        moveRequests.push(createMoveItemRequestToInventoryPosition(item, firstAvailSlot));

        stackGroupIdToItemIDs[stackGroupID] = !stackGroupIdToItemIDs[stackGroupID] ? [itemInstanceId] :
          stackGroupIdToItemIDs[stackGroupID].concat(itemInstanceId);

        itemIDToStackGroupID[itemInstanceId] = stackGroupID;

        itemIdToInfo[id] = { slot: firstAvailSlot, icon: getIcon(item) };
        itemIdToInfo[itemInstanceId] = { slot: firstAvailSlot, icon: getIcon(item) };
      }
    }

    const position = firstAvailableSlot(firstEmptyIndex, slotNumberToItem);
    moveRequests.push(createMoveItemRequestToInventoryPosition(item, position));
    slotNumberToItem[position] = {
      id,
      isCrafting: isCraftingItem(item),
      isStack: isStackedItem(item),
      item,
    };
    itemIdToInfo[id] = { slot: position, icon: getIcon(item) };
  });
  
  // batch move all items with no position
  if (moveRequests.length > 0) {
    webAPI.ItemAPI.BatchMoveItems(webAPI.defaultConfig, client.loginToken, client.shardID, client.characterID, moveRequests);
  }
  // const vox = _.find(itemData.items, item => item.staticDefinition.name === 'Torch');
  // const voxIndex = _.findIndex(itemData.items, item => item.location.inventory.position ===
  //   (vox && vox.location.inventory.position));
  // console.log('Torch item');
  // console.log(voxIndex);
  // console.log(voxIndex && slotNumberToItem[voxIndex]);
  // console.log(vox);
  return {
    ...slotsData,
    itemIdToInfo,
    slotNumberToItem,
    stackGroupIdToItemIDs,
    itemIDToStackGroupID,
    firstEmptyIndex,
    craftingNameToItemIDs,
  };
}

// we're filtering items here, put items into slots without regard to position
// defined on the item
export function distributeFilteredItems(slotsData: {
                                        slotsPerRow: number,
                                        rowCount: number,
                                        slotCount: number,
                                      },
                                      itemData: {
                                        items: InventoryItemFragment[],
                                      },
                                      state: InventoryBaseState,
                                      props: InventoryBaseProps): InventoryBaseState {
  const oldItemIdToInfo = _.merge({}, state.itemIdToInfo);
  const oldSlotNumberToItem = Object.assign({}, state.slotNumberToItem);
  const stackGroupIdToItemIDs = Object.assign({}, state.stackGroupIdToItemIDs);
  const itemIDToStackGroupID = Object.assign({}, state.itemIDToStackGroupID);
  const craftingNameToItemIDs = Object.assign({}, state.craftingNameToItemIDs);

  const itemIdToInfo: {[id:string]:{slot:number,icon:string}} = {};
  const slotNumberToItem: {[id:number]:{id:string; isStack:boolean; isCrafting:boolean;}} = {};
  const filteredItems = _.keyBy(itemData.items.filter(i =>
    shouldShowItem(i, props.activeFilters, props.searchValue)), i => i.id);

  let indexCounter = 0;
  for (let i = 0; i < state.slotCount; ++i) {
    const itemDef = oldSlotNumberToItem[i];
    if (!itemDef) continue;

    let itemID = itemDef.id;
    if (itemDef.isStack || itemDef.isCrafting) {
      itemID = stackGroupIdToItemIDs[itemDef.id][0];
    }

    if (!filteredItems[itemID]) {
      continue;
    }

    slotNumberToItem[indexCounter] = itemDef;
    itemIdToInfo[itemDef.id] = { slot: indexCounter, icon: oldItemIdToInfo[itemID].icon };
    itemIdToInfo[itemID] = { slot: indexCounter, icon: oldItemIdToInfo[itemID].icon };

    indexCounter++;
  }

  for (var key in filteredItems) {
    if (itemIdToInfo[key]) continue;

    const item = filteredItems[key];

    const isCrafting = isCraftingItem(item);
    const isStack = isStackedItem(item);
    const id = isCrafting || isStack ? itemIDToStackGroupID[item.id] : item.id;

    const itemDef = {
      id,
      isStack,
      isCrafting,
      item,
    };

    let itemID = itemDef.id;
    if (itemDef.isStack || itemDef.isCrafting) {
      itemID = stackGroupIdToItemIDs[itemDef.id][0];
    }

    if (itemIdToInfo[itemID]) continue;

    slotNumberToItem[indexCounter] = itemDef;

    itemIdToInfo[itemDef.id] = { slot: indexCounter, icon: getIcon(item) };
    itemIdToInfo[itemID] = { slot: indexCounter, icon: getIcon(item) };
    indexCounter++;
  }

  return {
    ...slotsData,
    itemIdToInfo,
    slotNumberToItem,
    stackGroupIdToItemIDs,
    itemIDToStackGroupID,
    firstEmptyIndex: indexCounter,
    craftingNameToItemIDs,
  };
}

export function partitionItems(items: InventoryItemFragment[]) {
  const itemIdToIcon: {[id:string]:string} = {};
  const craftingItems: {[name:string]: InventoryItemFragment[]} = {};
  const stackedItemsWithPosition: {[stackGroupID:string]: InventoryItemFragment[]} = {};
  const noPositionStackedItems: {[stackGroupID:string]: InventoryItemFragment[]} = {};
  const positionedItems: InventoryItemFragment[] = [];
  const noPositionItems: InventoryItemFragment[] = [];
  const stackHashToGroupIDMap: {[stackHash: string]: {position: number,stackGroupID:string}[]} = {};

  const temporaryNoPositionStackedItems: InventoryItemFragment[] = [];

  const moveRequests: webAPI.MoveItemRequest[] = [];

  items.forEach(item => {
    itemIdToIcon[item.id] = item.staticDefinition.iconUrl;
    if (isCraftingItem(item)) {
      const name = getItemDefinitionId(item);
      if (craftingItems[name]) {
        craftingItems[name].push(item);
      } else {
        craftingItems[name] = [item];
      }
    }

    if (isStackedItem(item) || isCraftingItem(item)) {
      const stackHash = isCraftingItem(item) ? getItemDefinitionId(item) : item.stackHash;

      if (itemHasPosition(item)) {
        const wantPosition = getItemInventoryPosition(item);

        let stackGroupID = '';

        let stackGroupIndex = -1;
        if (stackHashToGroupIDMap[stackHash])
        {
          stackGroupIndex = _.findIndex(stackHashToGroupIDMap[stackHash], gm => gm.position === wantPosition);
        }

        if (stackGroupIndex > -1) {
          stackGroupID = stackHashToGroupIDMap[stackHash][stackGroupIndex].stackGroupID;
        } else {
          stackGroupID = generateStackGroupID(stackHash, stackGroupCounter);
          stackGroupCounter++;
          stackHashToGroupIDMap[stackHash] = [{
            position: wantPosition,
            stackGroupID,
          }];
        }

        if (stackedItemsWithPosition[stackGroupID]) {
          stackedItemsWithPosition[stackGroupID].push(item);
        } else {
          stackedItemsWithPosition[stackGroupID] = [item];
        }
        return;
      
      } else {

        let stackGroupID = '';
        let mapEntries =  stackHashToGroupIDMap[stackHash];
        let stackGroupIndex = mapEntries ? 0 : -1;

        if (stackGroupIndex > -1) {
          stackGroupID = mapEntries[0].stackGroupID;
          stackedItemsWithPosition[stackGroupID].push(item);
          
          // this item didn't have a position, so we need to queue it up to request
          // a move to this position on the server.
          moveRequests.push(createMoveItemRequestToInventoryPosition(item, 
            mapEntries[stackGroupIndex].position));

        } else {
          // this item has no position, is a stack, but no other stack found... YET!
          // do a double check loop after this main loop through items for stacks
          // without position in the case that an item later in this main list has
          // a position and matching stackHash
          temporaryNoPositionStackedItems.push(item);
        }
        return;
      }
    } else {
      if (itemHasPosition(item)) {
        positionedItems.push(item);
        return;
      }
      noPositionItems.push(item);
      return;
    }
  });
  temporaryNoPositionStackedItems.forEach(item => {
    const foundOtherStack = _.find(items, (invItem) => item.stackHash === invItem.stackHash);
    const stackHash = isCraftingItem(item) ? getItemDefinitionId(item) : item.stackHash;

    if (foundOtherStack && itemHasPosition(foundOtherStack)) {
      const wantPosition = getItemInventoryPosition(item);

      let stackGroupID = '';
      
      let stackGroupIndex = -1;
      if (stackHashToGroupIDMap[stackHash])
      {
        stackGroupIndex = _.findIndex(stackHashToGroupIDMap[stackHash], gm => gm.position === wantPosition);
      }

      if (stackGroupIndex > -1) {
        stackGroupID = stackHashToGroupIDMap[stackHash][stackGroupIndex].stackGroupID;
      } else {
        stackGroupID = generateStackGroupID(stackHash, stackGroupCounter);
        stackGroupCounter++;
        stackHashToGroupIDMap[stackHash] = [{
          position: wantPosition,
          stackGroupID,
        }];
      }

      if (stackedItemsWithPosition[stackGroupID]) {
        stackedItemsWithPosition[stackGroupID].push(item);
      } else {
        stackedItemsWithPosition[stackGroupID] = [item];
      }
      return;
    }

    if (foundOtherStack && !itemHasPosition(foundOtherStack)) {
      let stackGroupId = '';
      if (stackHashToGroupIDMap[stackHash]) {
        stackGroupId = stackHashToGroupIDMap[stackHash][0].stackGroupID;
      } else {
        stackGroupId = generateStackGroupID(stackHash, stackGroupCounter);
        stackGroupCounter++;
        stackHashToGroupIDMap[stackHash] = [{
          stackGroupID: stackGroupId,
          position: -1,
        }];
      }
      
      if (noPositionStackedItems[stackGroupId]) {
        noPositionStackedItems[stackGroupId].push(item);
      } else {
        noPositionStackedItems[stackGroupId] = [item];
      }
      return;
    }
  });
  return {
    itemIdToIcon,
    craftingItems,
    stackedItemsWithPosition,
    noPositionStackedItems,
    positionedItems,
    noPositionItems,
    stackHashToGroupIDMap,
    moveRequests,
  };
}

export function getContainerHeaderInfo(stackedItems: InventoryItemFragment[]) {
  let totalUnitCount = 0;
  let averageQuality = 0;
  let weight = 0;

  stackedItems.forEach((item) => {
    totalUnitCount += getItemUnitCount(item);
    averageQuality += getItemQuality(item);
    weight += getItemMass(item);
  });

  return {
    totalUnitCount: Number(totalUnitCount.toFixed(2)),
    averageQuality: Number((averageQuality / stackedItems.length).toFixed(2)),
    weight: Number(weight.toFixed(2)),
  };
}

export function allInventoryFooterButtonsDisabled(props: InventoryBaseProps) {
  return hasActiveFilterButtons(props.activeFilters) || hasFilterText(props.searchValue);
}

export function inventoryFooterRemoveAndPruneButtonDisabled(rowData: InventorySlotItemDef[][], heightOfBody: number) {
  const lastRowIndexOnScreen = Math.floor((heightOfBody - 15) / (slotDimensions + 4));
  const isRowOutsideBody = _.indexOf(rowData, (_.last(rowData))) >= lastRowIndexOnScreen;
  const lastRowIsEmpty = _.findIndex(_.last(rowData), item => item.slotType !== SlotType.Empty) === -1;
  return !isRowOutsideBody || !lastRowIsEmpty;
}

export function inventoryContainerRemoveButtonDisabled(rowData: InventorySlotItemDef[][]) {
  return _.indexOf(rowData, (_.last(rowData))) < 2;
}

export function addRowOfSlots(state: InventoryBaseState, props: InventoryBaseProps) {
  return {
    ...state,
    rowCount: state.rowCount + 1,
    slotCount: state.slotCount + state.slotsPerRow,
  };
}

export function removeRowOfSlots(state: InventoryBaseState,
                                rowData: InventorySlotItemDef[][],
                                heightOfBody: number,
                                isContainer?: boolean) {
  const lastRowIndexOnScreen = Math.floor((heightOfBody - 15) / (slotDimensions + 4));
  const isEmptyRow = _.findIndex(_.last(rowData), item => item.slotType !== SlotType.Empty) === -1;
  const isRowOutsideBody = _.indexOf(rowData, (_.last(rowData))) >= lastRowIndexOnScreen;
  if (!isContainer) {
    if (isEmptyRow && isRowOutsideBody) {
      return {
        ...state,
        rowCount: state.rowCount - 1,
        slotCount: state.slotCount - state.slotsPerRow,
      };
    }
  } else {
    if (isEmptyRow && _.indexOf(rowData, (_.last(rowData))) >= 2) {
      return {
        ...state,
        rowCount: state.rowCount - 1,
        slotcount: state.slotCount - state.slotsPerRow,
      };
    }
  }
}

export function pruneRowsOfSlots(state: InventoryBaseState,
                                    rowData: InventorySlotItemDef[][],
                                    heightOfBody: number,
                                    isContainer?: boolean) {
  const lastRowIndexOnScreen = Math.floor((heightOfBody - 15) / (slotDimensions + 4));
  const lastRowContainingItem = _.findLastIndex(rowData, row => _.find(row, item => item.slotType !== SlotType.Empty));
  if (!isContainer) {
    const deleteRows = lastRowContainingItem >= lastRowIndexOnScreen ?
      (state.rowCount - lastRowContainingItem) - 1 : state.rowCount - lastRowIndexOnScreen;
    return {
      ...state,
      rowCount: state.rowCount - deleteRows,
      slotCount: state.slotCount - (state.slotsPerRow * deleteRows),
    };
  } else if (isContainer) {
    const deleteRows = _.findLastIndex(rowData, row => !_.find(row, slot => slot.slotType !== SlotType.Empty)) - 1;
    if (state.rowCount - deleteRows === 2) {
      return {
        ...state,
        rowCount: state.rowCount - deleteRows,
        slotCount: state.slotCount - (state.slotsPerRow * deleteRows),
      };
    }
  }
}

export function onUpdateInventoryItemsHandler(state: InventoryBaseState,
                                              props: InventoryBaseProps,
                                              payload: UpdateInventoryItems) {
  // This updates slotNumberToItem and itemIdToInfo when an item is equipped
  const itemIdToInfo = state.itemIdToInfo;
  const slotNumberToItem = state.slotNumberToItem;
  const itemIDToStackGroupID = state.itemIDToStackGroupID;
  const stackGroupIdToItemIDs = state.stackGroupIdToItemIDs;
  let inventoryItems = props.inventoryItems;

  if (payload.equippedItem && payload.inventoryItem) {
    const equippedItems = payload.equippedItem.length > 0 ? payload.equippedItem : [payload.equippedItem];
    equippedItems.forEach((equippedItem) => {
      // If equipped item and inventory item are provided by event. EQUIP
      const slotNumber = itemIdToInfo[payload.inventoryItem.id] && itemIdToInfo[payload.inventoryItem.id].slot;
      const firstAvailSlot = firstAvailableSlot(0, slotNumberToItem);
      const slot = slotNumber >= 0 && slotNumber < firstAvailSlot ? slotNumber : firstAvailSlot;

      if (slotNumber > firstAvailSlot) {
        slotNumberToItem[slotNumber] = null;
      }

      if (itemIdToInfo[payload.inventoryItem.id]) {
        inventoryItems = _.filter(inventoryItems, item => item.id !== payload.inventoryItem.id);
      }

      inventoryItems = [...inventoryItems, {
        ...equippedItem.item,
        location: {
          inventory: {
            position: slot,
          },
      }} as InventoryItemFragment];

      slotNumberToItem[slot] = {
        id: equippedItem.item.id,
        isCrafting: false,
        isStack: false,
        item: equippedItem.item,
      };
      itemIdToInfo[equippedItem.item.id] = {
        slot,
        icon: equippedItem.item.staticDefinition.iconUrl,
      };
      delete itemIdToInfo[payload.inventoryItem.id];
      if (payload.type === 'Equip') {
        equipItemRequest(payload.inventoryItem, payload.willEquipTo, equippedItem, slot);
      }
    });
    
  } else if (payload.inventoryItem && itemIdToInfo[payload.inventoryItem.id]) {
    // If only inventory item provided by event. EQUIP or DROP
    const slotNumber = itemIdToInfo[payload.inventoryItem.id].slot;
    if (slotNumberToItem[slotNumber].id === payload.inventoryItem.id) {
      inventoryItems = _.filter(inventoryItems, item => slotNumberToItem[slotNumber].item.id !== item.id);
      slotNumberToItem[slotNumber] = null;
      delete itemIdToInfo[payload.inventoryItem.id];
    }
    if (itemIDToStackGroupID[payload.inventoryItem.id]) {
      // Dropping a stack item
      const stackGroupID = itemIDToStackGroupID[payload.inventoryItem.id];
      stackGroupIdToItemIDs[stackGroupID] = stackGroupIdToItemIDs[stackGroupID]
        .filter((itemId) => itemId !== payload.inventoryItem.id);
      delete itemIDToStackGroupID[payload.inventoryItem.id];

      const itemIdArray = stackGroupIdToItemIDs[stackGroupID];
      const nextInventoryItem = _.find(inventoryItems, item => itemIdArray[itemIdArray.length - 1] === item.id);
      inventoryItems = _.filter(inventoryItems, item => slotNumberToItem[slotNumber].item.id !== item.id);
      
      slotNumberToItem[slotNumber] = {
        id: stackGroupID,
        isCrafting: isCraftingItem(nextInventoryItem),
        isStack: isStackedItem(nextInventoryItem),
        item: nextInventoryItem,
      };

      itemIdToInfo[nextInventoryItem.id] = {
        icon: nextInventoryItem.staticDefinition.iconUrl,
        slot: slotNumber,
      };
      delete itemIdToInfo[payload.inventoryItem.id];
    }

    if (payload.type === 'Equip') {
      equipItemRequest(payload.inventoryItem, payload.willEquipTo, null, slotNumber);
    }
    
  } else if (payload.equippedItem && !itemIdToInfo[payload.equippedItem.item.id]) {
    // If only equipped item provided by event. UNEQUIP
    const slotNumber = firstAvailableSlot(0, slotNumberToItem);
    inventoryItems = [...inventoryItems, {
      ...payload.equippedItem.item,
      location: {
        inventory: {
          position: slotNumber,
        },
      }} as InventoryItemFragment,
    ];
    slotNumberToItem[slotNumber] = {
      id: payload.equippedItem.item.id,
      isCrafting: false,
      isStack: false,
      item: payload.equippedItem.item,
    };
    itemIdToInfo[payload.equippedItem.item.id] = {
      slot: slotNumber,
      icon: payload.equippedItem.item.staticDefinition.iconUrl,
    };
    if (payload.type === 'Unequip') {
      unequipItemRequest(payload.equippedItem.item, payload.equippedItem.gearSlots, slotNumberToItem);
    }
  }
  if (props.onChangeInventoryItems) {
    props.onChangeInventoryItems(inventoryItems);
  }
  return {
    ...state,
    slotNumberToItem,
    itemIdToInfo,
    stackGroupIdToItemIDs,
    itemIDToStackGroupID,
  };
}

export function equipItemRequest(item: InventoryItemFragment,
                            gearSlotDefs: Partial<ql.schema.GearSlotDefRef>[],
                            equippedItem: Partial<ql.schema.EquippedItem>,
                            equipToSlotNumber: number) {
    const gearSlotIDs = gearSlotDefs.map((gearSlot) => gearSlot.id);
    const inventoryItemPosition = getItemInventoryPosition(item);
    webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      {
        moveItemID: item.id,
        stackHash: item.stackHash,
        unitCount: -1,
        to: {
          entityID: nullVal,
          characterID: client.characterID,
          position: -1,
          containerID: nullVal,
          gearSlotIDs,
          location: 'Equipment',
          voxSlot: 'Invalid',
        },
        from: {
          entityID: nullVal,
          characterID: client.characterID,
          position: inventoryItemPosition,
          containerID: nullVal,
          gearSlotIDs: [],
          location: 'Inventory',
          voxSlot: 'Invalid',
        },
      } as any).then((res) => {
        // TEMPORARY: If webAPI fails, then fall back to client command EquipItem
        if (!res.ok) {
          client.EquipItem(item.id);
        }
      });
    
    if (equippedItem) {
      const equippedGearSlotIDs = equippedItem.gearSlots.map((gearSlot) => gearSlot.id);
      webAPI.ItemAPI.MoveItems(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        {
          moveItemID: equippedItem.item.id,
          stackHash: item.stackHash,
          unitCount: -1,
          to: {
            entityID: nullVal,
            characterID: client.characterID,
            position: equipToSlotNumber,
            containerID: nullVal,
            gearSlotIDs,
            location: 'Inventory',
            voxSlot: 'Invalid',
          },
          from: {
            entityID: nullVal,
            characterID: client.characterID,
            position: -1,
            containerID: nullVal,
            gearSlotIDs: equippedGearSlotIDs,
            location: 'Equipment',
            voxSlot: 'Invalid',
          },
        } as any,
      );
    }
  }

  export function unequipItemRequest(item: InventoryItemFragment,
                                gearSlotDefs: Partial<ql.schema.GearSlotDefRef>[],
                                slotNumberToItem: SlotNumberToItem) {
    const gearSlotIDs = gearSlotDefs.map((gearSlot) => gearSlot.id);
    webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      {
        moveItemID: item.id,
        stackHash: item.stackHash,
        unitCount: -1,
        to: {
          entityID: nullVal,
          characterID: client.characterID,
          position: firstAvailableSlot(0, slotNumberToItem),
          containerID: nullVal,
          gearSlotIDs: [],
          location: 'Inventory',
          voxSlot: 'Invalid',
        },
        from: {
          entityID: nullVal,
          characterID: client.characterID,
          position: getItemInventoryPosition(item),
          containerID: nullVal,
          gearSlotIDs,
          location: 'Equipment',
          voxSlot: 'Invalid',
        },
      } as any).then((res) => {
        // TEMPORARY: If webAPI fails, then fall back to client command UnequipItem
        if (!res.ok) {
          client.UnequipItem(item.id);
        }
    });
  }

  export function dropItemRequest(item: InventoryItemFragment) {
    webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      {
        moveItemID: item.id,
        stackHash: item.stackHash,
        unitCount: -1,
        to: {
          entityID: nullVal,
          position: -1,
          containerID: nullVal,
          gearSlotIDs: [],
          location: 'Ground',
          voxSlot: 'Invalid',
        },
        from: {
          entityID: nullVal,
          characterID: client.characterID,
          position: getItemInventoryPosition(item),
          containerID: nullVal,
          gearSlotIDs: [],
          location: 'Inventory',
          voxSlot: 'Invalid',
        },
      } as any).then((res) => {
        // TEMPORARY: If webAPI fails, then fall back to client command DropItem
        if (!res.ok) {
          client.DropItem(item.id);
        }
    });
  }
