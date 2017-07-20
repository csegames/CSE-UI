/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 11:42:35
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-25 17:25:49
 */

export enum Orientation {
  HORIZONTAL,
  VERTICAL,
}

export enum Quadrant {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

export function windowQuadrant(mouseX: number, mouseY: number) {
  const innerHeight = window.window.innerHeight;
  const innerWidth = window.window.innerWidth;
  const halfHeight = innerHeight * .5;
  if (mouseX <= innerWidth * .5) {
    return mouseY <= halfHeight ? Quadrant.TopLeft : Quadrant.BottomLeft;
  }
  return mouseY <= halfHeight ? Quadrant.TopRight : Quadrant.BottomRight;
}
