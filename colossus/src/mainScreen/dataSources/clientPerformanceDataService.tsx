/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { floatEquals } from '@csegames/library/dist/_baseGame/utils/mathExtensions';
import { ClientPerformanceStats } from '@csegames/library/dist/_baseGame/types/ClientPerformanceStats';
import { updateClientStats, updateZeroTrafficWarning } from '../redux/performanceDataSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import ExternalDataSource from '../redux/externalDataSource';

// If we have no traffic (tcp or udp) at all for this amount of time, show a warning icon
const ZeroTrafficWarningThresholdMs = 4000;

export class ClientPerformanceDataService extends ExternalDataSource {
  private timeSinceTrafficWasZeroMs: number | null = null;
  private updated: boolean = false;

  public bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindClientPerformanceListener(this.handlePerformanceStatsUpdate.bind(this))]);
  }

  private handlePerformanceStatsUpdate(stats: ClientPerformanceStats) {
    this.dispatch(updateClientStats(stats));

    if (!this.updated) {
      // skip delta calculation on first update
      this.updated = true;
      return;
    }

    const warningActive = this.reduxState.performanceData.zeroTrafficWarning;
    const currentlyZeroTraffic = // note : if client could not calculate, it will return -1
      floatEquals(stats.tcpBytesPerSec, 0, 0.01) &&
      floatEquals(stats.udpBytesPerSec, 0, 0.01) &&
      floatEquals(stats.selfUpdatesPerSec, 0, 0.01);

    if (!currentlyZeroTraffic) {
      this.timeSinceTrafficWasZeroMs = null;
      if (warningActive) this.dispatch(updateZeroTrafficWarning(false));
    } else if (!this.timeSinceTrafficWasZeroMs) {
      this.timeSinceTrafficWasZeroMs = Date.now();
    } else if (this.timeSinceTrafficWasZeroMs < Date.now() - ZeroTrafficWarningThresholdMs && !warningActive) {
      this.dispatch(updateZeroTrafficWarning(true));
    }
  }
}
