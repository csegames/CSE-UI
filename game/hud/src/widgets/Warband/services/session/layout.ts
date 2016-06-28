/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const localStorageKey = 'cse_hud_warband--layout';

const LOCK_HUD = 'cu-ui/hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'cu-ui/hud/layout/UNLOCK_HUD';
const SET_POSITION = 'cu-ui/hud/layout/SET_POSITION';
const SAVE_POSITION = 'cu-ui/hud/layout/SAVE_POSITION';
const RESET_POSITIONS = 'cu-ui/hud/layout/RESET_POSITIONS';

export interface LayoutAction {
  type: string;
  error?: string;
  widget?: string;
  position?: Position;
}

export interface Position {
  x: number;
  y: number;
  scale: number;
}

// sync
export function lockHUD(): LayoutAction {
  return {
    type: LOCK_HUD
  }
}

export function unlockHUD(): LayoutAction {
  return {
    type: UNLOCK_HUD
  }
}

export function setPosition(name: string, pos: Position): LayoutAction {
  return {
    type: SET_POSITION,
    widget: name,
    position: pos
  }
}

export function savePosition(name: string, pos: Position): LayoutAction {
  return {
    type: SAVE_POSITION,
    widget: name,
    position: pos
  }
}

// async

let defaultWidgets = () => {
  return {
    'PlayerHealth': {x:100,y:300,scale:1},
    'TargetHealth': {x:600,y:300,scale:1},
    'Party': {x:100,y:10,scale:1},
  }
}

const minScale = 0.25;

export interface LayoutState {
  locked?: boolean;
  widgets: any; // dictionary<name, position>
}

const initialState = {
  locked: true,
  widgets: defaultWidgets(),
}

let getInitialState = () => {
  var storedState = JSON.parse(localStorage.getItem(localStorageKey)) as LayoutState;
  if (storedState) {
    storedState.locked = initialState.locked;
    return storedState;
  }
  return initialState;
}

export default function reducer(state: LayoutState = getInitialState(),
                                action: LayoutAction = {type: null}): LayoutState {
  let outState = state;
  switch(action.type) {
    case LOCK_HUD:
      return Object.assign({}, state, {
        locked: true
      });
    case UNLOCK_HUD:
      return Object.assign({}, state, {
        locked: false
      });
    case SET_POSITION:
    {
      const w = state.widgets;
      w[action.widget] = action.position;
      outState = Object.assign({}, state, {
        widgets: w
      });
    }
    case SAVE_POSITION:
    {
      const w = state.widgets;
      w[action.widget] = action.position;
      if (w[action.widget].scale <= minScale) w[action.widget].scale = minScale;
      outState = Object.assign({}, state, {
        widgets: w
      });
    }
  }

  // save to local storage
  localStorage.setItem(localStorageKey, JSON.stringify(outState));

  return outState;
}

