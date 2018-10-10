/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import requester from './requester';
import assign from 'object-assign';

import { building } from '../../../../../../lib/old-library';

const UPDATE_BLUEPRINTS = 'buildpanel/panes/UPDATE_BLUEPRINTS';
const SELECT_BLUEPRINT = 'buildpanel/panes/SELECT_BLUEPRINT';
const MODE_CHANGED = 'buildpanel/panes/MODE_CHANGED';

export function loadBlueprints(dispatch: (action: any) => void) {

  game.on(building.BuildingEventTopics.handlesBlueprints, (info: { blueprints: Blueprint[] }) => {
    dispatch(updateBlueprints(info.blueprints));
  });

  game.on(building.BuildingEventTopics.handlesBlueprintSelect, (info: { blueprint: Blueprint }) => {
    dispatch(selectBlueprint(info.blueprint));
  });

  game.on(building.BuildingEventTopics.handlesBuildingMode, (info: { mode: BuildingMode }) => {
    dispatch(copyModeChanged(info.mode === window.BuildingMode.BlocksSelected));
  });

  game.on(building.BuildingEventTopics.handlesBlueprintCopy, () => {
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

function updateBlueprints(blueprints: Blueprint[]) {
  return {
    type: UPDATE_BLUEPRINTS,
    blueprints,
  };
}

function selectBlueprint(blueprint: Blueprint) {
  return {
    type: SELECT_BLUEPRINT,
    blueprint,
  };
}

export interface BlueprintsState {
  blueprints?: Blueprint[];
  selected?: Blueprint;
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
