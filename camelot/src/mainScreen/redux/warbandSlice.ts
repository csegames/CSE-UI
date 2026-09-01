/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { CallState, clearErrors } from '../helpers/rest/callState';
import { callSetWarbandGroup } from '../helpers/rest/warbandsRestCalls';
import { buildCallTracking } from '../helpers/rest/thunkUtils';

export interface Permissions {
  canInvite: boolean;
  canKick: boolean;
  canPromote: boolean;
  isLeader: boolean;
}

export interface WarbandState extends WarbandSnapshot, CallState {
  isEditMode: boolean;
}

function onSuccess(state: Draft<WarbandState>) {
  state.calls = clearErrors(state.calls);
}

function getInitialState(): WarbandState {
  return {
    groupID: '',
    subgroups: [],
    calls: {},
    isEditMode: false
  };
}

export const warbandSlice = createSlice({
  name: 'warband',
  initialState: getInitialState(),
  reducers: {
    setWarband: (state, action: PayloadAction<WarbandSnapshot>) => {
      Object.assign(state, action.payload);
    },
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    buildCallTracking(builder, callSetWarbandGroup, onSuccess);
  }
});

export const { setWarband, setIsEditMode } = warbandSlice.actions;
