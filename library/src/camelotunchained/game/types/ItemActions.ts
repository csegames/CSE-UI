/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export interface ItemActionsMessage {
  itemInstanceID: string;
  boneAlias: number;
  numericItemDefID: number;
  actions: ItemAction[];
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
