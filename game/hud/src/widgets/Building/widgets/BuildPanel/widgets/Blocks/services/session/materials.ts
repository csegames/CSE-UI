/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, BuildingBlock, BuildingMaterial, buildUIMode } from '@csegames/camelot-unchained';

import { selectFromMaterial, selectToMaterial, setBlockMode } from './materials-replace';
import assign from 'object-assign';

const SELECT_MATERIAL = 'buildpanel/panes/SELECT_MATERIAL';
const SELECT_BLOCK = 'buildpanel/panes/SELECT_BLOCK';

const SET_MATERIALS = 'buildpanel/panes/SET_MATERIALS';

export const DEFAULT_MATERIAL: BuildingMaterial = new BuildingMaterial({
  id: -1,
  icon: '',
  tags: ['default'],
  blocks: [],
} as BuildingMaterial);

export function initialize(dispatch: (action: any) => void) {

  events.addListener(events.buildingEventTopics.handlesBlocks, (info: { materials: BuildingMaterial[] }) => {
    const mats: BuildingMaterial[] = info.materials;
    dispatch(setMaterials(mats));
    dispatch(selectFromMaterial(mats[0]));
    dispatch(selectToMaterial(mats[0]));
  });

  events.addListener(
    events.buildingEventTopics.handlesBlockSelect, (info: { material: BuildingMaterial, block: BuildingBlock }) => {
      dispatch(selectBlock(info.block));
      dispatch(selectFromMaterial(info.material));
    });

  events.addListener(events.buildingEventTopics.handlesBuildingMode, (info: { mode: buildUIMode }) => {
    dispatch(setBlockMode(info.mode === buildUIMode.BLOCKSELECTED));
  });

}

function selectBlock(block: BuildingBlock) {
  return {
    type: SELECT_BLOCK,
    selectedBlock: block,
  };
}

function setMaterials(materials: BuildingMaterial[]) {
  return {
    type: SET_MATERIALS,
    materials,
  };
}

function getMaterialById(matId: number, materials: BuildingMaterial[]) {
  for (const m in materials) {
    if (materials[m].id === matId) {
      return materials[m];
    }
  }
  return materials[0] || DEFAULT_MATERIAL;
}

export interface MaterialsState {
  materials?: BuildingMaterial[];
  selectedMaterial?: BuildingMaterial;
  selectedBlock: BuildingBlock;
}

const initialState: MaterialsState = {
  materials: [],
  selectedMaterial: DEFAULT_MATERIAL,
  selectedBlock: {} as BuildingBlock,
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
      const block: BuildingBlock = action.selectedBlock;
      const newState: MaterialsState = { selectedBlock: block } as MaterialsState;
      if (state.selectedMaterial.id !== block.materialId) {
        newState.selectedMaterial = getMaterialById(block.materialId, state.materials);
      }
      return assign({}, state, newState);
    default: return state;
  }
}
