/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import { client, utils } from 'camelot-unchained';
import { inventoryFilterButtons, nullVal, emptyStackHash } from './constants';
import { SlotNumberToItem } from '../components/Inventory/components/InventoryBase';
import { ActiveFilters } from '../components/Inventory/Inventory';
import { InventoryItemFragment } from '../../../gqlInterfaces';

export const prettifyText = (slotName: string) => {
  if (slotName) return slotName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
};

export function calcRowAndSlots(div: HTMLElement, slotDimensions: number, minSlots: number, gutterSize: number = 65) {
  const slotsPerRow = calcSlotsPerRow(div, slotDimensions, gutterSize);
  const slotCountAndRows = calcRows(div, slotDimensions, minSlots, slotsPerRow);
  return {
    slotsPerRow,
    ...slotCountAndRows,
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

export function calcSlotsPerRow(div: HTMLElement, slotDimensions: number, gutterSize: number = 65) {
  return Math.floor(
    (div.getBoundingClientRect().width - gutterSize) /* gutters & scrollbar */
    /
    (slotDimensions + 4), /* slot width / height */
  );
}

export function calcRows(div: HTMLElement, slotDimensions: number, minSlots: number, slotsPerRow: number) {
  const { height } = div.getBoundingClientRect();
  const minRows = Math.ceil(height / (slotDimensions + 4));
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
  return div.getBoundingClientRect();
}

export function createMoveItemRequestToInventoryPosition(item: InventoryItemFragment,
    position: number): any {
  return {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: -1,
    to: {
      entityID: nullVal,
      characterID: client.characterID,
      position,
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
      gearSlotIDs: [],
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };
}

export function isCraftingItem(item: InventoryItemFragment) {
  if (item.staticDefinition) {
    switch (item.staticDefinition.itemType) {
      case 'Substance': return true;
      case 'Alloy': return true;
      default: return false;
    }
  }
}

export function getIcon(item: InventoryItemFragment) {
  if (item.staticDefinition) {
    return item.staticDefinition.iconUrl;
  }
  console.error('You provided an item to getIcon() function that has staticDefinition of null');
  console.log(item);
}

export function isStackedItem(item: InventoryItemFragment) {
  return item.stats.item.unitCount > 1 || item.stackHash !== emptyStackHash;
}

export function itemHasPosition(item: InventoryItemFragment) {
  return getItemInventoryPosition(item) > -1;
}

export function getItemUnitCount(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && item.stats.item.unitCount) {
    return item.stats.item.unitCount;
  }
  return -1;
}

export function getItemMass(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && item.stats.item.totalMass) {
    return Number(item.stats.item.totalMass.toFixed(2));
  }
  return -1;
}

export function getItemQuality(item: InventoryItemFragment) {
  if (item && item.stats && item.stats.item && item.stats.item.quality) {
    return Number((item.stats.item.quality * 100).toFixed(2));
  }
  return -1;
}

export function getItemInventoryPosition(item: InventoryItemFragment) {
  if (item && item.location && item.location.inventory && item.location.inventory) {
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

export function getItemMapID(item: InventoryItemFragment) {
  if (item && item.staticDefinition) {
    if (isCraftingItem(item)) {
      return item.staticDefinition.name + item.staticDefinition.id;
    } else if (isStackedItem(item)) {
      return item.staticDefinition.name + item.staticDefinition.id;
    } else {
      return item.id;
    }
  }
  console.error('You provided an item to getItemMapID() function that has staticDefinition of null');
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
