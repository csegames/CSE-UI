/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-05 15:23:37
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-05 16:19:55
 */

import { ql } from 'camelot-unchained';
import { InventoryItemFragment } from '../../../gqlInterfaces';

/*
  These are the events used throughout the Character widget. We use these to have a more responsive UI because
  there is a lot of data that goes into items which slows down certain actions. These events can get confusing
  but it was necessary to make the widget feel reactive.

  onEquipItem: Called when user equips item. This then fires off resetInventoryItems.
    fire: ContextMenuContent, ItemsMenuSlot
    listeners: EquippedItemSlot, ItemsMenu

  onUnequipItem: Called when user unequips item. This then fires off resetInventoryItems.
    fire: EquippedItemSlot
    listeners: EquippedItemSlot, ItemsMenu

  onDropItem: Called when user drops item.
    fire: ContextMenuContent
    listeners: InventoryItemSlot, ItemsMenu

  onHighlightSlots: Called to add highlights on equipment slots.
    fire: ContextMenuContent, ItemsMenuSlot
    listeners: EquippedItemSlot

  onDehighlightSlots: Called to get rid of highlight on equipment slots.
    fire: ContextMenuContent, ItemsMenuSlot
    listeners: EquippedItemSlot

  resetInventorySlots: Called when inventory data is refetched from graphql.
    fire: Inventory
    listeners: InventoryItemSlot

  updateInventoryItems: Update ItemSlots state in InventoryBodyComponent.
    fire: EquippedItemSlot
    listeners: InventoryBody

  updateInventoryItemSlot: Update InventoryItemSlot savedItemSlot state.
    fire: InventoryBody
    listeners: InventoryItemSlot
*/

const eventPrefix = 'charactersheet__';
const eventNames = {
  onEquipItem: `${eventPrefix}onEquipItem`,
  onUnequipItem: `${eventPrefix}onUnequipItem`,
  onDropItem: `${eventPrefix}onDropItem`,
  onHighlightSlots: `${eventPrefix}onHighlightSlots`,
  onDehighlightSlots: `${eventPrefix}onDehighlightSlots`, // Called to get rid of highlight on equipment slots.
  resetInventorySlots: `${eventPrefix}resetInventorySlots`, // Called when inventory data is refetched
  updateInventoryItems: `${eventPrefix}updateInventoryItemOnEquip`, // Update ItemSlot state in InventoryBody component.
  updateInventoryItemSlot: `${eventPrefix}setInventoryItemSlot`, // Update InventoryItemSlot savedItem state.
};

export interface OnHighlightSlots {
  gearSlots: Partial<ql.schema.GearSlotDefRef>[];
}

export interface UpdateInventoryItemsOnEquipCallback {
  equippedItem?: Partial<ql.schema.EquippedItem>;
  inventoryItem?: InventoryItemFragment;
}

export interface EquipItemCallback {
  inventoryItem: Partial<ql.schema.Item>;
  willEquipTo: Partial<ql.schema.GearSlotDefRef>[];
  prevEquippedItem?: Partial<ql.schema.EquippedItem>;
}

export interface UnequipItemCallback {
  item: Partial<ql.schema.Item>;
  gearSlots: Partial<ql.schema.GearSlotDefRef>[];
}

export interface DropItemCallback {
  itemId: string;
  gearSlotSets: Partial<ql.schema.GearSlotSet>[];
}

export default eventNames;
