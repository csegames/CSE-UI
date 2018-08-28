/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as events  from '@csegames/camelot-unchained/lib/events';
import { BuildingItem } from '../../lib/BuildingItem';
import assign from 'object-assign';

const CHANGE_SELECTION = 'building/selection/CHANGE_SELECTION';
const ITEM_SELECTED_EVENT = 'building/selection/ITEM_SELECTED_EVENT';

export function initializeSelections(dispatch: any) {
  events.addListener(ITEM_SELECTED_EVENT, (info: { item: BuildingItem }) => {
    dispatch(selectItem(info.item));
  });
}

export function selectItem(item: BuildingItem) {
  return {
    type: CHANGE_SELECTION,
    item,
  };
}

export interface SelectionState {
  selectedItem?: BuildingItem;
}

const initialState: SelectionState = {
  selectedItem: <BuildingItem> null,
};

export default function reducer(state: SelectionState = initialState, action: any = {}) {
  switch (action.type) {
    case CHANGE_SELECTION:
      return assign({}, state, { selectedItem: action.item });
    default: return state;
  }
}
