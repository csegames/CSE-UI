/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { buildCallTracking } from '../helpers/rest/thunkUtils';
import {
  callAcceptApplication,
  callAcceptInvitation,
  callAllowOffers,
  callBlockOffers,
  callCreateApplication,
  callCreateApplicationForName,
  callCreateInvitation,
  callCreateInvitationForName,
  callKick,
  callLeave,
  callRejectAllOffers,
  callRejectApplication,
  callRejectInvitation,
  callSetRank
} from '../helpers/rest/warbandsRestCalls';
import { CallState, clearErrors } from '../helpers/rest/callState';
import {
  PartyMember,
  PartySnapshot
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';

export interface Permissions {
  canInvite: boolean;
  canKick: boolean;
  canPromote: boolean;
  isLeader: boolean;
}

export interface PartyState extends CallState, PartySnapshot, Permissions {
  members: PartyMember[];
  inviteTimeouts: Record<string, number>;
  isHorizontal: boolean;
}

function onSuccess(state: Draft<PartyState>) {
  state.calls = clearErrors(state.calls);
}

function getInitialState(): PartyState {
  return {
    groupID: '',
    canInvite: false,
    canKick: false,
    canPromote: false,
    isLeader: false,
    calls: {},
    members: [],
    inviteTimeouts: {},
    isHorizontal: false
  };
}

export const partySlice = createSlice({
  name: 'party',
  initialState: getInitialState(),
  reducers: {
    setParty: (state, action: PayloadAction<PartySnapshot>) => {
      state.groupID = action.payload.groupID;
      state.members = action.payload.members;
    },
    setPermissions: (state, action: PayloadAction<Permissions>) => {
      Object.assign(state, action.payload);
    },
    addInviteTimeout: (state, action: PayloadAction<[string, number]>) => {
      state.inviteTimeouts[action.payload[0]] = action.payload[1];
    },
    dropInviteTimeout: (state, action: PayloadAction<string>) => {
      delete state.inviteTimeouts[action.payload];
    },
    setPartyLayoutHorizontal: (state, action: PayloadAction<boolean>) => {
      state.isHorizontal = action.payload;
    }
  },
  extraReducers: (builder) => {
    buildCallTracking(builder, callCreateInvitation, onSuccess);
    buildCallTracking(builder, callCreateInvitationForName, onSuccess);
    buildCallTracking(builder, callAcceptInvitation, onSuccess);
    buildCallTracking(builder, callRejectInvitation, onSuccess);
    buildCallTracking(builder, callCreateApplication, onSuccess);
    buildCallTracking(builder, callCreateApplicationForName, onSuccess);
    buildCallTracking(builder, callAcceptApplication, onSuccess);
    buildCallTracking(builder, callRejectApplication, onSuccess);
    buildCallTracking(builder, callSetRank, onSuccess);
    buildCallTracking(builder, callKick, onSuccess);
    buildCallTracking(builder, callLeave, onSuccess);
    buildCallTracking(builder, callRejectAllOffers, onSuccess);
    buildCallTracking(builder, callBlockOffers, onSuccess);
    buildCallTracking(builder, callAllowOffers, onSuccess);
  }
});

export const { setParty, setPermissions, addInviteTimeout, dropInviteTimeout, setPartyLayoutHorizontal } = partySlice.actions;
