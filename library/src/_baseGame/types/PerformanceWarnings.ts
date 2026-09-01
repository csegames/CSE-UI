/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// See also Game/MMO/Client/ClientLib/PerformanceData.h
export interface PerformanceWarningsModel {
  ids: string[];
}

export function performanceWarningsEqual(
  performanceWarningsA: PerformanceWarningsModel,
  performanceWarningsB: PerformanceWarningsModel
): boolean {
  if (performanceWarningsA.ids == performanceWarningsB.ids) return true;
  if (!performanceWarningsA.ids || !performanceWarningsB.ids) return false;
  if (performanceWarningsA.ids.length != performanceWarningsB.ids.length) return false;

  for (var i = 0; i < performanceWarningsA.ids.length; ++i) {
    if (performanceWarningsB.ids.includes(performanceWarningsA.ids[i]) == false) {
      return false;
    }
  }

  return true;
}
