/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Map } from 'immutable';
import { Module } from 'redux-typed-modules';
import { client, events, RUNTIME_ASSERT } from '@csegames/camelot-unchained';

import { cloneDeep } from 'lodash';
import { HUDDragOptions, LayoutMode } from '../../components/HUDDrag';

// layout items
import Chat from './layoutItems/Chat';
import MOTD from './layoutItems/MOTD';
import Warband from './layoutItems/Warband';
// import Respawn from './layoutItems/Respawn';
import Compass from './layoutItems/Compass';
import Crafting from './layoutItems/Crafting';
import EnemyTarget from './layoutItems/EnemyTarget';
import PlayerHealth from './layoutItems/PlayerHealth';
import FriendlyTarget from './layoutItems/FriendlyTarget';
import ErrorMessages from './layoutItems/ErrorMessages';
import PlotControl from './layoutItems/PlotControl';
import Progression from './layoutItems/Progression';
// import RefillAmmo from './layoutItems/RefillAmmo';
import Announcement from './layoutItems/Announcement';
import Building from './layoutItems/Building';
import ReleaseControl from './layoutItems/ReleaseControl';
import PlayerSiegeHealth from './layoutItems/PlayerSiegeHealth';
import EnemyTargetSiegeHealth from './layoutItems/EnemyTargetSiegeHealth';
import FriendlyTargetSiegeHealth from './layoutItems/FriendlyTargetSiegeHealth';
import GameMenu from './layoutItems/GameMenu';
import Settings from './layoutItems/Settings';
import GameInfo from './layoutItems/GameInfo';
import SkillQueue from './layoutItems/SkillQueue';

const localStorageKey = 'cse_hud_layout-state';
const FORCE_RESET_CODE = '0.7.8'; // if the local storage value for the reset code doesn't match this, then force a reset

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
  position: Position;
  dragOptions: Partial<HUDDragOptions>;
  component: React.ComponentClass<T>;
  props: T;
}

export interface LayoutState {
  reset: string;
  version: number;
  locked?: boolean;
  lastScreenSize?: Size;
  widgets: Map<string, Widget<any>>;
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
      'chat', cloneDeep(Chat),
    ],
    [
      'crafting', cloneDeep(Crafting),
    ],
    // [
    //   'hudNav', HUDNav
    // ],
    [
      'motd', cloneDeep(MOTD),
    ],
    [
      'compass', cloneDeep(Compass),
    ],
    // [
    //   'respawn', cloneDeep(Respawn),
    // ],
    [
      'warband', cloneDeep(Warband),
    ],
    [
      'enemyTarget', cloneDeep(EnemyTarget),
    ],
    [
      'playerHealth', cloneDeep(PlayerHealth),
    ],
    [
      'friendlyTarget', cloneDeep(FriendlyTarget),
    ],
    [
      'errorMessages', cloneDeep(ErrorMessages),
    ],
    // [
    //   'refillAmmo', cloneDeep(RefillAmmo),
    // ],
    [
      'plotControl', cloneDeep(PlotControl),
    ],
    [
      'progression', cloneDeep(Progression),
    ],
    [
      'announcement', cloneDeep(Announcement),
    ],
    [
      'building', cloneDeep(Building),
    ],
    [
      'releaseControl', cloneDeep(ReleaseControl),
    ],
    [
      'playerSiegeHealth', cloneDeep(PlayerSiegeHealth),
    ],
    [
      'enemySiegeHealth', cloneDeep(EnemyTargetSiegeHealth),
    ],
    [
      'friendlySiegeHealth', cloneDeep(FriendlyTargetSiegeHealth),
    ],
    [
      'gameMenu', cloneDeep(GameMenu),
    ],
    [
      'settings', cloneDeep(Settings),
    ],
    [
      'skillqueue', cloneDeep(SkillQueue),
    ],
    [
      'gameInfo', cloneDeep(GameInfo),
    ],
  ]);

  return {
    reset: FORCE_RESET_CODE,
    locked: true,
    version: CURRENT_STATE_VERSION,
    widgets,
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

        const widgets = Map<string, Widget<any>>().asMutable();
        defaultWidgets.forEach((value, key) => {
          const widget = state.widgets[key] || value;
          if (widget) {
            widgets.set(key, {
              position: forceOnScreen(widget.position, screen),
              dragOptions: value.dragOptions,
              component: value.component,
              props: value.props,
            });
            // DEBUG_ASSERT(widgets[key].width > 1, `Widget ${key} width (${widgets[key].width})
            // should be larger than one pixel`);
            // DEBUG_ASSERT(widgets[key].height > 1, `Widget ${key} height (${widgets[key].height})
            // should be larger than one pixel`);
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
    widgets: widgets.set(name, widget),
  };
  localStorage.setItem(localStorageKey, JSON.stringify(stateClone));
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
      screen,
    };
  },
  postReducer: (state) => {
    const screen: Size = { width: window.innerWidth, height: window.innerHeight };
    return {
      ...state,
      lastScreenSize: screen,
    };
  },
});

/////////////////////////////////
// Actions
/////////////////////////////////

// NO OP -- #TODO: do I really need this?
const init = module.createAction({
  type: 'layout/INITIALIZE',
  action: () => null,
  reducer: s => s,
});

// Async init - allows window onresize to dispatch actions
export function initialize() {
  return (dispatch: (action: any) => any) => {
    dispatch(init());
    window.onresize = () => {
      if (window.innerWidth >= 640 && window.innerHeight >= 480) {
        dispatch(resize());
      }
    };

    // hook up to event triggers
    events.on('hudnav--navigate', (name: string) => {
      switch (name) {
        case 'chat':
          return dispatch(toggleVisibility(name));
        case 'ui': return dispatch(toggleHUDLock(addEvent, removeEvent));
        case 'reset': return dispatch(resetHUD());
        default: return;
      }
    });

    const listener = (e: KeyboardEvent) => {
      if (e.which === 27) {
        dispatch(lockHUD(removeEvent));
      }
    };
    const addEvent = () => window.window.addEventListener('keydown', listener);
    const removeEvent = () => window.window.removeEventListener('keydown', listener);
  };
}

// Lock / Unlock HUD
export const lockHUD = module.createAction({
  type: 'layout/LOCK_HUD',
  action: (removeFunc: any) => {
    return {
      removeEvent: removeFunc,
    };
  },
  reducer: (s, a) => {
    a.removeEvent();
    if (typeof client.RequestInputOwnership === 'function') client.RequestInputOwnership();
    return {
      locked: true,
    };
  },
});

export const unlockHUD = module.createAction({
  type: 'layout/UNLOCK_HUD',
  action: () => null,
  reducer: (s, a) => {
    if (typeof client.ReleaseInputOwnership === 'function') client.ReleaseInputOwnership();
    return {
      locked: false,
    };
  },
});

export const toggleHUDLock = module.createAction({
  type: 'layout/TOGGLE_HUD_LOCK',
  action: (addFunc: any, removeFunc: any) => {
    return {
      addEvent: addFunc,
      removeEvent: removeFunc,
    };
  },
  reducer: (s, a) => {
    if (s.locked) {
      a.addEvent();
      if (typeof client.RequestInputOwnership === 'function') client.RequestInputOwnership();
    } else {
      a.removeEvent();
      if (typeof client.ReleaseInputOwnership === 'function') client.ReleaseInputOwnership();
    }
    return {
      locked: !s.locked,
    };
  },
});


// Resets hud to last default state
export const resetHUD = module.createAction({
  type: 'layout/RESET_HUD',
  action: () => {
    return {};
  },
  reducer: (s, a) => {
    localStorage.setItem(localStorageKey, null);
    return initialState();
  },
});


// Set the position of a widget
export const setPosition = module.createAction({
  type: 'layout/SET_POSITION',
  action: (a: { name: string, widget: Widget<any>, position: Position }) => a,
  reducer: (s, a) => {
    return {
      widgets: s.widgets.update(a.name, (v) => {
        if (typeof v === 'undefined') return v;
        v.position = a.position;
        saveState(s, v, a.name);
        return v;
      }),
    };
  },
});


// Handle window resize event, will readjust positions to fit on screen
export const resize = module.createAction({
  type: 'layout/ON_RESIZE',
  action: () => {
    // screen is set globally
    return {};
  },
  reducer: (s, a) => {
    RUNTIME_ASSERT(screen.width >= 640 && screen.height >= 480, 'ignoring resize event for small window');
    let onScreenWidgets = Map<string, Widget<any>>();
    s.widgets.forEach((value, key) => {
      onScreenWidgets = onScreenWidgets.set(key, {
        position: forceOnScreen(value.position, screen),
        dragOptions: value.dragOptions,
        component: value.component,
        props: value.props,
      });
    });
    return {
      widgets: onScreenWidgets,
    };
  },
});


// Configure the visibility on a widget.
export const setVisibility = module.createAction({
  type: 'layout/SET_VISIBILITY',
  action: (a: { name: string, visibility: boolean }) => a,
  reducer: (s, a) => {
    return {
      widgets: s.widgets.update(a.name, (v) => {
        if (typeof v === 'undefined') return v;
        v.position.visibility = a.visibility;
        saveState(s, v, a.name);
        return v;
      }),
    };
  },
});

export const toggleVisibility = module.createAction({
  type: 'layout/TOGGLE_VISIBILITY',
  action: (name: string) => {
    return {
      name,
    };
  },
  reducer: (s, a) => {
    return {
      widgets: s.widgets.update(a.name, (v) => {
        if (typeof v === 'undefined') return v;
        v.position.visibility = !v.position.visibility;
        return v;
      }),
    };
  },
});

export const resetHUDWidget = module.createAction({
  type: 'layout/RESET_HUD_WIDGET',
  action: (name: string) => {
    return {
      name,
    };
  },
  reducer: (s, a) => {
    const defaultWidgets = initialState().widgets;
    return {
      widgets: s.widgets.update(a.name, (v) => {
        if (typeof v === 'undefined') return v;
        v.position = defaultWidgets.get(a.name).position;
        saveState(s, v, a.name);
        return v;
      }),
    };
  },
});

export default module.createReducer();
