/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ScenarioDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export interface ScenariosState {
  scenarioDefs: Dictionary<ScenarioDefGQL>;
}

function generateDefaultScenariosState() {
  const defaultScenariosState: ScenariosState = {
    scenarioDefs: {}
  };
  return defaultScenariosState;
}

export const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState: generateDefaultScenariosState(),
  reducers: {
    updateScenarioDefs: (state: ScenariosState, action: PayloadAction<Dictionary<ScenarioDefGQL>>) => {
      state.scenarioDefs = action.payload;
    }
  }
});

export const { updateScenarioDefs } = scenariosSlice.actions;
