/* tslint:disable */
/* GENERATED FILE -- DO NOT EDIT */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as graphql from '../graphql/schema';
import { request as xhrRequest, RequestResult } from '../../_baseGame/utils/request';

declare global {
  type RequestConfig = () =>({
    url: string;
    headers?: {[key:string]:string};
  });
}

declare global {
  export interface StatusEffect {
    id: string;
    duration: number;
    startTime: number;
    name: string;
    iconURL: string;
    description: string;
  }
}

declare global {
  export interface Health {
    current: number;
    max: number;
    wounds: number;
  }
}

declare global {
  export interface GroupMemberState {
    entityID: string;
    characterID: string;
    classID: Archetype;
    name: string;
    isAlive: boolean;
    position: Vec3f;
    statuses: StatusEffect[];
    race: Race;
    gender: Gender;
    health: Health[];
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
}

declare global {
  export interface LoginSuccess {
    Token: string;
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface LoginFailed {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface LoginThrottled {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface DisplayNameErrorFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  type ItemInstanceID = string;
}

declare global {
  export interface EnterMatchmakingRequest {
    Mode: string;
    ShardID: ShardID;
    CharacterID: CharacterID;
  }
}

declare global {
  export interface SetMatchOverridesRequest {
    MatchOverrides: { [key: string]: string; };
  }
}

declare global {
  type EntityID = string;
}

declare global {
  type CharacterID = string;
}

declare global {
  type MatchQueueInstanceID = string;
}

declare global {
  type ScenarioInstanceID = string;
}

declare global {
  type ScenarioTeamID = string;
}

declare global {
  type RoleID = string;
}

declare global {
  type SpawnPointID = string;
}

declare global {
  export interface ModifyScenarioError {
    ModifyScenario: ModifyScenarioResult;
    Message: string;
    ErrorCode: ModifyScenaioResultCode;
    CharacterID: CharacterID;
    Code: FieldCodes;
  }
}

declare global {
  export interface GroupActionError {
    Actions: IActionError[];
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface SelectChampionRequest {
    ChampionID: string;
    ChampionMetaData: { [key: string]: string; };
  }
}

declare global {
  export interface ModifyScenarioResult {
    Code: ModifyScenaioResultCode;
    CharacterID: CharacterID;
    ErrorMessage: string;
  }
}

declare global {
  type GroupID = string;
}

declare global {
  type InviteCode = string;
}

declare global {
  export interface IActionError {
    Code: ActionErrorCode;
    Message: string;
  }
}

declare global {
  export interface BaseContentModel {
    ID: string;
    UtcDisplayStart: string;
    UtcDisplayEnd: string;
    UtcCreated: string;
  }
}

declare global {
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
}

declare global {
  export interface PatcherAlert {
    Message: string;
    ID: string;
    UtcDisplayStart: string;
    UtcDisplayEnd: string;
    UtcCreated: string;
  }
}

declare global {
  export interface PatcherHero {
    HTMLContent: string;
    Priority: number;
    ID: string;
    UtcDisplayStart: string;
    UtcDisplayEnd: string;
    UtcCreated: string;
  }
}

declare global {
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
}

declare global {
  type ShardID = number;
}

declare global {
  type ID128 = string;
}

declare global {
  export interface Euler3f {
    roll: number;
    pitch: number;
    yaw: number;
    x: number;
    y: number;
    z: number;
  }
}

declare global {
  export interface Vec2f {
    x: number;
    y: number;
  }
}

declare global {
  export interface Vec3f {
    x: number;
    y: number;
    z: number;
  }
}

declare global {
  type ProfileID = string;
}

declare global {
  type StringID = string;
}

declare global {
  type AccountID = string;
}

declare global {
  export interface ArchetypeInfo {
    description: string;
    id: Archetype;
    name: string;
  }
}

declare global {
  export interface Channel {
    ID: number;
    Name: string;
    Description: string;
    Permissions: PatchPermissions;
  }
}

declare global {
  export interface SimpleCharacter {
    archetype: Archetype;
    gender: Gender;
    id: CharacterID;
    lastLogin: string;
    name: string;
    race: Race;
    shardID: ShardID;
  }
}

declare global {
  export interface Character {
    archetype: Archetype;
    attributes: { [key: string]: number; };
    traitIDs: string[];
    gender: Gender;
    id: string;
    lastLogin: string;
    name: string;
    race: Race;
    shardID: number;
  }
}

declare global {
  export interface FactionInfo {
    description: string;
    id: number;
    name: string;
    shortName: string;
  }
}

declare global {
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
}

declare global {
  export interface PatcherAlert {
    id: string;
    message: string;
    utcDateEnd: string;
    utcDateStart: string;
  }
}

declare global {
  export interface PatcherHeroContent {
    content: string;
    id: string;
    priority: number;
    utcDateEnd: string;
    utcDateStart: string;
  }
}

declare global {
  export interface PlayerPresence {
    characterID: CharacterID;
    connectedZoneInstanceIDs: number[];
    activeZoneInstanceID: number;
    desiredZoneInstanceID: number;
  }
}

declare global {
  export interface RaceInfo {
    name: string;
    description: string;
    id: Race;
  }
}

declare global {
  export interface ServerModel {
    accessLevel: AccessType;
    channelID: number;
    channelPatchPermissions: number;
    host: string;
    name: string;
    playerMaximum: number;
    shardID: number;
    status: ServerStatus;
    apiHost: string;
  }
}

declare global {
  export interface ZoneInfo {
    ID: string;
    Name: string;
    Address: string;
    Bounds: string;
  }
}

declare global {
  export interface ApiErrorResponse {
    Code: number;
    Message: string;
    FieldCodes: IFieldCode[];
  }
}

declare global {
  export interface BadRequestFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnspecifiedRequestError {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface InvalidModel {
    ModelErrors: ModelError[];
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface ModelError {
    Message: string;
    ParamName: string;
    TypeName: string;
  }
}

declare global {
  export interface ExecutionErrorFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnspecifiedExecutionError {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface TimeoutError {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnhandledExecutionException {
    Exception: string;
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface DoesNotExist {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UserStateConflict {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface InsufficientResource {
    Resources: ResourceRequirement[];
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface MatchmakingUserNotReady {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface MatchmakingBadGameMode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface MatchmakingFailedToEnterQueue {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface ResourceRequirement {
    Name: string;
    Required: Object;
    Available: Object;
  }
}

declare global {
  export interface IFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface NotAllowedFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnspecifiedNotAllowed {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface RateLimitExceeded {
    Retry: number;
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface InternalAction {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface ServiceUnavailableFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnspecifiedServiceUnavailable {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface DatabaseUnavailable {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface GroupServiceUnavailable {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface GameServiceUnavailable {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface PresenceServiceUnavailable {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnauthorizedFieldCode {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface UnspecifiedAuthorizationDenied {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface APIKeyAuthorizationFailed {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface LoginTokenAuthorizationFailed {
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  export interface IAuthActionError {
    Code: AuthActionErrorCode;
    Message: string;
  }
}

declare global {
  export interface AuthActionErrorFieldCode {
    Action: IAuthActionError;
    Code: FieldCodes;
    Message: string;
  }
}

declare global {
  type APIClientID = string;
}

declare global {
  type APISecret = string;
}

declare global {
  type JWTKey = string;
}

declare global {
  enum BoneAlias {
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
  interface Window {
    BoneAlias: typeof BoneAlias;
  }
}
enum BoneAlias {
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
window.BoneAlias = BoneAlias;

declare global {
  enum ObjectiveState {
    Unstarted = 0,
    Active = 1,
    Complete = 2,
    Canceled = 3,
  }
  interface Window {
    ObjectiveState: typeof ObjectiveState;
  }
}
enum ObjectiveState {
  Unstarted = 0,
  Active = 1,
  Complete = 2,
  Canceled = 3,
}
window.ObjectiveState = ObjectiveState;

declare global {
  enum Archetype {
  }
  interface Window {
    Archetype: typeof Archetype;
  }
}
enum Archetype {
}
window.Archetype = Archetype;

declare global {
  enum Gender {
    None = 0,
    Male = 1,
    Female = 2,
  }
  interface Window {
    Gender: typeof Gender;
  }
}
enum Gender {
  None = 0,
  Male = 1,
  Female = 2,
}
window.Gender = Gender;

declare global {
  enum Race {
    Berserker = 20,
    MindlessDead = 21,
    DrySkeleton = 22,
    Amazon = 23,
    Knight = 24,
    Celt = 25,
    Ninja = 26,
    WinterWind = 27,
    DishonoredDead = 28,
    ColossusFrostGiant = 29,
    ColossusFireGiant = 30,
    DevourerGiant = 31,
    CorpseGiant = 32,
    Necromancer = 33,
    Litch = 34,
    Warlock = 35,
    DeathPriest = 36,
    PlagueBringer = 37,
    ShadowWraith = 38,
    LostSoul = 39,
    SpectralAlly = 40,
    SpectralWarrior = 41,
    BoneReaper = 42,
    DragonColossus = 43,
  }
  interface Window {
    Race: typeof Race;
  }
}
enum Race {
  Berserker = 20,
  MindlessDead = 21,
  DrySkeleton = 22,
  Amazon = 23,
  Knight = 24,
  Celt = 25,
  Ninja = 26,
  WinterWind = 27,
  DishonoredDead = 28,
  ColossusFrostGiant = 29,
  ColossusFireGiant = 30,
  DevourerGiant = 31,
  CorpseGiant = 32,
  Necromancer = 33,
  Litch = 34,
  Warlock = 35,
  DeathPriest = 36,
  PlagueBringer = 37,
  ShadowWraith = 38,
  LostSoul = 39,
  SpectralAlly = 40,
  SpectralWarrior = 41,
  BoneReaper = 42,
  DragonColossus = 43,
}
window.Race = Race;

declare global {
  type ZoneInstanceID = any;
}

declare global {
  enum ModifyScenaioResultCode {
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
  interface Window {
    ModifyScenaioResultCode: typeof ModifyScenaioResultCode;
  }
}
enum ModifyScenaioResultCode {
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
window.ModifyScenaioResultCode = ModifyScenaioResultCode;

declare global {
  enum GroupTypes {
    Warband = 0,
    Battlegroup = 1,
    Order = 2,
    Campaign = 3,
  }
  interface Window {
    GroupTypes: typeof GroupTypes;
  }
}
enum GroupTypes {
  Warband = 0,
  Battlegroup = 1,
  Order = 2,
  Campaign = 3,
}
window.GroupTypes = GroupTypes;

declare global {
  enum ActionErrorCode {
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
  interface Window {
    ActionErrorCode: typeof ActionErrorCode;
  }
}
enum ActionErrorCode {
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
window.ActionErrorCode = ActionErrorCode;

declare global {
  enum PatchPermissions {
    Public = 0,
    AllBackers = 1,
    InternalTest = 2,
    Development = 4,
    Alpha = 8,
    Beta1 = 16,
    Beta2 = 32,
    Beta3 = 64,
  }
  interface Window {
    PatchPermissions: typeof PatchPermissions;
  }
}
enum PatchPermissions {
  Public = 0,
  AllBackers = 1,
  InternalTest = 2,
  Development = 4,
  Alpha = 8,
  Beta1 = 16,
  Beta2 = 32,
  Beta3 = 64,
}
window.PatchPermissions = PatchPermissions;

declare global {
  type AbilityInstanceID = number;
}

declare global {
  enum EntityResourceType {
    None = 0,
    Stamina = 2,
    Health = 3,
    Panic = 6,
    Barrier = 7,
    Count = 8,
  }
  interface Window {
    EntityResourceType: typeof EntityResourceType;
  }
}
enum EntityResourceType {
  None = 0,
  Stamina = 2,
  Health = 3,
  Panic = 6,
  Barrier = 7,
  Count = 8,
}
window.EntityResourceType = EntityResourceType;

declare global {
  enum AccessType {
    Public = 0,
    Beta3 = 1,
    Beta2 = 2,
    Beta1 = 3,
    Alpha = 4,
    InternalTest = 5,
    Employees = 6,
  }
  interface Window {
    AccessType: typeof AccessType;
  }
}
enum AccessType {
  Public = 0,
  Beta3 = 1,
  Beta2 = 2,
  Beta1 = 3,
  Alpha = 4,
  InternalTest = 5,
  Employees = 6,
}
window.AccessType = AccessType;

declare global {
  type ChannelID = number;
}

declare global {
  enum ServerStatus {
    Offline = 0,
    Starting = 1,
    Online = 2,
  }
  interface Window {
    ServerStatus: typeof ServerStatus;
  }
}
enum ServerStatus {
  Offline = 0,
  Starting = 1,
  Online = 2,
}
window.ServerStatus = ServerStatus;

declare global {
  enum AnnouncementType {
    Text = 1,
    PopUp = 2,
    Worldspace = 4,
    PassiveAlert = 8,
    ALL = -1,
  }
  interface Window {
    AnnouncementType: typeof AnnouncementType;
  }
}
enum AnnouncementType {
  Text = 1,
  PopUp = 2,
  Worldspace = 4,
  PassiveAlert = 8,
  ALL = -1,
}
window.AnnouncementType = AnnouncementType;

declare global {
  enum ScenarioRoundState {
    Uninitialized = 0,
    Initializing = 1,
    WaitingForConnections = 2,
    Countdown = 3,
    Running = 4,
    Ended = 5,
    COUNT = 6,
  }
  interface Window {
    ScenarioRoundState: typeof ScenarioRoundState;
  }
}
enum ScenarioRoundState {
  Uninitialized = 0,
  Initializing = 1,
  WaitingForConnections = 2,
  Countdown = 3,
  Running = 4,
  Ended = 5,
  COUNT = 6,
}
window.ScenarioRoundState = ScenarioRoundState;

declare global {
  enum RuneType {
    Weapon = 0,
    Protection = 1,
    Health = 2,
    Count = 3,
  }
  interface Window {
    RuneType: typeof RuneType;
  }
}
enum RuneType {
  Weapon = 0,
  Protection = 1,
  Health = 2,
  Count = 3,
}
window.RuneType = RuneType;

declare global {
  enum FieldCodes {
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
    UnspecifiedServiceUnavailable = 5000,
    DatabaseUnavailable = 5001,
    GroupServiceUnavailable = 5002,
    GameServiceUnavailable = 5003,
    PresenceServiceUnavailable = 5004,
    InvalidModel = 30001,
  }
  interface Window {
    FieldCodes: typeof FieldCodes;
  }
}
enum FieldCodes {
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
  UnspecifiedServiceUnavailable = 5000,
  DatabaseUnavailable = 5001,
  GroupServiceUnavailable = 5002,
  GameServiceUnavailable = 5003,
  PresenceServiceUnavailable = 5004,
  InvalidModel = 30001,
}
window.FieldCodes = FieldCodes;

declare global {
  enum AuthActionErrorCode {
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
  interface Window {
    AuthActionErrorCode: typeof AuthActionErrorCode;
  }
}
enum AuthActionErrorCode {
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
window.AuthActionErrorCode = AuthActionErrorCode;

declare global {
  enum APIPermissions {
    None = 0,
    EquipmentRead = 1,
    InventoryRead = 2,
    StatsAndTraitsRead = 3,
    LiveStatusRead = 4,
    ProgressionRead = 5,
    FriendsRead = 6,
    EnemiesRead = 7,
    ActiveWarbandRead = 8,
    BattlegroupRead = 9,
    WarbandsRead = 10,
    OrderRead = 11,
    CampaignsRead = 12,
    LiveWarbandRead = 13,
    LiveBattlegroupRead = 14,
    VoxInventoryRead = 15,
    VoxJobsRead = 16,
    InvitesRead = 17,
    PlotRead = 30,
    PlotQueueRead = 31,
    CreateCharacters = 1000,
    DeleteCharacters = 1001,
    ManageEquipment = 1002,
    ManageInventory = 1003,
    ManageContainers = 1004,
    ManageAbilities = 1005,
    AcceptInvites = 2000,
    ManageWarbands = 2003,
    ManageOrder = 2003,
    ManageBattlegroups = 2004,
    VoxDeposit = 3000,
    VoxWithdraw = 3001,
    ManageVoxJobs = 3002,
    ManagePlot = 4000,
    Game = 9001,
    Chat = 9002,
    Intraserver = 2147483645,
    All = 2147483647,
  }
  interface Window {
    APIPermissions: typeof APIPermissions;
  }
}
enum APIPermissions {
  None = 0,
  EquipmentRead = 1,
  InventoryRead = 2,
  StatsAndTraitsRead = 3,
  LiveStatusRead = 4,
  ProgressionRead = 5,
  FriendsRead = 6,
  EnemiesRead = 7,
  ActiveWarbandRead = 8,
  BattlegroupRead = 9,
  WarbandsRead = 10,
  OrderRead = 11,
  CampaignsRead = 12,
  LiveWarbandRead = 13,
  LiveBattlegroupRead = 14,
  VoxInventoryRead = 15,
  VoxJobsRead = 16,
  InvitesRead = 17,
  PlotRead = 30,
  PlotQueueRead = 31,
  CreateCharacters = 1000,
  DeleteCharacters = 1001,
  ManageEquipment = 1002,
  ManageInventory = 1003,
  ManageContainers = 1004,
  ManageAbilities = 1005,
  AcceptInvites = 2000,
  ManageWarbands = 2003,
  ManageOrder = 2003,
  ManageBattlegroups = 2004,
  VoxDeposit = 3000,
  VoxWithdraw = 3001,
  ManageVoxJobs = 3002,
  ManagePlot = 4000,
  Game = 9001,
  Chat = 9002,
  Intraserver = 2147483645,
  All = 2147483647,
}
window.APIPermissions = APIPermissions;

export const ChampionAPI = {
  SelectChampion: function(config: RequestConfig, request: Partial<SelectChampionRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/champion/select/', {
    }, request, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  LockInChampionSelection: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/champion/lock/', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  UnLockInChampionSelection: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/champion/unlock/', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const ContentAPI = {
  MessageOfTheDayV1: function(config: RequestConfig, channel: Partial<ChannelID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/messageoftheday', {
      channel: channel,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  PatcherHeroContentV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/patcherherocontent', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  PatcherAlertsV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/patcheralerts', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const DisplayNameAPI = {
  SetDisplayName: function(config: RequestConfig, wantName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/displayname/set', {
      wantName: wantName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const GameDataAPI = {
  GetFactionInfoV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/factionInfo', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetFactionsV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/factions', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetArchetypesV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/archetypes', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetRacesV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/races', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetOrderPermissionsV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/orderPermissions', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetChatAddressV1: function(config: RequestConfig, shard: Partial<ShardID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/gamedata/getchataddress', {
      shard: shard,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const GroupsAPI = {
  KickV1: function(config: RequestConfig, groupID: Partial<GroupID>, targetEntityID: Partial<EntityID | null>, targetCharacterID: Partial<CharacterID | null>, targetName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/kick', {
      groupID: groupID,
      targetEntityID: targetEntityID,
      targetCharacterID: targetCharacterID,
      targetName: targetName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  MakeLeaderV1: function(config: RequestConfig, groupID: Partial<GroupID>, targetEntityID: Partial<EntityID | null>, targetCharacterID: Partial<CharacterID | null>, targetName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/makeleader', {
      groupID: groupID,
      targetEntityID: targetEntityID,
      targetCharacterID: targetCharacterID,
      targetName: targetName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GrantPermissionV1: function(config: RequestConfig, groupID: Partial<GroupID>, permissionToGrant: Partial<string>, targetEntityID: Partial<EntityID | null>, targetCharacterID: Partial<CharacterID | null>, targetName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/grantpermission', {
      groupID: groupID,
      permissionToGrant: permissionToGrant,
      targetEntityID: targetEntityID,
      targetCharacterID: targetCharacterID,
      targetName: targetName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GrantInvitePermissionV1: function(config: RequestConfig, groupID: Partial<GroupID>, targetEntityID: Partial<EntityID | null>, targetCharacterID: Partial<CharacterID | null>, targetName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/grantinvitepermission', {
      groupID: groupID,
      targetEntityID: targetEntityID,
      targetCharacterID: targetCharacterID,
      targetName: targetName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RevokePermissionV1: function(config: RequestConfig, groupID: Partial<GroupID>, permissionToRevoke: Partial<string>, targetEntityID: Partial<EntityID | null>, targetCharacterID: Partial<CharacterID | null>, targetName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/revokepermission', {
      groupID: groupID,
      permissionToRevoke: permissionToRevoke,
      targetEntityID: targetEntityID,
      targetCharacterID: targetCharacterID,
      targetName: targetName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CreateWarbandV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/createWarband', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CreatePermanentWarbandV1: function(config: RequestConfig, name: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/createPermanentWarband', {
      name: name,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CreateBattlegroupV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/createBattlegroup', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CreateOrderV1: function(config: RequestConfig, name: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/createOrder', {
      name: name,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  InviteV1: function(config: RequestConfig, groupID: Partial<GroupID | null>, targetID: Partial<CharacterID | null>, targetName: Partial<string>, groupType: Partial<GroupTypes | null>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/invite', {
      groupID: groupID,
      targetID: targetID,
      targetName: targetName,
      groupType: groupType,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  JoinV1: function(config: RequestConfig, groupID: Partial<GroupID>, inviteCode: Partial<InviteCode | null>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/join', {
      groupID: groupID,
      inviteCode: inviteCode,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  QuitV1: function(config: RequestConfig, groupID: Partial<GroupID | null>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/quit', {
      groupID: groupID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  AbandonV1: function(config: RequestConfig, groupID: Partial<GroupID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/abandon', {
      groupID: groupID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  DisbandV1: function(config: RequestConfig, groupID: Partial<GroupID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/disband', {
      groupID: groupID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  ReadyUpV1: function(config: RequestConfig, groupID: Partial<GroupID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/ready', {
      groupID: groupID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  UnReadyV1: function(config: RequestConfig, groupID: Partial<GroupID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/groups/unready', {
      groupID: groupID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const MatchmakingAPI = {
  EnterMatchmaking: function(config: RequestConfig, request: Partial<EnterMatchmakingRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/matchmaking/enter/', {
    }, request, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CancelMatchmaking: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/matchmaking/cancel/', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetMatchOverrides: function(config: RequestConfig, request: Partial<SetMatchOverridesRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/matchmaking/setmatchoverrides/', {
    }, request, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const PresenceAPI = {
  GetStartingServer: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/presence/startingServer', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetProxyByZone: function(config: RequestConfig, zoneInstanceID: Partial<ZoneInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/presence/proxyByZone/{zoneInstanceID}', {
      zoneInstanceID: zoneInstanceID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetProxyByServerAddress: function(config: RequestConfig, serverAddress: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/presence/proxyByServerAddress/{serverAddress}', {
      serverAddress: serverAddress,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetServers: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/presence/servers', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetPlayers: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/presence/players', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const ProfileAPI = {
  SetDefaultChampion: function(config: RequestConfig, champion: Partial<ClassDefRef>, costume: Partial<RaceDefRef>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/profile/setdefaultchampion/', {
      champion: champion,
      costume: costume,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GracefulDisconnect: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/profile/disconnect', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const ScenarioAPI = {
  RewardThumbsUp: function(config: RequestConfig, scenarioID: Partial<ScenarioInstanceID>, targetCharacterID: Partial<CharacterID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/scenarios/rewardthumbsup', {
      scenarioID: scenarioID,
      targetCharacterID: targetCharacterID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RevokeThumbsUp: function(config: RequestConfig, scenarioID: Partial<ScenarioInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/scenarios/revokethumbsup', {
      scenarioID: scenarioID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}


declare global {
  interface CurrentMaxValue {
    current: number;
    maximum: number;
  }
  
  interface Temperature {
    current: number;
    freezingThreshold: number;
    burndingThreshold: number;
  }
  
  type Vec2F = Vec2f;
  type Vec3F = Vec3f;

  interface Quat {
    x: number;
    y: number;
    z: number;
    w: number;
  }

  type ClassDefRef = string;
  type RaceDefRef = string;
}
