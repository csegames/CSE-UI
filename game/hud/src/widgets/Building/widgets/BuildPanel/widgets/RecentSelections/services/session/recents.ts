/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as events  from '@csegames/camelot-unchained/lib/events';
import { BuildingItem } from '../../../../../../lib/BuildingItem';
import assign from 'object-assign';

const CHANGE_SELECTION = 'building/selection/CHANGE_SELECTION';
const ITEM_SELECTED_EVENT = 'building/selection/ITEM_SELECTED_EVENT';

export function initializeRecents(dispatch: any) {
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

export interface RecentsState {
  selectedItem?: BuildingItem;
  recentSelections?: BuildingItem[];
}

const initialState: RecentsState = {
  selectedItem: <BuildingItem> null,
  recentSelections: updateRecentItemList(null, []),
};

function updateRecentItemList(item: BuildingItem, items: BuildingItem[]) {
  const newItems: BuildingItem[] = [];
  newItems.push(item);
  for (let i = 0; i < 11; i++) {
    const current: BuildingItem = items[i];
    const add: boolean = current == null || !(current.id === item.id && current.type === item.type);
    if (add) {
      newItems.push(current);
    }
  }
  return newItems;
}

export default function reducer(state: RecentsState = initialState, action: any = {}) {
  switch (action.type) {
    case CHANGE_SELECTION:
      return assign({}, state, {
        selectedItem: action.item,
        recentSelections: updateRecentItemList(action.item, state.recentSelections) });
    default: return state;
  }
}
