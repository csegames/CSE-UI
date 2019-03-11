/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// @ts-ignore
import * as React from 'react';

interface MediaBreakpoints {
  UHDWidth: number;
  UHDHeight: number;

  MidWidth: number;
  MidHeight: number;

  SmallScreen: number;
}

export const MediaBreakpoints: MediaBreakpoints = {
  UHDWidth: 3001,
  UHDHeight: 1801,
  MidWidth: 2001,
  MidHeight: 1201,
  SmallScreen: 1640,
};
