/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BaseGameState {
  worldTime: number;
  fps: number;
  npcCount: number;
  usingGamepad: boolean;
  /**
   * This is a temporary hack until we add gamepad support to the main menu screens.
   * At that point, we should remove this field and all references to it.
   */
  usingGamepadInMainMenu: boolean;
  isAutoRunning: boolean;
}

const defaultBaseGameState: BaseGameState = {
  worldTime: game.worldTime,
  fps: game.fps,
  npcCount: game.npcCount,
  usingGamepad: game.usingGamepad,
  usingGamepadInMainMenu: false,
  isAutoRunning: false
};

export const baseGameSlice = createSlice({
  name: 'baseGame',
  initialState: defaultBaseGameState,
  reducers: {
    updateWorldTime: (state: BaseGameState, action: PayloadAction<number>) => {
      state.worldTime = action.payload;
    },
    updateUIFPS: (state: BaseGameState, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
    updateUsingGamepad: (state: BaseGameState, action: PayloadAction<boolean>) => {
      state.usingGamepad = action.payload;
    },
    updateNPCCount: (state: BaseGameState, action: PayloadAction<number>) => {
      state.npcCount = action.payload;
    },
    updateIsAutoRunning: (state: BaseGameState, action: PayloadAction<boolean>) => {
      state.isAutoRunning = action.payload;
    }
  }
});

export const { updateWorldTime, updateUIFPS, updateUsingGamepad, updateNPCCount, updateIsAutoRunning } =
  baseGameSlice.actions;
