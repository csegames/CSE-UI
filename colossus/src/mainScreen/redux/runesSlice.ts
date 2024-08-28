/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RuneAlertBox {
  newCount: number; // number of newly added runes to display
  newBonus: number; // bonus pct for just the new runes
  visibleTimeout: any;
}

export interface RunesState {
  collectedRunes: { [key in RuneType]: number };
  runeBonuses: { [key in RuneType]: number };
  maxRunesAllowed: { [key in RuneType]: number };
  alertBoxes: { [key in RuneType]: RuneAlertBox };
}

const DefaultRunesState: RunesState = {
  collectedRunes: {
    [RuneType.Weapon]: 0,
    [RuneType.Protection]: 0,
    [RuneType.Health]: 0,
    [RuneType.CharacterMod]: 0,
    [RuneType.Count]: NaN
  },
  runeBonuses: {
    [RuneType.Weapon]: 0,
    [RuneType.Protection]: 0,
    [RuneType.Health]: 0,
    [RuneType.CharacterMod]: 0,
    [RuneType.Count]: NaN
  },
  maxRunesAllowed: {
    [RuneType.Weapon]: 100,
    [RuneType.Protection]: 100,
    [RuneType.Health]: 100,
    [RuneType.CharacterMod]: 100,
    [RuneType.Count]: NaN
  },
  alertBoxes: {
    [RuneType.Weapon]: {
      newCount: 0,
      newBonus: 0,
      visibleTimeout: null
    },
    [RuneType.Protection]: {
      newCount: 0,
      newBonus: 0,
      visibleTimeout: null
    },
    [RuneType.Health]: {
      newCount: 0,
      newBonus: 0,
      visibleTimeout: null
    },
    [RuneType.CharacterMod]: {
      newCount: 0,
      newBonus: 0,
      visibleTimeout: null
    },
    [RuneType.Count]: null
  }
};

export const runesSlice = createSlice({
  name: 'runes',
  initialState: DefaultRunesState,
  reducers: {
    updateRunes: (state: RunesState, action: PayloadAction<Partial<RunesState>>) => {
      const newState: RunesState = {
        ...state,
        ...action.payload
      };
      // Only need a return when replacing the old state.
      return newState;
    },
    hideRuneAlert: (state: RunesState, action: PayloadAction<RuneType>) => {
      state.alertBoxes[action.payload].visibleTimeout = null;
    }
  }
});

export const { updateRunes, hideRuneAlert } = runesSlice.actions;
