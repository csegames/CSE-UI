/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { EntityResource } from '../GameClientModels/EntityState';

export enum ItemActionUIReaction {
  None = 'None',
  CloseInventory = 'CloseInventory',
  PlacementMode = 'PlacementMode',
  OpenMiniMap = 'OpenMiniMap',
  OpenCraftingUI = 'OpenCraftingUI'
}

export interface ItemStat {
  id: number;
  value: number;
}

// Keep in synce with ItemLocationType.cs
export enum ItemLocationType {
  /** For internal UI use only.  Not accepted by the backend. */
  _Trade = -1,
  Invalid = 0,
  Equipped = 1,
  InContainer = 2,
  Inventory = 3,
  NonPersisted = 4,
  OnGround = 5,
  SecureTrade = 6,
  CraftingStation = 7,
  AccountBank = 8,
  CharacterWallet = 9
}

export interface ItemLocation {
  type: ItemLocationType;
  position: number;
  drawerIndex: number;
  parentItemID?: string;
}

export interface ItemAction {
  id: string;
  uiReaction: ItemActionUIReaction;
  showWhenDisabled: boolean;
  name: string;
  enabled: boolean;
}

export interface Item {
  defID: number;
  instanceID: string;
  location: ItemLocation;
  containerColor: number;
  resources: EntityResource[];
  stats: ItemStat[];
  stackHash: string;
  modSets: number[];
  ingredientEffects: number[];
  unitCount: number;
}

export interface CraftingStationData {
  entityID: string;
  numericItemDefID: number;
  itemInstanceID: string;
}
