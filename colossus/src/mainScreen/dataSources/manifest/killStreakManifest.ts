/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateKillStreaks } from '../../redux/gameSlice';

export const killStreakManifestID = 'killstreaks';

export interface KillStreakDef {
  killCount: number;
  text: string;
  audioEventID: number;
}

export function processKillStreaks(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isKillStreakData)) {
    console.error('Invalid kill streaks manifest file');
    return;
  }

  const killStreaks: KillStreakDef[] = [];
  for (const killStreak of json.defs) {
    switch (version) {
      case 1:
        killStreaks.push({
          killCount: killStreak.killCount,
          text: killStreak.text,
          audioEventID: Number(killStreak.audioEventID)
        });
        break;
    }
  }

  dispatch(updateKillStreaks(killStreaks));
}

function isKillStreakData(obj: any): boolean {
  const isCorrectType = Object.keys(obj).length === 3 && 'killCount' in obj && 'text' in obj && 'audioEventID' in obj;

  if (!isCorrectType) {
    console.error(`Found invalid SkillStreak object`, obj);
  }
  return isCorrectType;
}
