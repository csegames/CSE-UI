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
    faction: Faction;
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
  export interface CreateAbilityRequest {
    Name: string;
    Description: string;
    IconURL: string;
    NetworkID: string;
    Components: string[];
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
  type VoxJobGroupInstanceID = string;
}

declare global {
  type VoxJobInstanceID = string;
}

declare global {
  type VoxNotesInstanceID = string;
}

declare global {
  type EntityID = string;
}

declare global {
  type CharacterID = string;
}

declare global {
  type ItemStackHash = string;
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
  export interface ProgressionError {
    ProgressionResult: ProgressionResult;
    Message: string;
    ResultCode: ProgressionResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface SecureTradeError {
    SecureTradeResult: ModifySecureTradeAPIResult;
    Message: string;
    ResultCode: ModifySecureTradeResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface ModifyVoxJobError {
    VoxJobResult: ModifyVoxJobResult;
    Message: string;
    VoxJobCode: ModifyVoxJobResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface ModifyAbilityError {
    AbilityResult: ModifyAbilityResult;
    Message: string;
    AbilityCode: ModifyAbilityResultCode;
    Code: FieldCodes;
  }
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
  export interface MoveItemError {
    MoveItemResult: MoveItemResult;
    Message: string;
    MoveItemCode: MoveItemResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface ItemActionError {
    ItemActionResult: ItemActionResult;
    Message: string;
    ItemActionCode: ItemActionResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface ModifyItemError {
    ModifyItemResult: ModifyItemResult;
    Message: string;
    ReanameItemCode: ModifyItemResultCode;
    Code: FieldCodes;
  }
}

declare global {
  export interface ModifyPlotError {
    ModifyPlotResult: ModifyPlotResult;
    Message: string;
    MoveItemCode: ModifyPlotResultCode;
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
  export interface ProgressionResult {
    Result: ProgressionResultCode;
    IsSuccess: boolean;
    Details: string;
  }
}

declare global {
  export interface QueueStatusMessage {
    status: string;
    numContributors: number;
    maxContributors: number;
    blueprints: QueuedBlueprintMessage[];
  }
}

declare global {
  export interface QueuedBlueprintMessage {
    percentComplete: number;
    estTimeRemaining: number;
    subName: string;
    amtNeeded: number;
  }
}

declare global {
  export interface PermissibleGrantTargetConfig {
    TargetType: PermissibleTargetType;
    CharacterName: string;
    CharacterID: CharacterID;
    CharacterFaction: Faction;
  }
}

declare global {
  export interface ItemActionParameters {
    WorldPosition: Vec3F;
    Rotation: Euler3f;
    BoneAlias: BoneAlias;
  }
}

declare global {
  export interface ItemActionResult {
    Code: ItemActionResultCode;
    Message: string;
  }
}

declare global {
  export interface ModifyItemResult {
    Code: ModifyItemResultCode;
    Message: string;
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
  export interface ModifySecureTradeAPIResult {
    Result: ModifySecureTradeResultCode;
    IsSuccess: boolean;
    Details: string;
    SecureTradeID: SecureTradeInstanceID;
    TradeCompleted: boolean;
    MovedItemIDs: ItemInstanceID[];
  }
}

declare global {
  export interface MoveItemRequest {
    MoveItemID: ItemInstanceID;
    StackHash: ItemStackHash;
    UnitCount: number;
    To: MoveItemRequestLocation;
    From: MoveItemRequestLocation;
  }
}

declare global {
  export interface MoveItemRequestLocation {
    CharacterID: CharacterID;
    EntityID: EntityID;
    Position: number;
    ContainerID: ItemInstanceID;
    DrawerID: string;
    GearSlotIDs: string[];
    VoxSlot: SubItemSlot;
    BuildingID: BuildingPlotInstanceID;
    WorldPosition: Vec3F;
    Rotation: Euler3f;
    Location: MoveItemRequestLocationType;
    BoneAlias: BoneAlias;
  }
}

declare global {
  export interface MoveItemResult {
    MovedItemIDs: ItemInstanceID[];
    CreatedEntityID: EntityID;
    Code: MoveItemResultCode;
    Message: string;
  }
}

declare global {
  export interface ModifyVoxJobResult {
    Result: ModifyVoxJobResultCode;
    IsSuccess: boolean;
    Details: string;
    MovedItemID: ItemInstanceID;
    DiscoveredRecipeIDs: string[];
    NewVoxJobID: VoxJobInstanceID;
  }
}

declare global {
  type GroupID = string;
}

declare global {
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
}

declare global {
  type InviteCode = string;
}

declare global {
  type TargetID = string;
}

declare global {
  export interface IActionError {
    Code: ActionErrorCode;
    Message: string;
  }
}

declare global {
  type ContainerDrawerID = string;
}

declare global {
  type ResourceNodeInstanceID = string;
}

declare global {
  type ResourceNodeSpawnerInstanceID = string;
}

declare global {
  type SecureTradeInstanceID = string;
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
  type BuildingCellDataInstanceID = string;
}

declare global {
  type BuildingPlotInstanceID = string;
}

declare global {
  export interface ModifyPlotResult {
    Code: ModifyPlotResultCode;
    Message: string;
    QueueStatus: QueueStatusMessage;
  }
}

declare global {
  export interface ModifyAbilityResult {
    Result: ModifyAbilityResultCode;
    IsSuccess: boolean;
    Details: string;
    ErrorComponentID: string;
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
  type StringID = string;
}

declare global {
  type AccountID = string;
}

declare global {
  export interface ArchetypeInfo {
    description: string;
    faction: Faction;
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
    faction: Faction;
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
    faction: Faction;
    gender: Gender;
    id: string;
    lastLogin: string;
    name: string;
    race: Race;
    shardID: number;
  }
}

declare global {
  export interface ControlGameState {
    arthurianScore: number;
    controlPoints: ControlPoint[];
    gameState: number;
    timeLeft: number;
    tuathaDeDanannScore: number;
    vikingScore: number;
  }
}

declare global {
  export interface ControlPoint {
    faction: string;
    id: string;
    size: string;
    x: number;
    y: number;
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
  export interface Proxy {
    Address: string;
    Port: number;
  }
}

declare global {
  export interface RaceInfo {
    name: string;
    description: string;
    faction: Faction;
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
}

declare global {
  export interface ServerState {
    controlGameState: ControlGameState;
    playerCounts: PlayerCounts;
    spawnPoints: SpawnPoint[];
  }
}

declare global {
  export interface SpawnPoint {
    id: string;
    faction: Faction;
    position: Vec3f;
  }
}

declare global {
  export interface PlayerCounts {
    arthurian: number;
    maxPlayers: number;
    tuatha: number;
    viking: number;
  }
}

declare global {
  export interface StartingServer {
    Address: string;
    ZoneInstanceID: number;
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
  export interface Trait {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    prerequisites: string[];
  }
}

declare global {
  export interface OptionalAndRequiredTraits {
    required: string[];
    optional: string[];
  }
}

declare global {
  export interface ExclusiveTraits {
    ids: string[];
    minRequired: number;
    maxAllowed: number;
  }
}

declare global {
  export interface TraitList {
    traits: Trait[];
    factions: { [key: string]: OptionalAndRequiredTraits; };
    races: { [key: string]: OptionalAndRequiredTraits; };
    archetypes: { [key: string]: OptionalAndRequiredTraits; };
    ranks: string[][];
    exclusivity: ExclusiveTraits[];
  }
}

declare global {
  export interface WarbandMember {
    additionalPermissions: string[];
    archetype: Archetype;
    avatar: string;
    blood: CurrentMaxValue;
    characterID: string;
    gender: Gender;
    health: CurrentMaxValue[];
    joined: string;
    name: string;
    panic: CurrentMaxValue;
    parted: string;
    race: Race;
    rank: string;
    stamina: CurrentMaxValue;
    temperature: Temperature;
    wounds: number[];
  }
}

declare global {
  type ItemRequirementID = string;
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
  export interface RealmRestricted {
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
    Druid = 1,
    WaveWeaver = 2,
    BlackKnight = 8,
    Fianna = 9,
    Mjolnir = 10,
    Physician = 11,
    Empath = 12,
    Stonehealer = 13,
    Blackguard = 14,
    ForestStalker = 15,
    WintersShadow = 16,
    FlameWarden = 17,
    Minstrel = 18,
    DarkFool = 19,
    Skald = 20,
    Abbot = 21,
    BlessedCrow = 22,
    Helbound = 23,
  }
  interface Window {
    Archetype: typeof Archetype;
  }
}
enum Archetype {
  Druid = 1,
  WaveWeaver = 2,
  BlackKnight = 8,
  Fianna = 9,
  Mjolnir = 10,
  Physician = 11,
  Empath = 12,
  Stonehealer = 13,
  Blackguard = 14,
  ForestStalker = 15,
  WintersShadow = 16,
  FlameWarden = 17,
  Minstrel = 18,
  DarkFool = 19,
  Skald = 20,
  Abbot = 21,
  BlessedCrow = 22,
  Helbound = 23,
}
window.Archetype = Archetype;

declare global {
  enum Faction {
    Factionless = 0,
    TDD = 1,
    Viking = 2,
    Arthurian = 3,
    COUNT = 4,
  }
  interface Window {
    Faction: typeof Faction;
  }
}
enum Faction {
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3,
  COUNT = 4,
}
window.Faction = Faction;

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
    Luchorpan = 2,
    Valkyrie = 4,
    HumanMaleV = 15,
    HumanMaleA = 16,
    HumanMaleT = 17,
    Pict = 18,
    Charlotte = 19,
    DragonArthurian = 45,
    DragonTDD = 46,
    DragonViking = 47,
    DragonFactionless = 48,
  }
  interface Window {
    Race: typeof Race;
  }
}
enum Race {
  Luchorpan = 2,
  Valkyrie = 4,
  HumanMaleV = 15,
  HumanMaleA = 16,
  HumanMaleT = 17,
  Pict = 18,
  Charlotte = 19,
  DragonArthurian = 45,
  DragonTDD = 46,
  DragonViking = 47,
  DragonFactionless = 48,
}
window.Race = Race;

declare global {
  enum StatType {
    None = 0,
    Primary = 1,
    Secondary = 2,
    Derived = 3,
    Hidden = 4,
  }
  interface Window {
    StatType: typeof StatType;
  }
}
enum StatType {
  None = 0,
  Primary = 1,
  Secondary = 2,
  Derived = 3,
  Hidden = 4,
}
window.StatType = StatType;

declare global {
  enum SubItemSlot {
    Invalid = 0,
    PrimaryIngredient = 1,
    SecondaryIngredient1 = 2,
    SecondaryIngredient2 = 3,
    SecondaryIngredient3 = 4,
    SecondaryIngredient4 = 5,
    Alloy = 6,
    WeaponBlade = 7,
    WeaponHandle = 8,
    NonRecipe = 9,
  }
  interface Window {
    SubItemSlot: typeof SubItemSlot;
  }
}
enum SubItemSlot {
  Invalid = 0,
  PrimaryIngredient = 1,
  SecondaryIngredient1 = 2,
  SecondaryIngredient2 = 3,
  SecondaryIngredient3 = 4,
  SecondaryIngredient4 = 5,
  Alloy = 6,
  WeaponBlade = 7,
  WeaponHandle = 8,
  NonRecipe = 9,
}
window.SubItemSlot = SubItemSlot;

declare global {
  enum ZoneType {
    None = 0,
    Home = 1,
    Builder = 2,
    Contested = 3,
  }
  interface Window {
    ZoneType: typeof ZoneType;
  }
}
enum ZoneType {
  None = 0,
  Home = 1,
  Builder = 2,
  Contested = 3,
}
window.ZoneType = ZoneType;

declare global {
  enum ProgressionResultCode {
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
  interface Window {
    ProgressionResultCode: typeof ProgressionResultCode;
  }
}
enum ProgressionResultCode {
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
window.ProgressionResultCode = ProgressionResultCode;

declare global {
  type ZoneInstanceID = any;
}

declare global {
  enum ItemActionResultCode {
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
  interface Window {
    ItemActionResultCode: typeof ItemActionResultCode;
  }
}
enum ItemActionResultCode {
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
window.ItemActionResultCode = ItemActionResultCode;

declare global {
  enum ModifyItemResultCode {
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
  interface Window {
    ModifyItemResultCode: typeof ModifyItemResultCode;
  }
}
enum ModifyItemResultCode {
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
window.ModifyItemResultCode = ModifyItemResultCode;

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
  enum ModifySecureTradeResultCode {
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
  interface Window {
    ModifySecureTradeResultCode: typeof ModifySecureTradeResultCode;
  }
}
enum ModifySecureTradeResultCode {
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
window.ModifySecureTradeResultCode = ModifySecureTradeResultCode;

declare global {
  enum MoveItemRequestLocationType {
    Invalid = 0,
    Container = 1,
    Equipment = 2,
    Ground = 3,
    Inventory = 4,
    Vox = 5,
    Trash = 6,
    BuildingPlaced = 7,
  }
  interface Window {
    MoveItemRequestLocationType: typeof MoveItemRequestLocationType;
  }
}
enum MoveItemRequestLocationType {
  Invalid = 0,
  Container = 1,
  Equipment = 2,
  Ground = 3,
  Inventory = 4,
  Vox = 5,
  Trash = 6,
  BuildingPlaced = 7,
}
window.MoveItemRequestLocationType = MoveItemRequestLocationType;

declare global {
  enum MoveItemResultCode {
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
    UnknownError = 31,
  }
  interface Window {
    MoveItemResultCode: typeof MoveItemResultCode;
  }
}
enum MoveItemResultCode {
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
  UnknownError = 31,
}
window.MoveItemResultCode = MoveItemResultCode;

declare global {
  enum ModifyVoxJobResultCode {
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
    InvalidRequest = -1,
  }
  interface Window {
    ModifyVoxJobResultCode: typeof ModifyVoxJobResultCode;
  }
}
enum ModifyVoxJobResultCode {
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
  InvalidRequest = -1,
}
window.ModifyVoxJobResultCode = ModifyVoxJobResultCode;

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
  enum InviteStatus {
    Active = 0,
    Revoked = 1,
    UsageLimitReached = 2,
    Expired = 3,
  }
  interface Window {
    InviteStatus: typeof InviteStatus;
  }
}
enum InviteStatus {
  Active = 0,
  Revoked = 1,
  UsageLimitReached = 2,
  Expired = 3,
}
window.InviteStatus = InviteStatus;

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
  enum ResourceNodePermissions {
    None = 0,
    Take = 1,
    AutoDiscovered = 2,
    All = -1,
  }
  interface Window {
    ResourceNodePermissions: typeof ResourceNodePermissions;
  }
}
enum ResourceNodePermissions {
  None = 0,
  Take = 1,
  AutoDiscovered = 2,
  All = -1,
}
window.ResourceNodePermissions = ResourceNodePermissions;

declare global {
  enum PermissibleSetKeyType {
    Invalid = 0,
    Faction = 1,
    ScenarioTeam = 2,
    ScenarioRole = 3,
  }
  interface Window {
    PermissibleSetKeyType: typeof PermissibleSetKeyType;
  }
}
enum PermissibleSetKeyType {
  Invalid = 0,
  Faction = 1,
  ScenarioTeam = 2,
  ScenarioRole = 3,
}
window.PermissibleSetKeyType = PermissibleSetKeyType;

declare global {
  enum PermissibleTargetType {
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
  interface Window {
    PermissibleTargetType: typeof PermissibleTargetType;
  }
}
enum PermissibleTargetType {
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
window.PermissibleTargetType = PermissibleTargetType;

declare global {
  enum ItemPermissions {
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
  interface Window {
    ItemPermissions: typeof ItemPermissions;
  }
}
enum ItemPermissions {
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
window.ItemPermissions = ItemPermissions;

declare global {
  enum VoxJobType {
    Invalid = 0,
    Block = 1,
    Grind = 2,
    Make = 3,
    Purify = 4,
    Repair = 5,
    Salvage = 6,
    Shape = 7,
  }
  interface Window {
    VoxJobType: typeof VoxJobType;
  }
}
enum VoxJobType {
  Invalid = 0,
  Block = 1,
  Grind = 2,
  Make = 3,
  Purify = 4,
  Repair = 5,
  Salvage = 6,
  Shape = 7,
}
window.VoxJobType = VoxJobType;

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
  enum PlotPermissions {
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
  interface Window {
    PlotPermissions: typeof PlotPermissions;
  }
}
enum PlotPermissions {
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
window.PlotPermissions = PlotPermissions;

declare global {
  enum ModifyPlotResultCode {
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
  interface Window {
    ModifyPlotResultCode: typeof ModifyPlotResultCode;
  }
}
enum ModifyPlotResultCode {
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
window.ModifyPlotResultCode = ModifyPlotResultCode;

declare global {
  enum ModifyAbilityResultCode {
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
  interface Window {
    ModifyAbilityResultCode: typeof ModifyAbilityResultCode;
  }
}
enum ModifyAbilityResultCode {
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
window.ModifyAbilityResultCode = ModifyAbilityResultCode;

declare global {
  type AbilityInstanceID = number;
}

declare global {
  enum EntityResourceType {
    None = 0,
    Blood = 1,
    Stamina = 2,
    Health = 3,
    Madness = 4,
    FlameCharges = 5,
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
  Blood = 1,
  Stamina = 2,
  Health = 3,
  Madness = 4,
  FlameCharges = 5,
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
  enum SpawnPointPermissions {
    None = 0,
    Spawn = 1,
    All = -1,
  }
  interface Window {
    SpawnPointPermissions: typeof SpawnPointPermissions;
  }
}
enum SpawnPointPermissions {
  None = 0,
  Spawn = 1,
  All = -1,
}
window.SpawnPointPermissions = SpawnPointPermissions;

declare global {
  enum ItemPlacementType {
    None = 0,
    Door = 1,
    Plot = 2,
    BuildingFaceSide = 3,
    BuildingFaceBottom = 4,
    BuildingFaceTop = 5,
  }
  interface Window {
    ItemPlacementType: typeof ItemPlacementType;
  }
}
enum ItemPlacementType {
  None = 0,
  Door = 1,
  Plot = 2,
  BuildingFaceSide = 3,
  BuildingFaceBottom = 4,
  BuildingFaceTop = 5,
}
window.ItemPlacementType = ItemPlacementType;

declare global {
  enum ItemTemplateType {
    None = 0,
    TemplateOnly = 1,
    Entity = 2,
  }
  interface Window {
    ItemTemplateType: typeof ItemTemplateType;
  }
}
enum ItemTemplateType {
  None = 0,
  TemplateOnly = 1,
  Entity = 2,
}
window.ItemTemplateType = ItemTemplateType;

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

export const AbilitiesAPI = {
  CreateAbility: function(config: RequestConfig, request: Partial<CreateAbilityRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/abilities/create', {
      request: request,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  ModifyAbility: function(config: RequestConfig, abilityID: Partial<AbilityInstanceID>, request: Partial<CreateAbilityRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/abilities/modify', {
      abilityID: abilityID,
      request: request,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  DeleteAbility: function(config: RequestConfig, abilityID: Partial<AbilityInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/abilities/delete', {
      abilityID: abilityID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const CharactersAPI = {
  CreateCharacterV2: function(config: RequestConfig, shardID: Partial<ShardID>, character: Partial<Character>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/characters/create', {
      shardID: shardID,
    }, character, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CSECreateCharacterV2: function(config: RequestConfig, shardID: Partial<ShardID>, accountID: Partial<AccountID>, character: Partial<Character>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/characters/csecreate', {
      shardID: shardID,
      accountID: accountID,
    }, character, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  DeleteCharacterV1: function(config: RequestConfig, shardID: Partial<ShardID>, characterID: Partial<CharacterID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/characters/delete', {
      shardID: shardID,
      characterID: characterID,
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

export const CraftingAPI = {
  SwapVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>, job: Partial<VoxJobType>, recipeID: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/swapvoxjob', {
      voxEntityID: voxEntityID,
      job: job,
      recipeID: recipeID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  AppendVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>, job: Partial<VoxJobType>, recipeID: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/appendvoxjob', {
      voxEntityID: voxEntityID,
      job: job,
      recipeID: recipeID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  ClearVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>, voxJobInstanceID: Partial<VoxJobInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/clearvoxjob', {
      voxEntityID: voxEntityID,
      voxJobInstanceID: voxJobInstanceID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  MoveQueuedJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>, voxJobInstanceID: Partial<VoxJobInstanceID>, newIndex: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/movequeuedjob', {
      voxEntityID: voxEntityID,
      voxJobInstanceID: voxJobInstanceID,
      newIndex: newIndex,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetRecipeID: function(config: RequestConfig, voxEntityID: Partial<EntityID>, recipeID: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxrecipeid', {
      voxEntityID: voxEntityID,
      recipeID: recipeID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetQuality: function(config: RequestConfig, voxEntityID: Partial<EntityID>, quality: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxquality', {
      voxEntityID: voxEntityID,
      quality: quality,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetCustomItemName: function(config: RequestConfig, voxEntityID: Partial<EntityID>, itemName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxcustomitemname', {
      voxEntityID: voxEntityID,
      itemName: itemName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  StartVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/startvoxjob', {
      voxEntityID: voxEntityID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CollectFinishedVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>, jobID: Partial<VoxJobInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/collectfinishedvoxjob', {
      voxEntityID: voxEntityID,
      jobID: jobID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CancelVoxJob: function(config: RequestConfig, voxEntityID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/cancelvoxjob', {
      voxEntityID: voxEntityID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetVoxItemCount: function(config: RequestConfig, voxEntityID: Partial<EntityID>, count: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxitemcount', {
      voxEntityID: voxEntityID,
      count: count,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetCraftingNotes: function(config: RequestConfig, instanceID: Partial<VoxNotesInstanceID>, notes: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxnotes', {
      instanceID: instanceID,
      notes: notes,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetVoxJobGroupNotes: function(config: RequestConfig, jobIdentifier: Partial<string>, jobType: Partial<VoxJobType>, notes: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxjobgroupnotes', {
      jobIdentifier: jobIdentifier,
      jobType: jobType,
      notes: notes,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetVoxJobNotes: function(config: RequestConfig, jobID: Partial<VoxJobInstanceID>, notes: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxjobnotes', {
      jobID: jobID,
      notes: notes,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetVoxJobGroupFavorite: function(config: RequestConfig, jobIdentifier: Partial<string>, jobType: Partial<VoxJobType>, favorite: Partial<boolean>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxjobgroupfavorite', {
      jobIdentifier: jobIdentifier,
      jobType: jobType,
      favorite: favorite,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetVoxJobFavorite: function(config: RequestConfig, jobID: Partial<VoxJobInstanceID>, favorite: Partial<boolean>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/crafting/setvoxjobfavorite', {
      jobID: jobID,
      favorite: favorite,
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

export const ItemAPI = {
  MoveItems: function(config: RequestConfig, request: Partial<MoveItemRequest>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/items/moveitems', {
      request: request,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  BatchMoveItems: function(config: RequestConfig, requests: Partial<MoveItemRequest[]>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/items/batchmoveitems', {
    }, requests, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  SetContainerColor: function(config: RequestConfig, itemInstanceID: Partial<ItemInstanceID>, itemEntityID: Partial<EntityID>, red: Partial<number>, green: Partial<number>, blue: Partial<number>, alpha: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/items/setcontainercolor', {
      itemInstanceID: itemInstanceID,
      itemEntityID: itemEntityID,
      red: red,
      green: green,
      blue: blue,
      alpha: alpha,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RenameItem: function(config: RequestConfig, itemInstanceID: Partial<ItemInstanceID>, itemEntityID: Partial<EntityID>, newName: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/items/renameitem', {
      itemInstanceID: itemInstanceID,
      itemEntityID: itemEntityID,
      newName: newName,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  PerformItemAction: function(config: RequestConfig, itemInstanceID: Partial<ItemInstanceID>, itemEntityID: Partial<EntityID>, actionID: Partial<string>, parameters: Partial<ItemActionParameters>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/items/performitemaction', {
      itemInstanceID: itemInstanceID,
      itemEntityID: itemEntityID,
      actionID: actionID,
      parameters: parameters,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const OrdersAPI = {
}

export const PlotsAPI = {
  ReleasePlot: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/releasePlot', {
      plotInstanceID: plotInstanceID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GeneratePlotDeed: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/generatePlotDeed', {
      plotInstanceID: plotInstanceID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  TakeOwnership: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/takeOwnership', {
      plotInstanceID: plotInstanceID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GrantPermissions: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>, newPermissions: Partial<PlotPermissions>, target: Partial<PermissibleGrantTargetConfig>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/grantPermissions', {
      plotInstanceID: plotInstanceID,
      newPermissions: newPermissions,
      target: target,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RevokePermissions: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>, revokePermissions: Partial<PlotPermissions>, target: Partial<PermissibleGrantTargetConfig>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/revokePermissions', {
      plotInstanceID: plotInstanceID,
      revokePermissions: revokePermissions,
      target: target,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetQueueStatus: function(config: RequestConfig, plotInstanceID: Partial<BuildingPlotInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/plot/getQueueStatus', {
      plotInstanceID: plotInstanceID,
    }, null, { headers: Object.assign({}, {
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

export const ProgressionAPI = {
  CollectCharacterDayProgression: function(config: RequestConfig, logID: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/character/collectdayprogression', {
      logID: logID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const ScenarioAPI = {
  AddToQueue: function(config: RequestConfig, queueID: Partial<MatchQueueInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/scenarios/addtoqueue', {
      queueID: queueID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RemoveFromQueue: function(config: RequestConfig, queueID: Partial<MatchQueueInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/scenarios/removefromqueue', {
      queueID: queueID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RemoveFromScenario: function(config: RequestConfig, scenarioID: Partial<ScenarioInstanceID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/scenarios/removefromscenario', {
      scenarioID: scenarioID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const SecureTradeAPI = {
  Invite: function(config: RequestConfig, tradeTargetID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/invite', {
      tradeTargetID: tradeTargetID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RevokeInvite: function(config: RequestConfig, inviteTargetID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/revokeinvite', {
      inviteTargetID: inviteTargetID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  AcceptInvite: function(config: RequestConfig, inviterID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/acceptinvite', {
      inviterID: inviterID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RejectInvite: function(config: RequestConfig, inviterID: Partial<EntityID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/rejectinvite', {
      inviterID: inviterID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  AbortSecureTrade: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/abort', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  Lock: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/lock', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  Unlock: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/unlock', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  AddItem: function(config: RequestConfig, itemInstanceID: Partial<ItemInstanceID>, unitCount: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/additem', {
      itemInstanceID: itemInstanceID,
      unitCount: unitCount,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  RemoveItem: function(config: RequestConfig, itemInstanceID: Partial<ItemInstanceID>, unitCount: Partial<number>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/removeItem', {
      itemInstanceID: itemInstanceID,
      unitCount: unitCount,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  Confirm: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/confirm', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  CancelTradeConfirmation: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('post', conf.url + 'v1/secureTrade/cancelconfirmation', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const ServersAPI = {
  GetHostsForServerV1: function(config: RequestConfig, channelId: Partial<ChannelID>, name: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/servers/getHosts', {
      channelId: channelId,
      name: name,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetAvailableZones: function(config: RequestConfig, shard: Partial<ShardID>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/availableZones', {
      shard: shard,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

  GetZoneInfo: function(config: RequestConfig, shard: Partial<ShardID>, zoneID: Partial<string>): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/getZoneInfo', {
      shard: shard,
      zoneID: zoneID,
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}

export const TraitsAPI = {
  GetTraitsV1: function(config: RequestConfig, ): Promise<RequestResult> {
    const conf = config();
    return xhrRequest('get', conf.url + 'v1/traits', {
    }, null, { headers: Object.assign({}, {
      'Accept': 'application/json',
    }, conf.headers || {}) });
  },

}


export const RequirementDescriptionMethods = {
    IsAlloyOfType: (item: graphql.ItemDefRef, alloyType: string) => {
    if (!item) return false;

    return item.itemType === graphql.ItemType.Alloy &&
        (item.alloyDefinition && (item.alloyDefinition.type === alloyType || item.alloyDefinition.subType === alloyType));
    },

    IsOfType: (item: graphql.ItemDefRef, itemType: graphql.ItemType) => {
    return item.itemType === itemType;
    },

    HasTag: (item: graphql.ItemDefRef, tag: string) => {
    if (!item || !item.tags) return false;

    return item.tags.includes(tag);
    },

    MeetsRequirementDescription: (requirement: graphql.ItemRequirementByStringIDDefRef, item: graphql.ItemDefRef) => {
    // @ts-ignore: no-unused-locals
    const Ctx = {
        IsAlloyOfType: (alloyType: string) => RequirementDescriptionMethods.IsAlloyOfType(item, alloyType),
        IsOfType: (itemType: graphql.ItemType) => RequirementDescriptionMethods.IsOfType(item, itemType),
        HasTag: (tag: string) => RequirementDescriptionMethods.HasTag(item, tag),
    };

    let meetsReq = false;
    try {
        // tslint:disable-next-line
        meetsReq = eval(requirement.condition);
    } catch (e) {
        console.error('Tried to eval requirement and failed', e);
    }

    return meetsReq;
    },
};


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
