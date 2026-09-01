/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterCreationRestrictions, Faction, SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterManagementState {
  restrictions: CharacterCreationRestrictions | null;
  characterCreationState: CharacterCreationState | null;
  characters: SimpleCharacter[];
  selectedCharacterID: string | null;
}

export interface CharacterCreationState {
  factionID: Faction | null;
  raceID: string | null;
  classID: string | null;
  bodyTypeID: string | null;
  statLoadoutID: string | null;
  statsPoints: Record<string, number>;
  availableStatPoints: number;
}

const DefaultCharacterManagementState: CharacterManagementState = {
  restrictions: null,
  characterCreationState: null,
  selectedCharacterID: null,
  characters: []
};

export const defaultCharacterCreationState: CharacterCreationState = {
  factionID: null,
  raceID: null,
  classID: null,
  bodyTypeID: null,
  statLoadoutID: null,
  statsPoints: {},
  availableStatPoints: 0
};

export const charactersSlice = createSlice({
  name: 'characterManagement',
  initialState: DefaultCharacterManagementState,
  reducers: {
    updateCharacter: (state, action: PayloadAction<SimpleCharacter>) => {
      const index = state.characters.findIndex((c) => c.id == action.payload.id);
      if (index != -1) {
        state.characters.splice(index, 1);
      }
      state.characters.push(action.payload);
    },
    updateCharacters: (state, action: PayloadAction<SimpleCharacter[]>) => {
      state.characters = action.payload;
    },
    updateRestrictions: (state, action: PayloadAction<CharacterCreationRestrictions>) => {
      state.restrictions = action.payload;
    },
    removeCharacter: (state, action: PayloadAction<string>) => {
      const index = state.characters.findIndex((c) => c.id == action.payload);
      if (index != -1) {
        state.characters.splice(index, 1);
      }
    },
    selectCharacter: (state, action: PayloadAction<string | null>) => {
      state.selectedCharacterID = action.payload;
    },
    startCharacterCreation: (state) => {
      state.characterCreationState = { ...defaultCharacterCreationState };
    },
    selectFaction: (state, action: PayloadAction<Faction>) => {
      if (state.characterCreationState !== null) {
        if (state.characterCreationState.factionID !== action.payload) {
          state.characterCreationState = { ...defaultCharacterCreationState };
        }
        state.characterCreationState.factionID = action.payload;
      }
    },
    selectRace: (state, action: PayloadAction<string>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.raceID = action.payload;
      }
    },
    selectBodyType: (state, action: PayloadAction<string>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.bodyTypeID = action.payload;
      }
    },
    selectClass: (state, action: PayloadAction<string>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.classID = action.payload;
      }
    },
    selectStatLoadout: (state, action: PayloadAction<string>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.statLoadoutID = action.payload;
      }
    },
    setStatsPoints: (state, action: PayloadAction<{ [key: string]: number }>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.statsPoints = { ...state.characterCreationState.statsPoints, ...action.payload };
      }
    },
    setAvailableStatPoints: (state, action: PayloadAction<number>) => {
      if (state.characterCreationState !== null) {
        state.characterCreationState.availableStatPoints = action.payload;
      }
    },
    leaveCharacterCreation: (state) => {
      state.characterCreationState = null;
    }
  }
});

export const {
  updateCharacter,
  updateCharacters,
  updateRestrictions,
  removeCharacter,
  selectCharacter,
  startCharacterCreation,
  selectFaction,
  selectRace,
  selectBodyType,
  selectClass,
  selectStatLoadout,
  setStatsPoints,
  setAvailableStatPoints,
  leaveCharacterCreation
} = charactersSlice.actions;
