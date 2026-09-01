/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PerformanceWarningsModel } from '@csegames/library/dist/_baseGame/types/PerformanceWarnings';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { PerformanceWarningEntryDef } from '../dataSources/manifest/performanceWarningManifest';

interface PerformanceWarningsState {
  activePerformanceWarningIDs: string[];
  performanceWarnings: Dictionary<PerformanceWarningEntryDef>;
}

const initialState: PerformanceWarningsState = {
  activePerformanceWarningIDs: [],
  performanceWarnings: {}
};

export const performanceWarningsSlice = createSlice({
  name: 'performanceWarnings',
  initialState,
  reducers: {
    updateActivePerformanceWarnings: (
      state: PerformanceWarningsState,
      action: PayloadAction<PerformanceWarningsModel>
    ) => {
      state.activePerformanceWarningIDs = action.payload.ids;
    },
    updatePerformanceWarnings: (
      state: PerformanceWarningsState,
      action: PayloadAction<Dictionary<PerformanceWarningEntryDef>>
    ) => {
      state.performanceWarnings = action.payload;
    }
  }
});

export const { updateActivePerformanceWarnings, updatePerformanceWarnings } = performanceWarningsSlice.actions;
