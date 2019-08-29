/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  interface Math {
    equals(a: number, b: number): boolean;
    floatEquals(a: number, b: number, epsilon?: number): boolean;
    floatRound(a: number, decimals: number): number;
  }
}

Math.equals = function equals(a: number, b: number) {
  return Math.floatEquals(a, b);
};

Math.floatEquals = function(a: number, b: number, epsilon: number = 0.000000001) {
  return Math.abs(a - b) <= epsilon;
};

Math.floatRound = function(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};
