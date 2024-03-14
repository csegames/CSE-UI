/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AbilityErrorFlags,
  AbilityStateFlags,
  AbilityStatus,
  AbilityTrackFlags
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';

export const basicAttack1ID: keyof AbilityState = 0;
export const basicAttack2ID: keyof AbilityState = 1;
export const weakAbilityID: keyof AbilityState = 2;
export const strongAbilityID: keyof AbilityState = 3;
export const ultimateAbilityID: keyof AbilityState = 4;

export enum MessageType {
  None = 0,
  NotEnoughResource,
  BlockedByStatus,
  OnCooldown
}

export interface Ability extends AbilityStatus {
  lastActivated?: Date;
}

export interface AbilityActivatedUpdate {
  id: number;
  timestamp: Date;
}

function createDefaultAbility(id: number): Ability {
  return {
    id,
    state: AbilityStateFlags.None,
    tracks: AbilityTrackFlags.None,
    errors: AbilityErrorFlags.None,
    timing: {
      start: 0,
      duration: 0
    },
    disruption: {
      current: NaN,
      max: NaN
    },
    summonCount: 0,
    displayDefID: 0
  };
}

export interface AbilityState {
  0: Ability;
  1: Ability;
  2: Ability;
  3: Ability;
  4: Ability;
}

const DefaultAbilityState: AbilityState = {
  0: createDefaultAbility(basicAttack1ID),
  1: createDefaultAbility(basicAttack2ID),
  2: createDefaultAbility(weakAbilityID),
  3: createDefaultAbility(strongAbilityID),
  4: createDefaultAbility(ultimateAbilityID)
};

export const abilitySlice = createSlice({
  name: 'ability',
  initialState: DefaultAbilityState,
  reducers: {
    updateAbility: (state: AbilityState, action: PayloadAction<AbilityStatus>) => {
      if (action.payload.id < 0 || action.payload.id > 4) return; // filter to what we care about
      const key = action.payload.id as keyof AbilityState;
      state[key] = {
        ...action.payload,
        lastActivated: state[key].lastActivated
      };
    },
    updateAbilityActivated: (state: AbilityState, action: PayloadAction<AbilityActivatedUpdate>) => {
      if (action.payload.id < 0 || action.payload.id > 4) return; // filter to what we care about
      const key = action.payload.id as keyof AbilityState;
      state[key].lastActivated = action.payload.timestamp;
    }
  }
});

export const { updateAbility, updateAbilityActivated } = abilitySlice.actions;
