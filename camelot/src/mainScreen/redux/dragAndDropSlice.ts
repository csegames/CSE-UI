/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DragStartParams {
  draggableID: string;
  draggingRender: () => JSX.Element;
}

export interface DropTargetParams {
  dropTargetID: string;
  dropType: string;
  data?: any;
  element?: HTMLDivElement;
}

interface DragAndDropState {
  /** The id of the single Draggable currently being dragged.  Else null. */
  currentDraggableID: string;
  currentDraggableBounds: DOMRect;
  dragDelta: [number, number];
  forcedDraggableID: string;
  /** First key is a dropType.  Second key is a dropTargetID. */
  dropTargets: Dictionary<Dictionary<DropTargetParams>>;
  currentDraggingRender: () => JSX.Element;
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
    startDrag: (state: DragAndDropState, action: PayloadAction<DragStartParams>) => {
      state.currentDraggableID = action.payload.draggableID;
      state.currentDraggingRender = action.payload.draggingRender;
    },
    endDrag: (state: DragAndDropState) => {
      state.currentDraggableID = null;
      state.currentDraggableBounds = null;
      state.currentDraggingRender = null;
      state.dragDelta = [0, 0];
    },
    reportDraggableBounds: (state: DragAndDropState, action: PayloadAction<DOMRect>) => {
      state.currentDraggableBounds = action.payload;
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
  reportDraggableBounds,
  addDropTarget,
  removeDropTarget,
  updateDragDelta,
  updateForcedDraggableID
} = dragAndDropSlice.actions;
