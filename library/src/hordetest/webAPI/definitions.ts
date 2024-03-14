// GENERATED FILE -- DO NOT EDIT

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Final Stand: Ragnarok REST interface

import { CurrentMax, ClassDefRef, PerkDefRef, PurchaseDefRef, RaceDefRef, RequestConfig, RequestResult, QuestDefRef, xhrRequest } from './prerequisites'

export type AbilityInstanceID = number;
export type AccountID = string;
export type ActivityID = string;
export type ChannelID = number;
export type CharacterID = string;
export type CriterionID = string;
export type EntityID = string;
export type FeatureFlag = string;
export type ID128 = string;
export type ItemInstanceID = string;
export type MatchQueueInstanceID = string;
export type ProfileID = string;
export type QueueID = string;
export type RoleID = string;
export type ScenarioInstanceID = string;
export type ScenarioTeamID = string;
export type ShardID = number;
export type SpawnPointID = string;
export type StringID = string;
export type TeamID = string;
export type ZoneInstanceID = any;
export enum AccessType {
  Public = 0,
  Live = 1,
  Beta3 = 2,
  Beta2 = 3,
  Beta1 = 4,
  Alpha = 5,
  InternalTest = 6,
  Employees = 7,
}

export enum ActionErrorCode {
  UnspecifiedError = 0,
  ServerException = 1,
  TokenAuthorizationFailed = 2,
  NoActionRequired = 3,
  GeneralDatabaseError = 4,
  PermissionDenied = 5,
  CharacterNotFound = 6,
  GroupNotFound = 7,
  WrongGroupType = 8,
  WrongFaction = 9,
  NameLength = 10,
  NameContainsInvalidCharacters = 11,
  NameContainsNaughtyWords = 12,
  NameContainsReservedWords = 13,
  NameAlreadyInUse = 14,
  ActiveWarbandAlreadyExists = 15,
  AlreadyAnOrderMember = 16,
  MemberLimitReached = 17,
  InviteCodeNotFound = 18,
  InviteRequirementsNotMet = 19,
  InviteExpired = 20,
  InviteRevoked = 21,
  InviteUsageLimitReached = 22,
  RankLimitReached = 23,
  InvalidRankLevel = 24,
  AlreadyReady = 25,
  AlreadyNotReady = 26,
}

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

export enum AuthActionErrorCode {
  Unknown = 0,
  NoActionRequired = 1,
  Unauthorized = 2,
  InvalidToken = 3,
  CharacterNotFound = 4,
  PermissionExpired = 5,
  RenewalTimerExpired = 6,
  TokenGenerationFailed = 7,
  TokenAccessRevoked = 8,
  InvalidEmailOrPassword = 9,
  RequirePrivacyPolicyAcceptance = 10,
  Throttled = 11,
  NoScreenName = 12,
}

export enum BoneAlias {
  Unknown = 0,
  BodyPelvis = 1,
  Attachment1 = 2,
  Attachment2 = 3,
  Attachment3 = 4,
  Attachment4 = 5,
  Attachment5 = 6,
  Attachment6 = 7,
  Attachment7 = 8,
  SpineSacral = 9,
  SpineLumbar = 10,
  SpineThoracic = 11,
  SpineCervical = 12,
  BodyTorso = 13,
  BodyNeck = 14,
  BodyHead = 15,
  HairScalp = 16,
  HairBody = 17,
  HairEnd = 18,
  TailBase = 19,
  TailMiddle = 20,
  TailEnd = 21,
  ArmLeftClavical = 22,
  ArmLeftPauldron = 23,
  ArmLeftHumerus = 24,
  ArmLeftElbow = 25,
  ArmLeftUlna = 26,
  HandLeftPalm = 27,
  HandLeftThumbProximal = 28,
  HandLeftThumbMiddle = 29,
  HandLeftThumbPhalanx = 30,
  HandLeftIndexFingerProximal = 31,
  HandLeftIndexFingerMiddle = 32,
  HandLeftIndexFingerPhalanx = 33,
  HandLeftMiddleFingerProximal = 34,
  HandLeftMiddleFingerMiddle = 35,
  HandLeftMiddleFingerPhalanx = 36,
  HandLeftRingFingerProximal = 37,
  HandLeftRingFingerMiddle = 38,
  HandLeftRingFingerPhalanx = 39,
  HandLeftPinkyProximal = 40,
  HandLeftPinkyMiddle = 41,
  HandLeftPinkyPhalanx = 42,
  ArmRightClavical = 43,
  ArmRightPauldron = 44,
  ArmRightHumerus = 45,
  ArmRightElbow = 46,
  ArmRightUlna = 47,
  HandRightPalm = 48,
  HandRightThumbProximal = 49,
  HandRightThumbMiddle = 50,
  HandRightThumbPhalanx = 51,
  HandRightIndexFingerProximal = 52,
  HandRightIndexFingerMiddle = 53,
  HandRightIndexFingerPhalanx = 54,
  HandRightMiddleFingerProximal = 55,
  HandRightMiddleFingerMiddle = 56,
  HandRightMiddleFingerPhalanx = 57,
  HandRightRingFingerProximal = 58,
  HandRightRingFingerMiddle = 59,
  HandRightRingFingerPhalanx = 60,
  HandRightPinkyProximal = 61,
  HandRightPinkyMiddle = 62,
  HandRightPinkyPhalanx = 63,
  TabardLower = 64,
  TabardUpper = 65,
  CapeTop = 66,
  CapeUpperMiddle = 67,
  CapeLowerMiddle = 68,
  CapeEnd = 69,
  CapeLeftTail = 70,
  CapeRightTail = 71,
  LegLeftThigh = 72,
  LegLeftCalf = 73,
  FootLeftAnkle = 74,
  FootLeftToes = 75,
  LegRightThigh = 76,
  LegRightCalf = 77,
  FootRightAnkle = 78,
  FootRightToes = 79,
  SkirtBackUpper = 80,
  SkirtBackMiddle = 81,
  SkirtBackLower = 82,
  SkirtFrontUpper = 83,
  SkirtFrontMiddle = 84,
  SkirtFrontLower = 85,
  SkirtLeftUpper = 86,
  SkirtLeftMiddle = 87,
  SkirtLeftLower = 88,
  SkirtRightUpper = 89,
  SkirtRightMiddle = 90,
  SkirtRightLower = 91,
  TassetLeftUpper = 92,
  TassetLeftLower = 93,
  TassetRightUpper = 94,
  TassetRightLower = 95,
  WingRoot = 96,
  WingLeftBase = 97,
  WingLeftMiddle = 98,
  WingLeftTip = 99,
  WingRightBase = 100,
  WingRightMiddle = 101,
  WingRightTip = 102,
  SiegeRotate = 103,
  SiegePitch = 104,
  SiegeCharacterCenter = 105,
  SiegeCharacterCenter2 = 106,
  SiegeCharacterCenter3 = 107,
  SiegeCharacterCenter4 = 108,
  SiegeCharacterCenter5 = 109,
  SiegeCharacterCenter6 = 110,
  SiegeCharacterCenter7 = 111,
  SiegeCharacterCenter8 = 112,
  Hinge1 = 113,
  Hinge2 = 114,
  CollisionAttach1 = 115,
  CollisionAttach2 = 116,
  CollisionAttach3 = 117,
  CollisionAttach4 = 118,
  BuildingAttachWall = 119,
  BuildingAttachCeiling = 120,
  TrailSlashStart01 = 121,
  TrailSlashEnd01 = 122,
  TrailSlashStart02 = 123,
  TrailSlashEnd02 = 124,
  TrailPierceStart01 = 125,
  TrailPierceEnd01 = 126,
  TrailPierceStart02 = 127,
  TrailPierceEnd02 = 128,
  TrailCrushStart01 = 129,
  TrailCrushEnd01 = 130,
  TrailCrushStart02 = 131,
  TrailCrushEnd02 = 132,
  TrailGripStart01 = 133,
  TrailGripEnd01 = 134,
  TrailShaftStart01 = 135,
  TrailShaftEnd01 = 136,
  TrailMotionStart = 137,
  TrailMotionEnd = 138,
  PointStringTop = 139,
  PointStringBottom = 140,
  PointKnock = 141,
  PointPommel01 = 142,
  PointVfx01 = 143,
  PointVfxCenter01 = 144,
  PointVfxRadius01 = 145,
  PointFocusSource = 146,
  GameplayCameraFocus = 147,
  GameplayProjectileOrigin = 148,
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
  GroupServiceUnavailable = 5002,
  GameServiceUnavailable = 5003,
  PresenceServiceUnavailable = 5004,
  InvalidModel = 30001,
}

export enum GenderNumericID {
  None = 0,
}

export enum MatchmakingAvailability {
  Offline = 0,
  NoAccess = 1,
  Online = 2,
}

export enum ModifyScenaioResultCode {
  Invalid = 0,
  Success = 1,
  InvalidScenarioID = 2,
  NotSupported = 3,
  InvalidParameter = 4,
  DBError = 5,
  InvalidShard = 6,
  InvalidScenarioState = 7,
  CallerNotFound = 8,
  CharacterNotFound = 9,
}

export enum NPCRank {
  None = 0,
  Elite = 1,
  StrongElite = 2,
  Unique = 3,
  MiniBoss = 4,
  Boss = 5,
}

export enum ObjectiveState {
  Unstarted = 0,
  Active = 1,
  Complete = 2,
  Canceled = 3,
}

export enum PatchPermissions {
  Public = 0,
  AllBackers = 1,
  InternalTest = 2,
  Development = 4,
  Alpha = 8,
  Beta1 = 16,
  Beta2 = 32,
  Beta3 = 64,
  Live = 128,
}

export enum PerkRarity {
  Default = 0,
  Common = 1,
  Rare = 2,
  Unique = 3,
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
  WaitingForConnections = 2,
  Countdown = 3,
  Running = 4,
  Epilogue = 5,
  Ended = 6,
  COUNT = 7,
}

export enum ServerStatus {
  Offline = 0,
  Starting = 1,
  Online = 2,
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

  EnterQueue: function(config: RequestConfig, queueID: string, userTag?: string, allowBackfill?: boolean): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["queueID"] = queueID;
    if (userTag !== undefined) parameters["userTag"] = userTag;
    if (allowBackfill !== undefined) parameters["allowBackfill"] = allowBackfill;
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

  SetChampion: function(config: RequestConfig, roundID: string, championID: string, shouldLock: boolean): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'put',
      conf.url + 'v1/activities/selection',
      { roundID, championID, shouldLock },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetPlayerVote: function(config: RequestConfig, roundID: string, playerID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/activities/player_vote',
      { roundID, playerID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ClearPlayerVote: function(config: RequestConfig, roundID: string, playerID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'delete',
      conf.url + 'v1/activities/player_vote',
      { roundID, playerID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ApiErrorResponse {
  Code: number;
  Message: string;
  FieldCodes: IFieldCode[];
}

export interface APIKeyAuthorizationFailed {
  Code: FieldCodes;
  Message: string;
}

export interface ArchetypeInfo {
  description: string;
  id: number;
  numericID: number;
  stringID: string;
  name: string;
  importantStats: string[];
}

export interface AuthActionErrorFieldCode {
  Action: IAuthActionError;
  Code: FieldCodes;
  Message: string;
}

export interface BadRequestFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface BaseContentModel {
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
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

export interface Channel {
  ID: number;
  Name: string;
  Description: string;
  Permissions: PatchPermissions;
}

export interface Character {
  archetype: string;
  attributes: { [key: string]: number; };
  traitIDs: string[];
  gender: string;
  id: string;
  lastLogin: string;
  name: string;
  race: string;
  shardID: number;
}

export const ContentAPI = {
  PatcherHeroContentV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/patcherherocontent',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface DatabaseUnavailable {
  Code: FieldCodes;
  Message: string;
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

export interface DisplayNameErrorFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface DoesNotExist {
  Code: FieldCodes;
  Message: string;
}

export interface EnterMatchmakingRequest {
  Mode: string;
  ShardID: ShardID;
  CharacterID: CharacterID;
}

export interface Euler3f {
  roll: number;
  pitch: number;
  yaw: number;
  x: number;
  y: number;
  z: number;
}

export interface ExecutionErrorFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface FactionInfo {
  description: string;
  id: number;
  name: string;
  shortName: string;
}

export interface ForceStartMatchRequest {
  Mode: string;
}

export const GameDataAPI = {
  GetFactionInfoV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/factionInfo',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetFactionsV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/factions',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetArchetypesV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/archetypes',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetRacesV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/races',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetOrderPermissionsV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/orderPermissions',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetChatAddressV1: function(config: RequestConfig, shard: ShardID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/gamedata/getchataddress',
      { shard },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface GameServiceUnavailable {
  Code: FieldCodes;
  Message: string;
}

export interface GroupActionError {
  Actions: IActionError[];
  Code: FieldCodes;
  Message: string;
}

export interface Health {
  current: number;
  max: number;
  wounds: number;
}

export interface IActionError {
  Code: ActionErrorCode;
  Message: string;
}

export interface IAuthActionError {
  Code: AuthActionErrorCode;
  Message: string;
}

export interface IFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface InternalAction {
  Code: FieldCodes;
  Message: string;
}

export interface LoginFailed {
  Code: FieldCodes;
  Message: string;
}

export interface LoginSuccess {
  Token: string;
  Code: FieldCodes;
  Message: string;
}

export interface LoginThrottled {
  Code: FieldCodes;
  Message: string;
}

export interface ModifyScenarioError {
  ModifyScenario: ModifyScenarioResult;
  Message: string;
  ErrorCode: ModifyScenaioResultCode;
  CharacterID: CharacterID;
  Code: FieldCodes;
}

export interface ModifyScenarioResult {
  Code: ModifyScenaioResultCode;
  CharacterID: CharacterID;
  ErrorMessage: string;
}

export interface NotAllowedFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface PatcherHero {
  HTMLContent: string;
  Priority: number;
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
}

export interface PatcherHeroContent {
  content: string;
  id: string;
  priority: number;
  utcDateEnd: string;
  utcDateStart: string;
}

export interface PatchNote {
  Channels: ChannelID[];
  ChannelsAsLongs: number[];
  HTMLContent: string;
  JSONContent: string;
  Title: string;
  PatchNumber: string;
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
}

export interface Perk {
  ID: string;
  Qty: number;
}

export interface PlayerPresence {
  characterID: CharacterID;
  connectedZoneInstanceIDs: number[];
  activeZoneInstanceID: number;
  desiredZoneInstanceID: number;
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
}

export interface PresenceServiceUnavailable {
  Code: FieldCodes;
  Message: string;
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

  GracefulDisconnect: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/profile/disconnect',
      {},
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

export interface RaceInfo {
  name: string;
  description: string;
  id: number;
  stringID: string;
  numericID: number;
}

export interface RateLimitExceeded {
  Retry: number;
  Code: FieldCodes;
  Message: string;
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

export interface ReportCrashResult {
  ID: string;
}

export const ScenarioAPI = {
  RewardThumbsUp: function(config: RequestConfig, scenarioID: ScenarioInstanceID, targetAccountID: AccountID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/rewardthumbsup',
      { scenarioID, targetAccountID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RevokeThumbsUp: function(config: RequestConfig, scenarioID: ScenarioInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/revokethumbsup',
      { scenarioID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface SelectChampionRequest {
  ChampionID: string;
  ChampionMetaData: { [key: string]: string; };
}

export interface ServerModel {
  accessLevel: AccessType;
  channelID: number;
  channelPatchPermissions: number;
  name: string;
  shardID: number;
  status: ServerStatus;
  apiHost: string;
}

export interface ServiceUnavailableFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface SetMatchOverridesRequest {
  MatchOverrides: { [key: string]: string; };
}

export interface SimpleCharacter {
  archetype: string;
  gender: string;
  id: CharacterID;
  lastLogin: string;
  name: string;
  race: string;
  shardID: ShardID;
}

export interface StatusEffect {
  id: string;
  duration: number;
  startTime: number;
  name: string;
  iconURL: string;
  description: string;
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

export interface TimeoutError {
  Code: FieldCodes;
  Message: string;
}

export interface UnauthorizedFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnhandledExecutionException {
  Exception: string;
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedAuthorizationDenied {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedExecutionError {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedNotAllowed {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedRequestError {
  Code: FieldCodes;
  Message: string;
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

export const VivoxAccessAPI = {
  GetLoginToken: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/voice/tokens/login',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetJoinMatchToken: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/voice/tokens/joinMatch',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ZoneInfo {
  ID: string;
  Name: string;
  Address: string;
  Bounds: string;
}


