/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// We use this instead of DOMRect internally, since a DOMRect can misbehave when passed through Redux.
export interface SimpleRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function simpleRectFromDOMRect(dom?: DOMRect): SimpleRect {
  const simple: SimpleRect = {
    x: (dom?.x ?? 0) + 0,
    y: (dom?.y ?? 0) + 0,
    width: dom?.width ?? 0,
    height: dom?.height ?? 0,
    top: dom?.y ?? 0,
    left: dom?.x ?? 0,
    right: (dom?.x ?? 0) + (dom?.width ?? 0),
    bottom: (dom?.y ?? 0) + (dom?.height ?? 0)
  };

  return simple;
}

export interface DropTargetParams {
  dropTargetID: string;
  dropType: string;
  data?: any;
  element?: HTMLDivElement;
}

export interface DraggableRenderParams {
  bounds: SimpleRect;
  render: () => React.ReactNode;
}

interface DragAndDropState {
  /** The id of the single Draggable currently being dragged.  Else null. */
  currentDraggableID: string;
  currentDraggableBounds: SimpleRect;
  dragDelta: [number, number];
  forcedDraggableID: string;
  /** First key is a dropType.  Second key is a dropTargetID. */
  dropTargets: Dictionary<Dictionary<DropTargetParams>>;
  currentDraggingRender: () => React.ReactNode;
}

function buildDefaultDragAndDropState() {
  const DefaultDragAndDropState: DragAndDropState = {
    currentDraggableID: null,
    currentDraggableBounds: null,
    currentDraggingRender: null,
    dragDelta: [0, 0],
    forcedDraggableID: null,
    dropTargets: {}
  };

  return DefaultDragAndDropState;
}

export const dragAndDropSlice = createSlice({
  name: 'dragAndDrop',
  initialState: buildDefaultDragAndDropState(),
  reducers: {
    startDrag: (state: DragAndDropState, action: PayloadAction<string>) => {
      state.currentDraggableID = action.payload;
      state.dragDelta = [0, 0];
    },
    endDrag: (state: DragAndDropState) => {
      state.currentDraggableID = null;
      state.currentDraggableBounds = null;
      state.currentDraggingRender = null;
      state.dragDelta = [0, 0];
    },
    reportDraggableRenderData: (state: DragAndDropState, action: PayloadAction<DraggableRenderParams>) => {
      state.currentDraggableBounds = action.payload.bounds;
      state.currentDraggingRender = action.payload.render;
    },
    addDropTarget: (state: DragAndDropState, action: PayloadAction<DropTargetParams>) => {
      const { dropType, dropTargetID } = action.payload;
      if (!state.dropTargets[dropType]) {
        state.dropTargets[dropType] = {};
      }
      state.dropTargets[dropType][dropTargetID] = action.payload;
    },
    removeDropTarget: (state: DragAndDropState, action: PayloadAction<DropTargetParams>) => {
      const { dropType, dropTargetID } = action.payload;
      if (state.dropTargets[dropType]?.[dropTargetID]) {
        delete state.dropTargets[dropType][dropTargetID];
      }
    },
    updateDragDelta: (state: DragAndDropState, action: PayloadAction<[number, number]>) => {
      state.dragDelta = action.payload;
    },
    updateForcedDraggableID: (state: DragAndDropState, action: PayloadAction<string>) => {
      state.forcedDraggableID = action.payload;
    }
  }
});

export const {
  startDrag,
  endDrag,
  reportDraggableRenderData,
  addDropTarget,
  removeDropTarget,
  updateDragDelta,
  updateForcedDraggableID
} = dragAndDropSlice.actions;
