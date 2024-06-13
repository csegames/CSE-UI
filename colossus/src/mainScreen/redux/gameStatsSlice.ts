/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OvermindSummaryGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

export type ThumbsUp = Dictionary<string[]>;

export interface GameStatsRequests {
  setThumbsUp?: string;
}

function getThumbsUp(summary: OvermindSummaryGQL): ThumbsUp {
  var result: ThumbsUp = {};
  for (const ch of summary.characterSummaries) {
    result[ch.accountID] = [];
  }
  for (const ch of summary.characterSummaries) {
    result[ch.thumbsUpReward]?.push(ch.accountID);
  }
  return result;
}

function resolveRequests(current: GameStatsRequests | null, toClear: GameStatsRequests): GameStatsRequests {
  if (current === null) return null;

  const result = cloneDeep(current); // strip proxy for compare

  if (result.setThumbsUp == toClear.setThumbsUp) delete result.setThumbsUp;
  return Object.keys(result).length === 0 ? null : result;
}

function mergeRequests(prev: GameStatsRequests | null, requested: GameStatsRequests): GameStatsRequests {
  if (prev === null) return requested;
  return { ...prev, ...requested };
}

export interface GameStatsRequestState {
  active: GameStatsRequests | null; // async match network processing calls in flight
  queued: GameStatsRequests | null; // client code -> match network processing
}

export interface GameStatsState {
  overmindSummary: OvermindSummaryGQL | null;
  thumbsUp: ThumbsUp | null;
  requests: GameStatsRequestState;
  pendingQuestClaims: Dictionary<boolean>;
}

// hidden state used to power current redux values: cache off all known match stats
let overmindSummaries: Dictionary<OvermindSummaryGQL> = {};
let statMatchID: string = null;

function defaultStatsState(): GameStatsState {
  return {
    overmindSummary: null,
    thumbsUp: {},
    requests: { active: null, queued: null },
    pendingQuestClaims: {}
  };
}

export const gameStatsSlice = createSlice({
  name: 'gameStats',
  initialState: defaultStatsState(),
  reducers: {
    acceptGameStatsRequests: (state: GameStatsState, action: PayloadAction<GameStatsRequests>) => {
      state.requests.active = mergeRequests(state.requests.active, action.payload);
      state.requests.queued = resolveRequests(state.requests.queued, action.payload);
    },
    resolveGameStatsRequests: (state: GameStatsState, action: PayloadAction<GameStatsRequests>) => {
      state.requests.active = resolveRequests(state.requests.active, action.payload);
    },
    resetGameStatsRequests: (state: GameStatsState) => {
      state.requests.queued = null;
      state.requests.active = null;
    },
    addQuestAsClaimed: (state: GameStatsState, action: PayloadAction<string>) => {
      const newDict = state.pendingQuestClaims;
      newDict[action.payload] = true;
      state.pendingQuestClaims = newDict;
    },
    revokeThumbsUp: (state: GameStatsState) => {
      state.requests.queued = mergeRequests(state.requests.queued, { setThumbsUp: '' });
    },
    setStatsMatch: (state: GameStatsState, action: PayloadAction<string>) => {
      if (statMatchID == action.payload) return;
      statMatchID = action.payload;
      const summary = overmindSummaries[statMatchID];

      // completely reset visible stats state for new match
      const result = defaultStatsState();
      result.overmindSummary = summary;
      result.thumbsUp = summary ? getThumbsUp(summary) : {};
      return result;
    },
    setStats: (state: GameStatsState, action: PayloadAction<OvermindSummaryGQL>) => {
      const matchID = action.payload.matchID;
      if (matchID != null) {
        overmindSummaries[matchID] = action.payload;
      }
      if (matchID == statMatchID) {
        state.overmindSummary = action.payload;
        state.thumbsUp = getThumbsUp(action.payload);
      }
    },
    setThumbsUp: (state: GameStatsState, action: PayloadAction<string>) => {
      state.requests.queued = mergeRequests(state.requests.queued, { setThumbsUp: action.payload });
    }
  }
});

export const {
  acceptGameStatsRequests,
  resolveGameStatsRequests,
  resetGameStatsRequests,
  addQuestAsClaimed,
  revokeThumbsUp,
  setStats,
  setStatsMatch,
  setThumbsUp
} = gameStatsSlice.actions;
