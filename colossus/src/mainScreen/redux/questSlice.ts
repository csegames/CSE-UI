/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestDef, QuestType } from '../dataSources/manifest/questManifest';

// BEGIN INTERFACES AND STATES

export type QuestsByType = { [key in QuestType]: QuestDef[] };

export interface QuestStaticData {
  quests: QuestsByType;
  questsById: Dictionary<QuestDef>;
}

export interface QuestState extends QuestStaticData {
  currentBattlePass: QuestDef;
  nextBattlePass: QuestDef;
  previousBattlePass: QuestDef;
}

function generateDefaultQuestState() {
  const defaultQuestState: QuestState = {
    quests: {
      Invalid: [],
      Normal: [],
      BattlePass: [],
      DailyNormal: [],
      DailyHard: [],
      Champion: [],
      SubQuest: []
    },
    questsById: {},
    currentBattlePass: null,
    nextBattlePass: null,
    previousBattlePass: null
  };

  // TODO: Real data, once we have defined it.

  return defaultQuestState;
}

export const questSlice = createSlice({
  name: 'quests',
  initialState: generateDefaultQuestState(),
  reducers: {
    updateQuestStaticData: (state: QuestState, action: PayloadAction<QuestStaticData>) => {
      Object.assign(state, action.payload);
    },
    updateCurrentBattlePass: (state: QuestState, action: PayloadAction<QuestDef>) => {
      state.currentBattlePass = action.payload;
    },
    updateNextBattlePass: (state: QuestState, action: PayloadAction<QuestDef>) => {
      state.nextBattlePass = action.payload;
    },
    updatePreviousBattlePass: (state: QuestState, action: PayloadAction<QuestDef>) => {
      state.previousBattlePass = action.payload;
    }
  }
});

export const { updateQuestStaticData, updateCurrentBattlePass, updateNextBattlePass, updatePreviousBattlePass } =
  questSlice.actions;
