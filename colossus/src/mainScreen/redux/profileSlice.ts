/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MatchStatsGQL, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ProfileGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

// We are only fetching a subset of the fields in ProfileGQL, so we don't include the others
// in this interface.
export type ProfileModel = Pick<
  ProfileGQL,
  'champions' | 'dailyQuestResets' | 'defaultChampionID' | 'lifetimeStats' | 'perks' | 'quests' | 'timeOffsetSeconds'
  // For 'lifetimeStats', items in the array are split into scenarios. If an item in the array contains a
  // null scenarioID, that is the stats of all the scenarios combined.
>;

interface ProfileState extends ProfileModel {
  allTimeStats: MatchStatsGQL;
  /**
   * We pre-calculate this because it's way faster than iterating a PerkDBModel array every single time
   * we need to check if you own something (and how many you've got).
   *   key: perkID
   *   value: number owned */
  ownedPerks: Dictionary<number>;
  /**
   * Dictionary[Champion.id] = (PerkDefGQL[])
   * Dictionary of the different champions' selected rune mods
   */
  selectedRuneMods: Dictionary<PerkDefGQL[]>;
  isProfileFetched: boolean;
  /**
   * A locally-incremented value that tracks the number of times Profile has been updated from the server.
   * Can be used to detect that an explicit refresh has completed.
   */
  localProfileVersion: number;
  shouldProfileRefresh: boolean;
  onProfileRefreshes: (() => void)[];
}

function generateDefaultProfileState() {
  const defaultProfileState: ProfileState = {
    champions: [],
    dailyQuestResets: 0,
    defaultChampionID: null,
    lifetimeStats: [],
    quests: [],
    perks: [],
    allTimeStats: null,
    ownedPerks: {},
    selectedRuneMods: {},
    timeOffsetSeconds: 0,
    isProfileFetched: false,
    localProfileVersion: 0,
    shouldProfileRefresh: false,
    onProfileRefreshes: []
  };
  return defaultProfileState;
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: generateDefaultProfileState(),
  reducers: {
    updateProfile: (state: ProfileState, action: PayloadAction<ProfileModel>) => {
      Object.assign(state, action.payload);
      state.allTimeStats = action.payload.lifetimeStats.find((stats) => stats.scenarioID == null);
      state.isProfileFetched = true;
      state.localProfileVersion = state.localProfileVersion + 1;
    },
    updateOwnedPerks: (state: ProfileState, action: PayloadAction<Dictionary<number>>) => {
      state.ownedPerks = action.payload;
    },
    updateSelectedRuneMods: (state: ProfileState, action: PayloadAction<Dictionary<PerkDefGQL[]>>) => {
      state.selectedRuneMods = action.payload;
    },
    startProfileRefresh: (state: ProfileState, action: PayloadAction<(() => void) | undefined>) => {
      state.shouldProfileRefresh = true;
      if (action.payload) {
        state.onProfileRefreshes.push(action.payload);
      }
    },
    markProfileRefreshStarted: (state: ProfileState) => {
      state.shouldProfileRefresh = false;
    },
    endProfileRefresh: (state: ProfileState) => {
      state.onProfileRefreshes = [];
    }
  }
});

export const {
  updateProfile,
  updateOwnedPerks,
  updateSelectedRuneMods,
  startProfileRefresh,
  markProfileRefreshStarted,
  endProfileRefresh
} = profileSlice.actions;
