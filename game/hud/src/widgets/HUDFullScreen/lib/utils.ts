/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import {
  Faction as GraphQLFaction,
  Gender as GraphQLGender,
  Race as GraphQLRace,
  Archetype as GraphQLArchetype,
} from '@csegames/camelot-unchained/lib/graphql/schema';
import {
  utils,
  TabItem,
} from '@csegames/camelot-unchained';

import { colors, nullVal, emptyStackHash, inventoryFilterButtonInfo } from './constants';
import { DrawerCurrentStats } from '../components/Inventory/components/Containers/Drawer';
import { SlotNumberToItem, ContainerPermissionDef } from '../components/ItemShared/InventoryBase';
import { InventoryDataTransfer, EquippedItemDataTransfer, DataTransferLocation } from './itemEvents';
import { ActiveFilters } from '../components/Inventory';
import { SlotType, ArmorType, InventoryFilterButton } from '../lib/itemInterfaces';
import {
  InventoryItem,
  ContainerDrawers,
  GearSlotDefRef,
  EquippedItem,
  ContainerDefStat_Single,
  SecureTradeState,
} from 'gql/interfaces';

declare const toastr: any;

export interface BodyDimensions {
  width: number;
  height: number;
}

export const prettifyText = (slotName: string, shortenedWords?: {[word: string]: string}) => {
  if (slotName) {
    if (shortenedWords) {
      let _slotName = slotName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
      Object.keys(shortenedWords).forEach((word) => {
        _slotName = _slotName.replace(word, shortenedWords[word]);
      });
      return _slotName;
    } else {
      return slotName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
    }
  }
};

export function calcRowsForContainer(width: number,
                                      slotDimensions: number,
                                      containerSlots: InventoryItem.Fragment[],
                                      gutterSize: number = 65) {
  const lastItem = _.sortBy(containerSlots, a => a.location.inContainer.position)[containerSlots.length - 1];
  const lastItemSlotPos = lastItem ? lastItem.location.inContainer.position : 0;
  const slotsPerRow = calcSlotsPerRow(width, slotDimensions, gutterSize);
  const rowCount = lastItemSlotPos + 1 > slotsPerRow ? Math.ceil((lastItemSlotPos + 1) / slotsPerRow) : 1;
  const slotCount = Math.max(slotsPerRow, lastItemSlotPos + 1);

  return {
    rowCount,
    slotCount,
    slotsPerRow,
  };
}

export function calcRowAndSlots(bodyDimensions: BodyDimensions,
                                slotDimensions: number,
                                minSlots: number,
                                gutterSize: number = 65) {
  const slotsPerRow = calcSlotsPerRow(bodyDimensions.width, slotDimensions, gutterSize);
  const slotCountAndRows = calcRows(bodyDimensions.height, slotDimensions, minSlots, slotsPerRow);
  return {
    slotsPerRow,
    ...slotCountAndRows,
  };
}

export function calcTradingSlots(bodyDimensions: BodyDimensions, slotDimensions: number, gutterSize: number = 65) {
  const rows = Math.floor(bodyDimensions.height / slotDimensions);
  const slotsPerWrappedRow = calcSlotsPerRow(bodyDimensions.width, slotDimensions, 0);
  const slotsPerRow = slotsPerWrappedRow * rows;
  return {
    slotsPerRow,
  };
}

export function searchIncludesSection(searchValue: string, sectionTitle: string) {
  if (sectionTitle) {
    if (searchValue !== '') {
      return _.includes(sectionTitle.toLowerCase().replace(/\s/g, ''), searchValue.toLowerCase().replace(/\s/g, '')) ||
      _.includes(searchValue.toLowerCase().replace(/\s/g, ''), sectionTitle.toLowerCase().replace(/\s/g, ''));
    } return true;
  }
  return false;
}

export function calcSlotsPerRow(bodyWidth: number, slotDimensions: number, gutterSize: number = 65) {
  return Math.floor(
    (bodyWidth - gutterSize) /* gutters & scrollbar */
    /
    (slotDimensions + 4), /* slot width / height */
  );
}

export function calcRows(bodyHeight: number,
                          slotDimensions: number,
                          minSlots: number,
                          slotsPerRow: number) {
  const minRows = Math.ceil(bodyHeight / (slotDimensions + 4));
  // how many slots do we need to fit in rows
  const slotsToFit = Math.max(minSlots, minRows * slotsPerRow);
  // how many slots there are actually with full rows.
  // (will fill a row to fit or add an extra row)
  const slotCount = (slotsPerRow - (slotsToFit % slotsPerRow)) + slotsToFit;
  const rowCount = slotCount / slotsPerRow;
  return {
    slotCount,
    rowCount,
  };
}

export function getDimensionsOfElement(div: HTMLElement) {
  if (div) {
    return div.getBoundingClientRect();
  }
}

export function createMoveItemRequestToWorldPosition(item: InventoryItem.Fragment,
    worldPosition: Vec3F,
    rotation: Euler3f): any {
  return {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      worldPosition,
      rotation,
      location: 'Ground',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [],
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function createMoveItemRequestToInventoryPosition(item: InventoryItem.Fragment,
                                                          position: number,
                                                          amount?: number): any {
  return {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: amount || -1,
    to: {
      position,
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function createMoveItemRequestToContainerPosition(oldPosition: InventoryDataTransfer,
                                                          newPosition: InventoryDataTransfer,
                                                          unitCount?: number): any {
  const oldItem = oldPosition.item;
  const newPosContainerID = newPosition.containerID ?
    newPosition.containerID[newPosition.containerID.length - 1] : newPosition.containerID;
  const oldPosContainerID = oldPosition.containerID ?
    oldPosition.containerID[oldPosition.containerID.length - 1] : oldPosition.containerID;

  return {
    moveItemID: oldItem.id,
    stackHash: oldItem.stackHash,
    unitCount: unitCount || -1,
    to: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: newPosition.position,
      containerID: newPosContainerID,
      drawerID: newPosition.drawerID,
      gearSlotIDs: [],
      location: newPosition.containerID ? 'Container' : 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: oldItem.location.inContainer ? oldItem.location.inContainer.position : oldItem.location.inventory.position,
      containerID: oldPosContainerID,
      drawerID: oldPosition.drawerID,
      gearSlotIDs: [],
      location: oldPosition.containerID ? 'Container' : 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function getInventoryDataTransfer(payload: {
  item: InventoryItem.Fragment,
  position: number,
  location: DataTransferLocation,
  containerID?: string[],
  drawerID?: string;
  gearSlots?: GearSlotDefRef.Fragment[],
  slotType?: SlotType;
  fullStack?: boolean;
  unitCount?: number;
}): InventoryDataTransfer {
  if (!payload) {
    return null;
  }

  // A drag object will only have gearSlots attribute if it is currently equipped
  const { slotType, item, containerID, drawerID, gearSlots, position, location, fullStack, unitCount } = payload;
  return {
    containerID,
    drawerID,
    gearSlots,
    item,
    position,
    location,
    slotType,
    fullStack,
    unitCount,
  };
}

export function getEquippedDataTransfer(payload: {
  item: InventoryItem.Fragment,
  position: number,
  location: DataTransferLocation,
  gearSlots: GearSlotDefRef.Fragment[],
  containerID?: string[],
  drawerID?: string,
  slotType?: SlotType,
  fullStack?: boolean;
}): EquippedItemDataTransfer {
  if (!payload) {
    return null;
  }

  // A drag object will only have gearSlots attribute if it is currently equipped
  const { containerID, item, drawerID, gearSlots, position, location, slotType, fullStack } = payload;
  return {
    slotType,
    containerID,
    drawerID,
    gearSlots,
    item,
    position,
    location,
    fullStack,
  };
}

export function isCraftingItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    switch (item.staticDefinition.itemType) {
      case 'Substance': return true;
      case 'Alloy': return true;
      default: return false;
    }
  }

  console.error('You provided an item to isCraftingItem() function that has staticDefinion of null');
  console.log(item);
  return false;
}

export function isAlloyItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    if (item.staticDefinition.itemType === 'Alloy') {
      return true;
    } else {
      return false;
    }
  }

  console.error('You provided a bad item to isAlloyItem() function');
  console.log(item);
  return false;
}

export function isSubstanceItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    if (item.staticDefinition.itemType === 'Substance') {
      return true;
    } else {
      return false;
    }
  }

  console.error('You provided a bad item to isSubstanceItem() function');
  console.log(item);
  return false;
}

export function isWeaponItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    const { itemType } = item.staticDefinition;
    if (itemType === 'Weapon' || itemType === 'Ammo') {
      return true;
    } else {
      return false;
    }
  }

  console.error('You provided a bad item to isWeaponItem() function');
  console.log(item);
  return false;
}

export function isArmorItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    if (item.staticDefinition.itemType === 'Armor') {
      return true;
    } else {
      return false;
    }
  }

  console.error('You provided a bad item to isArmorItem() function');
  console.log(item);
  return false;
}

export function isBuildingBlockItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    if (item.staticDefinition.itemType === 'Block') {
      return true;
    } else {
      return false;
    }
  }

  console.error('You provided a bad item to isBuildingBlockItem() function');
  console.log(item);
  return false;
}

export function isStackedItem(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition) {
    return item.staticDefinition.isStackableItem;
  }

  console.log('You provided an item to isStackedItem() function that has stats of null');
  console.log(item);
  return false;
}

export function isContainerItem(item: InventoryItem.Fragment) {
  if (!item || !item.containerDrawers) {
    return false;
  }
  return _.isArray(item.containerDrawers);
}

export function isVoxItem(item: InventoryItem.Fragment) {
  if (!item) {
    return false;
  }
  return item.staticDefinition.isVox;
}

export function getIcon(item: InventoryItem.Fragment) {
  if (item.staticDefinition) {
    return item.staticDefinition.iconUrl;
  }
  console.error('You provided an item to getIcon() function that has staticDefinition of null');
  console.log(item);
}

export function itemHasInventoryPosition(item: InventoryItem.Fragment) {
  return getItemInventoryPosition(item) > -1;
}

export function itemHasContainerPosition(item: InventoryItem.Fragment) {
  return getItemContainerPosition(item) > - 1;
}

export function getItemUnitCount(item: InventoryItem.Fragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.unitCount === 'number') {
    return item.stats.item.unitCount;
  }
  return -1;
}

export function getItemMass(item: InventoryItem.Fragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.totalMass === 'number') {
    return item.stats.item.totalMass;
  }
  return -1;
}

export function getItemQuality(item: InventoryItem.Fragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.quality === 'number') {
    return Number((item.stats.item.quality * 100));
  }
  return -1;
}

export function getItemLocation(item: InventoryItem.Fragment): DataTransferLocation {
  if (item && item.location) {
    if (item.location.equipped) {
      return 'equipped';
    } else if (item.location.inventory) {
      return 'inventory';
    } else if (item.location.inContainer) {
      return 'inContainer';
    } else {
      return 'none';
    }
  }

  return 'none';
}

export function getItemInventoryPosition(item: InventoryItem.Fragment) {
  if (item && item.location && item.location.inventory) {
    return item.location.inventory.position;
  } else {
    return -1;
  }
}

export function getItemContainerPosition(item: InventoryItem.Fragment) {
  if (item && item.location && item.location.inContainer) {
    return item.location.inContainer.position;
  } else {
    return -1;
  }
}

export function getItemDefinitionId(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition && item.staticDefinition.id) {
    return item.staticDefinition.id;
  }
  console.error('You provided an item to getItemDefinitionId() function that has staticDefinition of null');
  console.log(item);
}

export function getItemDefinitionName(item: InventoryItem.Fragment) {
  if (item && item.staticDefinition && item.staticDefinition.name) {
    return item.staticDefinition.name;
  }
  console.error('You provided an item to getItemDefinitionName() function that has staticDefinition of null');
  console.log(item);
}

export function generateStackGroupID(stackHash: string, stackGroupCounter: number) {
  return `${stackHash}:${stackGroupCounter++}`;
}

export function getItemInstanceID(item: InventoryItem.Fragment) {
  return item.id;
}

export function getItemMapID(item: InventoryItem.Fragment,
                              args?: {
                                wantPos?: number,
                                noPos?: boolean,
                                location?: DataTransferLocation,
                              }) {
  const wantPos = args && args.wantPos;
  const noPos = args && args.noPos;
  const location = args && args.location;
  if (item && item.staticDefinition) {
    const pos = itemHasInventoryPosition(item) ? getItemInventoryPosition(item) :
                itemHasContainerPosition(item) ? getItemContainerPosition(item) : -1;
    const itemLocation = location || getItemLocation(item);
    if (isCraftingItem(item)) {
      return `${item.staticDefinition.name + item.staticDefinition.id}${itemLocation}${typeof wantPos === 'number' ?
        wantPos : pos !== -1 && !noPos ? pos : ''}`;
    } else if (isStackedItem(item)) {
      if (item.stackHash !== emptyStackHash) {
        return `${item.stackHash}${itemLocation}${pos !== -1 && !noPos ? pos : ''}`;
      } else {
        return `${item.staticDefinition.name + item.staticDefinition.id}${itemLocation}${typeof wantPos === 'number' ?
          wantPos : pos !== -1 && !noPos ? pos : ''}`;
      }
    } else {
      return item.id;
    }
  }
  console.error('You provided an item to getItemMapID() function that has staticDefinition of null');
}

export function getContainerID(item: InventoryItem.Fragment) {
  if (_.isArray(item.containerDrawers)) {
    // Is an actual container
    return item.id;
  } else {
    console.error(`${item.id} requested a containerID with getContainerID and is not a container!`);
  }
}

export function hasTradePermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Trade;
}

export function hasTrashPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Trash;
}

export function hasCraftWithVoxPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.CraftWithVox;
}

export function hasControlPermissions(item: InventoryItem.Fragment) {
  // Can jump on and fire seige engines
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Control;
}

export function hasAddContentPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.AddContents;
}

export function hasRemoveContentPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.RemoveContents;
}

export function hasViewContentPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.ViewContents;
}

export function hasModifyDisplayPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.ModifyDisplay;
}

export function hasGroundPermissions(item: InventoryItem.Fragment) {
  // Can be placed on ground ex) Deployed, Drop
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Ground;
}

export function hasInventoryPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Inventory;
}

export function hasEquipmentPermissions(item: InventoryItem.Fragment) {
  const itemMeetsRequirements = !item.equiprequirement || (item.equiprequirement &&
    (item.equiprequirement.status === 'RequirementMet' || item.equiprequirement.status === 'NoRequirement'));
  if ((!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) && itemMeetsRequirements) {
    return ItemPermissions.All;
  }

  return itemMeetsRequirements && ((item && !item.permissibleHolder) ||
      (item && item.permissibleHolder && item.permissibleHolder.userPermissions & ItemPermissions.Equipment));
}

export function hasContainerPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Container;
}

export function hasVoxPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Vox;
}

export function hasAllPermissions(item: InventoryItem.Fragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.All;
}

export function hasDurabilityStats(item: InventoryItem.Fragment) {
  let hasStats = false;
  if (item && item.stats && item.stats.durability) {
    Object.keys(item.stats.durability).forEach((statName) => {
      if (item.stats.durability[statName] > 0) {
        hasStats = true;
        return;
      }
    });
  }

  return hasStats;
}

export function hasItemRequirements(item: InventoryItem.Fragment) {
  let hasReqs = false;
  if (item && item.stats && item.stats.item) {
    Object.keys(item.stats.item).forEach((itemStatName) => {
      if (_.includes(itemStatName.toLowerCase(), 'requirement') && item.stats.item[itemStatName] !== 0) {
        hasReqs = true;
        return;
      }
    });
  }

  return hasReqs;
}

export function firstAvailableSlot(startWith: number, slotNumberToItem: SlotNumberToItem) {
  let slotNumber = startWith;
  while (true) {
    if (!slotNumberToItem[slotNumber]) return slotNumber;
    slotNumber++;
  }
}

export function hasActiveFilterButtons(activeFilters: ActiveFilters) {
  return activeFilters && Object.keys(activeFilters).length > 0;
}

export function hasFilterText(searchValue: string) {
  return searchValue && searchValue.trim() !== '';
}

export function shouldShowItem(item: InventoryItem.Fragment, activeFilters: ActiveFilters) {
  const hasFilter = hasActiveFilterButtons(activeFilters);

    // Active filters compared to item gearSlots
  const doActiveFiltersIncludeItem = _.findIndex(_.values(activeFilters), (filter) => {
    return inventoryFilterButtons[filter.name].filter(item);
  }) > -1;

  if (hasFilter) {
    // Do active filters and search include item?
    return doActiveFiltersIncludeItem;

  } else if (hasFilter) {
    // Do active filters include item?
    return doActiveFiltersIncludeItem;

  } else {
    // If there are no filters or searchValue, every item should be shown.
    return true;
  }
}

export function getContainerInfo(items: InventoryItem.Fragment[]) {
  // This gives you information about the containers current unit count, average quality, and weight.
  // This is used for crafting containers and regular containers.
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

export function getContainerColor(item: InventoryItem.Fragment, alpha?: number) {
  if (item && item.containerColor) {
    const { containerColor } = item;
    if (containerColor) {
      return `rgba(${containerColor.r}, ${containerColor.g}, ${containerColor.b}, ${alpha || 1})`;
    } else {
      return utils.lightenColor(colors.filterBackgroundColor, 5);
    }
  }

  if (!item) {
    console.error('You provided an undefined item to getContainerColor() function');
  }
}

export function getTooltipColor(faction: Faction) {
  switch (faction) {
    case Faction.Arthurian: {
      return colors.tooltipArt;
    }
    case Faction.Viking: {
      return colors.tooltipViking;
    }
    case Faction.TDD: {
      return colors.tooltipTDD;
    }
    default: {
      return colors.tooltipViking;
    }
  }
}

export function isContainerSlotVerified(dragDataTransfer: InventoryDataTransfer,
                                        dropDataTransfer: InventoryDataTransfer,
                                        dropContainerID: string[],
                                        containerPermissions: ContainerPermissionDef | ContainerPermissionDef[],
                                        drawerMaxStats: ContainerDefStat_Single,
                                        drawerCurrentStats: DrawerCurrentStats,
                                        showToasts: boolean) {
  // Dropping inside a container
  const dragContainerDrawers: ContainerDrawers.Fragment[] = dragDataTransfer.item.containerDrawers;

  // Go through container drawers to see if double nesting a container
  const doubleNestingContainer = dragContainerDrawers && dropContainerID.length > 1;

  const puttingInSelf = dragDataTransfer.item.id === dropContainerID[dropContainerID.length - 1];

  // Go through drawers to see if the drag container already contains containers in it
  const hasContainersAlready = _.find(dragContainerDrawers, drawer =>
    _.findIndex(drawer.containedItems, _item =>
      _item.containerDrawers && _item.containerDrawers.length > 0) !== -1);

  // TODO: allow equipped items to be moved into a container, for now dont. I'll make it a task -AJ
  const isAnEquippedItem = dragDataTransfer.gearSlots;

  // Does user have Container Permissions (Add, Remove, See)
  const userMeetsPermissions = !containerPermissions || (!_.isArray(containerPermissions) ?
    containerPermissions.userPermission & ItemPermissions.AddContents :

      _.findIndex(containerPermissions, permission =>
        permission.isParent && permission.userPermission & ItemPermissions.AddContents) !== -1 &&
        _.findIndex(containerPermissions, permission =>
          !permission.isParent && !permission.isChild && permission.userPermission & ItemPermissions.AddContents) !== -1);

  // Check if drop item would exceed max Drawer Stats (maxItemCount, maxMass)
  const dragUnitCount = dragDataTransfer.unitCount || dragDataTransfer.item.stats.item.unitCount;
  const meetsUnitCountStat = !drawerMaxStats || drawerMaxStats.maxItemCount === -1 ||
    (!_.isEqual(dragDataTransfer.containerID, dropContainerID) ?
    (dropDataTransfer.item ? (drawerCurrentStats.totalUnitCount - dropDataTransfer.item.stats.item.unitCount +
      dragUnitCount) <= drawerMaxStats.maxItemCount :
      drawerCurrentStats.totalUnitCount + dragUnitCount <= drawerMaxStats.maxItemCount) : true);

  const meetsMassStat = !drawerMaxStats || drawerMaxStats.maxItemMass === -1 ||
    (!_.isEqual(dragDataTransfer.containerID, dropContainerID) ?
    (dropDataTransfer.item ? (drawerCurrentStats.weight - dropDataTransfer.item.stats.item.totalMass +
      dragDataTransfer.item.stats.item.totalMass) <= drawerMaxStats.maxItemMass :
      drawerCurrentStats.weight + dragDataTransfer.item.stats.item.totalMass <= drawerMaxStats.maxItemMass) : true);

  // Check if the user is trying to swap an item with a partial stack which can't be done
  // because the other part of the stack is in the original position still.
  const swappingPartialStack = isSwappingPartialStack(dragDataTransfer, dropDataTransfer);

  const canPutInContainer = !doubleNestingContainer && !puttingInSelf && !hasContainersAlready &&
    !isAnEquippedItem && userMeetsPermissions && meetsUnitCountStat && meetsMassStat && !swappingPartialStack;

  if (!canPutInContainer) {
    // Can NOT put in container
    if (showToasts) {
      if (swappingPartialStack) {
        toastr.error('You can\'t swap a partial stack with another item', 'Darn!', { timeout: 3000 });
      }

      if (isAnEquippedItem) {
        toastr.error('Try moving the equipped item to the inventory first', 'Try this', { timeout: 3000 });
      }

      if (!userMeetsPermissions) {
        toastr.error('You do not have permissions to add items to this container', 'Oh No!', { timeout: 3000 });
      }

      if (doubleNestingContainer) {
        toastr.error('A container can only be nested one level', 'Darn!', { timeout: 3000 });
      }

      if (puttingInSelf) {
        toastr.error('You can\'t put a container inside of itself', 'Silly!', { timeout: 3000 });
      }

      if (!puttingInSelf && hasContainersAlready) {
        toastr.error(`${dragDataTransfer.item.givenName ||
          dragDataTransfer.item.staticDefinition.name} already contains a container inside.`, 'Darn!', { timeout: 3000 });
      }

      if (!meetsUnitCountStat) {
        toastr.error('You have reached the max amount of items in this drawer', 'You can\'t do that', { timeout: 3000 });
      }

      if (!meetsMassStat) {
        toastr.error('You have reached the max amount of mass in this drawer', 'You can\'t do that', { timeout: 3000 });
      }
    }

    return false;
  } else {
    return true;
  }
}

export function isCraftingSlotVerified(dragDataTransfer: InventoryDataTransfer,
                                        dropDataTransfer: InventoryDataTransfer,
                                        showToasts: boolean) {
  // Putting an item inside of it's container
  const puttingInsideSelf = dragDataTransfer.slotType === SlotType.CraftingContainer &&
    (dragDataTransfer.item.id === dropDataTransfer.item.id);

  // Trying to move inside same crafting container
  const puttingInSameContainer = dragDataTransfer.slotType === SlotType.CraftingItem &&
    (getItemMapID(dragDataTransfer.item) === getItemMapID(dropDataTransfer.item));

  // Checks if you are dropping in a crafting item of the same type
  const isSameCraftingMaterial = dragDataTransfer.item.staticDefinition.name + dragDataTransfer.item.staticDefinition.id ===
    dropDataTransfer.item.staticDefinition.name + dropDataTransfer.item.staticDefinition.id;

  // Check to see if trying to put on top of a crafting container.
  const tryingToSwapWithContainer = dropDataTransfer.slotType === SlotType.CraftingContainer;

  if (puttingInsideSelf || puttingInSameContainer || !isSameCraftingMaterial || tryingToSwapWithContainer) {
    if (showToasts) {
      if (puttingInsideSelf) {
        toastr.error('You can\'t put an item inside of itself', 'Silly!', { timeout: 3000 });
      }

      if (puttingInSameContainer) {
        toastr.error(
          'You can\'t move an item to a different spot in a crafting container',
          'You can\'t do that',
          { timeout: 3000 },
        );
      }

      if (tryingToSwapWithContainer) {
        toastr.error('Open the crafting container and then put the item inside.', 'Try this', { timeout: 3000 });
      }

      if (!isSameCraftingMaterial) {
        toastr.error('Item\'s must be of the same crafting material', 'You can\'t do that', { timeout: 3000 });
      }
    }
    return false;
  }
  return true;
}

export interface FullScreenNavState {
  initial: boolean;
  visibleComponentLeft: string;
  visibleComponentRight: string;
  equippedItems: EquippedItem.Fragment[];
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  tabsLeft: TabItem<{ title: string }>[];
  tabsRight: TabItem<{ title: string }>[];
  invBodyDimensions: {
    width: number;
    height: number;
  };
}

export interface HUDFullScreenTabData {
  title: string;

  // A temporary tab means that it can be closed (e.g. Trade Window)
  icon?: string;
  temporary?: boolean;
  onTemporaryTabClose?: () => void;
}

export const defaultTabsLeft: TabItem<HUDFullScreenTabData>[] = [
  { name: 'equippedgear-left', tab: { title: 'Equipped' }, rendersContent: 'Equipped Gear' },
  { name: 'inventory-left', tab: { title: 'Inventory' }, rendersContent: 'Inventory' },
  { name: 'character-stats-left', tab: { title: 'Stats' }, rendersContent: 'CharacterStats' },
  { name: 'map-left', tab: { title: 'Map' }, rendersContent: 'Map' },
];

export const defaultTabsRight: TabItem<HUDFullScreenTabData>[] = [
  { name: 'equippedgear-right', tab: { title: 'Equipped' }, rendersContent: 'Equipped Gear' },
  { name: 'inventory-right', tab: { title: 'Inventory' }, rendersContent: 'Inventory' },
  { name: 'character-stats-right', tab: { title: 'Stats' }, rendersContent: 'CharacterStats' },
  { name: 'map-right', tab: { title: 'Map' }, rendersContent: 'Map' },
];

export const defaultFullScreenState: FullScreenNavState = {
  initial: true,
  visibleComponentLeft: '',
  visibleComponentRight: '',
  equippedItems: null,
  myTradeItems: null,
  myTradeState: SecureTradeState.None,
  tabsLeft: defaultTabsLeft,
  tabsRight: defaultTabsRight,
  invBodyDimensions: { width: 0, height: 0 },
};

export const FullScreenContext = React.createContext(defaultFullScreenState);

export function isRightOrLeftItem(gearSlots: GearSlotDefRef.Fragment[]) {
  if (gearSlots.length === 1) {
    const firstGearSlotId = gearSlots[0].id;
    return _.includes(firstGearSlotId.toLowerCase(), 'right') ||
    _.includes(firstGearSlotId.toLowerCase(), 'left') ||
    _.includes(firstGearSlotId.toLowerCase(), 'primary') ||
    _.includes(firstGearSlotId.toLowerCase(), 'secondary');
  }
  return false;
}

export function getPaperDollBG(faction: Faction) {
  let paperdollBG = '';
  switch (faction) {
    default:
    case Faction.Arthurian: {
      paperdollBG = 'bg-art';
      break;
    }
    case Faction.TDD: {
      paperdollBG = 'bg-tdd';
      break;
    }
    case Faction.Viking: {
      paperdollBG = 'bg-vik';
      break;
    }
  }

  return `images/paperdoll/bg/${paperdollBG}.png`;
}

export function getPaperDollIcon(gender: GraphQLGender, race: GraphQLRace, playerClass: GraphQLArchetype) {
  const formatGender = gender === 'Male' ? 'm' : 'f';
  let formatRace = race ? race.toLowerCase() : '';

  if (_.includes(formatRace, 'human')) {
    formatRace = 'human';
  }
  const formatPlayerClass = playerClass ? playerClass.toLowerCase() : '';
  return `images/paperdoll/standing/${formatRace}-${formatGender}-${formatPlayerClass}.png`;
}

export function getPaperDollBaseIcon(faction: GraphQLFaction) {
  let formatFaction = '';
  switch (faction) {
    case 'Arthurian': {
      formatFaction = 'art';
      break;
    }
    case 'TDD': {
      formatFaction = 'tdd';
      break;
    }
    case 'Viking': {
      formatFaction = 'vik';
      break;
    }
    default: {
      formatFaction = 'art';
      break;
    }
  }
  return `images/paperdoll/base/${formatFaction}-base.png`;
}

export function getMyPaperDollIcon() {
  return getPaperDollIcon(
    Gender[game.selfPlayerState.gender] as GraphQLGender,
    Race[game.selfPlayerState.race] as GraphQLRace,
    Archetype[game.selfPlayerState.classID] as GraphQLArchetype,
  );
}

export function getMyPaperDollBG() {
  return getPaperDollBG(game.selfPlayerState.faction);
}

export function getMyPaperDollBaseIcon() {
  return getPaperDollBaseIcon(Faction[game.selfPlayerState.faction] as GraphQLFaction);
}

export function isSwappingPartialStack(dragDataTransfer: InventoryDataTransfer, dropDataTransfer: InventoryDataTransfer) {
  return dragDataTransfer.unitCount && dropDataTransfer.item && !isCombiningStack(dragDataTransfer, dropDataTransfer);
}

export function isMovingStack(itemDataTransfer: InventoryDataTransfer) {
  return typeof itemDataTransfer.unitCount === 'number';
}

export function isCombiningStack(itemDataTransfer: InventoryDataTransfer, stack: InventoryDataTransfer) {
  if (itemDataTransfer.location !== stack.location) {
    const itemStackId = getItemMapID(itemDataTransfer.item, { location: stack.location, noPos: true });
    const stackItemStackId = getItemMapID(stack.item, { noPos: true });
    return itemStackId === stackItemStackId;
  }
  return getItemMapID(itemDataTransfer.item, { wantPos: stack.position }) === getItemMapID(stack.item);
}

export function getItemWithNewInventoryPosition(item: InventoryItem.Fragment, newPosition: number): InventoryItem.Fragment {
  return {
    ...item,
    location: {
      ...item.location,
      inContainer: null,
      equipped: null,
      inventory: {
        ...item.location.inventory,
        position: newPosition,
      },
    },
  };
}

export function getItemWithNewUnitCount(item: InventoryItem.Fragment, newUnitCount: number): InventoryItem.Fragment {
  return {
    ...item,
    stats: {
      ...item.stats,
      item: {
        ...item.stats.item,
        unitCount: newUnitCount,
      },
    },
  };
}

export function filterForGearSlot(item: InventoryItem.Fragment,
  filter: { icon: string, name: string, armorType?: ArmorType }) {
return item &&
_.findIndex(item.staticDefinition.gearSlotSets, set =>
_.find(set.gearSlots, slot => _.includes(filter.name.toLowerCase(), slot.id.toLowerCase()))) > -1 &&
(filter.armorType ?
_.includes(item.staticDefinition.description.toLowerCase(), filter.armorType.toString().toLowerCase()) : true);
}

export function filterForDescription(item: InventoryItem.Fragment, filter: { icon: string, name: string }) {
return item &&
_.includes(item.staticDefinition.description.toLowerCase(), filter.name.toLowerCase());
}

export function filterForItemType(item: InventoryItem.Fragment, filter: { icon: string, name: string }) {
return item &&
_.includes(item.staticDefinition.itemType.toLowerCase(), filter.name.toLowerCase());
}

export function filterForLayer(item: InventoryItem.Fragment, layer: 'outer' | 'under') {
return item &&
_.findIndex(item.staticDefinition.gearSlotSets, set =>
_.find(set.gearSlots, slot => _.includes(slot.id.toLowerCase(), layer))) > -1;
}

export const inventoryFilterButtons: {
[key: string]: InventoryFilterButton,
} = {
// Armor
Armor: {
...inventoryFilterButtonInfo.Armor,
filter: (item: InventoryItem.Fragment) => filterForItemType(item, inventoryFilterButtonInfo.Armor),
},
UnderLayer: {
...inventoryFilterButtonInfo.UnderLayer,
filter: (item: InventoryItem.Fragment) => filterForLayer(item, 'under'),
},
OuterLayer: {
...inventoryFilterButtonInfo.OuterLayer,
filter: (item: InventoryItem.Fragment) => filterForLayer(item, 'outer'),
},
// Light armor
SkullLight: {
...inventoryFilterButtonInfo.SkullLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullLight),
},
FaceLight: {
...inventoryFilterButtonInfo.FaceLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceLight),
},
NeckLight: {
...inventoryFilterButtonInfo.NeckLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckLight),
},
ChestLight: {
...inventoryFilterButtonInfo.ChestLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestLight),
},
CloakLight: {
...inventoryFilterButtonInfo.CloakLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakLight),
},
BackLight: {
...inventoryFilterButtonInfo.BackLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackLight),
},
WaistLight: {
...inventoryFilterButtonInfo.WaistLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistLight),
},
ForearmLeftLight: {
...inventoryFilterButtonInfo.ForearmLeftLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftLight),
},
ForearmRightLight: {
...inventoryFilterButtonInfo.ForearmRightLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightLight),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShoulderLeftLight: {
...inventoryFilterButtonInfo.ShoulderLeftLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftLight),
},
ShoulderRightLight: {
...inventoryFilterButtonInfo.ShoulderRightLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightLight),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
HandLeftLight: {
...inventoryFilterButtonInfo.HandLeftLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftLight),
},
HandRightLight: {
...inventoryFilterButtonInfo.HandRightLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightLight),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShinsLight: {
...inventoryFilterButtonInfo.ShinsLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsLight),
},
ThighsLight: {
...inventoryFilterButtonInfo.ThighsLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsLight),
},
FeetLight: {
...inventoryFilterButtonInfo.FeetLight,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetLight),
},
// Medium armor
SkullMedium: {
...inventoryFilterButtonInfo.SkullMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullMedium),
},
FaceMedium: {
...inventoryFilterButtonInfo.FaceMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceMedium),
},
NeckMedium: {
...inventoryFilterButtonInfo.NeckMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckMedium),
},
ChestMedium: {
...inventoryFilterButtonInfo.ChestMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestMedium),
},
CloakMedium: {
...inventoryFilterButtonInfo.CloakMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakMedium),
},
BackMedium: {
...inventoryFilterButtonInfo.BackMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackMedium),
},
WaistMedium: {
...inventoryFilterButtonInfo.WaistMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistMedium),
},
ForearmLeftMedium: {
...inventoryFilterButtonInfo.ForearmLeftMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftMedium),
},
ForearmRightMedium: {
...inventoryFilterButtonInfo.ForearmRightMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightMedium),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShoulderLeftMedium: {
...inventoryFilterButtonInfo.ShoulderLeftMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftMedium),
},
ShoulderRightMedium: {
...inventoryFilterButtonInfo.ShoulderRightMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightMedium),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
HandLeftMedium: {
...inventoryFilterButtonInfo.HandLeftMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftMedium),
},
HandRightMedium: {
...inventoryFilterButtonInfo.HandRightMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightMedium),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShinsMedium: {
...inventoryFilterButtonInfo.ShinsMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsMedium),
},
ThighsMedium: {
...inventoryFilterButtonInfo.ThighsMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsMedium),
},
FeetMedium: {
...inventoryFilterButtonInfo.FeetMedium,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetMedium),
},
// Heavy armor
SkullHeavy: {
...inventoryFilterButtonInfo.SkullHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullHeavy),
},
FaceHeavy: {
...inventoryFilterButtonInfo.FaceHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceHeavy),
},
NeckHeavy: {
...inventoryFilterButtonInfo.NeckHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckHeavy),
},
ChestHeavy: {
...inventoryFilterButtonInfo.ChestHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestHeavy),
},
CloakHeavy: {
...inventoryFilterButtonInfo.CloakHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakHeavy),
},
BackHeavy: {
...inventoryFilterButtonInfo.BackHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackHeavy),
},
WaistHeavy: {
...inventoryFilterButtonInfo.WaistHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistHeavy),
},
ForearmLeftHeavy: {
...inventoryFilterButtonInfo.ForearmLeftHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftHeavy),
},
ForearmRightHeavy: {
...inventoryFilterButtonInfo.ForearmRightHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightHeavy),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShoulderLeftHeavy: {
...inventoryFilterButtonInfo.ShoulderLeftHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftHeavy),
},
ShoulderRightHeavy: {
...inventoryFilterButtonInfo.ShoulderRightHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightHeavy),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
HandLeftHeavy: {
...inventoryFilterButtonInfo.HandLeftHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftHeavy),
},
HandRightHeavy: {
...inventoryFilterButtonInfo.HandRightHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightHeavy),
style: {
transform: 'scaleX(-1)',
WebkitTransform: 'scaleX(-1)',
},
},
ShinsHeavy: {
...inventoryFilterButtonInfo.ShinsHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsHeavy),
},
ThighsHeavy: {
...inventoryFilterButtonInfo.ThighsHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsHeavy),
},
FeetHeavy: {
...inventoryFilterButtonInfo.FeetHeavy,
filter: (item: InventoryItem.Fragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetHeavy),
},
Weapon: {
...inventoryFilterButtonInfo.Weapon,
filter: (item: InventoryItem.Fragment) => filterForItemType(item, inventoryFilterButtonInfo.Weapon),
},
Axe: {
...inventoryFilterButtonInfo.Axe,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Axe),
},
Bow: {
...inventoryFilterButtonInfo.Bow,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Bow),
},
Dagger: {
...inventoryFilterButtonInfo.Dagger,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Dagger),
},
GreatAxe: {
...inventoryFilterButtonInfo.GreatAxe,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatAxe),
},
GreatHammer: {
...inventoryFilterButtonInfo.GreatHammer,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatHammer),
},
GreatMace: {
...inventoryFilterButtonInfo.GreatMace,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatMace),
},
GreatSword: {
...inventoryFilterButtonInfo.GreatSword,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatSword),
},
Hammer: {
...inventoryFilterButtonInfo.Hammer,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Hammer),
},
LongSword: {
...inventoryFilterButtonInfo.LongSword,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.LongSword),
},
Mace: {
...inventoryFilterButtonInfo.Mace,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Mace),
},
Polearm: {
...inventoryFilterButtonInfo.Polearm,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Polearm),
},
Shield: {
...inventoryFilterButtonInfo.Shield,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Shield),
},
Spear: {
...inventoryFilterButtonInfo.Spear,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Spear),
},
Staff: {
...inventoryFilterButtonInfo.Staff,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Staff),
},
Sword: {
...inventoryFilterButtonInfo.Sword,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Sword),
},
Torch: {
...inventoryFilterButtonInfo.Torch,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Torch),
},
Alloys: {
...inventoryFilterButtonInfo.Alloys,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Alloys),
},
Substances: {
...inventoryFilterButtonInfo.Substances,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Substances),
},
BlackLog: {
...inventoryFilterButtonInfo.BlackLog,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.BlackLog),
},
CherryBoard: {
...inventoryFilterButtonInfo.CherryBoard,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.CherryBoard),
},
CherryLog: {
...inventoryFilterButtonInfo.CherryLog,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.CherryLog),
},
Cloths: {
...inventoryFilterButtonInfo.Cloths,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Cloths),
},
RawCloths: {
...inventoryFilterButtonInfo.RawCloths,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.RawCloths),
},
DarkLog: {
...inventoryFilterButtonInfo.DarkLog,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.DarkLog),
},
IgneousOre: {
...inventoryFilterButtonInfo.IgneousOre,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.IgneousOre),
},
Leathers: {
...inventoryFilterButtonInfo.Leathers,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Leathers),
},
RawLeathers: {
...inventoryFilterButtonInfo.RawLeathers,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.RawLeathers),
},
LightLog: {
...inventoryFilterButtonInfo.LightLog,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.LightLog),
},
MetalBar: {
...inventoryFilterButtonInfo.MetalBar,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.MetalBar),
},
Metals: {
...inventoryFilterButtonInfo.Metals,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Metals),
},
RawMetals: {
...inventoryFilterButtonInfo.RawMetals,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.RawMetals),
},
MetamorphicOre: {
...inventoryFilterButtonInfo.MetamorphicOre,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.MetamorphicOre),
},
SedimentaryOre: {
...inventoryFilterButtonInfo.SedimentaryOre,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.SedimentaryOre),
},
SoftMetalBar: {
...inventoryFilterButtonInfo.SoftMetalBar,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.SoftMetalBar),
},
Stones: {
...inventoryFilterButtonInfo.Stones,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Stones),
},
RawStones: {
...inventoryFilterButtonInfo.RawStones,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.RawStones),
},
Woods: {
...inventoryFilterButtonInfo.Woods,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Woods),
},
RawWoods: {
...inventoryFilterButtonInfo.RawWoods,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.RawWoods),
},
Ammo: {
...inventoryFilterButtonInfo.Ammo,
filter: (item: InventoryItem.Fragment) => filterForItemType(item, inventoryFilterButtonInfo.Ammo),
},
Bandages: {
...inventoryFilterButtonInfo.Bandages,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Bandages),
},
Arrow: {
...inventoryFilterButtonInfo.Arrow,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Arrow),
},
BasaltSlab: {
...inventoryFilterButtonInfo.BasaltSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.BasaltSlab),
},
BlackBoard: {
...inventoryFilterButtonInfo.BlackBoard,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.BlackBoard),
},
Blocks: {
...inventoryFilterButtonInfo.Blocks,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Blocks),
},
Bolt: {
...inventoryFilterButtonInfo.Bolt,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Bolt),
},
Building: {
...inventoryFilterButtonInfo.Building,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Building),
},
Consumables: {
...inventoryFilterButtonInfo.Consumables,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Consumables),
},
DarkBoard: {
...inventoryFilterButtonInfo.DarkBoard,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.DarkBoard),
},
Decor: {
...inventoryFilterButtonInfo.Decor,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Decor),
},
Deployables: {
...inventoryFilterButtonInfo.Deployables,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Deployables),
},
Focus: {
...inventoryFilterButtonInfo.Focus,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Focus),
},
GneissSlab: {
...inventoryFilterButtonInfo.GneissSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GneissSlab),
},
GraniteSlab: {
...inventoryFilterButtonInfo.GraniteSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.GraniteSlab),
},
HardMetalBar: {
...inventoryFilterButtonInfo.HardMetalBar,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.HardMetalBar),
},
Interactive: {
...inventoryFilterButtonInfo.Interactive,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Interactive),
},
LightBoard: {
...inventoryFilterButtonInfo.LightBoard,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.LightBoard),
},
MarbleSlab: {
...inventoryFilterButtonInfo.MarbleSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.MarbleSlab),
},
Potion: {
...inventoryFilterButtonInfo.Potion,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Potion),
},
QuartziteSlab: {
...inventoryFilterButtonInfo.QuartziteSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.QuartziteSlab),
},
Reagents: {
...inventoryFilterButtonInfo.Reagents,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Reagents),
},
SandstoneSlab: {
...inventoryFilterButtonInfo.SandstoneSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.SandstoneSlab),
},
Siege: {
...inventoryFilterButtonInfo.Siege,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Siege),
},
SlateSlab: {
...inventoryFilterButtonInfo.SlateSlab,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.SlateSlab),
},
Thrown: {
...inventoryFilterButtonInfo.Thrown,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Thrown),
},
Trap: {
...inventoryFilterButtonInfo.Trap,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Trap),
},
Vial: {
...inventoryFilterButtonInfo.Vial,
filter: (item: InventoryItem.Fragment) => filterForDescription(item, inventoryFilterButtonInfo.Vial),
},
};


export const defaultFilterButtonIcons = [
inventoryFilterButtons.Armor,
inventoryFilterButtons.OuterLayer,
inventoryFilterButtons.UnderLayer,
inventoryFilterButtons.Weapon,
inventoryFilterButtons.Cloths,
inventoryFilterButtons.Woods,
inventoryFilterButtons.Metals,
inventoryFilterButtons.Ammo,
];

export const inventoryEditFilterButtons: InventoryFilterButton[] = [
// Light armor
inventoryFilterButtons.SkullLight,
inventoryFilterButtons.FaceLight,
inventoryFilterButtons.NeckLight,
inventoryFilterButtons.ChestLight,
inventoryFilterButtons.CloakLight,
inventoryFilterButtons.BackLight,
inventoryFilterButtons.WaistLight,
inventoryFilterButtons.ForearmLeftLight,
inventoryFilterButtons.ForearmRightLight,
inventoryFilterButtons.ShoulderLeftLight,
inventoryFilterButtons.ShoulderRightLight,
inventoryFilterButtons.HandLeftLight,
inventoryFilterButtons.HandRightLight,
inventoryFilterButtons.ShinsLight,
inventoryFilterButtons.ThighsLight,
inventoryFilterButtons.FeetLight,

// Medium armor
inventoryFilterButtons.SkullMedium,
inventoryFilterButtons.FaceMedium,
inventoryFilterButtons.NeckMedium,
inventoryFilterButtons.ChestMedium,
inventoryFilterButtons.CloakMedium,
inventoryFilterButtons.BackMedium,
inventoryFilterButtons.WaistMedium,
inventoryFilterButtons.ForearmLeftMedium,
inventoryFilterButtons.ForearmRightMedium,
inventoryFilterButtons.ShoulderLeftMedium,
inventoryFilterButtons.ShoulderRightMedium,
inventoryFilterButtons.HandLeftMedium,
inventoryFilterButtons.HandRightMedium,
inventoryFilterButtons.ShinsMedium,
inventoryFilterButtons.ThighsMedium,
inventoryFilterButtons.FeetMedium,

// Heavy armor
inventoryFilterButtons.SkullHeavy,
inventoryFilterButtons.FaceHeavy,
inventoryFilterButtons.NeckHeavy,
inventoryFilterButtons.ChestHeavy,
inventoryFilterButtons.CloakHeavy,
inventoryFilterButtons.BackHeavy,
inventoryFilterButtons.WaistHeavy,
inventoryFilterButtons.ForearmLeftHeavy,
inventoryFilterButtons.ForearmRightHeavy,
inventoryFilterButtons.ShoulderLeftHeavy,
inventoryFilterButtons.ShoulderRightHeavy,
inventoryFilterButtons.HandLeftHeavy,
inventoryFilterButtons.HandRightHeavy,
inventoryFilterButtons.ShinsHeavy,
inventoryFilterButtons.ThighsHeavy,
inventoryFilterButtons.FeetHeavy,

// Weapon
inventoryFilterButtons.Axe,
inventoryFilterButtons.Bow,
inventoryFilterButtons.Dagger,
inventoryFilterButtons.GreatAxe,
inventoryFilterButtons.GreatHammer,
inventoryFilterButtons.GreatMace,
inventoryFilterButtons.GreatSword,
inventoryFilterButtons.Hammer,
inventoryFilterButtons.LongSword,
inventoryFilterButtons.Mace,
inventoryFilterButtons.Polearm,
inventoryFilterButtons.Shield,
inventoryFilterButtons.Spear,
inventoryFilterButtons.Staff,
inventoryFilterButtons.Sword,
inventoryFilterButtons.Torch,

// Crafting
inventoryFilterButtons.Alloys,
inventoryFilterButtons.Substances,
inventoryFilterButtons.BlackLog,
inventoryFilterButtons.CherryBoard,
inventoryFilterButtons.CherryLog,
inventoryFilterButtons.Cloths,
inventoryFilterButtons.RawCloths,
inventoryFilterButtons.DarkLog,
inventoryFilterButtons.IgneousOre,
inventoryFilterButtons.Leathers,
inventoryFilterButtons.RawLeathers,
inventoryFilterButtons.LightLog,
inventoryFilterButtons.MetalBar,
inventoryFilterButtons.Metals,
inventoryFilterButtons.RawMetals,
inventoryFilterButtons.MetamorphicOre,
inventoryFilterButtons.SedimentaryOre,
inventoryFilterButtons.SoftMetalBar,
inventoryFilterButtons.Stones,
inventoryFilterButtons.RawStones,
inventoryFilterButtons.Woods,
inventoryFilterButtons.RawWoods,

// Misc
inventoryFilterButtons.Ammo,
inventoryFilterButtons.Bandages,
inventoryFilterButtons.Arrow,
inventoryFilterButtons.BasaltSlab,
inventoryFilterButtons.BlackBoard,
inventoryFilterButtons.Blocks,
inventoryFilterButtons.Bolt,
inventoryFilterButtons.Building,
inventoryFilterButtons.Consumables,
inventoryFilterButtons.DarkBoard,
inventoryFilterButtons.Decor,
inventoryFilterButtons.Deployables,
inventoryFilterButtons.Focus,
inventoryFilterButtons.GneissSlab,
inventoryFilterButtons.GraniteSlab,
inventoryFilterButtons.HardMetalBar,
inventoryFilterButtons.Interactive,
inventoryFilterButtons.LightBoard,
inventoryFilterButtons.MarbleSlab,
inventoryFilterButtons.Potion,
inventoryFilterButtons.QuartziteSlab,
inventoryFilterButtons.Reagents,
inventoryFilterButtons.SandstoneSlab,
inventoryFilterButtons.Siege,
inventoryFilterButtons.SlateSlab,
inventoryFilterButtons.Thrown,
inventoryFilterButtons.Trap,
inventoryFilterButtons.Vial,
];
