/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CraftingStationData } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Please keep in sync with TradeskillsComponentNetworkState.h.
export enum CraftingJobState {
  Invalid = 'Invalid',
  Configuring = 'Configuring',
  Queued = 'Queued',
  Running = 'Running',
  Finished = 'Finished',
  Collecting = 'Collecting'
}

export interface CraftingJobInstance {
  jobInstanceID: string;
  startTime: string;
  endTime: string;
  jobDefID: string;
  recipeDefID: string;
  jobState: CraftingJobState;
  craftingStationID: string;
}

export interface CraftingData {
  jobsInProgress: Record<string, CraftingJobInstance>;
}

export interface CraftingState extends CraftingData {
  interactedCraftingStationData: CraftingStationData;
}

function buildDefaultCraftingReduxState(): CraftingState {
  const DefaultCraftingState: CraftingState = {
    jobsInProgress: {},
    interactedCraftingStationData: null
  };
  return DefaultCraftingState;
}

export const craftingSlice = createSlice({
  name: 'crafting',
  initialState: buildDefaultCraftingReduxState(),
  reducers: {
    updateCraftingData: (state: CraftingState, action: PayloadAction<CraftingData>) => {
      Object.assign(state, action.payload);
    },
    updateCraftingStationData: (state: CraftingState, action: PayloadAction<CraftingStationData>) => {
      state.interactedCraftingStationData = action.payload;
    }
  }
});

export const { updateCraftingData, updateCraftingStationData } = craftingSlice.actions;
