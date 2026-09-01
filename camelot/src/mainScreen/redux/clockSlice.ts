/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const CLOCK_DELTA_COUNT = 7;
let recentServerDeltas: number[] = [];

function addServerDelta(delta: number): void {
  // Remove the oldest value (if any).
  recentServerDeltas.shift();
  do {
    // Always push at least once, but this also fills up the array on the first result so we can do math.
    recentServerDeltas.push(delta);
  } while (recentServerDeltas.length < CLOCK_DELTA_COUNT);
}

function calculateAverageServerDelta(): number {
  // Ignore the highest and lowest number, and average the rest.
  // This allows us to avoid big time warps if the connection is unstable.
  const lowestIndex = recentServerDeltas.indexOf(Math.min(...recentServerDeltas));
  const highestIndex = recentServerDeltas.indexOf(Math.max(...recentServerDeltas));
  const averageDelta =
    recentServerDeltas.reduce<number>((soFar: number, delta: number, index: number) => {
      return soFar + (index !== lowestIndex && index !== highestIndex ? delta : 0);
    }, 0) /
    (CLOCK_DELTA_COUNT - 2);

  return averageDelta;
}

// BEGIN INTERFACES AND STATES

interface ClockState {
  serverTimeDeltaMS: number;
}

function generateDefaultClockState(): ClockState {
  const defaultClockState: ClockState = {
    serverTimeDeltaMS: 0
  };

  return defaultClockState;
}

export const clockSlice = createSlice({
  name: 'clock',
  initialState: generateDefaultClockState(),
  reducers: {
    updateServerTimeDelta: (state: ClockState, action: PayloadAction<string>) => {
      addServerDelta(getServerTimeDeltaFromTimestamp(action.payload));
      state.serverTimeDeltaMS = calculateAverageServerDelta();
    }
  }
});

export function getServerTimeDeltaFromTimestamp(serverTimestamp: string): number {
  const serverTimeMS: number = new Date(serverTimestamp).getTime();
  const localTimeMS: number = Date.now();

  // If local says 10:00:00.000 and server says 10:00:00.005, then the delta is -0.005.
  return serverTimeMS - localTimeMS;
}

export function getServerTimeMS(state: ClockState): number {
  return Date.now() + state.serverTimeDeltaMS;
}

export function getMSUntil(state: ClockState, serverTime: string): number {
  return new Date(serverTime).valueOf() - getServerTimeMS(state);
}

export const { updateServerTimeDelta } = clockSlice.actions;
