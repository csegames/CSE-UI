"use strict";
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import BuildingBlock from './BuildingBlock';

class BuildingMaterial {
  id: number;
  icon: string;
  tags: string[];
  blocks: BuildingBlock[];

  constructor(substance = <BuildingMaterial>{}) {
    this.id = substance.id;
    this.icon = substance.icon;
    this.tags = substance.tags || [];
    this.blocks = substance.blocks || [];
  }

  public getBlockForShape(shapeId: number) {
    for (let i in this.blocks) {
      const block = this.blocks[i];
      if (block.shapeId === shapeId) {
        return block;
      }
    }
  }

  static create() {
    const a = new BuildingMaterial();
    return a;
  }
}
export default BuildingMaterial;
