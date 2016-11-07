/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client, DEBUG_ASSERT, RUNTIME_ASSERT} from 'camelot-unchained';
import {merge, clone, addOrUpdate, remove, BaseAction, defaultAction, AsyncAction, ActionDefinitions, Dictionary, createReducer, removeWhere} from '../../lib/reduxUtils';

import {LayoutMode, Edge} from '../../components/HUDDrag';

const localStorageKey = 'cse_hud_layout-state';

const INITIALIZE = 'hud/layout/INITIALIZE';
const HUB_INITIALIZED = 'hud/layout/HUB_INITIALIZED';
const SAY_SOMETHING = 'hud/layout/SAY_SOMETHING';

const LOCK_HUD = 'hud/layout/LOCK_HUD';
const UNLOCK_HUD = 'hud/layout/UNLOCK_HUD';
const SET_POSITION = 'hud/layout/SET_POSITION';
const SAVE_POSITION = 'hud/layout/SAVE_POSITION';
const SET_VISIBILITY = 'hud/layout/SET_VISIBILITY';
const RESET_HUD = 'hud/layout/RESET_HUD';

const ON_RESIZE = 'hud/layout/ON_RESIZE';

const CURRENT_STATE_VERSION: number = 4;
const MIN_STATE_VERSION_ANCHORED: number = 3;
const FORCE_RESET_CODE = '0.2.3'; // if the local storage value for the reset code doesn't match this, then force a reset

enum AxisAnchorRelativeTo {
  START = -1,
  CENTER = 0,
  END = 1,
}

export interface LayoutAction extends BaseAction {
  widget?: string;
  position?: Position;
  size?: Size;
  visibility?: boolean;
  screen: Size;
}

export interface Anchor {
  x: AxisAnchorRelativeTo;
  y: AxisAnchorRelativeTo;
}

interface Size {
  width: number;
  height: number;
}
interface AnchoredAxis {
  anchor: any;
  offset: number;
}

interface Position {
  x: AnchoredAxis;
  y: AnchoredAxis;
  size: Size;
  scale: number;
  visibility: boolean;
  opacity: number;
  zOrder: number;
  layoutMode: LayoutMode;
}

const TOP_LEFT: Anchor = { x: AxisAnchorRelativeTo.START, y: AxisAnchorRelativeTo.START };
const BOTTOM_LEFT: Anchor = { x: AxisAnchorRelativeTo.START, y: AxisAnchorRelativeTo.END };
const TOP_RIGHT: Anchor = { x: AxisAnchorRelativeTo.END, y: AxisAnchorRelativeTo.START };
const BOTTOM_RIGHT: Anchor = { x: AxisAnchorRelativeTo.END, y: AxisAnchorRelativeTo.END };
const MIDDLE_OF_WINDOW: Anchor = { x: AxisAnchorRelativeTo.CENTER, y: AxisAnchorRelativeTo.CENTER };

export type WidgetPositions = Dictionary<Position>;

let hub: any = null;

// sync
export function lockHUD(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: LOCK_HUD,
    when: new Date(),
    screen: screen,
  }
}

export function unlockHUD(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: UNLOCK_HUD,
    when: new Date(),
    screen: screen,
  }
}

export function resetHUD(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: RESET_HUD,
    when: new Date(),
    screen: screen,
  };
}

export function setPosition(name: string, pos: Position): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: SET_POSITION,
    when: new Date(),
    widget: name,
    position: pos,
    screen: screen,
  }
}

export function savePosition(name: string, pos: Position): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: SAVE_POSITION,
    when: new Date(),
    widget: name,
    position: pos,
    screen: screen,
  }
}

export function setVisibility(name: string, vis: boolean): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: SET_VISIBILITY,
    when: new Date(),
    widget: name,
    visibility: vis,
    screen: screen,
  };
}

function init(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: INITIALIZE,
    when: new Date(),
    screen: screen,
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

export function resize(): LayoutAction {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  return {
    type: ON_RESIZE,
    when: new Date(),
    screen: screen,
  };
}

const minScale = 0.25;

export interface LayoutState {
  reset: string;
  version: number;
  locked?: boolean;
  lastScreenSize?: Size;
  widgets: Dictionary<Position>;
}

function initialState(): LayoutState {
  return {
    reset: FORCE_RESET_CODE,
    locked: true,
    widgets: {
      Chat:{x:{anchor:Edge.LEFT,offset:0},y:{anchor:Edge.BOTTOM,offset:50},size:{width:480,height:240},scale:1,opacity: 1,visibility:true,zOrder:0,layoutMode:LayoutMode.EDGESNAP},
      Compass:{x:{anchor:5,offset:-200},y:{anchor:Edge.TOP,offset:40},size:{width:400,height:45},scale:1,opacity: 1,visibility:true,zOrder:6,layoutMode:LayoutMode.GRID},
      EnemyTargetHealth:{x:{anchor:5,offset:0},y:{anchor:6,offset:0},size:{width:300,height:180},scale:0.6,opacity: 1,visibility:true,zOrder:2,layoutMode:LayoutMode.GRID},
      FriendlyTargetHealth:{x:{anchor:5,offset:0},y:{anchor:6,offset:150},size:{width:300,height:180},scale:0.6,opacity: 1,visibility:true,zOrder:3,layoutMode:LayoutMode.GRID},
      PlayerHealth:{x:{anchor:3,offset:0},y:{anchor:7,offset:0},size:{width:300,height:180},scale:0.6,opacity: 1,visibility:true,zOrder:1,layoutMode:LayoutMode.GRID},
      Respawn:{x:{anchor:5,offset:-100},y:{anchor:3,offset:0},size:{width:200,height:200},scale:1,opacity: 1,visibility:false,zOrder:7,layoutMode:LayoutMode.GRID},
      Warband:{x:{anchor:Edge.LEFT,offset:-40},y:{anchor:Edge.TOP,offset:-130},size:{width:200,height:700},scale:0.6,opacity: 1,visibility:true,zOrder:4,layoutMode:LayoutMode.EDGESNAP},
      Welcome:{x:{anchor:5,offset:-400},y:{anchor:5,offset:-400},size:{width:800,height:600},scale:1,opacity: 1,visibility:true,zOrder:5,layoutMode:LayoutMode.GRID},
    },
    version: MIN_STATE_VERSION_ANCHORED
  }
}

function axis2anchor(anchor: AxisAnchorRelativeTo, position: number, range: number) : AnchoredAxis {
  switch(anchor) {
    case AxisAnchorRelativeTo.START:
      return { anchor: anchor, offset: position };
    case AxisAnchorRelativeTo.END:
      return { anchor: anchor, offset: range - position };
  }
  return { anchor: anchor, offset: position - (range * 0.5) };
}

function anchor2axis(anchored: AnchoredAxis, range: number) : number {
  switch(anchored.anchor) {
    case AxisAnchorRelativeTo.CENTER: // relative to center
      return (range * 0.5) + anchored.offset;
    case AxisAnchorRelativeTo.START: // relative to start
      return anchored.offset;
    case AxisAnchorRelativeTo.END:
      return range - anchored.offset;
  }
}

function adjustAxis(anchor: number, position: number, prevRange: number, range: number) : number {
  if (anchor === AxisAnchorRelativeTo.END) return position + (range - prevRange);
  if (anchor === AxisAnchorRelativeTo.CENTER) return (range/2) - ((prevRange/2) - position);
  return position;
}

function chooseAnchorForAxis(pos: number, extent: number, range: number) : AxisAnchorRelativeTo {
  if (pos < range * 0.25) return AxisAnchorRelativeTo.START;
  if (pos + extent >= range * 0.75) return AxisAnchorRelativeTo.END;
  return AxisAnchorRelativeTo.CENTER;
}


function forceOnScreen(current: Position, screen: Size) : Position {
  // If the UI is scaled, it is being scaled around the center, so for example, a widget that
  // is 200 pixels wide, scaled to 0.5 and positioned at the edge of the screen, the x position
  // is actually -50px.  ie -((width/2)*scale), so we need to work out the margin amount based
  // on the scale amount.
  const xmargin: number = (current.size.width/2)*current.scale;
  const ymargin: number = (current.size.height/2)*current.scale;
  const pos: Position = clone(current);
  if (pos.x.offset < -xmargin) pos.x.offset = -xmargin;
  if (pos.y.offset < -ymargin) pos.y.offset = -ymargin;
  if (pos.x.offset + pos.size.width > screen.width + xmargin) pos.x.offset = screen.width - pos.size.width + xmargin;
  if (pos.y.offset + pos.size.height > screen.height + ymargin) pos.y.offset = screen.height - pos.size.height + ymargin;
  if (pos.x.offset < -xmargin) { pos.x.offset = -xmargin; pos.size.width = screen.width + xmargin; }
  if (pos.y.offset < -ymargin) { pos.y.offset = -ymargin; pos.size.height = screen.height + ymargin; }
  return pos;
}

function getInitialState(): any {
  const storedState: LayoutState = loadState();
  if (storedState) {
    if (typeof storedState.reset === 'undefined' || storedState.reset !== FORCE_RESET_CODE) return loadState(initialState());
    storedState.locked = initialState().locked;
    return storedState;
  }
  return loadState(initialState());
}

function loadStateFromStorage(): LayoutState {
  let state: string;
  try {
    state = localStorage.getItem(localStorageKey);
    return JSON.parse(state);
  } catch(e) {
    const error: Error = e;
    console.error('loadStateFromStorage: ' + error.message + ' state=' + state);
    return null;
  }
}

function loadState(state: LayoutState = loadStateFromStorage()) : LayoutState {
  if (state) {
    const reset = state.reset !== FORCE_RESET_CODE;
    if (!reset) {
      if ((state.version|0) >= MIN_STATE_VERSION_ANCHORED) {
        const screen: Size = { width: window.innerWidth, height: window.innerHeight };
        const defaultWidgets: any = initialState().widgets;
        const widgets: any = {};
        for (let key in defaultWidgets) {
          const widget = state.widgets[key] || defaultWidgets[key];
          if (widget) {
            widgets[key] = forceOnScreen(widget, screen);

            //DEBUG_ASSERT(widgets[key].width > 1, `Widget ${key} width (${widgets[key].width}) should be larger than one pixel`);
            //DEBUG_ASSERT(widgets[key].height > 1, `Widget ${key} height (${widgets[key].height}) should be larger than one pixel`);
          }
        }
        state.widgets = widgets;
        return state;
      }
    }
  }

  return null;
}

function saveState(state: LayoutState) : LayoutState {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const save: LayoutState = {
    reset: FORCE_RESET_CODE,
    version: CURRENT_STATE_VERSION,
    locked: state.locked,
    widgets: {}
  };
  for (let key in state.widgets) {
    save.widgets[key] = state.widgets[key];
  }
  localStorage.setItem(localStorageKey, JSON.stringify(save));
  return save;
}

const actionDefs: ActionDefinitions<LayoutState> = {};

actionDefs[LOCK_HUD] = (s, a) => {
  return merge(s, {locked: true});
}

actionDefs[UNLOCK_HUD] = (s, a) => {
  return merge(s, {locked: false});
}

actionDefs[INITIALIZE] = (s, a) => {
  const newState = merge(s, {lastScreenSize: a.size});
  return newState;
}

actionDefs[RESET_HUD] = (s, a) => {
  return saveState(merge(s, loadState(clone(initialState())), {lastScreenSize: screen}));
}

actionDefs[SET_POSITION] = (s: LayoutState, a: LayoutAction) => {
  let widgets = clone(s.widgets);
  widgets[a.widget] = a.position;

  return saveState(merge(s, {
    widgets: widgets,
    lastScreenSize: a.screen,
  }));
}

actionDefs[SAVE_POSITION] = (s: LayoutState, a: LayoutAction) => {
  let widgets = clone(s.widgets);
  let position = clone(a.position);
  if (position.scale < minScale) position.scale = minScale;
  widgets[a.widget] = merge(widgets[a.widget], position);


  return saveState(merge(s, {
    widgets: widgets,
    lastScreenSize: a.screen,
  }));
}

actionDefs[SET_VISIBILITY] = (s: LayoutState, a: LayoutAction) => {
  let widgets = clone(s.widgets);
  widgets[a.widget].visibility = a.visibility;
  return saveState(merge(s, {
    widgets: widgets,
    lastScreenSize: a.screen,
  }));
}

actionDefs[ON_RESIZE] = (s, a) => {
  // need to scan wiget positions, and check if they still fit in the
  // new window size
  RUNTIME_ASSERT(a.screen.width >= 640 && a.screen.height >= 480, 'ignoring resize event for small window');
  let widgets: Dictionary<Position> = {};
  for (let key in s.widgets) {
    const position = s.widgets[key] as Position;
    widgets[key] = forceOnScreen(position, screen);
  }
  return merge(s, {
    widgets: widgets,
    lastScreenSize: screen
  });
}

export default createReducer<LayoutState>(getInitialState(), actionDefs);
