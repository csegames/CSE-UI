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
    // UI state additions.
    pendingSettingsChanges: {}
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
    enqueueGameOptionChange: (state: GameSettingsState, action: PayloadAction<GameOption>) => {
      state.pendingSettingsChanges[action.payload.name] = action.payload;
    },
    dequeueGameOptionChange: (state: GameSettingsState, action: PayloadAction<GameOption>) => {
      delete state.pendingSettingsChanges[action.payload.name];
    },
    clearPendingOptionChanges: (state: GameSettingsState) => {
      state.pendingSettingsChanges = {};
    }
  }
});

export const { updateGameSettings, enqueueGameOptionChange, dequeueGameOptionChange, clearPendingOptionChanges } =
  gameSettingsSlice.actions;
