/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Blueprint} from '../../lib/Blueprint';
import requester from './requester';

const assign = require('object-assign');

const SELECT_BLUEPRINT = 'buildpanel/panes/SELECT_BLUEPRINT';
const ADD_BLUEPRINT = 'buildpanel/panes/ADD_BLUEPRINT';
const ADD_BLUEPRINT_ICON = 'buildpanel/panes/ADD_BLUEPRINT_ICON';
const REMOVE_BLUEPRINT = 'buildpanel/panes/REMOVE_BLUEPRINT';
const DELETE_BLUEPRINT = 'buildpanel/panes/DELETE_BLUEPRINT';
const MODE_CHANGED = 'buildpanel/panes/MODE_CHANGED';

let myDispatch: (action: any) => void;

export function loadBlueprints(dispatch: (action: any) => void) {
  myDispatch = dispatch;
  requester.loadBlueprints((blueprint: Blueprint) => {
    dispatch(addBlueprint(blueprint))
  });
  requester.listenForModeChange((mode: boolean) => {
    dispatch(copyModeChanged(mode));
  });
  requester.listenForCopy(() => {
    dispatch(pasteModeChanged(true));
  });
}

export function selectBlueprint(blueprint: Blueprint) {
  requester.select(blueprint);
  myDispatch({
    type: SELECT_BLUEPRINT,
    blueprint: blueprint
  });
}

export function loadBlueprintIcon(blueprint: Blueprint) {
  requester.loadBlueprintIcon(blueprint, (blueprint: Blueprint, icon: string ) => {
    myDispatch(addBlueprintIcon(blueprint, icon))
  });
}

export function saveBlueprint(name: string) {
  requester.save(name);
}

export function deleteBlueprint(blueprint: Blueprint) {
  requester.remove(blueprint);
  myDispatch({ type: REMOVE_BLUEPRINT, blueprint: blueprint })
}

export function copyBlueprint() {
  requester.copy();
}

export function pasteBlueprint() {
  requester.paste();
}

function copyModeChanged(copy: boolean) {
  return {
    type: MODE_CHANGED,
    copy: copy
  }
}

function pasteModeChanged(paste: boolean) {
  return {
    type: MODE_CHANGED,
    paste: paste
  }
}

function addBlueprint(blueprint: Blueprint) {
  return {
    type: ADD_BLUEPRINT,
    blueprint: blueprint
  }
}

function addBlueprintIcon(blueprint: Blueprint, icon: string) {
  return {
    type: ADD_BLUEPRINT_ICON,
    blueprint: blueprint,
    icon: icon
  }
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
}

function remove(blueprints: Blueprint[], blueprint: Blueprint) {
  return blueprints.filter((bp: Blueprint) => { return bp.id != blueprint.id });
}

export default function reducer(state: BlueprintsState = initialState, action: any = {}) {
  switch (action.type) {
    case SELECT_BLUEPRINT:
      return assign({}, state, {
        selected: action.blueprint
      });
    case ADD_BLUEPRINT:
      return assign({}, state, {
        blueprints: [...state.blueprints, action.blueprint]
      });
    case ADD_BLUEPRINT_ICON:
      action.blueprint.icon = action.icon;
      return assign({}, state, {
        blueprints: [...state.blueprints]
      });
    case REMOVE_BLUEPRINT:
      return assign({}, state, {
        blueprints: remove(state.blueprints, action.blueprint)
      });
    case MODE_CHANGED:
      return assign({}, state, {
        copyable: action.copy == undefined ? state.copyable : action.copy,
        pastable: action.paste == undefined ? state.pastable : action.paste
      });
    default: return state;
  }
}
