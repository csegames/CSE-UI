'use strict';

/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class BuildingBlock {
  public id: number;
  public icon: string;
  public shapeId: number;
  public shapeTags: string[];
  public materialId: number;
  public materialTags: string[];

  constructor(block = <BuildingBlock> {}) {
    this.id = block.id;
    this.icon = block.icon;
    this.shapeId = block.shapeId;
    this.shapeTags = block.shapeTags || [];
    this.materialId = block.materialId;
    this.materialTags = block.materialTags || [];
  }

  public static create() {
    const a = new BuildingBlock();
    return a;
  }

}

export default BuildingBlock;
