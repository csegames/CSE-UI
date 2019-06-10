/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum StatusAction {
    Added = 0,
    Removed = 1,
  }
  interface Window {
    StatusAction: typeof StatusAction;
  }
}
enum StatusAction {
  Added = 0,
  Removed = 1,
}
window.StatusAction = StatusAction;
