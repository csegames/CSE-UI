/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from '@csegames/library/dist/hordetest/graphql/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// BEGIN INTERFACES AND STATES

export interface UserState extends User {
  shouldUserRefresh: boolean;
}

function generateDefaultUserState() {
  const defaultMyUserState: UserState = {
    backerLevel: null,
    created: null,
    displayName: null,
    id: null,
    lastLogin: null,
    shouldUserRefresh: false
  };
  return defaultMyUserState;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: generateDefaultUserState(),
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<User>) => {
      const newState = { ...action.payload, shouldUserRefresh: state.shouldUserRefresh };
      return newState;
    },
    setUserShouldRefresh: (state: UserState, action: PayloadAction<boolean>) => {
      state.shouldUserRefresh = action.payload;
    }
  }
});

export const { updateUser, setUserShouldRefresh } = userSlice.actions;
