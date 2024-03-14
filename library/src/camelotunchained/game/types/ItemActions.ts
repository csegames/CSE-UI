/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// Keep in sync with the ItemStat enum in ItemStat.cs
export enum ItemStat {
  Quality = 1,
  UnitMass,
  SelfMass,
  TotalMass,
  Encumbrance,
  AgilityRequirement,
  DexterityRequirement,
  StrengthRequirement,
  VitalityRequirement,
  EnduranceRequirement,
  AttunementRequirement,
  WillRequirement,
  FaithRequirement,
  ResonanceRequirement,
  UnitCount,
  NestedItemCount
}

export interface ItemActionsMessage {
  itemInstanceID: string;
  boneAlias: number;
  numericItemDefID: number;
  itemStatReqs: ItemStatReq[];
  actions: ItemAction[];
}

export interface ItemStatReq {
  itemStat: ItemStat;
  value: number;
}

export interface ItemAction {
  id: string;
  displayName: string;
  cooldownWorldTime: number;
  disabled: boolean;
  disabledDescription: string;
  uiReaction: UIReaction;
}

export enum UIReaction {
  None = 0,
  CloseInventory = 1,
  PlacementMode = 2,
  OpenMiniMap = 3,
  OpenCrafting = 4
}
