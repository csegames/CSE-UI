/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assign from 'object-assign';

const BLOCKS_SELECTED = 'buildpanel/panes/BLOCKS_SELECTED';
const SELECT_FROM_MATERIAL = 'buildpanel/panes/SELECT_FROM_MATERIAL';
const SELECT_TO_MATERIAL = 'buildpanel/panes/SELECT_TO_MATERIAL';

const DEFAULT_MATERIAL: Material = {
  id: -1,
  icon: '',
  tags: { 0: 'default' },
  blocks: {},
};


export function selectFromMaterial(material: Material) {
  return {
    type: SELECT_FROM_MATERIAL,
    selectedMaterial: material,
  };
}

export function selectToMaterial(material: Material) {
  return {
    type: SELECT_TO_MATERIAL,
    selectedMaterial: material,
  };
}

export function setBlockMode(blocksSelected: boolean) {
  return {
    type: BLOCKS_SELECTED,
    selected: blocksSelected,
  };
}

export interface MaterialsReplaceState {
  from: Material;
  to: Material;
  blocksSelected: boolean;
}

const initialState: MaterialsReplaceState = {
  from: DEFAULT_MATERIAL,
  to: DEFAULT_MATERIAL,
  blocksSelected: false,
};

export default function reducer(state: MaterialsReplaceState = initialState, action: any = {}) {
  switch (action.type) {
    case BLOCKS_SELECTED:
      return assign({}, state, {
        blocksSelected: action.selected,
      });
    case SELECT_FROM_MATERIAL:
      return assign({}, state, {
        from: action.selectedMaterial,
      });
    case SELECT_TO_MATERIAL:
      return assign({}, state, {
        to: action.selectedMaterial,
      });
    default: return state;
  }
}
