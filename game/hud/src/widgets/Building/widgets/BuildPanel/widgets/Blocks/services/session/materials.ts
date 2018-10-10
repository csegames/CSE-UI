/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { building } from '../../../../../../lib/old-library';
import { selectFromMaterial, selectToMaterial, setBlockMode } from './materials-replace';
import assign from 'object-assign';

const SELECT_MATERIAL = 'buildpanel/panes/SELECT_MATERIAL';
const SELECT_BLOCK = 'buildpanel/panes/SELECT_BLOCK';

const SET_MATERIALS = 'buildpanel/panes/SET_MATERIALS';

export const DEFAULT_MATERIAL: Material = {
  id: -1,
  icon: '',
  tags: ['default'],
  blocks: [],
} as Material;

export function initialize(dispatch: (action: any) => void) {

  game.on(building.BuildingEventTopics.handlesBlocks, (info: { materials: Material[] }) => {
    const mats: Material[] = info.materials;
    dispatch(setMaterials(mats));
    dispatch(selectFromMaterial(mats[0]));
    dispatch(selectToMaterial(mats[0]));
  });

  game.on(
    building.BuildingEventTopics.handlesBlockSelect, (info: { material: Material, block: Block }) => {
      dispatch(selectBlock(info.block));
      dispatch(selectFromMaterial(info.material));
    });

  game.on(building.BuildingEventTopics.handlesBuildingMode, (info: { mode: BuildingMode }) => {
    dispatch(setBlockMode(info.mode === window.BuildingMode.BlocksSelected));
  });

}

function selectBlock(block: Block) {
  return {
    type: SELECT_BLOCK,
    selectedBlock: block,
  };
}

function setMaterials(materials: Material[]) {
  return {
    type: SET_MATERIALS,
    materials,
  };
}

function getMaterialById(matId: number, materials: Material[]) {
  for (const m in materials) {
    if (materials[m].id === matId) {
      return materials[m];
    }
  }
  return materials[0] || DEFAULT_MATERIAL;
}

export interface MaterialsState {
  materials?: Material[];
  selectedMaterial?: Material;
  selectedBlock: Block;
}

const initialState: MaterialsState = {
  materials: [],
  selectedMaterial: DEFAULT_MATERIAL,
  selectedBlock: {} as Block,
};

export default function reducer(state: MaterialsState = initialState, action: any = {}) {
  switch (action.type) {
    case SET_MATERIALS:
      return assign({}, state, {
        materials: action.materials,
        selectedMaterial: action.materials[0],
        selectedBlock: action.materials[0].blocks[0],
      });
    case SELECT_MATERIAL:
      return assign({}, state, {
        selectedMaterial: action.selectedMaterial,
      });
    case SELECT_BLOCK:
      const block: Block = action.selectedBlock;
      const newState: MaterialsState = { selectedBlock: block } as MaterialsState;
      if (state.selectedMaterial.id !== window.materialIDFromBlock(block)) {
        newState.selectedMaterial = getMaterialById(window.materialIDFromBlock(block), state.materials);
      }
      return assign({}, state, newState);
    default: return state;
  }
}
