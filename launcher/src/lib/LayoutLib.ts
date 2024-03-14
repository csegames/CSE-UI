/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export enum Quadrant {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

export function windowQuadrant(mouseX: number, mouseY: number) {
  const halfHeight = window.window.innerHeight * 0.5;
  if (mouseX <= window.window.innerWidth * 0.5) {
    return mouseY <= halfHeight ? Quadrant.TopLeft : Quadrant.BottomLeft;
  }
  return mouseY <= halfHeight ? Quadrant.TopRight : Quadrant.BottomRight;
}
