/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  enum HealthBarKind {
    FriendlyPlayer = 0,
    EnemyPlayer = 1,
    Item = 2,
  }

  interface Window {
    HealthBarKind: typeof HealthBarKind;
  }
}

enum HealthBarKind {
  FriendlyPlayer = 0,
  EnemyPlayer = 1,
  Item = 2,
}
window.HealthBarKind = HealthBarKind;
