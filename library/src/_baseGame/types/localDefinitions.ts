/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO : these types are imported from the webapi in game specific definition files and should not be injected from there into cross-game code. Determine their long-term future.
export interface Vec2f {
  x: number;
  y: number;
}

export interface Vec3f {
  x: number;
  y: number;
  z: number;
}

export enum AnnouncementType {
  Text = 1,
  PopUp = 2,
  Worldspace = 4,
  PassiveAlert = 8,
  Victory = 16,
  Defeat = 32,
  Dialogue = 64,
  ObjectiveSuccess = 128,
  ObjectiveFail = 256,
  ALL = -1
}

export type EntityID = string;
