/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { ql } from '@csegames/camelot-unchained';
import { InventoryItemFragment } from '../../../gqlInterfaces';
import { ContainerPermissionDef } from '../components/ItemShared/InventoryBase';
import { DrawerCurrentStats } from '../components/Inventory/components/Containers/Drawer';

export enum SlotType {
  Empty,
  // Standard - item slot for a general item
  Standard,
  // Stack - item slot with a stack of items
  Stack,
  // Container - a standard item container
  Container,
  // CraftingContainer - item slot which accepts an array of crafting items
  // that will be implicitly containered together
  CraftingContainer,
  // CraftingItem - item slots in a crafting container
  CraftingItem,
  // EmptyCraftingItem - empty slot in a crafting container
  EmptyCraftingItem,
}

export interface SlotIndexInterface {
  location: string;
  position: number;
  containerID?: string[];
  drawerID?: string;
}

export interface InventorySlotItemDef {
  slotType: SlotType;
  slotIndex: SlotIndexInterface;
  icon: string;
  groupStackHashID?: string;
  itemID?: string;
  item?: InventoryItemFragment;
  stackedItems?: InventoryItemFragment[];
  disableDrop?: boolean;
  disableDrag?: boolean;
  disableContextMenu?: boolean;
  disableEquip?: boolean;
  disableCraftingContainer?: boolean;
  disabled?: boolean;
}

export interface CraftingSlotItemDef {
  slotType: SlotType;
  groupStackHashID?: string;
  icon: string;
  slotIndex: SlotIndexInterface;
  containerID?: string[];
  drawerID?: string;
  drawerCurrentStats?: DrawerCurrentStats;
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  itemID?: string;
  item?: InventoryItemFragment;
  quality?: number;
  itemCount?: number;
  disableDrop?: boolean;
  disableDrag?: boolean;
  disableContextMenu?: boolean;
  disableEquip?: boolean;
  disableCraftingContainer?: boolean;
  disabled?: boolean;
}

export interface ContainerSlotItemDef {
  slotType: SlotType;
  groupStackHashID?: string;
  icon: string;
  slotIndex: SlotIndexInterface;
  stackedItems?: InventoryItemFragment[];
  itemID?: string;
  containerPermissions?: ContainerPermissionDef | ContainerPermissionDef[];
  quality?: number;
  itemCount?: number;
  item?: InventoryItemFragment;
  disableDrop?: boolean;
  disableDrag?: boolean;
  disableContextMenu?: boolean;
  disableEquip?: boolean;
  disableCraftingContainer?: boolean;
  disabled?: boolean;
}
