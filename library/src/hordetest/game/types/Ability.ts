/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum AbilityButtonType {
    Standard = 0,
    Modal = 1,
  }

  enum AbilityButtonState {
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

  enum AbilityButtonErrorFlag {
    None = 0,
    NoAmmo = 1 << 0,
    NoWeapon = 1 << 1,
    NotEnoughResource = 1 << 2,
    BlockedByStatus = 1 << 3,
    Other = 1 << 4,
  }

  enum AbilityTrack {
    None = 0,
    PrimaryWeapon = 1 << 0,
    SecondaryWeapon = 1 << 1,
    BothWeapons = PrimaryWeapon | SecondaryWeapon,
    Voice = 1 << 2,
    Mind = 1 << 3,
    // any ability track with this flag has some sort of error or conflict.
    ErrorFlag = 1 << 28,
    // special flags that are not a fixed slot. abilities using one of these
    // will end up using one of the slots, with the choice depending on what's currently
    // in use by other abilities. use ability.resolvetrackchoices to compute that.
    EitherWeaponPreferPrimary = 1 << 29,
    EitherWeaponPreferSecondary = 1 << 30,
    ChoiceFlags = EitherWeaponPreferPrimary | EitherWeaponPreferSecondary,
    All = ~0 & ~(ChoiceFlags | ErrorFlag),
  }

  interface Timing {
    start: number; // time in ms when this thing started
    duration: number; // time in ms this should run for
  }

  interface ClientAbilityBarItem {
    id: number;
    keybind: number;
    boundKeyName: string;
  }

  interface Window {
    AbilityButtonType: typeof AbilityButtonType;
    AbilityButtonState: typeof AbilityButtonState;
    AbilityButtonErrorFlag: typeof AbilityButtonErrorFlag;
    AbilityTrack: typeof AbilityTrack;
  }
}

enum AbilityButtonType {
  Standard = 0,
  Modal = 1,
}
window.AbilityButtonType = AbilityButtonType;

enum AbilityButtonState {
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
window.AbilityButtonState = AbilityButtonState;

enum AbilityButtonErrorFlag {
  None = 0,
  NoAmmo = 1 << 0,
  NoWeapon = 1 << 1,
  NotEnoughResource = 1 << 2,
  BlockedByStatus = 1 << 3,
  Other = 1 << 4,
}
window.AbilityButtonErrorFlag = AbilityButtonErrorFlag;

enum AbilityTrack {
  None = 0,
  PrimaryWeapon = 1 << 0,
  SecondaryWeapon = 1 << 1,
  BothWeapons = PrimaryWeapon | SecondaryWeapon,
  Voice = 1 << 2,
  Mind = 1 << 3,
  // any ability track with this flag has some sort of error or conflict.
  ErrorFlag = 1 << 28,
  // special flags that are not a fixed slot. abilities using one of these
  // will end up using one of the slots, with the choice depending on what's currently
  // in use by other abilities. use ability.resolvetrackchoices to compute that.
  EitherWeaponPreferPrimary = 1 << 29,
  EitherWeaponPreferSecondary = 1 << 30,
  ChoiceFlags = EitherWeaponPreferPrimary | EitherWeaponPreferSecondary,
  All = ~0 & ~(ChoiceFlags | ErrorFlag),
}
window.AbilityTrack = AbilityTrack;
