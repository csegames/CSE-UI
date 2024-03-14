/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: [CU-12497] Add back interactive alerts query to phoenixed CU UI

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { LoadingScreenReason } from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export enum InitTopic {
  Abilities = 'abilities',
  EquippedItems = 'equippedItems',
  GameDefs = 'gameDefs',
  HUDWidgets = 'hudWidgets',
  // InteractiveAlerts = 'interactiveAlerts',
  Inventory = 'inventory',
  MyCharacterAbilities = 'myCharacterAbilities',
  MyCharacterStats = 'myCharacterStats',
  Statuses = 'statuses',
  Warband = 'warband',
  Zones = 'zones'
}

export interface InitializationState {
  componentStatus: Dictionary<boolean | null>;
  uninitializedTopics: InitTopic[];
  completed: boolean;
}

export interface InitializationResult {
  topic: InitTopic;
  result: boolean;
}

const initialStatus: Dictionary<boolean | null> = {};

Object.values(InitTopic).forEach((topic) => {
  initialStatus[topic] = null;
});

const defaultState: InitializationState = {
  componentStatus: initialStatus,
  uninitializedTopics: Object.values(InitTopic),
  completed: false
};

export const initializationSlice = createSlice({
  name: 'initialization',
  initialState: defaultState,
  reducers: {
    setInitialized: (state: InitializationState, action: PayloadAction<InitializationResult>) => {
      // If this has already been initialized, no need to do it again!
      if (state.componentStatus[action.payload.topic] === action.payload.result) {
        return;
      }

      state.componentStatus[action.payload.topic] = action.payload.result;
      state.uninitializedTopics = Object.keys(state.componentStatus).filter(
        (key) => !state.componentStatus[key]
      ) as InitTopic[];
      let completed = true;
      let readyCount: number = 0;
      for (const status of Object.values(state.componentStatus)) {
        switch (status) {
          case undefined:
          case null:
            completed = false;
            break;
          case true:
            ++readyCount;
            break;
        }
      }

      const debugText = `Init ${readyCount}/${Object.keys(initialStatus).length}: ${action.payload.topic} ${
        action.payload.result ? 'ready!' : 'failed!'
      }`;
      if (action.payload.result) {
        console.log(debugText);
      } else {
        console.warn(debugText);
      }

      if (completed && !state.completed) {
        // We set and clear to erase the hardcoded initial value.
        clientAPI.setLoadingScreenManually(LoadingScreenReason.Initialization, '');
        clientAPI.clearManualLoadingScreen(LoadingScreenReason.Initialization);
        clientAPI.setInitializationComplete();
      }
      state.completed = completed;
    }
  }
});

export const { setInitialized } = initializationSlice.actions;
