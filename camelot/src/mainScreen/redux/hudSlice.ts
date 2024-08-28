/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { InitTopic } from './initializationSlice';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

export enum HUDLayer {
  Bottom = 0,
  HUD = 1000,
  Menus = 2000,
  Top = 3000
}

interface ToggleMenuWidgetParams {
  widgetId: string;
  escapableId?: string;
}

interface HUDEditorState {
  selectedWidgetId: string;
  selectedWidgetBounds: DOMRect;
}

export const defaultWidgetState: HUDWidgetState = {
  visible: true,
  initialized: false,
  xAnchor: HUDHorizontalAnchor.Left,
  yAnchor: HUDVerticalAnchor.Top,
  xOffset: 0,
  yOffset: 0,
  opacity: 1,
  scale: 1
};

export interface HUDWidget {
  registration: HUDWidgetRegistration | null;
  state: HUDWidgetState;
}

/** This data only exists at runtime. */
export interface HUDWidgetRegistration {
  name: string;
  defaults: HUDWidgetState;
  layer: HUDLayer;
  layerOffset?: number;
  initTopics?: InitTopic[];
  render: () => React.ReactNode;
}

export interface EscapableParams {
  id: string;
  onEscape: (dispatch: Dispatch) => void;
}

interface HUDState {
  showMockData: boolean;
  widgets: Dictionary<HUDWidget>;
  escapables: EscapableParams[];
  editor: HUDEditorState;
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
  mouseX: number;
  mouseY: number;
  isBuildingModeActive: boolean;
  isBindingKey: boolean;
  activeMenuIds: string[];
  exitingMenuIds: string[];
}

function buildDefaultHUDState() {
  const DefaultHUDState: HUDState = {
    showMockData: false,
    widgets: {},
    escapables: [],
    editor: {
      selectedWidgetId: null,
      selectedWidgetBounds: null
    },
    hudWidth: 0,
    hudHeight: 0,
    vminPx: 1,
    mouseX: 0,
    mouseY: 0,
    isBuildingModeActive: false,
    isBindingKey: false,
    activeMenuIds: [],
    exitingMenuIds: []
  };

  return DefaultHUDState;
}

export const hudSlice = createSlice({
  name: 'hud',
  initialState: buildDefaultHUDState(),
  reducers: {
    addOrUpdateEscapable: (state: HUDState, action: PayloadAction<EscapableParams>) => {
      // If the item already existed, remove it so we can put it on the top.
      state.escapables = state.escapables.filter((escapable) => {
        return escapable.id !== action.payload.id;
      });
      state.escapables.push(action.payload);
    },
    removeEscapable: (state: HUDState, action: PayloadAction<string>) => {
      state.escapables = state.escapables.filter((escapable) => {
        return escapable.id !== action.payload;
      });
    },
    registerWidget: (state: HUDState, action: PayloadAction<HUDWidgetRegistration>) => {
      if (!state.widgets[action.payload.name]) {
        state.widgets[action.payload.name] = {
          registration: action.payload,
          state: {
            ...defaultWidgetState,
            ...action.payload.defaults
          }
        };
      } else {
        state.widgets[action.payload.name].registration = action.payload;
      }
    },
    unregisterWidget: (state: HUDState, action: PayloadAction<string>) => {
      delete state.widgets[action.payload];
    },
    resetWidget: (state: HUDState, action: PayloadAction<string>) => {
      state.widgets[action.payload].state = {
        ...defaultWidgetState,
        ...state.widgets[action.payload].registration.defaults
      };
    },
    resetAllWidgets: (state: HUDState) => {
      Object.entries(state.widgets).forEach(([widgetID, widget]) => {
        state.widgets[widgetID].state = {
          ...defaultWidgetState,
          ...widget.registration.defaults
        };
      });
    },
    setSelectedWidget: (state: HUDState, action: PayloadAction<string>) => {
      const widgetID = action.payload;
      state.editor.selectedWidgetId = widgetID;
    },
    setSelectedWidgetBounds: (state: HUDState, action: PayloadAction<DOMRect>) => {
      state.editor.selectedWidgetBounds = action.payload;
    },
    setShowMockData: (state: HUDState, action: PayloadAction<boolean>) => {
      state.showMockData = action.payload;
    },
    startIsBindingKey: (state: HUDState) => {
      state.isBindingKey = true;
    },
    endIsBindingKey: (state: HUDState) => {
      state.isBindingKey = false;
    },
    updateHUDSize: (state: HUDState, action: PayloadAction<[number, number]>) => {
      const [width, height] = action.payload;
      if (state.hudWidth !== width || state.hudHeight !== height) {
        state.hudWidth = width;
        state.hudHeight = height;
        state.vminPx = Math.min(width, height) / 100;
      }
    },
    updateMousePosition: (state: HUDState, action: PayloadAction<[number, number]>) => {
      const [x, y] = action.payload;
      if (state.mouseX !== x) {
        state.mouseX = x;
      }
      if (state.mouseY !== y) {
        state.mouseY = y;
      }
    },
    updateWidgetStates: (state: HUDState, action: PayloadAction<Dictionary<HUDWidgetState>>) => {
      Object.entries(action.payload).forEach(([widgetID, widgetState]) => {
        if (!state.widgets[widgetID]) {
          state.widgets[widgetID] = {
            registration: null,
            state: widgetState
          };
        } else {
          state.widgets[widgetID].state = {
            ...state.widgets[widgetID].state,
            ...widgetState
          };
        }
      });
    },
    toggleMenuWidget: (state: HUDState, action: PayloadAction<ToggleMenuWidgetParams>) => {
      // If there is no menu widget with this id, do nothing.
      if (state.widgets[action.payload.widgetId].registration.layer !== HUDLayer.Menus) {
        console.warn(`Attempted to toggle non-menu widget "${action.payload.widgetId}" via toggleMenuWidget()`);
        return;
      }
      // If the menu is already shown...
      const currentIndex = state.activeMenuIds.findIndex((id) => {
        return id === action.payload.widgetId;
      });
      if (currentIndex === -1) {
        // If it's not shown yet, push it.
        state.activeMenuIds.push(action.payload.widgetId);
      } else {
        if (currentIndex === state.activeMenuIds.length - 1) {
          // If it's already at the top, close it.
          if (!state.exitingMenuIds.includes(action.payload.widgetId)) {
            state.exitingMenuIds.push(action.payload.widgetId);
          }
        } else {
          // If it's open but not on top, move it to the top.
          state.activeMenuIds.splice(currentIndex, 1); // Remove.
          state.activeMenuIds.push(action.payload.widgetId); // Re-add.
          // Move its Escapable as well.
          if (action.payload.escapableId) {
            const escapable = state.escapables.find((escapable) => {
              return escapable.id === action.payload.escapableId;
            });
            if (escapable) {
              state.escapables = state.escapables.filter((esc) => {
                return esc.id !== action.payload.escapableId;
              });
              state.escapables.push(escapable);
            } else {
              console.warn(`Did not find expected Escapable with id "${action.payload.escapableId}"!`);
            }
          }
        }
      }
    },
    toggleBuildingMode: (state: HUDState) => {
      state.isBuildingModeActive = !state.isBuildingModeActive;
    },
    hideMenuWidget: (state: HUDState, action: PayloadAction<string>) => {
      state.activeMenuIds = state.activeMenuIds.filter((id) => {
        return id !== action.payload;
      });
    },
    addMenuWidgetExiting: (state: HUDState, action: PayloadAction<string>) => {
      if (state.activeMenuIds.includes(action.payload) && !state.exitingMenuIds.includes(action.payload)) {
        state.exitingMenuIds.push(action.payload);
      }
    },
    removeMenuWidgetExiting: (state: HUDState, action: PayloadAction<string>) => {
      state.exitingMenuIds = state.exitingMenuIds.filter((id) => {
        return id !== action.payload;
      });
    },
    initializeWidget: (state: HUDState, action: PayloadAction<string>) => {
      state.widgets[action.payload].state.initialized = true;
    }
  }
});

export const {
  addOrUpdateEscapable,
  removeEscapable,
  registerWidget,
  unregisterWidget,
  resetWidget,
  resetAllWidgets,
  setSelectedWidget,
  setSelectedWidgetBounds,
  setShowMockData,
  startIsBindingKey,
  endIsBindingKey,
  updateHUDSize,
  updateMousePosition,
  updateWidgetStates,
  toggleMenuWidget,
  toggleBuildingMode,
  hideMenuWidget,
  addMenuWidgetExiting,
  removeMenuWidgetExiting,
  initializeWidget
} = hudSlice.actions;
