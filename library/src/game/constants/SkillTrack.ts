/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare global {
  export enum SkillTrack {
    None = 0,
    PrimaryWeapon = 1 << 0,
    SecondaryWeapon = 1 << 1,
    BothWeapons = PrimaryWeapon | SecondaryWeapon,
    Voice = 1 << 2,
    Mind = 1 << 3,
    // any skill track with this flag has some sort of error or conflict.
    ErrorFlag = 1 << 28,
    // special flags that are not a fixed slot. skills using one of these
    // will end up using one of the slots, with the choice depending on what's currently
    // in use by other skills. use skill.resolvetrackchoices to compute that.
    EitherWeaponPreferPrimary = 1 << 29,
    EitherWeaponPreferSecondary = 1 << 30,
    ChoiceFlags = EitherWeaponPreferPrimary | EitherWeaponPreferSecondary,
    All = ~0 & ~(ChoiceFlags | ErrorFlag),
  }
  interface Window {
    SkillTrack: typeof SkillTrack;
  }
}
export enum SkillTrack {
  None = 0,
  PrimaryWeapon = 1 << 0,
  SecondaryWeapon = 1 << 1,
  BothWeapons = PrimaryWeapon | SecondaryWeapon,
  Voice = 1 << 2,
  Mind = 1 << 3,
  // any skill track with this flag has some sort of error or conflict.
  ErrorFlag = 1 << 28,
  // special flags that are not a fixed slot. skills using one of these
  // will end up using one of the slots, with the choice depending on what's currently
  // in use by other skills. use skill.resolvetrackchoices to compute that.
  EitherWeaponPreferPrimary = 1 << 29,
  EitherWeaponPreferSecondary = 1 << 30,
  ChoiceFlags = EitherWeaponPreferPrimary | EitherWeaponPreferSecondary,
  All = ~0 & ~(ChoiceFlags | ErrorFlag),
}
window.SkillTrack = SkillTrack;
