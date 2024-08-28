/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ChampionCostumeInfo, ChampionInfo, ProgressionNodeDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChampionInfoStaticData {
  // Static / server data.
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  championIDToChampion: Dictionary<ChampionInfo>;
  progressionNodeDefsByID: Dictionary<ProgressionNodeDef>;
  progressionNodeDefsByChampionID: Dictionary<ProgressionNodeDef[]>;
}

export interface ChampionXPData {
  championID: string;
  xp: number;
  level: number;
}

export interface ChampionInfoUIData {
  // UI / local data.
  selectedChampion: ChampionInfo;
  selectedEmoteIndex: number;
  championIDToLastDisplayedXP: { [championID: string]: ChampionXPData };
}

export type ChampionInfoState = ChampionInfoStaticData & ChampionInfoUIData;

const defaultChampionInfoState: ChampionInfoState = {
  championCostumes: [],
  champions: [],
  championIDToChampion: {},
  progressionNodeDefsByID: {},
  progressionNodeDefsByChampionID: {},
  championIDToLastDisplayedXP: {},
  selectedChampion: null,
  selectedEmoteIndex: 0
};

export const championInfoSlice = createSlice({
  name: 'championInfo',
  initialState: defaultChampionInfoState,
  reducers: {
    updateChampionInfo: (state: ChampionInfoState, action: PayloadAction<ChampionInfoStaticData>) => {
      Object.entries(action.payload).forEach((entry) => {
        state[entry[0] as keyof ChampionInfoStaticData] = entry[1];
      });
    },
    updateSelectedChampion: (state: ChampionInfoState, action: PayloadAction<ChampionInfo>) => {
      state.selectedChampion = action.payload;
    },
    updateSelectedEmoteIndex: (state: ChampionInfoState, action: PayloadAction<number>) => {
      state.selectedEmoteIndex = action.payload;
    },
    updateLastDisplayedChampionXP: (state: ChampionInfoState, action: PayloadAction<ChampionXPData>) => {
      state.championIDToLastDisplayedXP[action.payload.championID] = action.payload;
    }
  }
});

export const { updateChampionInfo, updateSelectedChampion, updateSelectedEmoteIndex, updateLastDisplayedChampionXP } =
  championInfoSlice.actions;
