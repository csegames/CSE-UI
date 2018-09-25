/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Item from './Item';

/**
 * EquippedGear
 */
class EquippedGear {

  /**
   * The items currently in the equippedgear
   * @type {Item[]}
   */
  public items: Item[];

  constructor(equippedgear: EquippedGear = <EquippedGear> {}) {
    this.items = equippedgear.items || <Item[]> [];
  }

  /**
   * Get the item in specific gear slot
   * @param  {gearSlot} slot - the gear slot to get item for
   * @return {Item} the item in gear slot, or null if there is no item equipped
   */
  public getItemInGearSlot(slot: string): Item {
    const gearSlotItems = this.items.filter((item: Item) => {
      return item.gearSlot === slot;
    });
    if (gearSlotItems.length > 0) {
      return gearSlotItems[0];
    }
    return null;
  }

  /**
   * Check if the equippedgear contains an item
   * @param  {string} id - the id of item to look for
   * @return {boolean} returns true if the item existing in the equippedgear
   */
  public hasItem(id: string): boolean {
    return this.items.filter((item: Item) => {
      return item.id === id;
    }).length > 0;
  }

  /**
   * Removes an item from given gear slot
   * @param {gearSlot} slot the gear slot to remove item from
   */
  public removeItemInGearSlot(slot: string): void {
    const ids: string[] = [];
    this.items.forEach((item: Item) => {
      if (item.gearSlot === slot) {
        ids.push(item.id);
      }
    });
    ids.forEach((id: string) => {
      this.removeItem(id);
    });
  }

  /**
   * Adds an item to the equippedgear
   * @param {Item} item - the item to add to equippedgear
   */
  public addItem(item: Item): void {
    this.removeItemInGearSlot(item.gearSlot);
    this.items.push(item);
  }

  /**
   * Removes an item from the equippedgear with the given item id
   * @param {string} id - the item id to remove
   */
  public removeItem(id: string): void {
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

  /**
   * Get a list of all item ID's currently in the equippedgear
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
    const a = new EquippedGear();
    return a;
  }

}

export default EquippedGear;
