/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, BuildingBlock, BuildingMaterial} from 'camelot-unchained';

import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../../../lib/BuildPane';
import MaterialsByType from '../../lib/MaterialsByType';

const assign = require('object-assign');

const SET_MATERIALS_BY_TYPE = 'buildpanel/panes/SET_MATERIALS_BY_TYPE';
const UPDATE_MATERIAL_SELECTOR = 'buildpanel/panes/UPDATE_MATERIAL_SELECTOR';
const SET_MATERIAL_SELECTION = 'buildpanel/panes/SET_MATERIAL_SELECTION';


const DEFAULT_MATERIAL = new BuildingMaterial({} as BuildingMaterial);

export function initialize(dispatch: any) {

  events.addListener(events.buildingEventTopics.handlesBlocks, (info: { materials: BuildingMaterial[] }) => {
    const matsByType: MaterialsByType = new MaterialsByType(info.materials)
    dispatch(setMaterialsByType(matsByType))
  });

  events.addListener(ACTIVATE_MATERIAL_SELECTOR, (info: { selection: BuildingMaterial, onSelect: (material: BuildingMaterial) => void }) => {
    dispatch(updateMaterialSelector(info.selection, info.onSelect));
  })

  events.addListener(DEACTIVATE_MATERIAL_SELECTOR, (info: {}) => {
    dispatch(updateMaterialSelector(null, null));
  })
}

export function setMaterialsByType(matsByType: MaterialsByType) {
  return {
    type: SET_MATERIALS_BY_TYPE,
    matsByType: matsByType
  }
}

export function setSelectedMaterial(selection: BuildingMaterial) {
  return {
    type: SET_MATERIAL_SELECTION,
    selection: selection,
  }
}

export function updateMaterialSelector(selection: BuildingMaterial, onSelect: (material: BuildingMaterial) => void) {
  return {
    type: UPDATE_MATERIAL_SELECTOR,
    selection: selection,
    onSelect: onSelect
  }
}

export interface MaterialsByTypeState {
  materialsByType: MaterialsByType;

  selectedMaterial: BuildingMaterial,
  onMaterialSelected: (material: BuildingMaterial) => void;
}

const initialState: MaterialsByTypeState = {
  materialsByType: new MaterialsByType([]),
  selectedMaterial: {} as BuildingMaterial,
  onMaterialSelected: (material: BuildingMaterial) => { }
}

export default function reducer(state: MaterialsByTypeState = initialState, action: any = {}) {
  switch (action.type) {
    case SET_MATERIALS_BY_TYPE:
      return assign({}, state, {
        materialsByType: action.matsByType
      });
    case UPDATE_MATERIAL_SELECTOR:
      return assign({}, state, {
        onMaterialSelected: action.onSelect,
        selectedMaterial: action.selection,
      });
    case SET_MATERIAL_SELECTION:
      return assign({}, state, {
        selectedMaterial: action.selection
      });
    default: return state;
  }
}
