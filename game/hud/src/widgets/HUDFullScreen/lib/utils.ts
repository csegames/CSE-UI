/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import { ql, client, utils, Faction, Vec3F, Euler3f, ItemPermissions } from '@csegames/camelot-unchained';

import { inventoryFilterButtons, colors, nullVal, emptyStackHash } from './constants';
import { DrawerCurrentStats } from '../components/Inventory/components/Containers/Drawer';
import { SlotNumberToItem, ContainerPermissionDef } from '../components/ItemShared/InventoryBase';
import { InventoryDataTransfer, EquippedItemDataTransfer } from './eventNames';
import { ActiveFilters } from '../components/Inventory';
import { InventoryItemFragment, ContainerDrawersFragment, GearSlotDefRefFragment } from '../../../gqlInterfaces';
import { SlotType } from '../lib/itemInterfaces';

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
                                      containerSlots: InventoryItemFragment[],
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

export function createMoveItemRequestToWorldPosition(item: InventoryItemFragment,
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
      characterID: client.characterID,
      position: getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [],
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function createMoveItemRequestToInventoryPosition(item: InventoryItemFragment,
                                                          position: number,
                                                          amount?: number): any {
  return {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: amount || -1,
    to: {
      position,
      entityID: nullVal,
      characterID: client.characterID,
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: client.characterID,
      position: getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function createMoveItemRequestToContainerPosition(oldPosition: InventoryDataTransfer,
                                                          newPosition: InventoryDataTransfer): any {
  const oldItem = oldPosition.item;
  const newPosContainerID = newPosition.containerID ?
    newPosition.containerID[newPosition.containerID.length - 1] : newPosition.containerID;
  const oldPosContainerID = oldPosition.containerID ?
    oldPosition.containerID[oldPosition.containerID.length - 1] : oldPosition.containerID;

  return {
    moveItemID: oldItem.id,
    stackHash: oldItem.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      characterID: client.characterID,
      position: newPosition.position,
      containerID: newPosContainerID,
      drawerID: newPosition.drawerID,
      gearSlotIDs: [],
      location: newPosition.containerID ? 'Container' : 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      entityID: nullVal,
      characterID: client.characterID,
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
  item: InventoryItemFragment,
  position: number,
  location: string,
  containerID?: string[],
  drawerID?: string;
  gearSlots?: GearSlotDefRefFragment[],
  slotType?: SlotType;
  fullStack?: boolean;
}): InventoryDataTransfer {
  if (!payload) {
    return null;
  }

  // A drag object will only have gearSlots attribute if it is currently equipped
  const { slotType, item, containerID, drawerID, gearSlots, position, location, fullStack } = payload;
  return {
    containerID,
    drawerID,
    gearSlots,
    item,
    position,
    location,
    slotType,
    fullStack,
  };
}

export function getEquippedDataTransfer(payload: {
  item: InventoryItemFragment,
  position: number,
  location: string,
  gearSlots: GearSlotDefRefFragment[],
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

export function isCraftingItem(item: InventoryItemFragment) {
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

export function isAlloyItem(item: InventoryItemFragment) {
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

export function isSubstanceItem(item: InventoryItemFragment) {
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

export function isWeaponItem(item: InventoryItemFragment) {
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

export function isArmorItem(item: InventoryItemFragment) {
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

export function isBuildingBlockItem(item: InventoryItemFragment) {
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

export function isStackedItem(item: InventoryItemFragment) {
  if (item && item.stats) {
    return item.stats.item.unitCount > 1 || item.stackHash !== emptyStackHash;
  }

  console.log('You provided an item to isStackedItem() function that has stats of null');
  console.log(item);
  return false;
}

export function isContainerItem(item: InventoryItemFragment) {
  if (!item || !item.containerDrawers) {
    return false;
  }
  return _.isArray(item.containerDrawers);
}

export function isVoxItem(item: InventoryItemFragment) {
  if (!item) {
    return false;
  }
  return item.staticDefinition.isVox;
}

export function getIcon(item: InventoryItemFragment) {
  if (item.staticDefinition) {
    return item.staticDefinition.iconUrl;
  }
  console.error('You provided an item to getIcon() function that has staticDefinition of null');
  console.log(item);
}

export function itemHasPosition(item: InventoryItemFragment) {
  return getItemInventoryPosition(item) > -1;
}

export function getItemUnitCount(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.unitCount === 'number') {
    return item.stats.item.unitCount;
  }
  return -1;
}

export function getItemMass(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.totalMass === 'number') {
    return item.stats.item.totalMass;
  }
  return -1;
}

export function getItemQuality(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && typeof item.stats.item.quality === 'number') {
    return Number((item.stats.item.quality * 100));
  }
  return -1;
}

export function getItemInventoryPosition(item: InventoryItemFragment) {
  if (item && item.location && item.location.inventory) {
    return item.location.inventory.position;
  } else {
    return -1;
  }
}

export function getItemDefinitionId(item: InventoryItemFragment) {
  if (item && item.staticDefinition && item.staticDefinition.id) {
    return item.staticDefinition.id;
  }
  console.error('You provided an item to getItemDefinitionId() function that has staticDefinition of null');
  console.log(item);
}

export function getItemDefinitionName(item: InventoryItemFragment) {
  if (item && item.staticDefinition && item.staticDefinition.name) {
    return item.staticDefinition.name;
  }
  console.error('You provided an item to getItemDefinitionName() function that has staticDefinition of null');
  console.log(item);
}

export function generateStackGroupID(stackHash: string, stackGroupCounter: number) {
  return `${stackHash}:${stackGroupCounter++}`;
}

export function getItemInstanceID(item: InventoryItemFragment) {
  return item.id;
}

export function getItemMapID(item: InventoryItemFragment, wantPos?: number, noPos?: boolean) {
  if (item && item.staticDefinition) {
    const pos = getItemInventoryPosition(item);
    if (isCraftingItem(item)) {
      return `${item.staticDefinition.name + item.staticDefinition.id}${typeof wantPos === 'number' ?
        wantPos : pos !== -1 && !noPos ? pos : ''}`;
    } else if (isStackedItem(item)) {
      if (item.stackHash !== emptyStackHash) {
        return `${item.stackHash}${pos !== -1 && !noPos ? pos : ''}`;
      } else {
        return `${item.staticDefinition.name + item.staticDefinition.id}${typeof wantPos === 'number' ?
          wantPos : pos !== -1 && !noPos ? pos : ''}`;
      }
    } else {
      return item.id;
    }
  }
  console.error('You provided an item to getItemMapID() function that has staticDefinition of null');
}

export function getContainerID(item: InventoryItemFragment) {
  if (_.isArray(item.containerDrawers)) {
    // Is an actual container
    return item.id;
  } else {
    console.error(`${item.id} requested a containerID with getContainerID and is not a container!`);
  }
}

export function hasTradePermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Trade;
}

export function hasTrashPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Trash;
}

export function hasCraftWithVoxPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.CraftWithVox;
}

export function hasControlPermissions(item: InventoryItemFragment) {
  // Can jump on and fire seige engines
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Control;
}

export function hasAddContentPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.AddContents;
}

export function hasRemoveContentPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.RemoveContents;
}

export function hasViewContentPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.ViewContents;
}

export function hasModifyDisplayPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.ModifyDisplay;
}

export function hasGroundPermissions(item: InventoryItemFragment) {
  // Can be placed on ground ex) Deployed, Drop
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Ground;
}

export function hasInventoryPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Inventory;
}

export function hasEquipmentPermissions(item: InventoryItemFragment) {
  const itemMeetsRequirements = !item.equiprequirement || (item.equiprequirement &&
    (item.equiprequirement.status === 'RequirementMet' || item.equiprequirement.status === 'NoRequirement'));
  if ((!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) && itemMeetsRequirements) {
    return ItemPermissions.All;
  }

  return itemMeetsRequirements && ((item && !item.permissibleHolder) ||
      (item && item.permissibleHolder && item.permissibleHolder.userPermissions & ItemPermissions.Equipment));
}

export function hasContainerPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Container;
}

export function hasVoxPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.Vox;
}

export function hasAllPermissions(item: InventoryItemFragment) {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }

  return item.permissibleHolder.userPermissions & ItemPermissions.All;
}

export function hasDurabilityStats(item: InventoryItemFragment) {
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

export function hasItemRequirements(item: InventoryItemFragment) {
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

export function shouldShowItem(item: InventoryItemFragment, activeFilters: ActiveFilters, searchValue: string) {
  const hasFilter = hasActiveFilterButtons(activeFilters);
  const hasSearch = hasFilterText(searchValue);
  const itemName = getItemDefinitionName(item);

    // Active filters compared to item gearSlots
  const doActiveFiltersIncludeItem = _.findIndex(_.values(activeFilters), (filter) => {
    return inventoryFilterButtons[filter.name].filter(item);
  }) > -1;

    // Search text compared to itemName
  const doesSearchValueIncludeItem = utils.doesSearchInclude(searchValue, itemName);

    // Do active filters and search include item?
  if (hasFilter && hasSearch) {
    return doActiveFiltersIncludeItem && doesSearchValueIncludeItem;

      // Do active filters include item?
  } else if (hasFilter && !hasSearch) {
    return doActiveFiltersIncludeItem;

    // Does search value include item?
  } else if (!hasFilter && hasSearch) {
    return doesSearchValueIncludeItem;

    // If there are no filters or searchValue, every item should be shown.
  } else {
    return true;
  }
}

export function getContainerInfo(items: InventoryItemFragment[]) {
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

export function getContainerColor(item: InventoryItemFragment, alpha?: number) {
  if (item && item.containerColor) {
    const { containerColor } = item;
    if (containerColor) {
      return `rgba(${containerColor.r}, ${containerColor.g}, ${containerColor.b}, ${alpha || 1})`;
    } else {
      return utils.lightenColor(colors.filterBackgroundColor, 5);
    }
  }

  console.error('You provided an undefined item to getContainerColor() function');
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
                                        drawerMaxStats: ql.schema.ContainerDefStat_Single,
                                        drawerCurrentStats: DrawerCurrentStats,
                                        showToasts: boolean) {
  // Dropping inside a container
  const dragContainerDrawers: ContainerDrawersFragment[] = dragDataTransfer.item.containerDrawers;

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
  const meetsUnitCountStat = !drawerMaxStats || drawerMaxStats.maxItemCount === -1 ||
    (!_.isEqual(dragDataTransfer.containerID, dropContainerID) ?
    (dropDataTransfer.item ? (drawerCurrentStats.totalUnitCount - dropDataTransfer.item.stats.item.unitCount +
      dragDataTransfer.item.stats.item.unitCount) <= drawerMaxStats.maxItemCount :
      drawerCurrentStats.totalUnitCount + dragDataTransfer.item.stats.item.unitCount <= drawerMaxStats.maxItemCount) : true);

  const meetsMassStat = !drawerMaxStats || drawerMaxStats.maxItemMass === -1 ||
    (!_.isEqual(dragDataTransfer.containerID, dropContainerID) ?
    (dropDataTransfer.item ? (drawerCurrentStats.weight - dropDataTransfer.item.stats.item.totalMass +
      dragDataTransfer.item.stats.item.totalMass) <= drawerMaxStats.maxItemMass :
      drawerCurrentStats.weight + dragDataTransfer.item.stats.item.totalMass <= drawerMaxStats.maxItemMass) : true);

  const canPutInContainer = !doubleNestingContainer && !puttingInSelf && !hasContainersAlready &&
    !isAnEquippedItem && userMeetsPermissions && meetsUnitCountStat && meetsMassStat;

  if (!canPutInContainer) {
    // Can NOT put in container
    if (showToasts) {
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
