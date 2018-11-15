/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  interface Number {
    floatEquals(n: number, epsilon?: number): boolean;
  }
}

Number.prototype.floatEquals = function(n: number, epsilon: number = Number.EPSILON) {
  return (Math.abs(this - n) < epsilon);
};
