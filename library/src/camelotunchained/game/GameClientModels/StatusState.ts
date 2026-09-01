/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// This should map to UI::Entities::StatusState
export interface StatusState {
  id: number;
  duration: number; // may be modified/extended dynamically; different than StatusStat.Duration
  startTime: number;
  isDisabled: boolean;
  stats: Record<string, number>;
}
