/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { LoadingTopic } from './loadingSlice';
import {
  GroupPOIType,
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { SimpleRect } from './dragAndDropSlice';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import {
  MAX_UI_SCALE,
  MIN_UI_SCALE,
  NameplateStyle
} from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';

export enum HUDLayer {
  Bottom = 0,
  HUD = 1000,
  Menus = 2000,
  Top = 3000
}

interface HUDEditorState {
  selectedWidgetID: string | null;
  selectedWidgetBounds: SimpleRect | null;
  // When a widget-list group is selected, every member becomes simultaneously visible and movable
  // in the HUD so the user can arrange them relative to one another.
  selectedGroupKey: string | null;
  selectedGroupMemberIDs: string[];
  // Whether dragged widgets snap to align with other widgets / the HUD.
  snapEnabled: boolean;
  // Whether the center-line guides are shown on the selected widget while editing.
  guidesEnabled: boolean;
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
  // We don't set a value for `resizable`, because the default is to not be resizable.
};

export interface HUDWidget {
  registration: HUDWidgetRegistration | null;
  state: HUDWidgetState;
}

/** This data only exists at runtime. */
export interface HUDWidgetRegistration {
  id: string;
  nameStringID: string;
  nameStringTokens?: Record<string, string>;
  defaults: HUDWidgetState;
  layer: HUDLayer;
  // Conditional widgets must be explicitly toggled via ToggleConditionalWidget().
  isConditional?: boolean;
  // Widget identifier used by the client's widget.show/hide/toggle events.
  // Must match the strings the client in UIInputHandler.cpp.
  nativeWidgetID?: string;
  layerOffset?: number;
  initTopics?: LoadingTopic[];
  requiresGameDefsLoaded?: boolean;
  render: (isDragCopy: boolean) => React.ReactNode;
}

export interface EscapableParams {
  id: string;
  onEscape: (dispatch: Dispatch) => void;
}

// Shared through Redux so the widget's drag copy shows the same map as the original
// (the drag system mounts a fresh instance, which cannot see the original's component state).
export interface WorldMapSelection {
  regionID: string;
  mapID: string;
  isWorldView: boolean;
}

interface HUDState {
  showMockData: boolean;
  widgets: Record<string, HUDWidget>;
  escapables: EscapableParams[];
  editor: HUDEditorState;
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
  isBuildingModeActive: boolean;
  isBindingKey: boolean;
  activeConditionalWidgetIDs: string[];
  exitingConditionalWidgetIDs: string[];
  isMouseUpNeeded: boolean;
  mouseUpNeededReasons: string[];
  isEditingHUD: boolean;
  // Maps url to requestorIDs.
  imageURLsToCache: Record<string, string[]>;
  uiFactionID: string;
  poisToHide: MapDataType[];
  groupPOIsToHide: GroupPOIType[];
  nameplateStyle: NameplateStyle;
  uiScale: number;
  worldMapSelection: WorldMapSelection;
}

function buildDefaultHUDState() {
  const DefaultHUDState: HUDState = {
    showMockData: false,
    widgets: {},
    escapables: [],
    editor: {
      selectedWidgetID: null,
      selectedWidgetBounds: null,
      selectedGroupKey: null,
      selectedGroupMemberIDs: [],
      snapEnabled: true,
      guidesEnabled: true
    },
    hudWidth: 0,
    hudHeight: 0,
    vminPx: 1,
    isBuildingModeActive: false,
    isBindingKey: false,
    activeConditionalWidgetIDs: [],
    exitingConditionalWidgetIDs: [],
    isMouseUpNeeded: false,
    mouseUpNeededReasons: [],
    isEditingHUD: false,
    imageURLsToCache: {},
    uiFactionID: Faction[Faction.Arthurian],
    poisToHide: [],
    groupPOIsToHide: [],
    nameplateStyle: 'fancy',
    uiScale: 1,
    worldMapSelection: { regionID: '', mapID: '', isWorldView: false }
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
      if (action.payload.nativeWidgetID) {
        const duplicate = Object.values(state.widgets).find(
          (widget) =>
            widget.registration &&
            widget.registration.id !== action.payload.id &&
            widget.registration.nativeWidgetID === action.payload.nativeWidgetID
        );
        if (duplicate) {
          console.warn(
            `Widgets '${duplicate.registration.id}' and '${action.payload.id}' duplicate nativeWidgetID ` +
              `'${action.payload.nativeWidgetID}'. Client events will only affect one of them.`
          );
        }
      }
      if (!state.widgets[action.payload.id]) {
        state.widgets[action.payload.id] = {
          registration: action.payload,
          state: {
            ...defaultWidgetState,
            ...action.payload.defaults
          }
        };
      } else {
        state.widgets[action.payload.id].registration = action.payload;
      }
    },
    unregisterWidget: (state: HUDState, action: PayloadAction<string>) => {
      delete state.widgets[action.payload];
    },
    resetWidget: (state: HUDState, action: PayloadAction<string>) => {
      state.widgets[action.payload].state = {
        ...defaultWidgetState,
        ...(state.widgets[action.payload]?.registration?.defaults ?? {})
      };
    },
    resetAllWidgets: (state: HUDState) => {
      Object.entries(state.widgets).forEach(([widgetID, widget]) => {
        state.widgets[widgetID].state = {
          ...defaultWidgetState,
          ...(widget.registration?.defaults ?? {})
        };
      });
    },
    setSelectedWidget: (state: HUDState, action: PayloadAction<string>) => {
      const widgetID = action.payload;
      state.editor.selectedWidgetID = widgetID;
      // Selecting a widget that isn't part of the active group clears the group selection. Selecting
      // one of the group's own members keeps the group active so the others stay visible/movable.
      if (!state.editor.selectedGroupMemberIDs.includes(widgetID)) {
        state.editor.selectedGroupKey = null;
        state.editor.selectedGroupMemberIDs = [];
      }
    },
    setSelectedWidgetGroup: (state: HUDState, action: PayloadAction<{ groupKey: string; memberIDs: string[] }>) => {
      state.editor.selectedGroupKey = action.payload.groupKey;
      state.editor.selectedGroupMemberIDs = action.payload.memberIDs;
      // A group selection supersedes any single-widget selection.
      state.editor.selectedWidgetID = null;
      state.editor.selectedWidgetBounds = null;
    },
    setSelectedWidgetBounds: (state: HUDState, action: PayloadAction<SimpleRect>) => {
      state.editor.selectedWidgetBounds = action.payload;
    },
    setSnapEnabled: (state: HUDState, action: PayloadAction<boolean>) => {
      state.editor.snapEnabled = action.payload;
    },
    setGuidesEnabled: (state: HUDState, action: PayloadAction<boolean>) => {
      state.editor.guidesEnabled = action.payload;
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
    updateWidgetStates: (state: HUDState, action: PayloadAction<Record<string, HUDWidgetState>>) => {
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
    toggleConditionalWidget: (state: HUDState, action: PayloadAction<string>) => {
      // If there is no widget with this id, do nothing.
      if (!state.widgets[action.payload]) {
        console.warn(
          `Attempted to toggle widget "${action.payload}" via toggleConditionalWidget(), but no such widget is currently registered.`
        );
        return;
      }
      // If the widget exists but isn't conditional, do nothing.
      if (!state.widgets[action.payload]!.registration?.isConditional) {
        console.warn(`Attempted to toggle non-conditional widget "${action.payload}" via toggleConditionalWidget()`);
        return;
      }
      // If the menu is already shown...
      const currentIndex = state.activeConditionalWidgetIDs.findIndex((id) => {
        return id === action.payload;
      });
      if (currentIndex === -1) {
        // If it's not shown yet, push it.
        state.activeConditionalWidgetIDs.push(action.payload);
      } else {
        if (currentIndex === state.activeConditionalWidgetIDs.length - 1) {
          // If it's already at the top, close it.
          if (!state.exitingConditionalWidgetIDs.includes(action.payload)) {
            state.exitingConditionalWidgetIDs.push(action.payload);
          }
        } else {
          // If it's open but not on top, move it to the top.
          state.activeConditionalWidgetIDs.splice(currentIndex, 1); // Remove.
          state.activeConditionalWidgetIDs.push(action.payload); // Re-add.
          // Move its Escapable as well.
          if (action.payload) {
            const escapable = state.escapables.find((escapable) => {
              return escapable.id === action.payload;
            });
            if (escapable) {
              state.escapables = state.escapables.filter((esc) => {
                return esc.id !== action.payload;
              });
              state.escapables.push(escapable);
            }
          }
        }
      }
    },
    showConditionalWidget: (state: HUDState, action: PayloadAction<string>) => {
      // If there is no widget with this id, do nothing.
      if (!state.widgets[action.payload]) {
        console.warn(
          `Attempted to show widget "${action.payload}" via showConditionalWidget(), but no such widget is currently registered.`
        );
        return;
      }
      // If the widget exists but isn't conditional, do nothing.
      if (!state.widgets[action.payload]!.registration?.isConditional) {
        console.warn(`Attempted to show non-conditional widget "${action.payload}" via showConditionalWidget()`);
        return;
      }
      // If the menu is already shown...
      const currentIndex = state.activeConditionalWidgetIDs.findIndex((id) => {
        return id === action.payload;
      });
      if (currentIndex === -1) {
        // If it's not shown yet, push it.
        const newIDs = [...state.activeConditionalWidgetIDs, action.payload];
        state.activeConditionalWidgetIDs = newIDs;
      } else {
        if (currentIndex === state.activeConditionalWidgetIDs.length - 1) {
          // If it's already at the top, do nothing.
        } else {
          // If it's open but not on top, move it to the top.
          let newIDs = [...state.activeConditionalWidgetIDs];
          newIDs.splice(currentIndex, 1); // Remove.
          newIDs.push(action.payload); // Re-add.
          state.activeConditionalWidgetIDs = newIDs;
          // Move its Escapable as well.
          if (action.payload) {
            const escapable = state.escapables.find((escapable) => {
              return escapable.id === action.payload;
            });
            if (escapable) {
              state.escapables = state.escapables.filter((esc) => {
                return esc.id !== action.payload;
              });
              state.escapables.push(escapable);
            }
          }
        }
      }
    },
    hideConditionalWidget: (state: HUDState, action: PayloadAction<string>) => {
      const newIDs = state.activeConditionalWidgetIDs.filter((id) => {
        return id !== action.payload;
      });
      state.activeConditionalWidgetIDs = newIDs;
    },
    addAllConditionalWidgetsExiting: (state: HUDState) => {
      state.activeConditionalWidgetIDs.forEach((id) => {
        state.exitingConditionalWidgetIDs.push(id);
      });
    },
    addConditionalWidgetExiting: (state: HUDState, action: PayloadAction<string>) => {
      if (
        state.activeConditionalWidgetIDs.includes(action.payload) &&
        !state.exitingConditionalWidgetIDs.includes(action.payload)
      ) {
        state.exitingConditionalWidgetIDs.push(action.payload);
      }
    },
    removeConditionalWidgetExiting: (state: HUDState, action: PayloadAction<string>) => {
      state.exitingConditionalWidgetIDs = state.exitingConditionalWidgetIDs.filter((id) => {
        return id !== action.payload;
      });
    },
    initializeWidget: (state: HUDState, action: PayloadAction<string>) => {
      state.widgets[action.payload].state.initialized = true;
    },
    addMouseUpNeededReason: (state: HUDState, action: PayloadAction<string>) => {
      if (state.mouseUpNeededReasons.includes(action.payload)) {
        console.error(
          `Attempted to add MouseUpNeededReason "${action.payload}", but it was already present.  Please confirm this key is not already in use by another part of the UI.`
        );
      }
      state.mouseUpNeededReasons.push(action.payload);
      // We added a reason, so we definitely need it.
      state.isMouseUpNeeded = true;
    },
    removeMouseUpNeededReason: (state: HUDState, action: PayloadAction<string>) => {
      if (!state.mouseUpNeededReasons.includes(action.payload)) {
        console.error(
          `Attempted to remove MouseUpNeededReason "${action.payload}", but it was already gone.  Please confirm this key is not already in use by another part of the UI.`
        );
      }
      state.mouseUpNeededReasons = state.mouseUpNeededReasons.filter((r) => r != action.payload);
      // May still be other reasons present.
      state.isMouseUpNeeded = state.mouseUpNeededReasons.length > 0;
    },
    showHUDEditor: (state: HUDState) => {
      state.isEditingHUD = true;
    },
    hideHUDEditor: (state: HUDState) => {
      state.isEditingHUD = false;
      // Don't leave a group selection lingering once we exit edit mode.
      state.editor.selectedGroupKey = null;
      state.editor.selectedGroupMemberIDs = [];
    },
    toggleWidgetIsMaximized: (state: HUDState, action: PayloadAction<string>) => {
      const r = state.widgets[action.payload]?.state?.resizable;
      if (r) {
        r.isMaximized = !r.isMaximized;
      }
    },
    addImageToCache: (state: HUDState, action: PayloadAction<[string, string[]]>) => {
      const url = action.payload[0];
      const requestors = action.payload[1];

      if (!state.imageURLsToCache[url]) {
        state.imageURLsToCache[url] = [];
      }

      requestors.forEach((requestor) => {
        if (!state.imageURLsToCache[url].includes(requestor)) {
          state.imageURLsToCache[url].push(requestor);
        }
      });
    },
    removeImageFromCache: (state: HUDState, action: PayloadAction<[string, string[]]>) => {
      const url = action.payload[0];
      const requestors = action.payload[1];

      if (state.imageURLsToCache[url]) {
        state.imageURLsToCache[url] = state.imageURLsToCache[url].filter((r) => !requestors.includes(r));
        // If no one is requesting this image anymore, evict it from the cache.
        if (state.imageURLsToCache[url].length <= 0) {
          delete state.imageURLsToCache[url];
        }
      }
    },
    setUIFactionID: (state: HUDState, action: PayloadAction<string>) => {
      state.uiFactionID = action.payload;
    },
    setNameplateStyle: (state: HUDState, action: PayloadAction<NameplateStyle>) => {
      state.nameplateStyle = action.payload;
    },
    updatePOIsToHide: (state: HUDState, action: PayloadAction<MapDataType[]>) => {
      state.poisToHide = action.payload;
    },
    showPOIType: (state: HUDState, action: PayloadAction<MapDataType>) => {
      if (state.poisToHide.includes(action.payload)) {
        state.poisToHide = state.poisToHide.filter((t) => t !== action.payload);
      }
    },
    hidePOIType: (state: HUDState, action: PayloadAction<MapDataType>) => {
      if (!state.poisToHide.includes(action.payload)) {
        state.poisToHide.push(action.payload);
      }
    },
    updateGroupPOIsToHide: (state: HUDState, action: PayloadAction<GroupPOIType[]>) => {
      state.groupPOIsToHide = action.payload;
    },
    showGroupPOIType: (state: HUDState, action: PayloadAction<GroupPOIType>) => {
      if (state.groupPOIsToHide.includes(action.payload)) {
        state.groupPOIsToHide = state.groupPOIsToHide.filter((t) => t !== action.payload);
      }
    },
    hideGroupPOIType: (state: HUDState, action: PayloadAction<GroupPOIType>) => {
      if (!state.groupPOIsToHide.includes(action.payload)) {
        state.groupPOIsToHide.push(action.payload);
      }
    },
    setUIScale: (state: HUDState, action: PayloadAction<number>) => {
      state.uiScale = Math.max(MIN_UI_SCALE, Math.min(action.payload, MAX_UI_SCALE));
    },
    updateWorldMapSelection: (state: HUDState, action: PayloadAction<Partial<WorldMapSelection>>) => {
      state.worldMapSelection = { ...state.worldMapSelection, ...action.payload };
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
  setSelectedWidgetGroup,
  setSelectedWidgetBounds,
  setSnapEnabled,
  setGuidesEnabled,
  setShowMockData,
  startIsBindingKey,
  endIsBindingKey,
  updateHUDSize,
  updateWidgetStates,
  toggleConditionalWidget,
  showConditionalWidget,
  hideConditionalWidget,
  addConditionalWidgetExiting,
  addAllConditionalWidgetsExiting,
  removeConditionalWidgetExiting,
  initializeWidget,
  addMouseUpNeededReason,
  removeMouseUpNeededReason,
  showHUDEditor,
  hideHUDEditor,
  toggleWidgetIsMaximized,
  addImageToCache,
  removeImageFromCache,
  setUIFactionID,
  setUIScale,
  setNameplateStyle,
  updatePOIsToHide,
  showPOIType,
  hidePOIType,
  updateGroupPOIsToHide,
  showGroupPOIType,
  hideGroupPOIType,
  updateWorldMapSelection
} = hudSlice.actions;
