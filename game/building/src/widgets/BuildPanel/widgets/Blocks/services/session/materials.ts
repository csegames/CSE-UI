/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Material} from '../../lib/Material';
import {Block} from '../../lib/Block';
import requester from './requester';

const assign = require('object-assign');

const SELECT_MATERIAL = 'buildpanel/panes/SELECT_MATERIAL';
const SELECT_MATERIAL_BY_ID = 'buildpanel/panes/SELECT_MATERIAL_BY_ID';
const SELECT_BLOCK_BY_SHAPE = 'buildpanel/panes/SELECT_BLOCK_BY_SHAPE';

const SET_MATERIALS = 'buildpanel/panes/SET_MATERIALS';

const DEFAULT_MATERIAL: Material = {
  id: -1,
  icon: '',
  name: 'default',
  tags: 'default',
  blocks: []
} as Material;

function getMaterialAsString(mat: Material) {
  return "{ id: " + mat.id + ", name: '" + mat.name + "', tags: '" + mat.tags + "', blocks: " +
    getBlocksAsString(mat.blocks) + ", icon:'" + mat.icon + "'},"
}

function getBlocksAsString(blocks: Block[]) {
  let blockString = "[";
  for (let i in blocks) {
    let b = blocks[i];
    blockString +=
      "{ id: " + b.id +
      ", name: '" + b.name +
      "', tags: '" + b.tags +
      "', materialId: " + b.materialId +
      ", shapeId: " + b.shapeId +
      ", shape: '" + b.shape +
      "', icon: '" + b.icon +
      "' },";
  }
  blockString += "]";
  return blockString;
}

export function loadMaterials(dispatch: (action: any) => void) {
  requester.loadMaterials((mats: Material[]) => {
    dispatch(setMaterials(mats))
  });

  requester.listenForBlockSelectionChange((mat: number, shape: number) => {
    dispatch(selectMaterialById(mat));
    dispatch(selectBlockByShape(shape));
  });
}


export function requestBlockChange(block: Block) {
  requester.changeBlockSelection(block);
}

export function requestMaterialChange(material: Material, shape: Block) {
  let block: Block = getBlockForShapeId(material.blocks, shape.shapeId);
  requester.changeBlockSelection(block);
}


function selectMaterial(material: Material) {
  return {
    type: SELECT_MATERIAL,
    selectedMaterial: material
  }
}

function selectMaterialById(materialId: number) {
  return {
    type: SELECT_MATERIAL_BY_ID,
    selectedMaterialId: materialId
  }
}

function setMaterials(materials: Material[]) {
  return {
    type: SET_MATERIALS,
    materials: materials
  }
}

function selectBlockByShape(shapeId: number) {
  return {
    type: SELECT_BLOCK_BY_SHAPE,
    shapeId: shapeId
  }
}

export interface MaterialsState {
  materials?: Material[];
  selectedMaterial?: Material;
  selectedBlock: Block;
}

const initialState: MaterialsState = {
  materials: [],
  selectedMaterial: DEFAULT_MATERIAL,
  selectedBlock: {} as Block
}

export function findBlock(mat: number, shape: number, materials: Material[])
{
   let material: Material = getMaterialById(materials, mat);
   return getBlockForShapeId(material.blocks, shape);
}

function getMaterialById(materials: Material[], id: number) {
  for (var m in materials) {
    if (materials[m].id == id)
      return materials[m];
  }
  return materials[0] || DEFAULT_MATERIAL;
}

function getBlockForShapeId(blocks: Block[], shapeId: number) {
  for (let i in blocks) {
    let block = blocks[i];
    if (block.shapeId == shapeId) {
      return block;
    }
  }
  return blocks[0] || {} as Block;
}

export default function reducer(state: MaterialsState = initialState, action: any = {}) {
  switch (action.type) {
    case SELECT_MATERIAL:
      return assign({}, state, {
        selectedMaterial: action.selectedMaterial,
      });
    case SET_MATERIALS:
      return assign({}, state, {
        materials: action.materials,
        selectedMaterial: action.materials[0],
        selectedBlock: action.materials[0].blocks[0]
      });
    case SELECT_MATERIAL_BY_ID:
      return assign({}, state, {
        selectedMaterial: getMaterialById(state.materials, action.selectedMaterialId),
      });
    case SELECT_BLOCK_BY_SHAPE:
      return assign({}, state, {
        selectedBlock: getBlockForShapeId(state.selectedMaterial.blocks, action.shapeId),
      });
    default: return state;
  }
}
