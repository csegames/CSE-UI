/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { InventoryItem, ContainerDefStat_Single } from 'gql/interfaces';
import { ContainerPermissionDef } from '../components/ItemShared/InventoryBase';
import { DrawerCurrentStats } from '../components/Inventory/components/Containers/Drawer';
import { DataTransferLocation } from './eventNames';

export enum ArmorType {
  Heavy,
  Medium,
  Light,
}
export interface InventoryFilterButton {
  // The css class for the icon to use
  icon: string;
  // Unique name for this filter (** MUST BE UNIQUE **)
  name: string;
  // Any additional styling to add to the icon displayed
  // usually for flipping an icon for left / right
  style?: React.CSSProperties;
  // Filter method returns true if the given item should
  // be displayed when this filter is active
  filter: (item: InventoryItem.Fragment) => boolean;
  // Used to distinguish difference between Heavy, Medium, and Light armor
  armorType?: ArmorType;
}

export interface InventoryFilterButtonInfo {
  [id: string]: { icon: string, name: string, armorType?: ArmorType };
}

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
  location: DataTransferLocation;
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
  item?: InventoryItem.Fragment;
  stackedItems?: InventoryItem.Fragment[];
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
  drawerMaxStats?: ContainerDefStat_Single;
  itemID?: string;
  item?: InventoryItem.Fragment;
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
  stackedItems?: InventoryItem.Fragment[];
  itemID?: string;
  containerPermissions?: ContainerPermissionDef | ContainerPermissionDef[];
  quality?: number;
  itemCount?: number;
  item?: InventoryItem.Fragment;
  disableDrop?: boolean;
  disableDrag?: boolean;
  disableContextMenu?: boolean;
  disableEquip?: boolean;
  disableCraftingContainer?: boolean;
  disabled?: boolean;
}

export type SlotItemDefType = InventorySlotItemDef & CraftingSlotItemDef & ContainerSlotItemDef;
