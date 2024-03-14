/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let nextToasterID: number = 1;

export interface ToasterModel {
  title?: string;
  message?: string;
}

export interface ToasterParams {
  id?: string;
  content: (() => React.ReactNode) | ToasterModel;
  duration?: number;
}

export interface ToastersState {
  toasters: ToasterParams[];
}

function buildDefaultToastersState() {
  const DefaultModalsState: ToastersState = {
    toasters: []
  };

  return DefaultModalsState;
}

export const toastersSlice = createSlice({
  name: 'toasters',
  initialState: buildDefaultToastersState(),
  reducers: {
    showToaster: (state: ToastersState, action: PayloadAction<ToasterParams>) => {
      if (!action.payload.id) {
        action.payload.id = `${nextToasterID++}`;
      }
      const oldToaster = state.toasters.find((toast) => {
        return toast.id === action.payload.id;
      });
      if (oldToaster) {
        // If a toaster with that ID is already in the queue, just update it.
        Object.assign(oldToaster, action.payload);
      } else {
        // If the toaster is new, push it.
        state.toasters.push(action.payload);
      }
    },
    hideToaster: (state: ToastersState) => {
      if (state.toasters.length > 0) {
        // Removes the first item from the array.
        state.toasters.shift();
      }
    }
  }
});

export const { showToaster, hideToaster } = toastersSlice.actions;
