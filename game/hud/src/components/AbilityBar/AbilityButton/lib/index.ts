/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export * from './styles';


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

export function time2circleDegrees(current: number, end: number) {
  return current / end * 360;
}

export function arc2path(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(x, y, radius, startAngle);
  const start = p2c(x, y, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

export function makeGlowPathFor(end: number,
                                current: number,
                                x: number,
                                y: number,
                                radius: number,
                                clockwise: boolean) {
  // generate outerPath for percent curve
  const degrees = time2circleDegrees(current, end);
  const path = arc2path(x, y, radius, 0, clockwise ? 360 - degrees : degrees);
  return path;
}

export function getTimingEnd(timing: DeepImmutableObject<Timing>) {
  return timing.start + timing.duration;
}

export function getDisruptionEnd(disruption: DeepImmutableObject<Timing>) {
  return disruption.start + disruption.duration;
}
