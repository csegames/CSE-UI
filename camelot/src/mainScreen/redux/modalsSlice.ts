/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalButtonModel {
  text: string;
  onClick: () => void;
}

export interface ModalModel {
  title?: string;
  body?: React.ReactNode;
  message?: string;
  buttons?: ModalButtonModel[];
}

export interface ModalParams {
  id: string;
  content: ModalModel;
  // If true, this modal will close itself in response to the Escape key,
  // (or whichever key is bound to the Menu action).
  escapable?: boolean;
  hideCloseButton?: boolean;
  onClose?: () => void;
}

export interface ModalsState {
  modals: ModalParams[];
}

function buildDefaultModalsState() {
  const DefaultModalsState: ModalsState = {
    modals: []
  };

  return DefaultModalsState;
}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState: buildDefaultModalsState(),
  reducers: {
    showModal: (state: ModalsState, action: PayloadAction<ModalParams>) => {
      state.modals.push(action.payload);
    },
    hideModal: (state: ModalsState) => {
      if (state.modals.length > 0) {
        // Removes the first item from the array.
        state.modals.shift();
      }
    },
    updateModalContent: (state: ModalsState, action: PayloadAction<ModalModel>) => {
      if (state.modals.length > 0) {
        state.modals[0].content = action.payload;
      }
    }
  }
});

export const { showModal, hideModal, updateModalContent } = modalsSlice.actions;
