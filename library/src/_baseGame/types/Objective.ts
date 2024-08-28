/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface ObjectiveDetailMessageState {
  messageID: string;
  title: string;
  text: string;
  category: ObjectiveDetailCategory;
  state: ObjectiveDetailState;
  maxCount: number;
  currentCount: number;
  totalTime: number;
  startTime: number;
}

export enum ObjectiveUIVisibility {
  Hidden = 0,
  Hud = 1 << 0,
  Compass = 1 << 1,
  Alert = 1 << 2,
  World = 1 << 3,
  WorldDistance  = 1 << 4,
  Map = 1 << 5,
  ScreenEdge = 1 << 6,

  All = (1 << 7) - 1
}

export enum ObjectiveDetailCategory {
  Primary = 0,
  MainQuest = 1,
  SideQuest = 2
}

export enum ObjectiveDetailState {
  InProgress = 0,
  CompletedSuccess = 1,
  CompletedFailed = 2
}
