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
  isDisabled?: boolean;
}

export interface ModalModel {
  title?: string;
  body?: React.ReactNode;
  message?: string;
  buttons?: ModalButtonModel[];
}

export type ModalContent = ModalModel | ((params: ModalParams) => React.ReactNode);
export interface ModalParams {
  id: string;
  content: ModalContent;
  maxWidth?: string;
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
        // Removes the last item from the array.
        state.modals.pop();
      }
    },
    updateModalContent: (state: ModalsState, action: PayloadAction<[string, ModalContent]>) => {
      for (let index = 0; index < state.modals.length; ++index) {
        if (state.modals[index].id == action.payload[0]) {
          state.modals[index].content = action.payload[1];
          return;
        }
      }
    }
  }
});

export const { showModal, hideModal, updateModalContent } = modalsSlice.actions;
