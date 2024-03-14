/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { floatEquals } from '../utils/mathExtensions';

// See also Game/MMO/Client/ClientLib/PerformanceData.h
export interface ClientPerformanceStats {
  avgFramesPerSec: number; // fps (int)
  latencyAvgMS: number; // average client -> server ping time (int)
  timeDelayMS: number; // being behind server in world time (int)
  syncsPerSec: number; // user far from server position (float)
  selfUpdatesPerSec: number; // player updates per second (float)
  tcpBytesPerSec: number; // network traffic (tcp) (float)
  udpBytesPerSec: number; // network traffic (udp) (float)
}

export function clientPerformanceStatsEqual(statsA: ClientPerformanceStats, statsB: ClientPerformanceStats, epsilon: number = 0.001): boolean {
  return (statsA.avgFramesPerSec === statsB.avgFramesPerSec
    && floatEquals(statsA.latencyAvgMS, statsB.latencyAvgMS, epsilon)
    && statsA.timeDelayMS === statsB.timeDelayMS
    && floatEquals(statsA.syncsPerSec, statsB.syncsPerSec, epsilon)
    && floatEquals(statsA.selfUpdatesPerSec, statsB.selfUpdatesPerSec, epsilon)
    && floatEquals(statsA.tcpBytesPerSec, statsB.tcpBytesPerSec, epsilon)
    && floatEquals(statsA.udpBytesPerSec, statsB.udpBytesPerSec, epsilon)
  );
}
