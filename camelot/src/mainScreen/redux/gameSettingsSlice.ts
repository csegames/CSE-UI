/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GameSettingsDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameSettingsState {
  // List of original values for settings which were immediately saved to the client, used for reverting
  advanceSettingsOriginalValues: Dictionary<GameOption>;
}

const defaultGameSettingsState: GameSettingsState = {
  advanceSettingsOriginalValues: {}
};
export const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState: defaultGameSettingsState,
  reducers: {
    updateGameSettings: (state: GameSettingsState, action: PayloadAction<GameSettingsDef>) => {
      Object.assign(state, action.payload);
    },
    updateAdvanceGameOption: (state: GameSettingsState, action: PayloadAction<[GameOption, GameOption]>) => {
      const [newChange, originalChange] = action.payload;
      const storedOriginalChange = state.advanceSettingsOriginalValues[originalChange.name];
      if (!storedOriginalChange) {
        state.advanceSettingsOriginalValues[originalChange.name] = originalChange;
      }
      if (newChange.value === state.advanceSettingsOriginalValues[originalChange.name].value) {
        delete state.advanceSettingsOriginalValues[originalChange.name];
      }
    },
    clearOptionChanges: (state: GameSettingsState) => {
      state.advanceSettingsOriginalValues = {};
    }
  }
});

export const { updateGameSettings, updateAdvanceGameOption, clearOptionChanges } = gameSettingsSlice.actions;
