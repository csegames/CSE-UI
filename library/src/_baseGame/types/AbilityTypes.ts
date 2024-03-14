/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CurrentMax } from './CurrentMax';
import { TimeRange } from './TimeRange';

// this file should be maintained to mirror UIAbilityTrackerState.h

export enum AbilityStateFlags {
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

  UNAVAILABLE_MASK = Error | Disabled | Unusable
}

export enum AbilityErrorFlags {
  None = 0,
  NoAmmo = 1 << 0,
  NoWeapon = 1 << 1,
  NoSiegeEngine = 1 << 2,
  NotEnoughResource = 1 << 3,
  BlockedByStatus = 1 << 4,
  Other = 1 << 5,
  MAX_VALUE = (1 << 6) - 1
}

export enum AbilityTrackFlags {
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
  All = ~0 & ~(ChoiceFlags | ErrorFlag)
}

export interface AbilityEditStatus {
  canEdit: boolean;
  canAddButtons: boolean;
  requestedCanEdit: boolean;
}

export interface AbilityDisplayDef {
  id: number;
  name: string;
  iconClass: string;
  description: string;
  entityResourceID: number;
}

export interface AbilityStatus {
  id: number;
  state: AbilityStateFlags;
  errors: AbilityErrorFlags;
  tracks: AbilityTrackFlags;
  summonCount: number;
  displayDefID: number;
  timing: TimeRange;
  disruption: CurrentMax;
}

// ability length is variable and adjustable with the setVisibleAbilitySlots call
export interface AbilityGroup {
  id: number;
  isSystem: boolean;
  name: string;
  canDelete: boolean;
  canMove: boolean;
  canRename: boolean;
  canReplace: boolean;
  canResize: boolean;
  abilities: number[];
}

export interface ButtonLayout {
  id: number;
  canChangeGroup: boolean;
  canDelete: boolean;
  isSystem: boolean;
  keybindBegin: number; // inclusive
  keybindEnd: number; // exclusive
  groupID: number;
  groupCycle: number[];
}

export const NoAbilityId = -1;
