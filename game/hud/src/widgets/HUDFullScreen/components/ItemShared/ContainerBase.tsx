/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { find, findIndex, compact, map, filter, isEqual } from 'lodash';
import { webAPI } from '@csegames/camelot-unchained';

import * as base from './InventoryBase';
import { InventoryItem } from 'gql/interfaces';
import { DrawerComponentProps } from '../Inventory/components/Containers/InventoryDrawer';
import { slotDimensions } from '../Inventory/components/InventorySlot';
import { InventoryDataTransfer, CombineStackPayload } from '../../lib/itemEvents';
import {
  calcRowsForContainer,
  isContainerItem,
  getItemWithNewUnitCount,
  getItemWithNewInventoryPosition,
  createMoveItemRequestToContainerPosition,
  isMovingStack,
} from '../../lib/utils';

declare const toastr: any;

export function getRowsAndSlots(props: DrawerComponentProps) {
  const { drawer, containerID, containerIdToDrawerInfo } = props;
  const container = containerIdToDrawerInfo[containerID[containerID.length - 1]];
  const drawerInfo = container ? container.drawers[drawer.id] : {};
  const drawerItems: InventoryItem.Fragment[] = [];
  Object.keys(drawerInfo).forEach((_key) => {
    drawerItems.push(drawerInfo[_key].item);
  });
  const rowData = calcRowsForContainer(props.bodyWidth, slotDimensions, drawerItems);

  return rowData;
}

export function getContainerPermissions(props: DrawerComponentProps):
  base.ContainerPermissionDef | base.ContainerPermissionDef[] {
  const { containerID, inventoryItems, containerItem } = props;
  const itemPermissions: base.ContainerPermissionDef = {
    userPermission: containerItem.permissibleHolder ?
      containerItem.permissibleHolder.userPermissions : ItemPermissions.All,
    isChild: false,
    isParent: false,
  };

  const containerPermissionsArray: base.ContainerPermissionDef[] = [itemPermissions];
  if (containerID.length > 1) {
    // Get parent container permissions
    const parentContainer = find(inventoryItems, item => item.id === containerID[0]);
    const parentPermissions: base.ContainerPermissionDef = {
      userPermission: parentContainer.permissibleHolder ?
        parentContainer.permissibleHolder.userPermissions : ItemPermissions.All,
      isChild: false,
      isParent: true,
    };
    containerPermissionsArray.push(parentPermissions);
  }

  function getChildContainerPermissions(containerItem: InventoryItem.Fragment) {
    // Find other containers within a container, and look inside them for their permissions
    if (isContainerItem(containerItem)) {
      return;
    }
    containerItem.containerDrawers.forEach((drawer) => {
      drawer.containedItems.forEach((_containedItem) => {
        if (_containedItem.permissibleHolder &&
            _containedItem.permissibleHolder.userPermissions ! & ItemPermissions.Ground) {
          const childPermissions: base.ContainerPermissionDef = {
            userPermission: _containedItem.permissibleHolder ?
              _containedItem.permissibleHolder.userPermissions : ItemPermissions.All,
            isChild: true,
            isParent: false,
          };
          containerPermissionsArray.push(childPermissions);
        }

        // Recursively look for container within containers within containers, etc.
        getChildContainerPermissions(containerItem);
      });
    });
  }

  // Look for containers inside parent container
  getChildContainerPermissions(containerItem);

  return containerPermissionsArray.length > 1 ? containerPermissionsArray : itemPermissions;
}

export function onDropOnZoneClient(props: DrawerComponentProps,
                                    dragItem: InventoryDataTransfer,
                                    dropZone: InventoryDataTransfer,
                                    updatedDragItem?: InventoryDataTransfer) {
  // These will be modified throughout the function
  const containerIdToDrawerInfo = { ...props.containerIdToDrawerInfo };
  const inventoryItems = [...props.inventoryItems];
  const slotNumberToItem = { ...props.slotNumberToItem };

  const dragContainerID = dragItem.containerID && dragItem.containerID[dragItem.containerID.length - 1];
  const dropContainerID = dropZone.containerID && dropZone.containerID[dropZone.containerID.length - 1];

  let newDragItem: InventoryItem.Fragment = getItemWithNewContainerPosition(updatedDragItem ? updatedDragItem.item :
    dragItem.item, dropZone.position);

  let newDropItem: InventoryItem.Fragment = dropZone.item &&
    getItemWithNewContainerPosition(dropZone.item, dragItem.position);

  if (isMovingStack(dragItem)) {
    // Drag item is a partial stack
    newDragItem = getItemWithNewUnitCount(newDragItem, dragItem.unitCount);

    const newCount = dragItem.item.stats.item.unitCount - dragItem.unitCount;
    if (newCount > 0) {
      newDropItem = getItemWithNewUnitCount(dragItem.item, newCount);
    }
  }

  if (newDropItem) {
    if (dragContainerID) {
      // Update drag item container if swapping
      containerIdToDrawerInfo[dragContainerID].drawers[dragItem.drawerID][dragItem.position] = {
        slot: dragItem.position,
        drawerId: dragItem.drawerID,
        containerId: dragContainerID,
        item: newDropItem,
      };
    }
  }

  // Move item to container
  containerIdToDrawerInfo[dropContainerID].drawers[dropZone.drawerID][dropZone.position] = {
    slot: dropZone.position,
    drawerId: dropZone.drawerID,
    containerId: dropContainerID,
    item: newDragItem,
  };

  const indexOfDropZoneContainer = findIndex(inventoryItems, _item => _item.id === props.containerID[0]);
  const newDropContainerDrawers =
    getUpdatedDropContainer(
      dropZone,
      newDragItem,
      newDropItem,
      inventoryItems,
      indexOfDropZoneContainer,
    );

  inventoryItems[indexOfDropZoneContainer] = {
    ...inventoryItems[indexOfDropZoneContainer],
    containerDrawers: newDropContainerDrawers,
  };

  // Drag item was in container
  if (dragContainerID) {
    // Delete drag slot if moving to empty slot
    if (!newDropItem) {
      delete containerIdToDrawerInfo[dragContainerID].drawers[dragItem.drawerID][dragItem.position];
    }

    const indexOfTopDragItemContainer = findIndex(inventoryItems, _item => _item.id === dragItem.containerID[0]);
    const newDragContainerDrawers =
      getUpdatedDragContainer(
        dragItem,
        newDragItem,
        newDropItem,
        dropZone,
        inventoryItems,
        indexOfTopDragItemContainer,
      );

    inventoryItems[indexOfTopDragItemContainer] = {
      ...inventoryItems[indexOfTopDragItemContainer],
      containerDrawers: newDragContainerDrawers as any,
    };

  } else {
    // Drag item is in regular inventory
    const indexOfDragItem = findIndex(inventoryItems, _item => _item.id === dragItem.item.id);
    if (newDropItem) {
      newDropItem = getItemWithNewInventoryPosition(newDropItem, dragItem.item.location.inventory.position);
      slotNumberToItem[dragItem.item.location.inventory.position] = {
        ...slotNumberToItem[dragItem.item.location.inventory.position],
        item: newDropItem,
      };
      inventoryItems[indexOfDragItem] = newDropItem;
    } else {
      if (isMovingStack(dragItem)) {
        // Item is a stack
        const newCount = dragItem.item.stats.item.unitCount - dragItem.unitCount;
        slotNumberToItem[dragItem.item.location.inventory.position] = {
          ...slotNumberToItem[dragItem.item.location.inventory.position],
          item: getItemWithNewUnitCount(dragItem.item, newCount),
        };
        inventoryItems[indexOfDragItem] = getItemWithNewUnitCount(inventoryItems[indexOfDragItem], newCount);
      } else {
        delete slotNumberToItem[dragItem.item.location.inventory.position];
        inventoryItems[indexOfDragItem] = null;
      }
    }
  }
  props.onUpdateState({
    slotNumberToItem,
    inventoryItems: compact(inventoryItems),
    containerIdToDrawerInfo,
  });
}

export async function onDropOnZoneServer(props: DrawerComponentProps,
                                          dragItem: InventoryDataTransfer,
                                          dropZone: InventoryDataTransfer) {
  // Make a move request to api server
  const moveRequests = [createMoveItemRequestToContainerPosition(dragItem, dropZone, dragItem.unitCount)];

  if (dropZone.item) {
    moveRequests.push(createMoveItemRequestToContainerPosition(dropZone, dragItem, dropZone.unitCount));
  }

  const res = await webAPI.ItemAPI.BatchMoveItems(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    moveRequests,
  );
  if (!res.ok) {
    const data = JSON.parse(res.data);
    // If request fails for any reason
    if (data.FieldCodes && data.FieldCodes.length > 0) {
      toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
    } else {
      // This means api server failed move item request but did not have a message about what happened
      toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
    }

    // Restore previous state before client updated, since the move item was a failure on the server.
    props.onUpdateState({
      slotNumberToItem: props.slotNumberToItem,
      inventoryItems: props.inventoryItems,
      containerIdToDrawerInfo: props.containerIdToDrawerInfo,
    });
  } else {
    if (isMovingStack(dragItem)) {
      // We need to update moved stack item id
      const moveItemResult = tryParseJSON<{ FieldCodes: { Result: MoveItemResult }[] }>(res.data, true);
      if (moveItemResult &&
          moveItemResult.FieldCodes &&
          moveItemResult.FieldCodes[0] &&
          moveItemResult.FieldCodes[0].Result) {
        const data: MoveItemResult = moveItemResult.FieldCodes[0].Result;
        const newDragItem = {
          ...dragItem,
          item: {
            ...dragItem.item,
            id: data.MovedItemIDs[0],
          },
        };
        onDropOnZoneClient(props, dragItem, dropZone, newDragItem);
      }
    }
  }
}

function getUpdatedDropContainer(dropZoneData: InventoryDataTransfer,
                                  newDragItem: InventoryItem.Fragment,
                                  newDropItem: InventoryItem.Fragment,
                                  inventoryItems: InventoryItem.Fragment[],
                                  indexOfDropZoneContainer: number) {
  let newDropContainerDrawers;
  if (dropZoneData.containerID.length > 1) {
    // Dropped in a nested container
    newDropContainerDrawers = map(inventoryItems[indexOfDropZoneContainer].containerDrawers, (_drawer) => {
      const dropZoneContainer = find(_drawer.containedItems, _containedItem =>
        _containedItem.id === dropZoneData.containerID[dropZoneData.containerID.length - 1]);
      if (dropZoneContainer) {
        // Look for item in container drawer
        const newDropZoneDrawer = dropZoneContainer.containerDrawers.map((_dropZoneDrawer) => {
          const filteredDrawer = filter(_dropZoneDrawer.containedItems, _containedItem =>
            _containedItem.id !== newDragItem.id && (newDropItem ? _containedItem.id !== newDropItem.id : true));
          return {
            ..._dropZoneDrawer,
            containedItems: compact([
              ...filteredDrawer,
              newDragItem,
              newDropItem,
            ]),
          };
        });

        const newContainedItem = {
          ...dropZoneContainer,
          containerDrawers: newDropZoneDrawer,
        };

        return {
          ..._drawer,
          containedItems: [
            ...filter(_drawer.containedItems, _containedItem => _containedItem.id !== dropZoneContainer.id),
            newContainedItem,
          ],
        };
      }
      return _drawer;
    });

  } else {
    // Dropped in a top level container inside the inventory
    newDropContainerDrawers = map(inventoryItems[indexOfDropZoneContainer].containerDrawers, (_drawer) => {
      // Add item to drop zone drawer
      if (_drawer.id === dropZoneData.drawerID) {
        const filteredDrawer = filter(_drawer.containedItems, _containedItem =>
          _containedItem.id !== newDragItem.id && (newDropItem ? _containedItem.id !== newDropItem.id : true));
        return {
          ..._drawer,
          containedItems: compact([
            ...filteredDrawer,
            newDragItem,
            newDropItem,
          ]),
        };
      }

      return _drawer;
    });
  }

  return newDropContainerDrawers;
}

function getUpdatedDragContainer(dragItemData: InventoryDataTransfer,
                                  newDragItem: InventoryItem.Fragment,
                                  newDropItem: InventoryItem.Fragment,
                                  dropZoneData: InventoryDataTransfer,
                                  inventoryItems: InventoryItem.Fragment[],
                                  indexOfTopDragItemContainer: number) {
  let newDragContainerDrawers;
  const dragContainerID = dragItemData.containerID[dragItemData.containerID.length - 1];
  if (dragItemData.containerID.length > 1) {
    // Drag item came from a NESTED container
    newDragContainerDrawers = map(inventoryItems[indexOfTopDragItemContainer].containerDrawers, (_drawer) => {
      const dragItemContainer = find(_drawer.containedItems, _containedItem => _containedItem.id === dragContainerID);
      if (dragItemContainer) {
        // Look for item in container drawer
        const newDragItemDrawer = dragItemContainer.containerDrawers.map((_dragItemDrawer) => {

          let newContainedItems;
          if (!newDropItem) {
            // drop zone was an EMPTY slot
            if (!isEqual(dragItemData.containerID, dropZoneData.containerID) ||
              dragItemData.drawerID !== dropZoneData.drawerID) {
              // Coming from a different container or drawer
              newContainedItems =
                filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id);
            } else {
              // Moving in same container and drawer
              newContainedItems = [
                ...filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                newDragItem,
              ];
            }
          } else {
            // SWAPPING with item in drop zone
            if (!isEqual(dragItemData.containerID, dropZoneData.containerID) ||
              dragItemData.drawerID !== dropZoneData.drawerID) {
              // Coming from a different container and drawer
              newContainedItems = [
                ...filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                newDropItem,
              ];
            } else {
              // Moving in same container and drawer
              newContainedItems = [
                ...filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id &&
                  _containedItem.id !== newDropItem.id),
                newDragItem,
                newDropItem,
              ];
            }
          }

          return {
            ..._dragItemDrawer,
            containedItems: newContainedItems,
          };
        });

        const newContainedItem = {
          ...dragItemContainer,
          containerDrawers: newDragItemDrawer,
        };
        return {
          ..._drawer,
          containedItems: [
            ...filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemContainer.id),
            newContainedItem,
          ],
        };
      }
      return _drawer;
    });
  } else {
    newDragContainerDrawers = map(inventoryItems[indexOfTopDragItemContainer].containerDrawers, (_drawer) => {
      if (_drawer.id === dragItemData.drawerID) {
        // IF drag item going to a different drawer then just delete drag item from previous drawer
        // ELSE drag item is moved to a position in the same drawer, just update the drag item
        let newDrawer;
        if (!dropZoneData.item) {
          // EMPTY
          if (!isEqual(dragItemData.containerID, dropZoneData.containerID) ||
            dragItemData.drawerID !== dropZoneData.drawerID) {
            // Coming from a different container or drawer
            newDrawer = filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id);
          } else {
            // Moving in same container and drawer
            newDrawer = [
              ...filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
              newDragItem,
            ];
          }
        } else {
          // SWAPPING
          if (!isEqual(dragItemData.containerID, dropZoneData.containerID) ||
            dragItemData.drawerID !== dropZoneData.drawerID) {
            // Coming from a different container or drawer
            newDrawer = [
              ...filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
              newDropItem,
            ];
          } else {
            // Moving in same container and drawer
            newDrawer = [
              ...filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id &&
                _containedItem.id !== dropZoneData.item.id),
              newDragItem,
              newDropItem,
            ];
          }
        }
        return {
          ..._drawer,
          containedItems: newDrawer,
        };
      }

      return _drawer;
    });
  }

  return newDragContainerDrawers;
}

export function onCombineStackClient(props: DrawerComponentProps,
                                      payload: CombineStackPayload,
                                      newCombinedItem?: InventoryDataTransfer) {
  // These will be modified throughout the function
  const { dragItem, dropZone, amount } = payload;
  const containerIdToDrawerInfo = { ...props.containerIdToDrawerInfo };
  const inventoryItems = [...props.inventoryItems];
  const slotNumberToItem = { ...props.slotNumberToItem };

  const dragContainerID = dragItem.containerID && dragItem.containerID[dragItem.containerID.length - 1];
  const dropContainerID = dropZone.containerID && dropZone.containerID[dropZone.containerID.length - 1];

  const newCount = dropZone.item.stats.item.unitCount + amount;
  const newDropItem: InventoryItem.Fragment =
    getItemWithNewUnitCount(newCombinedItem ? newCombinedItem.item : dropZone.item, newCount);

  if (dragContainerID && (!dragItem.unitCount || amount === dragItem.item.stats.item.unitCount)) {
    // Delete drag position
    delete containerIdToDrawerInfo[dragContainerID].drawers[dragItem.drawerID][dragItem.position];
  } else if (dragContainerID && amount < dragItem.item.stats.item.unitCount) {
    // Update old stack unit count
    containerIdToDrawerInfo[dragContainerID].drawers[dragItem.drawerID][dragItem.position] = {
      ...containerIdToDrawerInfo[dragContainerID].drawers[dropZone.drawerID][dropZone.position],
      item: getItemWithNewUnitCount(dragItem.item, dragItem.item.stats.item.unitCount - amount),
    };
  }

  // Move item to container
  containerIdToDrawerInfo[dropContainerID].drawers[dropZone.drawerID][dropZone.position] = {
    slot: dropZone.position,
    drawerId: dropZone.drawerID,
    containerId: dropContainerID,
    item: newDropItem,
  };

  const indexOfDropZoneContainer = findIndex(inventoryItems, _item => _item.id === props.containerID[0]);
  const newDropContainerDrawers =
    getUpdatedDropContainer(
      dropZone,
      dragItem.item,
      newDropItem,
      inventoryItems,
      indexOfDropZoneContainer,
    );

  inventoryItems[indexOfDropZoneContainer] = {
    ...inventoryItems[indexOfDropZoneContainer],
    containerDrawers: newDropContainerDrawers,
  };

  // Drag item was in container
  if (dragContainerID) {
    // Delete drag slot if moving to empty slot
    if (!newDropItem) {
      delete containerIdToDrawerInfo[dragContainerID].drawers[dragItem.drawerID][dragItem.position];
    }

    const indexOfTopDragItemContainer = findIndex(inventoryItems, _item => _item.id === dragItem.containerID[0]);
    const newDragContainerDrawers =
      getUpdatedDragContainer(
        dragItem,
        dragItem.item,
        newDropItem,
        dropZone,
        inventoryItems,
        indexOfTopDragItemContainer,
      );

    inventoryItems[indexOfTopDragItemContainer] = {
      ...inventoryItems[indexOfTopDragItemContainer],
      containerDrawers: newDragContainerDrawers as any,
    };

  } else {
    // Drag item is in regular inventory
    const indexOfDragItem = findIndex(inventoryItems, _item => _item.id === dragItem.item.id);
    if (newDropItem) {
      const newDragCount = dragItem.item.stats.item.unitCount - amount;
      if (newDragCount > 0) {
        const newDragItem = getItemWithNewUnitCount(dragItem.item, newDragCount);
        slotNumberToItem[dragItem.item.location.inventory.position] = {
          ...slotNumberToItem[dragItem.item.location.inventory.position],
          item: newDragItem,
        };
        inventoryItems[indexOfDragItem] = newDragItem;
      } else {
        delete slotNumberToItem[dragItem.item.location.inventory.position];
        inventoryItems[indexOfDragItem] = null;
      }
    } else {
      if (isMovingStack(dragItem)) {
        // Item is a stack
        const newCount = dragItem.item.stats.item.unitCount - dragItem.unitCount;
        slotNumberToItem[dragItem.item.location.inventory.position] = {
          ...slotNumberToItem[dragItem.item.location.inventory.position],
          item: getItemWithNewUnitCount(dragItem.item, newCount),
        };
        inventoryItems[indexOfDragItem] = getItemWithNewUnitCount(inventoryItems[indexOfDragItem], newCount);
      } else {
        delete slotNumberToItem[dragItem.item.location.inventory.position];
        inventoryItems[indexOfDragItem] = null;
      }
    }
  }
  props.onUpdateState({
    slotNumberToItem,
    inventoryItems: compact(inventoryItems),
    containerIdToDrawerInfo,
  });
}

export async function onCombineStackServer(props: DrawerComponentProps, payload: CombineStackPayload) {
  // Make a move request to api server
  const { dragItem, dropZone, amount } = payload;
  const moveRequests = [createMoveItemRequestToContainerPosition(dragItem, dropZone, amount)];

  const res = await webAPI.ItemAPI.BatchMoveItems(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    moveRequests,
  );
  if (!res.ok) {
    const data = JSON.parse(res.data);
    // If request fails for any reason
    if (data.FieldCodes && data.FieldCodes.length > 0) {
      toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
    } else {
      // This means api server failed move item request but did not have a message about what happened
      toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
    }

    // Restore previous state before client updated, since the move item was a failure on the server.
    props.onUpdateState({
      slotNumberToItem: props.slotNumberToItem,
      inventoryItems: props.inventoryItems,
      containerIdToDrawerInfo: props.containerIdToDrawerInfo,
    });
  } else {
    // We need to update moved stack item id
    const moveItemResult = tryParseJSON<{ FieldCodes: { Result: MoveItemResult }[] }>(res.data, true);
    if (moveItemResult &&
        moveItemResult.FieldCodes &&
        moveItemResult.FieldCodes[0] &&
        moveItemResult.FieldCodes[0].Result) {
      const data: MoveItemResult = moveItemResult.FieldCodes[0].Result;
      const newCombinedItem = {
        ...dropZone,
        item: {
          ...dropZone.item,
          id: data.MovedItemIDs[0],
        },
      };
      onCombineStackClient(props, payload, newCombinedItem);
    }
  }
}

function getItemWithNewContainerPosition(item: InventoryItem.Fragment, newPosition: number): InventoryItem.Fragment {
  return {
    ...item,
    location: {
      inContainer: {
        position: newPosition,
      },
      inventory: null,
      equipped: null,
      inVox: null,
    },
  };
}
