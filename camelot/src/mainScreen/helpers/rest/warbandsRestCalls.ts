/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { webConf } from '../../redux/networkConfiguration';
import { CallThunkConfig, handleCall } from './thunkUtils';
import { CharacterID, WarbandsAPI } from '@csegames/library/dist/camelotunchained/webAPI/definitions';

export const callCreateInvitation = createAsyncThunk<any, CharacterID, CallThunkConfig>(
  'warbandsAPI/createInvitation',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.CreateInvitationV1(webConf, targetId));
  }
);

export const callCreateInvitationForName = createAsyncThunk<any, string, CallThunkConfig>(
  'warbandsAPI/createInvitationForName',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.CreateInvitationV1(webConf, null, name));
  }
);

export const callAcceptInvitation = createAsyncThunk<any, CharacterID, CallThunkConfig>(
  'warbandsAPI/acceptInvitation',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.AcceptInvitationV1(webConf, targetId));
  }
);

export const callRejectInvitation = createAsyncThunk<any, CharacterID, CallThunkConfig>(
  'warbandsAPI/rejectInvitation',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.RejectInvitationV1(webConf, targetId));
  }
);

export const callCreateApplication = createAsyncThunk<any, CharacterID, CallThunkConfig>(
  'warbandsAPI/createApplication',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.CreateApplicationV1(webConf, targetId));
  }
);

export const callCreateApplicationForName = createAsyncThunk<any, string, CallThunkConfig>(
  'warbandsAPI/createApplicationForName',
  async (name: string, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.CreateApplicationV1(webConf, null, name));
  }
);

export const callAcceptApplication = createAsyncThunk<any, string, CallThunkConfig>(
  'warbandsAPI/acceptApplication',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.AcceptApplicationV1(webConf, targetId));
  }
);

export const callRejectApplication = createAsyncThunk<any, CharacterID, CallThunkConfig>(
  'warbandsAPI/rejectApplication',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.RejectApplicationV1(webConf, targetId));
  }
);

type RankParams = { targetID: CharacterID; targetRank: string };
export const callSetRank = createAsyncThunk<any, RankParams, CallThunkConfig>(
  'warbandsAPI/setRank',
  async (params: RankParams, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.SetRankV1(webConf, params.targetID, params.targetRank));
  }
);

export const callKick = createAsyncThunk<any, string, CallThunkConfig>(
  'warbandsAPI/kick',
  async (targetId: CharacterID, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.KickV1(webConf, targetId));
  }
);

export const callLeave = createAsyncThunk<any, void, CallThunkConfig>('warbandsAPI/leave', async (_, thunkAPI) => {
  return await handleCall(thunkAPI, WarbandsAPI.LeaveV1(webConf));
});

export const callUpgradePartyToWarband = createAsyncThunk<any, void, CallThunkConfig>(
  'warbandsAPI/upgradePartyToWarband',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.UpgradeV1(webConf));
  }
);

export const callRejectAllOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'warbandsAPI/rejectAllOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.RejectAllOffersV1(webConf));
  }
);

export const callBlockOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'warbandsAPI/blockOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.BlockOffersV1(webConf));
  }
);

export const callAllowOffers = createAsyncThunk<any, void, CallThunkConfig>(
  'warbandsAPI/allowOffers',
  async (_, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.AllowOffersV1(webConf));
  }
);

interface SetWarbandGroupParams {
  targetID: CharacterID;
  targetSubgroup: number;
}
export const callSetWarbandGroup = createAsyncThunk<any, SetWarbandGroupParams, CallThunkConfig>(
  'warbandsAPI/subgroup',
  async (params: SetWarbandGroupParams, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.SetSubgroupV1(webConf, params.targetID, params.targetSubgroup));
  }
);

interface SwapWarbandMembersParams {
  targetID0: CharacterID;
  targetID1: CharacterID;
}
export const callSwapWarbandMembers = createAsyncThunk<any, SwapWarbandMembersParams, CallThunkConfig>(
  'warbandsAPI/subgroup',
  async (params: SwapWarbandMembersParams, thunkAPI) => {
    return await handleCall(thunkAPI, WarbandsAPI.SwapSubgroupsV1(webConf, params.targetID0, params.targetID1));
  }
);
