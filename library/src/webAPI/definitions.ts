 
export interface ArchetypeInfo { 
  description: string;
  faction: Faction;
  id: Archetype;
  name: string;
}


 


export interface BadRequestFieldCode {
  code: FieldCodes;
  message: string; 
}

export interface UnspecifiedRequestError { 
}

export interface InvalidModel {
  modelErrors: ModelError[]; 
}

export interface ModelError {
  message: string;
  paramName: string;
  typeName: string; 
}
 

export interface QueueStatusResponse {
  errorMessage: string; 
  queueStatusMessage: QueueStatusMessage;
}

export interface QueueStatusMessage {
  status: string;
  numContributors: number;
  maxContributors: number;
  blueprints: QueuedBlueprintMessage[]; 
}

export interface QueuedBlueprintMessage {
  name: string;
  percentComplete: number;
  estTimeRemaining: number;
  subName: string;
  amtNeeded: number; 
}

 
export interface SimpleCharacter { 
  archetype: Archetype;
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: string;
  name: string;
  race: Race;
  shardID: string;
}

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

export interface CharacterValidation { 
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


 


export interface ExecutionErrorFieldCode {
  code: FieldCodes;
  message: string; 
}

export interface UnspecifiedExecutionError { 
}

export interface UnhandledExecutionException {
  exception: string; 
}

export interface DoesNotExist { 
}

export interface UserStateConflict { 
}

export interface InsufficientResource {
  resources: ResourceRequirement[]; 
}

export interface ResourceRequirement {
  name: string;
  required: any;
  available: any; 
}
 
export interface FactionInfo { 
  description: string;
  id: number;
  name: string;
  shortName: string;
}


 
export interface GroupInvite { 
  created: string;
  groupType: GroupType;
  inviteCode: string;
  groupID: string;
  groupName: string;
  invitedByName: string;
}


 


export interface FieldCodeHelper { 
}
 
export interface MessageOfTheDay { 
  id: string;
  message: string;
  duration: number;
}


 


export interface NotAllowedFieldCode {
  code: FieldCodes;
  message: string; 
}

export interface UnspecifiedNotAllowed { 
}

export interface RateLimitExceeded {
  retry: number; 
}

export interface InternalAction { 
}
 
export interface Order { 
  created: string;
  createdBy: string;
  faction: Faction;
  formerMembers: OrderMember[];
  id: string;
  members: OrderMember[];
  name: string;
  ranks: RankInfo[];
  shardID: string;
}


 
export interface OrderMember { 
  name: string;
  id: string;
  joined: string;
  parted: string;
  rank: string;
  additionalPermissions: string[];
}


 
export interface PatcherAlert { 
  id: string;
  message: string;
  utcDateEnd: string;
  utcDateStart: string;
}


 
export interface PatcherHeroContent { 
  content: string;
  id: string;
  priority: number;
  utcDateEnd: string;
  utcDateStart: string;
}


 
export interface PermissionInfo { 
  description: string;
  name: string;
}


 
export interface PlayerAttributeOffset { 
  race: Race;
  gender: Gender;
  attributeOffsets: { [key: string]: number; };
}


 
export interface PlayerStatAttribute { 
  baseValue: number;
  derivedFrom: string;
  description: string;
  maxOrMultipler: number;
  name: string;
  type: PlayerStatType;
  units: string;
}


 
export interface RaceInfo { 
  name: string;
  description: string;
  faction: Faction;
  id: Race;
}


 
export interface RankInfo { 
  level: number;
  name: string;
  permissions: string[];
}


 
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


 
export interface ServerPresence {
  address: string;
  zoneID: number; 
}


 
export interface ServerState { 
  controlGameState: ControlGameState;
  playerCounts: PlayerCounts;
  spawnPoints: SpawnPoint[];
}

export interface SpawnPoint { 
  faction: Faction;
  x: number;
  y: number;
}

export interface PlayerCounts { 
  arthurian: number;
  maxPlayers: number;
  tuatha: number;
  viking: number;
}


 


export interface ServiceUnavailableFieldCode {
  code: FieldCodes;
  message: string; 
}

export interface UnspecifiedServiceUnavailable { 
}

export interface DatabaseUnavailable { 
}

export interface GroupServiceUnavailable { 
}

export interface GameServiceUnavailable { 
}

export interface PresenceServiceUnavailable { 
}
 


export interface UnauthorizedFieldCode {
  code: FieldCodes;
  message: string; 
}

export interface UnspecifiedAuthorizationDenied { 
}

export interface APIKeyAuthorizationFailed { 
}

export interface LoginTokenAuthorizationFailed { 
}

export interface RealmRestricted { 
}
 
export interface Warband { 
  banner: string;
  created: string;
  id: string;
  members: WarbandMember[];
  name: string;
  shardID: string;
}


 
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



export interface CurrentMaxValue {
    current: number;
    maximum: number;
}

export interface Temperature {
    current: number;
    freezingThreshold: number;
    burndingThreshold: number;
}

  
export enum AbilityActionStat { 
  None = 0,
  AimTime = 1,
  AreaSpreadRate = 2,
  ArmorClassIncrease = 3,
  ArmorClassReduction = 4,
  ArmorPenetrationIncrease = 5,
  ArmorPenetrationReduction = 6,
  BarrierPower = 7,
  BleedPiercing = 8,
  BleedSlashing = 9,
  BlockPercentModifier = 10,
  BloodCost = 11,
  BloodCostIncrease = 12,
  BloodCostReduction = 13,
  BloodIncrease = 14,
  BloodIncreaseOverTime = 15,
  BloodReduction = 16,
  BloodReductionOverTime = 17,
  BloodRegenerationDecrease = 18,
  BloodRegenerationIncrease = 19,
  CamouflageTransition = 20,
  ChannelTime = 21,
  ChargeExpend = 22,
  ChargeIncrease = 23,
  ConcealmentIncrease = 24,
  ConeAoeDuration = 25,
  ConeAoeRange = 26,
  ConeAoeSize = 27,
  CooldownIncrease = 28,
  CooldownReduction = 29,
  CooldownTime = 30,
  CureWound = 31,
  Damage = 32,
  DamageCrushing = 33,
  DamagePiercing = 34,
  DamageSlashing = 35,
  DeflectionPower = 36,
  DeflectionRateModifier = 37,
  DisruptionDamage = 38,
  DisruptionHealth = 39,
  DotAmount = 40,
  DotDuration = 41,
  Duration = 42,
  FallbackDamage = 43,
  ForceFieldDuration = 44,
  ForceFieldMagnitude = 45,
  ForceFieldSize = 46,
  Healing = 47,
  HealingEffectPower = 48,
  HealingPowerIncrease = 49,
  HealingPowerReduction = 50,
  HealthCost = 51,
  HealthReduction = 52,
  HealthReductionOverTime = 53,
  HealthRegenerationIncrease = 54,
  HealthRegenerationReduction = 55,
  HealthTransfer = 56,
  HotAmount = 57,
  HotDuration = 58,
  IgnoreHealingReduction = 59,
  IgnoreResistance = 60,
  ImmobilizeDuration = 61,
  IncomingDamageIncrease = 62,
  IncomingDamageReduction = 63,
  Instant = 64,
  InvulnerabilityTime = 65,
  KnockbackAmount = 66,
  KnockbackAngle = 67,
  Lifedrain = 68,
  MaxHealthAmount = 69,
  MaxHealthDuration = 70,
  MeleeArc = 71,
  MeleeRange = 72,
  MovementCancels = 73,
  MovementSpeedReduction = 74,
  ObjectDamage = 75,
  ObjectDuration = 76,
  ObjectHealth = 77,
  ObjectSize = 78,
  ObjectSpeed = 79,
  ObjectTracking = 80,
  OutgoingDamageIncrease = 81,
  OutgoingDamageReduction = 82,
  PanicIncrease = 83,
  PanicReduction = 84,
  Penetration = 85,
  PenetrationIncrease = 86,
  PenetrationPiercing = 87,
  PenetrationReduction = 88,
  PenetrationSlashing = 89,
  PeriodicIntervalsPerSecond = 90,
  PowerFalloffMaxDistance = 91,
  PowerFalloffMinDistance = 92,
  PowerFalloffReduction = 93,
  PreparationIncrease = 94,
  PreparationReduction = 95,
  PreparationTime = 96,
  ProjectileArc = 97,
  ProjectileDuration = 98,
  ProjectileSize = 99,
  ProjectileSpeed = 100,
  ProjectileSpeedIncrease = 101,
  ProjectileSpeedReduction = 102,
  Projectiletracking = 103,
  Range = 104,
  RecoveryIncrease = 105,
  RecoveryReduction = 106,
  RecoveryTime = 107,
  RedirectDuration = 108,
  RedirectEffect = 109,
  RemoveAllyEffectPower = 110,
  RemoveEnemyEffect = 111,
  ResetDeflection = 112,
  ResistanceIncrease = 113,
  ResistanceReduction = 114,
  SelfDamage = 115,
  SelfImmobilizeDuration = 116,
  SelfSnareAmount = 117,
  SelfSnareDuration = 118,
  SnareAmount = 119,
  SnareDuration = 120,
  SpeedAmount = 121,
  SpeedDuration = 122,
  SphereAoeDuration = 123,
  SphereAoeSize = 124,
  StabilityIncrease = 125,
  StabilityReduction = 126,
  StaminaCost = 127,
  StaminaCostIncrease = 128,
  StaminaCostReduction = 129,
  StaminaDrain = 130,
  StaminaDrainOverTime = 131,
  StaminaDrainOverTimeDuration = 132,
  StaminaIncreaseOverTime = 133,
  StaminaReductionOverTime = 134,
  StaminaRegenerationIncrease = 135,
  StaminaRegenerationReduction = 136,
  StaminaRestore = 137,
  StaminaRestoreOverTime = 138,
  StaminaRestoreOverTimeDuration = 139,
  StanceTransition = 140,
  StopsMovement = 141,
  SuppressBleedingTime = 142,
  SuppressBloodRegenerationTime = 143,
  SuppressDeflectionTime = 144,
  SuppressHealthRegenerationTime = 145,
  SuppressMovementReductionTime = 146,
  SuppressStaminaRegenerationTime = 147,
  SuppressWoundTime = 148,
  TargetLimit = 149,
  TouchContact = 150,
  VeilStealthTransition = 151,
  WallDuration = 152,
  WallHealth = 153,
  OverallPower = 154
}
 
  
export enum AbilityActionStatValueType { 
  Cost = 0,
  Power = 1
}
 
  
export enum AbilityActionType { 
  None = 0,
  Damage = 1,
  Disruption = 2,
  DOT = 3,
  Healing = 4,
  HOT = 5,
  StaminaDrain = 6,
  StaminaDrainOverTime = 7,
  StaminaRestore = 8,
  StaminaRestoreOverTime = 9,
  CureWounds = 10,
  Lifedrain = 11,
  Snare = 12,
  Immobilize = 13,
  Knockback = 14,
  Speed = 15,
  MaxHealth = 16,
  Wall = 17,
  Field = 18,
  Projectile = 19,
  SphereAoE = 20,
  ConeAoE = 21,
  Stance = 22,
  Blocking = 23
}
 
  
export enum AbilityComponentID { 
  None = 0
}
 
  
export enum AbilityComponentSubType { 
  None = 0,
  Rune = 1,
  Shape = 2,
  Range = 4,
  Size = 8,
  Infusion = 16,
  Focus = 32,
  Transposition = 64,
  MagicalType = 127,
  Weapon = 128,
  Style = 256,
  Speed = 512,
  Potential = 1024,
  Stance = 2048,
  PhysicalType = 3968,
  RangedWeapon = 4096,
  Load = 8192,
  Prepare = 16384,
  Draw = 32768,
  Aim = 65536,
  RangedType = 126976,
  Voice = 131072,
  Instrument = 262144,
  Shout = 524288,
  Song = 1048576,
  Inflection = 2097152,
  Technique = 4194304,
  SoundType = 8257536,
  Stone = 8388608,
  Delivery = 16777216,
  StoneType = 25165824,
  RuneSelf = 33554432,
  ShapeSelf = 67108864,
  MagicSelf = 100663420,
  RuneNoParts = 134217728,
  MagicNoParts = 134217854,
  RuneSelfNoParts = 268435456,
  MagicSelfNoParts = 335544444,
  Target = 536870912
}
 
  
export enum AbilityComponentType { 
  Primary = 0,
  Secondary = 1,
  OptionalModifier = 2,
  SpecialModal = 3,
  IndependantModal = 4
}
 
  
export enum AbilityLifetimeEvent { 
  Begin = 0,
  Hit = 1
}
 
  
export enum AbilityTag { 
  SYSTEM = 0,
  NonAggressive = 1,
  NonInteractable = 2,
  NoMagic = 3,
  Slashing = 4,
  Piercing = 5,
  Crushing = 6,
  Weapon = 7,
  Style = 8,
  Speed = 9,
  Potential = 10,
  Voice = 11,
  Shout = 12,
  Inflection = 13,
  Air = 14,
  Earth = 15,
  Fire = 16,
  Water = 17,
  Blast = 18,
  Lava = 19,
  Mud = 20,
  Sand = 21,
  Steam = 22,
  Spray = 23,
  Acid = 24,
  Poison = 25,
  Disease = 26,
  Lightning = 27,
  PrimalLightning = 28,
  GroundedLightning = 29,
  CelestialLightning = 30,
  ChainLightning = 31,
  Frost = 32,
  Life = 33,
  Mind = 34,
  Spirit = 35,
  Radiant = 36,
  Death = 37,
  Shadow = 38,
  Chaos = 39,
  Void = 40,
  Arcane = 41,
  Healing = 42,
  Restoration = 43,
  Lifedrain = 44,
  Swiftness = 45,
  Displacement = 46,
  Magic = 47,
  Rune = 48,
  Shape = 49,
  Range = 50,
  Size = 51,
  Infusion = 52,
  Focus = 53,
  Elixir = 54,
  Potion = 55,
  Bottle = 56,
  Stone = 57,
  Self = 58,
  Direct = 59,
  Touch = 60,
  Dart = 61,
  Ball = 62,
  Cloud = 63,
  Fountain = 64,
  Wall = 65,
  Field = 66,
  Wave = 67,
  Pool = 68,
  Cone = 69,
  Blocking = 70,
  CounterAttack = 71,
  Targeting = 72,
  Trauma = 73,
  Wound = 74,
  Attack = 75,
  Melee = 76,
  Ranged = 77,
  Bow = 78,
  Shield = 79,
  Channel = 80,
  Stance = 81,
  Unblockable = 82,
  Positive = 83,
  Negative = 84,
  Bleeding = 85,
  CombatStance = 86,
  TravelStance = 87,
  TestTagA = 88,
  TestTagB = 89,
  TestTagC = 90,
  TestTagD = 91,
  TestTagE = 92,
  HealingReduction = 93,
  RegrowthElixir = 94,
  SharedResilience = 95,
  ViolentFeedback = 96,
  SelfAnointment = 97,
  Delivery = 98,
  SelfRune = 99,
  SelfShape = 100,
  RuneNoParts = 101,
  SelfRuneNoParts = 102,
  COUNT = 103
}
 
   
export enum AccessType { 
  Invalid = -1,
  Public = 0,
  Beta3 = 1,
  Beta2 = 2,
  Beta1 = 3,
  Alpha = 4,
  InternalTest = 5,
  Employees = 6
}

  
export enum AimingMode { 
  AutoTarget = 0,
  AimedDirection = 1
}
 
  
export enum AnimSetID { 
  Travel = 0
}
 
  
export enum Archetype { 
  FireMage = 0,
  EarthMage = 1,
  WaterMage = 2,
  Fighter = 3,
  Healer = 4,
  MeleeCombatTest = 5,
  ArcherTest = 6,
  BlackKnight = 7,
  Fianna = 8,
  Mjolnir = 9,
  Physician = 10,
  Empath = 11,
  Stonehealer = 12,
  Blackguard = 13,
  ForestStalker = 14,
  WintersShadow = 15,
  Any = 16
}
 
 
export enum BackerLevel { 
  none = 0,
  builder = 10,
  founder = 20
}

export enum Permissions { 
  CSEEmployee = 0,
  AccountEditor = 1,
  AccountViewer = 2,
  OzEditor = 3,
  InternalTester = 4,
  TrustedTester = 5,
  ModSquad = 6,
  OldSchoolGaming = 7,
  BuildersBrigade = 8
}
  
  
export enum BoonBaneID { 
  None = 0
}

export enum BoonBaneType { 
  Boon = 0,
  Bane = 1
}

export enum BoonBaneCategory { 
  General = 0,
  Faction = 1,
  Race = 2,
  Archetype = 3
}
 
  
export enum CASAbilityParams { 
  Invalid = 0,
  Duration = 1,
  StartTime = 2,
  VFXComponent = 3,
  CASID = 4,
  TargetType = 5,
  TargetBone = 6,
  AudioAKID = 7,
  TrackingMode = 8,
  TrackingStrength = 9,
  ModelID = 10,
  CancelledByMovement = 11,
  StopsMovement = 12,
  CancellationTime = 13,
  PreparationTime = 14,
  RecoveryTime = 15,
  HasProjectile = 16,
  MaxTriggerHoldTime = 17,
  AlwaysAimed = 18,
  AimingOptional = 19,
  NeverAimed = 20,
  AnimActionIndex = 21,
  HitNote = 22,
  GeometryType = 23,
  GeometryBoxX = 24,
  GeometryBoxY = 25,
  GeometryBoxZ = 26,
  GeometryRadius = 27,
  GeometryHeight = 28,
  GeometryDepth = 29,
  TargetGroup = 30,
  TargetRequired = 31,
  TargetingVolumeType = 32,
  TargetingRadius = 33,
  TargetingConeAngle = 34
}
 
  
export enum CASEffectsTrigger { 
  None = 0,
  Time = 1,
  HitWall = 2,
  HitPlayer = 3,
  Begin = 4,
  TriggerTime = 5,
  TriggerHeld = 6,
  Canceled = 7,
  Ended = 8
}
 
  
export enum CASEffectsType { 
  None = 0,
  Particle = 1,
  Sound = 2,
  Animation = 3,
  Ability = 4,
  Geometry = 5,
  Model = 6,
  Targeting = 7
}
 
  
export enum CASEntityType { 
  Standard = 0,
  Projectile = 1
}
 
  
export enum CASParamDataType { 
  Invalid = 0,
  Int32 = 1,
  Int64 = 2,
  Float = 3,
  Bool = 4
}
 
  
export enum DamageType { 
  None = 0,
  Slashing = 1,
  Piercing = 2,
  Crushing = 4,
  Acid = 8,
  Poison = 16,
  Disease = 32,
  Earth = 64,
  Water = 128,
  Fire = 256,
  Air = 512,
  Lightning = 1024,
  Frost = 2048,
  Life = 8192,
  Mind = 16384,
  Spirit = 32768,
  Radiant = 65536,
  Death = 131072,
  Shadow = 262144,
  Chaos = 524288,
  Void = 1048576,
  Arcane = 2097152,
  Physical = 7,
  Elemental = 4032,
  Light = 122880,
  Dark = 1966080,
  Other = 2097208,
  All = -1,
  SYSTEM = -2147483648
}
 
  
export enum DBVarType { 
  Int8 = 0,
  Int16 = 1,
  Int32 = 2,
  Int64 = 3,
  UInt8 = 4,
  UInt16 = 5,
  UInt32 = 6,
  UInt64 = 7,
  Float = 8,
  Double = 9,
  Char = 10,
  String = 11,
  Bool = 12
}
 
  
export enum EntitySourceKind { 
  Command = 0,
  Placeable = 1,
  Terrain = 2
}
 
  
export enum EquipmentModelSlots { 
  Tabard = 0,
  Hair = 1,
  HeadBack = 2,
  FaceUpper = 3,
  FaceLower = 4,
  Beard = 5,
  Neck = 6,
  Chest = 7,
  Torso = 8,
  LeftPauldron = 9,
  RightPauldron = 10,
  LeftUpperArm1 = 11,
  LeftUpperArm2 = 12,
  LeftLowerArm1 = 13,
  LeftLowerArm2 = 14,
  LeftHand = 15,
  RightUpperArm1 = 16,
  RightUpperArm2 = 17,
  RightLowerArm1 = 18,
  RightLowerArm2 = 19,
  RightHand = 20,
  Belt = 21,
  Pelvis = 22,
  UpperLeg1 = 23,
  UpperLeg2 = 24,
  LowerLeg1 = 25,
  LowerLeg2 = 26,
  Foot = 27,
  Knee = 28,
  UpperCloak1 = 29,
  UpperCloak2 = 30,
  LowerCloak1 = 31,
  LowerCloak2 = 32,
  RightElbow = 33,
  LeftElbow = 34,
  Taset = 35,
  Helmet = 36,
  Cape = 37,
  Horns = 38,
  Collar = 39
}
 
  
export enum EXETypes { 
  None = 0,
  X86 = 1,
  X64 = 2
}
 
  
export enum Faction { 
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3,
  COUNT = 4
}
 
 
export enum FieldCodes { 
  UnspecifiedAuthorizationDenied = 1000,
  APIKeyAuthorizationFailed = 1001,
  LoginTokenAuthorizationFailed = 1002,
  RealmRestricted = 1003,
  UnspecifiedNotAllowed = 2000,
  RateLimitExceeded = 2001,
  InternalAction = 2002,
  UnspecifiedRequestError = 3000,
  InvalidModel = 30001,
  UnspecifiedExecutionError = 4000,
  UnhandledExecutionException = 4001,
  DoesNotExist = 4002,
  UserStateConflict = 4003,
  InsufficientResource = 4004,
  UnspecifiedServiceUnavailable = 5000,
  DatabaseUnavailable = 5001,
  GroupServiceUnavailable = 5002,
  GameServiceUnavailable = 5003,
  PresenceServiceUnavailable = 5004
}
  
  
export enum GearSlot { 
  None = 0,
  Chest = 1,
  LeftHand = 2,
  RightHand = 4,
  Pants = 8,
  Boots = 16,
  LeftGlove = 32,
  RightGlove = 64,
  Helmet = 128,
  Belt = 256,
  Skirt = 512,
  Tabard = 1024,
  Cape = 2048,
  NUMSLOTS = 12,
  NUMVALUES = 4096
}
 
  
export enum Gender { 
  None = 0,
  Male = 1,
  Female = 2
}
 
  
export enum GroupType { 
  Warband = 0,
  Order = 1,
  Alliance = 2,
  Campaign = 3
}
 
  
export enum InviteStatus { 
  Active = 0,
  Accepted = 1,
  Declined = 2,
  Rescinded = 3,
  Expired = 4
}
 
  
export enum ItemType { 
  None = 0,
  Equippable = 1,
  Resource = 2
}
 
 
export enum LanguageCode { 
  Unassigned = 0,
  en_US = 1,
  en_GB = 2,
  en_AU = 3,
  de_DE = 4
}
  
  
export enum MemberActionType { 
  Created = 0,
  Disbanded = 1,
  CharacterJoined = 2,
  GroupJoined = 3,
  CharacterQuit = 4,
  GroupQuit = 5,
  CharacterKicked = 6,
  GroupKicked = 7,
  CharacterInvited = 8,
  GroupInvited = 9,
  CharacterAcceptedInvite = 10,
  ChangedRole = 11,
  AssignRank = 12,
  UpdatedRolePermissions = 13,
  UpdatedRankPermissions = 14,
  ChangedName = 15,
  CharacterPermissionsChanged = 16,
  GroupPermissionsChanged = 17,
  CreateRank = 18,
  RemoveRank = 19,
  RenameRank = 20,
  AddRankPermissions = 21,
  RemoveRankPermissions = 22,
  SetRankPermissions = 23,
  ChangeRankLevel = 24,
  TransferedOwnership = 25,
  SharedCount = 26,
  Abandonded = 26,
  WarbandCount = 27,
  ChangeDisplayOrder = 28,
  SetLeader = 29,
  DepositedItemInStash = 26,
  WithdrewItemFromStash = 27,
  DepositedCurrencyInStash = 28,
  WithdrewCurrencyFromStash = 29,
  OrderCount = 30,
  InvitedOrder = 26,
  OrderAcceptedInvite = 27,
  AllianceSharedCount = 28,
  AllianceCount = 28,
  InvitedAlliance = 28,
  AllianceAcceptedInvite = 29,
  InvitedWarband = 30,
  WarbandAcceptedInvite = 31,
  CampaignCount = 32
}
 
  
export enum PatchPermissions { 
  Public = 0,
  AllBackers = 1,
  InternalTest = 2,
  Development = 4,
  Alpha = 8,
  Beta1 = 16,
  Beta2 = 32,
  Beta3 = 64
}
 
  
export enum PermissionRegionType { 
  None = 0,
  Self = 2,
  Friends = 4,
  MutualFriends = 8,
  TempWarband = 16,
  PermanentWarband = 32,
  Order = 64,
  Alliance = 128,
  Campaign = 256,
  Realm = 512,
  AllRealm = 1022,
  Public = 1024,
  All = -1
}
 
 
export enum Platforms { 
  Undefined = 0,
  Windows = 1,
  Mac = 2,
  iPhone = 3,
  iPad = 4,
  Android = 5,
  Web = 6
}

export enum Subset { 
  None = 0,
  Paid = 1,
  Free = 2
}
  
  
export enum PlayerStat { 
  Strength = 0,
  Dexterity = 1,
  Agility = 2,
  Vitality = 3,
  Endurance = 4,
  Attunement = 5,
  Will = 6,
  Faith = 7,
  Resonance = 8,
  Eyesight = 9,
  Hearing = 10,
  Presence = 11,
  Clarity = 12,
  Affinity = 13,
  Mass = 14,
  MaxMoveSpeed = 15,
  MoveAcceleration = 16,
  MaxTurnSpeed = 17,
  Vision = 18,
  Detection = 19,
  Encumbrance = 20,
  EncumbranceReduction = 21,
  CarryCapacity = 22,
  MaxPanic = 23,
  PanicDecay = 24,
  MaxHP = 25,
  HealthRegeneration = 26,
  MaxStamina = 27,
  StaminaRegeneration = 28,
  AbilityPreparationSpeed = 29,
  AbilityRecoverySpeed = 30,
  CooldownSpeed = 31,
  Age = 32,
  Concealment = 33,
  VeilSubtlety = 34,
  VeilResist = 35,
  HealingReceivedBonus = 36,
  EnhancementDuration = 37,
  HeatTolerance = 38,
  ColdTolerance = 39,
  MaxBlood = 40,
  BloodRegeneration = 41,
  EffectPowerBonus = 42,
  None = 43,
  COUNT = 43
}
 
  
export enum PlayerStatType { 
  None = 0,
  Primary = 1,
  Secondary = 2,
  Derived = 3,
  Hidden = 4
}
 
  
export enum PlotType { 
  Small = 0,
  Medium = 1,
  Large = 2,
  Custom = 3
}

export enum BuildPermissions { 
  None = 0,
  Self = 0,
  Group = 1,
  Friends = 2,
  Guild = 4,
  Realm = 8,
  All = 16,
  COUNT = 32
}

export enum PlotSource { 
  Command = 0,
  Cog = 1,
  COUNT = 2
}
 
 
export enum PrereleaseAccess { 
  none = 0,
  beta3 = 1,
  beta2 = 2,
  beta1 = 3,
  alpha = 4,
  internalTesting = 5
}

export enum ForumAccess { 
  founderReadOnly = 0,
  founder = 1,
  internalTest = 2,
  builder = 3
}
  
  
export enum ProjectileTrackingMode { 
  None = 0,
  LargeAngle = 1,
  Full = 2,
  Horizontal = 3,
  Attractor = 4,
  Gravity = 5
}
 
  
export enum Race { 
  Tuatha = 0,
  Hamadryad = 1,
  Luchorpan = 2,
  Firbog = 3,
  Valkyrie = 4,
  Helbound = 5,
  FrostGiant = 6,
  Dvergr = 7,
  Strm = 8,
  CaitSith = 9,
  Golem = 10,
  Gargoyle = 11,
  StormRider = 12,
  StormRiderT = 13,
  StormRiderV = 14,
  HumanMaleV = 15,
  HumanMaleA = 16,
  HumanMaleT = 17,
  Pict = 18,
  Any = 19
}
 
 
export enum RedeemError { 
  Success = 0,
  AlreadyRedeemed = 1,
  DatabaseError = 2,
  DuplicateTransactionID = 3,
  Invalidated = 4,
  BadState = 5,
  NotRevealed = 6
}
  
  
export enum RequirementApplicationType { 
  AbilityEffect = 0,
  Combatant = 1,
  SubjectCaster = 2
}

export enum ComparisonType { 
  Equal = 0,
  LessThan = 1,
  GreaterThan = 2
}

export enum ListComparison { 
  Any = 0,
  One = 1,
  All = 2
}
 
  
export enum ResourceType { 
  Health = 0,
  Blood = 0,
  Stamina = 1,
  ElixirStart = 2,
  Elixir1 = 2,
  Elixir2 = 3,
  ElixirEnd = 4,
  ElixirCount = 2,
  ArrowStart = 5,
  BasicArrow = 5,
  BlackArrow = 6,
  FlightArrow = 7,
  BluntArrow = 8,
  BroadheadArrow = 9,
  BarbedArrow = 10,
  LeafbladeArrow = 11,
  SerratedArrow = 12,
  NotchedArrow = 13,
  CrescentArrow = 14,
  LightArrow = 15,
  DartPointArrow = 16,
  ForkedArrow = 17,
  HeavyWarArrow = 18,
  ArrowEnd = 19,
  ArrowCount = 14,
  Doodad = 20
}
 
  
export enum ServerStatus { 
  Offline = 0,
  Starting = 1,
  Online = 2
}
 
 
export enum ShapeType { 
  Box = 0,
  Capsule = 1,
  Sphere = 2,
  Cone = 3
}
  
  
export enum StanceID { 
  Default = 0
}
 
  
export enum StatModificationOperatorType { 
  AddPercent = 0,
  AddValue = 1,
  ReplaceValue = 2
}
 
  
export enum StoneTypes { 
  Life = 0,
  Curing = 1,
  Shielding = 2,
  Rejuvenation = 3,
  Inversion = 4,
  Deflection = 5
}
 
  
export enum TagConstraintType { 
  AllOf = 0,
  AnyOf = 1,
  NoneOf = 2
}
 
  
export enum TargetType { 
  None = 0,
  Enemy = 1,
  Friend = 2,
  Any = 3,
  Self = 4,
  FriendOrSelf = 5
}
 
  
export enum TestItemFlags { 
  None = 0,
  StormRider = 1,
  HumanMale = 2,
  Archery = 4,
  FutureRelease = 8
}
 
 
export enum TransactionType { 
  Paypal = 1,
  Kickstarter = 2,
  Child = 3,
  Stripe = 4
}
  
  
export enum TriggerBehaviorMode { 
  None = 0,
  AttachToTarget = 1,
  MoveTowardsTarget = 2,
  COUNT = 3
}
 
  
export enum TriggerFilter { 
  Any = 0,
  Friend = 1,
  Enemy = 2
}
 
  
export enum TriggerType { 
  None = 0,
  AbilityUse = 1,
  AbilityHit = 2,
  Damage = 3,
  Healing = 4,
  Wound = 5,
  Death = 6,
  Collision = 7
}
 
  
export enum WeaponStat { 
  None = 0,
  PiercingDamage = 1,
  PiercingBleed = 2,
  PiercingArmorPenetration = 3,
  SlashingDamage = 4,
  SlashingBleed = 5,
  SlashingArmorPenetration = 6,
  CrushingDamage = 7,
  FallbackCrushingDamage = 8,
  Disruption = 9,
  DeflectionAmount = 10,
  PhysicalProjectileSpeed = 11,
  KnockbackAmount = 12,
  Stability = 13,
  FalloffMinDistance = 14,
  FalloffMaxDistance = 15,
  FalloffReduction = 16,
  DeflectionRecovery = 17,
  StaminaCost = 18,
  PhysicalPreparationTime = 19,
  PhysicalRecoveryTime = 20,
  Range = 21,
  RepairsAllowed = 22,
  CurrentDurability = 23,
  FractureThreshold = 24,
  FractureChance = 25,
  Weight = 26,
  Encumbrance = 27,
  StartingDurability = 28,
  BaseHardness = 29,
  FireResistance = 30,
  WeightPCF = 31,
  Malleability = 32,
  MeltingPoint = 33,
  Density = 34,
  StrengthRequirement = 35,
  DexterityRequirement = 36,
  AgilityRequirement = 37
}
 
  
export enum WeaponType { 
  NONE = 0,
  Arrow = 1,
  Dagger = 2,
  Sword = 4,
  Hammer = 8,
  Axe = 16,
  Mace = 32,
  GreatSword = 64,
  GreatHammer = 128,
  GreatAxe = 256,
  GreatMace = 512,
  Spear = 1024,
  Staff = 2048,
  Polearm = 4096,
  Shield = 8192,
  Bow = 16384,
  Throwing = 32768,
  All = 65535
}

export enum NetworkWeaponType { 
  Default = 0,
  Shield = 1,
  Bow = 2
}
 
  
export enum WireCompressionType { 
  None = 0,
  LZMA = 1
}

export enum ResourceCompressionType { 
  None = 0
}
 
