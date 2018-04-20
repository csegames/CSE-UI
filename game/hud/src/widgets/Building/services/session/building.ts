/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, buildUIMode } from '@csegames/camelot-unchained';
import requester from './requester';
import * as assign from 'object-assign';

const CHANGE_MODE = 'building/mode/CHANGE_MODE';

function setMode(mode: buildUIMode) {
  return {
    type: CHANGE_MODE,
    mode,
  };
}

export function initializeBuilding(dispatch: any) {

  requester.loadMaterials();

  events.addListener(events.buildingEventTopics.handlesBuildingMode, (info: { mode: buildUIMode }) => {
    dispatch(setMode(info.mode));
  });
}

export interface BuildingState {
  mode?: buildUIMode;
}

const initialState = {
  mode: buildUIMode.NOTBUILDING,
};

export default function reducer(state: BuildingState = initialState, action: any = {}) {
  switch (action.type) {
    case CHANGE_MODE:
      return assign({}, state, { mode: action.mode });
    default: return state;
  }
}
