/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function floatEquals(a: number, b: number, epsilon: number = 0.000000001) {
  return Math.abs(a - b) <= epsilon;
}

export function equals(a: number, b: number) {
  return floatEquals(a, b);
}

export function floatRound(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}
