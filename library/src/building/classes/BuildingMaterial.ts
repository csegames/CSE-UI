'use strict';
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BuildingBlock from './BuildingBlock';

class BuildingMaterial {
  public id: number;
  public icon: string;
  public tags: string[];
  public blocks: BuildingBlock[];

  constructor(substance = <BuildingMaterial> {}) {
    this.id = substance.id;
    this.icon = substance.icon;
    this.tags = substance.tags || [];
    this.blocks = substance.blocks || [];
  }

  public getBlockForShape(shapeId: number) {
    for (const i in this.blocks) {
      const block = this.blocks[i];
      if (block.shapeId === shapeId) {
        return block;
      }
    }
  }

  public static create() {
    const a = new BuildingMaterial();
    return a;
  }
}

export default BuildingMaterial;
