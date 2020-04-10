/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  interface ItemActionsMessage {
    itemInstanceID: string;
    boneAlias: number;
    actions: ItemAction[];
  }

  interface ItemAction {
    id: string;
    displayName: string;
    cooldownWorldTime: number;
    disabledDescription: string;
    uiReaction: UIReaction;
  }
}

declare global {
  enum UIReaction {
    None = 0,
    CloseInventory = 1,
    PlacementMode = 2,
    OpenMiniMap = 3,
    OpenCrafting = 4,
  }

  interface Window {
    UIReaction: typeof UIReaction;
  }
}

enum UIReaction {
  None = 0,
  CloseInventory = 1,
  PlacementMode = 2,
  OpenMiniMap = 3,
  OpenCrafting = 4,
}
window.UIReaction = UIReaction;
