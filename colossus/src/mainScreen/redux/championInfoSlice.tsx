/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CostumeDef } from '../dataSources/manifest/costumeManifest';
import { ChampionDef } from '../dataSources/manifest/championManifest';
import { ProgressionNodeDef } from '../dataSources/manifest/progressionNodeManifest';

export interface ChampionInfoStaticData {
  // Static / server data.
  championCostumes: CostumeDef[];
  costumesByID: Dictionary<CostumeDef>;
  champions: ChampionDef[];
  championIDToChampion: Dictionary<ChampionDef>;
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
  selectedChampion: ChampionDef;
  selectedEmoteIndex: number;
  championIDToLastDisplayedXP: { [championID: string]: ChampionXPData };
}

export type ChampionInfoState = ChampionInfoStaticData & ChampionInfoUIData;

const defaultChampionInfoState: ChampionInfoState = {
  championCostumes: [],
  costumesByID: {},
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
    updateChampions: (
      state: ChampionInfoState,
      action: PayloadAction<{
        champions: ChampionDef[];
        championIDToChampion: Dictionary<ChampionDef>;
      }>
    ) => {
      state.champions = action.payload.champions;
      state.championIDToChampion = action.payload.championIDToChampion;
    },
    updateCostumes: (
      state: ChampionInfoState,
      action: PayloadAction<{
        costumes: CostumeDef[];
        costumesByID: Dictionary<CostumeDef>;
      }>
    ) => {
      state.championCostumes = action.payload.costumes;
      state.costumesByID = action.payload.costumesByID;
    },
    updateProgressionNodes: (
      state: ChampionInfoState,
      action: PayloadAction<{
        progressionNodeDefsByID: Dictionary<ProgressionNodeDef>;
        progressionNodeDefsByChampionID: Dictionary<ProgressionNodeDef[]>;
      }>
    ) => {
      state.progressionNodeDefsByID = action.payload.progressionNodeDefsByID;
      state.progressionNodeDefsByChampionID = action.payload.progressionNodeDefsByChampionID;
    },
    updateSelectedChampion: (state: ChampionInfoState, action: PayloadAction<ChampionDef>) => {
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

export const {
  updateChampions,
  updateCostumes,
  updateProgressionNodes,
  updateSelectedChampion,
  updateSelectedEmoteIndex,
  updateLastDisplayedChampionXP
} = championInfoSlice.actions;
