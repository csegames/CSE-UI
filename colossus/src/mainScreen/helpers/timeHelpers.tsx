/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getTokenizedStringTableValue } from './stringTableHelpers';

export const StringIDGeneralCountdownDays = 'GeneralCountdownDays';
export const StringIDGeneralCountdownHours = 'GeneralCountdownHours';
export const StringIDGeneralCountdownMinutes = 'GeneralCountdownMinutes';

export function formatCountdown(
  seconds: number,
  stringTable: Dictionary<StringTableEntryDef>,
  maxComponents: number = 2
): string {
  let numComponents: number = 0;
  let countdown: string = '';
  var d = Math.floor(seconds / (3600 * 24));
  if (d > 0 && numComponents < maxComponents) {
    countdown += getTokenizedStringTableValue(StringIDGeneralCountdownDays, stringTable, {
      DAYS: d.toString()
    });
    numComponents += 1;
  }

  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  if (h > 0 && numComponents < maxComponents) {
    if (numComponents > 0) {
      countdown += ' ';
    }
    countdown += getTokenizedStringTableValue(StringIDGeneralCountdownHours, stringTable, {
      HOURS: h.toString()
    });
    numComponents += 1;
  }

  var m = Math.floor((seconds % 3600) / 60);
  if (m > 0 && numComponents < maxComponents) {
    if (numComponents > 0) {
      countdown += ' ';
    }
    countdown += getTokenizedStringTableValue(StringIDGeneralCountdownMinutes, stringTable, {
      MINUTES: m.toString()
    });
    numComponents += 1;
  }

  return countdown;
}
