/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  enum ItemGameplayType {
    None = 0,
    Throw = 1,
    Deploy = 2,
    Consume = 3,
  }

  interface Window {
    ItemGameplayType: typeof ItemGameplayType;
  }
}

enum ItemGameplayType {
  None = 0,
  Throw = 1,
  Deploy = 2,
  Consume = 3,
}
window.ItemGameplayType = ItemGameplayType;
