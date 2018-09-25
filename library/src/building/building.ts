/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import BuildingMaterial from './classes/BuildingMaterial';
import BuildingBlock from './classes/BuildingBlock';
import client from '../core/client';
import * as events  from '../events';

const materialsLoaded: boolean = false;
let materialsRequested: boolean = false;
let numBlocksToLoad: number = 0;

const loadCallbacks: { (subs: BuildingMaterial[]): void }[] = [];
const materialsMap: { [key: number]: BuildingMaterial } = {};
const materialsList: BuildingMaterial[] = [];
const blocks: { [key: number]: BuildingBlock } = {};

// tslint:disable-next-line
const BLANK_IMAGE = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAALxSURBVHhe5dlLiI1xGMfx30pCRFkJCyXFYiRSsmBByWIipMiOWYiNjZSirCxcsrUZuUzKZSGxULNT5JJsKaXspJlcVsd7zDn1zPN+z5n38v/bPIvP5nee37//M73TnN5Rp9MJDcNIMIwEw0gwjATDSDCMBMNIMIwEw0gwjATDSDCMBMNIMIwEw8akHYXNhU1gBXaqkrYWuufvLKH5ijBsTDr470j2BjtVSNfdWdYe7FSEYSvShLmcdx47w0ij7gzrKnZqwLA1adpc0tuIHSItLnwzXesjdmrCsDVpxFzUm8QOke65rrUQOzVhmIR00VzWO4MdSxpzHWsXdhrAMBnptbm0tx47XdLawh8za13GTkMYJiMtMBf3nmKnS3rmZvve4XwLGCYlHTELeKdg/qybsZaX5lvCMDnpllnC+llYbea2mc+80VlnJoJhFtIXs4x118x8dp/1Jf29tzDMQtpiFvJOF+64rO8VnpcIhtlI58xiVa3CsxLBMCvpuVluLofxjIQwzEpaUvjdW3CYG9hPDMPspP1mUfIWexlg+F9I18zC3hh2MsAwu5lviN97y5IfhfnYTQzD7KT7vUWHeYjdxDDMSjphlpxL+atyYhhmI60xy1W1Ds9KBMNspJdmMWuy8Mhlfe/xrEQwzEK6YJbyFvVmvrq870rpvEQwTE7abpbxjpm5ve4za/esMxPBMDlpyixiPYHZQa/Ap0qzCWCYlDRulvBmHn1Lmlf4ZGasx6X5ljBMZvg/Sg5hp0va52at49hpCMMkpGXm0t4EdizpputYS7HTAIZJDH8jXH70vZkf4KCvyx+w0wCGrQ1/8TH40feko65rXcJOTRi2Im0wl/TGsTOM9MCdYY1gpwYMW5F+mQta3T+Fcz/6nrTSnOFNY6cGDBsb/GKzq/qj70kn3VnWbexUhGEj0gFzKa/+o+9JL9yZVuP/GWAYCYaRYBgJhpFgGAmGkWAYCYaRYBgJhpFgGAmGkWAYCYaRYBhHR38Boj2hpYws8QsAAAAASUVORK5CYII=';

function getBlockForShapeId(shapeId: number, blocks: BuildingBlock[]) {
  for (const i in blocks) {
    const block = blocks[i];
    if (block.shapeId === shapeId) {
      return block;
    }
  }
  return blocks[0];
}

function getShapeIdFromBlockId(id: number) {
  return id >> 21 & 31;
}

function getMaterialIdFromBlockId(id: number) {
  return id >> 2 & 4095;
}

function recieveMaterials(subsRecieved: { [key: number]: string }) {
  for (const i in subsRecieved) {
    const id = parseInt(i, 10);
    const material = new BuildingMaterial({
      id,
      icon: subsRecieved[i],
      tags: [],
      blocks: [],
    } as BuildingMaterial);

    materialsMap[id] = material;
    materialsList.push(material);
  }
  client.RequestBlocks();
}

function recieveBlocks(blocksRecieved: any) {

  for (const i in blocksRecieved) {
    numBlocksToLoad++;
    const id = parseInt(i, 10);
    blocks[id] = {
      id,
      icon: blocksRecieved[i],
      materialTags: [],
      shapeTags: [],
    } as BuildingBlock;
  }

  for (const i in blocksRecieved) {
    const id = parseInt(i, 10);
    client.RequestBlockTags(id);
  }
}

function recieveBlockTags(id: number, tags: any) {
  const block: BuildingBlock = blocks[id];
  block.shapeId = getShapeIdFromBlockId(id);
  block.shapeTags = tags.Shapes;
  block.materialId = getMaterialIdFromBlockId(id);
  block.materialTags = tags.Types;

  const material = materialsMap[block.materialId];
  if (material == null) {
    console.log('unknown material ' + block.materialId + ' for block ' + id + '-' + tags.Types.join(','));
  } else {
    material.tags = tags.Types;
    material.blocks.push(block);
  }

  if (--numBlocksToLoad === 0) {
    // finished loading shapes and types
    events.fire(events.buildingEventTopics.handlesBlocks, { materials: materialsList });
  }
}

function getBlockForBlockId(blockid: number): BuildingBlock {
  const matId = getMaterialIdFromBlockId(blockid);
  const shapeId = getShapeIdFromBlockId(blockid);
  const sub = materialsMap[matId];
  if (sub == null) {
    return null;
  }

  // select by shape instead of by block id, it is more reliable, the block id sent back
  // can have extra information stored in it
  return getBlockForShapeId(shapeId, sub.blocks);
}

function getMaterialForBlockId(blockid: number): BuildingMaterial {
  const matId = getMaterialIdFromBlockId(blockid);
  return materialsMap[matId];
}

function requestBlockSelect(block: BuildingBlock): void {
  client.ChangeBlockType(block.id);
}

// some blocks don't show up in the list retrieved by Request Substances or RequestBlocks
// make up the information based on the block id, so we can at least display the shape and material type to the user
// returning this information as a promise in case it is possible to request meta data on the material
function getMissingMaterial(blockid: number): { material: BuildingMaterial, block: BuildingBlock } {
  const block: BuildingBlock = new BuildingBlock({
    id: blockid,
    shapeId: getShapeIdFromBlockId(blockid),
    materialId: getMaterialIdFromBlockId(blockid),
    icon: BLANK_IMAGE,

  } as BuildingBlock);
  blocks[block.id] = block;

  const material: BuildingMaterial =
    new BuildingMaterial({ id: block.materialId, blocks: [block], icon: BLANK_IMAGE } as BuildingMaterial);
  materialsMap[material.id] = material;
  materialsList.push(material);

  events.fire(events.buildingEventTopics.handlesBlocks, { materials: materialsList });

  return { material, block };
}

function requestMaterials() {
  if (!materialsRequested) {
    materialsRequested = false;
    client.OnReceiveSubstances(recieveMaterials);
    client.OnReceiveBlocks(recieveBlocks);
    client.OnReceiveBlockTags(recieveBlockTags);
    client.RequestSubstances();
  }
}

export * from './blueprints';
export * from './building-actions';

export { requestMaterials, getMissingMaterial, requestBlockSelect, getBlockForBlockId, getMaterialForBlockId };
