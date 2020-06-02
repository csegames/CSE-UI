/* tslint:disable */

/** CU.CharacterID */
export type CharacterID = any;

/** NormalizedString */
export type NormalizedString = any;

/** ObjectId */
export type ObjectId = any;

export type Decimal = any;

/** CSE.ProfileID */
export type ProfileID = any;

/** CU.Stat */
export type Stat = any;

/** CU.Groups.InviteCode */
export type InviteCode = any;

/** CU.Groups.GroupID */
export type GroupID = any;

/** ShardID */
export type ShardID = any;

/** CU.Groups.TargetID */
export type TargetID = any;

/** CU.ScenarioInstanceID */
export type ScenarioInstanceID = any;

/** CU.MatchQueueInstanceID */
export type MatchQueueInstanceID = any;

/** AccountID */
export type AccountID = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CU.Databases.Models.Items.ItemQuality */
export type ItemQuality = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;
/** CU.WebApi.GraphQL.IGraphQLActiveWarband */
export interface IGraphQLActiveWarband {
  info: ActiveWarband | null;
  members: (GroupMemberState | null)[] | null;
}
/** CU.Groups.IGroup */
export interface IGroup {
  created: string | null;
  faction: Faction | null;
  formerMembers: (IGroupMember | null)[] | null;
  groupType: GroupTypes | null;
  maxRankCount: number | null;
  memberCount: number | null;
  members: (IGroupMember | null)[] | null;
  shard: ShardID | null;
}
/** CU.Groups.IGroupMember */
export interface IGroupMember {
  faction: Faction | null;
  gender: Gender | null;
  groupID: GroupID | null;
  id: CharacterID | null;
  joined: string | null;
  name: NormalizedString | null;
  parted: string | null;
  permissions: (string | null)[] | null;
  race: Race | null;
  rank: string | null;
  shardID: ShardID | null;
}
/** ServerLib.GraphQL.Models.IInteractiveAlert */
export interface IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** ServerLib.GraphQL.Models.IScenarioAlert */
export interface IScenarioAlert {
  category: ScenarioAlertCategory | null;
  targetID: ScenarioInstanceID | null;
  when: number | null;
}
/** ServerLib.GraphQL.TestInterface */
export interface TestInterface {
  float: Decimal | null;
  integer: number | null;
}
/** ServerLib.GraphQL.Character */
export interface Character {
  name: string | null;
  race: string | null;
}
/** CU.WebApi.GraphQL.IGroupUpdate */
export interface IGroupUpdate {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  updateType: GroupUpdateType | null;
}
/** CU.WebApi.GraphQL.IChampionUpdate */
export interface IChampionUpdate {
  type: ChampionUpdateType | null;
  updaterCharacterID: CharacterID | null;
}
/** CU.WebApi.GraphQL.IMatchmakingUpdate */
export interface IMatchmakingUpdate {
  type: MatchmakingUpdateType | null;
}
/** CU.Groups.IGroupNotification */
export interface IGroupNotification {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  groupType: GroupTypes | null;
  type: GroupNotificationType | null;
}
/** ServerLib.ApiModels.IPatcherAlertUpdate */
export interface IPatcherAlertUpdate {
  alert: PatcherAlert | null;
}
/** ServerLib.GraphQL.IServerUpdate */
export interface IServerUpdate {
  type: ServerUpdateType | null;
}
/** ServerLib.ApiModels.IPatcherCharacterUpdate */
export interface IPatcherCharacterUpdate {
  shard: ShardID | null;
  type: PatcherCharacterUpdateType | null;
}
/** The root query object. */
export interface CUQuery {
  activeMatchServer: ActiveMatchServer | null /** Active Match Server */;
  allGameServers: GameServer | null /** Retrieve state of all game servers. CSE Only */;
  championCostumes:
    | (ChampionCostumeInfo | null)[]
    | null /** Gets information about champion costumes */;
  champions:
    | (ChampionInfo | null)[]
    | null /** Gets information about champions */;
  championSelection: ChampionSelectInfo | null /** Champion Selection PlayerInfo */;
  channels: (Channel | null)[] | null /** List all channels. */;
  character: CUCharacter | null /** Get a character by id and shard. */;
  colossusProfile: ColossusProfileDBModel | null /** retrieve information about a player's profile */;
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  invite: Invite | null /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
  invites:
    | (Invite | null)[]
    | null /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
  matchmakingQueueCount: MatchmakingQueueCount | null /** Matchmaking Queue Count */;
  metrics: MetricsData | null /** metrics data */;
  motd:
    | (MessageOfTheDay | null)[]
    | null /** Gets a list of Message of the Days */;
  myActiveWarband: GraphQLActiveWarband | null /** A users active warband */;
  myCharacter: CUCharacter | null /** Get the character of the currently logged in user. */;
  myInteractiveAlerts: (IInteractiveAlert | null)[] | null /** Alerts */;
  myPassiveAlerts:
    | (PassiveAlert | null)[]
    | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  myScenarioAlerts:
    | (IScenarioAlert | null)[]
    | null /** Alerts that notify players something changed about a scenario. */;
  myScenarioQueue: MyScenarioQueue | null /** Gets information about available scenarios and their queue status */;
  myUser: User | null /** Retrieve information about your user account. */;
  overmindsummary: OvermindSummaryDBModel | null /** retrieve information about a scenario */;
  patcherAlerts: (PatcherAlert | null)[] | null /** Gets patcher alerts */;
  patcherHero: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  serverState: GameServerState | null /** Retrieve state of a server. */;
  status: Status | null /** Information about statuses */;
  test: Test | null /** Just here for testing, please ignore. */;
}
/** CU.WebApi.GraphQL.ActiveMatchServer */
export interface ActiveMatchServer {
  serverHost: string | null;
  serverPort: number | null;
}
/** State of server */
export interface GameServer {
  address: string | null;
  reservation: MatchReservationModel | null;
  status: GameServerStatus | null;
}
/** CU.WebApi.GraphQL.MatchReservationModel */
export interface MatchReservationModel {
  matchID: string | null;
  players: (PlayerReservationModel | null)[] | null;
  scenarioID: string | null;
}
/** CU.WebApi.GraphQL.PlayerReservationModel */
export interface PlayerReservationModel {
  accountID: string | null;
  champion: string | null;
  characterID: string | null;
  costume: string | null;
}
/** CU.WebApi.GraphQL.ChampionCostumeInfo */
export interface ChampionCostumeInfo {
  backgroundImageURL: string | null;
  cardImageURL: string | null;
  championSelectImageURL: string | null;
  description: string | null;
  id: string | null;
  name: string | null;
  requiredChampionID: string | null;
  standingImageURL: string | null;
  thumbnailURL: string | null;
}
/** CU.WebApi.GraphQL.ChampionInfo */
export interface ChampionInfo {
  abilities: (ChampionAbility | null)[] | null;
  id: string | null;
  name: string | null;
}
/** CU.WebApi.GraphQL.ChampionAbility */
export interface ChampionAbility {
  description: string | null;
  iconClass: string | null;
  name: string | null;
}
/** CU.WebApi.GraphQL.ChampionSelectInfo */
export interface ChampionSelectInfo {
  matchID: string | null;
  teamMates: (ChampionSelectPlayer | null)[] | null;
}
/** CU.WebApi.GraphQL.ChampionSelectPlayer */
export interface ChampionSelectPlayer {
  characterID: CharacterID | null;
  displayName: string | null;
  metaData: string | null;
}
/** ServerLib.ApiModels.Channel */
export interface Channel {
  description: string | null;
  id: number | null;
  name: string | null;
  permissions: PatchPermissions | null;
}
/** CU.Databases.Models.CUCharacter */
export interface CUCharacter {
  archetype: Archetype | null;
  gender: Gender | null;
  id: CharacterID | null;
  name: NormalizedString | null;
  race: Race | null;
}
/** CU.Databases.Models.ColossusProfileDBModel */
export interface ColossusProfileDBModel {
  champions: (ChampionDBModel | null)[] | null;
  defaultChampion: DefaultChampionDBModel | null;
  lifetimeStats: (MatchStatsDBModel | null)[] | null;
  profileID: ProfileID | null;
}
/** CU.Databases.Models.ChampionDBModel */
export interface ChampionDBModel {
  championID: ObjectId | null;
  stats: (MatchStatsDBModel | null)[] | null;
}
/** CU.Databases.Models.MatchStatsDBModel */
export interface MatchStatsDBModel {
  damageApplied: Decimal | null;
  damageTaken: Decimal | null;
  deathCount: number | null;
  kills: number | null;
  longestKillStreak: number | null;
  longestLife: number | null;
  matchesPlayed: number | null;
  mostDamageAppliedInMatch: Decimal | null;
  mostDamageTakenInMatch: Decimal | null;
  mostKillsInMatch: number | null;
  scenarioID: string | null;
  thumbsUp: number | null;
  totalPlayTime: number | null;
}
/** CU.Databases.Models.DefaultChampionDBModel */
export interface DefaultChampionDBModel {
  championID: ObjectId | null;
  costumeID: ObjectId | null;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {
  servers: (ServerModel | null)[] | null;
}
/** ServerLib.ApiModels.ServerModel */
export interface ServerModel {
  accessLevel: AccessType | null;
  apiHost: string | null;
  channelID: number | null;
  channelPatchPermissions: number | null;
  host: string | null;
  name: string | null;
  playerMaximum: number | null;
  shardID: number | null;
  status: ServerStatus | null;
}
/** ServerLib.Game.GameDefsGQLData */
export interface GameDefsGQLData {
  baseStatValues:
    | (StatBonusGQL | null)[]
    | null /** Base stat values which apply to all races */;
  raceStatMods:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
  stats:
    | (StatDefinitionGQL | null)[]
    | null /** Array of definitions for all available stats */;
}
/** ServerLib.Game.StatBonusGQL */
export interface StatBonusGQL {
  amount: Decimal | null;
  stat: Stat | null;
}
/** ServerLib.Game.RaceStatBonuses */
export interface RaceStatBonuses {
  race: Race | null;
  statBonuses: (StatBonusGQL | null)[] | null;
}
/** ServerLib.Game.StatDefinitionGQL */
export interface StatDefinitionGQL {
  addPointsAtCharacterCreation: boolean | null;
  description: string | null;
  id: Stat | null;
  name: string | null;
  operation: string | null;
  showAtCharacterCreation: boolean | null;
  statType: StatType | null;
}
/** CU.Groups.Invite */
export interface Invite {
  code: InviteCode | null;
  created: string | null;
  durationTicks: number | null;
  forGroup: GroupID | null;
  fromName: string | null;
  shard: ShardID | null;
  status: InviteStatus | null;
  targetsID128: TargetID | null;
}
/** CU.WebApi.GraphQL.MatchmakingQueueCount */
export interface MatchmakingQueueCount {
  count: number | null;
}
/** ServerLib.MetricsData */
export interface MetricsData {
  currentPlayerCount: PlayerCount | null;
  playerCounts: (PlayerCount | null)[] | null;
}
/** ServerLib.PlayerCount */
export interface PlayerCount {
  bots: number | null;
  timeTicks: number | null;
  total: number | null;
}
/** CU.Databases.Models.Content.MessageOfTheDay */
export interface MessageOfTheDay {
  channels:
    | (number | null)[]
    | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the message of the day. */;
  id: string | null;
  jSONContent:
    | string
    | null /** JSON data about the HTML Content for the message of the day */;
  title: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** CU.WebApi.GraphQL.GraphQLActiveWarband */
export interface GraphQLActiveWarband extends IGraphQLActiveWarband {
  info: ActiveWarband | null;
  members: (GroupMemberState | null)[] | null;
}
/** CU.Groups.ActiveWarband */
export interface ActiveWarband extends IGroup {
  created: string | null;
  disbanded: string | null;
  faction: Faction | null;
  formerMembers: (IGroupMember | null)[] | null;
  groupType: GroupTypes | null;
  id: GroupID | null;
  leader: CharacterID | null;
  leaderPermissions: (string | null)[] | null;
  maxMemberCount: number | null;
  maxRankCount: number | null;
  memberCount: number | null;
  members: (IGroupMember | null)[] | null;
  membersAsString: (string | null)[] | null;
  shard: ShardID | null;
}
/** CU.WebApi.GraphQL.GroupMemberState */
export interface GroupMemberState {
  blood: CurrentMax | null;
  canInvite: boolean | null;
  canKick: boolean | null;
  characterID: string | null;
  classID: Archetype | null;
  displayOrder: number | null;
  entityID: string | null;
  faction: Faction | null;
  gender: Gender | null;
  health: (Health | null)[] | null;
  isAlive: boolean | null;
  isLeader: boolean | null;
  isReady: boolean | null;
  name: string | null;
  position: Vec3f | null;
  race: Race | null;
  rankLevel: number | null;
  stamina: CurrentMax | null;
  statuses: (StatusEffect | null)[] | null;
  type: string | null;
  warbandID: string | null;
}
/** CU.WebApi.GraphQL.CurrentMax */
export interface CurrentMax {
  current: Decimal | null;
  max: Decimal | null;
}
/** CU.WebApi.GraphQL.Health */
export interface Health {
  current: Decimal | null;
  max: Decimal | null;
  wounds: number | null;
}
/** Vec3f */
export interface Vec3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** CU.WebApi.GraphQL.StatusEffect */
export interface StatusEffect {
  description: string | null;
  duration: Decimal | null;
  iconURL: string | null;
  id: string | null;
  name: string | null;
  startTime: Decimal | null;
}
/** CU.WebApi.GraphQL.PassiveAlert */
export interface PassiveAlert {
  message: string | null;
  targetID: CharacterID | null;
}
/** CU.WebApi.GraphQL.MyScenarioQueue */
export interface MyScenarioQueue {
  availableMatches: (Match | null)[] | null;
}
/** CU.WebApi.GraphQL.Match */
export interface Match {
  charactersNeededToStartNextGameByFaction: Faction_Int32 | null;
  gamesInProgress: number | null;
  icon: string | null;
  id: MatchQueueInstanceID | null;
  inScenarioID: ScenarioInstanceID | null;
  isInScenario: boolean | null;
  isQueued: boolean | null;
  name: string | null;
  totalBackfillsNeededByFaction: Faction_Int32 | null;
}

export interface Faction_Int32 {
  arthurian: number | null /** Arthurian */;
  cOUNT: number | null /** COUNT */;
  factionless: number | null /** Factionless */;
  tdd: number | null /** TDD */;
  viking: number | null /** Viking */;
}
/** User account model */
export interface User {
  backerLevel: BackerLevel | null;
  created: string | null;
  displayName: string | null;
  id: AccountID | null;
  lastLogin: string | null;
}
/** CU.OvermindSummaryDBModel */
export interface OvermindSummaryDBModel {
  characterSummaries: (OvermindCharacterSummary | null)[] | null;
  id: ScenarioInstanceID | null;
  resolution: ScenarioResolution | null;
  scenarioID: string | null;
  scenarioWon: boolean | null;
  shardID: ShardID | null;
  startTime: string | null;
  totalRunTime: number | null;
}
/** CU.OvermindSummaryDBModel+OvermindCharacterSummary */
export interface OvermindCharacterSummary {
  characterID: CharacterID | null;
  classID: ObjectId | null;
  damageApplied: Decimal | null;
  damageTaken: Decimal | null;
  deathCount: number | null;
  kills: number | null;
  longestKillStreak: number | null;
  longestLife: number | null;
  raceID: ObjectId | null;
  thumbsUpReward: CharacterID | null /** The character that this character gave a thumbs up to. */;
  totalTimeInMatch: number | null;
  userName: string | null;
}
/** CU.Databases.Models.Content.PatcherAlert */
export interface PatcherAlert {
  id: string | null;
  message: string | null /** HTML Content for the patcher alert. */;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** CU.Databases.Models.Content.PatcherHero */
export interface PatcherHero {
  id: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** CU.Databases.Models.Content.PatchNote */
export interface PatchNote {
  channels:
    | (number | null)[]
    | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the patch note. */;
  id: string | null;
  jSONContent:
    | string
    | null /** JSON data of HTML Content for the patch note. */;
  patchNumber: string | null;
  title: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** State of server */
export interface GameServerState {
  status: GameServerStatus | null;
}
/** ServerLib.Status.Status */
export interface Status {
  statuses: (StatusDef | null)[] | null /** List of all status defs */;
}
/** World.Cogs.StatusDef */
export interface StatusDef {
  blocksAbilities:
    | boolean
    | null /** if the status blocks abilities from running */;
  description: string | null /** description of the status */;
  iconClass: string | null /** iconClass of the status */;
  iconURL: string | null /** icon url of the status */;
  id: string | null;
  name: string | null /** name of the status */;
  numericID: number | null;
  stacking: StatusStackingDef | null;
  statusTags: (string | null)[] | null;
  uIText: string | null;
  uIVisiblity: StatusUIVisiblity | null;
}
/** World.StatusStackingDef */
export interface StatusStackingDef {
  group: string | null;
  removalOrder: StatusRemovalOrder | null;
  statusDurationModType: StatusDurationModification | null;
}
/** ServerLib.GraphQL.Test */
export interface Test extends TestInterface {
  characters: (Character | null)[] | null;
  customField: ItemQuality | null /** testtesttest */;
  float: Decimal | null;
  homeArray: (string | null)[] | null;
  homeList: (string | null)[] | null;
  integer: number | null;
  sg1: TestEnum_String | null;
  sg1Floats: TestEnum_Single | null;
  sg1Titles: TestEnum_String | null;
  string: string | null;
  weapons: (string | null)[] | null;
}

export interface TestEnum_String {
  carter: string | null /** Carter */;
  jackson: string | null /** Jackson */;
  oneill: string | null /** Oneill */;
  tealc: string | null /** Tealc */;
}

export interface TestEnum_Single {
  carter: Decimal | null /** Carter */;
  jackson: Decimal | null /** Jackson */;
  oneill: Decimal | null /** Oneill */;
  tealc: Decimal | null /** Tealc */;
}
/** The root subscriptions object. */
export interface CUSubscription {
  activeGroupUpdates: IGroupUpdate | null /** Updates to a group member in an active group */;
  championSelectionUpdates: IChampionUpdate | null /** Updates champion selection */;
  interactiveAlerts: IInteractiveAlert | null /** Alerts */;
  matchmakingUpdates: IMatchmakingUpdate | null /** Updates matchmaking */;
  myGroupNotifications: IGroupNotification | null /** Group related notifications for your specific character. Tells you when you joined a group, etc. */;
  passiveAlerts: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  patcherAlerts: IPatcherAlertUpdate | null /** Gets updates for patcher alerts */;
  scenarioAlerts: IScenarioAlert | null /** Alerts that notify players something changed about a scenario. */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
}
/** CU.WebApi.GraphQL.ChampionUpdate */
export interface ChampionUpdate extends IChampionUpdate {
  type: ChampionUpdateType | null;
  updaterCharacterID: CharacterID | null;
}
/** CU.WebApi.GraphQL.ChampionSelectionUpdate */
export interface ChampionSelectionUpdate extends IChampionUpdate {
  championID: string | null;
  championMetaData: (string | null)[] | null;
  displayName: string | null;
  type: ChampionUpdateType | null;
  updaterCharacterID: CharacterID | null;
}
/** CU.WebApi.GraphQL.GroupMemberUpdate */
export interface GroupMemberUpdate extends IGroupUpdate {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  memberState: string | null;
  updateType: GroupUpdateType | null;
}
/** CU.WebApi.GraphQL.GroupMemberRemovedUpdate */
export interface GroupMemberRemovedUpdate extends IGroupUpdate {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  updateType: GroupUpdateType | null;
}
/** CU.WebApi.GraphQL.GroupNotification */
export interface GroupNotification extends IGroupNotification {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  groupType: GroupTypes | null;
  type: GroupNotificationType | null;
}
/** CU.WebApi.GraphQL.MatchmakingEntered */
export interface MatchmakingEntered extends IMatchmakingUpdate {
  gameMode: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingError */
export interface MatchmakingError extends IMatchmakingUpdate {
  code: number | null;
  message: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingServerReady */
export interface MatchmakingServerReady extends IMatchmakingUpdate {
  host: string | null;
  port: number | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingKickOff */
export interface MatchmakingKickOff extends IMatchmakingUpdate {
  matchID: string | null;
  secondsToWait: Decimal | null;
  serializedTeamMates: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.Permissions.PermissionInfo */
export interface PermissionInfo {
  description: string | null;
  enables: (string | null)[] | null;
  id: string | null;
  name: string | null;
}
/** CU.Groups.Group */
export interface Group extends IGroup {
  created: string | null;
  disbanded: string | null;
  faction: Faction | null;
  formerMembers: (IGroupMember | null)[] | null;
  groupType: GroupTypes | null;
  maxRankCount: number | null;
  memberCount: number | null;
  members: (IGroupMember | null)[] | null;
  membersAsString: (string | null)[] | null;
  shard: ShardID | null;
}
/** CU.GraphQL.Euler3fGQL */
export interface Euler3f {
  pitch: Decimal | null;
  roll: Decimal | null;
  yaw: Decimal | null;
}
/** CU.Databases.ColorRGBA */
export interface ColorRGBA {
  a: Decimal | null;
  b: number | null;
  g: number | null;
  hex: string | null /** Color in Hex format */;
  hexa: string | null /** Color in Hex format with alpha */;
  r: number | null;
  rgba: string | null /** Color in RGBA format */;
}
/** Scenario.ScenarioDef */
export interface ScenarioDef {
  displayDescription: string | null;
  displayName: string | null;
  icon: string | null;
  id: string | null;
}
/** World.RequirementDef */
export interface RequirementDef {
  description: string | null;
  icon: string | null;
}
/** World.ColossusProfileQuery */
export interface ColossusProfileQuery {
  name: string | null;
}
/** World.Cogs.ClassDef */
export interface ClassDef {
  archetype: Archetype | null;
  faction: Faction | null;
  id: string | null;
}
/** World.Abilities.DisplayInfoDef */
export interface DisplayInfoDef {
  description: string | null;
  iconClass: string | null;
  iconURL: string | null;
  name: string | null;
}
/** ServerLib.Matchmaking.PlayerInfo */
export interface PlayerInfo {
  characterID: CharacterID | null;
  metaData: string | null;
}
/** ServerLib.GraphQL.ServerUpdated */
export interface ServerUpdated extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUpdatedAll */
export interface ServerUpdatedAll extends IServerUpdate {
  server: ServerModel | null;
  type: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUnavailableAllUpdate */
export interface ServerUnavailableAllUpdate extends IServerUpdate {
  type: ServerUpdateType | null;
}
/** ServerLib.GraphQL.SG1Member */
export interface SG1Member extends Character {
  name: string | null;
  race: string | null;
  rank: string | null;
}
/** ServerLib.GraphQL.Goauld */
export interface Goauld extends Character {
  homePlanet: string | null;
  name: string | null;
  race: string | null;
}
/** ServerLib.GraphQL.Models.GroupAlert */
export interface GroupAlert extends IInteractiveAlert {
  category: AlertCategory | null;
  code: InviteCode | null;
  forGroup: GroupID | null;
  forGroupName: string | null;
  fromID: CharacterID | null;
  fromName: string | null;
  kind: GroupAlertKind | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** ServerLib.GraphQL.Models.OvermindSummaryAlert */
export interface OvermindSummaryAlert extends IScenarioAlert {
  category: ScenarioAlertCategory | null;
  summary: OvermindSummaryDBModel | null;
  targetID: ScenarioInstanceID | null;
  when: number | null;
}
/** ServerLib.ApiModels.SimpleCharacter */
export interface SimpleCharacter {
  archetype: Archetype | null;
  faction: Faction | null;
  gender: Gender | null;
  id: CharacterID | null;
  lastLogin: string | null;
  name: string | null;
  race: Race | null;
  shardID: ShardID | null;
}
/** ServerLib.ApiModels.CharacterUpdate */
export interface CharacterUpdate extends IPatcherCharacterUpdate {
  character: SimpleCharacter | null;
  shard: ShardID | null;
  type: PatcherCharacterUpdateType | null;
}
/** ServerLib.ApiModels.CharacterRemovedUpdate */
export interface CharacterRemovedUpdate extends IPatcherCharacterUpdate {
  characterID: CharacterID | null;
  shard: ShardID | null;
  type: PatcherCharacterUpdateType | null;
}
/** ServerLib.ApiModels.PatcherAlertUpdate */
export interface PatcherAlertUpdate extends IPatcherAlertUpdate {
  alert: PatcherAlert | null;
}
/** ServerLib.ApiModels.SpawnPoint */
export interface SpawnPoint {
  faction: Faction | null;
  id: string | null;
  position: Vec3f | null;
}
export interface CharactercharacterArgs {
  id: string | null;
  shard: number | null;
}
export interface InviteinviteArgs {
  shard: number | null /** shard id. (required) */;
  code: string | null /** invite code. (required) */;
}
export interface InvitesinvitesArgs {
  shard: number | null /** shard id. (required) */;
  forGroup:
    | string
    | null /** ID of group from which invites are sent for. (optional) */;
  toGroup:
    | string
    | null /** ID of group to which invites are sent to. (optional) */;
  toCharacter:
    | string
    | null /** ID of character to which invites are sent to. (optional) */;
  includeInactive:
    | boolean
    | null /** Should the response include inactive invites? */;
}
export interface MotdmotdArgs {
  channel:
    | number
    | null /** Required: Channel ID from which to return message of the day */;
}
export interface OvermindsummaryovermindsummaryArgs {
  id: string | null /** Scenario Instance ID. (required) */;
  shard: number | null /** The id of the shard to request data from. */;
}
export interface PatcherAlertspatcherAlertsArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return. */;
}
export interface PatcherHeropatcherHeroArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
}
export interface PatchNotepatchNoteArgs {
  id: string | null /** Required: ID of the patch note. */;
}
export interface PatchNotespatchNotesArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  channel:
    | number
    | null /** Required: Channel ID from which to return patch notes. */;
}
export interface ServerStateserverStateArgs {
  server: string | null;
}
export interface CurrentPlayerCountcurrentPlayerCountArgs {
  server: string | null /** Server ShardID */;
  shard: number | null /** Server ShardID */;
}
export interface PlayerCountsplayerCountsArgs {
  server: string | null /** Server name (default: Hatchery) */;
  from:
    | string
    | null /** Time from which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: -1h) */;
  until:
    | string
    | null /** Time until which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: now) */;
}
export interface ChampionSelectionUpdateschampionSelectionUpdatesArgs {
  matchID: string | null;
}
export interface PatcherAlertspatcherAlertsArgs {
  onShard:
    | number
    | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
export interface ScenarioAlertsscenarioAlertsArgs {
  scenarioID: string | null;
}
export interface ShardCharacterUpdatesshardCharacterUpdatesArgs {
  onShard:
    | number
    | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
/** CSE.ServerAllocation.Coordination.GameServerStatus */
export enum GameServerStatus {
  Unknown = "Unknown",
  Free = "Free",
  Reserved = "Reserved",
  Allocated = "Allocated",
  Running = "Running",
  Shutdown = "Shutdown"
}
/** CU.Databases.Channels.PatchPermissions */
export enum PatchPermissions {
  Public = "Public",
  AllBackers = "AllBackers",
  InternalTest = "InternalTest",
  Development = "Development",
  Alpha = "Alpha",
  Beta1 = "Beta1",
  Beta2 = "Beta2",
  Beta3 = "Beta3"
}
/** CU.Archetype */
export enum Archetype {
  Berserker = "Berserker",
  Amazon = "Amazon",
  Celt = "Celt"
}
/** CU.Gender */
export enum Gender {
  None = "None",
  Male = "Male",
  Female = "Female"
}
/** CU.Race */
export enum Race {
  Berserker = "Berserker",
  MindlessDead = "MindlessDead",
  DrySkeleton = "DrySkeleton",
  Amazon = "Amazon",
  Knight = "Knight",
  Celt = "Celt",
  Ninja = "Ninja",
  WinterWind = "WinterWind",
  DishonoredDead = "DishonoredDead",
  ColossusFrostGiant = "ColossusFrostGiant",
  ColossusFireGiant = "ColossusFireGiant",
  DevourerGiant = "DevourerGiant",
  CorpseGiant = "CorpseGiant",
  Necromancer = "Necromancer",
  Litch = "Litch",
  Warlock = "Warlock",
  DeathPriest = "DeathPriest",
  PlagueBringer = "PlagueBringer",
  ShadowWraith = "ShadowWraith",
  LostSoul = "LostSoul",
  SpectralAlly = "SpectralAlly",
  SpectralWarrior = "SpectralWarrior",
  BoneReaper = "BoneReaper",
  DragonColossus = "DragonColossus"
}
/** AccessType */
export enum AccessType {
  Public = "Public",
  Beta3 = "Beta3",
  Beta2 = "Beta2",
  Beta1 = "Beta1",
  Alpha = "Alpha",
  InternalTest = "InternalTest",
  Employees = "Employees",
  Invalid = "Invalid"
}
/** ServerLib.ApiModels.ServerStatus */
export enum ServerStatus {
  Offline = "Offline",
  Starting = "Starting",
  Online = "Online"
}
/** CU.StatType */
export enum StatType {
  None = "None",
  Primary = "Primary",
  Secondary = "Secondary",
  Derived = "Derived",
  Hidden = "Hidden"
}
/** CU.Groups.InviteStatus */
export enum InviteStatus {
  Active = "Active",
  Revoked = "Revoked",
  UsageLimitReached = "UsageLimitReached",
  Expired = "Expired"
}
/** CU.Faction */
export enum Faction {
  Factionless = "Factionless",
  TDD = "TDD",
  Viking = "Viking",
  Arthurian = "Arthurian",
  COUNT = "COUNT"
}
/** CU.Groups.GroupTypes */
export enum GroupTypes {
  Warband = "Warband",
  Battlegroup = "Battlegroup",
  Order = "Order",
  Campaign = "Campaign"
}
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  Group = "Group"
}
/** ServerLib.GraphQL.Models.ScenarioAlertCategory */
export enum ScenarioAlertCategory {
  Summary = "Summary"
}
/** CSE.Models.BackerLevel */
export enum BackerLevel {
  none = "none",
  builder = "builder",
  founder = "founder"
}
/** CU.Databases.Models.Progression.Logs.ScenarioResolution */
export enum ScenarioResolution {
  Started = "Started",
  Finished = "Finished",
  Restarted = "Restarted",
  Killed = "Killed"
}
/** World.StatusStackingDef+StatusRemovalOrder */
export enum StatusRemovalOrder {
  Invalid = "Invalid",
  KeepOldest = "KeepOldest",
  KeepNewest = "KeepNewest"
}
/** World.StatusStackingDef+StatusDurationModification */
export enum StatusDurationModification {
  RefreshDuration = "RefreshDuration",
  AddAmountToDuration = "AddAmountToDuration",
  SetNewDuration = "SetNewDuration",
  DoNothing = "DoNothing"
}
/** World.Cogs.StatusUIVisiblity */
export enum StatusUIVisiblity {
  Hidden = "Hidden",
  Hud = "Hud",
  PopupOnAdd = "PopupOnAdd",
  PopupOnRemove = "PopupOnRemove",
  ShowAll = "ShowAll"
}
/** CU.WebApi.GraphQL.GroupUpdateType */
export enum GroupUpdateType {
  None = "None",
  MemberJoined = "MemberJoined",
  MemberUpdate = "MemberUpdate",
  MemberRemoved = "MemberRemoved"
}
/** CU.WebApi.GraphQL.ChampionUpdateType */
export enum ChampionUpdateType {
  None = "None",
  Selection = "Selection",
  Lock = "Lock",
  Unlock = "Unlock"
}
/** CU.WebApi.GraphQL.MatchmakingUpdateType */
export enum MatchmakingUpdateType {
  None = "None",
  Entered = "Entered",
  Error = "Error",
  KickOff = "KickOff",
  ServerReady = "ServerReady"
}
/** CU.Groups.GroupNotificationType */
export enum GroupNotificationType {
  None = "None",
  Joined = "Joined",
  Removed = "Removed"
}
/** ServerLib.GraphQL.ServerUpdateType */
export enum ServerUpdateType {
  None = "None",
  Updated = "Updated",
  UpdatedAll = "UpdatedAll",
  UnavailableAll = "UnavailableAll"
}
/** ServerLib.ApiModels.PatcherCharacterUpdateType */
export enum PatcherCharacterUpdateType {
  None = "None",
  Updated = "Updated",
  Removed = "Removed"
}
/** ServerLib.GraphQL.Models.GroupAlertKind */
export enum GroupAlertKind {
  TeamInvite = "TeamInvite"
}
