/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { building } from '../../../../../../lib/old-library';
import { ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR } from '../../../../lib/BuildPane';
import MaterialsByType from '../../lib/MaterialsByType';
import assign from 'object-assign';

const SET_MATERIALS_BY_TYPE = 'buildpanel/panes/SET_MATERIALS_BY_TYPE';
const UPDATE_MATERIAL_SELECTOR = 'buildpanel/panes/UPDATE_MATERIAL_SELECTOR';
const SET_MATERIAL_SELECTION = 'buildpanel/panes/SET_MATERIAL_SELECTION';
const SET_MATERIAL_HOVER = 'buildpanel/panes/SET_MATERIAL_HOVER';

export function initialize(dispatch: any) {

  game.on(building.BuildingEventTopics.handlesBlocks, (info: { materials: Material[] }) => {
    const matsByType: MaterialsByType = new MaterialsByType(info.materials);
    dispatch(setMaterialsByType(matsByType));
  });

  game.on(DEACTIVATE_MATERIAL_SELECTOR, (info: {}) => {
    // dispatch(updateMaterialSelector(null, null));
  });

  game.on(ACTIVATE_MATERIAL_SELECTOR,
                     (info: { selection: Material, onSelect: (material: Material) => void }) => {
                       dispatch(updateMaterialSelector(info.selection, info.onSelect));
                     });
}

export function setMaterialsByType(matsByType: MaterialsByType) {
  return {
    type: SET_MATERIALS_BY_TYPE,
    matsByType,
  };
}

export function setSelectedMaterial(selection: Material) {
  return {
    type: SET_MATERIAL_SELECTION,
    selection,
  };
}

export function setHoverMaterial(material: Material) {
  return {
    type: SET_MATERIAL_HOVER,
    material,
  };
}

export function updateMaterialSelector(selection: Material, onSelect: (material: Material) => void) {
  return {
    type: UPDATE_MATERIAL_SELECTOR,
    selection,
    onSelect,
  };
}

export interface MaterialsByTypeState {
  materialsByType: MaterialsByType;

  selectedMaterial: Material;
  onMaterialSelected: (material: Material) => void;

  hoverMaterial: Material;
}

const initialState: MaterialsByTypeState = {
  materialsByType: new MaterialsByType([]),
  selectedMaterial: {} as Material,
  onMaterialSelected: (material: Material) => { },
  hoverMaterial: null,
};

export default function reducer(state: MaterialsByTypeState = initialState, action: any = {}) {
  switch (action.type) {
    case SET_MATERIALS_BY_TYPE:
      return assign({}, state, {
        materialsByType: action.matsByType,
      });
    case UPDATE_MATERIAL_SELECTOR:
      return assign({}, state, {
        onMaterialSelected: action.onSelect,
        selectedMaterial: action.selection,
      });
    case SET_MATERIAL_SELECTION:
      return assign({}, state, {
        selectedMaterial: action.selection,
      });
    case SET_MATERIAL_HOVER:
      return assign({}, state, {
        hoverMaterial: action.material,
      });
    default: return state;
  }
}
