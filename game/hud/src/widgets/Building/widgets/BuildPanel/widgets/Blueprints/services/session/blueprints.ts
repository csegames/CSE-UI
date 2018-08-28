/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, buildUIMode, BuildingBlueprint } from '@csegames/camelot-unchained';
import requester from './requester';
import assign from 'object-assign';

const UPDATE_BLUEPRINTS = 'buildpanel/panes/UPDATE_BLUEPRINTS';
const SELECT_BLUEPRINT = 'buildpanel/panes/SELECT_BLUEPRINT';
const MODE_CHANGED = 'buildpanel/panes/MODE_CHANGED';

export function loadBlueprints(dispatch: (action: any) => void) {

  events.addListener(events.buildingEventTopics.handlesBlueprints, (info: { blueprints: BuildingBlueprint[] }) => {
    dispatch(updateBlueprints(info.blueprints));
  });

  events.addListener(events.buildingEventTopics.handlesBlueprintSelect, (info: { blueprint: BuildingBlueprint }) => {
    dispatch(selectBlueprint(info.blueprint));
  });

  events.addListener(events.buildingEventTopics.handlesBuildingMode, (info: { mode: buildUIMode }) => {
    dispatch(copyModeChanged(info.mode === buildUIMode.BLOCKSELECTED));
  });

  events.addListener(events.buildingEventTopics.handlesBlueprintCopy, () => {
    dispatch(pasteModeChanged(true));
  });

  requester.requestBlueprints();
}

function copyModeChanged(copy: boolean) {
  return {
    type: MODE_CHANGED,
    copy,
  };
}

function pasteModeChanged(paste: boolean) {
  return {
    type: MODE_CHANGED,
    paste,
  };
}

function updateBlueprints(blueprints: BuildingBlueprint[]) {
  return {
    type: UPDATE_BLUEPRINTS,
    blueprints,
  };
}

function selectBlueprint(blueprint: BuildingBlueprint) {
  return {
    type: SELECT_BLUEPRINT,
    blueprint,
  };
}

export interface BlueprintsState {
  blueprints?: BuildingBlueprint[];
  selected?: BuildingBlueprint;
  copyable: boolean;
  pastable: boolean;
}

const initialState: BlueprintsState = {
  blueprints: [],
  selected: null,
  copyable: false,
  pastable: false,
};

export default function reducer(state: BlueprintsState = initialState, action: any = {}) {
  switch (action.type) {
    case UPDATE_BLUEPRINTS:
      return assign({}, state, {
        blueprints: [...action.blueprints],
      });
    case SELECT_BLUEPRINT:
      return assign({}, state, {
        selected: action.blueprint,
      });
    case MODE_CHANGED:
      return assign({}, state, {
        copyable: action.copy === undefined ? state.copyable : action.copy,
        pastable: action.paste === undefined ? state.pastable : action.paste,
      });
    default: return state;
  }
}
