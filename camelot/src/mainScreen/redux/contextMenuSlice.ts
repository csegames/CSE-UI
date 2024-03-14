/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

export interface ContextMenuItem {
  title: string;
  onClick: (dispatch: Dispatch) => void;
  disabled?: boolean;
}

export interface ContextMenuParams {
  // An ID is required so we can close the menu if the ContextMenuSource gets unmounted.
  id: string;
  content: (() => React.ReactNode) | ContextMenuItem[] | null;
  mouseX?: number;
  mouseY?: number;
}

export interface ContextMenuState extends ContextMenuParams {}

function buildDefaultContextMenuState() {
  const DefaultContextMenuState: ContextMenuState = {
    id: null,
    content: null
  };

  return DefaultContextMenuState;
}

export const contextMenuSlice = createSlice({
  name: 'contextMenu',
  initialState: buildDefaultContextMenuState(),
  reducers: {
    showContextMenu: (state: ContextMenuState, action: PayloadAction<ContextMenuParams>) => {
      // Completely replace the existing state when starting a new ContextMenu.
      return action.payload;
    },
    hideContextMenu: (state: ContextMenuState) => {
      state.content = null;
      state.id = null;
    }
  }
});

export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;
