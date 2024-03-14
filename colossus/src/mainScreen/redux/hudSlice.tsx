/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum HUDVerticalAnchor {
  Top = 'hud-vertical-anchor-top',
  Center = 'hud-vertical-anchor-center',
  Bottom = 'hud-vertical-anchor-bottom'
}

export enum HUDHorizontalAnchor {
  Left = 'hud-horizontal-anchor-left',
  Center = 'hud-horizontal-anchor-center',
  Right = 'hud-horizontal-anchor-right'
}

interface HUDState {
  hudWidth: number;
  hudHeight: number;
  vminPx: number;
}

function buildDefaultHUDState() {
  const DefaultHUDState: HUDState = {
    hudWidth: 0,
    hudHeight: 0,
    vminPx: 1
  };

  return DefaultHUDState;
}

export const hudSlice = createSlice({
  name: 'hud',
  initialState: buildDefaultHUDState(),
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
