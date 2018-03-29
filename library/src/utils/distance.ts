/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { Vec2f, Vec3f } from '../webAPI/definitions'

export function distanceVec2(positionOne: Vec2f, positionTwo: Vec2f) {
  if (!positionOne || !positionTwo) return;
  const xDiff = positionTwo.x - positionOne.x;
  const yDiff = positionTwo.y - positionOne.y;
  const sumOfDiff = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
  return Math.sqrt(sumOfDiff);
}

export function distanceVec3(positionOne: Vec3f, positionTwo: Vec3f) {
  if (!positionOne || !positionTwo) return;

  const xDiff = positionTwo.x - positionOne.x;
  const yDiff = positionTwo.y - positionOne.y;
  const zDiff = positionTwo.z - positionOne.z;
  const sumOfDiff = Math.pow(xDiff, 2) + Math.pow(yDiff, 2) + Math.pow(zDiff, 2);
  return Math.sqrt(sumOfDiff);
}
