/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Material, MaterialType} from '../../lib/Material';
import {Block} from '../../lib/Block';
import {selectFromMaterial, selectToMaterial} from './materials-replace';
import requester from './requester';

const assign = require('object-assign');

const SELECT_MATERIAL = 'buildpanel/panes/SELECT_MATERIAL';
const SELECT_BLOCK = 'buildpanel/panes/SELECT_BLOCK';

const SET_MATERIALS = 'buildpanel/panes/SET_MATERIALS';

const DEFAULT_MATERIAL: Material = {
  id: -1,
  icon: '',
  name: 'default',
  tags: 'default',
  type: MaterialType.OTHER,
  blocks: []
} as Material;

function getMaterialAsString(mat: Material) {
  return "{ id: " + mat.id + ", name: '" + mat.name + "', tags: '" + mat.tags + "', blocks: " +
    getBlocksAsString(mat.blocks) + ", icon:'" + mat.icon + "'},"
}

function getBlocksAsString(blocks: Block[]) {
  let blockString = "[";
  for (let i in blocks) {
    const b = blocks[i];
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
    dispatch(selectFromMaterial(mats[0]))
    dispatch(selectToMaterial(mats[0]))
  });

  requester.listenForBlockSelectionChange((mat: Material, block: Block) => {
    dispatch(selectBlock(block));
    dispatch(selectFromMaterial(mat));
  });
}


export function requestBlockChange(block: Block) {
  requester.changeBlockSelection(block);
}

export function requestMaterialChange(material: Material, shapeId: number) {
  const block: Block = getBlockForShapeId(shapeId, material.blocks);
  requester.changeBlockSelection(block);
}


function selectBlock(block: Block) {
  return {
    type: SELECT_BLOCK,
    selectedBlock: block
  }
}

function selectMaterial(material: Material) {
  return {
    type: SELECT_MATERIAL,
    selectedMaterial: material
  }
}

function setMaterials(materials: Material[]) {
  return {
    type: SET_MATERIALS,
    materials: materials
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


function getMaterialById(id: number, materials: Material[]) {
  for (let m in materials) {
    if (materials[m].id === id) {
      return materials[m];
    }
  }
  return materials[0] || DEFAULT_MATERIAL;
}

function getBlockForShapeId(shapeId: number, blocks: Block[]) {
  for (let i in blocks) {
    const block = blocks[i];
    if (block.shapeId === shapeId) {
      return block;
    }
  }
  return blocks[0];
}

export default function reducer(state: MaterialsState = initialState, action: any = {}) {
  switch (action.type) {
    case SET_MATERIALS:
      return assign({}, state, {
        materials: action.materials,
        selectedMaterial: action.materials[0],
        selectedBlock: action.materials[0].blocks[0]
      });
    case SELECT_MATERIAL:
      return assign({}, state, {
        selectedMaterial: action.selectedMaterial,
      });
    case SELECT_BLOCK:
      const block: Block = action.selectedBlock;
      const newState: MaterialsState = { selectedBlock: block }
      if (state.selectedMaterial.id != block.materialId)
        newState.selectedMaterial = getMaterialById(block.materialId, state.materials);
      return assign({}, state, newState);
    default: return state;
  }
}
