 
export interface ArchetypeInfo { 
  description: string;
  faction: Faction;
  id: Archetype;
  name: string;
}
 
export interface SimpleCharacter { 
  archetype: Archetype;
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: Date;
  name: string;
  race: Race;
  shardID: number;
}

export interface Character { 
  archetype: Archetype;
  attributes: { [key: string]: number; };
  banes: { [key: string]: number; };
  boons: { [key: string]: number; };
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: Date;
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
 
export interface FactionInfo { 
  description: string;
  id: number;
  name: string;
  shortName: string;
}
 
export interface GroupInvite { 
  created: Date;
  groupType: GroupType;
  inviteCode: string;
  groupID: string;
  groupName: string;
  invitedByName: string;
}
 
export interface MessageOfTheDay { 
  id: string;
  message: string;
  duration: number;
}
 
export interface PatcherAlert { 
  id: string;
  message: string;
  utcDateEnd: Date;
  utcDateStart: Date;
}
 
export interface PatcherHeroContent { 
  content: string;
  id: string;
  priority: number;
  utcDateEnd: Date;
  utcDateStart: Date;
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
 
export interface Host { 
  address: string;
  keepAliveNumber: number;
  extraData: string;
}

export interface Server { 
  accessLevel: AccessType;
  channelID: number;
  hosts: Host[];
  name: string;
  playerMaximum: number;
  shardID: number;
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
 
export interface Warband { 
  banner: string;
  created: Date;
  id: string;
  members: WarbandMember[];
  name: string;
  shardID: number;
}
 
export interface WarbandMember { 
  additionalPermissions: string[];
  archetype: Archetype;
  avatar: string;
  blood: CurrentMaxValue;
  characterID: string;
  gender: Gender;
  health: CurrentMaxValue[];
  joined: Date;
  name: string;
  panic: CurrentMaxValue;
  parted: Date;
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
  NONE = 0,
  AIMTIME = 1,
  AREASPREADRATE = 2,
  ARMORCLASSINCREASE = 3,
  ARMORCLASSREDUCTION = 4,
  ARMORPENETRATIONINCREASE = 5,
  ARMORPENETRATIONREDUCTION = 6,
  BARRIERPOWER = 7,
  BLEEDPIERCING = 8,
  BLEEDSLASHING = 9,
  BLOCKPERCENTMODIFIER = 10,
  BLOODCOST = 11,
  BLOODCOSTINCREASE = 12,
  BLOODCOSTREDUCTION = 13,
  BLOODINCREASE = 14,
  BLOODINCREASEOVERTIME = 15,
  BLOODREDUCTION = 16,
  BLOODREDUCTIONOVERTIME = 17,
  BLOODREGENERATIONDECREASE = 18,
  BLOODREGENERATIONINCREASE = 19,
  CAMOUFLAGETRANSITION = 20,
  CHANNELTIME = 21,
  CHARGEEXPEND = 22,
  CHARGEINCREASE = 23,
  CONCEALMENTINCREASE = 24,
  CONEAOEDURATION = 25,
  CONEAOERANGE = 26,
  CONEAOESIZE = 27,
  COOLDOWNINCREASE = 28,
  COOLDOWNREDUCTION = 29,
  COOLDOWNTIME = 30,
  CUREWOUND = 31,
  DAMAGE = 32,
  DAMAGECRUSHING = 33,
  DAMAGEPIERCING = 34,
  DAMAGESLASHING = 35,
  DEFLECTIONPOWER = 36,
  DEFLECTIONRATEMODIFIER = 37,
  DISRUPTIONDAMAGE = 38,
  DISRUPTIONHEALTH = 39,
  DOTAMOUNT = 40,
  DOTDURATION = 41,
  DURATION = 42,
  FALLBACKDAMAGE = 43,
  FORCEFIELDDURATION = 44,
  FORCEFIELDMAGNITUDE = 45,
  FORCEFIELDSIZE = 46,
  HEALING = 47,
  HEALINGEFFECTPOWER = 48,
  HEALINGPOWERINCREASE = 49,
  HEALINGPOWERREDUCTION = 50,
  HEALTHCOST = 51,
  HEALTHREDUCTION = 52,
  HEALTHREDUCTIONOVERTIME = 53,
  HEALTHREGENERATIONINCREASE = 54,
  HEALTHREGENERATIONREDUCTION = 55,
  HEALTHTRANSFER = 56,
  HOTAMOUNT = 57,
  HOTDURATION = 58,
  IGNOREHEALINGREDUCTION = 59,
  IGNORERESISTANCE = 60,
  IMMOBILIZEDURATION = 61,
  INCOMINGDAMAGEINCREASE = 62,
  INCOMINGDAMAGEREDUCTION = 63,
  INSTANT = 64,
  INVULNERABILITYTIME = 65,
  KNOCKBACKAMOUNT = 66,
  KNOCKBACKANGLE = 67,
  LIFEDRAIN = 68,
  MAXHEALTHAMOUNT = 69,
  MAXHEALTHDURATION = 70,
  MELEEARC = 71,
  MELEERANGE = 72,
  MOVEMENTCANCELS = 73,
  MOVEMENTSPEEDREDUCTION = 74,
  OBJECTDAMAGE = 75,
  OBJECTDURATION = 76,
  OBJECTHEALTH = 77,
  OBJECTSIZE = 78,
  OBJECTSPEED = 79,
  OBJECTTRACKING = 80,
  OUTGOINGDAMAGEINCREASE = 81,
  OUTGOINGDAMAGEREDUCTION = 82,
  PANICINCREASE = 83,
  PANICREDUCTION = 84,
  PENETRATION = 85,
  PENETRATIONINCREASE = 86,
  PENETRATIONPIERCING = 87,
  PENETRATIONREDUCTION = 88,
  PENETRATIONSLASHING = 89,
  PERIODICINTERVALSPERSECOND = 90,
  POWERFALLOFFMAXDISTANCE = 91,
  POWERFALLOFFMINDISTANCE = 92,
  POWERFALLOFFREDUCTION = 93,
  PREPARATIONINCREASE = 94,
  PREPARATIONREDUCTION = 95,
  PREPARATIONTIME = 96,
  PROJECTILEARC = 97,
  PROJECTILEDURATION = 98,
  PROJECTILESIZE = 99,
  PROJECTILESPEED = 100,
  PROJECTILESPEEDINCREASE = 101,
  PROJECTILESPEEDREDUCTION = 102,
  PROJECTILETRACKING = 103,
  RANGE = 104,
  RECOVERYINCREASE = 105,
  RECOVERYREDUCTION = 106,
  RECOVERYTIME = 107,
  REDIRECTDURATION = 108,
  REDIRECTEFFECT = 109,
  REMOVEALLYEFFECTPOWER = 110,
  REMOVEENEMYEFFECT = 111,
  RESETDEFLECTION = 112,
  RESISTANCEINCREASE = 113,
  RESISTANCEREDUCTION = 114,
  SELFDAMAGE = 115,
  SELFIMMOBILIZEDURATION = 116,
  SELFSNAREAMOUNT = 117,
  SELFSNAREDURATION = 118,
  SNAREAMOUNT = 119,
  SNAREDURATION = 120,
  SPEEDAMOUNT = 121,
  SPEEDDURATION = 122,
  SPHEREAOEDURATION = 123,
  SPHEREAOESIZE = 124,
  STABILITYINCREASE = 125,
  STABILITYREDUCTION = 126,
  STAMINACOST = 127,
  STAMINACOSTINCREASE = 128,
  STAMINACOSTREDUCTION = 129,
  STAMINADRAIN = 130,
  STAMINADRAINOVERTIME = 131,
  STAMINADRAINOVERTIMEDURATION = 132,
  STAMINAINCREASEOVERTIME = 133,
  STAMINAREDUCTIONOVERTIME = 134,
  STAMINAREGENERATIONINCREASE = 135,
  STAMINAREGENERATIONREDUCTION = 136,
  STAMINARESTORE = 137,
  STAMINARESTOREOVERTIME = 138,
  STAMINARESTOREOVERTIMEDURATION = 139,
  STANCETRANSITION = 140,
  STOPSMOVEMENT = 141,
  SUPPRESSBLEEDINGTIME = 142,
  SUPPRESSBLOODREGENERATIONTIME = 143,
  SUPPRESSDEFLECTIONTIME = 144,
  SUPPRESSHEALTHREGENERATIONTIME = 145,
  SUPPRESSMOVEMENTREDUCTIONTIME = 146,
  SUPPRESSSTAMINAREGENERATIONTIME = 147,
  SUPPRESSWOUNDTIME = 148,
  TARGETLIMIT = 149,
  TOUCHCONTACT = 150,
  VEILSTEALTHTRANSITION = 151,
  WALLDURATION = 152,
  WALLHEALTH = 153,
  OVERALLPOWER = 154
}
 
  
export enum AbilityActionStatValueType { 
  COST = 0,
  POWER = 1
}
 
  
export enum AbilityActionType { 
  NONE = 0,
  DAMAGE = 1,
  DISRUPTION = 2,
  DOT = 3,
  HEALING = 4,
  HOT = 5,
  STAMINADRAIN = 6,
  STAMINADRAINOVERTIME = 7,
  STAMINARESTORE = 8,
  STAMINARESTOREOVERTIME = 9,
  CUREWOUNDS = 10,
  LIFEDRAIN = 11,
  SNARE = 12,
  IMMOBILIZE = 13,
  KNOCKBACK = 14,
  SPEED = 15,
  MAXHEALTH = 16,
  WALL = 17,
  FIELD = 18,
  PROJECTILE = 19,
  SPHEREAOE = 20,
  CONEAOE = 21,
  STANCE = 22,
  BLOCKING = 23
}
 
  
export enum AbilityComponentID { 
  NONE = 0
}
 
  
export enum AbilityComponentSubType { 
  NONE = 0,
  RUNE = 1,
  SHAPE = 2,
  RANGE = 4,
  SIZE = 8,
  INFUSION = 16,
  FOCUS = 32,
  TRANSPOSITION = 64,
  MAGICALTYPE = 127,
  WEAPON = 128,
  STYLE = 256,
  SPEED = 512,
  POTENTIAL = 1024,
  STANCE = 2048,
  PHYSICALTYPE = 3968,
  RANGEDWEAPON = 4096,
  LOAD = 8192,
  PREPARE = 16384,
  DRAW = 32768,
  AIM = 65536,
  RANGEDTYPE = 126976,
  VOICE = 131072,
  INSTRUMENT = 262144,
  SHOUT = 524288,
  SONG = 1048576,
  INFLECTION = 2097152,
  TECHNIQUE = 4194304,
  SOUNDTYPE = 8257536,
  STONE = 8388608,
  DELIVERY = 16777216,
  STONETYPE = 25165824,
  RUNESELF = 33554432,
  SHAPESELF = 67108864,
  MAGICSELF = 100663420,
  RUNENOPARTS = 134217728,
  MAGICNOPARTS = 134217854,
  RUNESELFNOPARTS = 268435456,
  MAGICSELFNOPARTS = 335544444,
  TARGET = 536870912
}
 
  
export enum AbilityComponentType { 
  PRIMARY = 0,
  SECONDARY = 1,
  OPTIONALMODIFIER = 2,
  SPECIALMODAL = 3,
  INDEPENDANTMODAL = 4
}
 
  
export enum AbilityLifetimeEvent { 
  BEGIN = 0,
  HIT = 1
}
 
  
export enum AbilityTag { 
  SYSTEM = 0,
  NONAGGRESSIVE = 1,
  NONINTERACTABLE = 2,
  NOMAGIC = 3,
  SLASHING = 4,
  PIERCING = 5,
  CRUSHING = 6,
  WEAPON = 7,
  STYLE = 8,
  SPEED = 9,
  POTENTIAL = 10,
  VOICE = 11,
  SHOUT = 12,
  INFLECTION = 13,
  AIR = 14,
  EARTH = 15,
  FIRE = 16,
  WATER = 17,
  BLAST = 18,
  LAVA = 19,
  MUD = 20,
  SAND = 21,
  STEAM = 22,
  SPRAY = 23,
  ACID = 24,
  POISON = 25,
  DISEASE = 26,
  LIGHTNING = 27,
  PRIMALLIGHTNING = 28,
  GROUNDEDLIGHTNING = 29,
  CELESTIALLIGHTNING = 30,
  CHAINLIGHTNING = 31,
  FROST = 32,
  LIFE = 33,
  MIND = 34,
  SPIRIT = 35,
  RADIANT = 36,
  DEATH = 37,
  SHADOW = 38,
  CHAOS = 39,
  VOID = 40,
  ARCANE = 41,
  HEALING = 42,
  RESTORATION = 43,
  LIFEDRAIN = 44,
  SWIFTNESS = 45,
  DISPLACEMENT = 46,
  MAGIC = 47,
  RUNE = 48,
  SHAPE = 49,
  RANGE = 50,
  SIZE = 51,
  INFUSION = 52,
  FOCUS = 53,
  ELIXIR = 54,
  POTION = 55,
  BOTTLE = 56,
  STONE = 57,
  SELF = 58,
  DIRECT = 59,
  TOUCH = 60,
  DART = 61,
  BALL = 62,
  CLOUD = 63,
  FOUNTAIN = 64,
  WALL = 65,
  FIELD = 66,
  WAVE = 67,
  POOL = 68,
  CONE = 69,
  BLOCKING = 70,
  COUNTERATTACK = 71,
  TARGETING = 72,
  TRAUMA = 73,
  WOUND = 74,
  ATTACK = 75,
  MELEE = 76,
  RANGED = 77,
  BOW = 78,
  SHIELD = 79,
  CHANNEL = 80,
  STANCE = 81,
  UNBLOCKABLE = 82,
  POSITIVE = 83,
  NEGATIVE = 84,
  BLEEDING = 85,
  COMBATSTANCE = 86,
  TRAVELSTANCE = 87,
  TESTTAGA = 88,
  TESTTAGB = 89,
  TESTTAGC = 90,
  TESTTAGD = 91,
  TESTTAGE = 92,
  HEALINGREDUCTION = 93,
  REGROWTHELIXIR = 94,
  SHAREDRESILIENCE = 95,
  VIOLENTFEEDBACK = 96,
  SELFANOINTMENT = 97,
  DELIVERY = 98,
  SELFRUNE = 99,
  SELFSHAPE = 100,
  RUNENOPARTS = 101,
  SELFRUNENOPARTS = 102,
  COUNT = 103
}
 
   
export enum AccessType { 
  INVALID = -1,
  PUBLIC = 0,
  BETA3 = 1,
  BETA2 = 2,
  BETA1 = 3,
  ALPHA = 4,
  INTERNALTEST = 5,
  EMPLOYEES = 6
}

  
export enum AimingMode { 
  AUTOTARGET = 0,
  AIMEDDIRECTION = 1
}
 
  
export enum AnimSetID { 
  TRAVEL = 0
}
 
  
export enum Archetype { 
  FIREMAGE = 0,
  EARTHMAGE = 1,
  WATERMAGE = 2,
  FIGHTER = 3,
  HEALER = 4,
  MELEECOMBATTEST = 5,
  ARCHERTEST = 6,
  BLACKKNIGHT = 7,
  FIANNA = 8,
  MJOLNIR = 9,
  PHYSICIAN = 10,
  EMPATH = 11,
  STONEHEALER = 12,
  BLACKGUARD = 13,
  FORESTSTALKER = 14,
  WINTERSSHADOW = 15,
  ANY = 16
}
 
 
export enum BackerLevel { 
  NONE = 0,
  BUILDER = 10,
  FOUNDER = 20
}

export enum Permissions { 
  CSEEMPLOYEE = 0,
  ACCOUNTEDITOR = 1,
  ACCOUNTVIEWER = 2,
  OZEDITOR = 3,
  INTERNALTESTER = 4,
  TRUSTEDTESTER = 5,
  MODSQUAD = 6,
  OLDSCHOOLGAMING = 7,
  BUILDERSBRIGADE = 8
}
  
  
export enum BoonBaneID { 
  NONE = 0
}

export enum BoonBaneType { 
  BOON = 0,
  BANE = 1
}

export enum BoonBaneCategory { 
  GENERAL = 0,
  FACTION = 1,
  RACE = 2,
  ARCHETYPE = 3
}
 
  
export enum CASAbilityParams { 
  INVALID = 0,
  DURATION = 1,
  STARTTIME = 2,
  VFXCOMPONENT = 3,
  CASID = 4,
  TARGETTYPE = 5,
  TARGETBONE = 6,
  AUDIOAKID = 7,
  TRACKINGMODE = 8,
  TRACKINGSTRENGTH = 9,
  MODELID = 10,
  CANCELLEDBYMOVEMENT = 11,
  STOPSMOVEMENT = 12,
  CANCELLATIONTIME = 13,
  PREPARATIONTIME = 14,
  RECOVERYTIME = 15,
  HASPROJECTILE = 16,
  MAXTRIGGERHOLDTIME = 17,
  ALWAYSAIMED = 18,
  AIMINGOPTIONAL = 19,
  NEVERAIMED = 20,
  ANIMACTIONINDEX = 21,
  HITNOTE = 22,
  GEOMETRYTYPE = 23,
  GEOMETRYBOXX = 24,
  GEOMETRYBOXY = 25,
  GEOMETRYBOXZ = 26,
  GEOMETRYRADIUS = 27,
  GEOMETRYHEIGHT = 28,
  GEOMETRYDEPTH = 29,
  TARGETGROUP = 30,
  TARGETREQUIRED = 31,
  TARGETINGVOLUMETYPE = 32,
  TARGETINGRADIUS = 33,
  TARGETINGCONEANGLE = 34
}
 
  
export enum CASEffectsTrigger { 
  NONE = 0,
  TIME = 1,
  HITWALL = 2,
  HITPLAYER = 3,
  BEGIN = 4,
  TRIGGERTIME = 5,
  TRIGGERHELD = 6,
  CANCELED = 7,
  ENDED = 8
}
 
  
export enum CASEffectsType { 
  NONE = 0,
  PARTICLE = 1,
  SOUND = 2,
  ANIMATION = 3,
  ABILITY = 4,
  GEOMETRY = 5,
  MODEL = 6,
  TARGETING = 7
}
 
  
export enum CASEntityType { 
  STANDARD = 0,
  PROJECTILE = 1
}
 
  
export enum CASParamDataType { 
  INVALID = 0,
  INT32 = 1,
  INT64 = 2,
  FLOAT = 3,
  BOOL = 4
}
 
  
export enum ChangedRoleResultStatus { 
  MEMBERALREADYINROLE = 6
}
 
  
export enum DamageType { 
  NONE = 0,
  SLASHING = 1,
  PIERCING = 2,
  CRUSHING = 4,
  ACID = 8,
  POISON = 16,
  DISEASE = 32,
  EARTH = 64,
  WATER = 128,
  FIRE = 256,
  AIR = 512,
  LIGHTNING = 1024,
  FROST = 2048,
  PHYSICSIMPACT = 4096,
  WEAPON = 7,
  PHYSICALTYPES = 8191,
  LIFE = 8192,
  MIND = 16384,
  SPIRIT = 32768,
  RADIANT = 65536,
  DEATH = 131072,
  SHADOW = 262144,
  CHAOS = 524288,
  VOID = 1048576,
  ARCANE = 2097152,
  MAGICALTYPES = 4186112,
  ALL = -1,
  SYSTEM = -2147483648
}
 
  
export enum DBVarType { 
  INT8 = 0,
  INT16 = 1,
  INT32 = 2,
  INT64 = 3,
  UINT8 = 4,
  UINT16 = 5,
  UINT32 = 6,
  UINT64 = 7,
  FLOAT = 8,
  DOUBLE = 9,
  CHAR = 10,
  STRING = 11,
  BOOL = 12
}
 
  
export enum EquipmentModelSlots { 
  TABARD = 0,
  HAIR = 1,
  HEADBACK = 2,
  FACEUPPER = 3,
  FACELOWER = 4,
  BEARD = 5,
  NECK = 6,
  CHEST = 7,
  TORSO = 8,
  LEFTPAULDRON = 9,
  RIGHTPAULDRON = 10,
  LEFTUPPERARM1 = 11,
  LEFTUPPERARM2 = 12,
  LEFTLOWERARM1 = 13,
  LEFTLOWERARM2 = 14,
  LEFTHAND = 15,
  RIGHTUPPERARM1 = 16,
  RIGHTUPPERARM2 = 17,
  RIGHTLOWERARM1 = 18,
  RIGHTLOWERARM2 = 19,
  RIGHTHAND = 20,
  BELT = 21,
  PELVIS = 22,
  UPPERLEG1 = 23,
  UPPERLEG2 = 24,
  LOWERLEG1 = 25,
  LOWERLEG2 = 26,
  FOOT = 27,
  KNEE = 28,
  UPPERCLOAK1 = 29,
  UPPERCLOAK2 = 30,
  LOWERCLOAK1 = 31,
  LOWERCLOAK2 = 32,
  RIGHTELBOW = 33,
  LEFTELBOW = 34,
  TASET = 35,
  HELMET = 36,
  CAPE = 37,
  HORNS = 38,
  COLLAR = 39
}
 
  
export enum EXETypes { 
  NONE = 0,
  X86 = 1,
  X64 = 2
}
 
  
export enum Faction { 
  FACTIONLESS = 0,
  TDD = 1,
  VIKING = 2,
  ARTHURIAN = 3,
  COUNT = 4
}
 
  
export enum GearSlot { 
  NONE = 0,
  CHEST = 1,
  LEFTHAND = 2,
  RIGHTHAND = 4,
  PANTS = 8,
  BOOTS = 16,
  LEFTGLOVE = 32,
  RIGHTGLOVE = 64,
  HELMET = 128,
  BELT = 256,
  SKIRT = 512,
  TABARD = 1024,
  CAPE = 2048,
  NUMSLOTS = 12,
  USEONESLOT = 4096,
  NUMVALUES = 8192
}
 
  
export enum Gender { 
  NONE = 0,
  MALE = 1,
  FEMALE = 2
}
 
  
export enum GroupMemberType { 
  CHARACTER = 0,
  WARBAND = 1,
  ORDER = 2,
  ALLIANCE = 3
}
 
  
export enum GroupType { 
  WARBAND = 0,
  ORDER = 1,
  ALLIANCE = 2,
  CAMPAIGN = 3
}
 
  
export enum ItemType { 
  NONE = 0,
  EQUIPPABLE = 1,
  RESOURCE = 2
}
 
 
export enum LanguageCode { 
  UNASSIGNED = 0,
  EN_US = 1,
  EN_GB = 2,
  EN_AU = 3,
  DE_DE = 4
}
  
  
export enum MemberActionType { 
  CREATED = 0,
  DISBANDED = 1,
  JOINED = 2,
  QUIT = 3,
  KICKED = 4,
  LOGGEDIN = 5,
  LOGGEDOUT = 6,
  INVITED = 7,
  CHARACTERACCEPTEDINVITE = 8,
  CHANGEDROLE = 9,
  CHANGEDRANK = 10,
  UPDATEDROLEPERMISSIONS = 11,
  UPDATEDRANKPERMISSIONS = 12,
  CHANGEDNAME = 13,
  PERMISSIONSCHANGED = 14,
  CREATERANK = 15,
  REMOVERANK = 16,
  RENAMERANK = 17,
  ADDRANKPERMISSIONS = 18,
  REMOVERANKPERMISSIONS = 19,
  CHANGERANKLEVEL = 20,
  TRANSFEREDOWNERSHIP = 21,
  SHAREDCOUNT = 22,
  ABANDONDED = 22,
  WARBANDCOUNT = 23,
  CHANGEDISPLAYORDER = 24,
  SETLEADER = 25,
  DEPOSITEDITEMINSTASH = 22,
  WITHDREWITEMFROMSTASH = 23,
  DEPOSITEDCURRENCYINSTASH = 24,
  WITHDREWCURRENCYFROMSTASH = 25,
  ORDERCOUNT = 26,
  INVITEDORDER = 22,
  ORDERACCEPTEDINVITE = 23,
  ALLIANCESHAREDCOUNT = 24,
  ALLIANCECOUNT = 24,
  INVITEDALLIANCE = 24,
  ALLIANCEACCEPTEDINVITE = 25,
  INVITEDWARBAND = 26,
  WARBANDACCEPTEDINVITE = 27,
  CAMPAIGNCOUNT = 28
}
 
  
export enum PatchPermissions { 
  PUBLIC = 0,
  ALLBACKERS = 1,
  INTERNALTEST = 2,
  DEVELOPMENT = 4,
  ALPHA = 8,
  BETA1 = 16,
  BETA2 = 32,
  BETA3 = 64
}
 
 
export enum Platforms { 
  UNDEFINED = 0,
  WINDOWS = 1,
  MAC = 2,
  IPHONE = 3,
  IPAD = 4,
  ANDROID = 5,
  WEB = 6
}

export enum Subset { 
  NONE = 0,
  PAID = 1,
  FREE = 2
}
  
  
export enum PlayerStat { 
  STRENGTH = 0,
  DEXTERITY = 1,
  AGILITY = 2,
  VITALITY = 3,
  ENDURANCE = 4,
  ATTUNEMENT = 5,
  WILL = 6,
  FAITH = 7,
  RESONANCE = 8,
  EYESIGHT = 9,
  HEARING = 10,
  PRESENCE = 11,
  CLARITY = 12,
  AFFINITY = 13,
  MASS = 14,
  MAXMOVESPEED = 15,
  MOVEACCELERATION = 16,
  MAXTURNSPEED = 17,
  VISION = 18,
  DETECTION = 19,
  ENCUMBRANCE = 20,
  ENCUMBRANCEREDUCTION = 21,
  CARRYCAPACITY = 22,
  MAXPANIC = 23,
  PANICDECAY = 24,
  MAXHP = 25,
  HEALTHREGENERATION = 26,
  MAXSTAMINA = 27,
  STAMINAREGENERATION = 28,
  ABILITYPREPARATIONSPEED = 29,
  ABILITYRECOVERYSPEED = 30,
  COOLDOWNSPEED = 31,
  AGE = 32,
  CONCEALMENT = 33,
  VEILSUBTLETY = 34,
  VEILRESIST = 35,
  HEALINGRECEIVEDBONUS = 36,
  ENHANCEMENTDURATION = 37,
  HEATTOLERANCE = 38,
  COLDTOLERANCE = 39,
  MAXBLOOD = 40,
  BLOODREGENERATION = 41,
  EFFECTPOWERBONUS = 42,
  NONE = 43,
  COUNT = 43
}
 
  
export enum PlayerStatType { 
  NONE = 0,
  PRIMARY = 1,
  SECONDARY = 2,
  DERIVED = 3,
  HIDDEN = 4
}
 
  
export enum PlotType { 
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
  CUSTOM = 3
}

export enum BuildPermissions { 
  NONE = 0,
  SELF = 0,
  GROUP = 1,
  FRIENDS = 2,
  GUILD = 4,
  REALM = 8,
  ALL = 16,
  COUNT = 32
}

export enum PlotSource { 
  COMMAND = 0,
  COG = 1,
  COUNT = 2
}
 
 
export enum PrereleaseAccess { 
  NONE = 0,
  BETA3 = 1,
  BETA2 = 2,
  BETA1 = 3,
  ALPHA = 4,
  INTERNALTESTING = 5
}

export enum ForumAccess { 
  FOUNDERREADONLY = 0,
  FOUNDER = 1,
  INTERNALTEST = 2,
  BUILDER = 3
}
  
  
export enum ProjectileTrackingMode { 
  NONE = 0,
  LARGEANGLE = 1,
  FULL = 2,
  HORIZONTAL = 3,
  ATTRACTOR = 4,
  GRAVITY = 5
}
 
  
export enum Race { 
  TUATHA = 0,
  HAMADRYAD = 1,
  LUCHORPAN = 2,
  FIRBOG = 3,
  VALKYRIE = 4,
  HELBOUND = 5,
  FROSTGIANT = 6,
  DVERGR = 7,
  STRM = 8,
  CAITSITH = 9,
  GOLEM = 10,
  GARGOYLE = 11,
  STORMRIDER = 12,
  STORMRIDERT = 13,
  STORMRIDERV = 14,
  HUMANMALEV = 15,
  HUMANMALEA = 16,
  HUMANMALET = 17,
  PICT = 18,
  ANY = 19
}
 
 
export enum RedeemError { 
  SUCCESS = 0,
  ALREADYREDEEMED = 1,
  DATABASEERROR = 2,
  DUPLICATETRANSACTIONID = 3,
  INVALIDATED = 4,
  BADSTATE = 5,
  NOTREVEALED = 6
}
  
  
export enum RequirementApplicationType { 
  ABILITYEFFECT = 0,
  COMBATANT = 1,
  SUBJECTCASTER = 2
}

export enum ComparisonType { 
  EQUAL = 0,
  LESSTHAN = 1,
  GREATERTHAN = 2
}

export enum ListComparison { 
  ANY = 0,
  ONE = 1,
  ALL = 2
}
 
  
export enum ResourceType { 
  HEALTH = 0,
  BLOOD = 0,
  STAMINA = 1,
  ELIXIRSTART = 2,
  ELIXIR1 = 2,
  ELIXIR2 = 3,
  ELIXIREND = 4,
  ELIXIRCOUNT = 2,
  ARROWSTART = 5,
  BASICARROW = 5,
  BLACKARROW = 6,
  FLIGHTARROW = 7,
  BLUNTARROW = 8,
  BROADHEADARROW = 9,
  BARBEDARROW = 10,
  LEAFBLADEARROW = 11,
  SERRATEDARROW = 12,
  NOTCHEDARROW = 13,
  CRESCENTARROW = 14,
  LIGHTARROW = 15,
  DARTPOINTARROW = 16,
  FORKEDARROW = 17,
  HEAVYWARARROW = 18,
  ARROWEND = 19,
  ARROWCOUNT = 14,
  DOODAD = 20
}
 
  
export enum ServerStatus { 
  OFFLINE = 0,
  STARTING = 1,
  ONLINE = 2
}
 
 
export enum ShapeType { 
  BOX = 0,
  CAPSULE = 1,
  SPHERE = 2,
  CONE = 3
}
  
  
export enum StanceID { 
  DEFAULT = 0
}
 
  
export enum StatModificationOperatorType { 
  ADDPERCENT = 0,
  ADDVALUE = 1,
  REPLACEVALUE = 2
}
 
  
export enum StoneTypes { 
  LIFE = 0,
  CURING = 1,
  SHIELDING = 2,
  REJUVENATION = 3,
  INVERSION = 4,
  DEFLECTION = 5
}
 
  
export enum TagConstraintType { 
  ALLOF = 0,
  ANYOF = 1,
  NONEOF = 2
}
 
  
export enum TargetType { 
  NONE = 0,
  ENEMY = 1,
  FRIEND = 2,
  ANY = 3,
  SELF = 4,
  FRIENDORSELF = 5
}
 
  
export enum TestItemFlags { 
  NONE = 0,
  STORMRIDER = 1,
  HUMANMALE = 2,
  ARCHERY = 4,
  FUTURERELEASE = 8
}
 
 
export enum TransactionType { 
  PAYPAL = 1,
  KICKSTARTER = 2,
  CHILD = 3,
  STRIPE = 4
}
  
  
export enum TriggerBehaviorMode { 
  NONE = 0,
  ATTACHTOTARGET = 1,
  MOVETOWARDSTARGET = 2,
  COUNT = 3
}
 
  
export enum TriggerFilter { 
  ANY = 0,
  FRIEND = 1,
  ENEMY = 2
}
 
  
export enum TriggerType { 
  NONE = 0,
  ABILITYUSE = 1,
  ABILITYHIT = 2,
  DAMAGE = 3,
  HEALING = 4,
  WOUND = 5,
  DEATH = 6,
  COLLISION = 7
}
 
  
export enum WeaponStat { 
  NONE = 0,
  PIERCINGDAMAGE = 1,
  PIERCINGBLEED = 2,
  PIERCINGARMORPENETRATION = 3,
  SLASHINGDAMAGE = 4,
  SLASHINGBLEED = 5,
  SLASHINGARMORPENETRATION = 6,
  CRUSHINGDAMAGE = 7,
  FALLBACKCRUSHINGDAMAGE = 8,
  DISRUPTION = 9,
  DEFLECTIONAMOUNT = 10,
  PHYSICALPROJECTILESPEED = 11,
  KNOCKBACKAMOUNT = 12,
  STABILITY = 13,
  FALLOFFMINDISTANCE = 14,
  FALLOFFMAXDISTANCE = 15,
  FALLOFFREDUCTION = 16,
  DEFLECTIONRECOVERY = 17,
  STAMINACOST = 18,
  PHYSICALPREPARATIONTIME = 19,
  PHYSICALRECOVERYTIME = 20,
  RANGE = 21,
  REPAIRSALLOWED = 22,
  CURRENTDURABILITY = 23,
  FRACTURETHRESHOLD = 24,
  FRACTURECHANCE = 25,
  WEIGHT = 26,
  ENCUMBRANCE = 27,
  STARTINGDURABILITY = 28,
  BASEHARDNESS = 29,
  FIRERESISTANCE = 30,
  WEIGHTPCF = 31,
  MALLEABILITY = 32,
  MELTINGPOINT = 33,
  DENSITY = 34,
  STRENGTHREQUIREMENT = 35,
  DEXTERITYREQUIREMENT = 36,
  AGILITYREQUIREMENT = 37
}
 
  
export enum WeaponType { 
  NONE = 0,
  ARROW = 1,
  DAGGER = 2,
  SWORD = 4,
  HAMMER = 8,
  AXE = 16,
  MACE = 32,
  GREATSWORD = 64,
  GREATHAMMER = 128,
  GREATAXE = 256,
  GREATMACE = 512,
  SPEAR = 1024,
  STAFF = 2048,
  POLEARM = 4096,
  SHIELD = 8192,
  BOW = 16384,
  THROWING = 32768,
  ALL = 65535
}

export enum NetworkWeaponType { 
  DEFAULT = 0,
  SHIELD = 1,
  BOW = 2
}
 
  
export enum WireCompressionType { 
  NONE = 0,
  LZMA = 1
}

export enum ResourceCompressionType { 
  NONE = 0
}
 
