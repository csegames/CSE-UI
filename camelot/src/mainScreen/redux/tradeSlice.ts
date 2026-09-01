/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { TradeSnapshot, TradeState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/TradeSnapshot';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TradeSliceState {
  tradeSnapshot: TradeSnapshot;
  /** Maps ID to display name. */
  tradeRequesters: Record<EntityID, string>;
  /** Maps position/index to itemInstanceID. */
  tradeItemPositions: Record<number, string>;
}

const defaultState: TradeSliceState = {
  tradeSnapshot: {
    tradeTargetEntityID: '',
    tradeTargetName: '',
    tradeState: TradeState.None,
    tradeTargetState: TradeState.None,
    tradeItems: [],
    tradeTargetItems: [],
    tradeCurrency: [],
    tradeTargetCurrency: [],
    revision: 0
  },
  tradeRequesters: {},
  tradeItemPositions: {}
};
export const tradeSlice = createSlice({
  name: 'trade',
  initialState: defaultState,
  reducers: {
    updateTradeSnapshot: (state: TradeSliceState, action: PayloadAction<TradeSnapshot>) => {
      state.tradeSnapshot = action.payload;
    },
    addTradeRequester: (state: TradeSliceState, action: PayloadAction<{ targetID: EntityID; targetName: string }>) => {
      state.tradeRequesters[action.payload.targetID] = action.payload.targetName;
    },
    removeTradeRequester: (state: TradeSliceState, action: PayloadAction<string>) => {
      delete state.tradeRequesters[action.payload];
    },
    clearTradeRequesters: (state: TradeSliceState) => {
      state.tradeRequesters = {};
    },
    setTradeItemPosition: (state: TradeSliceState, action: PayloadAction<[string, number]>) => {
      const [itemInstanceID, index] = action.payload;
      state.tradeItemPositions[index] = itemInstanceID;
    },
    swapTradeItemPositions: (state: TradeSliceState, action: PayloadAction<[number, number]>) => {
      let temp = state.tradeItemPositions[action.payload[0]];
      state.tradeItemPositions[action.payload[0]] = state.tradeItemPositions[action.payload[1]];
      state.tradeItemPositions[action.payload[1]] = temp;
    },
    clearTradeItemPosition: (state: TradeSliceState, action: PayloadAction<number>) => {
      delete state.tradeItemPositions[action.payload];
    },
    clearTradeItemPositions: (state: TradeSliceState) => {
      state.tradeItemPositions = {};
    }
  }
});

export const {
  updateTradeSnapshot,
  addTradeRequester,
  removeTradeRequester,
  clearTradeRequesters,
  setTradeItemPosition,
  swapTradeItemPositions,
  clearTradeItemPosition,
  clearTradeItemPositions
} = tradeSlice.actions;
