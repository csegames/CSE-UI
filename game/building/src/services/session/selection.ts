/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {BuildingItem} from '../../lib/BuildingItem';
const assign = require('object-assign');

const CHANGE_SELECTION = 'building/selection/CHANGE_SELECTION';

export function selectItem(item: BuildingItem) {
  return {
    type: CHANGE_SELECTION,
    item: item,
  }
}

export interface SelectionState {
  selectedItem?: BuildingItem;
}

const initialState = {
  selectedItem: <BuildingItem>null,
}

export default function reducer(state: SelectionState = initialState, action: any = {}) {
  switch(action.type) {
    case CHANGE_SELECTION:
      return assign({}, state, { selectedItem: action.item });
    default: return state;
  }
}
