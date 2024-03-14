/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

interface ClockState {
  minuteTicker: number;
  serverTimeDeltaMS: number;
}

function generateDefaultClockState(): ClockState {
  const defaultClockState: ClockState = {
    minuteTicker: 0,
    serverTimeDeltaMS: 0
  };

  return defaultClockState;
}

export const clockSlice = createSlice({
  name: 'clock',
  initialState: generateDefaultClockState(),
  reducers: {
    updateClockMinuteTicker: (state: ClockState) => {
      state.minuteTicker += 1;
    },
    updateServerTimeDelta: (state: ClockState, action: PayloadAction<string>) => {
      const serverTimeMS: number = new Date(action.payload).valueOf();
      const localTimeMS: number = Date.now();

      // If local says 10:00:00.000 and server says 10:00:00.005, then the delta is -0.005.
      state.serverTimeDeltaMS = serverTimeMS - localTimeMS;
    }
  }
});

export const { updateClockMinuteTicker, updateServerTimeDelta } = clockSlice.actions;
