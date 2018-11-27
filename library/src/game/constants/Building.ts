/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

interface CUBEItemBase {
  /**
   * On a Block the ID contains an embedded material & shape id
   */
  id: number;

  /**
   * Base64 encoded image
   */
  icon: string;

  /**
   * Tags used for sorting & searching for blocks
   */
  tags: ArrayMap<string>;
}

declare global {
  enum BuildingMode {
    NotBuilding = 0,
    PlacingPhantom = 1,
    PhantomPlaced = 2,
    SelectingBlocks = 4,
    BlocksSelected = 8,
  }

  interface Block extends CUBEItemBase {
    materialID: number;
    shapeID: number;
  }

  interface Material extends CUBEItemBase {
    blocks: ArrayMap<Block>;
  }

  interface PotentialItem extends CUBEItemBase {
    name: string;
  }

  interface Blueprint extends CUBEItemBase {
    name: string;
  }

  interface Window {
    BuildingMode: typeof BuildingMode;
  }
}

enum BuildingMode {
  NotBuilding = 0,
  PlacingPhantom = 1,
  PhantomPlaced = 2,
  SelectingBlocks = 4,
  BlocksSelected = 8,
}
window.BuildingMode = BuildingMode;

