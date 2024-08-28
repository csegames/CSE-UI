/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyScenarioQueue } from '@csegames/library/dist/camelotunchained/graphql/schema';

interface ScenarioState {
  queue: MyScenarioQueue | null;
}

const DefaultScenarioState: ScenarioState = {
  queue: null
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState: DefaultScenarioState,
  reducers: {
    updateScenarioQueue: (state, action: PayloadAction<MyScenarioQueue>) => {
      state.queue = action.payload;
    }
  }
});

export const { updateScenarioQueue } = scenarioSlice.actions;
