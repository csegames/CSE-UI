/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Inventory, Item} from 'camelot-unchained';

/**
 * ItemGroup
 */
export class ItemGroup {
  item: Item;
  itemIDs: string[];
  quantity: number;

  constructor(item: Item) {
    this.item = item;
    this.quantity = 0;
    this.itemIDs = [];
    this.addItemID(item.id);
  }

  getFirstItemID(): string {
    return this.itemIDs.length > 0 ? this.itemIDs[0] : null;
  }

  /**
   * Check if the item group contains an item
   * @param  {string} id - the id of item to look for
   * @return {boolean} returns true if the item existing in the item group
   */
  hasItemID(id: string): boolean {
    return this.itemIDs.indexOf(id) > -1;
  }

  /**
   * Adds an item to the item group
   * @param {string} id - the item to add to item group
   */
  addItemID(id: string): void {
    if (this.hasItemID(id) == false) {
      this.itemIDs.push(id);
      this.quantity += 1;
    }
  }

  /**
   * Removes an item from the item group with the given item id
   * @param {string} id - the item id to remove
   */
  removeItemID(id: string): void {
    if (this.hasItemID(id)) {
      const itemIndex: number = this.itemIDs.indexOf(id);
      if (itemIndex > -1) {
        this.itemIDs.splice(itemIndex, 1);
        this.quantity--;
      }
    }
  }

  static areItemsStackable(itemA: Item, itemB: Item): boolean {
    return itemA.name == itemB.name
      && itemA.description == itemB.description
      && itemA.resourceID == itemB.resourceID;
  }

  /**
   * Build an array of item groups from an inventory
   * @param  {Inventory} inventory - the inventory to group items from
   * @return {ItemGroup[]} an array of item groups
   */
  static buildItemGroups(inventory: Inventory): ItemGroup[] {
    const itemGroups: ItemGroup[] = [];

    inventory.items.forEach((item: Item) => {
      let stack: ItemGroup = null;
      itemGroups.forEach((itemGroup: ItemGroup) => {
        if (!itemGroup.hasItemID(item.id) && ItemGroup.areItemsStackable(itemGroup.item, item)) {
          stack = itemGroup;
        }
      });
      if (stack) {
        stack.addItemID(item.id);
      } else {
        itemGroups.push(new ItemGroup(item));
      }
    });

    itemGroups.sort((a: ItemGroup, b: ItemGroup) => {
      // can potentially sort by gearSlot (a.item.gearSlot - b.item.gearSlot)
      return compareString(a.item.name, b.item.name);
    });

    return itemGroups;
  }
}

function compareString(a: string, b: string): number {
  if (a < b) {
    return -1;
  } else if (a == b) {
    return 0;
  } else {
    return 1;
  }
}
