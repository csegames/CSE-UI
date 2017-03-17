/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Map } from 'immutable';
import { Module } from 'redux-typed-modules';
import cu, { client, events, DEBUG_ASSERT, RUNTIME_ASSERT } from 'camelot-unchained';

import { HUDDragOptions } from '../../components/HUDDrag';
import { cloneDeep } from 'lodash';
import { LayoutMode, Edge } from '../../components/HUDDrag';

// layout items
import Chat from './layoutItems/Chat';
import HUDNav from './layoutItems/HUDNav';
import Welcome from './layoutItems/Welcome';
import Warband from './layoutItems/Warband';
import Respawn from './layoutItems/Respawn';
import Compass from './layoutItems/Compass';
import Crafting from './layoutItems/Crafting';
import EnemyTarget from './layoutItems/EnemyTarget';
import PlayerHealth from './layoutItems/PlayerHealth';
import FriendlyTarget from './layoutItems/FriendlyTarget';


const localStorageKey = 'cse_hud_layout-state';
const FORCE_RESET_CODE = '0.4.0'; // if the local storage value for the reset code doesn't match this, then force a reset

const CURRENT_STATE_VERSION: number = 6;
const MIN_STATE_VERSION_ANCHORED: number = 5;

enum AxisAnchorRelativeTo {
  START = -1,
  CENTER = 0,
  END = 1,
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

export interface Widget<T> {
  position: Position,
  dragOptions: Partial<HUDDragOptions>,
  component: React.ComponentClass<T>,
  props: T
}

export interface LayoutState {
  reset: string;
  version: number;
  locked?: boolean;
  lastScreenSize?: Size;
  widgets: Map<string, Widget<any>>;
}

/////////////////////////////////
// Helper Methods
/////////////////////////////////

function axis2anchor(anchor: AxisAnchorRelativeTo, position: number, range: number): AnchoredAxis {
  switch (anchor) {
    case AxisAnchorRelativeTo.START:
      return { anchor: anchor, offset: position };
    case AxisAnchorRelativeTo.END:
      return { anchor: anchor, offset: range - position };
  }
  return { anchor: anchor, offset: position - (range * 0.5) };
}

function anchor2axis(anchored: AnchoredAxis, range: number): number {
  switch (anchored.anchor) {
    case AxisAnchorRelativeTo.CENTER: // relative to center
      return (range * 0.5) + anchored.offset;
    case AxisAnchorRelativeTo.START: // relative to start
      return anchored.offset;
    case AxisAnchorRelativeTo.END:
      return range - anchored.offset;
  }
}

function adjustAxis(anchor: number, position: number, prevRange: number, range: number): number {
  if (anchor === AxisAnchorRelativeTo.END) return position + (range - prevRange);
  if (anchor === AxisAnchorRelativeTo.CENTER) return (range / 2) - ((prevRange / 2) - position);
  return position;
}

function chooseAnchorForAxis(pos: number, extent: number, range: number): AxisAnchorRelativeTo {
  if (pos < range * 0.25) return AxisAnchorRelativeTo.START;
  if (pos + extent >= range * 0.75) return AxisAnchorRelativeTo.END;
  return AxisAnchorRelativeTo.CENTER;
}


function forceOnScreen(current: Readonly<Position>, screen: Readonly<Size>): Position {
  // If the UI is scaled, it is being scaled around the center, so for example, a widget that
  // is 200 pixels wide, scaled to 0.5 and positioned at the edge of the screen, the x position
  // is actually -50px.  ie -((width/2)*scale), so we need to work out the margin amount based
  // on the scale amount.
  const xmargin: number = (current.size.width / 2) * current.scale;
  const ymargin: number = (current.size.height / 2) * current.scale;
  const pos = current;
  if (pos.x.offset < -xmargin) pos.x.offset = -xmargin;
  if (pos.y.offset < -ymargin) pos.y.offset = -ymargin;
  if (pos.x.offset + pos.size.width > screen.width + xmargin) pos.x.offset = screen.width - pos.size.width + xmargin;
  if (pos.y.offset + pos.size.height > screen.height + ymargin) pos.y.offset = screen.height - pos.size.height + ymargin;
  if (pos.x.offset < -xmargin) { pos.x.offset = -xmargin; pos.size.width = screen.width + xmargin; }
  if (pos.y.offset < -ymargin) { pos.y.offset = -ymargin; pos.size.height = screen.height + ymargin; }
  return pos;
}



function initialState(): LayoutState {

  const widgets = Map<string, Widget<any>>([
    [
      'chat', cloneDeep(Chat)
    ],
    [
      'crafting', cloneDeep(Crafting)
    ],
    // [
    //   'hudNav', HUDNav
    // ],
    [
      'welcome', cloneDeep(Welcome)
    ],
    [
      'compass', cloneDeep(Compass)
    ],
    [
      'respawn', cloneDeep(Respawn)
    ],
    [
      'warband', cloneDeep(Warband)
    ],
    [
      'enemyTarget', cloneDeep(EnemyTarget)
    ],
    [
      'playerHealth', cloneDeep(PlayerHealth)
    ],
    [
      'friendlyTarget', cloneDeep(FriendlyTarget)
    ],
  ]);

  return {
    reset: FORCE_RESET_CODE,
    locked: true,
    version: CURRENT_STATE_VERSION,
    widgets
  };
}

function getInitialState() {
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
  } catch (e) {
    const error: Error = e;
    console.error('loadStateFromStorage: ' + error.message + ' state=' + state);
    return null;
  }
}

function loadState(state: LayoutState = loadStateFromStorage()): LayoutState {
  // loading state
  if (state) {
    const reset = state.reset !== FORCE_RESET_CODE;
    if (!reset) {
      if ((state.version | 0) >= MIN_STATE_VERSION_ANCHORED) {
        const screen: Size = { width: window.innerWidth, height: window.innerHeight };
        const defaultWidgets = initialState().widgets;

        let widgets = Map<string, Widget<any>>().asMutable();
        defaultWidgets.forEach((value, key) => {
          const widget = state.widgets[key] || value;
          if (widget) {
            widgets.set(key, {
              position: forceOnScreen(widget.position, screen),
              dragOptions: value.dragOptions,
              component: value.component,
              props: value.props
            });
            //DEBUG_ASSERT(widgets[key].width > 1, `Widget ${key} width (${widgets[key].width}) should be larger than one pixel`);
            //DEBUG_ASSERT(widgets[key].height > 1, `Widget ${key} height (${widgets[key].height}) should be larger than one pixel`);
          }
        });
        state.widgets = widgets.asImmutable();
        return state;
      }
    }
  }
  return null;
}

function saveState(state: LayoutState, widget: Widget<any>, name: string) {
  const widgets = state.widgets;
  const stateClone = {
    ...state,
    widgets: widgets.set(name, widget)
  }
  localStorage.setItem(localStorageKey, JSON.stringify(stateClone))
  console.log(localStorage.getItem(localStorageKey));
}


/////////////////////////////////
// Module
/////////////////////////////////

const module = new Module({
  initialState: getInitialState(),
  actionExtraData: () => {
    const screen: Size = { width: window.innerWidth, height: window.innerHeight };
    return {
      when: new Date(),
      screen: screen
    };
  },
  postReducer: (state) => {
    const screen: Size = { width: window.innerWidth, height: window.innerHeight };
    return {
      ...state,
      lastScreenSize: screen
    }
  }
});

/////////////////////////////////
// Actions
/////////////////////////////////

// NO OP -- #TODO: do I really need this?
const init = module.createAction({
  type: 'layout/INITIALIZE',
  action: () => null,
  reducer: s => s
});

// Async init - allows window onresize to dispatch actions
export function initialize() {
  return (dispatch: (action: any) => any) => {
    dispatch(init());
    window.onresize = () => {
      if (window.innerWidth >= 640 && window.innerHeight >= 480) {
        //dispatch(resize());
      }
    };

    // hook up to event triggers
    events.on('hudnav--navigate', (name: string) => {
      switch (name) {
        case 'chat':
        case 'crafting':
          return dispatch(toggleVisibility(name));
        case 'ui': return dispatch(toggleHUDLock());
        case 'reset': return dispatch(resetHUD());
        default: return;
      }
    });

    window.window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.which === 27) {
        dispatch(lockHUD());
      }
    });
  }
}

// Lock / Unlock HUD
export const lockHUD = module.createAction({
  type: 'layout/LOCK_HUD',
  action: () => null,
  reducer: function (s, a) {
    if (typeof client.RequestInputOwnership === 'function') client.RequestInputOwnership();
    return {
      locked: true
    };
  }
});

export const unlockHUD = module.createAction({
  type: 'layout/UNLOCK_HUD',
  action: () => null,
  reducer: (s, a) => {
    if (typeof client.ReleaseInputOwnership === 'function') client.ReleaseInputOwnership();
    return {
      locked: false
    };
  }
});

export const toggleHUDLock = module.createAction({
  type: 'layout/TOGGLE_HUD_LOCK',
  action: () => null,
  reducer: function (s, a) {
    if (s.locked) {
      if (typeof client.RequestInputOwnership === 'function') client.RequestInputOwnership();
    } else {
      if (typeof client.ReleaseInputOwnership === 'function') client.ReleaseInputOwnership();
    }
    return {
      locked: !s.locked
    };
  }
});


// Resets hud to last default state
export const resetHUD = module.createAction({
  type: 'layout/RESET_HUD',
  action: () => {
    return {};
  },
  reducer: (s, a) => initialState()
});


// Set the position of a widget
export const setPosition = module.createAction({
  type: 'layout/SET_POSITION',
  action: (a: { name: string, widget: Widget<any>, position: Position }) => a,
  reducer: (s, a) => {
    // Save the position into local storage everytime position is changed
    const widget = { ...a.widget, position: a.position };
    saveState(s, widget, a.name);

    return {
      widgets: s.widgets.update(a.name, v => {
        if (typeof v === 'undefined') return v;
        v.position = a.position;
        return v;
      })
    };
  }
});


// Handle window resize event, will readjust positions to fit on screen
export const resize = module.createAction({
  type: 'layout/ON_RESIZE',
  action: () => {
    // screen is set globally
    return {};
  },
  reducer: (s, a) => {
    RUNTIME_ASSERT(a.screen.width >= 640 && a.screen.height >= 480, 'ignoring resize event for small window');
    const onScreenWidgets = Map<string, Widget<any>>();
    s.widgets.forEach((value, key) => {
      onScreenWidgets.set(key, {
        position: forceOnScreen(value.position, a.screen),
        dragOptions: value.dragOptions,
        component: value.component,
        props: value.props
      });
    });
    return {
      widgets: onScreenWidgets
    };
  }
});


// Configure the visibility on a widget.
export const setVisibility = module.createAction({
  type: 'layout/SET_VISIBILITY',
  action: (a: { name: string, visibility: boolean }) => a,
  reducer: (s, a) => {
    return {
      widgets: s.widgets.update(a.name, v => {
        if (typeof v === 'undefined') return v;
        v.position.visibility = a.visibility;
        return v;
      })
    };
  }
});

export const toggleVisibility = module.createAction({
  type: 'layout/TOGGLE_VISIBILITY',
  action: (name: string) => {
    return {
      name: name,
    };
  },
  reducer: (s, a) => {
    return {
      widgets: s.widgets.update(a.name, v => {
        if (typeof v === 'undefined') return v;
        v.position.visibility = !v.position.visibility;
        return v;
      })
    };
  }
});

export default module.createReducer();
