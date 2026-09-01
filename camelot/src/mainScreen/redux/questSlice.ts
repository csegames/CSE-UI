/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  QuestsSnapshot,
  QuestState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/QuestsSnapshot';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export enum QuestDisplayCategory {
  KingsTask = 'Quest.DisplayCategory.KingsTask',
  MilitaryService = 'Quest.DisplayCategory.MilitaryService',
  TurnInWeapons = 'Quest.DisplayCategory.TurnInWeapons',
  TurnInArmor = 'Quest.DisplayCategory.TurnInArmor',
  TurnInMisc = 'Quest.DisplayCategory.TurnInMisc',
  Tutorial = 'Quest.DisplayCategory.Tutorial'
}

export interface QuestStateEx extends QuestState {
  instanceID: string;
}

interface QuestsState extends QuestsSnapshot {
  quests: Record<string, QuestStateEx>;
  loggedQuestIDs: string[];
  trackedQuestIDs: string[];
  autoTrackedQuestIDs: string[]; // Quests we have already auto-tracked at least once, to prevent re-adding them if the player has untracked them.
}

function generateDefaultState(): QuestsState {
  const defaultState: QuestsState = {
    quests: {},
    rolloverTime: '',
    loggedQuestIDs: [],
    trackedQuestIDs: [],
    autoTrackedQuestIDs: []
  };

  return defaultState;
}

export const questSlice = createSlice({
  name: 'quests',
  initialState: generateDefaultState(),
  reducers: {
    updateRolloverTime: (state: QuestsState, action: PayloadAction<string>) => {
      state.rolloverTime = action.payload;
    },
    updateQuests: (state: QuestsState, action: PayloadAction<Record<string, QuestStateEx>>) => {
      state.quests = action.payload;
    },
    updateLoggedQuestIDs: (state: QuestsState, action: PayloadAction<string[]>) => {
      state.loggedQuestIDs = action.payload;
    },
    updateTrackedQuestIDs: (state: QuestsState, action: PayloadAction<string[]>) => {
      state.trackedQuestIDs = action.payload;
    },
    addLoggedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.loggedQuestIDs.push(action.payload);
    },
    removeLoggedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.loggedQuestIDs = state.loggedQuestIDs.filter((id) => id !== action.payload);
    },
    addTrackedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.trackedQuestIDs.push(action.payload);
    },
    removeTrackedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.trackedQuestIDs = state.trackedQuestIDs.filter((id) => id !== action.payload);
    },
    updateAutoTrackedQuestIDs: (state: QuestsState, action: PayloadAction<string[]>) => {
      state.autoTrackedQuestIDs = action.payload;
    },
    addAutoTrackedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.autoTrackedQuestIDs.push(action.payload);
    },
    removeAutoTrackedQuestID: (state: QuestsState, action: PayloadAction<string>) => {
      state.autoTrackedQuestIDs = state.autoTrackedQuestIDs.filter((id) => id !== action.payload);
    }
  }
});

export const {
  updateQuests,
  updateRolloverTime,
  updateLoggedQuestIDs,
  updateTrackedQuestIDs,
  addLoggedQuestID,
  addTrackedQuestID,
  removeLoggedQuestID,
  removeTrackedQuestID,
  updateAutoTrackedQuestIDs,
  addAutoTrackedQuestID,
  removeAutoTrackedQuestID
} = questSlice.actions;
