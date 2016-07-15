/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Material, MaterialType} from '../../lib/Material';
import {Block} from '../../lib/Block';
import requester from './requester';

const assign = require('object-assign');

const SELECT_FROM_MATERIAL = 'buildpanel/panes/SELECT_FROM_MATERIAL';
const SELECT_TO_MATERIAL = 'buildpanel/panes/SELECT_TO_MATERIAL';

const DEFAULT_MATERIAL: Material = {
  id: -1,
  icon: '',
  name: 'default',
  tags: 'default',
  type: MaterialType.OTHER,
  blocks: []
} as Material;


export function selectFromMaterial(material: Material) {
  return {
    type: SELECT_FROM_MATERIAL,
    selectedMaterial: material
  }
}

export function selectToMaterial(material: Material) {
  return {
    type: SELECT_TO_MATERIAL,
    selectedMaterial: material
  }
}

export interface MaterialsReplaceState {
  from: Material;
  to: Material;
}

const initialState: MaterialsReplaceState = {
  from: DEFAULT_MATERIAL,
  to: DEFAULT_MATERIAL
}

export default function reducer(state: MaterialsReplaceState = initialState, action: any = {}) {
  switch (action.type) {
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
