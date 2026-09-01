/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export enum LoadingTopic {
  Features = 'features',
  Matchmaking = 'matchmaking',
  Profile = 'profile',
  Store = 'store',
  User = 'user'
}

export interface LoadingState {
  componentStatus: Dictionary<boolean | null>;
  initCompleted: boolean;
  initSuccessful: boolean;
  loadingPhase: string | null;
  loadingHint?: string;
}

export interface InitializationResult {
  topic: LoadingTopic;
  result: boolean;
}

const initialStatus: Dictionary<boolean | null> = {
  [LoadingTopic.Features]: null,
  [LoadingTopic.Matchmaking]: null,
  [LoadingTopic.Profile]: null,
  [LoadingTopic.Store]: null,
  [LoadingTopic.User]: null
};

const defaultState: LoadingState = {
  componentStatus: initialStatus,
  initCompleted: false,
  initSuccessful: false,
  loadingPhase: null,
  loadingHint: null
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: defaultState,
  reducers: {
    setInitialized: (state: LoadingState, action: PayloadAction<InitializationResult>) => {
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

      if (completed && !state.initCompleted) {
        // allow the DOM to rebuild before we signal the client
        window.setTimeout(clientAPI.setInitializationComplete, 0);
      }
      state.initCompleted = completed;
      state.initSuccessful = successful;
    },
    setLoadingHint: (state: LoadingState, action: PayloadAction<string | null>) => {
      state.loadingHint = action.payload;
    },
    setLoadingPhaseName: (state: LoadingState, action: PayloadAction<string | null>) => {
      state.loadingPhase = action.payload;
    }
  }
});

export const { setInitialized, setLoadingHint, setLoadingPhaseName } = loadingSlice.actions;
