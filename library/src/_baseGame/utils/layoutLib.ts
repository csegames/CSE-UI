/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Quadrant } from '../types/Quadrant';

export function windowQuadrant(mouseX: number, mouseY: number) {
  const innerHeight = window.window.innerHeight;
  const innerWidth = window.window.innerWidth;
  const halfHeight = innerHeight * 0.5;
  if (mouseX <= innerWidth * 0.5) {
    return mouseY <= halfHeight ? Quadrant.TopLeft : Quadrant.BottomLeft;
  }
  return mouseY <= halfHeight ? Quadrant.TopRight : Quadrant.BottomRight;
}
