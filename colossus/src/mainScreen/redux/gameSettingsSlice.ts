/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GameSettingsDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export interface GameSettingsState extends GameSettingsDef {
  pendingSettingsChanges: Dictionary<GameOption>;
  // List of changed settings which were immediately saved to the client
  advanceSettingsChanges: Dictionary<GameOption>;
  // List of original values for settings which were immediately saved to the client, used for reverting
  advanceSettingsOriginalValues: Dictionary<GameOption>;
}

function generateDefaultGameSettingsState() {
  const defaultGameSettingsState: GameSettingsState = {
    // From GameSettingsDef.
    dailyQuestResetsAllowed: 1,
    expensivePurchaseGemThreshold: -1,
    hardDailyQuestCount: 1,
    maxCharacterNameLength: 1,
    maxEmoteCount: 1,
    minCharacterNameLength: 1,
    normalDailyQuestCount: 1,
    startingAttributePoints: 1,
    traitsMaxPoints: 1,
    traitsMinPoints: 1,
    storeTabConfigs: [],
    // UI state additions.
    pendingSettingsChanges: {},
    advanceSettingsChanges: {},
    advanceSettingsOriginalValues: {}
  };
  return defaultGameSettingsState;
}

export const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState: generateDefaultGameSettingsState(),
  reducers: {
    updateGameSettings: (state: GameSettingsState, action: PayloadAction<GameSettingsDef>) => {
      Object.assign(state, action.payload);
    },
    enqueuePendingGameOptionChange: (state: GameSettingsState, action: PayloadAction<GameOption>) => {
      state.pendingSettingsChanges[action.payload.name] = action.payload;
    },
    dequeuePendingGameOptionChange: (state: GameSettingsState, action: PayloadAction<GameOption>) => {
      delete state.pendingSettingsChanges[action.payload.name];
    },
    updateAdvanceGameOption: (state: GameSettingsState, action: PayloadAction<[GameOption, GameOption]>) => {
      const [newChange, originalChange] = action.payload;
      const storedOriginalChange = state.advanceSettingsOriginalValues[originalChange.name];
      if (!storedOriginalChange) {
        state.advanceSettingsOriginalValues[originalChange.name] = originalChange;
      }
      if (newChange.value !== state.advanceSettingsOriginalValues[originalChange.name].value) {
        state.advanceSettingsChanges[newChange.name] = newChange;
      } else {
        delete state.advanceSettingsChanges[newChange.name];
        delete state.advanceSettingsOriginalValues[originalChange.name];
      }
    },
    clearOptionChanges: (state: GameSettingsState) => {
      state.pendingSettingsChanges = {};
      state.advanceSettingsChanges = {};
      state.advanceSettingsOriginalValues = {};
    }
  }
});

export const {
  updateGameSettings,
  enqueuePendingGameOptionChange,
  dequeuePendingGameOptionChange,
  updateAdvanceGameOption,
  clearOptionChanges
} = gameSettingsSlice.actions;
