/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, BuildingMaterial } from '@csegames/camelot-unchained';

import { ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR } from '../../../../lib/BuildPane';
import MaterialsByType from '../../lib/MaterialsByType';
import * as assign from 'object-assign';

const SET_MATERIALS_BY_TYPE = 'buildpanel/panes/SET_MATERIALS_BY_TYPE';
const UPDATE_MATERIAL_SELECTOR = 'buildpanel/panes/UPDATE_MATERIAL_SELECTOR';
const SET_MATERIAL_SELECTION = 'buildpanel/panes/SET_MATERIAL_SELECTION';
const SET_MATERIAL_HOVER = 'buildpanel/panes/SET_MATERIAL_HOVER';

export function initialize(dispatch: any) {

  events.addListener(events.buildingEventTopics.handlesBlocks, (info: { materials: BuildingMaterial[] }) => {
    const matsByType: MaterialsByType = new MaterialsByType(info.materials);
    dispatch(setMaterialsByType(matsByType));
  });

  events.addListener(DEACTIVATE_MATERIAL_SELECTOR, (info: {}) => {
    // dispatch(updateMaterialSelector(null, null));
  });

  events.addListener(ACTIVATE_MATERIAL_SELECTOR,
                     (info: { selection: BuildingMaterial, onSelect: (material: BuildingMaterial) => void }) => {
                       dispatch(updateMaterialSelector(info.selection, info.onSelect));
                     });
}

export function setMaterialsByType(matsByType: MaterialsByType) {
  return {
    type: SET_MATERIALS_BY_TYPE,
    matsByType,
  };
}

export function setSelectedMaterial(selection: BuildingMaterial) {
  return {
    type: SET_MATERIAL_SELECTION,
    selection,
  };
}

export function setHoverMaterial(material: BuildingMaterial) {
  return {
    type: SET_MATERIAL_HOVER,
    material,
  };
}

export function updateMaterialSelector(selection: BuildingMaterial, onSelect: (material: BuildingMaterial) => void) {
  return {
    type: UPDATE_MATERIAL_SELECTOR,
    selection,
    onSelect,
  };
}

export interface MaterialsByTypeState {
  materialsByType: MaterialsByType;

  selectedMaterial: BuildingMaterial;
  onMaterialSelected: (material: BuildingMaterial) => void;

  hoverMaterial: BuildingMaterial;
}

const initialState: MaterialsByTypeState = {
  materialsByType: new MaterialsByType([]),
  selectedMaterial: {} as BuildingMaterial,
  onMaterialSelected: (material: BuildingMaterial) => { },
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
