/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import Fuse, { FuseOptions } from 'fuse.js';
import { webAPI } from '@csegames/library/lib/camelotunchained';

import { InventoryRow } from '../Inventory/components/InventoryRow';
import { nullVal } from 'fullscreen/lib/constants';
import eventNames, {
  InventoryDataTransfer,
  EquippedItemDataTransfer,
  UpdateInventoryItemsPayload,
  UnequipItemPayload,
  CombineStackPayload,
  EquipItemPayload,
} from 'fullscreen/lib/itemEvents';
import { DrawerCurrentStats } from 'fullscreen/Inventory/components/Containers/Drawer';
import { SLOT_DIMENSIONS } from 'fullscreen/Inventory/components/InventorySlot';
import {
  InventoryItem,
  GearSlotDefRef,
  ContainerDefStat_Single,
  SecureTradeState,
  EquippedItem,
} from 'gql/interfaces';
import {
  createMoveItemRequestToInventoryPosition,
  createMoveItemRequestToWorldPosition,
  firstAvailableSlot,
  generateStackGroupID,
  getIcon,
  getItemDefinitionId,
  getItemInstanceID,
  getItemInventoryPosition,
  getItemMapID,
  getItemQuality,
  getItemUnitCount,
  getInventoryDataTransfer,
  hasActiveFilterButtons,
  hasFilterText,
  isContainerItem,
  isCraftingItem,
  isStackedItem,
  itemHasInventoryPosition,
  itemHasContainerPosition,
  createMoveItemRequestToContainerPosition,
  shouldShowItem,
  getItemWithNewInventoryPosition,
  getItemWithNewUnitCount,
  getEquippedDataTransfer,
} from 'fullscreen/lib/utils';
import {
  InventorySlotItemDef,
  CraftingSlotItemDef,
  ContainerSlotItemDef,
  SlotType,
  SlotItemDefType,
  InventoryFilterButton,
} from 'fullscreen/lib/itemInterfaces';
import { getScaledValue } from 'lib/scale';
import { uiContextFromGame } from 'services/session/UIContext';

declare const toastr: any;

export interface ContainerPermissionDef {
  userPermission: number;
  isParent: boolean;
  isChild: boolean;
}

export interface SlotNumberToItem {
  [id: number]: {
    id: string;
    isStack: boolean;
    isCrafting: boolean;
    isContainer: boolean;
    item?: InventoryItem.Fragment;
  };
}

export interface InventoryBaseProps {
  searchValue: string;
  activeFilters: {[id: string]: InventoryFilterButton};
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
}

export interface InventoryBaseWithQLProps {
  searchValue: string;
  activeFilters: {[id: string]: InventoryFilterButton};
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
}

export interface ItemIDToInfo {
  [id: string]: {
    slot: number;
    icon: string;
  };
}

// ---- Containers and drawers ----
export interface DrawerSlot {
  slot: number;
  drawerId: string;
  containerId: string;
  item?: InventoryItem.Fragment;
}

export interface DrawerSlotNumberToItem {
  [slotNumber: number]: DrawerSlot;
}

export interface DrawerIdToSlotNumberToItem {
  [drawerId: string]: DrawerSlotNumberToItem;
}

export interface ContainerIdToDrawerInfo {
  [containerId: string]: {
    drawers: DrawerIdToSlotNumberToItem;
  };
}
// --------------------------------

export interface InventoryBaseState {
  slotsPerRow: number;
  rowCount: number;
  slotCount: number;
  firstEmptyIndex: number;
}

let stackGroupCounter = 0;

export function renderSlots(state: InventoryBaseState, props: InventoryBaseProps) {
  return (
    <div>
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
  };
}

export function createRowElementsForCraftingItems(payload: {
  state: InventoryBaseState,
  props: InventoryBaseProps,
  myTradeItems: InventoryItem.Fragment[],
  containerItem: InventoryItem.Fragment,
  containerID: string[],
  drawerID: string,
  drawerCurrentStats: DrawerCurrentStats,
  drawerMaxStats: ContainerDefStat_Single,
  itemData: {items: InventoryItem.Fragment[]},
  bodyWidth: number,
  syncWithServer: () => void,
  onDropOnZone: (dragItemData: InventoryDataTransfer,
  dropZoneData: InventoryDataTransfer) => void,
}) {
  const { state, props, containerItem, containerID, drawerID, itemData,
    syncWithServer, bodyWidth, onDropOnZone, drawerCurrentStats, drawerMaxStats } = payload;
  const rows: JSX.Element[] = [];
  const rowData: CraftingSlotItemDef[][] = [];

  let slotIndex = 0;
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: CraftingSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const item = itemData.items[slotIndex];
      const location = containerItem.location.inContainer ? 'inContainer' : 'inventory';
      const position = location === 'inContainer' ?
        containerItem.location.inContainer ? containerItem.location.inContainer.position :
        containerItem.location.inventory ? containerItem.location.inventory.position : -1 : -1;

      const disabled = _.findIndex(payload.myTradeItems, tradeItem => tradeItem.id === item.id) !== -1;
      if (!item) {
        rowItems.push({
          slotType: SlotType.EmptyCraftingItem,
          icon: ' ',
          item: containerItem,
          containerID,
          drawerID,
          drawerCurrentStats,
          drawerMaxStats,
          slotIndex: { position, location, containerID, drawerID },
          disableDrop: true,
        });
        continue;
      }
      rowItems.push({
        slotType: SlotType.CraftingItem,
        icon: getIcon(item),
        itemID: getItemMapID(item),
        quality: getItemQuality(item),
        itemCount: getItemUnitCount(item),
        containerID,
        drawerID,
        drawerCurrentStats,
        drawerMaxStats,
        slotIndex: { position, location, containerID, drawerID },
        item,
        disabled,
      });
      ++slotIndex;
    }
    rows.push((
      <InventoryRow
        showGraySlots
        key={rowIndex}
        items={rowItems}
        onDropOnZone={onDropOnZone}
        onRightOrLeftItemAction={props.onRightOrLeftItemAction}
        showTooltip={props.showTooltip}
        hideTooltip={props.hideTooltip}
        syncWithServer={syncWithServer}
        bodyWidth={bodyWidth}
      />
    ));
    rowData.push(rowItems);
  }
  return {
    rows,
    rowData,
  };
}

export function createRowElementsForContainerItems(payload: {
  state: InventoryBaseState,
  props: InventoryBaseProps,
  containerIdToDrawerInfo: ContainerIdToDrawerInfo,
  stackGroupIdToItemIDs: {[id: string]: string[]},
  myTradeState: SecureTradeState,
  myTradeItems: InventoryItem.Fragment[],
  itemData: {items: any[]},
  containerID: string[],
  drawerID: string,
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void,
  onCombineStackDrawer: (payload: CombineStackPayload) => void,
  containerPermissions: ContainerPermissionDef | ContainerPermissionDef[],
  drawerMaxStats: ContainerDefStat_Single,
  drawerCurrentStats: DrawerCurrentStats,
  syncWithServer: () => void,
  bodyWidth: number,
}) {
  // Difference between these elements and regular row elements is that these are not located in slotNumberToItem because
  // they have a position that is inContainer and not inventory.
  const { state, props, containerID, drawerID, onDropOnZone, onCombineStackDrawer, containerPermissions,
    drawerMaxStats, drawerCurrentStats, syncWithServer, bodyWidth, itemData } = payload;
  const rows: JSX.Element[] = [];
  const rowData: ContainerSlotItemDef[][] = [];
  let slotIndex = 0;
  const itemMap = itemData ? _.keyBy(itemData.items, i => i.id) : {};
  for (let rowIndex = 0; rowIndex < state.rowCount; rowIndex++) {
    const rowItems: ContainerSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; i++) {
      const myContainerID = containerID[containerID.length - 1];
      const container = payload.containerIdToDrawerInfo[myContainerID];
      const slot = container ? container.drawers[drawerID][slotIndex] : 0;
      let item = slot && slot.item;
      if (!item || !item.staticDefinition) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          containerPermissions,
        });

        slotIndex++;
        continue;
      }

      const tradeItem = _.find(payload.myTradeItems, tradeItem => tradeItem.id === item.id);
      const disabled = typeof tradeItem !== 'undefined';
      const inTrade = payload.myTradeState !== 'None';
      if (isContainerItem(item)) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: getIcon(item),
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          item,
          containerPermissions,
          disabled,
          disableEquip: inTrade,
          disableContextMenu: inTrade,
          disableDrag: disabled,
          disableDrop: inTrade,
        });

        slotIndex++;
        continue;
      }

      if (isCraftingItem(item)) {
        let count = item.stats.item.unitCount;
        if (tradeItem) {
          // Show some stacks are in the trade window
          count = item.stats.item.unitCount - tradeItem.stats.item.unitCount;
          item = getItemWithNewUnitCount(item, count);
        }
        const stackId = getItemMapID(item);
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: getIcon(item),
          groupStackHashID: item.id,
          itemID: item.id,
          item,
          stackedItems: payload.stackGroupIdToItemIDs[stackId] ?
            payload.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [item],
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          containerPermissions,
          disabled: count === 0,
          disableEquip: inTrade,
          disableContextMenu: inTrade,
          disableDrag: disabled,
          disableDrop: inTrade,
        });

        slotIndex++;
        continue;
      }

      if (isStackedItem(item)) {
        let count = item.stats.item.unitCount;
        if (tradeItem) {
          // Show some stacks are in the trade window
          count = item.stats.item.unitCount - tradeItem.stats.item.unitCount;
          item = getItemWithNewUnitCount(item, count);
        }
        const stackId = getItemMapID(item);
        rowItems.push({
          slotType: SlotType.Stack,
          icon: getIcon(item),
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          item,
          stackedItems: payload.stackGroupIdToItemIDs[stackId] ?
            payload.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [item],
          containerPermissions,
          disabled: count === 0,
          disableEquip: inTrade,
          disableContextMenu: inTrade,
          disableDrag: disabled,
          disableDrop: inTrade,
        });

        slotIndex++;
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: getIcon(item),
        itemID: item.id,
        slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
        item,
        containerPermissions,
        disabled,
        disableEquip: inTrade,
        disableContextMenu: inTrade,
        disableDrag: disabled,
        disableDrop: inTrade,
      });
      slotIndex++;
    }

    rows.push((
      <InventoryRow
        showGraySlots
        key={rowIndex}
        items={rowItems}
        containerID={containerID}
        drawerID={drawerID}
        onDropOnZone={onDropOnZone}
        onRightOrLeftItemAction={props.onRightOrLeftItemAction}
        showTooltip={props.showTooltip}
        hideTooltip={props.hideTooltip}
        syncWithServer={syncWithServer}
        bodyWidth={bodyWidth}
        drawerCurrentStats={drawerCurrentStats}
        drawerMaxStats={drawerMaxStats}
        onCombineStackDrawer={onCombineStackDrawer}
      />
    ));
    rowData.push(rowItems);
  }
  return {
    rows,
    rowData,
  };
}

export function createRowElements(payload: {
  state: InventoryBaseState,
  props: Partial<InventoryBaseWithQLProps>,
  itemData: {items: InventoryItem.Fragment[]},
  myTradeItems: InventoryItem.Fragment[],
  myTradeState: SecureTradeState,
  stackGroupIdToItemIDs: {[id: string]: string[]},
  slotNumberToItem: SlotNumberToItem,
  itemIdToInfo: ItemIDToInfo;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void,
  syncWithServer: () => void,
  bodyWidth: number,
}) {
  const { state, props, itemData, onDropOnZone, syncWithServer, bodyWidth, slotNumberToItem, itemIdToInfo } = payload;
  const rows: JSX.Element[] = [];
  const rowData: InventorySlotItemDef[][] = [];
  let slotIndex = 0;
  const itemMap = itemData ? _.keyBy(itemData.items, i => i.id) : {};
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: InventorySlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const itemDef = slotNumberToItem[slotIndex++];
      if (!itemDef) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
        });
        continue;
      }

      let item = itemDef.item;
      const tradeItem = _.find(payload.myTradeItems, tradeItem => tradeItem.id === item.id);

      const disabled = typeof tradeItem !== 'undefined';
      const disableEquip = payload.myTradeState !== 'None';
      if (itemDef.isContainer) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: itemIdToInfo[itemDef.id].icon,
          itemID: itemDef.id,
          item,
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
          disabled,
          disableEquip,
        });
        continue;
      }

      if (itemDef.isCrafting) {
        let count = item.stats.item.unitCount;
        if (tradeItem) {
          // Show some stacks are in the trade window
          count = item.stats.item.unitCount - tradeItem.stats.item.unitCount;
          item = getItemWithNewUnitCount(item, count);
        }
        const stackId = getItemMapID(item);
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: getIcon(item),
          groupStackHashID: itemDef.id,
          stackedItems: payload.stackGroupIdToItemIDs[stackId] ?
            payload.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [item],
          item,
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
          disabled: count === 0,
          disableEquip,
        });
        continue;
      }

      if (itemDef.isStack) {
        let count = item.stats.item.unitCount;
        if (tradeItem) {
          // Show some stacks are in the trade window
          count = item.stats.item.unitCount - tradeItem.stats.item.unitCount;
          item = getItemWithNewUnitCount(item, count);
        }
        const stackId = getItemMapID(item);
        rowItems.push({
          slotType: SlotType.Stack,
          icon: getIcon(item),
          itemID: itemDef.id,
          item,
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
          stackedItems: payload.stackGroupIdToItemIDs[stackId] ?
            payload.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [item],
          disabled: count === 0,
          disableEquip,
        });
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: itemIdToInfo[itemDef.id] && itemIdToInfo[itemDef.id].icon,
        itemID: itemDef.id,
        item,
        slotIndex: { position: slotIndex - 1, location: 'inventory' },
        disabled,
        disableEquip,
      });
    }

    rows.push((
      <InventoryRow
        key={rowIndex}
        items={rowItems}
        onDropOnZone={onDropOnZone}
        filtering={hasActiveFilterButtons(props.activeFilters) || hasFilterText(props.searchValue)}
        onRightOrLeftItemAction={props.onRightOrLeftItemAction}
        showTooltip={props.showTooltip}
        hideTooltip={props.hideTooltip}
        syncWithServer={syncWithServer}
        bodyWidth={bodyWidth}
      />
    ));
    rowData.push(rowItems);
  }
  return {
    rows,
    rowData,
  };
}

export function initializeSlotsData(slotsData: { slotsPerRow: number, rowCount: number, slotCount: number }) {
  return {
    ...slotsData,
  };
}

// we are not filtering items here, put items based on slot position
export function distributeItemsNoFilter(args: {
  itemData: {
    items: InventoryItem.Fragment[],
  },
  containerIdToDrawerInfo: ContainerIdToDrawerInfo,
}) {
  const { itemData } = args;
  const itemIdToInfo: {[id: string]: {slot: number, icon: string}} = {};
  const slotNumberToItem: SlotNumberToItem = {};
  const stackGroupIdToItemIDs = {};
  const itemIDToStackGroupID = {};
  const craftingNameToItemIDs = {};
  const firstEmptyIndex = 0;
  let containerIdToDrawerInfo: ContainerIdToDrawerInfo = { ...args.containerIdToDrawerInfo };
  let moveRequests: MoveItemRequest[] = [];

  // first we'll split up items into different categories for how the inventory handles things differently
  // such as stacks, crafting stuffs, and items with or without position
  const partitionedItems = partitionItems(itemData.items);
  // place normal items with a position into their slots positions.
  partitionedItems.positionedItems.forEach((item) => {
    const wantPosition = getItemInventoryPosition(item);
    const id = getItemMapID(item);

    if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id !== id)) {
      partitionedItems.noPositionItems.push(item);
      return;
    }
    slotNumberToItem[wantPosition] = {
      id,
      isCrafting: isCraftingItem(item),
      isStack: isStackedItem(item),
      isContainer: isContainerItem(item),
      item,
    };
    itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };
  });

  // place stacked items with position into their slots positions.
  _.values(partitionedItems.stackedItemsWithPosition).forEach((itemArr) => {
    itemArr.forEach((item) => {
      if (!isCraftingItem(item)) {
        const wantPosition = getItemInventoryPosition(item);
        const id = getItemMapID(item);

        if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id !== id)) {
          partitionedItems.noPositionStackedItems[id] = itemArr;
          return;
        }

        if (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id === id) {
          // There is already an item to represent the stack, just add item to stackGroupIdToItemIDs.
          stackGroupIdToItemIDs[id].push(item.id);
          return;
        }

        itemIDToStackGroupID[item.id] = id;

        slotNumberToItem[wantPosition] = {
          id,
          isCrafting: isCraftingItem(item),
          isStack: isStackedItem(item),
          isContainer: isContainerItem(item),
          item,
        };
        itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };

        if (stackGroupIdToItemIDs[id]) {
          stackGroupIdToItemIDs[id] = stackGroupIdToItemIDs[id].concat(item.id);
        } else {
          stackGroupIdToItemIDs[id] = [item.id];
        }
      }
    });
  });

  // place crafted items if they have a position into their spot.
  _.values(partitionedItems.craftingItems).forEach((craftingItemArr) => {
    craftingItemArr.forEach((item) => {
      let id = getItemMapID(item);
      let wantPosition = partitionedItems.idToGroupIDMap[id] ? partitionedItems.idToGroupIDMap[id][0].position : -1;

      if (getItemInventoryPosition(item) === -1) {
        Object.keys(partitionedItems.idToGroupIDMap).forEach((groupId) => {
          if (_.includes(groupId, id)) {
            id = groupId;
            wantPosition = partitionedItems.idToGroupIDMap[groupId][0].position;
            return;
          }
        });
      }

      if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id !== id)) {
        partitionedItems.noPositionItems.push(item);
        return;
      }

      if (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id === id) {
        // There is already an item to represent the stack, just add item to stackGroupIdToItemIDs.
        stackGroupIdToItemIDs[id].push(item.id);
        return;
      }

      slotNumberToItem[wantPosition] = {
        id,
        isCrafting: isCraftingItem(item),
        isStack: isStackedItem(item),
        isContainer: isContainerItem(item),
        item,
      };
      itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };

      if (!stackGroupIdToItemIDs[id]) {
        stackGroupIdToItemIDs[id] = [item.id];
      } else {
        stackGroupIdToItemIDs[id].push(item.id);
        moveRequests.push(createMoveItemRequestToInventoryPosition({ item, position: wantPosition }));
      }
    });
  });

  // splits the array of items into two arrays, [0] being those with an inventory position, [1] without
  const partitioned = _.partition(itemData.items, i => getItemInventoryPosition(i) > -1);

  // for items with a position, split out items that have a stack hash, [0] being those with stackHash, [1] without
  const positionedStacksPartitioned = _.partition(partitioned[0], i => isStackedItem(i) && !isCraftingItem(i));

  // create a map of items that have a position, keyed by their item id
  const itemsWithPosition = _.keyBy(positionedStacksPartitioned[0], i => i.id);

  // array of items without a position
  let noPositionArr = [...partitionedItems.noPositionItems];

  // Add stacked items with no position to noPositionArr
  _.values(partitionedItems.noPositionStackedItems).forEach((itemArr) => {
    noPositionArr = _.every(itemArr, (item): any =>
      _.find(noPositionArr, item)) ? noPositionArr : noPositionArr.concat(itemArr);
  });


  // iterate over non-stacked items with a position, check if there are position conflicts, if so then they
  // get added to the no position array. Items are positioned first come first serve
  Object.keys(itemsWithPosition).forEach((key) => {
    const item = itemsWithPosition[key];
    const position = getItemInventoryPosition(item);
    const id = getItemMapID(item);

    // check if something is in this position already...
    if (slotNumberToItem[position] && slotNumberToItem[position].id !== id) {
      // if we're here then something else is in the slot and it's not this item or a stack of this item
      // so push this into the no position array and sort position out that way.
      noPositionArr.push(item);
      return;
    }
  });

  // figure out next available position
  // now we sort out positions for every item that doesn't have a position.
  // after figuring out the position, we will tell the server the position
  // using a batched api request so that they will remain in these positions
  // in the future

  noPositionArr.forEach((item, index) => {
    const id = getItemMapID(item);
    const itemInstanceId = getItemInstanceID(item);
    // first check if there is a matching stack hash, then use that position
    if (isStackedItem(item) && !isCraftingItem(item) && partitionedItems.idToGroupIDMap[id]) {
      const stackGroupID = partitionedItems.idToGroupIDMap[id][0].stackGroupID;
      const stackGroupPosition = itemIdToInfo[id];

      if (stackGroupPosition) {
        moveRequests.push(createMoveItemRequestToInventoryPosition({ item, position: stackGroupPosition.slot }));

        if (!_.find(stackGroupIdToItemIDs[stackGroupID], itemId => itemInstanceId === itemId)) {
          stackGroupIdToItemIDs[stackGroupID] = !stackGroupIdToItemIDs[stackGroupID] ? [itemInstanceId] :
            stackGroupIdToItemIDs[stackGroupID].concat(itemInstanceId);
        }

        itemIDToStackGroupID[itemInstanceId] = stackGroupID;

        slotNumberToItem[stackGroupPosition.slot] = {
          id,
          isCrafting: isCraftingItem(item),
          isStack: isStackedItem(item),
          isContainer: isContainerItem(item),
          item,
        };

        itemIdToInfo[id] = stackGroupPosition;
        itemIdToInfo[itemInstanceId] = stackGroupPosition;
        return;
      } else {
        const firstAvailSlot = firstAvailableSlot(firstEmptyIndex, slotNumberToItem);
        moveRequests.push(createMoveItemRequestToInventoryPosition({ item, position: firstAvailSlot }));

        stackGroupIdToItemIDs[stackGroupID] = !stackGroupIdToItemIDs[stackGroupID] ? [itemInstanceId] :
          stackGroupIdToItemIDs[stackGroupID].concat(itemInstanceId);

        itemIDToStackGroupID[itemInstanceId] = stackGroupID;

        itemIdToInfo[id] = { slot: firstAvailSlot, icon: getIcon(item) };
        itemIdToInfo[itemInstanceId] = { slot: firstAvailSlot, icon: getIcon(item) };
        slotNumberToItem[firstAvailSlot] = {
          id,
          isCrafting: isCraftingItem(item),
          isStack: isStackedItem(item),
          isContainer: isContainerItem(item),
          item,
        };
        return;
      }
    }

    const otherStack = _.find(_.values(slotNumberToItem), slot => _.includes(slot.id, id));
    if (isCraftingItem(item) && otherStack) {
      // Already stack that we can move this crafting item to
      stackGroupIdToItemIDs[otherStack.id] = stackGroupIdToItemIDs[otherStack.id].concat(itemInstanceId);
      moveRequests.push(createMoveItemRequestToInventoryPosition({ item, position: itemIdToInfo[otherStack.id].slot }));
    } else {
      // Find first available slot for item and place it there
      const position = firstAvailableSlot(firstEmptyIndex, slotNumberToItem);
      const stackId = getItemMapID(item, { wantPos: position });
      moveRequests.push(createMoveItemRequestToInventoryPosition({ item, position }));
      slotNumberToItem[position] = {
        id: stackId,
        isCrafting: isCraftingItem(item),
        isStack: isStackedItem(item),
        isContainer: isContainerItem(item),
        item,
      };
      itemIdToInfo[stackId] = { slot: position, icon: getIcon(item) };

      if (isCraftingItem(item)) {
        // If this is a crafting item, add it to stackGroupIdToItemIDs, this is the first item of the stack
        stackGroupIdToItemIDs[stackId] = [itemInstanceId];
      }
    }
  });

  // Handle container items and put them into a containerIdToDrawerInfo
  const { newContainerIdToDrawerInfo, newMoveRequests } = getContainerIdToDrawerInfo(
    partitionedItems.containerItems,
    containerIdToDrawerInfo,
    moveRequests,
  );

  moveRequests = newMoveRequests;
  containerIdToDrawerInfo = newContainerIdToDrawerInfo;

  if (!_.isEmpty(stackGroupIdToItemIDs)) {
    Object.keys(stackGroupIdToItemIDs).forEach((stackGroupId) => {
      stackGroupIdToItemIDs[stackGroupId] = _.uniqBy(stackGroupIdToItemIDs[stackGroupId], itemId => itemId);
    });
  }

  const inventoryItems = [...itemData.items];
  moveRequests.forEach((moveRequest: any) => {
    const itemId = moveRequest.moveItemID;
    const itemIndex = _.findIndex(itemData.items, item => item.id === itemId);
    if (inventoryItems[itemIndex]) {
      inventoryItems[itemIndex].location.inventory = {
        position: moveRequest.to.position,
      } as any;
    }
  });

  // batch move all items with no position
  if (moveRequests.length > 0) {
    webAPI.ItemAPI.BatchMoveItems(
      webAPI.defaultConfig,
      moveRequests,
    );
  }

  return {
    inventoryItems,
    stackGroupIdToItemIDs,
    containerIdToDrawerInfo,
    itemIdToInfo,
    slotNumberToItem,
    itemIDToStackGroupID,
    firstEmptyIndex,
    craftingNameToItemIDs,
  };
}

export function getContainerIdToDrawerInfo(containerItems: InventoryItem.Fragment[],
                                            containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                                            moveRequests?: MoveItemRequest[]) {
  const newContainerIdToDrawerInfo = { ...containerIdToDrawerInfo };
  const newMoveRequests = moveRequests && [...moveRequests];

  containerItems.forEach((_containerItem) => {
    const drawers: DrawerIdToSlotNumberToItem = {};
    _containerItem.containerDrawers.forEach((_drawer: InventoryItem.ContainerDrawers) => {
      const drawerSlotNumberToItem = {};
      const noPositionSlots: InventoryItem.Fragment[] = [];

      _drawer.containedItems.forEach((_item) => {
        if (_item.location.inContainer && _item.location.inContainer.position && _item.location.inContainer.position > -1) {
          // Put item in saved location
          drawerSlotNumberToItem[_item.location.inContainer.position] = {
            slot: _item.location.inContainer.position,
            drawerId: _drawer.id,
            containerId: _containerItem.id,
            item: _item,
          };
        } else {
          // Save non positioned item to reassign later
          noPositionSlots.push(_item as InventoryItem.Fragment);
        }
      });

      // Give non positioned items some position!
      let openSlotNum = 0;
      const assignOpenSlotNum = (_item: InventoryItem.Fragment) => {
        if (drawerSlotNumberToItem[openSlotNum]) {
          // Recursively find the next open slot
          openSlotNum++;
          assignOpenSlotNum(_item);
        } else {
          // Open slot has been found, add item to it
          drawerSlotNumberToItem[openSlotNum] = {
            slot: openSlotNum,
            drawerId: _drawer.id,
            containerId: _containerItem.id,
            item: _item,
          };

          if (moveRequests) {
            // Push a move item request
            newMoveRequests.push(
              createMoveItemRequestToContainerPosition(
                getInventoryDataTransfer({
                  slotType: SlotType.Standard,
                  item: _item,
                  position: _item.location.inContainer.position,
                  location: 'inContainer',
                  containerID: [_containerItem.id],
                  drawerID: _drawer.id,
                }),
                getInventoryDataTransfer({
                  slotType: SlotType.Standard,
                  item: _item,
                  position: openSlotNum,
                  location: 'inContainer',
                  containerID: [_containerItem.id],
                  drawerID: _drawer.id,
                }),
              ),
            );
            return;
          }
        }
      };
      noPositionSlots.forEach((_noPosItem) => {
        assignOpenSlotNum(_noPosItem);
      });

      drawers[_drawer.id] = drawerSlotNumberToItem;
    });

    // Assign drawers to container ID
    newContainerIdToDrawerInfo[_containerItem.id] = {
      drawers,
    };
  });

  return {
    newContainerIdToDrawerInfo,
    newMoveRequests,
  };
}

export const fuseSearchOptions: FuseOptions<any> = {
  shouldSort: true,
  threshold: 0.3,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  includeScore: true,
  keys: [
    'staticDefinition.name',
  ],
};

// we're filtering items here, put items into slots without regard to position
// defined on the item
export function distributeFilteredItems(args: {
  itemData: {
    items: InventoryItem.Fragment[],
  },
  stackGroupIdToItemIDs: {[id: string]: string[]},
  itemIdToInfo: ItemIDToInfo;
  slotNumberToItem: SlotNumberToItem;
  itemIDToStackGroupID: {[id: string]: string};
  activeFilters: {[id: string]: InventoryFilterButton};
  searchValue: string;
  slotCount: number;
}) {
  const { itemData, activeFilters, searchValue } = args;
  const stackGroupIdToItemIDs = Object.assign({}, args.stackGroupIdToItemIDs);
  const itemIDToStackGroupID = Object.assign({}, args.itemIDToStackGroupID);

  const itemIdToInfo: {[id: string]: {slot: number, icon: string}} = {};
  const slotNumberToItem: SlotNumberToItem = {};
  const activeFilteredItems = itemData.items.filter(i => shouldShowItem(i, activeFilters));
  const fuseSearch: { item: InventoryItem.Fragment, score: number }[] =
    new Fuse(activeFilteredItems, fuseSearchOptions).search(searchValue) as any;
  const searchAndFilteredItems: InventoryItem.Fragment[] = fuseSearch
    .sort((a, b) => {
      return a.score - b.score === 0 ?
        a.item.staticDefinition.name.length - b.item.staticDefinition.name.length :
        a.score - b.score;
    }).map(item => item.item);

  for (let i = 0; i < searchAndFilteredItems.length; i++) {
    const item = searchAndFilteredItems[i];

    const isCrafting = isCraftingItem(item);
    const isStack = isStackedItem(item);
    const isContainer = isContainerItem(item);

    const id = getItemMapID(item);

    const itemDef = {
      id,
      isStack,
      isCrafting,
      isContainer,
      item,
    };

    let itemID = itemDef.id;
    if ((itemDef.isStack || itemDef.isCrafting) && !_.isEmpty(stackGroupIdToItemIDs[itemDef.id])) {
      itemID = stackGroupIdToItemIDs[itemDef.id][0];
    }

    slotNumberToItem[i] = itemDef;
    itemIdToInfo[itemDef.id] = { slot: i, icon: getIcon(item) };
    itemIdToInfo[itemID] = { slot: i, icon: getIcon(item) };
  }

  return {
    itemIdToInfo,
    slotNumberToItem,
    itemIDToStackGroupID,
    firstEmptyIndex: searchAndFilteredItems.length,
  };
}

export function partitionItems(items: InventoryItem.Fragment[]) {
  const itemIdToIcon: {[id: string]: string} = {};
  const craftingItems: {[name: string]: InventoryItem.Fragment[]} = {};
  const stackedItemsWithPosition: {[stackGroupID: string]: InventoryItem.Fragment[]} = {};
  const noPositionStackedItems: {[stackGroupID: string]: InventoryItem.Fragment[]} = {};
  const positionedItems: InventoryItem.Fragment[] = [];
  const noPositionItems: InventoryItem.Fragment[] = [];
  const idToGroupIDMap: {[stackHash: string]: {position: number, stackGroupID: string}[]} = {};
  const containerItems: InventoryItem.Fragment[] = [];

  const temporaryNoPositionStackedItems: InventoryItem.Fragment[] = [];

  const moveRequests: MoveItemRequest[] = [];
  const invItems = [...items];
  invItems.forEach((item) => {
    if (isContainerItem(item)) {
      containerItems.push(item);

      // Find nested containers
      item.containerDrawers.forEach((drawers) => {
        drawers.containedItems.forEach((_item) => {
          if (isContainerItem(_item as InventoryItem.Fragment)) {
            containerItems.push(_item as InventoryItem.Fragment);
          }
        });
      });
    }

    itemIdToIcon[item.id] = item.staticDefinition && item.staticDefinition.iconUrl;
    if (isCraftingItem(item)) {
      const name = getItemDefinitionId(item);
      if (craftingItems[name]) {
        craftingItems[name].push(item);
      } else {
        craftingItems[name] = [item];
      }
    }

    if (isStackedItem(item) || isCraftingItem(item)) {
      const id = getItemMapID(item);
      if (itemHasInventoryPosition(item)) {
        const wantPosition = getItemInventoryPosition(item);

        let stackGroupID = '';

        let stackGroupIndex = -1;
        if (id) {
          stackGroupIndex = _.findIndex(idToGroupIDMap[item.id], gm => gm.position === wantPosition);
        }

        if (stackGroupIndex > -1) {
          stackGroupID = id;
        } else {
          stackGroupID = id;
          stackGroupCounter++;
          idToGroupIDMap[id] = [{
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
        const mapEntries =  idToGroupIDMap[id];
        const stackGroupIndex = mapEntries ? 0 : -1;

        if (stackGroupIndex > -1) {
          stackGroupID = mapEntries[0].stackGroupID;
          stackedItemsWithPosition[stackGroupID].push(item);

          // this item didn't have a position, so we need to queue it up to request
          // a move to this position on the server.
          moveRequests.push(createMoveItemRequestToInventoryPosition({
            item,
            position: mapEntries[stackGroupIndex].position,
          }));

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
      if (itemHasInventoryPosition(item)) {
        positionedItems.push(item);
        return;
      }
      noPositionItems.push(item);
      return;
    }
  });

  temporaryNoPositionStackedItems.forEach((item) => {
    // Check stack hash if its not empty, otherwise find the first itemMapID that includes this one
    const foundOtherStack = _.find(items, invItem => _.includes(getItemMapID(invItem), getItemMapID(item)));

    if (foundOtherStack && itemHasInventoryPosition(foundOtherStack)) {
      // Found other stack and that stack has a position. Just add this item onto that stack!
      const wantPosition = getItemInventoryPosition(foundOtherStack);
      const id = getItemMapID(foundOtherStack);

      let stackGroupID = '';

      let stackGroupIndex = -1;
      if (id) {
        stackGroupIndex = _.findIndex(idToGroupIDMap[id], gm => gm.position === wantPosition);
      }

      if (stackGroupIndex > -1) {
        stackGroupID = id;
      } else {
        stackGroupID = id;
        stackGroupCounter++;
        idToGroupIDMap[id] = [{
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

    if (foundOtherStack && !itemHasInventoryPosition(foundOtherStack)) {
      // Found a stack but that stack doesn't have a position yet.
      const id = getItemMapID(item);
      let stackGroupId = '';

      if (getItemInventoryPosition(item) !== -1) {
        if (idToGroupIDMap[id]) {
          stackGroupId = idToGroupIDMap[id][0].stackGroupID;
        } else {
          stackGroupId = generateStackGroupID(id, stackGroupCounter);
          stackGroupCounter++;
          idToGroupIDMap[id] = [{
            stackGroupID: stackGroupId,
            position: -1,
          }];
        }
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
    containerItems,
    stackedItemsWithPosition,
    noPositionStackedItems,
    positionedItems,
    noPositionItems,
    idToGroupIDMap,
    moveRequests,
  };
}

export function allInventoryFooterButtonsDisabled(props: InventoryBaseProps) {
  return hasActiveFilterButtons(props.activeFilters) || hasFilterText(props.searchValue);
}

export function inventoryFooterRemoveAndPruneButtonDisabled(rowData: InventorySlotItemDef[][], heightOfBody: number) {
  const slotDimensions = getScaledValue(uiContextFromGame(), SLOT_DIMENSIONS);
  const lastRowIndexOnScreen = Math.floor((heightOfBody - 15) / (slotDimensions + 4));
  const isRowOutsideBody = _.indexOf(rowData, (_.last(rowData))) >= lastRowIndexOnScreen;
  const lastRowIsEmpty = _.findIndex(_.last(rowData), item => item.slotType !== SlotType.Empty) === -1;
  return !isRowOutsideBody || !lastRowIsEmpty;
}

export function inventoryContainerRemoveButtonDisabled(rowData: InventorySlotItemDef[][]) {
  const lastRowNotEmpty = _.findIndex(_.last(rowData), item => item.slotType !== SlotType.Empty) !== -1;
  return _.indexOf(rowData, (_.last(rowData))) < 1 || lastRowNotEmpty;
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
  const slotDimensions = getScaledValue(uiContextFromGame(), SLOT_DIMENSIONS);
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
    if (isEmptyRow && _.indexOf(rowData, (_.last(rowData))) >= 1) {
      return {
        ...state,
        rowCount: state.rowCount - 1,
        slotCount: state.slotCount - state.slotsPerRow,
      };
    }
  }
}

export function pruneRowsOfSlots(state: InventoryBaseState,
                                    rowData: InventorySlotItemDef[][],
                                    heightOfBody: number,
                                    isContainer?: boolean) {
  const slotDimensions = getScaledValue(uiContextFromGame(), SLOT_DIMENSIONS);
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
    const lastRow = state.rowCount - (_.findLastIndex(rowData, row =>
      _.find(row, slot => slot.slotType !== SlotType.Empty)) + 1);

    if (state.rowCount - lastRow >= 1) {
      return {
        ...state,
        rowCount: state.rowCount - lastRow,
        slotCount: state.slotCount - (state.slotsPerRow * lastRow),
      };
    }
  }
}

// This function is responsible for updating the inventory whenever something
// fires off the updateInventoryItems event. Generally, EQUIP, UNEQUIP, and DROP
export function onUpdateInventoryItemsHandler(args: {
  itemIdToInfo: ItemIDToInfo;
  slotNumberToItem: SlotNumberToItem;
  itemIDToStackGroupID: {[id: string]: string};
  stackGroupIdToItemIDs: {[id: string]: string[]},
  inventoryItems: InventoryItem.Fragment[],
  containerIdToDrawerInfo: ContainerIdToDrawerInfo,
  payload: UpdateInventoryItemsPayload,
}) {
  // This updates slotNumberToItem and itemIdToInfo when an item is equipped
  const { payload } = args;
  const itemIdToInfo = { ...args.itemIdToInfo };
  const itemIDToStackGroupID = { ...args.itemIDToStackGroupID };
  const stackGroupIdToItemIDs = { ...args.stackGroupIdToItemIDs };
  let slotNumberToItem = { ...args.slotNumberToItem };
  let inventoryItems = [...args.inventoryItems];
  let containerIdToDrawerInfo = { ...args.containerIdToDrawerInfo };

  if (payload.equippedItem && payload.inventoryItem) {
    // This block means that we are EQUIPPING an item to a slot that already has an item in it. EQUIP the inventory item,
    // and add the equipped item to the inventory.
    const equippedItems: any[] =
      _.isArray(payload.equippedItem) ? payload.equippedItem : [payload.equippedItem];
    equippedItems.forEach((equippedItem) => {
      const slotNumber = itemIdToInfo[payload.inventoryItem.item.id] && itemIdToInfo[payload.inventoryItem.item.id].slot;
      const firstAvailSlot = firstAvailableSlot(0, slotNumberToItem);
      const slot = slotNumber >= 0 && slotNumber < firstAvailSlot ? slotNumber : firstAvailSlot;

      if (slotNumber > firstAvailSlot) {
        slotNumberToItem[slotNumber] = null;
      }

      if (itemIdToInfo[payload.inventoryItem.item.id]) {
        inventoryItems = _.filter(inventoryItems, item => item.id !== payload.inventoryItem.item.id);
      }

      const newInventoryItem = {
        ...equippedItem.item,
        location: {
          inventory: {
            position: slot,
          },
          inContainer: null,
          equipped: null,
        },
      };

      inventoryItems = [...inventoryItems, newInventoryItem];

      slotNumberToItem[slot] = {
        id: equippedItem.item.id,
        isCrafting: false,
        isStack: false,
        isContainer: false,
        item: newInventoryItem,
      };
      itemIdToInfo[equippedItem.item.id] = {
        slot,
        icon: equippedItem.item.staticDefinition.iconUrl,
      };
      delete itemIdToInfo[payload.inventoryItem.item.id];
      if (payload.type === 'Equip') {
        makeEquipItemRequest(payload.inventoryItem.item, payload.willEquipTo);
      }
    });
  } else if (payload.inventoryItem && !payload.inventoryItem.containerID) {
    // This block means that we are EQUIPPING an item to an empty gear slot or DROPPING an item.
    // Just get rid of the item in the inventory.
    const id = getItemMapID(payload.inventoryItem.item);
    const slotNumber = payload.inventoryItem.position;
    if (slotNumberToItem[slotNumber] && slotNumberToItem[slotNumber].id === id) {
      inventoryItems = _.filter(inventoryItems, item => slotNumberToItem[slotNumber].item.id !== item.id);
      slotNumberToItem[slotNumber] = null;
      delete itemIdToInfo[id];
    }
    if (itemIDToStackGroupID[id]) {
      // Dropping a stack item
      const stackGroupID = itemIDToStackGroupID[id];
      if (stackGroupIdToItemIDs[stackGroupID]) {
        stackGroupIdToItemIDs[stackGroupID] = stackGroupIdToItemIDs[stackGroupID]
          .filter(itemId => itemId !== id);
      }
      delete itemIDToStackGroupID[id];

      // If array of stacked items with same stackHash, get next item in the array to display or get rid of item in slot.
      const itemIdArray = stackGroupIdToItemIDs[stackGroupID];
      const nextItemInStack = _.find(inventoryItems, item =>
        itemIdArray && itemIdArray[itemIdArray.length - 1] === item.id);
      if (nextItemInStack) {
        inventoryItems = _.filter(inventoryItems, item => slotNumberToItem[slotNumber].item.id !== item.id);

        slotNumberToItem[slotNumber] = {
          id: stackGroupID,
          isCrafting: isCraftingItem(nextItemInStack),
          isStack: isStackedItem(nextItemInStack),
          isContainer: isContainerItem(nextItemInStack),
          item: nextItemInStack,
        };

        itemIdToInfo[nextItemInStack.id] = {
          icon: nextItemInStack.staticDefinition.iconUrl,
          slot: slotNumber,
        };
      } else {
        slotNumberToItem[slotNumber] = null;
      }
      delete itemIdToInfo[id];
    }

    if (payload.type === 'Equip') {
      makeEquipItemRequest(payload.inventoryItem.item, payload.willEquipTo);
    }

  } else if (payload.equippedItem && !_.isArray(payload.equippedItem) && !itemIdToInfo[payload.equippedItem.item.id]) {
    // If only equipped item provided by event. UNEQUIP
    const slotNumber = firstAvailableSlot(0, slotNumberToItem);
    const newInvItem: InventoryItem.Fragment = {
      ...payload.equippedItem.item,
      location: {
        inventory: {
          position: slotNumber,
        },
        inContainer: null,
        equipped: null,
        inVox: null,
      },
    };
    inventoryItems = [...inventoryItems, newInvItem];
    slotNumberToItem[slotNumber] = {
      id: payload.equippedItem.item.id,
      isCrafting: false,
      isStack: false,
      isContainer: false,
      item: newInvItem,
    };
    itemIdToInfo[payload.equippedItem.item.id] = {
      slot: slotNumber,
      icon: payload.equippedItem.item.staticDefinition.iconUrl,
    };
    if (payload.type === 'Unequip') {
      makeUnequipItemRequest(payload.equippedItem.item, payload.equippedItem.gearSlots, slotNumber);
    }
  }

  if (payload.inventoryItem && payload.inventoryItem.containerID) {
    const removeResults = removeItemInContainer(
      payload.inventoryItem.item,
      payload.inventoryItem.containerID,
      payload.inventoryItem.drawerID,
      inventoryItems,
      slotNumberToItem,
      containerIdToDrawerInfo,
    );
    inventoryItems = [...removeResults.inventoryItems];
    slotNumberToItem = { ...removeResults.slotNumberToItem };
    containerIdToDrawerInfo = { ...removeResults.containerIDToDrawerInfo };

    if (payload.type === 'Equip') {
      makeEquipItemRequest(payload.inventoryItem.item, payload.willEquipTo);
    }
  }

  return {
    containerIdToDrawerInfo,
    inventoryItems,
    stackGroupIdToItemIDs,
    slotNumberToItem,
    itemIdToInfo,
    itemIDToStackGroupID,
  };
}

function removeItemInContainer(item: InventoryItem.Fragment,
                              containerID: string[],
                              drawerID: string,
                              inventoryItems: InventoryItem.Fragment[],
                              slotNumberToItem: SlotNumberToItem,
                              containerIDToDrawerInfo: ContainerIdToDrawerInfo): {
                                // returns
                                inventoryItems: InventoryItem.Fragment[],
                                slotNumberToItem: SlotNumberToItem,
                                containerIDToDrawerInfo: ContainerIdToDrawerInfo;
                              } {
  let invItems = [...inventoryItems];
  const slotToItem = { ...slotNumberToItem };
  const containerToDrawer = { ...containerIDToDrawerInfo };
  const parentContainer = { ..._.find(invItems, _item => _item.id === containerID[0]) };

  // Find a drawer that can possibly contain the inventory item
  const potentialDrawerIndex = _.findIndex(parentContainer.containerDrawers, (drawer, i) => {
    return drawer.id === drawerID;
  });
  const potentialDrawer = parentContainer.containerDrawers[potentialDrawerIndex];

  // See if item is in the drawer
  const itemInDrawer = _.find(potentialDrawer.containedItems, containedItem => containedItem.id === item.id);
  if (itemInDrawer) {
    // Item is in the drawer, filter the drawer and update container item
    const newDrawerContainedItems = _.filter(potentialDrawer.containedItems, containedItem => containedItem.id !== item.id);
    parentContainer.containerDrawers[potentialDrawerIndex].containedItems = newDrawerContainedItems;

    invItems = [
      ..._.filter(invItems, _item => _item.id !== parentContainer.id),
      parentContainer,
    ];

    slotToItem[parentContainer.location.inventory.position] = {
      ...slotNumberToItem[parentContainer.location.inventory.position],
      item: parentContainer,
    };

    delete containerToDrawer[containerID[0]].drawers[potentialDrawer.id][itemInDrawer.location.inContainer.position];

    return {
      inventoryItems: invItems,
      slotNumberToItem: slotToItem,
      containerIDToDrawerInfo: containerToDrawer,
    };
  }

  if (containerID[1]) {
    parentContainer.containerDrawers = parentContainer.containerDrawers.map((_drawer, i) => {
      const nextContainer = _.find(_drawer.containedItems, _item => _item.id === containerID[1]);
      if (nextContainer) {
        const nextPotentialDrawerIndex = _.findIndex(nextContainer.containerDrawers, (drawer, i) => {
          return drawer.id === drawerID;
        });
        const nextPotentialDrawer = nextContainer.containerDrawers[nextPotentialDrawerIndex];

        const nextItemInDrawer = _.find(nextPotentialDrawer.containedItems, containedItem => containedItem.id === item.id);
        if (nextItemInDrawer) {
          const newNextDrawerContainedItems = _.filter(
            nextPotentialDrawer.containedItems, containedItem => containedItem.id !== item.id);

          nextContainer.containerDrawers[nextPotentialDrawerIndex].containedItems = newNextDrawerContainedItems;

          // Update parent container drawer info
          // tslint:disable
          containerToDrawer[parentContainer.id].drawers[_drawer.id][nextContainer.location.inContainer.position].item
            = nextContainer as InventoryItem.Fragment;

          // Delete nested container
          delete containerToDrawer[containerID[1]]
            .drawers[nextPotentialDrawer.id][nextItemInDrawer.location.inContainer.position];

          return {
            ..._drawer,
            containedItems: [
              ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== nextContainer.id),
              nextContainer,
            ],
          }
        }
      } else {
        return _drawer;
      }
    });

    invItems = [
      ..._.filter(invItems, _item => _item.id !== parentContainer.id),
      parentContainer,
    ];

    slotToItem[parentContainer.location.inventory.position] = {
      ...slotNumberToItem[parentContainer.location.inventory.position],
      item: parentContainer,
    }

    return {
      inventoryItems: invItems,
      slotNumberToItem: slotToItem,
      containerIDToDrawerInfo: containerToDrawer,
    };
  }
}


export async function makeEquipItemRequest(item: InventoryItem.Fragment,
                            gearSlotDefs: Partial<GearSlotDefRef>[]) {
  const gearSlotIDs = gearSlotDefs.map(gearSlot => gearSlot.id);
  const inventoryItemPosition = getItemInventoryPosition(item);
  const request = {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      characterID: camelotunchained.game.selfPlayerState.characterID,
      position: -1,
      containerID: nullVal,
      gearSlotIDs,
      location: 'Equipment',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: camelotunchained.game.selfPlayerState.characterID,
      position: inventoryItemPosition,
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    }
  };
  const res = await webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      request as any,
    );
  if (!res.ok) {
    console.error('Failed to move item');
  }
  setTimeout(() => game.trigger(eventNames.updateCharacterStats), 100);
}

export async function makeUnequipItemRequest(item: InventoryItem.Fragment,
                                gearSlotDefs: Partial<GearSlotDefRef>[],
                                toSlot: number) {
  const gearSlotIDs = gearSlotDefs.map(gearSlot => gearSlot.id);
  const request = {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      characterID: camelotunchained.game.selfPlayerState.characterID,
      position: toSlot,
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: camelotunchained.game.selfPlayerState.characterID,
      position: toSlot,
      containerID: nullVal,
      gearSlotIDs,
      location: 'Equipment',
      voxSlot: 'Invalid',
    },
  };
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    request as any,
  );
  if (!res.ok) {
    console.error('Failed to move item');
  }
  setTimeout(() => game.trigger(eventNames.updateCharacterStats), 100);
}

export async function makeDropItemRequest(item: InventoryItem.Fragment) {
  const request = JSON.stringify({
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      position: -1,
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Ground',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: camelotunchained.game.selfPlayerState.characterID,
      position: getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  });
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    request as any,
  );
  // TEMPORARY: If webAPI fails, then fall back to client command DropItem
  if (!res.ok) {
    // TODO COHERENT DropItem is missing
    // client.DropItem(item.id);
  }
}

export function onCommitPlacedItem(item: InventoryItem.Fragment, position: Vec3F, rotation: Euler3f) {
  const moveItemReq = JSON.stringify(createMoveItemRequestToWorldPosition(item, position, rotation));
  webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    moveItemReq as any,
  );
}

export function moveInventoryItemOutOfInventory(args: {
                                                  dragItemData: InventoryDataTransfer | EquippedItemDataTransfer,
                                                  containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                                                  stackGroupIdToItemIDs: {[id: string]: string[]},
                                                  slotNumberToItem: SlotNumberToItem,
                                                  itemIdToInfo: ItemIDToInfo,
                                                  inventoryItems: InventoryItem.Fragment[],
                                                }) {
  const { dragItemData } = args;
  const slotNumberToItem = {...args.slotNumberToItem};
  const itemIdToInfo = {...args.itemIdToInfo};
  const containerIdToDrawerInfo = {...args.containerIdToDrawerInfo};
  let inventoryItems = [...args.inventoryItems];
  let stackGroupIdToItemIDs = {...args.stackGroupIdToItemIDs};

  if (!dragItemData.unitCount) {
    // We are not moving a partial stack, we are moving a whole item.
    delete slotNumberToItem[dragItemData.position];
    delete itemIdToInfo[dragItemData.item.id];

    inventoryItems[_.findIndex(inventoryItems, item => item.id === dragItemData.item.id)] = null;
    inventoryItems = _.compact(inventoryItems);

    if (isStackedItem(dragItemData.item)) {
      const stackId = getItemMapID(dragItemData.item);
      delete stackGroupIdToItemIDs[stackId];
    }

    if (dragItemData.location === 'inContainer') {
      // get rid of container item in
      const drawerInfo = containerIdToDrawerInfo[dragItemData.containerID[dragItemData.containerID.length - 1]];
      delete drawerInfo.drawers[dragItemData.drawerID][dragItemData.position];

      containerIdToDrawerInfo[dragItemData.containerID[dragItemData.containerID.length - 1]] = drawerInfo;

      const indexOfParentContainer = _.findIndex(inventoryItems, _item => _item.id === dragItemData.containerID[0]);
      const newDragContainerDrawers = _.map(inventoryItems[indexOfParentContainer].containerDrawers, (_drawer) => {
        if (_drawer.id === dragItemData.drawerID) {
          return {
            ..._drawer,
            containedItems: _.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
          };
        }

        return _drawer;
      });

      inventoryItems[indexOfParentContainer] = {
        ...inventoryItems[indexOfParentContainer],
        containerDrawers: newDragContainerDrawers,
      };
    }
  } else {
    // We are moving a partial stack
    const newInventoryItem = getItemWithNewUnitCount(
      dragItemData.item,
      dragItemData.item.stats.item.unitCount - dragItemData.unitCount,
    );
    slotNumberToItem[dragItemData.position] = {
      ...slotNumberToItem[dragItemData.position],
      item: newInventoryItem,
    };

    const invItemIndex = _.findIndex(inventoryItems, item => item.id === dragItemData.item.id);
    inventoryItems[invItemIndex] = newInventoryItem;

    if (dragItemData.location === 'inContainer') {
      // update item in container
      const drawerInfo = containerIdToDrawerInfo[dragItemData.containerID[dragItemData.containerID.length - 1]];
      drawerInfo.drawers[dragItemData.drawerID][dragItemData.position] = {
        ...drawerInfo.drawers[dragItemData.drawerID][dragItemData.position],
        item: newInventoryItem,
      };

      containerIdToDrawerInfo[dragItemData.containerID[dragItemData.containerID.length - 1]] = drawerInfo;

      const indexOfParentContainer = _.findIndex(inventoryItems, _item => _item.id === dragItemData.containerID[0]);
      const newDragContainerDrawers = _.map(inventoryItems[indexOfParentContainer].containerDrawers, (_drawer) => {
        if (_drawer.id === dragItemData.drawerID) {
          return {
            ..._drawer,
            containedItems: _.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
          };
        }

        return _drawer;
      });

      inventoryItems[indexOfParentContainer] = {
        ...inventoryItems[indexOfParentContainer],
        containerDrawers: newDragContainerDrawers,
      };
    }
  }

  return {
    slotNumberToItem,
    itemIdToInfo,
    inventoryItems,
    stackGroupIdToItemIDs,
    containerIdToDrawerInfo,
  }
}

export function moveInventoryItemToEmptySlot(args: {
                                        dragItemData: InventoryDataTransfer | EquippedItemDataTransfer,
                                        dropZoneData: InventoryDataTransfer,
                                        containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                                        stackGroupIdToItemIDs: {[id: string]: string[]},
                                        slotNumberToItem: SlotNumberToItem,
                                        itemIdToInfo: ItemIDToInfo,
                                        inventoryItems: InventoryItem.Fragment[],
                                      }) {
  const { dragItemData, dropZoneData } = args;
  const containerIdToDrawerInfo = {...args.containerIdToDrawerInfo};
  const slotNumberToItem = {...args.slotNumberToItem};
  const itemIdToInfo = {...args.itemIdToInfo};
  let stackGroupIdToItemIDs = {...args.stackGroupIdToItemIDs};
  let dragItem: InventoryItem.Fragment = {...dragItemData.item};

  // If equipped item moving to empty slot in inventory, then unequip it
  if (dragItemData.gearSlots) {
    const payload: UnequipItemPayload = {
      item: dragItemData as EquippedItemDataTransfer,
      dontUpdateInventory: true,
    };
    game.trigger(eventNames.onUnequipItem, payload);
  }

  const dropPosition = dropZoneData ? dropZoneData.position : firstAvailableSlot(0, slotNumberToItem);

  const dragItemId = getItemMapID(dragItem);
  const moveItemReq = createMoveItemRequestToInventoryPosition({
    item: dragItem,
    position: dropPosition,
    voxEntityID: dragItemData.voxEntityID,
  });
  webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    moveItemReq as any,
  ).then(() => dragItemData.voxEntityID && game.trigger('refetch-vox-job'));

  // Now represent the swap in the UI...
  const oldDragItemPosition = dragItem.location.inventory ? dragItem.location.inventory.position : -1;
  if (dragItem.location.inventory) {
    dragItem.location.inventory.position = dropPosition;
    if (dragItem.location.inContainer) {
      dragItem.location.inContainer = null;
    }
  } else {
    dragItem = {
      ...dragItem,
      location: {
        ...dragItem.location,
        inventory: {
          ...dragItem.location.inventory,
          position: dropPosition,
        },
        inContainer: null,
      },
    };
  }

  let invItems = [...args.inventoryItems];
  const itemIndex = _.findIndex(invItems, item => item.id === dragItem.id);
  if (itemIndex > -1) {
    if (isStackedItem(dragItem) && stackGroupIdToItemIDs[dragItemId]) {
      if (dragItemData.fullStack || stackGroupIdToItemIDs[dragItemId].length === 1) {
        // If moving full stack then move all stacked items
        const moveRequests: MoveItemRequest[] = [];
        const dropStackId = dropZoneData && getItemMapID(dropZoneData.item);
        stackGroupIdToItemIDs[dragItemId].forEach((itemId) => {
          const i = _.findIndex(invItems, item => itemId === item.id);
          invItems[i] = {
            ...invItems[i],
            location: {
              ...invItems[i].location,
              inventory: {
                ...invItems[i].location.inventory,
                position: dropPosition,
              },
            },
          };
          moveRequests.push(createMoveItemRequestToInventoryPosition({ item: invItems[i], position: dropPosition }));
          if (dropZoneData && dropZoneData.slotType === SlotType.Empty && dropZoneData.item) {
            // Moving to another crafting container
            stackGroupIdToItemIDs[dropStackId] = stackGroupIdToItemIDs[dropStackId].concat(itemId);
          }
        });

        if (!dropZoneData || (dropZoneData.slotType === SlotType.Empty && !dropZoneData.item)) {
          // Moving to another inventory slot
          stackGroupIdToItemIDs[getItemMapID(dragItem)] = stackGroupIdToItemIDs[dragItemId];
        }
        delete stackGroupIdToItemIDs[dragItemId];

        webAPI.ItemAPI.BatchMoveItems(
          webAPI.defaultConfig,
          moveRequests,
        ).then(() => dragItemData.voxEntityID && game.trigger('refetch-vox-job'));
      } else {
        // Moving a single item inside a stack
        const newStackId = getItemMapID(dragItem);
        stackGroupIdToItemIDs[dragItemId] = _.filter(stackGroupIdToItemIDs[dragItemId], id => id !== dragItem.id);
        stackGroupIdToItemIDs[newStackId] = stackGroupIdToItemIDs[newStackId] ?
          stackGroupIdToItemIDs[newStackId].concat(dragItem.id) : [dragItem.id];
        invItems[itemIndex] = dragItem;
      }

    } else {
      invItems[itemIndex] = dragItem;
    }
  } else {
    // Item was not in general inventory
    invItems = [...invItems, dragItem];

    // If item came from CONTAINER, get rid of it inside the container
    if (dragItemData.containerID) {
      const dragContainerID = dragItemData.containerID[dragItemData.containerID.length - 1];
      delete containerIdToDrawerInfo[dragContainerID].drawers[dragItemData.drawerID][dragItemData.position];

      if (!dragItemData.voxEntityID) {
        const indexOfParentContainer = _.findIndex(invItems, _item => _item.id === dragItemData.containerID[0]);
        let newDragContainerDrawers;
        if (dragItemData.containerID.length > 1) {
          // coming from NESTED container
          newDragContainerDrawers = _.map(invItems[indexOfParentContainer].containerDrawers, (_drawer) => {
            const dragItemContainer = _.find(_drawer.containedItems, _containedItem => _containedItem.id === dragContainerID);
            if (dragItemContainer) {
              const newDragItemDrawer = dragItemContainer.containerDrawers.map((_dragItemDrawer) => {
                return {
                  ..._dragItemDrawer,
                  containedItems: _.filter(_dragItemDrawer.containedItems,
                    _containedItem => dragItemData.item.id !== _containedItem.id),
                };
              });

              const newContainedItem = {
                ...dragItemContainer,
                containerDrawers: newDragItemDrawer,
              };
              return {
                ..._drawer,
                containedItems: [
                  ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemContainer.id),
                  newContainedItem,
                ],
              };
            }

            return _drawer;
          });
        } else {
          // coming from a top-level container
          // Update drag item parent container
          newDragContainerDrawers = _.map(invItems[indexOfParentContainer].containerDrawers, (_drawer) => {
            if (_drawer.id === dragItemData.drawerID) {
              return {
                ..._drawer,
                containedItems: _.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItem.id),
              };
            }

            return _drawer;
          });
        }

        invItems[indexOfParentContainer] = {
          ...invItems[indexOfParentContainer],
          containerDrawers: newDragContainerDrawers,
        };
      }
    }
  }

  if (!stackGroupIdToItemIDs[dragItemId] || dragItemData.fullStack ||
      (stackGroupIdToItemIDs[dragItemId] && stackGroupIdToItemIDs[dragItemId].length === 0)) {
    // If item is not an item in a stack or is the full stack or is the last item in the stack then just delete that position
    delete slotNumberToItem[oldDragItemPosition];
  } else if (!dragItemData.fullStack) {
    // If item is inside a stack
    let nextItem = _.find(invItems, _item => _item.id === stackGroupIdToItemIDs[dragItemId][0]);

    slotNumberToItem[oldDragItemPosition] = {
      id: getItemMapID(nextItem),
      isStack: isStackedItem(nextItem),
      isCrafting: isCraftingItem(nextItem),
      isContainer: isContainerItem(nextItem),
      item: nextItem,
    };

    itemIdToInfo[getItemMapID(nextItem)] = {
      slot: oldDragItemPosition,
      icon: getIcon(nextItem),
    };
  }

  // Move dragItem to new drop zone position
  slotNumberToItem[dropPosition] = {
    id: getItemMapID(dragItem),
    isStack: isStackedItem(dragItem),
    isCrafting: isCraftingItem(dragItem),
    isContainer: isContainerItem(dragItem),
    item: dragItem,
  };

  itemIdToInfo[getItemMapID(dragItem)] = {
    slot: dropPosition,
    icon: getIcon(dragItem),
  };

  console.log(slotNumberToItem);
  return {
    inventoryItems: invItems,
    stackGroupIdToItemIDs,
    containerIdToDrawerInfo,
    slotNumberToItem,
    itemIdToInfo,
  };
}

export function swapInventoryItems(args: {
                              dragItem: InventoryDataTransfer,
                              dropZone: InventoryDataTransfer,
                              inventoryItems: InventoryItem.Fragment[],
                              stackGroupIdToItemIDs: {[id: string]: string[]};
                              slotNumberToItem: SlotNumberToItem;
                              itemIdToInfo: ItemIDToInfo;
                            }) {
  const  { dragItem, dropZone } = args;
  const dragItemData = dragItem.item;
  const dropZoneData = dropZone.item;
  const dragItemId = getItemMapID(dragItemData);
  const dropZoneId = getItemMapID(dropZoneData);
  const stackGroupIdToItemIDs = { ...args.stackGroupIdToItemIDs };
  const invItems = [...args.inventoryItems];
  let moveItemRequests: any[] = [];

  let newDragItemData = dragItemData;
  let newDropZoneData = dropZoneData;
  if (isStackedItem(dragItemData) && args.stackGroupIdToItemIDs[dragItemId]) {
    // If dragged item is stacked item, add moveItem requests for each item in the stack.
    const stackMoveRequests = createStackMoveItemRequests({
      item: dragItemData,
      amount: dragItemData.stats.item.unitCount,
      newPosition: dropZoneData.location.inventory.position,
      inventoryItems: args.inventoryItems,
      stackGroupIdToItemIDs: args.stackGroupIdToItemIDs,
    });

    moveItemRequests = stackMoveRequests;

    newDragItemData = getItemWithNewInventoryPosition(dragItemData, dropZoneData.location.inventory.position);

    if (!isStackedItem(dropZoneData)) {
      const dropZoneMoveRequest = createMoveItemRequestToInventoryPosition({
        item: dropZoneData,
        position: dragItemData.location.inventory.position,
      });
      moveItemRequests = [...moveItemRequests, dropZoneMoveRequest];
      newDropZoneData = getItemWithNewInventoryPosition(dropZoneData, dragItemData.location.inventory.position);

      const invIndex = _.findIndex(invItems, item => item.id === dropZoneData.id);
      invItems[invIndex] = newDropZoneData;
    }

    // Update all the items in the stack position
    stackGroupIdToItemIDs[dragItemId].forEach((itemId) => {
      const i = _.findIndex(invItems, item => item.id === itemId);
      invItems[i] = getItemWithNewInventoryPosition(invItems[i], dropZoneData.location.inventory.position);
    });

    // Update stackgroupIdToItemIDs with new stackID which includes new position
    const newStackId = getItemMapID(newDragItemData);
    stackGroupIdToItemIDs[newStackId] = stackGroupIdToItemIDs[dragItemId];
    delete stackGroupIdToItemIDs[dragItemId];
  }

  if (isStackedItem(dropZoneData) && args.stackGroupIdToItemIDs[dropZoneId]) {
    // If dropzone item is stacked item, add moveItem requests for each item in the stack.
    const requests = createStackMoveItemRequests({
      item: dropZoneData,
      amount: dropZoneData.stats.item.unitCount,
      newPosition: dragItemData.location.inventory.position,
      inventoryItems: args.inventoryItems,
      stackGroupIdToItemIDs: args.stackGroupIdToItemIDs,
    });
    moveItemRequests = [...moveItemRequests, ...requests];

    if (!isStackedItem(newDragItemData)) {
      const dragItemMoveRequest = createMoveItemRequestToInventoryPosition({
        item: dragItemData,
        position: dropZoneData.location.inventory.position,
      });
      moveItemRequests = [...moveItemRequests, dragItemMoveRequest];
      newDragItemData = getItemWithNewInventoryPosition(dragItemData, dropZoneData.location.inventory.position);

      const invIndex = _.findIndex(invItems, item => item.id === dragItemData.id);
      invItems[invIndex] = newDragItemData;
    }
    newDropZoneData = getItemWithNewInventoryPosition(dropZoneData, dragItemData.location.inventory.position);

    // Update all the items in the stack position
    args.stackGroupIdToItemIDs[dropZoneId].forEach((itemId) => {
      const i = _.findIndex(invItems, item => item.id === itemId);
      invItems[i] = getItemWithNewInventoryPosition(invItems[i], dragItemData.location.inventory.position);
    });

    // Update stackgroupIdToItemIDs with new stackID which includes new position
    const newStackId = getItemMapID(newDropZoneData);
    stackGroupIdToItemIDs[newStackId] = stackGroupIdToItemIDs[dropZoneId];
    delete stackGroupIdToItemIDs[dropZoneId];
  }

  if (!isStackedItem(dragItemData) && !isStackedItem(dropZoneData)) {
    // Both drag item and drop zone item are not stacked items. Just make two moveItem requests.
    if (dragItemData.location.inventory) {
      // Moving from inside the inventory
      moveItemRequests = [
        createMoveItemRequestToInventoryPosition({ item: dragItemData, position: dropZoneData.location.inventory.position }),
        createMoveItemRequestToInventoryPosition({ item: dropZoneData, position: dragItemData.location.inventory.position}),
      ];
      const dragItemInvIndex = _.findIndex(invItems, item => item.id === dragItemData.id);
      newDragItemData = getItemWithNewInventoryPosition(dragItemData, dropZoneData.location.inventory.position);
      invItems[dragItemInvIndex] = newDragItemData;

      const dropZoneInvIndex = _.findIndex(invItems, item => item.id === dropZoneData.id);
      newDropZoneData = getItemWithNewInventoryPosition(dropZoneData, dragItemData.location.inventory.position);
      invItems[dropZoneInvIndex] = newDropZoneData;
    } else {
      // Moving from outside of the inventory
      moveItemRequests = [
        createMoveItemRequestToInventoryPosition({ item: dragItemData, position: dropZoneData.location.inventory.position }),
      ];
      newDragItemData = getItemWithNewInventoryPosition(dragItemData, dropZoneData.location.inventory.position);
    }
  }

  // Make move item requests to save the swapped positions to database
  if (!_.isEmpty(moveItemRequests)) {
    webAPI.ItemAPI.BatchMoveItems(
      webAPI.defaultConfig,
      moveItemRequests,
    );
  } else {
    toastr.error('There was an error', 'Oh No!!', { timeout: 5000 });
    return;
  }

  // Now represent the swap in the UI...
  // Swap positions of items only in the INVENTORY
  if (dragItemData.location.inventory) {
    // Represent the swap in the UI by updating slotNumberToItem
    return {
      inventoryItems: invItems,
      stackGroupIdToItemIDs,
      slotNumberToItem: {
        ...args.slotNumberToItem,
        [newDragItemData.location.inventory.position]: {
          id: dragItemId,
          isStack: isStackedItem(newDragItemData),
          isCrafting: isCraftingItem(newDragItemData),
          isContainer: isContainerItem(newDragItemData),
          item: newDragItemData,
        },
        [newDropZoneData.location.inventory.position]: {
          id: dropZoneId,
          isStack: isStackedItem(newDropZoneData),
          isCrafting: isCraftingItem(newDropZoneData),
          isContainer: isContainerItem(newDropZoneData),
          item: newDropZoneData,
        },
      },
      itemIdToInfo: {
        ...args.itemIdToInfo,
        [dragItemId]: {
          slot: newDragItemData.location.inventory.position,
          icon: newDragItemData.staticDefinition.iconUrl,
        },
        [dropZoneId]: {
          slot: newDropZoneData.location.inventory.position,
          icon: newDropZoneData.staticDefinition.iconUrl,
        },
      },
    };
  }
}

export async function onMoveStackServer(args: {
  slotNumberToItem: SlotNumberToItem,
  itemIdToInfo: ItemIDToInfo,
  itemDataTransfer: InventoryDataTransfer,
  amount: number,
  newPosition: number,
  stackGroupIdToItemIDs: {[id: string]: string[]},
  inventoryItems: InventoryItem.Fragment[],
  containerIdToDrawerInfo: ContainerIdToDrawerInfo,
}) {
  const { itemDataTransfer, newPosition, amount } = args;
  const slotNumberToItem = {...args.slotNumberToItem};
  const itemIdToInfo = {...args.itemIdToInfo};
  const stackGroupIdToItemIDs = {...args.stackGroupIdToItemIDs};
  let inventoryItems = [...args.inventoryItems];
  const item = itemDataTransfer.item;

  // Make request to api server
  const moveReq = createMoveItemRequestToInventoryPosition({
    item,
    position: newPosition,
    amount,
    voxEntityID: itemDataTransfer.voxEntityID,
  });
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    moveReq,
  );
  if (!res.ok) {
    toastr.error('There was a problem trying to move that stack', 'Oh No!!', { timeout: 5000 });
    return {
      slotNumberToItem,
      itemIdToInfo,
      stackGroupIdToItemIDs,
      inventoryItems,
    };
  }

  if (itemDataTransfer.voxEntityID) {
    game.trigger('refetch-vox-job');
  }

  const moveItemResult = tryParseJSON<{ FieldCodes: { Result: MoveItemResult }[] }>(res.data, true);
  if (moveItemResult && moveItemResult.FieldCodes && moveItemResult.FieldCodes[0] && moveItemResult.FieldCodes[0].Result) {
    const data: MoveItemResult = moveItemResult.FieldCodes[0].Result;

    // We need to update the id, unitCount, and position of the new item
    const movingItem: InventoryItem.Fragment = {
      ...itemDataTransfer.item,
      id: data.MovedItemIDs[0],
    };

    const {
      inventoryItems,
      stackGroupIdToItemIDs,
      slotNumberToItem,
      itemIdToInfo,
      containerIdToDrawerInfo,
    } = onMoveStackClient({
      ...args,
      newItemDataTransfer: {
        ...itemDataTransfer,
        item: movingItem,
      }
    });

    return {
      inventoryItems,
      stackGroupIdToItemIDs,
      slotNumberToItem,
      itemIdToInfo,
      containerIdToDrawerInfo,
    };
  }
};

export function onMoveStackClient(args: {
                              slotNumberToItem: SlotNumberToItem,
                              itemIdToInfo: ItemIDToInfo,
                              itemDataTransfer: InventoryDataTransfer,
                              amount: number,
                              newPosition: number,
                              stackGroupIdToItemIDs: {[id: string]: string[]},
                              inventoryItems: InventoryItem.Fragment[],
                              containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                              newItemDataTransfer?: InventoryDataTransfer,
                            }) {
  const { itemDataTransfer, newItemDataTransfer, amount, newPosition } = args;
  const slotNumberToItem = {...args.slotNumberToItem};
  const itemIdToInfo = {...args.itemIdToInfo};
  const stackGroupIdToItemIDs = {...args.stackGroupIdToItemIDs};
  const containerIdToDrawerInfo = {...args.containerIdToDrawerInfo};
  let inventoryItems = [...args.inventoryItems];
  const item = itemDataTransfer.item;

  const originalItem: InventoryItem.Fragment = getItemWithNewUnitCount(item, item.stats.item.unitCount - amount);

  // Represent the move in the UI - Update both the unit count and the inventory position
  const movingItemNewUnitCount = getItemWithNewUnitCount(newItemDataTransfer ? newItemDataTransfer.item : item, amount);
  const movingItem: InventoryItem.Fragment = getItemWithNewInventoryPosition(movingItemNewUnitCount, newPosition);

  if (itemHasContainerPosition(originalItem)) {
    const dragContainerID = itemDataTransfer.containerID &&
      itemDataTransfer.containerID[itemDataTransfer.containerID.length - 1];
    if (dragContainerID) {
      // Update item in container
      containerIdToDrawerInfo[dragContainerID].drawers[itemDataTransfer.drawerID][itemDataTransfer.position] = {
        ...containerIdToDrawerInfo[dragContainerID].drawers[itemDataTransfer.drawerID][itemDataTransfer.position],
        item: originalItem,
      };
    }
  } else if (itemHasInventoryPosition(originalItem)) {
    slotNumberToItem[originalItem.location.inventory.position] = {
      ...slotNumberToItem[originalItem.location.inventory.position],
      item: originalItem,
    };
  }

  const newStackId = getItemMapID(movingItem);

  slotNumberToItem[newPosition] = {
    id: newStackId,
    isStack: isStackedItem(movingItem),
    isCrafting: isCraftingItem(movingItem),
    isContainer: isContainerItem(movingItem),
    item: movingItem,
  };

  itemIdToInfo[newStackId] = {
    icon: getIcon(movingItem),
    slot: newPosition,
  };

  stackGroupIdToItemIDs[newStackId] = [movingItem.id];

  if (itemHasInventoryPosition(originalItem)) {
    inventoryItems = [
      ..._.filter(inventoryItems, invItem => invItem.id !== item.id),
      originalItem,
      movingItem,
    ];
  } else if (itemHasContainerPosition(originalItem)) {
    inventoryItems = [
      ..._.filter(inventoryItems, invItem => invItem.id !== item.id),
      movingItem,
    ];
  }

  return {
    inventoryItems,
    stackGroupIdToItemIDs,
    slotNumberToItem,
    itemIdToInfo,
    containerIdToDrawerInfo,
  };
}

export async function onCombineStackServer(args: {
                                      itemDataTransfer: InventoryDataTransfer,
                                      stackItem: InventoryItem.Fragment,
                                      amount: number,
                                      slotNumberToItem: SlotNumberToItem,
                                      inventoryItems: InventoryItem.Fragment[],
                                      stackGroupIdToItemIDs: {[id: string]: string[]},
                                      containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                                    }) {
  const { itemDataTransfer, stackItem, amount } = args;
  const slotNumberToItem = { ...args.slotNumberToItem };
  const stackGroupIdToItemIDs = { ...args.stackGroupIdToItemIDs };
  let inventoryItems = [...args.inventoryItems];
  const item = itemDataTransfer.item;

  const moveReq = createMoveItemRequestToInventoryPosition({
    item,
    position: stackItem.location.inventory.position,
    amount,
    voxEntityID: itemDataTransfer.voxEntityID,
  });
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    moveReq,
  );
  if (!res.ok) {
    toastr.error('There was a problem trying to move that stack', 'Oh No!!', { timeout: 5000 });
    return {
      slotNumberToItem,
      inventoryItems,
    };
  }

  if (itemDataTransfer.voxEntityID) {
    // Came from vox
    game.trigger('refetch-vox-job');
  }

  const moveItemResult = tryParseJSON<{ FieldCodes: { Result: MoveItemResult }[] }>(res.data, true);
  if (moveItemResult && moveItemResult.FieldCodes && moveItemResult.FieldCodes[0] && moveItemResult.FieldCodes[0].Result) {
    const data: MoveItemResult = moveItemResult.FieldCodes[0].Result;

    // Represent the combine in the UI
    const combinedItem: InventoryItem.Fragment = {
      ...getItemWithNewUnitCount(stackItem, stackItem.stats.item.unitCount + amount),
      id: data.MovedItemIDs[0],
    };

    let updatedItem = null;
    if (amount === item.stats.item.unitCount) {
      // User is trying to combine whole stack, delete old position of item
      delete slotNumberToItem[item.location.inventory.position];
      delete stackGroupIdToItemIDs[getItemMapID(item)];
    } else if (amount < item.stats.item.unitCount) {
      // User is trying to combine part of stack, update old position of item
      if (itemHasInventoryPosition(item)) {
        updatedItem = getItemWithNewUnitCount(item, item.stats.item.unitCount - amount);
        slotNumberToItem[item.location.inventory.position] = {
          ...slotNumberToItem[item.location.inventory.position],
          item: updatedItem,
        };
      }
    }

    // Update combined stack position wiht new item
    slotNumberToItem[combinedItem.location.inventory.position] = {
      ...slotNumberToItem[combinedItem.location.inventory.position],
      item: combinedItem,
    };

    if (updatedItem) {
      // Delete old stack id, and add new stack id to stackGroupIdToItemIDs
      const oldStackId = getItemMapID(stackItem);
      delete stackGroupIdToItemIDs[oldStackId];

      const newStackId = getItemMapID(updatedItem);
      stackGroupIdToItemIDs[newStackId] = [updatedItem.id];
    }

    if (updatedItem) {
      inventoryItems = [
        ..._.filter(inventoryItems, invItem => invItem.id !== stackItem.id),
        combinedItem,
        updatedItem,
      ];
    } else {
      inventoryItems = [
        ..._.filter(inventoryItems, invItem => invItem.id !== stackItem.id),
        combinedItem,
      ];
    }

    return {
      slotNumberToItem,
      inventoryItems,
      stackGroupIdToItemIDs,
    };
  }
}

export function onCombineStackClient(args: {
                                      itemDataTransfer: InventoryDataTransfer,
                                      stackItem: InventoryItem.Fragment,
                                      amount: number,
                                      slotNumberToItem: SlotNumberToItem,
                                      inventoryItems: InventoryItem.Fragment[],
                                      stackGroupIdToItemIDs: {[id: string]: string[]},
                                      containerIdToDrawerInfo: ContainerIdToDrawerInfo,
                                    }) {
  const { itemDataTransfer, stackItem, amount } = args;
  const slotNumberToItem = { ...args.slotNumberToItem };
  const stackGroupIdToItemIDs = { ...args.stackGroupIdToItemIDs };
  const containerIdToDrawerInfo = { ...args.containerIdToDrawerInfo };
  let inventoryItems = [...args.inventoryItems];
  const item = itemDataTransfer.item;

  // Represent the combine in the UI
  const combinedItem: InventoryItem.Fragment = getItemWithNewUnitCount(stackItem, stackItem.stats.item.unitCount + amount);

  let updatedItem = null;
  if (amount === item.stats.item.unitCount) {
    // User is trying to combine whole stack, delete old position of item

    if (itemHasInventoryPosition(item)) {
      // Item was in regular inventory, delete it
      delete slotNumberToItem[item.location.inventory.position];
      delete stackGroupIdToItemIDs[getItemMapID(item)];
    } else if (itemHasContainerPosition(item)) {
      // Item was in container, delete it
      const dragContainerID = itemDataTransfer.containerID[itemDataTransfer.containerID.length - 1];
      delete containerIdToDrawerInfo[dragContainerID].drawers[itemDataTransfer.drawerID][itemDataTransfer.position];
    }
  } else if (amount < item.stats.item.unitCount) {
    // User is trying to combine part of stack, update old position of item
    updatedItem = getItemWithNewUnitCount(item, item.stats.item.unitCount - amount);

    if (itemHasInventoryPosition(updatedItem)) {
      // Drag item was from regular inventory
      slotNumberToItem[item.location.inventory.position] = {
        ...slotNumberToItem[item.location.inventory.position],
        item: updatedItem,
      };
    } else if (itemHasContainerPosition(updatedItem)) {
      // Drag item was from a container, so update the container data structure
      const dragContainerID = itemDataTransfer.containerID[itemDataTransfer.containerID.length - 1];
      containerIdToDrawerInfo[dragContainerID].drawers[itemDataTransfer.drawerID][itemDataTransfer.position] = {
        ...containerIdToDrawerInfo[dragContainerID].drawers[itemDataTransfer.drawerID][itemDataTransfer.position],
        item: updatedItem,
      };
    }
  }

  // Update combined stack position wiht new item
  slotNumberToItem[combinedItem.location.inventory.position] = {
    ...slotNumberToItem[combinedItem.location.inventory.position],
    item: combinedItem,
  };

  if (updatedItem && itemHasInventoryPosition(updatedItem)) {
    inventoryItems = [
      ..._.filter(inventoryItems, invItem => invItem.id !== stackItem.id),
      combinedItem,
      updatedItem,
    ];
  } else {
    inventoryItems = [
      ..._.filter(inventoryItems, invItem => invItem.id !== stackItem.id),
      combinedItem,
    ];
  }

  return {
    slotNumberToItem,
    inventoryItems,
    stackGroupIdToItemIDs,
  };
}

function createStackMoveItemRequests(args: {
                                      item: InventoryItem.Fragment,
                                      amount: number,
                                      newPosition: number,
                                      stackGroupIdToItemIDs: {[id: string]: string[]},
                                      inventoryItems: InventoryItem.Fragment[];
                                    }) {
  const { item, amount, newPosition } = args;
  if (isStackedItem(item)) {
    const itemId = getItemMapID(item);
    const moveItemRequests: any = [];
    _.values(args.stackGroupIdToItemIDs[itemId]).forEach((id, i) => {
      if (i + 1 > amount) {
        return;
      }
      const item = _.find(args.inventoryItems, inventoryItem => inventoryItem.id === id);
      moveItemRequests.push(createMoveItemRequestToInventoryPosition({
        item,
        position: newPosition,
      }));
    });
    return moveItemRequests;
  }

  return [];
}

export function onEquipItem(payload: EquipItemPayload, equippedItemsList: EquippedItem.Fragment[]) {
  const { newItem, prevEquippedItem, willEquipTo } = payload;
  const equippedItems = [...equippedItemsList];

  let filteredItems = _.filter(equippedItems, ((equippedItem) => {
    if (newItem.location === 'equipped') {
      // New Item was previously equipped somewhere else, filter replaced items and previously equipped.
      return !_.find(equippedItem.gearSlots, (gearSlot): any => {
        return _.find(newItem.gearSlots, slot => gearSlot.id === slot.id) ||
          _.find(willEquipTo, slot => gearSlot.id === slot.id);
      });
    }

    // New item coming from inventory, contianer, etc. Only filter replaced items.
    return !_.find(equippedItem.gearSlots, (gearSlot): any => {
      return _.find(willEquipTo, slot => gearSlot.id === slot.id);
    });
  }));

  makeEquipItemRequest(newItem.item, willEquipTo);

  if (newItem.location === 'equipped' && prevEquippedItem) {
    // We are swapping items that are currently equipped
    const swappedItem: InventoryItem.Fragment = {
      ...prevEquippedItem.item,
      location: {
        inventory: null,
        inContainer: null,
        inVox: null,
        equipped: {
          gearSlots: newItem.gearSlots,
        },
      },
    };
    const swappedEquippedItem = { item: swappedItem, gearSlots: newItem.gearSlots };
    makeEquipItemRequest(swappedEquippedItem.item, swappedEquippedItem.gearSlots);
    filteredItems = filteredItems.concat(swappedEquippedItem);
  }

  const nextItem: InventoryItem.Fragment = {
    ...newItem.item,
    location: {
      inventory: null,
      inContainer: null,
      inVox: null,
      equipped: {
        gearSlots: willEquipTo,
      },
    },
  };
  const newEquippedItem = { item: nextItem, gearSlots: willEquipTo };

  const itemToBeReplaced = _.filter(equippedItems, equippedItem =>
    _.findIndex(equippedItem.gearSlots, gearSlot =>
      _.find(willEquipTo, slot => slot.id === gearSlot.id),
    ) > -1)
    .map((equippedItem) => {
      return getEquippedDataTransfer({
        item: equippedItem.item,
        position: 0,
        location: 'equipped',
        gearSlots: equippedItem.gearSlots,
      });
    });

  if (newItem.location === 'inventory') {
    const updateInventoryItemsPayload: UpdateInventoryItemsPayload = {
      type: 'Equip',
      inventoryItem: newItem,
      willEquipTo,
      equippedItem: itemToBeReplaced.length > 0 ? itemToBeReplaced : null,
    };

    game.trigger(eventNames.updateInventoryItems, updateInventoryItemsPayload);
  }

  return filteredItems.concat(newEquippedItem);
}
