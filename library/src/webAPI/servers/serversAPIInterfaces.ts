/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-13 12:44:18
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-13 12:44:40
 */

export enum ServerAccessLevel {
  Offline = -1,
  Public = 0,
  Beta3 = 1,
  Beta2 = 2,
  Beta1 = 3,
  Alpha = 4,
  IT = 5,
  CSE = 6,
}

export function serverAccessLevelToString(s: ServerAccessLevel): string {
  switch (s) {
    case ServerAccessLevel.Offline: return 'No one';
    case ServerAccessLevel.Public: return 'Everyone';
    case ServerAccessLevel.Beta3: return 'Beta 1/2/3, Alpha, and IT';
    case ServerAccessLevel.Beta2: return 'Beta 1/2, Alpha, and IT';
    case ServerAccessLevel.Beta1: return 'Beta 1, Alpha, and IT';
    case ServerAccessLevel.Alpha: return 'Alpha and IT';
    case ServerAccessLevel.IT: return 'IT';
    case ServerAccessLevel.CSE: return 'Employees';
  }
}

export interface Server {
  accessLevel: ServerAccessLevel,
  host: string,
  name: string,
  playerMaximum: number,
  channelID: number,
  shardID: number,
  arthurians?: number,
  tuathaDeDanann?: number,
  vikings?: number,
  max?: number,
}
