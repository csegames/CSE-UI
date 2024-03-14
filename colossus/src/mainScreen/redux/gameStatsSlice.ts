/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OvermindSummaryGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

export type ThumbsUp = Dictionary<string[]>;

// used to record the last user action until the server catches up
export interface LocalThumbsUp {
  characterID: string;
  isRevoke: boolean;
}

export interface GameStatsState {
  overmindSummary: OvermindSummaryGQL | null;
  thumbsUp: ThumbsUp | null;
  localThumbsUp: LocalThumbsUp | null;
  pendingQuestClaims: Dictionary<boolean>;
}

function defaultStatsState(): GameStatsState {
  return {
    overmindSummary: null,
    thumbsUp: null,
    localThumbsUp: null,
    pendingQuestClaims: {}
  };
}

export const gameStatsSlice = createSlice({
  name: 'gameStats',
  initialState: defaultStatsState(),
  reducers: {
    clearStats: (state: GameStatsState) => {
      return defaultStatsState();
    },
    setLocalThumbsUp: (state: GameStatsState, action: PayloadAction<LocalThumbsUp>) => {
      state.localThumbsUp = action.payload;
    },
    setStats: (state: GameStatsState, action: PayloadAction<OvermindSummaryGQL>) => {
      // when a new summary comes in, clear out not just the summary itself but also
      // any local state related to thumbs up that has been set. Failure to do so can cause
      // thumbs up from previous matches to appear
      state.overmindSummary = action.payload;
      state.localThumbsUp = null;
      state.thumbsUp = null;
      state.pendingQuestClaims = {};
    },
    setThumbsUp: (state: GameStatsState, action: PayloadAction<ThumbsUp>) => {
      state.thumbsUp = action.payload;
    },
    addQuestAsClaimed: (state: GameStatsState, action: PayloadAction<string>) => {
      const newDict = state.pendingQuestClaims;
      newDict[action.payload] = true;
      state.pendingQuestClaims = newDict;
    }
  }
});

export const { clearStats, setStats, setThumbsUp, setLocalThumbsUp, addQuestAsClaimed } = gameStatsSlice.actions;
