/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum BodyPart {
    Torso = 0,
    Head = 1,
    LeftArm = 2,
    RightArm = 3,
    LeftLeg = 4,
    RightLeg = 5,
  }
  interface Window {
    BodyPart: typeof BodyPart;
  }
}
enum BodyPart {
  Torso = 0,
  Head = 1,
  LeftArm = 2,
  RightArm = 3,
  LeftLeg = 4,
  RightLeg = 5,
}
window.BodyPart = BodyPart;
