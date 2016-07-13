/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {Block} from './Block'
export enum MaterialType {
  STONE_BLOCK,
  STONE_TILE,
  STONE_SHEET,
  WOOD,
  OTHER,
}

export interface Material {
  id: number,
  icon: string,
  name: string,
  tags: string,
  type: MaterialType,
  blocks: Block[]
}

function hasType(tags: string[], types: { [key: string]: boolean }): boolean {
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (types[tag])
      return true;
  }
  return false;
}

export function getTypeFromTags(tags: string[]): MaterialType {
  if (hasType(tags, STONE)) {

    if (hasType(tags, STONE_TILES))
      return MaterialType.STONE_TILE;

    if (hasType(tags, STONE_SHEETS))
      return MaterialType.STONE_SHEET;

    return MaterialType.STONE_BLOCK;
  } else if (hasType(tags, WOOD_AND_ORGANIC)) {
    return MaterialType.WOOD;
  }
  return MaterialType.OTHER;
}

let names: string[] = [];
names[MaterialType.STONE_BLOCK] = "STONE_BLOCK";
names[MaterialType.STONE_TILE] = "STONE_TILE";
names[MaterialType.STONE_SHEET] = "STONE_SHEET";
names[MaterialType.WOOD] = "WOOD";
names[MaterialType.OTHER] = "OTHER";

const STONE: { [key: string]: boolean } = {
  "stone": true, "rock": true, "slate": true,
  "ceramic": true, "marble": true, "plaster": true,
  "bricks": true, "sandstone": true,
  "blocks": true, "cobblestone": true, "cobble": true,
  "hexagon": true //bad tag
};

const STONE_TILES: { [key: string]: boolean } = {
  "tiles": true,
  "slate": true,
  "tile": true //bad tag
};
const STONE_SHEETS: { [key: string]: boolean } = {
  "sheet": true,
  "marble": true,
  "polished": true //bad tag
};

const WOOD_AND_ORGANIC: { [key: string]: boolean } = { "wood": true, "grass": true, "thatch": true };
