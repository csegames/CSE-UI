/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client} from 'camelot-unchained';

const localStorageKey = 'cse_hud_layout-state';

const INITIALIZE_HUB = 'hud/layout/INITIALIZE_HUB';
const HUB_INITIALIZED = 'hud/layout/HUB_INITIALIZED';
const SAY_SOMETHING = 'hud/layout/SAY_SOMETHING';

const LOCK_HUD = 'hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'hud/layout/UNLOCK_HUD';
const SET_POSITION = 'hud/layout/SET_POSITION';
const SAVE_POSITION = 'hud/layout/SAVE_POSITION';
const RESET_POSITIONS = 'hud/layout/RESET_POSITIONS';
const ADJUST_POSITIONS = 'hud/layout/ADJUST_POSITIONS';

const CURRENT_STATE_VERSION: number = 2;
const MIN_STATE_VERSION_PERCENT: number = 2;

export interface LayoutAction {
  type: string;
  error?: string;
  widget?: string;
  position?: Position;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
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

export function adjustWidgetPositions() {
  return {
    type: ADJUST_POSITIONS,
  }
}


const defaultWidgets = (): any => {
  return {
    'PlayerHealth': { x: 100, y: 300, height: 200, width: 350, scale: 1 },
    'TargetHealth': { x: 600, y: 300, height: 200, width: 350, scale: 1 },
    'Warband': { x: 100, y: 10, scale:1, height: 200, width: 350 },
    'Chat': { x: 10, y: 100, scale:1, height: 300, width: 600 },
  };
}

const minScale = 0.25;

export interface LayoutState {
  version?: number;
  locked?: boolean;
  widgets: any; // dictionary<name, position>
}

const initialState = {
  locked: true,
  widgets: defaultWidgets(),
}

interface Size {
  width: number;
  height: number;
}

const px2pcnt = (pos: Position, screen: Size) : Position => {
  // converts pixel co-ordinates into % of display size
  return {
    x: pos.x / screen.width,
    y: pos.y / screen.height,
    width: pos.width,           // don't scale width/height
    height: pos.height,
    scale: 1
  };
};

const pcnt2px = (pos: Position, screen: Size) : Position => {
  // converts % co-ordinates into pixels for current display
  return {
    x: screen.width * pos.x,
    y: screen.height * pos.y,
    width: pos.width,           // don't scale width/height
    height: pos.height,
    scale: 1
  }
};

const forceOnScreen = (current: Position, screen: Size) : Position => {
  const pos: Position = Object.assign({}, current);
  if (pos.x < 0) pos.x = 0;
  if (pos.y < 0) pos.y = 0;
  if (pos.x + pos.width > screen.width) pos.x = screen.width - pos.width;
  if (pos.y + pos.height > screen.height) pos.y = screen.height - pos.height;
  if (pos.x < 0) { pos.x = 0; pos.width = screen.width; }
  if (pos.y < 0) { pos.y = 0; pos.height = screen.height; }
  return pos;
};

const getInitialState = (): any => {
  const storedState: LayoutState = loadState();
  if (storedState) {
    storedState.locked = initialState.locked;
    return storedState;
  }
  return initialState;
}

const loadState = () : LayoutState => {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const state: LayoutState = JSON.parse(localStorage.getItem(localStorageKey)) as LayoutState;
  if (state) {
    if ((state.version|0) >= MIN_STATE_VERSION_PERCENT) {
      for (let key in state.widgets) {
        state.widgets[key] = forceOnScreen(pcnt2px(state.widgets[key], screen), screen);
      }
    }
    return state;
  }
};

const saveState = (state: LayoutState) => {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const save: LayoutState = {
    version: CURRENT_STATE_VERSION,
    locked: state.locked,
    widgets: {}
  };
  for (let key in state.widgets) {
    save.widgets[key] = px2pcnt(state.widgets[key], screen);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(save));
};

export default function reducer(state: LayoutState = getInitialState(),
                                action: LayoutAction = {type: null}): LayoutState {
  switch(action.type) {
    case LOCK_HUD:
      return Object.assign({}, state, {
        locked: true
      });
    case UNLOCK_HUD:
      return Object.assign({}, state, {
        locked: false
      });
  }

  let widgets: any;
  let outState: LayoutState = state;

  switch(action.type) {
    case SET_POSITION:
      widgets = state.widgets;
      widgets[action.widget] = action.position;
      outState = Object.assign({}, state, {
        widgets: widgets
      });
      break;
    case SAVE_POSITION:
      widgets = state.widgets;
      const position: Position = action.position;
      Object.assign(widgets[action.widget], position);
      if (position.scale <= minScale) widgets[action.widget].scale = minScale;
      outState = Object.assign({}, state, {
        widgets: widgets
      });
      break;
    case ADJUST_POSITIONS:
      // need to scan wiget positions, and check if they still fit in the
      // new window size
      const screen: Size = { width: window.innerWidth, height: window.innerHeight };
      widgets = {};
      for (let key in state.widgets) {
        widgets[key] = forceOnScreen(Object.assign({}, state.widgets[key]), screen);
      }
      outState = Object.assign({}, state, {
        widgets: widgets
      })
  }

  // save to local storage
  saveState(outState);

  return outState;
}
