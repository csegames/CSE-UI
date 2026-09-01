// GENERATED FILE -- DO NOT EDIT

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Final Stand: Ragnarok REST interface

import { ColossusProgressionNodeDefRef, ClassDefRef, PerkDefRef, PurchaseDefRef, RequestConfig, RequestResult, QuestDefRef, xhrRequest } from './prerequisites'

export type AccountID = string;
export type CharacterID = string;
export type EntityID = string;
export type ProfileID = string;
export type ScenarioInstanceID = string;
export type ShardID = number;
export enum AnnouncementType {
  Text = 1,
  PopUp = 2,
  Worldspace = 4,
  PassiveAlert = 8,
  Victory = 16,
  Defeat = 32,
  Dialogue = 64,
  ObjectiveSuccess = 128,
  ObjectiveFail = 256,
  ALL = -1,
}

export enum FieldCodes {
  BasicSuccess = 0,
  GroupActionSuccess = 1,
  ModifyVoxJobSuccess = 2,
  MoveItemSuccess = 3,
  ProgressionSuccess = 4,
  ModifySecureTradeSuccess = 5,
  ModifyPlotSuccess = 6,
  ModifyItemSuccess = 7,
  LoginSuccess = 8,
  ItemActionSuccess = 9,
  AuthActionSuccess = 10,
  ModifyAbilitySuccess = 11,
  ModifyScenarioSuccess = 12,
  UnspecifiedAuthorizationDenied = 1000,
  AuthorizationFailed = 1001,
  LoginTokenAuthorizationFailed = 1002,
  RealmRestricted = 1003,
  LoginFailed = 1004,
  LoginThrottled = 1005,
  UnspecifiedNotAllowed = 2000,
  RateLimitExceeded = 2001,
  InternalAction = 2002,
  UnspecifiedRequestError = 3000,
  UnspecifiedExecutionError = 4000,
  UnhandledExecutionException = 4001,
  DoesNotExist = 4002,
  UserStateConflict = 4003,
  InsufficientResource = 4004,
  VoxJobError = 4005,
  MoveItemError = 4006,
  SecureTradeError = 4007,
  ProgressionError = 4008,
  GroupActionError = 4009,
  TimeoutError = 4010,
  ModifyItemError = 4011,
  ItemActionError = 4012,
  AuthActionError = 4013,
  ModifyAbilityError = 4014,
  ModifyScenarioError = 4015,
  MatchmakingUserNotReady = 4016,
  MatchmakingUserAlreadyInQueue = 4017,
  MatchmakingBadGameMode = 4018,
  MatchmakingFailedToEnterQueue = 4019,
  DisplayNameError = 4020,
  ModifyProfileError = 4021,
  UnspecifiedServiceUnavailable = 5000,
  DatabaseUnavailable = 5001,
  GameServiceUnavailable = 5003,
  PresenceServiceUnavailable = 5004,
  InvalidModel = 30001,
}

export enum ObjectiveState {
  Unstarted = 0,
  Active = 1,
  Complete = 2,
  Canceled = 3,
}

export enum PerkType {
  Invalid = 0,
  Currency = 1,
  Costume = 2,
  Key = 3,
  Portrait = 4,
  Weapon = 5,
  CurrentBattlePassXP = 6,
  Emote = 7,
  RuneMod = 8,
  QuestXP = 9,
  SprintFX = 10,
  RuneModTierKey = 11,
  StatusMod = 12,
  StatMod = 13,
}

export enum RuneType {
  Weapon = 0,
  Protection = 1,
  Health = 2,
  CharacterMod = 3,
  Count = 4,
}

export enum ScenarioRoundState {
  Uninitialized = 0,
  Initializing = 1,
  Backfill = 2,
  BackfillLocked = 3,
  WaitingForConnections = 4,
  Countdown = 5,
  Running = 6,
  Epilogue = 7,
  Ended = 8,
  COUNT = 9,
}

export const ActivitiesAPI = {
  CreateDebugSession: function(config: RequestConfig, scenarioID: string, zoneID?: string, overmindSheetID?: string, overmindTabID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["scenarioID"] = scenarioID;
    if (zoneID !== undefined) parameters["zoneID"] = zoneID;
    if (overmindSheetID !== undefined) parameters["overmindSheetID"] = overmindSheetID;
    if (overmindTabID !== undefined) parameters["overmindTabID"] = overmindTabID;
    return xhrRequest(
      'post',
      conf.url + 'v1/activities/debug_session',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  EnterQueue: function(config: RequestConfig, queueID: string, userTag?: string, requestBackfill?: boolean): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["queueID"] = queueID;
    if (userTag !== undefined) parameters["userTag"] = userTag;
    if (requestBackfill !== undefined) parameters["requestBackfill"] = requestBackfill;
    return xhrRequest(
      'post',
      conf.url + 'v1/activities/queue',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ExitQueue: function(config: RequestConfig, queueID: string, entryID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      conf.url + 'v1/activities/queue',
      { queueID, entryID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampion: function(config: RequestConfig, reservationID: string, championID: string, shouldLock: boolean, costumePerkID?: string, portraitPerkID?: string, weaponPerkID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["reservationID"] = reservationID;
    parameters["championID"] = championID;
    parameters["shouldLock"] = shouldLock;
    if (costumePerkID !== undefined) parameters["costumePerkID"] = costumePerkID;
    if (portraitPerkID !== undefined) parameters["portraitPerkID"] = portraitPerkID;
    if (weaponPerkID !== undefined) parameters["weaponPerkID"] = weaponPerkID;
    return xhrRequest(
      'put',
      conf.url + 'v1/activities/selection',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Champion {
  ChampionID: string;
  PortraitPerkID: string;
  WeaponPerkID: string;
  SprintFXPerkID: string;
  CostumePerkID: string;
  EmotePerkIDs: string[];
  RuneModPerkIDs: string[];
}

export const DisplayNameAPI = {
  SetDisplayName: function(config: RequestConfig, wantName: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/displayname/set',
      { wantName },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Euler3f {
  roll: number;
  pitch: number;
  yaw: number;
  x: number;
  y: number;
  z: number;
}

export const ModerationAPI = {
  AppealWord: function(config: RequestConfig, word: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/appeal/word',
      { word },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Perk {
  ID: string;
  Qty: number;
}

export const PresenceAPI = {
  GetStartingServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/startingServer',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetBestServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/bestServer',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetChatServer: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/chatServer',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetProxyByZone: function(config: RequestConfig, zoneInstanceID: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/proxyByZone/{zoneInstanceID}',
      { zoneInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetProxyByServerAddress: function(config: RequestConfig, serverAddress: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/proxyByServerAddress/{serverAddress}',
      { serverAddress },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetServers: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/servers',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetPlayers: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/presence/players',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RestartZone: function(config: RequestConfig, name?: string, zoneInstanceID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (name !== undefined) parameters["name"] = name;
    if (zoneInstanceID !== undefined) parameters["zoneInstanceID"] = zoneInstanceID;
    return xhrRequest(
      'post',
      conf.url + 'v1/presence/restartzone',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RestartAllZones: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/presence/restartallzones',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Profile {
  ID: ProfileID;
  HistoryID: string;
  AccountID: AccountID;
  TimeOffsetSeconds: number;
  DefaultChampionID: string;
  Champions: Champion[];
  Perks: { [key: string]: Perk; };
  Quests: { [key: string]: Quest; };
  LastDailyUpdate: string;
  DailyPlaySeconds: number;
  DailyBattlePassXP: number;
  DailyQuestResets: number;
  Administrator: boolean;
  MissingLogEntries: { [key: string]: number; };
}

export const ProfileAPI = {
  ClearLifetimeStats: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/clearlifetimestats/',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ResetDailyUpdate: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/resetdailyupdate/',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetTimeOffset: function(config: RequestConfig, timeOffsetSeconds: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/settimeoffset/',
      { timeOffsetSeconds },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ForceAddQuest: function(config: RequestConfig, quest: QuestDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/forceaddquest/',
      { quest },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemoveAllQuests: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/removeallquests/',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemoveQuest: function(config: RequestConfig, quest: QuestDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/removequest/',
      { quest },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AddQuestProgression: function(config: RequestConfig, quest: QuestDefRef, progression: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/addquestprogression/',
      { quest, progression },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AddQuest: function(config: RequestConfig, quest: QuestDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/addquest/',
      { quest },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ResetDailyQuest: function(config: RequestConfig, quest: QuestDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/resetdailyquest/',
      { quest },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CollectQuestReward: function(config: RequestConfig, quest: QuestDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/collectallquestreward/',
      { quest },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CollectQuestRewards: function(config: RequestConfig, quest: QuestDefRef, linkIndex: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/collectquestreward/',
      { quest, linkIndex },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RedeemQuestXPPerk: function(config: RequestConfig, perk: PerkDefRef, quest: QuestDefRef, quantity: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/redeemquestxpperk/',
      { perk, quest, quantity },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Purchase: function(config: RequestConfig, purchase: PurchaseDefRef, quantity: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/purchase/',
      { purchase, quantity },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  PurchaseProgressionNode: function(config: RequestConfig, node: ColossusProgressionNodeDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/purchaseprogressionnode/',
      { node },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RespecChampionProgression: function(config: RequestConfig, champion: ClassDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/respecchampionprogression/',
      { champion },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AddPerk: function(config: RequestConfig, perk: PerkDefRef, quantity: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/addperk/',
      { perk, quantity },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemovePerk: function(config: RequestConfig, perk: PerkDefRef, quantity: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/removeperk/',
      { perk, quantity },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AddAllPerksOfType: function(config: RequestConfig, perkType: PerkType, quantity: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/addallperksoftype/',
      { perkType, quantity },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionPortrait: function(config: RequestConfig, champion: ClassDefRef, portraitPerk: PerkDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampionportrait/',
      { champion, portraitPerk },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionWeapon: function(config: RequestConfig, champion: ClassDefRef, weaponPerk: PerkDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampionweapon/',
      { champion, weaponPerk },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionSprintFX: function(config: RequestConfig, champion: ClassDefRef, sprintPerk: PerkDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampionsptrintfx/',
      { champion, sprintPerk },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionCostume: function(config: RequestConfig, champion: ClassDefRef, costumePerk: PerkDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampioncostume/',
      { champion, costumePerk },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionEmote: function(config: RequestConfig, champion: ClassDefRef, emotePerk: PerkDefRef, index: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampionemote/',
      { champion, emotePerk, index },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetChampionRuneMod: function(config: RequestConfig, champion: ClassDefRef, runeModPerk: PerkDefRef, runeModLevel: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setchampionrunemod/',
      { champion, runeModPerk, runeModLevel },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetDefaultChampion: function(config: RequestConfig, champion: ClassDefRef): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/setdefaultchampion/',
      { champion },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Load: function(config: RequestConfig, profileID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/load/',
      { profileID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  LoadList: function(config: RequestConfig, profileIDs: string[]): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/loadlist/',
      { profileIDs },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  FindOne: function(config: RequestConfig, accountID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/findone/',
      { accountID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Find: function(config: RequestConfig, accountIDs: string[]): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/find/',
      { accountIDs },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ListAll: function(config: RequestConfig, pageToken?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (pageToken !== undefined) parameters["pageToken"] = pageToken;
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/listall/',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Delete: function(config: RequestConfig, profileID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/delete/',
      { profileID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  LoadHistory: function(config: RequestConfig, historyID: string, offset: number, count: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/loadhistory/',
      { historyID, offset, count },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Quest {
  ID: string;
  NextCollection: number;
  NextCollectionPremium: number;
  CurrentQuestIndex: number;
  CurrentQuestProgress: number;
  TotalProgress: number;
  Granted: string;
  QuestStatus: string;
}

export const ReportAPI = {
  Report: function(config: RequestConfig, subcategory: string, targetAccountID: string, message: string, email?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["subcategory"] = subcategory;
    parameters["targetAccountID"] = targetAccountID;
    parameters["message"] = message;
    if (email !== undefined) parameters["email"] = email;
    return xhrRequest(
      'post',
      conf.url + 'report/user',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export const ScenarioAPI = {
  RewardThumbsUp: function(config: RequestConfig, scenarioInstanceID: ScenarioInstanceID, targetAccountID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/rewardthumbsup',
      { scenarioInstanceID, targetAccountID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RevokeThumbsUp: function(config: RequestConfig, scenarioInstanceID: ScenarioInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/revokethumbsup',
      { scenarioInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export const TeamJoinAPI = {
  CreateInvitationV1: function(config: RequestConfig, targetID?: AccountID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      conf.url + 'v1/team/invitations/create',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptInvitationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/invitations/accept',
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectInvitationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/invitations/reject',
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateApplicationV1: function(config: RequestConfig, targetID?: AccountID, name?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (name !== undefined) parameters["name"] = name;
    return xhrRequest(
      'post',
      conf.url + 'v1/team/applications/create',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptApplicationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/applications/accept',
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectApplicationV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/applications/reject',
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetRankV1: function(config: RequestConfig, targetID: AccountID, targetRank: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/ranks/set',
      { targetID, targetRank },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  KickV1: function(config: RequestConfig, targetID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/kick',
      { targetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  LeaveV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/leave',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectAllOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/offers/reject',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  BlockOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/offers/block',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AllowOffersV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/team/offers/allow',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Vec2f {
  x: number;
  y: number;
}

export interface Vec3f {
  x: number;
  y: number;
  z: number;
}


