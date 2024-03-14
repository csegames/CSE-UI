/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyScenarioQueue } from '@csegames/library/dist/camelotunchained/graphql/schema';

interface ScenarioState {
  shouldScenarioRefresh: boolean;
  queue: MyScenarioQueue | null;
}

const DefaultScenarioState: ScenarioState = {
  shouldScenarioRefresh: false,
  queue: null
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState: DefaultScenarioState,
  reducers: {
    setShouldScenarioRefresh: (state, action: PayloadAction<boolean>) => {
      state.shouldScenarioRefresh = action.payload;
    },
    updateScenarioQueue: (state, action: PayloadAction<MyScenarioQueue>) => {
      state.queue = action.payload;
    }
  }
});

export const { setShouldScenarioRefresh, updateScenarioQueue } = scenarioSlice.actions;
