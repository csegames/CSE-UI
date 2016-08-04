/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, buildUIMode} from 'camelot-unchained';
import requester from './requester';

const assign = require('object-assign');

const CHANGE_MODE = 'building/mode/CHANGE_MODE';

const win: any = window;
const fake: boolean = (win.cuAPI == null);

function setMode(mode: buildUIMode) {
  return {
    type: CHANGE_MODE,
    mode: mode,
  }
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
  mode: buildUIMode.PLACINGPHANTOM
}

export default function reducer(state: BuildingState = initialState, action: any = {}) {
  switch (action.type) {
    case CHANGE_MODE:
      return assign({}, state, { mode: action.mode });
    default: return state;
  }
}
