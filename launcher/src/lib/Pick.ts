/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type Pick2<T, K1 extends keyof T, K2 extends keyof T[K1]> = { [P1 in K1]: { [P2 in K2]: T[K1][P2] } };

export type Pick3<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]> = {
  [P1 in K1]: { [P2 in K2]: { [P3 in K3]: T[K1][K2][P3] } };
};
