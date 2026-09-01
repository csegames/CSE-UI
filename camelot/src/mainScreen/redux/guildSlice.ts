/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { buildCallTracking } from '../helpers/rest/thunkUtils';
import { CallState, clearErrors } from '../helpers/rest/callState';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import {
  callAcceptGuildApplication,
  callAcceptGuildInvitation,
  callAllowGuildOffers,
  callBlockGuildOffers,
  callCreateGuildApplication,
  callCreateGuildApplicationForName,
  callCreateGuildInvitation,
  callCreateGuildInvitationForName,
  callCreateGuildRank,
  callDeleteGuildRank,
  callDisableGuildPermission,
  callEnableGuildPermission,
  callGuildKick,
  callLeaveGuild,
  callRejectAllGuildOffers,
  callRejectGuildApplication,
  callRejectGuildInvitation,
  callRenameGuildRank,
  callSetGuildMOTD,
  callSetGuildName,
  callSetGuildRank,
  callShiftGuildRank
} from '../helpers/rest/guildsRestCalls';

export interface GuildState extends CallState, GuildSnapshot {
  inviteTimeouts: Record<string, number>;
}

function onSuccess(state: Draft<GuildState>) {
  state.calls = clearErrors(state.calls);
}

function getInitialState(): GuildState {
  return {
    groupID: '',
    name: '',
    crest: '',
    motd: '',
    members: [],
    ranks: [],
    calls: {},
    inviteTimeouts: {}
  };
}

export const guildSlice = createSlice({
  name: 'guild',
  initialState: getInitialState(),
  reducers: {
    setGuild: (state, action: PayloadAction<GuildSnapshot>) => {
      Object.assign(state, action.payload);
    },
    addInviteTimeout: (state, action: PayloadAction<[string, number]>) => {
      state.inviteTimeouts[action.payload[0]] = action.payload[1];
    },
    dropInviteTimeout: (state, action: PayloadAction<string>) => {
      delete state.inviteTimeouts[action.payload];
    }
  },
  extraReducers: (builder) => {
    buildCallTracking(builder, callCreateGuildInvitation, onSuccess);
    buildCallTracking(builder, callCreateGuildInvitationForName, onSuccess);
    buildCallTracking(builder, callAcceptGuildInvitation, onSuccess);
    buildCallTracking(builder, callRejectGuildInvitation, onSuccess);
    buildCallTracking(builder, callCreateGuildApplication, onSuccess);
    buildCallTracking(builder, callCreateGuildApplicationForName, onSuccess);
    buildCallTracking(builder, callAcceptGuildApplication, onSuccess);
    buildCallTracking(builder, callRejectGuildApplication, onSuccess);
    buildCallTracking(builder, callSetGuildRank, onSuccess);
    buildCallTracking(builder, callGuildKick, onSuccess);
    buildCallTracking(builder, callLeaveGuild, onSuccess);
    buildCallTracking(builder, callRejectAllGuildOffers, onSuccess);
    buildCallTracking(builder, callBlockGuildOffers, onSuccess);
    buildCallTracking(builder, callAllowGuildOffers, onSuccess);
    buildCallTracking(builder, callCreateGuildRank, onSuccess);
    buildCallTracking(builder, callDeleteGuildRank, onSuccess);
    buildCallTracking(builder, callRenameGuildRank, onSuccess);
    buildCallTracking(builder, callEnableGuildPermission, onSuccess);
    buildCallTracking(builder, callDisableGuildPermission, onSuccess);
    buildCallTracking(builder, callShiftGuildRank, onSuccess);
    buildCallTracking(builder, callSetGuildName, onSuccess);
    buildCallTracking(builder, callSetGuildMOTD, onSuccess);
  }
});

export const { setGuild, addInviteTimeout, dropInviteTimeout } = guildSlice.actions;
