/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum ItemPlacementTransformMode {
    Translate = 0,
    Rotate = 1,
    Scale = 2,
  }
  interface Window {
    ItemPlacementTransformMode: typeof ItemPlacementTransformMode;
  }
}
enum ItemPlacementTransformMode {
  Translate = 0,
  Rotate = 1,
  Scale = 2,
}
window.ItemPlacementTransformMode = ItemPlacementTransformMode;