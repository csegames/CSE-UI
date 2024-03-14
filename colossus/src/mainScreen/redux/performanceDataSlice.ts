/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientPerformanceStats } from '@csegames/library/dist/_baseGame/types/ClientPerformanceStats';

export interface PerformanceData {
  // have we ever received a client stats update?
  haveClientData: boolean;

  // have tcp and udp bytes/sec both been zero for a few seconds?
  zeroTrafficWarning: boolean;

  // last stats data received from the client
  stats: ClientPerformanceStats;
}

function buildDefaultPerformanceData() {
  const DefaultPerfState: PerformanceData = {
    haveClientData: false,
    zeroTrafficWarning: false,
    stats: {
      avgFramesPerSec: 60.0,
      latencyAvgMS: 0.0,
      timeDelayMS: 0.0,
      syncsPerSec: 0.0,
      selfUpdatesPerSec: 0.0,
      tcpBytesPerSec: 0.0,
      udpBytesPerSec: 0.0
    }
  };
  return DefaultPerfState;
}

export const performanceDataSlice = createSlice({
  name: 'performanceData',
  initialState: buildDefaultPerformanceData(),
  reducers: {
    updateClientStats: (state: PerformanceData, action: PayloadAction<ClientPerformanceStats>) => {
      state.haveClientData = true;
      state.stats = action.payload;
    },
    updateZeroTrafficWarning: (state: PerformanceData, action: PayloadAction<boolean>) => {
      state.zeroTrafficWarning = action.payload;
    }
  }
});

export const { updateClientStats, updateZeroTrafficWarning } = performanceDataSlice.actions;
