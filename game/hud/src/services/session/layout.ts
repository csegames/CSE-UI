/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client, WARBANDS_HUB} from 'camelot-unchained';

const localStorageKey = 'cse_hud_layout-state';

const INITIALIZE_HUB = 'hud/layout/INITIALIZE_HUB';
const HUB_INITIALIZED = 'hud/layout/HUB_INITIALIZED';
const SAY_SOMETHING = 'hud/layout/SAY_SOMETHING';

const LOCK_HUD = 'hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'hud/layout/UNLOCK_HUD';
const SET_POSITION = 'hud/layout/SET_POSITION';
const SAVE_POSITION = 'hud/layout/SAVE_POSITION';
const RESET_POSITIONS = 'hud/layout/RESET_POSITIONS';

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

let hub: any = null;

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

function initHub(): LayoutAction {
  return {
    type: INITIALIZE_HUB
  }
}

// async
export function initializeHub() {
  return (dispatch: (action: any) => any) => {
    dispatch(initHub());

    cu.api.createWarband(1, client.characterID, 'Corsairs')
      .then((data: any) => console.log(data))
      .catch((data: any) => console.log(data));
  }
}

export function saySomething(s: string) : LayoutAction {
  console.log(s);
  return {
    type: SAY_SOMETHING,
  }
}



let defaultWidgets = () => {
  return {
    'PlayerHealth': {x:100,y:300,scale:1,height:200,width:350},
    'TargetHealth': {x:600,y:300,scale:1,height:200,width:350},
    'Warband': {x:100,y:10,scale:1,height:200,width:350},
    'Chat': {x:10,y:100,scale:1,height:300,width:600},
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
      Object.assign(w[action.widget], action.position);
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
