/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { BuildingMaterial } from '@csegames/camelot-unchained';

export default class MaterialsByType {

  public stoneBlocks: BuildingMaterial[] = [];
  public stoneTilesAndSheets: BuildingMaterial[] = [];
  public woodAndOrganic: BuildingMaterial[] = [];

  constructor(materials: BuildingMaterial[]) {
    this.organizeMaterialByType(materials);
  }

  private organizeMaterialByType(materials: BuildingMaterial[]) {
    materials.forEach((material: BuildingMaterial) => {
      const type: MaterialType = getTypeFromTags(material.tags);
      if (type === MaterialType.STONE_BLOCK) {
        this.stoneBlocks.push(material);
      } else if (type === MaterialType.STONE_TILE || type === MaterialType.STONE_SHEET) {
        this.stoneTilesAndSheets.push(material);
      } else {
        this.woodAndOrganic.push(material);
      }
    });
  }
}

enum MaterialType {
  STONE_BLOCK,
  STONE_TILE,
  STONE_SHEET,
  WOOD,
  OTHER,
}

function getTypeFromTags(tags: string[]): MaterialType {
  if (hasType(tags, STONE)) {

    if (hasType(tags, STONE_TILES)) return MaterialType.STONE_TILE;

    if (hasType(tags, STONE_SHEETS)) return MaterialType.STONE_SHEET;

    return MaterialType.STONE_BLOCK;
  } else if (hasType(tags, WOOD_AND_ORGANIC)) {
    return MaterialType.WOOD;
  }
  return MaterialType.OTHER;
}

function hasType(tags: string[], types: { [key: string]: boolean }): boolean {
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (types[tag]) return true;
  }
  return false;
}
const STONE: { [key: string]: boolean } = {
  stone: true, rock: true, slate: true,
  ceramic: true, marble: true, plaster: true,
  bricks: true, sandstone: true,
  blocks: true, cobblestone: true, cobble: true,
  hexagon: true, // bad tag
};

const STONE_TILES: { [key: string]: boolean } = {
  tiles: true,
  slate: true, // bad tag
  tile: true,   // bad tag
};
const STONE_SHEETS: { [key: string]: boolean } = {
  sheet: true,
  marble: true,  // bad tag
  polished: true, // bad tag
};

const WOOD_AND_ORGANIC: { [key: string]: boolean } = { wood: true, grass: true, thatch: true };
