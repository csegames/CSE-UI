/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { LoadingScreenReason } from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export enum InitTopic {
  ChampionInfo = 'championInfo',
  Features = 'features',
  GameDefs = 'gameDefs',
  GameSettings = 'gameSettings',
  Matchmaking = 'matchmaking',
  Profile = 'profile',
  Quests = 'quests',
  Scenarios = 'scenarios',
  Store = 'store',
  StringTable = 'stringTable',
  User = 'user'
}

export interface InitializationState {
  componentStatus: Dictionary<boolean | null>;
  completed: boolean;
  successful: boolean;
}

export interface InitializationResult {
  topic: InitTopic;
  result: boolean;
}

const initialStatus: Dictionary<boolean | null> = {
  [InitTopic.ChampionInfo]: null,
  [InitTopic.Features]: null,
  [InitTopic.GameDefs]: null,
  [InitTopic.GameSettings]: null,
  [InitTopic.Matchmaking]: null,
  [InitTopic.Profile]: null,
  [InitTopic.Quests]: null,
  [InitTopic.Scenarios]: null,
  [InitTopic.Store]: null,
  [InitTopic.StringTable]: null,
  [InitTopic.User]: null
};

const defaultState: InitializationState = {
  componentStatus: initialStatus,
  completed: false,
  successful: false
};

export const initializationSlice = createSlice({
  name: 'initialization',
  initialState: defaultState,
  reducers: {
    setInitialized: (state: InitializationState, action: PayloadAction<InitializationResult>) => {
      state.componentStatus[action.payload.topic] = action.payload.result;
      let completed = true;
      let successful = true;
      for (const status of Object.values(state.componentStatus)) {
        switch (status) {
          case undefined:
          case null:
            completed = false;
            successful = false;
            break;
          case false:
            successful = false;
            break;
        }
      }

      if (completed && !state.completed) {
        // allow the DOM to rebuild before we signal the client
        window.setTimeout(() => {
          // note : we set and clear to erase the hardcoded initial value
          clientAPI.setLoadingScreenManually(LoadingScreenReason.Initialization, '');
          clientAPI.clearManualLoadingScreen(LoadingScreenReason.Initialization);
          clientAPI.setInitializationComplete();
        }, 10);
      }
      state.completed = completed;
      state.successful = successful;
    }
  }
});

export const { setInitialized } = initializationSlice.actions;
