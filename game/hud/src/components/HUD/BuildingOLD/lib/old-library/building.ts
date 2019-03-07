/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BuildingEventTopics from './events/BuildingEventTopics';

function getBlockForBlockId(blockId: number) {
  for (const material in game.building.materials) {
    for (const block in game.building.materials[material].blocks) {
      if (game.building.materials[material].blocks[block].id === blockId) {
        return game.building.materials[material].blocks[block];
      }
    }
  }
  return null;
}

function getMaterialForBlockId(blockId: number) {
  for (const material in game.building.materials) {
    for (const block in game.building.materials[material].blocks) {
      if (game.building.materials[material].blocks[block].id === blockId) {
        return game.building.materials[material];
      }
    }
  }
  return null;
}

function getBlockForMaterialAndShapeId(material: Material, shapeId: number) {
  for (const block in material.blocks) {
    if (material.blocks[block].shapeID === shapeId) {
      return material.blocks[block];
    }
  }
  return null;
}

function requestBlockSelect(block: Block) {
  game.building.selectBlockAsync(block.id);
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
