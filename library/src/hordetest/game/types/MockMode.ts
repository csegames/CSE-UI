/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum MockMode {
    None = 0,
    TotalNetworkFailure = 1,
    PartialNetworkFailure = 2,
    BadServerData = 3
  }

  interface Window {
    MockMode: typeof MockMode;
  }
}

enum MockMode {
  None = 0,
  TotalNetworkFailure = 1,
  PartialNetworkFailure = 2,
  BadServerData = 3
}
window.MockMode = MockMode;