/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export {};

declare global {
  enum ScenarioRoundState {
    Uninitialized = 0,
    Initializing = 1,
    WaitingForConnections = 2,
    Countdown = 3,
    Running = 4,
    Ended = 5,
  }

  interface Window {
    ScenarioRoundState: typeof ScenarioRoundState;
  }
}

enum ScenarioRoundState {
  Uninitialized,
  Initializing,
  WaitingForConnections,
  Countdown,
  Running,
  Ended,
}
window.ScenarioRoundState = ScenarioRoundState;
