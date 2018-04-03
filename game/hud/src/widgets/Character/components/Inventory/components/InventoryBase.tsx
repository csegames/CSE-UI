/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';
import { ql, events, webAPI, client, MoveItemRequest, Vec3F, Euler3f } from 'camelot-unchained';

import { InventoryRow } from './InventoryRow';
import { nullVal, InventoryFilterButton, emptyStackHash } from '../../../lib/constants';
import eventNames, { UpdateInventoryItems, UnequipItemCallback } from '../../../lib/eventNames';
import { DrawerCurrentStats } from './Containers/Drawer';
import {
  InventorySlotItemDef,
  CraftingSlotItemDef,
  ContainerSlotItemDef,
  SlotType,
  slotDimensions,
} from './InventorySlot';
import {
  InventoryItemFragment,
  EquippedItemFragment,
  InventoryBaseQuery,
  ContainedItemsFragment,
  GearSlotDefRefFragment,
} from '../../../../../gqlInterfaces';
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
  getItemMass,
  getItemQuality,
  getItemUnitCount,
  getInventoryDataTransfer,
  hasActiveFilterButtons,
  hasFilterText,
  isContainerItem,
  isCraftingItem,
  isStackedItem,
  itemHasPosition,
  shouldShowItem,
  createMoveItemRequestToContainerPosition,
} from '../../../lib/utils';

export interface InventoryBaseStyle extends StyleDeclaration {
  InventoryBase: React.CSSProperties;
}

export const defaultInventoryBaseStyle: InventoryBaseStyle = {
  InventoryBase: {

  },
};

export interface InventoryDataTransfer {
  item: InventoryItemFragment;
  position: number;
  location: string;
  drawerID?: string;
  containerID?: string[];
  gearSlots?: GearSlotDefRefFragment[];
}

export interface SlotNumberToItem {
  [id: number]: {
    id: string;
    isStack: boolean;
    isCrafting: boolean;
    isContainer: boolean;
    item?: InventoryItemFragment;
  };
}

export interface InventoryBaseProps {
  styles?: Partial<InventoryBaseStyle>;
  searchValue: string;
  activeFilters: {[id: string]: InventoryFilterButton};
  onChangeContainerIdToDrawerInfo: (newObj: ContainerIdToDrawerInfo) => void;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  onChangeInventoryItems?: (inventoryItems: InventoryItemFragment[]) => void;
  inventoryItems?: InventoryItemFragment[];
}

export interface InventoryBaseWithQLProps extends GraphQLInjectedProps<InventoryBaseQuery> {
  styles?: Partial<InventoryBaseStyle>;
  searchValue: string;
  activeFilters: {[id: string]: InventoryFilterButton};
  onChangeContainerIdToDrawerInfo: (newObj: ContainerIdToDrawerInfo) => void;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  onChangeInventoryItems?: (inventoryItems: InventoryItemFragment[]) => void;
  inventoryItems?: InventoryItemFragment[];
  equippedItems?: EquippedItemFragment[];
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
  item?: InventoryItemFragment;
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

  itemIdToInfo: ItemIDToInfo;
  slotNumberToItem: SlotNumberToItem;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;

  // map of item id to a stack group id
  // a stack group id is a `${stackHash}:${number}`
  // the stack group is used to identify items that
  // share a stack hash but not the same slot in
  // the inventory. The stack group id is used in
  // the itemIdToInfo & slotNumberToItemId maps
  stackGroupIdToItemIDs: {[id: string]: string[]};
  itemIDToStackGroupID: {[id: string]: string};

  craftingNameToItemIDs: {[name: string]: string[]};
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
    containerIdToDrawerInfo: {},
    stackGroupIdToItemIDs: {},
    itemIDToStackGroupID: {},
    craftingNameToItemIDs: {},
  };
}

export function createRowElementsForCraftingItems(state: InventoryBaseState,
                                                  props: InventoryBaseProps,
                                                  itemData: {items: InventoryItemFragment[]},
                                                  syncWithServer: () => void,
                                                  bodyWidth: number) {
  const rows: JSX.Element[] = [];
  const rowData: CraftingSlotItemDef[][] = [];

  let slotIndex = 0;
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: CraftingSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const item = itemData.items[slotIndex];

      if (!item) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: slotIndex, location: 'inventory' },
          disableDrop: true,
        });
        continue;
      }
      rowItems.push({
        slotType: SlotType.CraftingItem,
        icon: getIcon(item),
        itemID: item.id,
        quality: getItemQuality(item),
        itemCount: getItemUnitCount(item),
        slotIndex: { position: slotIndex - 1, location: 'inventory' },
        item,
      });
      ++slotIndex;
    }
    rows.push((
      <InventoryRow
        showGraySlots
        key={rowIndex}
        items={rowItems}
        onDropOnZone={() => {}}
        inventoryItems={props.inventoryItems}
        onChangeInventoryItems={props.onChangeInventoryItems}
        containerIdToDrawerInfo={props.containerIdToDrawerInfo}
        onContainerIdToDrawerInfoChange={props.onChangeContainerIdToDrawerInfo}
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
  itemData: {items: any[]},
  containerID: string[],
  drawerID: string,
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void,
  containerPermissions: number,
  drawerMaxStats: ql.schema.ContainerDefStat_Single,
  drawerCurrentStats: DrawerCurrentStats,
  syncWithServer: () => void,
  bodyWidth: number,
}) {
  // Difference between these elements and regular row elements is that these are not located in slotNumberToItem because
  // they have a position that is inContainer and not inventory.
  const { state, props, containerID, drawerID, onDropOnZone, containerPermissions,
    drawerMaxStats, drawerCurrentStats, syncWithServer, bodyWidth } = payload;
  const rows: JSX.Element[] = [];
  const rowData: ContainerSlotItemDef[][] = [];
  let slotIndex = 0;

  for (let rowIndex = 0; rowIndex < state.rowCount; rowIndex++) {
    const rowItems: ContainerSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; i++) {
      const myContainerID = containerID[containerID.length - 1];
      const container = props.containerIdToDrawerInfo[myContainerID];
      const slot = container ? container.drawers[drawerID][slotIndex] : 0;
      const item = slot && slot.item;
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

      if (isContainerItem(item)) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: item.staticDefinition.iconUrl,
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          item,
          containerPermissions,
        });

        slotIndex++;
        continue;
      }

      if (isCraftingItem(item)) {
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: item.staticDefinition.iconUrl,
          groupStackHashID: item.id,
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          containerPermissions,
        });

        slotIndex++;
        continue;
      }

      if (isStackedItem(item)) {
        rowItems.push({
          slotType: SlotType.Stack,
          icon: item.staticDefinition.iconUrl,
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
          item,
          containerPermissions,
        });

        slotIndex++;
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: item.staticDefinition.iconUrl,
        itemID: item.id,
        slotIndex: { position: slotIndex, location: 'inContainer', containerID, drawerID },
        item,
        containerPermissions,
      });
      slotIndex++;
    }

    rows.push((
      <InventoryRow
        showGraySlots
        key={rowIndex}
        items={rowItems}
        onDropOnZone={onDropOnZone}
        onChangeInventoryItems={props.onChangeInventoryItems}
        inventoryItems={props.inventoryItems}
        containerID={containerID}
        containerIdToDrawerInfo={props.containerIdToDrawerInfo}
        onContainerIdToDrawerInfoChange={props.onChangeContainerIdToDrawerInfo}
        syncWithServer={syncWithServer}
        bodyWidth={bodyWidth}
        drawerCurrentStats={drawerCurrentStats}
        drawerMaxStats={drawerMaxStats}
      />
    ));
    rowData.push(rowItems);
  }
  return {
    rows,
    rowData,
  };
}

export function createRowElements(
  state: InventoryBaseState,
  props: Partial<InventoryBaseWithQLProps>,
  itemData: {items: InventoryItemFragment[]},
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void,
  syncWithServer: () => void,
  bodyWidth: number,
) {
  const rows: JSX.Element[] = [];
  const rowData: InventorySlotItemDef[][] = [];
  let slotIndex = 0;
  const itemMap = itemData ? _.keyBy(itemData.items, i => i.id) : {};
  for (let rowIndex = 0; rowIndex < state.rowCount; ++rowIndex) {
    const rowItems: InventorySlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; ++i) {
      const itemDef = state.slotNumberToItem[slotIndex++];
      if (!itemDef) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
        });
        continue;
      }

      if (itemDef.isContainer) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: state.itemIdToInfo[itemDef.id].icon,
          itemID: itemDef.id,
          item: itemDef.item,
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
        });
        continue;
      }

      if (itemDef.isCrafting) {
        const stackId = itemDef.item.stackHash !== emptyStackHash ? itemDef.item.stackHash : itemDef.id;
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: state.itemIdToInfo[itemDef.id].icon,
          groupStackHashID: itemDef.id,
          stackedItems: state.stackGroupIdToItemIDs[stackId] ?
            state.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [itemDef.item],
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
        });
        continue;
      }

      if (itemDef.isStack) {
        const infoId = state.itemIdToInfo[itemDef.id] ? itemDef.id : getItemMapID(itemDef.item);
        const stackId = itemDef.item.stackHash !== emptyStackHash ? itemDef.item.stackHash : itemDef.id;
        rowItems.push({
          slotType: SlotType.Stack,
          icon: state.itemIdToInfo[infoId].icon,
          itemID: itemDef.id,
          item: itemDef.item,
          slotIndex: { position: slotIndex - 1, location: 'inventory' },
          stackedItems: state.stackGroupIdToItemIDs[stackId] ?
            state.stackGroupIdToItemIDs[stackId].map(id => itemMap[id]) : [itemDef.item],
        });
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: state.itemIdToInfo[itemDef.id].icon,
        itemID: itemDef.id,
        item: itemDef.item,
        slotIndex: { position: slotIndex - 1, location: 'inventory' },
      });
    }

    rows.push((
      <InventoryRow
        equippedItems={props.equippedItems}
        key={rowIndex}
        items={rowItems}
        onDropOnZone={onDropOnZone}
        filtering={!_.isEmpty(props.activeFilters)}
        inventoryItems={props.inventoryItems}
        onChangeInventoryItems={props.onChangeInventoryItems}
        containerIdToDrawerInfo={props.containerIdToDrawerInfo}
        onContainerIdToDrawerInfoChange={props.onChangeContainerIdToDrawerInfo}
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

export function distributeItems(
  slotsData: {
    slotsPerRow: number,
    rowCount: number,
    slotCount: number,
  },
  itemData: {
    items: InventoryItemFragment[],
  },
  state: InventoryBaseState,
  props: Partial<InventoryBaseWithQLProps>): InventoryBaseState {
  if (!itemData || !itemData.items) {
    return {
      ...slotsData,
      itemIdToInfo: {},
      slotNumberToItem: {},
      containerIdToDrawerInfo: {},
      stackGroupIdToItemIDs: {},
      itemIDToStackGroupID: {},
      craftingNameToItemIDs: {},
      firstEmptyIndex: 0,
    };
  }

  const items = props.inventoryItems ? { items: props.inventoryItems } : itemData;
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
  props: Partial<InventoryBaseWithQLProps>): InventoryBaseState {
  const itemIdToInfo: {[id: string]: {slot: number, icon: string}} = {};
  const slotNumberToItem: SlotNumberToItem = {};
  const containerIdToDrawerInfo: ContainerIdToDrawerInfo = {};
  const stackGroupIdToItemIDs = {};
  const itemIDToStackGroupID = {};
  const craftingNameToItemIDs = {};

  const firstEmptyIndex = 0;
  const moveRequests: webAPI.MoveItemRequest[] = [];

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
        const stackId = item.stackHash !== emptyStackHash ? item.stackHash : id;

        if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id !== stackId)) {
          partitionedItems.noPositionStackedItems[id] = itemArr;
          return;
        }

        itemIDToStackGroupID[item.id] = stackId;

        slotNumberToItem[wantPosition] = {
          id,
          isCrafting: isCraftingItem(item),
          isStack: isStackedItem(item),
          isContainer: isContainerItem(item),
          item,
        };
        itemIdToInfo[id] = { slot: wantPosition, icon: getIcon(item) };
      }
    });
  });

  // place crafted items if they have a position into their spot.
  _.values(partitionedItems.craftingItems).forEach((craftingItemArr) => {
    craftingItemArr.forEach((item) => {
      const id = getItemMapID(item);
      const wantPosition = partitionedItems.idToGroupIDMap[id][0].position;

      if (wantPosition === -1 || (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id !== id)) {
        partitionedItems.noPositionItems.push(item);
        return;
      } else if (slotNumberToItem[wantPosition] && slotNumberToItem[wantPosition].id === id) {
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
    const stackId = item.stackHash !== emptyStackHash ? item.stackHash : id;

    // check if something is in this position already...
    if (slotNumberToItem[position] && slotNumberToItem[position].id !== id) {
      // if we're here then something else is in the slot and it's not this item or a stack of this item
      // so push this into the no position array and sort position out that way.
      noPositionArr.push(item);
      return;
    }
    // we will use stack hash if valid, otherwise item id as the id
    if (!stackGroupIdToItemIDs[stackId]) {
      stackGroupIdToItemIDs[stackId] = [item.id];
    } else {
      stackGroupIdToItemIDs[stackId].push(item.id);
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
          isContainer: isContainerItem(item),
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

    const position = firstAvailableSlot(firstEmptyIndex, slotNumberToItem);
    moveRequests.push(createMoveItemRequestToInventoryPosition(item, position));
    slotNumberToItem[position] = {
      id,
      isCrafting: isCraftingItem(item),
      isStack: isStackedItem(item),
      isContainer: isContainerItem(item),
      item,
    };
    itemIdToInfo[id] = { slot: position, icon: getIcon(item) };
  });

  // Handle container items and put them into a containerIdToDrawerInfo
  partitionedItems.containerItems.forEach((_containerItem) => {
    const drawers: DrawerIdToSlotNumberToItem = {};
    _containerItem.containerDrawers.forEach((_drawer) => {
      const drawerSlotNumberToItem = {};
      const noPositionSlots: ContainedItemsFragment[] = [];

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
          noPositionSlots.push(_item);
        }
      });

      // Give non positioned items some position!
      let openSlotNum = 0;
      const assignOpenSlotNum = (_item: ContainedItemsFragment) => {
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

          // Push a move item request
          moveRequests.push(
            createMoveItemRequestToContainerPosition(
              getInventoryDataTransfer({
                item: _item as InventoryItemFragment,
                position: _item.location.inContainer.position,
                location: 'inContainer',
                containerID: [_containerItem.id],
                drawerID: _drawer.id,
              }),
              getInventoryDataTransfer({
                item: _item as InventoryItemFragment,
                position: openSlotNum,
                location: 'inContainer',
                containerID: [_containerItem.id],
                drawerID: _drawer.id,
              }),
            ),
          );
          return;
        }
      };
      noPositionSlots.forEach((_noPosItem) => {
        assignOpenSlotNum(_noPosItem);
      });

      drawers[_drawer.id] = drawerSlotNumberToItem;
    });

    // Assign drawers to container ID
    containerIdToDrawerInfo[_containerItem.id] = {
      drawers,
    };
  });

  props.onChangeContainerIdToDrawerInfo(containerIdToDrawerInfo);

  const inventoryItems = [...itemData.items];
  moveRequests.forEach((moveRequest: any) => {
    const itemId = moveRequest.moveItemID;
    const itemIndex = _.findIndex(itemData.items, item => item.id === itemId);
    if (inventoryItems[itemIndex]) {
      inventoryItems[itemIndex].location.inventory = {
        position: moveRequest.to.position,
      };
    }
  });

  if (props.onChangeInventoryItems) {
    props.onChangeInventoryItems(inventoryItems);
  }
  // batch move all items with no position
  if (moveRequests.length > 0) {
    webAPI.ItemAPI.BatchMoveItems(webAPI.defaultConfig, client.loginToken, client.shardID, client.characterID, moveRequests);
  }

  return {
    ...slotsData,
    itemIdToInfo,
    slotNumberToItem,
    containerIdToDrawerInfo,
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
props: Partial<InventoryBaseWithQLProps>): InventoryBaseState {
  const oldItemIdToInfo = _.merge({}, state.itemIdToInfo);
  const oldSlotNumberToItem = Object.assign({}, state.slotNumberToItem);
  const stackGroupIdToItemIDs = Object.assign({}, state.stackGroupIdToItemIDs);
  const itemIDToStackGroupID = Object.assign({}, state.itemIDToStackGroupID);
  const craftingNameToItemIDs = Object.assign({}, state.craftingNameToItemIDs);

  const itemIdToInfo: {[id: string]: {slot: number, icon: string}} = {};
  const slotNumberToItem: SlotNumberToItem = {};
  const containerIdToDrawerInfo: ContainerIdToDrawerInfo = {};
  const filteredItems = _.keyBy(itemData.items.filter(i =>
    shouldShowItem(i, props.activeFilters, props.searchValue)), i => i.id);

  let indexCounter = 0;
  for (let i = 0; i < state.slotCount; ++i) {
    const itemDef = oldSlotNumberToItem[i];
    if (!itemDef) continue;

    let itemID = itemDef.id;
    if ((itemDef.isStack || itemDef.isCrafting) && !_.isEmpty(stackGroupIdToItemIDs[itemDef.id])) {
      itemID = stackGroupIdToItemIDs[itemDef.id][0];
    }

    if (!filteredItems[itemID]) {
      continue;
    }
    const oldItem = oldItemIdToInfo[itemID];
    slotNumberToItem[indexCounter] = itemDef;
    itemIdToInfo[itemDef.id] = { slot: indexCounter, icon: oldItem ? oldItem.icon : '' };
    itemIdToInfo[itemID] = { slot: indexCounter, icon: oldItem ? oldItem.icon : '' };

    indexCounter++;
  }

  for (const key in filteredItems) {
    if (itemIdToInfo[key]) continue;

    const item = filteredItems[key];

    const isCrafting = isCraftingItem(item);
    const isStack = isStackedItem(item);
    const isContainer = isContainerItem(item);

    const id = isCrafting || isStack ? itemIDToStackGroupID[item.id] : item.id;

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
    containerIdToDrawerInfo,
    stackGroupIdToItemIDs,
    itemIDToStackGroupID,
    firstEmptyIndex: indexCounter,
    craftingNameToItemIDs,
  };
}

export function partitionItems(items: InventoryItemFragment[]) {
  const itemIdToIcon: {[id: string]: string} = {};
  const craftingItems: {[name: string]: InventoryItemFragment[]} = {};
  const stackedItemsWithPosition: {[stackGroupID: string]: InventoryItemFragment[]} = {};
  const noPositionStackedItems: {[stackGroupID: string]: InventoryItemFragment[]} = {};
  const positionedItems: InventoryItemFragment[] = [];
  const noPositionItems: InventoryItemFragment[] = [];
  const idToGroupIDMap: {[stackHash: string]: {position: number, stackGroupID: string}[]} = {};
  const containerItems: InventoryItemFragment[] = [];

  const temporaryNoPositionStackedItems: InventoryItemFragment[] = [];

  const moveRequests: webAPI.MoveItemRequest[] = [];

  items.forEach((item) => {
    if (isContainerItem(item)) {
      containerItems.push(item);

      // Find nested containers
      item.containerDrawers.forEach((drawers) => {
        drawers.containedItems.forEach((_item) => {
          if (isContainerItem(_item as InventoryItemFragment)) {
            containerItems.push(_item as InventoryItemFragment);
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
      const stackId = item.stackHash !== emptyStackHash ? item.stackHash : id;
      if (itemHasPosition(item)) {
        const wantPosition = getItemInventoryPosition(item);

        let stackGroupID = '';

        let stackGroupIndex = -1;
        if (stackId) {
          stackGroupIndex = _.findIndex(idToGroupIDMap[stackId], gm => gm.position === wantPosition);
        }

        if (stackGroupIndex > -1) {
          stackGroupID = stackId;
        } else {
          stackGroupID = stackId;
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

  temporaryNoPositionStackedItems.forEach((item) => {
    const foundOtherStack = _.find(items, invItem => item.stackHash !== emptyStackHash ?
      item.stackHash === invItem.stackHash : getItemMapID(item) === getItemMapID(invItem));
    const id = getItemMapID(item);
    const stackId = item.stackHash !== emptyStackHash ? item.stackHash : id;

    if (foundOtherStack && itemHasPosition(foundOtherStack)) {
      const wantPosition = getItemInventoryPosition(item);

      let stackGroupID = '';

      let stackGroupIndex = -1;
      if (stackId) {
        stackGroupIndex = _.findIndex(idToGroupIDMap[id], gm => gm.position === wantPosition);
      }

      if (stackGroupIndex > -1) {
        stackGroupID = stackId;
      } else {
        stackGroupID = stackId;
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

    if (foundOtherStack && !itemHasPosition(foundOtherStack)) {
      let stackGroupId = '';
      if (idToGroupIDMap[id]) {
        stackGroupId = idToGroupIDMap[id][0].stackGroupID;
      } else {
        stackGroupId = generateStackGroupID(stackId, stackGroupCounter);
        stackGroupCounter++;
        idToGroupIDMap[id] = [{
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
    containerItems,
    stackedItemsWithPosition,
    noPositionStackedItems,
    positionedItems,
    noPositionItems,
    idToGroupIDMap,
    moveRequests,
  };
}

export function getContainerHeaderInfo(items: (InventoryItemFragment | ContainedItemsFragment)[]) {
  let totalUnitCount = 0;
  let averageQuality = 0;
  let weight = 0;
  const stackedItemsLength = _.isArray(items) ? items.length : 0;

  _.isArray(items) && items.forEach((item: any) => {
    totalUnitCount += getItemUnitCount(item);
    averageQuality += getItemQuality(item);
    weight += getItemMass(item);
  });
  return {
    totalUnitCount: Number(totalUnitCount.toFixed(2)),
    averageQuality: Number((averageQuality / stackedItemsLength).toFixed(2)),
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
    const deleteRows =
      state.rowCount - (_.findLastIndex(rowData, row => _.find(row, slot => slot.slotType !== SlotType.Empty)) + 1);
    if (state.rowCount - deleteRows >= 2) {
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
    // Came from a container
    const equippedItems: any[] =
      _.isArray(payload.equippedItem) ? payload.equippedItem : [payload.equippedItem];
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
          inContainer: {
            position: -1,
          },
        }} as InventoryItemFragment];

      slotNumberToItem[slot] = {
        id: equippedItem.item.id,
        isCrafting: false,
        isStack: false,
        isContainer: false,
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
  } else if (payload.inventoryItem && itemIdToInfo[getItemMapID(payload.inventoryItem)]) {
    // If only inventory item provided by event. EQUIP or DROP
    const id = getItemMapID(payload.inventoryItem);
    const slotNumber = itemIdToInfo[id].slot;
    if (slotNumberToItem[slotNumber].id === id) {
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
      equipItemRequest(payload.inventoryItem, payload.willEquipTo, null, slotNumber);
    }

  } else if (payload.equippedItem && !_.isArray(payload.equippedItem) && !itemIdToInfo[payload.equippedItem.item.id]) {
    // If only equipped item provided by event. UNEQUIP
    const slotNumber = firstAvailableSlot(0, slotNumberToItem);
    inventoryItems = [...inventoryItems, {
      ...payload.equippedItem.item,
      location: {
        inventory: {
          position: slotNumber,
        },
        inContainer: {
          position: -1,
        },
      }} as InventoryItemFragment,
    ];
    slotNumberToItem[slotNumber] = {
      id: payload.equippedItem.item.id,
      isCrafting: false,
      isStack: false,
      isContainer: false,
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

export async function equipItemRequest(item: InventoryItemFragment,
                            gearSlotDefs: Partial<ql.schema.GearSlotDefRef>[],
                            equippedItem: EquippedItemFragment,
                            equipToSlotNumber: number) {
  const gearSlotIDs = gearSlotDefs.map(gearSlot => gearSlot.id);
  const inventoryItemPosition = getItemInventoryPosition(item);
  const request = JSON.stringify({
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
    }});
  const res = await webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      request as any,
    );
  setTimeout(() => events.fire(eventNames.updateCharacterStats), 100);

  // TEMPORARY: If webAPI fails, then fall back to client command EquipItem
  if (!res.ok) {
    client.EquipItem(item.id);
    return;
  }

  if (equippedItem) {
    const equippedGearSlotIDs = equippedItem.gearSlots.map(gearSlot => gearSlot.id);
    const equippedItemReq = JSON.stringify({
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
    });
    await webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      client.characterID,
      equippedItemReq as any,
    );
  }
}

export async function unequipItemRequest(item: InventoryItemFragment,
                                gearSlotDefs: Partial<ql.schema.GearSlotDefRef>[],
                                slotNumberToItem: SlotNumberToItem) {
  const gearSlotIDs = gearSlotDefs.map(gearSlot => gearSlot.id);
  const request = JSON.stringify({
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
  });
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    request as any,
  );
  setTimeout(() => events.fire(eventNames.updateCharacterStats), 100);
  // TEMPORARY: If webAPI fails, then fall back to client command UnequipItem
  if (!res.ok) {
    client.UnequipItem(item.id);
  }
}

export async function dropItemRequest(item: InventoryItemFragment) {
  const request = JSON.stringify({
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
  });
  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    request as any,
  );
  // TEMPORARY: If webAPI fails, then fall back to client command DropItem
  if (!res.ok) {
    client.DropItem(item.id);
  }
}

export function onCommitPlacedItem(item: InventoryItemFragment, position: Vec3F, rotation: Euler3f) {
  const moveItemReq = JSON.stringify(createMoveItemRequestToWorldPosition(item, position, rotation));
  webAPI.ItemAPI.MoveItems(webAPI.defaultConfig, client.loginToken, client.shardID, client.characterID, moveItemReq as any);
}

export function onMoveInventoryItem(dragItemData: InventoryDataTransfer,
                                    dropZoneData: InventoryDataTransfer,
                                    state: InventoryBaseState,
                                    props: InventoryBaseProps) {
  if (!dropZoneData.item) {
    return moveInventoryItemToEmptySlot(dragItemData, dropZoneData, state, props);
  } else {
    return swapInventoryItems(dragItemData, dropZoneData, state, props);
  }
}

function moveInventoryItemToEmptySlot(dragItemData: InventoryDataTransfer,
                                      dropZoneData: InventoryDataTransfer,
                                      state: InventoryBaseState,
                                      props: InventoryBaseProps) {
  const containerIdToDrawerInfo = state.containerIdToDrawerInfo;
  let dragItem: InventoryItemFragment = dragItemData.item;

  // If equipped item moving to empty slot in inventory, then unequip it
  if (dragItemData.gearSlots) {
    const payload: UnequipItemCallback = {
      item: dragItemData.item,
      gearSlots: dragItemData.gearSlots,
      dontUpdateInventory: true,
    };
    events.fire(eventNames.onUnequipItem, payload);
  }

  const dragItemId = getItemMapID(dragItem);
  const moveItemReq = JSON.stringify(createMoveItemRequestToInventoryPosition(dragItem, dropZoneData.position));
  webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    moveItemReq as any,
  );

  // Now represent the swap in the UI...
  const oldDragItemPosition = dragItem.location.inventory ? dragItem.location.inventory.position : -1;
  if (dragItem.location.inventory) {
    dragItem.location.inventory.position = dropZoneData.position;
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
          position: dropZoneData.position,
        },
        inContainer: null,
      },
    };
  }

  // Move all stacked items
  let invItems = props.inventoryItems;
  const itemIndex = _.findIndex(invItems, item => item.id === dragItem.id);
  if (itemIndex > -1) {
    const stackId = dragItem.stackHash !== emptyStackHash ? dragItem.stackHash : dragItemId;
    if (isStackedItem(dragItem) && state.stackGroupIdToItemIDs[stackId]) {
      const moveRequests: MoveItemRequest[] = [];
      state.stackGroupIdToItemIDs[stackId].forEach((itemId) => {
        const i = _.findIndex(invItems, item => itemId === item.id);
        invItems[i] = {
          ...invItems[i],
          location: {
            ...invItems[i].location,
            inventory: {
              ...invItems[i].location.inventory,
              position: dropZoneData.position,
            },
          },
        };
        moveRequests.push(createMoveItemRequestToInventoryPosition(invItems[i], dropZoneData.position));
      });

      webAPI.ItemAPI.BatchMoveItems(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        moveRequests,
      );
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

  props.onChangeInventoryItems(invItems);

  delete state.slotNumberToItem[oldDragItemPosition];
  return {
    slotNumberToItem: {
      ...state.slotNumberToItem,
      [dropZoneData.position]: {
        id: dragItemId,
        isStack: isStackedItem(dragItem),
        isCrafting: isCraftingItem(dragItem),
        isContainer: isContainerItem(dragItem),

        item: dragItem,
      },
    },

    itemIdToInfo: {
      ...state.itemIdToInfo,
      [dragItemId]: {
        slot: dropZoneData,
        icon: dragItem.staticDefinition.iconUrl,
      },
    },

    containerIdToDrawerInfo: {
      ...containerIdToDrawerInfo,
    },
  };
}

function swapInventoryItems(dragItem: InventoryDataTransfer,
                            dropZone: InventoryDataTransfer,
                            state: InventoryBaseState,
                            props: InventoryBaseProps,
                          ) {
  const dragItemData = dragItem.item;
  const dropZoneData = dropZone.item;
  const dragItemId = getItemMapID(dragItemData);
  const dropZoneId = getItemMapID(dropZoneData);
  const invItems = props.inventoryItems;
  let moveItemRequests: any[] = [];
  if (isStackedItem(dragItemData) && state.stackGroupIdToItemIDs[dragItemId]) {
    // If dragged item is stacked item, add moveItem requests for each item in the stack.
    const requests = createStackMoveItemRequests(dragItemData, dragItemData.location.inventory.position, state, props);
    moveItemRequests = requests;

    state.stackGroupIdToItemIDs[dragItemId].forEach((itemId) => {
      const i = _.findIndex(invItems, item => item.id === itemId);
      invItems[i] = {
        ...invItems[i],
        location: {
          ...invItems[i].location,
          inventory: {
            ...invItems[i].location.inventory,
            position: dropZoneData.location.inventory.position,
          },
        },
      };
    });
  }

  if (isStackedItem(dropZoneData) && state.stackGroupIdToItemIDs[dropZoneId]) {
    // If dropzone item is stacked item, add moveItem requests for each item in the stack.
    const requests = createStackMoveItemRequests(dropZoneData, dragItemData.location.inventory.position, state, props);
    moveItemRequests = [...moveItemRequests, ...requests];

    state.stackGroupIdToItemIDs[dropZoneId].forEach((itemId) => {
      const i = _.findIndex(invItems, item => item.id === itemId);
      invItems[i] = {
        ...invItems[i],
        location: {
          ...invItems[i].location,
          inventory: {
            ...invItems[i].location.inventory,
            position: dragItemData.location.inventory.position,
          },
        },
      };
    });
  }

  if (!isStackedItem(dragItemData) && !isStackedItem(dropZoneData)) {
    // Both drag item and drop zone item are not stacked items. Just make two moveItem requests.
    if (dragItemData.location.inventory) {
      moveItemRequests = [
        createMoveItemRequestToInventoryPosition(dragItemData, dropZoneData.location.inventory.position),
        createMoveItemRequestToInventoryPosition(dropZoneData, dragItemData.location.inventory.position),
      ];
    } else {
      moveItemRequests = [
        createMoveItemRequestToInventoryPosition(dragItemData, dropZoneData.location.inventory.position),
      ];
    }
  }

  props.onChangeInventoryItems(invItems);

  // Make move item requests to save the swapped positions to database
  webAPI.ItemAPI.BatchMoveItems(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    moveItemRequests,
  );

  // Now represent the swap in the UI...
  // Swap positions of items only in the INVENTORY
  if (dragItemData.location.inventory) {
    const oldDragItemPosition = dragItemData.location.inventory.position;
    const oldDropZonePosition = dropZoneData.location.inventory.position;
    dragItemData.location.inventory.position = oldDropZonePosition;
    dropZoneData.location.inventory.position = oldDragItemPosition;

    // Represent the swap in the UI by updating slotNumberToItem
    return {
      slotNumberToItem: {
        ...state.slotNumberToItem,
        [dragItemData.location.inventory.position]: {
          id: dragItemId,
          isStack: isStackedItem(dragItemData),
          isCrafting: isCraftingItem(dragItemData),
          isContainer: isContainerItem(dragItemData),

          item: dragItemData,
        },
        [dropZoneData.location.inventory.position]: {
          id: dropZoneId,
          isStack: isStackedItem(dropZoneData),
          isCrafting: isCraftingItem(dropZoneData),
          isContainer: isContainerItem(dropZoneData),

          item: dropZoneData,
        },
      },
      itemIdToInfo: {
        ...state.itemIdToInfo,
        [dragItemId]: {
          slot: dragItemData.location.inventory.position,
          icon: dragItemData.staticDefinition.iconUrl,
        },
        [dropZoneId]: {
          slot: dropZoneData.location.inventory.position,
          icon: dropZoneData.staticDefinition.iconUrl,
        },
      },
    };
  }

  // If i
  if (dragItemData.location.inContainer) {

  }
}

function createStackMoveItemRequests(item: InventoryItemFragment,
                                      newPosition: number,
                                      state: InventoryBaseState,
                                      props: InventoryBaseProps,
                                    ) {
  if (item.stackHash !== emptyStackHash) {
    const itemId = getItemMapID(item);
    const moveItemRequests: any = [];
    _.values(state.stackGroupIdToItemIDs[itemId]).forEach((id) => {
      const item = _.find(props.inventoryItems, inventoryItem => inventoryItem.id === id);
      moveItemRequests.push(createMoveItemRequestToInventoryPosition(
        item,
        newPosition,
      ));
    });
    return moveItemRequests;
  }
}
