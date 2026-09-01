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
  AbilityEditStatus,
  AbilityStateFlags
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

export interface AbilityWithActivation extends AbilityStatus {
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
  abilities: Record<number, AbilityWithActivation>;
  // Kept in sync with abilities' displayDefID fields; only touched when an ability's displayDefID
  // actually changes (new ability, or a server-side ability swap/display update), not on routine
  // activation/cooldown updates.
  abilityIDsByDisplayDefID: Record<number, number>;
  preparingAbilityID: number | null;
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
    abilityIDsByDisplayDefID: {},
    preparingAbilityID: null
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
    updateAbility: (state: AbilitiesReduxState, action: PayloadAction<AbilityWithActivation>) => {
      const update = action.payload;
      const existing = state.abilities[update.id];
      if (existing) {
        // Ability swaps (e.g. stance-based re-skins) can change an existing ability's displayDefID
        // in place, so the old mapping needs to be dropped, not just the new one added.
        if (existing.displayDefID !== update.displayDefID) {
          delete state.abilityIDsByDisplayDefID[existing.displayDefID];
          state.abilityIDsByDisplayDefID[update.displayDefID] = update.id;
        }
        Object.assign(existing, update);
      } else {
        state.abilities[update.id] = update;
        state.abilityIDsByDisplayDefID[update.displayDefID] = update.id;
      }

      if ((update.state & AbilityStateFlags.Preparation) === AbilityStateFlags.Preparation) {
        state.preparingAbilityID = update.id;
      } else if (state.preparingAbilityID === update.id) {
        // This was the tracked ability leaving Preparation. Hand off to another ability still
        // preparing (e.g. a second track cast alongside this one) instead of just clearing.
        const stillPreparing = Object.values(state.abilities).find(
          (a) => (a.state & AbilityStateFlags.Preparation) === AbilityStateFlags.Preparation
        );
        state.preparingAbilityID = stillPreparing?.id ?? null;
      }
    },
    updateAbilityActivated: (state: AbilitiesReduxState, action: PayloadAction<UpdateAbilityActivatedParams>) => {
      // Abilities can only be activated after we've received their updateAbility event, so no need to check for presence.
      state.abilities[action.payload.abilityId].lastActivated = action.payload.timestamp;
    },
    clearAbilities: (state: AbilitiesReduxState) => {
      state.abilities = {};
      state.abilityIDsByDisplayDefID = {};
      state.preparingAbilityID = null;
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
  clearAbilities
} = abilitiesSlice.actions;
