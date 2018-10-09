/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum SkillButtonType {
    Standard = 0,
    Modal = 1,
  }

  enum SkillButtonState {
    None = 0,
    Ready = 1 << 0,
    Unusable = 1 << 1,
    Disabled = 1 << 2,
    Queued = 1 << 3,
    Preparation = 1 << 4,
    Channel = 1 << 5,
    Running = 1 << 6,
    Recovery = 1 << 7,
    Cooldown = 1 << 8,
    Error = 1 << 9,
    Held = 1 << 10,
  }

  enum SkillButtonErrorFlag {
    None = 0,
    NoAmmo = 1 << 0,
    NoWeapon = 1 << 1,
  }

  interface Timing {
    start: number; // time in ms when this thing started
    duration: number; // time in ms this should run for
  }

  interface ClientSkillBarItem {
    id: number;
    keybind: number;
    boundKeyName: string;
  }

  interface Window {
    SkillButtonType: typeof SkillButtonType;
    SkillButtonState: typeof SkillButtonState;
    SkillButtonErrorFlag: typeof SkillButtonErrorFlag;
  }
}

enum SkillButtonType {
  Standard = 0,
  Modal = 1,
}
window.SkillButtonType = SkillButtonType;

enum SkillButtonState {
  None = 0,
  Ready = 1 << 0,
  Unusable = 1 << 1,
  Disabled = 1 << 2,
  Queued = 1 << 3,
  Preparation = 1 << 4,
  Channel = 1 << 5,
  Running = 1 << 6,
  Recovery = 1 << 7,
  Cooldown = 1 << 8,
  Error = 1 << 9,
  Held = 1 << 10,
}
window.SkillButtonState = SkillButtonState;

enum SkillButtonErrorFlag {
  None = 0,
  NoAmmo = 1 << 0,
  NoWeapon = 1 << 1,
}
window.SkillButtonErrorFlag = SkillButtonErrorFlag;
