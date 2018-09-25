/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Item from './Item';

/**
 * Inventory
 */
class Inventory {

  /**
   * The items currently in the inventory
   * @type {Item[]}
   */
  public items: Item[];

  /**
   * Inventory Constructor
   * @param  {Inventory = <Inventory>{}} inventory - provide an existing inventory to copy all items into new inventory
   */
  constructor(inventory: Inventory = <Inventory> {}) {
    this.items = inventory.items || <Item[]> [];
  }

  /**
   * Check if the inventory contains an item
   * @param  {string} id - the id of item to look for
   * @return {boolean} returns true if the item existing in the inventory
   */
  public hasItem(id: string): boolean {
    return this.items.filter((item: Item) => {
      return item.id === id;
    }).length > 0;
  }

  /**
   * Adds an item to the inventory
   * @param {Item} item - the item to add to inventory
   */
  public addItem(item: Item): void {
    if (this.hasItem(item.id) === false) {
      this.items.push(item);
    }
  }

  /**
   * Removes an item from the inventory with the given item id
   * @param {string} id - the item id to remove
   */
  public removeItem(id: string): void {
    if (this.hasItem(id)) {
      let itemIndex: number = null;
      this.items.forEach((item: Item, index: number) => {
        if (item.id === id) {
          itemIndex = index;
        }
      });
      if (itemIndex != null) {
        this.items.splice(itemIndex, 1);
      }
    }
  }

  /**
   * Get a list of all item ID's currently in the inventory
   * @return {string[]} an array of item ID's
   */
  public getItemIDs(): string[] {
    const itemIDs: string[] = [];
    this.items.forEach((item: Item) => {
      itemIDs.push(item.id);
    });
    return itemIDs;
  }

  public static create() {
    const a = new Inventory();
    return a;
  }

}

export default Inventory;
