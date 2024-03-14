/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { QuestDefGQL, QuestType } from '@csegames/library/dist/hordetest/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export type QuestsByType = { [key in QuestType]: QuestDefGQL[] };

export interface QuestStaticData {
  quests: QuestsByType;
  questsById: Dictionary<QuestDefGQL>;
}

export interface QuestState extends QuestStaticData {
  currentBattlePass: QuestDefGQL;
  nextBattlePass: QuestDefGQL;
  previousBattlePass: QuestDefGQL;
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
    updateCurrentBattlePass: (state: QuestState, action: PayloadAction<QuestDefGQL>) => {
      state.currentBattlePass = action.payload;
    },
    updateNextBattlePass: (state: QuestState, action: PayloadAction<QuestDefGQL>) => {
      state.nextBattlePass = action.payload;
    },
    updatePreviousBattlePass: (state: QuestState, action: PayloadAction<QuestDefGQL>) => {
      state.previousBattlePass = action.payload;
    }
  }
});

export const { updateQuestStaticData, updateCurrentBattlePass, updateNextBattlePass, updatePreviousBattlePass } =
  questSlice.actions;
