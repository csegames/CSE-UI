/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client, DEBUG_ASSERT} from 'camelot-unchained';

const localStorageKey = 'cse_hud_layout-state';

const INITIALIZE = 'hud/layout/INITIALIZE';
const HUB_INITIALIZED = 'hud/layout/HUB_INITIALIZED';
const SAY_SOMETHING = 'hud/layout/SAY_SOMETHING';

const LOCK_HUD = 'hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'hud/layout/UNLOCK_HUD';
const SET_POSITION = 'hud/layout/SET_POSITION';
const SAVE_POSITION = 'hud/layout/SAVE_POSITION';
const RESET_POSITIONS = 'hud/layout/RESET_POSITIONS';
const ADJUST_POSITIONS = 'hud/layout/ADJUST_POSITIONS';

const ON_RESIZE = 'hud/layout/ON_RESIZE';

const CURRENT_STATE_VERSION: number = 3;
const MIN_STATE_VERSION_PERCENT: number = 2;
const MIN_STATE_VERSION_ANCHORED: number = 3;

export interface LayoutAction {
  type: string;
  error?: string;
  widget?: string;
  position?: Position;
  size?: Size;
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

function init(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: INITIALIZE,
    size: screen
  };
}

// async
export function initialize() {
  return (dispatch: (action: any) => any) => {
    dispatch(init());
    window.onresize = () => dispatch(resize());
  }
}

export function resize() {
  console.log('resized');
  return {
    type: ON_RESIZE,
  };
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
    'PlayerHealth': {x: 100, y: 300, height: 200, width: 350, scale: 1},
    'TargetHealth': {x: 600, y: 300, height: 200, width: 350, scale: 1},
    'Warband': {x: 100, y: 10, scale:1, height: 200, width: 350},
    'Chat': {x: 10, y: 600, scale:1, height: 300, width: 600},
  };
}

const minScale = 0.25;

export interface LayoutState {
  version?: number;
  locked?: boolean;
  lastScreenSize?: Size;
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

const RELATIVE_TO_START: number = -1;
const RELATIVE_TO_CENTER: number = 0;
const RELATIVE_TO_END: number = 1;

interface AnchoredAxis {
  anchor: number;               // -1 (start) 0 (center) 1 (end)
  px: number;
}

interface AnchoredPosition {
  x: AnchoredAxis;
  y: AnchoredAxis;
  size: Size;
  scale: number;
}

function axis2anchor(position: number, width: number, range: number) : AnchoredAxis {
  if (position < (range * 0.25)) return { anchor: RELATIVE_TO_START, px: position };
  if ((position + width) > (range * 0.75)) return { anchor: RELATIVE_TO_END, px: range - position };
  return { anchor: RELATIVE_TO_CENTER, px: position - (range * 0.5) };
}

function position2anchor(current: Position, screen: Size) : AnchoredPosition {
  return {
    x: axis2anchor(current.x, current.width, screen.width),
    y: axis2anchor(current.y, current.height, screen.height),
    size: {
      width: current.width,
      height: current.height
    },
    scale: 1
  };
}

function anchor2axis(anchored: AnchoredAxis, range: number) : number {
  switch(anchored.anchor) {
    case RELATIVE_TO_CENTER: // relative to center
      return (range * 0.5) + anchored.px;
    case RELATIVE_TO_START: // relative to start
      return anchored.px;
    case RELATIVE_TO_END:
      return range - anchored.px;
  }
}

function anchored2position(anchored: AnchoredPosition, screen: Size) : Position {
  return {
    x: anchor2axis(anchored.x, screen.width),
    y: anchor2axis(anchored.y, screen.height),
    width: anchored.size.width,
    height: anchored.size.height,
    scale: anchored.scale
  };
}

function forceOnScreen(current: Position, screen: Size) : Position {
  const pos: Position = Object.assign({}, current);
  if (pos.x < 0) pos.x = 0;
  if (pos.y < 0) pos.y = 0;
  if (pos.x + pos.width > screen.width) pos.x = screen.width - pos.width;
  if (pos.y + pos.height > screen.height) pos.y = screen.height - pos.height;
  if (pos.x < 0) { pos.x = 0; pos.width = screen.width; }
  if (pos.y < 0) { pos.y = 0; pos.height = screen.height; }
  return pos;
}

function getInitialState(): any {
  const storedState: LayoutState = loadState();
  if (storedState) {
    storedState.locked = initialState.locked;
    return storedState;
  }
  return initialState;
}

function loadState() : LayoutState {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const state: LayoutState = JSON.parse(localStorage.getItem(localStorageKey)) as LayoutState;
  if (state) {
    if ((state.version|0) >= MIN_STATE_VERSION_ANCHORED) {
      for (let key in state.widgets) {
        state.widgets[key] = forceOnScreen(anchored2position(state.widgets[key], screen), screen);
      }
    }
    return state;
  }
}

function saveState(state: LayoutState) {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const save: LayoutState = {
    version: CURRENT_STATE_VERSION,
    locked: state.locked,
    widgets: {}
  };
  for (let key in state.widgets) {
    save.widgets[key] = position2anchor(state.widgets[key], screen);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(save));
}

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
    case INITIALIZE:
    {
      outState = Object.assign({}, state, {
        lastScreenSize: action.size
      });
      break;
    }
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
      break;
    case ON_RESIZE:
    {
      // need to scan wiget positions, and check if they still fit in the
      // new window size
      const screen: Size = { width: window.innerWidth, height: window.innerHeight };
      widgets = {};
      for (let key in state.widgets) {
        const anchored: AnchoredPosition = position2anchor(state.widgets[key], state.lastScreenSize);
        widgets[key] = forceOnScreen(anchored2position(anchored, screen), screen);
      }
      outState = Object.assign({}, state, {
        widgets: widgets,
        lastScreenSize: screen
      })
      break;
    }
  }

  // save to local storage
  saveState(outState);

  return outState;
}
