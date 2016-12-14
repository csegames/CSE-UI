/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Map } from 'immutable';
import { Module } from 'redux-typed-modules';
import * as React from 'react';
import cu, { client, DEBUG_ASSERT, RUNTIME_ASSERT } from 'camelot-unchained';

import { HUDDragOptions } from '../../components/HUDDrag';

// Components
import Chat from 'cu-xmpp-chat';
import Compass from '../../widgets/Compass';
import Crafting from '../../widgets/Crafting';
import EnemyTargetHealth from '../../widgets/TargetHealth';
import FriendlyTargetHealth from '../../widgets/FriendlyTargetHealth';
import PlayerHealth from '../../widgets/PlayerHealth';
import Respawn from '../../components/Respawn';
import Warband from '../../widgets/Warband';
import Welcome from '../../widgets/Welcome';

import { LayoutMode, Edge } from '../../components/HUDDrag';

const localStorageKey = 'cse_hud_layout-state';
const FORCE_RESET_CODE = '0.3.0'; // if the local storage value for the reset code doesn't match this, then force a reset

const CURRENT_STATE_VERSION: number = 5;
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

export enum WidgetTypes {
  CHAT,
  RESPAWN,
  COMPASS,
  ENEMYTARGET,
  FRIENDLYTARGET,
  PLAYERHEALTH,
  WARBAND,
  WELCOME,
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
      WidgetTypes[WidgetTypes.CHAT], {
        position: {
          x: {
            anchor: Edge.LEFT,
            offset: 0
          },
          y: {
            anchor: Edge.BOTTOM,
            offset: 50
          },
          size: {
            width: 480,
            height: 240
          },
          scale: 1,
          opacity: 1,
          visibility: true,
          zOrder: 0,
          layoutMode: LayoutMode.EDGESNAP
        },
        dragOptions: {},
        component: Chat,
        props: {
          loginToken: client.loginToken
        }
      }
    ],
    [
      WidgetTypes[WidgetTypes.COMPASS], {
        position: {
          x: {
            anchor: 5,
            offset: -200
          },
          y: {
            anchor: Edge.TOP,
            offset: 40
          },
          size: {
            width: 400,
            height: 45
          },
          scale: 1,
          opacity: 1,
          visibility: true,
          zOrder: 6,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true
        },
        component: Compass,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.ENEMYTARGET], {
        position: {
          x: {
            anchor: 5,
            offset: 0
          },
          y: {
            anchor: 6,
            offset: 0
          },
          size: {
            width: 300,
            height: 180
          },
          scale: 0.6,
          opacity: 1,
          visibility: true,
          zOrder: 2,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true,
        },
        component: EnemyTargetHealth,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.FRIENDLYTARGET], {
        position: {
          x: {
            anchor: 5,
            offset: 0
          },
          y: {
            anchor: 6,
            offset: 150
          },
          size: {
            width: 300,
            height: 180
          },
          scale: 0.6,
          opacity: 1,
          visibility: true,
          zOrder: 3,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true,
        },
        component: FriendlyTargetHealth,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.PLAYERHEALTH], {
        position: {
          x: {
            anchor: 3,
            offset: 0
          },
          y: {
            anchor: 7,
            offset: 0
          },
          size: {
            width: 300,
            height: 180
          },
          scale: 0.6,
          opacity: 1,
          visibility: true,
          zOrder: 1,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true,
        },
        component: PlayerHealth,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.RESPAWN], {
        position: {
          x: {
            anchor: 5,
            offset: -100
          },
          y: {
            anchor: 3,
            offset: 0
          },
          size: {
            width: 200,
            height: 200
          },
          scale: 1,
          opacity: 1,
          visibility: false,
          zOrder: 7,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {},
        component: Respawn,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.WARBAND], {
        position: {
          x: {
            anchor: Edge.LEFT,
            offset: -40
          },
          y: {
            anchor: Edge.TOP,
            offset: -130
          },
          size: {
            width: 200,
            height: 700
          },
          scale: 0.6,
          opacity: 1,
          visibility: true,
          zOrder: 4,
          layoutMode: LayoutMode.EDGESNAP
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true,
        },
        component: Warband,
        props: {}
      }
    ],
    [
      WidgetTypes[WidgetTypes.WELCOME], {
        position: {
          x: {
            anchor: 5,
            offset: -400
          },
          y: {
            anchor: 5,
            offset: -400
          },
          size: {
            width: 800,
            height: 600
          },
          scale: 1,
          opacity: 1,
          visibility: true,
          zOrder: 5,
          layoutMode: LayoutMode.GRID
        },
        dragOptions: {
          lockHeight: true,
          lockWidth: true,
        },
        component: Welcome,
        props: {}
      }
    ],
  ]);

  return {
    reset: FORCE_RESET_CODE,
    locked: true,
    version: CURRENT_STATE_VERSION,
    widgets: widgets,
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
          const widget = state.widgets.get(key) || value;
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

function saveState(state: LayoutState) {
  const screen: Size = { width: window.innerWidth, height: window.innerHeight };
  const save = {
    reset: FORCE_RESET_CODE,
    version: CURRENT_STATE_VERSION,
    locked: state.locked,
    widgets: state.widgets.toMap
  };
  localStorage.setItem(localStorageKey, JSON.stringify(save));
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
        dispatch(resize());
      }
    };
  }
}


// Lock / Unlock HUD
export const lockHUD = module.createAction({
  type: 'layout/LOCK_HUD',
  action: () => null,
  reducer: function (s, a) {
    return {
      locked: true
    };
  }
});

export const unlockHUD = module.createAction({
  type: 'layout/UNLOCK_HUD',
  action: () => null,
  reducer: (s, a) => {
    return {
      locked: false
    };
  }
})


// Resets hud to last default state
export const resetHUD = module.createAction({
  type: 'layout/RESET_HUD',
  action: () => null,
  reducer: (s, a) => initialState()
});


// Set the position of a widget
export const setPosition = module.createAction({
  type: 'layout/SET_POSITION',
  action: (a: { name: string, position: Position }) => a,
  reducer: (s, a) => {
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




export default module.createReducer();
