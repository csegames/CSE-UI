/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BuildingEventTopics from './events/BuildingEventTopics';

function getBlockForBlockId(blockId: number): Block {
  for (const material of game.plot.materials as Material[]) {
    for (const block of material.blocks) {
      if (block.id === blockId) {
        return block;
      }
    }
  }
  return null;
}

function getMaterialForBlockId(blockId: number): Material {
  for (const material of game.plot.materials as Material[]) {
    for (const block of material.blocks) {
      if (block.id === blockId) {
        return material;
      }
    }
  }
  return null;
}

function getBlockForMaterialAndShapeId(material: Material, shapeId: number): Block {
  for (const block of material.blocks) {
    if (window.shapeIDFromBlock(block) === shapeId) {
      return block;
    }
  }
  return null;
}

function requestBlockSelect(block: Block): void {
  game.plot.selectBlock(block.id);
}

function requestMaterials() {
}

export * from './blueprints';
export * from './building-actions';

export {
  requestMaterials,
  requestBlockSelect,
  getBlockForBlockId,
  getMaterialForBlockId,
  getBlockForMaterialAndShapeId,
  BuildingEventTopics,
};
