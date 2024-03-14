/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

interface FullScreenSelectTooltipState {
  selectSelectedPerkLeft: PerkDefGQL;
  selectSelectedPerkRight: PerkDefGQL;
}

function generateDefaultTooltipState() {
  const defaultFullScreenSelectTooltipState: FullScreenSelectTooltipState = {
    selectSelectedPerkLeft: null,
    selectSelectedPerkRight: null
  };
  return defaultFullScreenSelectTooltipState;
}

export const fullScreenSelectSlice = createSlice({
  name: 'fullScreenSelect',
  initialState: generateDefaultTooltipState(),
  reducers: {
    updateFullScreenSelectSelectedPerkLeft: (
      state: FullScreenSelectTooltipState,
      action: PayloadAction<PerkDefGQL>
    ) => {
      const newState = { ...state, selectSelectedPerkLeft: action.payload };
      return newState;
    },
    updateFullScreenSelectSelectedPerkRight: (
      state: FullScreenSelectTooltipState,
      action: PayloadAction<PerkDefGQL>
    ) => {
      const newState = { ...state, selectSelectedPerkRight: action.payload };
      return newState;
    }
  }
});

export const { updateFullScreenSelectSelectedPerkLeft, updateFullScreenSelectSelectedPerkRight } =
  fullScreenSelectSlice.actions;
