/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface QuestProgress {}

export interface QuestState {
  questDataID: string;
  progress: Record<string, number>;
  isCompleted: boolean;
  isCollectible: boolean;
  isRewarded: boolean;
}

export interface QuestsSnapshot {
  rolloverTime: string; // Timestamp of the next system rollOver event (one event for all periodic quests).
  quests: Record<string, QuestState>; // Key is a questInstanceID.
}
