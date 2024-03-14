// GENERATED FILE -- DO NOT EDIT

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Camelot Unchained REST interface

import { CurrentMax, CurrentMaxValue, RequestConfig, RequestResult, Temperature, xhrRequest } from './prerequisites'

export type AbilityInstanceID = number;
export type AccountID = string;
export type ActivityID = string;
export type BuildingCellDataInstanceID = string;
export type BuildingPlotInstanceID = string;
export type ChannelID = number;
export type CharacterID = string;
export type ContainerDrawerID = string;
export type CriterionID = string;
export type EntityID = string;
export type FeatureFlag = string;
export type GroupID = string;
export type ID128 = string;
export type InviteCode = string;
export type ItemInstanceID = string;
export type ItemStackHash = string;
export type MatchQueueInstanceID = string;
export type QueueID = string;
export type RoleID = string;
export type ScenarioInstanceID = string;
export type ScenarioTeamID = string;
export type SecureTradeInstanceID = string;
export type ShardID = number;
export type SpawnPointID = string;
export type StringID = string;
export type TargetID = string;
export type TeamID = string;
export type VoxJobGroupInstanceID = string;
export type VoxJobInstanceID = string;
export type VoxNotesInstanceID = string;
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

export enum Faction {
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3,
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

export enum GroupTypes {
  Warband = 0,
  Battlegroup = 1,
  Order = 2,
  Campaign = 3,
}

export enum InviteStatus {
  Active = 0,
  Revoked = 1,
  UsageLimitReached = 2,
  Expired = 3,
}

export enum ItemActionResultCode {
  Invalid = 0,
  Success = 1,
  UnknownError = 2,
  PermissionDenied = 3,
  ErrorNotFound = 4,
  OutOfRange = 5,
  ActionNotFound = 6,
  OnCooldown = 7,
  PositionNotFound = 8,
  LimitReached = 9,
  InvalidPosition = 10,
  FeatureNotEnabled = 11,
  ItemMoveError = 12,
}

export enum ItemPermissions {
  None = 0,
  Trade = 1,
  Trash = 2,
  CraftWithVox = 4,
  Control = 8,
  AddContents = 16,
  RemoveContents = 32,
  ViewContents = 64,
  ModifyDisplay = 128,
  Ground = 256,
  Inventory = 512,
  Equipment = 1024,
  Container = 2048,
  Vox = 4096,
  Use = 8192,
  All = -1,
}

export enum ItemPlacementType {
  None = 0,
  Door = 1,
  Plot = 2,
  BuildingFaceSide = 3,
  BuildingFaceBottom = 4,
  BuildingFaceTop = 5,
}

export enum ItemTemplateType {
  None = 0,
  TemplateOnly = 1,
  Entity = 2,
}

export enum ModifyAbilityResultCode {
  Success = 0,
  PlayerNotFound = 1,
  AbilitiesDisabled = 2,
  AbilityNotFound = 3,
  NameTooShort = 4,
  NameTooLong = 5,
  DescriptionTooLong = 6,
  AbilityIconInvalid = 7,
  InvalidNetwork = 8,
  MissingComponents = 9,
  InvalidComponent = 10,
  ComponentNotAvailable = 11,
  ComponentLocked = 12,
  TooManyAbilities = 13,
  RequiredComponentMissing = 14,
  TooManyAbilityComponents = 15,
  ComponentIncompatible = 16,
  PermissionDenied = 17,
  UnknownError = 18,
  InvalidRequest = -1,
}

export enum ModifyItemResultCode {
  Invalid = 0,
  Success = 1,
  NotSupported = 2,
  InvalidName = 3,
  PermissionDenied = 4,
  EntityNotFound = 5,
  ItemNotFound = 6,
  IncompatiblePermissions = 7,
  UnknownError = 8,
}

export enum ModifyPlotResultCode {
  Success = 0,
  PlotNotFound = 1,
  CharacterNotFound = 2,
  InvalidParameter = 3,
  NoMatchingPermissionSetFound = 4,
  PermissionDenied = 5,
  CharacterNotOnPlot = 6,
  PlotNotCompatibleWithScenario = 7,
  PlotNotCompatibleWithFaction = 8,
  ScenarioNotFound = 9,
  TeamNotForScenario = 10,
  NullTeam = 11,
  DatabaseError = 12,
  NotSupported = 13,
  FeatureDisabled = 14,
  UnknownError = 15,
  MaxPlotsOwned = 16,
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

export enum ModifySecureTradeResultCode {
  Success = 0,
  NoTrade = 1,
  IncorrectState = 2,
  ItemNotFound = 3,
  InventoryNotFound = 4,
  DuplicateItemInRequest = 5,
  NoPendingInvite = 6,
  MissingFaction = 7,
  FactionMismatch = 8,
  TradeSourceNotAlive = 9,
  TradeTargetNotAlive = 10,
  NoEntityPosition = 11,
  TooFarAway = 12,
  EntityMismatch = 13,
  CanceledEntityMissing = 14,
  DBError = 15,
  NotLoggedIn = 16,
  EntityToTradeWithNotFound = 17,
  CannotTradeWithSelf = 18,
  MoveItemError = 19,
  EntityCannotTrade = 20,
  LockTimeNotPassed = 21,
  UnknownError = 22,
  InvalidRequest = -1,
}

export enum ModifyVoxJobResultCode {
  Success = 0,
  TooManyJobs = 1,
  InvalidJob = 2,
  NoCurrentJob = 3,
  ItemsInVox = 4,
  IncorrectJobState = 5,
  DBError = 6,
  NotSupported = 7,
  InvalidRecipe = 8,
  TooManyIngredients = 9,
  NotEnoughIngredients = 10,
  IncorrectIngredient = 11,
  InvalidIngredient = 12,
  InvalidQuality = 13,
  InventoryFull = 14,
  NoRepairPoints = 15,
  InvalidUnitCount = 16,
  ParameterError = 17,
  VoxNotFound = 18,
  RecipeAlreadyDiscovered = 19,
  RecipeNotSet = 20,
  ItemSlotNotSupported = 21,
  IngredientsExist = 22,
  VoxBroken = 23,
  IngredientBroken = 24,
  PlayerNotFound = 25,
  MoveItemError = 26,
  InvalidItemName = 27,
  UnknownError = 28,
  PermissionDenied = 29,
  VoxJobNotFound = 30,
  VoxTooFarAway = 31,
  RequirementFailed = 32,
  PlayerNotAlive = 33,
  InvalidRequest = -1,
}

export enum MoveItemRequestLocationType {
  Invalid = 0,
  Container = 1,
  Equipment = 2,
  Ground = 3,
  Inventory = 4,
  Vox = 5,
  Trash = 6,
  BuildingPlaced = 7,
  BuildingConstruction = 8,
  VoxModule = 9,
}

export enum MoveItemResultCode {
  Success = 0,
  None = 1,
  Timeout = 2,
  PlayerNotFound = 3,
  EntityNotFound = 4,
  ItemNotFound = 5,
  ItemNotValid = 6,
  MixedError = 7,
  TooManyItems = 8,
  InventoryNotFound = 9,
  EquipmentNotFound = 10,
  DefinitionNotFound = 11,
  SecureTradeNotFound = 12,
  InvalidParameter = 13,
  SpatialNotFound = 14,
  ItemFeatureTurnedOff = 15,
  BrokenItem = 16,
  ItemRequirementNotMet = 17,
  ItemStatRequirementNotMet = 18,
  EntityNotValid = 19,
  MultiItemMoveNotSupported = 20,
  ItemsDoNotStack = 21,
  TooFarAway = 22,
  PermissionDenied = 23,
  ItemInversion = 24,
  InvalidVoxSlot = 25,
  ItemCannotBeTraded = 26,
  RestrictedToScenario = 27,
  CannotRemoveFromRunningScenario = 28,
  TrashingItemNotAllowed = 29,
  OutOfRange = 30,
  DestroyEffectNotSupported = 31,
  UnknownError = 32,
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

export enum PermissibleSetKeyType {
  Invalid = 0,
  Faction = 1,
  ScenarioTeam = 2,
  ScenarioRole = 3,
}

export enum PermissibleTargetType {
  Invalid = 0,
  Any = 1,
  Faction = 2,
  Character = 3,
  ScenarioTeam = 4,
  Warband = 5,
  CharactersWarband = 6,
  CharactersFaction = 7,
  CharactersOrder = 8,
  InNoScenario = 9,
  Inverse = 10,
  And = 11,
  ScenarioRole = 12,
  Scenario = 13,
  Account = 14,
}

export enum PlotPermissions {
  None = 0,
  ModifyPlannedBuilding = 1,
  RemoveDroppedBlocks = 2,
  Owned = 4,
  UseSpawnPoint = 8,
  AddItems = 16,
  RemoveItems = 32,
  NoPlayerOwnerPermissions = -5,
  All = -1,
}

export enum ProgressionResultCode {
  Success = 0,
  InProgress = 1,
  PlayerNotFound = 2,
  DailyLogNotFound = 3,
  DBError = 4,
  DailyLogNotPublished = 5,
  NotNextDayLog = 6,
  InItemLoadoutScenario = 7,
  InvalidRequest = -1,
}

export enum ServerStatus {
  Offline = 0,
  Starting = 1,
  Online = 2,
}

export enum SpawnPointPermissions {
  None = 0,
  Spawn = 1,
  All = -1,
}

export enum StatType {
  None = 0,
  Primary = 1,
  Secondary = 2,
  Derived = 3,
  Hidden = 4,
}

export enum VoxJobType {
  Invalid = 0,
  Recipe = 1,
  Purify = 2,
  Repair = 3,
  Salvage = 4,
  Alchemy = 5,
}

export enum ZoneType {
  None = 0,
  Home = 1,
  Builder = 2,
  Contested = 3,
}

export const AbilitiesAPI = {
  CreateAbility: function(config: RequestConfig, request: CreateAbilityRequest): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/abilities/create',
      { request },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ModifyAbility: function(config: RequestConfig, abilityID: number, request: CreateAbilityRequest): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/abilities/modify',
      { abilityID, request },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DeleteAbility: function(config: RequestConfig, abilityID: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/abilities/delete',
      { abilityID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface Alert {
  Destination: string;
  Type: string;
  Template: string;
  Vars: { [key: string]: string; };
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
}

export interface AlertVar {
  Key: string;
  Value: string;
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
  faction: Faction;
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
  faction: Faction;
  gender: string;
  id: string;
  lastLogin: string;
  name: string;
  race: string;
  shardID: number;
}

export const CharactersAPI = {
  CreateCharacterV2: function(config: RequestConfig, shardID: ShardID, character: Character): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/characters/create',
      { shardID },
      character,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CSECreateCharacterV2: function(config: RequestConfig, shardID: ShardID, accountID: AccountID, character: Character): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/characters/csecreate',
      { shardID, accountID },
      character,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DeleteCharacterV1: function(config: RequestConfig, shardID: ShardID, characterID: CharacterID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/characters/delete',
      { shardID, characterID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export const ContentAPI = {
  MessageOfTheDayV1: function(config: RequestConfig, channel: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/messageoftheday',
      { channel },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

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

  PatcherAlertsV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/patcheralerts',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AlertV1: function(config: RequestConfig, destination: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/alerts',
      { destination },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ControlGameState {
  arthurianScore: number;
  controlPoints: ControlPoint[];
  gameState: number;
  timeLeft: number;
  tuathaDeDanannScore: number;
  vikingScore: number;
}

export interface ControlPoint {
  faction: string;
  id: string;
  size: string;
  x: number;
  y: number;
}

export const CraftingAPI = {
  SwapVoxJob: function(config: RequestConfig, voxEntityID: EntityID, jobDefID: string, recipeID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["voxEntityID"] = voxEntityID;
    parameters["jobDefID"] = jobDefID;
    if (recipeID !== undefined) parameters["recipeID"] = recipeID;
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/swapvoxjob',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AppendVoxJob: function(config: RequestConfig, voxEntityID: EntityID, jobDefID: string, recipeID?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["voxEntityID"] = voxEntityID;
    parameters["jobDefID"] = jobDefID;
    if (recipeID !== undefined) parameters["recipeID"] = recipeID;
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/appendvoxjob',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ClearVoxJob: function(config: RequestConfig, voxEntityID: EntityID, voxJobInstanceID: VoxJobInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/clearvoxjob',
      { voxEntityID, voxJobInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  MoveQueuedJob: function(config: RequestConfig, voxEntityID: EntityID, voxJobInstanceID: VoxJobInstanceID, newIndex: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/movequeuedjob',
      { voxEntityID, voxJobInstanceID, newIndex },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetRecipeID: function(config: RequestConfig, voxEntityID: EntityID, recipeID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxrecipeid',
      { voxEntityID, recipeID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetQuality: function(config: RequestConfig, voxEntityID: EntityID, quality: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxquality',
      { voxEntityID, quality },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetDoseCount: function(config: RequestConfig, voxEntityID: EntityID, doseCount: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxdosecount',
      { voxEntityID, doseCount },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetCustomItemName: function(config: RequestConfig, voxEntityID: EntityID, itemName: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxcustomitemname',
      { voxEntityID, itemName },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  StartVoxJob: function(config: RequestConfig, voxEntityID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/startvoxjob',
      { voxEntityID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CollectFinishedVoxJob: function(config: RequestConfig, voxEntityID: EntityID, jobID: VoxJobInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/collectfinishedvoxjob',
      { voxEntityID, jobID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CancelVoxJob: function(config: RequestConfig, voxEntityID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/cancelvoxjob',
      { voxEntityID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetCraftingNotes: function(config: RequestConfig, instanceID: VoxNotesInstanceID, notes: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxnotes',
      { instanceID, notes },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetVoxJobGroupNotes: function(config: RequestConfig, jobIdentifier: string, jobType: VoxJobType, notes: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxjobgroupnotes',
      { jobIdentifier, jobType, notes },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetVoxJobNotes: function(config: RequestConfig, jobID: VoxJobInstanceID, notes: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxjobnotes',
      { jobID, notes },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetVoxJobGroupFavorite: function(config: RequestConfig, jobIdentifier: string, jobType: VoxJobType, favorite: boolean): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxjobgroupfavorite',
      { jobIdentifier, jobType, favorite },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetVoxJobFavorite: function(config: RequestConfig, jobID: VoxJobInstanceID, favorite: boolean): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/crafting/setvoxjobfavorite',
      { jobID, favorite },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface CreateAbilityRequest {
  Name: string;
  Description: string;
  IconURL: string;
  NetworkID: string;
  Components: string[];
}

export interface DatabaseUnavailable {
  Code: FieldCodes;
  Message: string;
}

export interface DisplayNameErrorFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface DoesNotExist {
  Code: FieldCodes;
  Message: string;
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

export interface GroupMemberState {
  entityID: string;
  characterID: string;
  faction: Faction;
  classID: string;
  name: string;
  isAlive: boolean;
  position: Vec3f;
  statuses: StatusEffect[];
  race: string;
  gender: string;
  health: Health;
  stamina: CurrentMax;
  blood: CurrentMax;
  displayOrder: number;
  warbandID: string;
  isLeader: boolean;
  canInvite: boolean;
  canKick: boolean;
  rankLevel: number;
  isReady: boolean;
}

export const GroupsAPI = {
  KickV1: function(config: RequestConfig, groupID: GroupID, targetEntityID?: EntityID | null, targetCharacterID?: CharacterID | null, targetName?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    if (targetEntityID !== undefined) parameters["targetEntityID"] = targetEntityID;
    if (targetCharacterID !== undefined) parameters["targetCharacterID"] = targetCharacterID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/kick',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  MakeLeaderV1: function(config: RequestConfig, groupID: GroupID, targetEntityID?: EntityID | null, targetCharacterID?: CharacterID | null, targetName?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    if (targetEntityID !== undefined) parameters["targetEntityID"] = targetEntityID;
    if (targetCharacterID !== undefined) parameters["targetCharacterID"] = targetCharacterID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/makeleader',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GrantPermissionV1: function(config: RequestConfig, groupID: GroupID, permissionToGrant: string, targetEntityID?: EntityID | null, targetCharacterID?: CharacterID | null, targetName?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    parameters["permissionToGrant"] = permissionToGrant;
    if (targetEntityID !== undefined) parameters["targetEntityID"] = targetEntityID;
    if (targetCharacterID !== undefined) parameters["targetCharacterID"] = targetCharacterID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/grantpermission',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GrantInvitePermissionV1: function(config: RequestConfig, groupID: GroupID, targetEntityID?: EntityID | null, targetCharacterID?: CharacterID | null, targetName?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    if (targetEntityID !== undefined) parameters["targetEntityID"] = targetEntityID;
    if (targetCharacterID !== undefined) parameters["targetCharacterID"] = targetCharacterID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/grantinvitepermission',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RevokePermissionV1: function(config: RequestConfig, groupID: GroupID, permissionToRevoke: string, targetEntityID?: EntityID | null, targetCharacterID?: CharacterID | null, targetName?: string): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    parameters["permissionToRevoke"] = permissionToRevoke;
    if (targetEntityID !== undefined) parameters["targetEntityID"] = targetEntityID;
    if (targetCharacterID !== undefined) parameters["targetCharacterID"] = targetCharacterID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/revokepermission',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateWarbandV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/createWarband',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreatePermanentWarbandV1: function(config: RequestConfig, name: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/createPermanentWarband',
      { name },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateBattlegroupV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/createBattlegroup',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CreateOrderV1: function(config: RequestConfig, name: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/createOrder',
      { name },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  InviteV1: function(config: RequestConfig, groupID?: GroupID | null, targetID?: CharacterID | null, targetName?: string, groupType?: GroupTypes | null): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (groupID !== undefined) parameters["groupID"] = groupID;
    if (targetID !== undefined) parameters["targetID"] = targetID;
    if (targetName !== undefined) parameters["targetName"] = targetName;
    if (groupType !== undefined) parameters["groupType"] = groupType;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/invite',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  JoinV1: function(config: RequestConfig, groupID: GroupID, inviteCode?: InviteCode | null): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    parameters["groupID"] = groupID;
    if (inviteCode !== undefined) parameters["inviteCode"] = inviteCode;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/join',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  QuitV1: function(config: RequestConfig, groupID?: GroupID | null): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (groupID !== undefined) parameters["groupID"] = groupID;
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/quit',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AbandonV1: function(config: RequestConfig, groupID: GroupID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/abandon',
      { groupID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  DisbandV1: function(config: RequestConfig, groupID: GroupID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/disband',
      { groupID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  ReadyUpV1: function(config: RequestConfig, groupID: GroupID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/ready',
      { groupID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  UnReadyV1: function(config: RequestConfig, groupID: GroupID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/groups/unready',
      { groupID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface GroupServiceUnavailable {
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

export interface IGroupInvite {
  Code: InviteCode;
  Shard: ShardID;
  Status: InviteStatus;
  TargetsID128: TargetID;
  ForGroup: GroupID;
  ForGroupType: GroupTypes;
  Created: string;
  MaxUses: number;
  Uses: number;
  DurationTicks: number;
}

export interface IItemRequirementContext {
  Ctx: IItemRequirementContext;
  VoxJobID: string;
}

export interface InsufficientResource {
  Resources: ResourceRequirement[];
  Code: FieldCodes;
  Message: string;
}

export interface InternalAction {
  Code: FieldCodes;
  Message: string;
}

export interface InvalidModel {
  ModelErrors: ModelError[];
  Code: FieldCodes;
  Message: string;
}

export interface ItemActionError {
  ItemActionResult: ItemActionResult;
  Message: string;
  ItemActionCode: ItemActionResultCode;
  Code: FieldCodes;
}

export interface ItemActionParameters {
  WorldPosition: Vec3f;
  Rotation: Euler3f;
  BoneAlias: BoneAlias;
  SelectedItemID: ItemInstanceID;
}

export interface ItemActionResult {
  Code: ItemActionResultCode;
  Message: string;
}

export const ItemAPI = {
  MoveItems: function(config: RequestConfig, request: MoveItemRequest): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/items/moveitems',
      { request },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  BatchMoveItems: function(config: RequestConfig, requests: MoveItemRequest[]): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/items/batchmoveitems',
      {},
      requests,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  SetContainerColor: function(config: RequestConfig, itemInstanceID: ItemInstanceID, itemEntityID: EntityID, red: number, green: number, blue: number, alpha: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/items/setcontainercolor',
      { itemInstanceID, itemEntityID, red, green, blue, alpha },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RenameItem: function(config: RequestConfig, itemInstanceID: ItemInstanceID, itemEntityID: EntityID, newName: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/items/renameitem',
      { itemInstanceID, itemEntityID, newName },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  PerformItemAction: function(config: RequestConfig, itemInstanceID: ItemInstanceID, itemEntityID: EntityID, actionID: string, parameters?: ItemActionParameters): Promise<RequestResult> {
    const conf = config();
    const parameters1: {[key:string]: any} = {};
    parameters1["itemInstanceID"] = itemInstanceID;
    parameters1["itemEntityID"] = itemEntityID;
    parameters1["actionID"] = actionID;
    if (parameters !== undefined) parameters1["parameters"] = parameters;
    return xhrRequest(
      'post',
      conf.url + 'v1/items/performitemaction',
      parameters1,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ItemRequirementContext {
  Ctx: IItemRequirementContext;
  VoxJobID: string;
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

export interface LoginTokenAuthorizationFailed {
  Code: FieldCodes;
  Message: string;
}

export interface MatchmakingBadGameMode {
  Code: FieldCodes;
  Message: string;
}

export interface MatchmakingFailedToEnterQueue {
  Code: FieldCodes;
  Message: string;
}

export interface MatchmakingUserNotReady {
  Code: FieldCodes;
  Message: string;
}

export interface MessageOfTheDay {
  Title: string;
  HTMLContent: string;
  JSONContent: string;
  Duration: number;
  Channels: ChannelID[];
  ChannelsAsLongs: number[];
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
}

export interface MessageOfTheDay {
  id: string;
  utcDisplayStart: string;
  utcDisplayEnd: string;
  utcCreated: string;
  title: string;
  htmlContent: string;
  jsonContent: string;
  duration: number;
  channels: number[];
}

export interface ModelError {
  Message: string;
  ParamName: string;
  TypeName: string;
}

export interface ModifyAbilityError {
  AbilityResult: ModifyAbilityResult;
  Message: string;
  AbilityCode: ModifyAbilityResultCode;
  Code: FieldCodes;
}

export interface ModifyAbilityResult {
  Result: ModifyAbilityResultCode;
  IsSuccess: boolean;
  Details: string;
  ErrorComponentID: string;
}

export interface ModifyItemError {
  ModifyItemResult: ModifyItemResult;
  Message: string;
  ReanameItemCode: ModifyItemResultCode;
  Code: FieldCodes;
}

export interface ModifyItemResult {
  Code: ModifyItemResultCode;
  Message: string;
}

export interface ModifyPlotError {
  ModifyPlotResult: ModifyPlotResult;
  Message: string;
  MoveItemCode: ModifyPlotResultCode;
  Code: FieldCodes;
}

export interface ModifyPlotResult {
  Code: ModifyPlotResultCode;
  Message: string;
  QueueStatus: QueueStatusMessage;
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

export interface ModifySecureTradeAPIResult {
  Result: ModifySecureTradeResultCode;
  IsSuccess: boolean;
  Details: string;
  SecureTradeID: SecureTradeInstanceID;
  TradeCompleted: boolean;
  MovedItemIDs: ItemInstanceID[];
}

export interface ModifyVoxJobError {
  VoxJobResult: ModifyVoxJobResult;
  Message: string;
  VoxJobCode: ModifyVoxJobResultCode;
  Code: FieldCodes;
}

export interface ModifyVoxJobResult {
  Result: ModifyVoxJobResultCode;
  IsSuccess: boolean;
  Details: string;
  MovedItemID: ItemInstanceID;
  DiscoveredRecipeIDs: string[];
  NewVoxJobID: VoxJobInstanceID;
}

export interface MoveItemError {
  MoveItemResult: MoveItemResult;
  Message: string;
  MoveItemCode: MoveItemResultCode;
  Code: FieldCodes;
}

export interface MoveItemRequest {
  MoveItemID: ItemInstanceID;
  StackHash: ItemStackHash;
  UnitCount: number;
  To: MoveItemRequestLocation;
  From: MoveItemRequestLocation;
}

export interface MoveItemRequestLocation {
  CharacterID: CharacterID;
  EntityID: EntityID;
  Position: number;
  ContainerID: ItemInstanceID;
  DrawerID: string;
  GearSlotIDs: string[];
  VoxSlot: string;
  BuildingID: BuildingPlotInstanceID;
  WorldPosition: Vec3f;
  Rotation: Euler3f;
  Location: MoveItemRequestLocationType;
  BoneAlias: BoneAlias;
}

export interface MoveItemResult {
  MovedItemIDs: ItemInstanceID[];
  CreatedEntityID: EntityID;
  Code: MoveItemResultCode;
  Message: string;
}

export interface NotAllowedFieldCode {
  Code: FieldCodes;
  Message: string;
}

export const OrdersAPI = {
}

export interface PatcherAlert {
  Message: string;
  ID: string;
  UtcDisplayStart: string;
  UtcDisplayEnd: string;
  UtcCreated: string;
}

export interface PatcherAlert {
  id: string;
  message: string;
  utcDateEnd: string;
  utcDateStart: string;
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

export interface PermissibleGrantTargetConfig {
  TargetType: PermissibleTargetType;
  CharacterName: string;
  CharacterID: CharacterID;
  CharacterFaction: Faction;
}

export interface PlayerCounts {
  arthurian: number;
  maxPlayers: number;
  tuatha: number;
  viking: number;
}

export interface PlayerPresence {
  characterID: CharacterID;
  connectedZoneInstanceIDs: number[];
  activeZoneInstanceID: number;
  desiredZoneInstanceID: number;
}

export const PlotsAPI = {
  ReleasePlot: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/releasePlot',
      { plotInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GeneratePlotDeed: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/generatePlotDeed',
      { plotInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  TakeOwnership: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/takeOwnership',
      { plotInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GrantPermissions: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID, newPermissions: PlotPermissions, target: PermissibleGrantTargetConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/grantPermissions',
      { plotInstanceID, newPermissions, target },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RevokePermissions: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID, revokePermissions: PlotPermissions, target: PermissibleGrantTargetConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/revokePermissions',
      { plotInstanceID, revokePermissions, target },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetQueueStatus: function(config: RequestConfig, plotInstanceID: BuildingPlotInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/plot/getQueueStatus',
      { plotInstanceID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
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

export const ProgressionAPI = {
  CollectCharacterDayProgression: function(config: RequestConfig, logID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/character/collectdayprogression',
      { logID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ProgressionError {
  ProgressionResult: ProgressionResult;
  Message: string;
  ResultCode: ProgressionResultCode;
  Code: FieldCodes;
}

export interface ProgressionResult {
  Result: ProgressionResultCode;
  IsSuccess: boolean;
  Details: string;
}

export interface Proxy {
  Address: string;
  Port: number;
}

export interface QueuedBlueprintMessage {
  percentComplete: number;
  estTimeRemaining: number;
  subName: string;
  amtNeeded: number;
}

export interface QueueStatusMessage {
  status: string;
  numContributors: number;
  maxContributors: number;
  blueprints: QueuedBlueprintMessage[];
}

export interface RaceInfo {
  name: string;
  description: string;
  faction: Faction;
  id: number;
  stringID: string;
  numericID: number;
}

export interface RateLimitExceeded {
  Retry: number;
  Code: FieldCodes;
  Message: string;
}

export interface RealmRestricted {
  Code: FieldCodes;
  Message: string;
}

export interface ReportCrashResult {
  ID: string;
}

export interface ResourceRequirement {
  Name: string;
  Required: Object;
  Available: Object;
}

export const ScenarioAPI = {
  AddToQueue: function(config: RequestConfig, queueID: MatchQueueInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/addtoqueue',
      { queueID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemoveFromQueue: function(config: RequestConfig, queueID: MatchQueueInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/removefromqueue',
      { queueID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemoveFromScenario: function(config: RequestConfig, scenarioID: ScenarioInstanceID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/scenarios/removefromscenario',
      { scenarioID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export const SecureTradeAPI = {
  Invite: function(config: RequestConfig, tradeTargetID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/invite',
      { tradeTargetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RevokeInvite: function(config: RequestConfig, inviteTargetID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/revokeinvite',
      { inviteTargetID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AcceptInvite: function(config: RequestConfig, inviterID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/acceptinvite',
      { inviterID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RejectInvite: function(config: RequestConfig, inviterID: EntityID): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/rejectinvite',
      { inviterID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AbortSecureTrade: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/abort',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Lock: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/lock',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Unlock: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/unlock',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  AddItem: function(config: RequestConfig, itemInstanceID: ItemInstanceID, unitCount: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/additem',
      { itemInstanceID, unitCount },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  RemoveItem: function(config: RequestConfig, itemInstanceID: ItemInstanceID, unitCount: number): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/removeItem',
      { itemInstanceID, unitCount },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  Confirm: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/confirm',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  CancelTradeConfirmation: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'post',
      conf.url + 'v1/secureTrade/cancelconfirmation',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface SecureTradeError {
  SecureTradeResult: ModifySecureTradeAPIResult;
  Message: string;
  ResultCode: ModifySecureTradeResultCode;
  Code: FieldCodes;
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

export interface ServerPresence {
  address: string;
  zoneResourceID: number;
  zoneInstanceID: number;
  shardID: ShardID;
  zoneBoundsMax: Vec2f;
  zoneBoundsMin: Vec2f;
  restrictToFaction: Faction;
  isStartingZone: boolean;
  isHidden: boolean;
  isMainInstance: boolean;
  isShuttingDown: boolean;
  isFull: boolean;
}

export const ServersAPI = {
  GetAvailableZones: function(config: RequestConfig, shard?: ShardID | null): Promise<RequestResult> {
    const conf = config();
    const parameters: {[key:string]: any} = {};
    if (shard !== undefined) parameters["shard"] = shard;
    return xhrRequest(
      'get',
      conf.url + 'v1/availableZones',
      parameters,
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },

  GetZoneInfo: function(config: RequestConfig, shard: ShardID, zoneID: string): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/getZoneInfo',
      { shard, zoneID },
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
}

export interface ServerState {
  controlGameState: ControlGameState;
  playerCounts: PlayerCounts;
  spawnPoints: SpawnPoint[];
}

export interface ServiceUnavailableFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface SimpleCharacter {
  archetype: string;
  faction: Faction;
  gender: string;
  id: CharacterID;
  lastLogin: string;
  name: string;
  race: string;
  shardID: ShardID;
}

export interface SpawnPoint {
  id: string;
  faction: Faction;
  position: Vec3f;
}

export interface StartingServer {
  Address: string;
  ZoneInstanceID: number;
}

export interface StatusEffect {
  id: string;
  duration: number;
  startTime: number;
  name: string;
  iconURL: string;
  description: string;
}

export interface TimeoutError {
  Code: FieldCodes;
  Message: string;
}

export const TraitsAPI = {
  GetTraitsV1: function(config: RequestConfig): Promise<RequestResult> {
    const conf = config();
    return xhrRequest(
      'get',
      conf.url + 'v1/traits',
      {},
      null,
      { headers: { ...conf.headers, 'Accept': 'application/json'}}
    );
  },
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

export interface UnspecifiedServiceUnavailable {
  Code: FieldCodes;
  Message: string;
}

export interface UserStateConflict {
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

export interface WarbandMember {
  additionalPermissions: string[];
  archetype: string;
  avatar: string;
  blood: CurrentMaxValue;
  characterID: string;
  gender: string;
  health: CurrentMaxValue;
  joined: string;
  name: string;
  panic: CurrentMaxValue;
  parted: string;
  race: string;
  rank: string;
  stamina: CurrentMaxValue;
  temperature: Temperature;
  wounds: number;
}

export interface ZoneInfo {
  ID: string;
  Name: string;
  Address: string;
  Bounds: string;
}


