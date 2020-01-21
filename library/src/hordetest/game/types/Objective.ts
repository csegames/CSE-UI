/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum ObjectiveUIVisibility {
    Hidden = 0,
    Hud = 1 << 0,
    Compass = 1 << 1,
    Alert = 1 << 2,

    All = (1 << 3) - 1,
  }

  interface Window {
    ObjectiveUIVisibility: typeof ObjectiveUIVisibility;
  }

  interface ObjectiveEntityState extends EntityStateModel {
    type: "item";
    iconClass: string;
    objective: {
      index: number;
      visibility: ObjectiveUIVisibility;
      state: ObjectiveState;
      progress: CurrentMax;
      bearingDegrees: number;
      footprintRadius: number;
    }
  }
}

enum ObjectiveUIVisibility {
  Hidden = 0,
  Hud = 1 << 0,
  Compass = 1 << 1,
  Alert = 1 << 2,

  All = (1 << 3) - 1,
}

window.ObjectiveUIVisibility = ObjectiveUIVisibility;
