/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Arc logic
export const PIo180 = Math.PI / 180;

export function getRadius(d: number) {
  return d * PIo180;
}

export function p2c(x: number, y: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: x + (radius * Math.cos(radians)),
    y: y + (radius * Math.sin(radians)),
  };
}

export function arc2path(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(x, y, radius, startAngle);
  const start = p2c(x, y, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

export function currentMax2circleDegrees(current: number, max: number) {
  return current / max * 360;
}