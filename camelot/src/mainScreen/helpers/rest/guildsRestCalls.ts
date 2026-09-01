/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { webConf } from '../../redux/networkConfiguration';
import { CallThunkConfig, handleCall } from './thunkUtils';
import { AccountID, GuildsAPI } from '@csegames/library/dist/camelotunchained/webAPI/definitions';

export const callCreateGuildInvitation = createAsyncThunk<any, AccountID, CallThunkConfig>(
  'guildsAPI/createGuildInvitation',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.CreateInvitationV1(webConf, targetId));
  }
);

export const callCreateGuildInvitationForName = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/createGuildInvitationForName',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.CreateInvitationV1(webConf, null, name));
  }
);

export const callAcceptGuildInvitation = createAsyncThunk<any, AccountID, CallThunkConfig>(
  'guildsAPI/acceptGuildInvitation',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.AcceptInvitationV1(webConf, targetId));
  }
);

export const callRejectGuildInvitation = createAsyncThunk<any, AccountID, CallThunkConfig>(
  'guildsAPI/rejectGuildInvitation',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.RejectInvitationV1(webConf, targetId));
  }
);

export const callCreateGuildApplication = createAsyncThunk<any, AccountID, CallThunkConfig>(
  'guildsAPI/createGuildApplication',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.CreateApplicationV1(webConf, targetId));
  }
);

export const callCreateGuildApplicationForName = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/createGuildApplicationForName',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.CreateApplicationV1(webConf, null, name));
  }
);

export const callAcceptGuildApplication = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/acceptGuildApplication',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.AcceptApplicationV1(webConf, targetId));
  }
);

export const callRejectGuildApplication = createAsyncThunk<any, AccountID, CallThunkConfig>(
  'guildsAPI/rejectGuildApplication',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.RejectApplicationV1(webConf, targetId));
  }
);

type SetRankParams = { targetID: AccountID; targetRank: string };
export const callSetGuildRank = createAsyncThunk<any, SetRankParams, CallThunkConfig>(
  'guildsAPI/setGuildRank',
  async (params: SetRankParams, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.SetRankV1(webConf, params.targetID, params.targetRank));
  }
);

export const callGuildKick = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/guildKick',
  async (targetId: AccountID, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.KickV1(webConf, targetId));
  }
);

export const callLeaveGuild = createAsyncThunk<any, void, CallThunkConfig>(
  'guildsAPI/leaveGuild',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.LeaveV1(webConf));
  }
);

export const callRejectAllGuildOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'guildsAPI/rejectAllGuildOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.RejectAllOffersV1(webConf));
  }
);

export const callBlockGuildOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'guildsAPI/blockGuildOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.BlockOffersV1(webConf));
  }
);

export const callAllowGuildOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'guildsAPI/allowGuildOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.AllowOffersV1(webConf));
  }
);

export const callCreateGuildRank = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/createGuildRank',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.CreateRankV1(webConf, name));
  }
);

export const callDeleteGuildRank = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/deleteGuildRank',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.DeleteRankV1(webConf, name));
  }
);

type RenameRankParams = { currentName: string; newName: string };
export const callRenameGuildRank = createAsyncThunk<any, RenameRankParams, CallThunkConfig>(
  'guildsAPI/renameGuildRank',
  async (params: RenameRankParams, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.RenameRankV1(webConf, params.currentName, params.newName));
  }
);

// permission must be the name of a GroupPermission enum value e.g. "Invite"
type RankPermissionParams = { rank: string; permission: string };

export const callEnableGuildPermission = createAsyncThunk<any, RankPermissionParams, CallThunkConfig>(
  'guildsAPI/enableGuildPermission',
  async (params: RankPermissionParams, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.EnablePermissionV1(webConf, params.rank, params.permission));
  }
);

export const callDisableGuildPermission = createAsyncThunk<any, RankPermissionParams, CallThunkConfig>(
  'guildsAPI/disableGuildPermission',
  async (params: RankPermissionParams, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.DisablePermissionV1(webConf, params.rank, params.permission));
  }
);

type ShiftRankParams = { rank: string; delta: number };
export const callShiftGuildRank = createAsyncThunk<any, ShiftRankParams, CallThunkConfig>(
  'guildsAPI/shiftGuildRank',
  async (params: ShiftRankParams, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.ShiftRankV1(webConf, params.rank, params.delta));
  }
);

export const callSetGuildName = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/setGuildName',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.SetNameV1(webConf, name));
  }
);

export const callSetGuildMOTD = createAsyncThunk<any, string, CallThunkConfig>(
  'guildsAPI/setGuildMOTD',
  async (motd: string, thunkAPI) => {
    return await handleCall(thunkAPI, GuildsAPI.SetMOTDV1(webConf, motd));
  }
);
