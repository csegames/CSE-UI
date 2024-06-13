/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { RuneModLevelDisplayDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RuneAlertBox {
  newCount: number; // number of newly added runes to display
  newBonus: number; // bonus pct for just the new runes
  visibleTimeout: any;
}

export interface RunesState {
  runeModDisplay: RuneModLevelDisplayDef[];
  collectedRunes: { [key in RuneType]: number };
  runeBonuses: { [key in RuneType]: number };
  maxRunesAllowed: { [key in RuneType]: number };
  runeModLevels: number[];
  alertBoxes: { [key in RuneType]: RuneAlertBox };
}

const DefaultRunesState: RunesState = {
  runeModDisplay: [],
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
  },
  runeModLevels: []
};

export const runesSlice = createSlice({
  name: 'runes',
  initialState: DefaultRunesState,
  reducers: {
    updateRuneModDisplay: (state: RunesState, action: PayloadAction<RuneModLevelDisplayDef[]>) => {
      state.runeModDisplay = action.payload;
    },
    updateRunes: (state: RunesState, action: PayloadAction<Partial<RunesState>>) => {
      const newState: RunesState = {
        ...state,
        ...action.payload
      };
      // Only need a return when replacing the old state.
      return newState;
    },
    updateRuneModLevels: (state: RunesState, action: PayloadAction<number[]>) => {
      state.runeModLevels = action.payload;
    },
    hideRuneAlert: (state: RunesState, action: PayloadAction<RuneType>) => {
      state.alertBoxes[action.payload].visibleTimeout = null;
    }
  }
});

export const { updateRuneModDisplay, updateRunes, updateRuneModLevels, hideRuneAlert } = runesSlice.actions;
