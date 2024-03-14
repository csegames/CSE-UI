/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AbilityStatus,
  ButtonLayout,
  AbilityGroup,
  AbilityEditStatus
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

export interface Ability extends AbilityStatus {
  lastActivated?: Date;
}

export interface UpdateAbilityActivatedParams {
  abilityId: number;
  timestamp: Date;
}

export interface AbilitiesReduxState {
  editStatus: AbilityEditStatus;
  layouts: Dictionary<ButtonLayout>;
  groups: Dictionary<AbilityGroup>;
  abilities: Dictionary<Ability>;
  nowEditingAbilityId: number | null;
}

function buildDefaultAbilitiesReduxState(): AbilitiesReduxState {
  const DefaultAbilitiesReduxState: AbilitiesReduxState = {
    editStatus: {
      canEdit: false,
      canAddButtons: false,
      requestedCanEdit: false
    },
    layouts: {},
    groups: {},
    abilities: {},
    nowEditingAbilityId: null
  };
  return DefaultAbilitiesReduxState;
}

export const abilitiesSlice = createSlice({
  name: 'actionBars',
  initialState: buildDefaultAbilitiesReduxState(),
  reducers: {
    updateAbilityEditStatus: (state: AbilitiesReduxState, action: PayloadAction<AbilityEditStatus>) => {
      state.editStatus = action.payload;
    },
    updateAbilityButtonLayout: (state: AbilitiesReduxState, action: PayloadAction<ButtonLayout>) => {
      state.layouts[action.payload.id] = action.payload;
    },
    deleteAbilityButtonLayout: (state: AbilitiesReduxState, action: PayloadAction<number>) => {
      delete state.layouts[action.payload];
    },
    updateAbilityGroup: (state: AbilitiesReduxState, action: PayloadAction<AbilityGroup>) => {
      state.groups[action.payload.id] = action.payload;
    },
    deleteAbilityGroup: (state: AbilitiesReduxState, action: PayloadAction<number>) => {
      delete state.groups[action.payload];
    },
    updateAbility: (state: AbilitiesReduxState, action: PayloadAction<Ability>) => {
      if (state.abilities[action.payload.id]) {
        Object.assign(state.abilities[action.payload.id], action.payload);
      } else {
        state.abilities[action.payload.id] = action.payload;
      }
    },
    updateAbilityActivated: (state: AbilitiesReduxState, action: PayloadAction<UpdateAbilityActivatedParams>) => {
      // Abilities can only be activated after we've received their updateAbility event, so no need to check for presence.
      state.abilities[action.payload.abilityId].lastActivated = action.payload.timestamp;
    },
    deleteAbility: (state: AbilitiesReduxState, action: PayloadAction<number>) => {
      delete state.abilities[action.payload];
      if (state.nowEditingAbilityId === action.payload) {
        state.nowEditingAbilityId = null;
      }
    },
    setNowEditingAbilityId: (state: AbilitiesReduxState, action: PayloadAction<number>) => {
      state.nowEditingAbilityId = action.payload;
    }
  }
});

export const {
  updateAbilityEditStatus,
  updateAbilityButtonLayout,
  deleteAbilityButtonLayout,
  updateAbilityGroup,
  deleteAbilityGroup,
  updateAbility,
  updateAbilityActivated,
  deleteAbility,
  setNowEditingAbilityId
} = abilitiesSlice.actions;
