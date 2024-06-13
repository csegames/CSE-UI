/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// See also Game/MMO/Client/ClientLib/PerformanceData.h
export interface WarningIconsModel {
  icons: string[];
}

export function warningIconsEqual(iconsA: WarningIconsModel, iconsB: WarningIconsModel): boolean {
  if (iconsA.icons == iconsB.icons) return true;
  if (!iconsA.icons || !iconsB.icons) return false;
  if (iconsA.icons.length != iconsB.icons.length) return false;

  for (var i = 0; i < iconsA.icons.length; ++i) {
    if (iconsB.icons.includes(iconsA.icons[i]) == false) {
      return false;
    }
  }

  return true;
}
