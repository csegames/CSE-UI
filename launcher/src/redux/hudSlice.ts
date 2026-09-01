/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export interface HUDState {
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
}

const defaultState: HUDState = {
  hudWidth: 0,
  hudHeight: 0,
  vminPx: 1
};

export const hudSlice = createSlice({
  name: 'hud',
  initialState: defaultState,
  reducers: {
    updateHUDSize: (state: HUDState, action: PayloadAction<[number, number]>) => {
      const [width, height] = action.payload;
      if (state.hudWidth !== width || state.hudHeight !== height) {
        state.hudWidth = width;
        state.hudHeight = height;
        state.vminPx = Math.min(width, height) / 100;
      }
    }
  }
});

export const { updateHUDSize } = hudSlice.actions;
