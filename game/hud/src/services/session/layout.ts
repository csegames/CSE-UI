/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client, DEBUG_ASSERT, RUNTIME_ASSERT} from 'camelot-unchained';

const localStorageKey = 'cse_hud_layout-state';

const INITIALIZE = 'hud/layout/INITIALIZE';
const HUB_INITIALIZED = 'hud/layout/HUB_INITIALIZED';
const SAY_SOMETHING = 'hud/layout/SAY_SOMETHING';

const LOCK_HUD = 'hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'hud/layout/UNLOCK_HUD';
const SET_POSITION = 'hud/layout/SET_POSITION';
const SAVE_POSITION = 'hud/layout/SAVE_POSITION';
const RESET_HUD = 'hud/layout/RESET_HUD';

const ON_RESIZE = 'hud/layout/ON_RESIZE';

const CURRENT_STATE_VERSION: number = 3;
const MIN_STATE_VERSION_ANCHORED: number = 3;

function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

enum AxisAnchorRelativeTo {
  START = -1,
  CENTER = 0,
  END = 1,
}

export interface LayoutAction {
  type: string;
  error?: string;
  widget?: string;
  position?: Position;
  size?: Size;
}

export interface Anchor {
  x: AxisAnchorRelativeTo;
  y: AxisAnchorRelativeTo;
}

const TOP_LEFT: Anchor = { x: AxisAnchorRelativeTo.START, y: AxisAnchorRelativeTo.START };
const BOTTOM_LEFT: Anchor = { x: AxisAnchorRelativeTo.START, y: AxisAnchorRelativeTo.END };
const TOP_RIGHT: Anchor = { x: AxisAnchorRelativeTo.END, y: AxisAnchorRelativeTo.START };
const BOTTOM_RIGHT: Anchor = { x: AxisAnchorRelativeTo.END, y: AxisAnchorRelativeTo.END };
const MIDDLE_OF_WINDOW: Anchor = { x: AxisAnchorRelativeTo.CENTER, y: AxisAnchorRelativeTo.CENTER };

export interface Position {
  x: number;
  y: number;
  anchor: Anchor;
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

export function resetHUD(): LayoutAction {
  return {
    type: RESET_HUD
  };
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
    window.onresize = () => {
      if (window.innerWidth >= 640 && window.innerHeight >= 480) {
        dispatch(resize());
      }
    };
  }
}

export function resize() {
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

const minScale = 0.25;

export interface LayoutState {
  version: number;
  locked?: boolean;
  lastScreenSize?: Size;
  widgets: any; // dictionary<name, position>
}

const initialState = () => {
  return {
    locked: true,
    widgets: {
      Chat:{x:{anchor:-1,px:-60},y:{anchor:1,px:330},size:{width:600,height:300},scale:0.8},
      PlayerHealth:{x:{anchor:0,px:-294},y:{anchor:1,px:315},size:{width:350,height:200},scale:0.6},
      EnemyTargetHealth:{x:{anchor:0,px:-18},y:{anchor:1,px:315},size:{width:350,height:200},scale:0.6},
      FriendlyTargetHealth:{x:{anchor:0,px:-18},y:{anchor:1,px:195},size:{width:350,height:200},scale:0.6},
      Respawn:{x:{anchor:0,px:-100},y:{anchor:0,px:-100},size:{width:200,height:200},scale:1},
    },
    version: MIN_STATE_VERSION_ANCHORED
  }
}

interface Size {
  width: number;
  height: number;
}
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

function axis2anchor(anchor: AxisAnchorRelativeTo, position: number, range: number) : AnchoredAxis {
  switch(anchor) {
    case AxisAnchorRelativeTo.START:
      return { anchor: anchor, px: position };
    case AxisAnchorRelativeTo.END:
      return { anchor: anchor, px: range - position };
  }
  return { anchor: anchor, px: position - (range * 0.5) };
}

function position2anchor(current: Position, screen: Size) : AnchoredPosition {
  const position: AnchoredPosition = {
    x: axis2anchor(current.anchor.x, current.x, screen.width),
    y: axis2anchor(current.anchor.y, current.y, screen.height),
    size: {
      width: current.width,
      height: current.height
    },
    scale: current.scale
  };
  return position;
}

function anchor2axis(anchored: AnchoredAxis, range: number) : number {
  switch(anchored.anchor) {
    case AxisAnchorRelativeTo.CENTER: // relative to center
      return (range * 0.5) + anchored.px;
    case AxisAnchorRelativeTo.START: // relative to start
      return anchored.px;
    case AxisAnchorRelativeTo.END:
      return range - anchored.px;
  }
}

function anchored2position(anchored: AnchoredPosition, screen: Size) : Position {
  const position = {
    x: anchor2axis(anchored.x, screen.width),
    y: anchor2axis(anchored.y, screen.height),
    anchor: { x: anchored.x.anchor, y: anchored.y.anchor },
    width: anchored.size.width,
    height: anchored.size.height,
    scale: anchored.scale
  };
  return position;
}

function adjustAxis(anchor: number, position: number, prevRange: number, range: number) : number {
  if (anchor === AxisAnchorRelativeTo.END) return position + (range - prevRange);
  if (anchor === AxisAnchorRelativeTo.CENTER) return (range/2) - ((prevRange/2) - position);
  return position;
}

function adjustPosition(current: Position, previous: Size, screen: Size) : Position {
  const adjusted: Position = Object.assign({}, current);
  adjusted.x = adjustAxis(current.anchor.x, current.x, previous.width, screen.width);
  adjusted.y = adjustAxis(current.anchor.y, current.y, previous.height, screen.height);
  return adjusted;
}

function chooseAnchorForAxis(pos: number, extent: number, range: number) : AxisAnchorRelativeTo {
  if (pos < range * 0.25) return AxisAnchorRelativeTo.START;
  if (pos + extent >= range * 0.75) return AxisAnchorRelativeTo.END;
  return AxisAnchorRelativeTo.CENTER;
}

function anchorPosition(current: Position, screen: Size) : Position {
  const anchored: Position = Object.assign({}, current);
  anchored.anchor.x = chooseAnchorForAxis(anchored.x, anchored.width, screen.width);
  anchored.anchor.y = chooseAnchorForAxis(anchored.y, anchored.height, screen.height);
  return anchored;
}

function forceOnScreen(current: Position, screen: Size) : Position {
  // If the UI is scaled, it is being scaled around the center, so for example, a widget that
  // is 200 pixels wide, scaled to 0.5 and positioned at the edge of the screen, the x position
  // is actually -50px.  ie -((width/2)*scale), so we need to work out the margin amount based
  // on the scale amount.
  const xmargin: number = (current.width/2)*current.scale;
  const ymargin: number = (current.height/2)*current.scale;
  const pos: Position = Object.assign({}, current);
  if (pos.x < -xmargin) pos.x = -xmargin;
  if (pos.y < -ymargin) pos.y = -ymargin;
  if (pos.x + pos.width > screen.width + xmargin) pos.x = screen.width - pos.width + xmargin;
  if (pos.y + pos.height > screen.height + ymargin) pos.y = screen.height - pos.height + ymargin;
  if (pos.x < -xmargin) { pos.x = -xmargin; pos.width = screen.width + xmargin; }
  if (pos.y < -ymargin) { pos.y = -ymargin; pos.height = screen.height + ymargin; }
  return pos;
}

function getInitialState(): any {
  const storedState: LayoutState = loadState();
  if (storedState) {
    storedState.locked = initialState().locked;
    return storedState;
  }
  return loadState(clone(initialState()));
}

function loadState(state: LayoutState = JSON.parse(localStorage.getItem(localStorageKey)) as LayoutState) : LayoutState {
  if (state) {
    if ((state.version|0) >= MIN_STATE_VERSION_ANCHORED) {
      const screen: Size = { width: window.innerWidth, height: window.innerHeight };
      const defaultWidgets: any = initialState().widgets;
      const widgets: any = {};
      for (let key in defaultWidgets) {
        const widget: AnchoredPosition = state.widgets[key] as AnchoredPosition || defaultWidgets[key];
        if (widget) {
          widgets[key] = forceOnScreen(anchored2position(widget, screen), screen);
          DEBUG_ASSERT(widgets[key].width > 1, 'Widget width should be larger than one pixel');
          DEBUG_ASSERT(widgets[key].height > 1, 'Widget height should be larger than one pixel');
        }
      }
      state.widgets = widgets;
      return state;
    }
  }
}

function saveState(state: LayoutState) : LayoutState {
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
  return save;
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
  let screen: Size;
  let anchored: AnchoredPosition;
  let position: Position;

  switch(action.type) {
    case INITIALIZE:
    {
      outState = Object.assign({}, state, {
        lastScreenSize: action.size
      });
      break;
    }
    case RESET_HUD:
    {
      outState = Object.assign({}, loadState(clone(initialState())));
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
      screen = { width: window.innerWidth, height: window.innerHeight };
      position = anchorPosition(action.position, screen);
      Object.assign(widgets[action.widget], position);
      if (position.scale <= minScale) widgets[action.widget].scale = minScale;
      outState = Object.assign({}, state, {
        widgets: widgets
      });
      break;
    case ON_RESIZE:
      // need to scan wiget positions, and check if they still fit in the
      // new window size
      screen = { width: window.innerWidth, height: window.innerHeight };
      RUNTIME_ASSERT(screen.width >= 640 && screen.height >= 480, 'ignoring resize event for small window');
      widgets = {};
      for (let key in state.widgets) {
        position = state.widgets[key] as Position;
        widgets[key] = forceOnScreen(adjustPosition(position, state.lastScreenSize, screen), screen);
      }
      outState = Object.assign({}, state, {
        widgets: widgets,
        lastScreenSize: screen
      })
      return outState;      // don't need to save state
  }

  // save to local storage
  saveState(outState);

  return outState;
}
