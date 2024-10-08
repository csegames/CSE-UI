/* tslint:disable */

/** CSE.CharacterID */
export type CharacterID = any;

/** CSEUtilsNET.NormalizedString */
export type NormalizedString = any;

export type Decimal = any;

/** CSE.ProfileID */
export type ProfileID = any;

/** CU.WebApi.Models.ProfileDateTime */
export type ProfileDateTime = any;

/** CSE.Account.AccountID */
export type AccountID = any;

/** CSE.GameplayDefs.ScenarioInstanceID */
export type ScenarioInstanceID = any;

/** ShardID */
export type ShardID = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;

/** CSEUtilsNET.Strings.DisplayInfoDescription */
export type DisplayInfoDescription = any;

/** CSEUtilsNET.Strings.CUDisplayInfoIcon */
export type CUDisplayInfoIcon = any;

/** CSEUtilsNET.Strings.DisplayInfoName */
export type DisplayInfoName = any;
/** ServerLib.GraphQL.Models.IInteractiveAlert */
export interface IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** CU.WebApi.Models.Debugging.IDebuggingUpdate */
export interface IDebuggingUpdate {
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.IMatchUpdate */
export interface IMatchUpdate {
  type: string | null;
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
  championCostumes: (ChampionCostumeInfo | null)[] | null /** Gets information about champion costumes */;
  champions: (ChampionInfo | null)[] | null /** Gets information about champions */;
  channels: (Channel | null)[] | null /** List all channels. */;
  character: CUCharacter | null /** Get a character by id and shard. */;
  colossusProfile: ProfileGQL | null /** retrieve information about a player's profile */;
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  debugSession: DebugSessionStatus | null /** Debug Session Status */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  group: Group | null /** Information about an account's current FSR lobby group */;
  groupOfferPermissions: OfferPermissionSettings | null /** Invormation about an account's current FSR group offer permissions */;
  groupOffers: OfferSummary | null /** Information about an account's current FSR lobby group offers */;
  matchmaking: MatchStatus | null /** Match Status */;
  matchmakingAdmin: ActivitiesAdminData | null /** Admin only match data */;
  myCharacter: CUCharacter | null /** Get the character of the currently logged in user. */;
  myInteractiveAlerts: (IInteractiveAlert | null)[] | null /** Alerts */;
  myPassiveAlerts:
    | (PassiveAlert | null)[]
    | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  myUser: User | null /** Retrieve information about your user account. */;
  overmindSummary: OvermindSummaryGQL | null /** retrieve information about a scenario */;
  patcherHero: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  serverBuildNumber: number | null /** Build number for the actively running server */;
  serverTimestamp: string | null /** Retrieve the current time on the server. */;
}
/** CU.WebApi.GraphQL.ChampionCostumeInfo */
export interface ChampionCostumeInfo {
  backgroundImageURL: string | null;
  cardImageURL: string | null;
  championSelectedFlareImageURL: string | null;
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
  championSelectSound: number | null;
  description: string | null;
  id: string | null;
  name: string | null;
  progressionCurrencyID: string | null;
  questID: string | null;
  runeModUnlockCurrencyID: string | null;
  sortOrder: number | null;
  uIColor: number | null;
}
/** CU.WebApi.GraphQL.ChampionAbility */
export interface ChampionAbility {
  description: string | null;
  iconClass: string | null;
  name: string | null;
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
  id: CharacterID | null;
  name: NormalizedString | null;
}
/** ServerLib.GraphQL.Types.ProfileGQL */
export interface ProfileGQL {
  champions: (ChampionGQL | null)[] | null;
  dailyQuestResets: number | null;
  defaultChampion: DefaultChampionGQL | null;
  defaultChampionID: string | null;
  lifetimeStats: (MatchStatsGQL | null)[] | null;
  perks: (PerkGQL | null)[] | null;
  profileID: ProfileID | null;
  progressionNodes: (string | null)[] | null;
  quests: (QuestGQL | null)[] | null;
  timeOffsetSeconds: number | null;
}
/** ServerLib.GraphQL.Types.ChampionGQL */
export interface ChampionGQL {
  championID: string | null;
  costumePerkID: string | null;
  emotePerkIDs: (string | null)[] | null;
  portraitPerkID: string | null;
  runeModPerkIDs: (string | null)[] | null;
  sprintFXPerkID: string | null;
  stats: (MatchStatsGQL | null)[] | null;
  weaponPerkID: string | null;
}
/** ServerLib.GraphQL.Types.MatchStatsGQL */
export interface MatchStatsGQL {
  combosPerformed: number | null;
  damageApplied: Decimal | null;
  damageTaken: Decimal | null;
  deathCount: number | null;
  downedCount: number | null;
  eliteKills: number | null;
  kills: number | null;
  longestKillStreak: number | null;
  longestLife: number | null;
  matchesPlayed: number | null;
  maxScenarioScore: number | null;
  maxScore: number | null;
  mostCombosPerformedInMatch: number | null;
  mostDamageAppliedInMatch: Decimal | null;
  mostDamageTakenInMatch: Decimal | null;
  mostKillsInMatch: number | null;
  reviveAssistCount: number | null;
  revivedCount: number | null;
  scenarioID: string | null;
  thumbsUp: number | null;
  totalPlayTime: number | null;
  totalScenarioScore: number | null;
  totalScore: number | null;
  wins: number | null;
}
/** ServerLib.GraphQL.Types.DefaultChampionGQL */
export interface DefaultChampionGQL {
  championID: string | null;
  costumeID: string | null;
}
/** ServerLib.GraphQL.Types.PerkGQL */
export interface PerkGQL {
  id: string | null;
  qty: number | null;
}
/** ServerLib.GraphQL.Types.QuestGQL */
export interface QuestGQL {
  currentQuestIndex: number | null;
  currentQuestProgress: number | null;
  granted: string | null;
  id: string | null;
  nextCollection: number | null;
  nextCollectionPremium: number | null;
  questStatus: QuestStatus | null;
  totalProgress: number | null;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {}
/** CU.WebApi.Models.Debugging.DebugSessionStatus */
export interface DebugSessionStatus {
  currentSessions: (DebugSession | null)[] | null;
}
/** CU.WebApi.Models.Debugging.DebugSession */
export interface DebugSession {
  allocated: ProfileDateTime | null;
  completed: ProfileDateTime | null;
  configured: ProfileDateTime | null;
  created: ProfileDateTime | null;
  createdBy: Player | null;
  ended: ProfileDateTime | null;
  error: Error | null;
  gameServerAddress: string | null;
  overrideSheetID: string | null;
  overrideTabID: string | null;
  revision: number | null;
  roundID: string | null;
  scenarioID: string | null;
  started: ProfileDateTime | null;
  zoneID: string | null;
}
/** CU.WebApi.Models.Common.Player */
export interface Player {
  champion: Champion | null;
  displayName: string | null;
  id: string | null;
}
/** CU.WebApi.Models.Common.Champion */
export interface Champion {
  championID: string | null;
  costumeID: string | null;
  portraitID: string | null;
  weaponID: string | null;
}
/** CU.WebApi.Models.Common.Error */
export interface Error {
  fields: (Field | null)[] | null;
  system: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Common.Field */
export interface Field {
  name: string | null;
  value: string | null;
}
/** ServerLib.Game.GameDefsGQLData */
export interface GameDefsGQLData {
  baseStatValues: (StatBonusGQL | null)[] | null /** Base stat values which apply to all races */;
  manifests: (ManifestDef | null)[] | null;
  perks: (PerkDefGQL | null)[] | null /** Static information about perks */;
  progressionNodes: (ProgressionNodeDef | null)[] | null /** Static information about progression nodes */;
  purchases: (PurchaseDefGQL | null)[] | null /** Static information about possible purchases */;
  quests: (QuestDefGQL | null)[] | null /** Static information about quests */;
  raceStatMods:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
  rMTPurchases: (RMTPurchaseDefGQL | null)[] | null /** Static information about possible RMT purchases */;
  scenarios: (ScenarioDefGQL | null)[] | null /** Static information about scenarios */;
  settings: GameSettingsDef | null /** Static information about game settings */;
  stats: (StatDefinitionGQL | null)[] | null /** Array of definitions for all available stats */;
  stringTable: (StringTableEntryDef | null)[] | null /** Static information about string table entries */;
}
/** ServerLib.Game.StatBonusGQL */
export interface StatBonusGQL {
  amount: Decimal | null;
  stat: string | null;
}
/** ServerLib.GraphQL.Types.ManifestDefGQL */
export interface ManifestDef {
  contents: string | null;
  id: string | null;
  schemaVersion: number | null;
}
/** ServerLib.GraphQL.Models.PerkDefGQL */
export interface PerkDefGQL {
  backgroundURL: string | null;
  champion: ClassDefRef | null;
  costume: RaceDefRef | null;
  description: string | null;
  iconClass: string | null;
  iconClassColor: string | null;
  iconURL: string | null;
  id: string | null;
  isUnique: boolean | null;
  name: string | null;
  perkType: PerkType | null;
  portraitChampionSelectImageUrl: string | null;
  portraitThumbnailURL: string | null;
  questType: QuestType | null;
  rarity: PerkRarity | null;
  runeModTier: number | null;
  showIfUnowned: boolean | null;
  sortOrder: number | null;
  statAmount: Decimal | null;
  statID: string | null;
  statOperation: LAEOp | null;
  videoURL: string | null;
  weaponID: string | null;
  xPAmount: number | null;
}
/** CSE.GameplayDefs.ClassDefRef */
export interface ClassDefRef {
  id: string | null;
  name: string | null;
  numericID: CharacterClassID | null;
}
/** CSE.GameplayDefs.RaceDefRef */
export interface RaceDefRef {
  description: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** ServerLib.GraphQL.Types.ColossusProgressionNodeDefGQL */
export interface ProgressionNodeDef {
  championID: string | null;
  childrenIDs: (string | null)[] | null;
  costs: (CostDefGQL | null)[] | null;
  icon: string | null;
  id: string | null;
  locks: (ProfileLockDefGQL | null)[] | null;
  name: string | null;
  parentIDs: (string | null)[] | null;
  positionX: Decimal | null;
  positionY: Decimal | null;
  rewards: (PerkRewardDefGQL | null)[] | null;
}
/** ServerLib.GraphQL.Models.CostDefGQL */
export interface CostDefGQL {
  perkID: string | null;
  qty: number | null;
}
/** ServerLib.GraphQL.Models.ProfileLockDefGQL */
export interface ProfileLockDefGQL {
  endTime: string | null;
  invertConditions: boolean | null;
  perkID: string | null;
  progressionNodeID: string | null;
  questID: string | null;
  questLevel: number | null;
  startTime: string | null;
}
/** ServerLib.GraphQL.Models.PerkRewardDefGQL */
export interface PerkRewardDefGQL {
  perkID: string | null;
  qty: number | null;
}
/** ServerLib.GraphQL.Models.PurchaseDefGQL */
export interface PurchaseDefGQL {
  backgroundURL: string | null;
  bonusDescription: string | null;
  costs: (CostDefGQL | null)[] | null;
  description: string | null;
  iconURL: string | null;
  id: string | null;
  locks: (ProfileLockDefGQL | null)[] | null;
  name: string | null;
  perks: (PurchaseRewardDefGQL | null)[] | null;
  sortOrder: number | null;
}
/** ServerLib.GraphQL.Models.PurchaseRewardDefGQL */
export interface PurchaseRewardDefGQL {
  bundleDiscountPerkID: string | null;
  bundleDiscountPerkQty: number | null;
  perkID: string | null;
  qty: number | null;
}
/** ServerLib.GraphQL.Models.QuestDefGQL */
export interface QuestDefGQL {
  comingSoonImage: string | null;
  currentBackgroundImage: string | null;
  description: string | null;
  displaySubQuests: boolean | null;
  endedSplashImage: string | null;
  expiredImage: string | null;
  id: string | null;
  links: (QuestLinkDefGQL | null)[] | null;
  name: string | null;
  premiumLock: (ProfileLockDefGQL | null)[] | null;
  previewDate: string | null;
  questLock: (ProfileLockDefGQL | null)[] | null;
  questType: QuestType | null;
  shortName: string | null;
  startedSplashImage: string | null;
  subQuestIDs: (string | null)[] | null;
}
/** ServerLib.GraphQL.Models.QuestLinkDefGQL */
export interface QuestLinkDefGQL {
  premiumRewardDescriptionOverride: string | null;
  premiumRewardImageOverride: string | null;
  premiumRewardNameOverride: string | null;
  premiumRewards: (PerkRewardDefGQL | null)[] | null;
  progress: number | null;
  rewardDescriptionOverride: string | null;
  rewardImageOverride: string | null;
  rewardNameOverride: string | null;
  rewards: (PerkRewardDefGQL | null)[] | null;
}
/** ServerLib.Game.RaceStatBonuses */
export interface RaceStatBonuses {
  race: number | null;
  statBonuses: (StatBonusGQL | null)[] | null;
}
/** ServerLib.GraphQL.Models.RMTPurchaseDefGQL */
export interface RMTPurchaseDefGQL {
  bonusDescription: string | null;
  centCost: number | null;
  description: string | null;
  iconURL: string | null;
  id: number | null;
  locks: (ProfileLockDefGQL | null)[] | null;
  name: string | null;
  perks: (PerkRewardDefGQL | null)[] | null;
}
/** ServerLib.GraphQL.Types.ScenarioDefGQL */
export interface ScenarioDefGQL {
  applyChampionUpgrades: boolean | null;
  description: string | null;
  id: string | null;
  loadingBackgroundImage: string | null;
  name: string | null;
  showLeaderboardTab: boolean | null;
  showPlayerProgressionTab: boolean | null;
  showScoreAsRank: boolean | null;
  summaryBackgroundImage: string | null;
}
/** CSE.GameplayDefs.GameSettingsDef */
export interface GameSettingsDef {
  dailyQuestResetsAllowed: number | null;
  expensivePurchaseGemThreshold: number | null;
  hardDailyQuestCount: number | null;
  maxCharacterNameLength: number | null;
  maxEmoteCount: number | null;
  minCharacterNameLength: number | null;
  normalDailyQuestCount: number | null;
  runeModTiers: number | null;
  startingAttributePoints: number | null;
  storeTabConfigs: (StoreTabConfig | null)[] | null;
  traitsMaxPoints: number | null;
  traitsMinPoints: number | null;
}
/** CSE.GameplayDefs.GameSettingsDef+StoreTabConfig */
export interface StoreTabConfig {
  layout: number | null;
  tab: StoreTab | null;
}
/** ServerLib.Game.StatDefinitionGQL */
export interface StatDefinitionGQL {
  addPointsAtCharacterCreation: boolean | null;
  description: string | null;
  displayType: StatDisplayType | null;
  id: string | null;
  itemRequirementStat: string | null;
  name: string | null;
  operation: string | null;
  showAtCharacterCreation: boolean | null;
  statType: StatType | null;
}
/** CSE.GameplayDefs.StringTableEntryDef */
export interface StringTableEntryDef {
  id: string | null;
  value: string | null;
}
/** CU.WebApi.Models.TeamJoin.Group */
export interface Group {
  applications: (Application | null)[] | null;
  capacity: number | null;
  id: string | null;
  invitations: (Invitation | null)[] | null;
  leader: Member | null;
  members: (Member | null)[] | null;
  revision: number | null;
  size: number | null;
  totalChanges: number | null;
  updateLog: (GroupUpdate | null)[] | null;
}
/** CU.WebApi.Models.TeamJoin.Application */
export interface Application {
  from: Player | null;
  sent: ProfileDateTime | null;
  to: Player | null;
}
/** CU.WebApi.Models.TeamJoin.Invitation */
export interface Invitation {
  expires: ProfileDateTime | null;
  from: Player | null;
  sent: ProfileDateTime | null;
  to: Player | null;
}
/** CU.WebApi.Models.TeamJoin.Member */
export interface Member {
  champion: Champion | null;
  displayName: string | null;
  id: string | null;
  isOnline: boolean | null;
}
/** CU.WebApi.Models.TeamJoin.GroupUpdate */
export interface GroupUpdate {
  action: string | null;
  target: Player | null;
}
/** CU.WebApi.Models.TeamJoin.OfferPermissionSettings */
export interface OfferPermissionSettings {
  allowApplications: boolean | null;
  allowInvitations: boolean | null;
  alwaysAllowed: (Player | null)[] | null;
  blocked: (Player | null)[] | null;
  player: Player | null;
  revision: number | null;
}
/** CU.WebApi.Models.TeamJoin.OfferSummary */
export interface OfferSummary {
  applications: (Application | null)[] | null;
  invitations: (Invitation | null)[] | null;
  player: Player | null;
}
/** CU.WebApi.Models.Matchmaking.MatchStatus */
export interface MatchStatus {
  currentMatches: (Match | null)[] | null;
  currentQueues: (QueueEntry | null)[] | null;
  currentSelections: (ChampionSelection | null)[] | null;
  matchAccess: MatchAccess | null;
  modes: (GameMode | null)[] | null;
  queues: (Queue | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.Match */
export interface Match {
  activityID: string | null;
  allocated: ProfileDateTime | null;
  chatServerAddress: string | null /** Address of the chat server for this match */;
  completed: ProfileDateTime | null;
  configured: ProfileDateTime | null;
  created: ProfileDateTime | null;
  ended: ProfileDateTime | null;
  error: Error | null;
  gameServerAddress: string | null /** Address of the game server for this match */;
  revision: number | null;
  rosters: (Roster | null)[] | null /** Rosters visible to the player */;
  roundID: string | null;
  scenarioID: string | null;
  started: ProfileDateTime | null;
}
/** CU.WebApi.Models.Matchmaking.Roster */
export interface Roster {
  members: (Player | null)[] | null;
  teamID: string | null;
}
/** CU.WebApi.Models.Matchmaking.Member */
export interface TeamMember {
  champion: Champion | null;
  displayName: string | null;
  id: string | null;
}
/** CU.WebApi.Models.Matchmaking.QueueEntry */
export interface QueueEntry {
  enteredBy: Player | null;
  entryID: string | null;
  queuedTime: ProfileDateTime | null;
  queueID: string | null;
  userTag: string | null;
}
/** CU.WebApi.Models.Matchmaking.ChampionSelection */
export interface ChampionSelection {
  activityID: string | null;
  created: ProfileDateTime | null;
  durationSeconds: Decimal | null;
  fromQueue: string | null;
  players: (SelectionPlayer | null)[] | null;
  reservationID: string | null;
  revision: number | null;
  roundID: string | null;
  scenarioID: string | null;
}
/** CU.WebApi.Models.Matchmaking.SelectionPlayer */
export interface SelectionPlayer {
  champion: Champion | null;
  displayName: string | null;
  id: string | null;
  locked: boolean | null;
}
/** CU.WebApi.Models.Matchmaking.GameMode */
export interface GameMode {
  activityID: string | null;
  backfillStatus: string | null;
  hash: number | null;
  playCriteria: (Criterion | null)[] | null;
  scenarios: (ScenarioOption | null)[] | null;
  teams: (Team | null)[] | null;
  viewCriteria: (Criterion | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.Criterion */
export interface Criterion {
  criterionID: string | null;
  restrictions: (Restriction | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.Restriction */
export interface Restriction {
  fields: (Field | null)[] | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.ScenarioOption */
export interface ScenarioOption {
  id: string | null;
  params: (ScenarioParameter | null)[] | null;
  weight: number | null;
}
/** CU.WebApi.Models.Matchmaking.ScenarioParameter */
export interface ScenarioParameter {
  name: string | null;
  value: string | null;
}
/** CU.WebApi.Models.Matchmaking.Team */
export interface Team {
  maxCopies: number | null;
  maxSize: number | null;
  maxStartSize: number | null;
  minCopies: number | null;
  roles: (Role | null)[] | null;
  teamID: string | null;
}
/** CU.WebApi.Models.Matchmaking.Role */
export interface Role {
  id: string | null;
  joinCriteria: (Criterion | null)[] | null;
  maxSize: number | null;
  maxStartSize: number | null;
  minSize: number | null;
}
/** CU.WebApi.Models.Matchmaking.Queue */
export interface Queue {
  displayAlias: string | null;
  enabled: boolean | null;
  hash: number | null;
  maxEntrySize: number | null;
  maxWaitBySize: (MaxWaitBySize | null)[] | null;
  minEntrySize: number | null;
  nextStatusChange: string | null;
  queueID: string | null;
  strategy: string | null;
  targets: (Target | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.MaxWaitBySize */
export interface MaxWaitBySize {
  durationSec: number | null;
  playerCount: number | null;
}
/** CU.WebApi.Models.Matchmaking.Target */
export interface Target {
  activityID: string | null;
  teamID: string | null;
}
/** CU.WebApi.Models.Matchmaking.ActivitiesAdminData */
export interface ActivitiesAdminData {
  currentMatches: MatchPage | null /** Live Matches (admin) */;
  currentQueueEntries: QueueEntryPage | null /** Live Queue Entries (admin) */;
  currentSelections: ChampionSelectionPage | null /** Live Champion Selections (admin) */;
  matchesByDate: MatchPage | null /** Matches that start within the given date range (admin) */;
  modes: GameModePage | null /** Activities (admin) */;
  queues: QueuePage | null /** Queues (admin) */;
}
/** CU.WebApi.Models.Matchmaking.MatchPage */
export interface MatchPage {
  entries: (Match | null)[] | null;
  nextPageToken: string | null;
}
/** CU.WebApi.Models.Matchmaking.QueueEntryPage */
export interface QueueEntryPage {
  entries: (QueueEntry | null)[] | null;
  nextPageToken: string | null;
}
/** CU.WebApi.Models.Matchmaking.ChampionSelectionPage */
export interface ChampionSelectionPage {
  entries: (ChampionSelection | null)[] | null;
  nextPageToken: string | null;
}
/** CU.WebApi.Models.Matchmaking.GameModePage */
export interface GameModePage {
  entries: (GameMode | null)[] | null;
  nextPageToken: string | null;
}
/** CU.WebApi.Models.Matchmaking.QueuePage */
export interface QueuePage {
  entries: (Queue | null)[] | null;
  nextPageToken: string | null;
}
/** CU.WebApi.GraphQL.PassiveAlert */
export interface PassiveAlert {
  message: string | null;
  targetID: CharacterID | null;
}
/** User account model */
export interface User {
  backerLevel: BackerLevel | null;
  created: string | null;
  displayName: string | null;
  id: AccountID | null;
  lastLogin: string | null;
}
/** CU.WebApi.Models.OvermindSummary.OvermindSummaryGQL */
export interface OvermindSummaryGQL {
  characterSummaries: (OvermindCharacter | null)[] | null;
  id: ScenarioInstanceID | null;
  matchID: string | null;
  mVPs: (MVP | null)[] | null;
  resolution: ScenarioResolution | null;
  scenarioID: string | null;
  scenarioScore: number | null;
  scorePanels: (ScorePanel | null)[] | null;
  shardID: ShardID | null;
  startTime: string | null;
  totalRunTime: number | null;
  winningTeamIDs: (string | null)[] | null;
}
/** CU.WebApi.Models.OvermindSummary.OvermindCharacter */
export interface OvermindCharacter {
  accountID: AccountID | null;
  classID: string | null;
  combosPerformed: number | null;
  damageApplied: Decimal | null;
  damageTaken: Decimal | null;
  deathCount: number | null;
  downedCount: number | null;
  eliteKills: number | null;
  isHuman: boolean | null;
  kills: number | null;
  level: number | null;
  longestKillStreak: number | null;
  longestLife: number | null;
  portraitPerkID: string | null;
  questProgress: (QuestProgress | null)[] | null;
  raceID: string | null;
  reviveAssistCount: number | null;
  revivedCount: number | null;
  score: number | null;
  teamID: string | null;
  thumbsUpReward: string | null /** The character that this character gave a thumbs up to. */;
  totalTimeInMatch: number | null;
  userName: string | null;
}
/** CU.WebApi.Models.OvermindSummary.QuestProgress */
export interface QuestProgress {
  id: string | null;
  previousIndex: number | null;
  previousProgress: number | null;
  progressAdded: number | null;
  progressDetails: (QuestDetails | null)[] | null;
}
/** CU.WebApi.Models.OvermindSummary.QuestDetails */
export interface QuestDetails {
  amount: number | null;
  name: string | null;
}
/** CU.WebApi.Models.OvermindSummary.MVP */
export interface MVP {
  accountID: AccountID | null;
  mVPDescription: string | null;
  mVPName: string | null;
}
/** CU.WebApi.Models.OvermindSummary.ScorePanel */
export interface ScorePanel {
  def: ScenarioScorePanelDef | null;
  instance: ScorePanelInstance | null;
}
/** CSE.GameplayDefs.ScenarioScorePanelDef */
export interface ScenarioScorePanelDef {
  backgroundImage: string | null;
  displayName: string | null;
  id: string | null;
  rankImageLost: string | null;
  rankImageWon: string | null;
  ranks: (Rank | null)[] | null;
}
/** CSE.GameplayDefs.ScenarioScorePanelDef+Rank */
export interface Rank {
  description: string | null;
}
/** CU.WebApi.Models.OvermindSummary.ScorePanelInstance */
export interface ScorePanelInstance {
  id: string | null;
  rank: number | null;
  score: number | null;
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
  channels: (number | null)[] | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the patch note. */;
  id: string | null;
  jSONContent: string | null /** JSON data of HTML Content for the patch note. */;
  patchNumber: string | null;
  title: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  debugSessionUpdates: IDebuggingUpdate | null /** State updates for remote debugging sessions */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  group: Group | null /** State updates for an account's current FSR group */;
  groupOffers: OfferEvent | null /** State updates for an account's current FSR group offers */;
  interactiveAlerts: IInteractiveAlert | null /** Alerts */;
  manifestUpdates: ManifestUpdate | null /** Updates to a manifest */;
  matchmaking: IMatchUpdate | null /** State updates for matchmaking, game modes, and queues */;
  notifications: Notification | null /** Status or event broadcasts identified by purpose */;
  overmindSummaries: OvermindSummaryGQL | null /** State updates for overmind summaries */;
  passiveAlerts: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
}
/** CU.WebApi.Models.TeamJoin.OfferEvent */
export interface OfferEvent {
  expires: ProfileDateTime | null;
  from: Player | null;
  groupSize: number | null;
  hasEnded: boolean | null;
  isInvite: boolean | null;
  sent: ProfileDateTime | null;
  status: string | null;
  to: Player | null;
}
/** ServerLib.GraphQL.Models.ManifestUpdate */
export interface ManifestUpdate {
  manifests: (ManifestDef | null)[] | null;
}
/** CU.WebApi.Models.Notifications.Notification */
export interface Notification {
  broadcastDuration: string | null;
  content: string | null;
  counter: number | null;
  displayDuration: string | null;
  displayHints: ContentFlags | null;
  displayTime: string | null;
  mimeType: string | null;
  purpose: string | null;
  sequenceID: string | null;
  tags: (string | null)[] | null;
}
/** CU.Permissions.PermissionInfo */
export interface PermissionInfo {
  description: string | null;
  enables: (string | null)[] | null;
  id: string | null;
  name: string | null;
}
/** CU.GraphQL.Vec3fGQL */
export interface Vec3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** CU.GraphQL.Euler3fGQL */
export interface Euler3f {
  pitch: Decimal | null;
  roll: Decimal | null;
  yaw: Decimal | null;
}
/** CSE.GameplayDefs.DisplayInfoDef */
export interface DisplayInfoDef {
  description: DisplayInfoDescription | null;
  iconClass: string | null;
  iconURL: CUDisplayInfoIcon | null;
  name: DisplayInfoName | null;
}
/** CSE.GameplayDefs.StatusStackingDef */
export interface StatusStackingDef {
  group: string | null;
  removalOrder: StatusRemovalOrder | null;
  statusDurationModType: StatusDurationModification | null;
}
/** CSE.GameplayDefs.ColorRGBA */
export interface ColorRGBA {
  a: Decimal | null;
  b: number | null;
  g: number | null;
  hex: string | null /** Color in Hex format */;
  hexa: string | null /** Color in Hex format with alpha */;
  r: number | null;
  rgba: string | null /** Color in RGBA format */;
}
/** ServerLib.GraphQL.ProfileQuery */
export interface ProfileQuery {
  name: string | null;
}
/** CU.WebApi.Models.Matchmaking.NumberValue */
export interface NumberValue {
  name: string | null;
  value: Decimal | null;
}
/** CU.WebApi.Models.Matchmaking.GlobalStats */
export interface GlobalStats {
  counts: (NumberValue | null)[] | null;
  labels: (Field | null)[] | null;
  scores: (NumberValue | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.PlayerStats */
export interface PlayerStats {
  counts: (NumberValue | null)[] | null;
  labels: (Field | null)[] | null;
  player: Player | null;
  scores: (NumberValue | null)[] | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.AccessChanged */
export interface AccessChanged extends IMatchUpdate {
  access: MatchAccess | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.GameModeRemoved */
export interface GameModeRemoved extends IMatchUpdate {
  activityID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.GameModeUpdated */
export interface GameModeUpdated extends IMatchUpdate {
  mode: GameMode | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.MatchRemoved */
export interface MatchRemoved extends IMatchUpdate {
  roundID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.MatchUpdated */
export interface MatchUpdated extends IMatchUpdate {
  match: Match | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.QueueEntryRemoved */
export interface QueueEntryRemoved extends IMatchUpdate {
  entryID: string | null;
  error: Error | null;
  queueID: string | null;
  type: string | null;
  userTag: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.QueueEntryUpdated */
export interface QueueEntryUpdated extends IMatchUpdate {
  entry: QueueEntry | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.QueueRemoved */
export interface QueueRemoved extends IMatchUpdate {
  queueID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.QueueUpdated */
export interface QueueUpdated extends IMatchUpdate {
  queue: Queue | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.SelectionRemoved */
export interface SelectionRemoved extends IMatchUpdate {
  reservationID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Matchmaking.Updates.SelectionUpdated */
export interface SelectionUpdated extends IMatchUpdate {
  selection: ChampionSelection | null;
  type: string | null;
}
/** CU.WebApi.Models.Debugging.Updates.SessionRemoved */
export interface SessionRemoved extends IDebuggingUpdate {
  roundID: string | null;
  type: string | null;
}
/** CU.WebApi.Models.Debugging.Updates.SessionUpdated */
export interface SessionUpdated extends IDebuggingUpdate {
  session: DebugSession | null;
  type: string | null;
}
/** CU.WebApi.GraphQL.GroupMemberStatus */
export interface GroupMemberStatus {
  description: string | null;
  duration: Decimal | null;
  iconURL: string | null;
  id: string | null;
  name: string | null;
  startTime: Decimal | null;
}
/** CU.WebApi.GraphQL.GroupMemberResource */
export interface GroupMemberResource {
  current: Decimal | null;
  id: string | null;
  max: Decimal | null;
}
/** CU.WebApi.GraphQL.OvermindSummaryQuery */
export interface OvermindSummaryQuery {
  name: string | null;
}
/** CU.WebApi.GraphQL.UnusedStructure */
export interface UnusedStructure {
  unused: boolean | null;
}
/** ServerLib.ApiModels.ServerModel */
export interface ServerModel {
  accessLevel: AccessType | null;
  apiHost: string | null;
  channelID: number | null;
  channelPatchPermissions: number | null;
  name: string | null;
  shardID: number | null;
  status: ServerStatus | null;
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
/** ServerLib.ApiModels.SimpleCharacter */
export interface SimpleCharacter {
  id: CharacterID | null;
  lastLogin: string | null;
  name: string | null;
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
export interface CharactercharacterArgs {
  id: string | null;
  shard: number | null;
}
export interface GroupgroupArgs {
  forAccount: string | null /** AccountID to look up for a current group (optional, defaults to logged in account) */;
}
export interface GroupOfferPermissionsgroupOfferPermissionsArgs {
  forAccount:
    | string
    | null /** AccountID to look up for current group offer permissions (optional, defaults to logged in account) */;
}
export interface GroupOffersgroupOffersArgs {
  forAccount:
    | string
    | null /** AccountID to look up for current group offers (optional, defaults to logged in account) */;
}
export interface OvermindSummaryovermindSummaryArgs {
  id: string | null /** Scenario Instance ID. (optional) */;
  matchid: string | null /** Lookup by Match ID. (optional) */;
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
  channel: number | null /** Required: Channel ID from which to return patch notes. */;
}
export interface CurrentMatchescurrentMatchesArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface CurrentQueueEntriescurrentQueueEntriesArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface CurrentSelectionscurrentSelectionsArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface MatchesByDatematchesByDateArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
  startedBy: string | null /** Earliest timestamp (UTC) to scan for round start times (inclusive) */;
  startedBefore: string | null /** Optional: Latest timestamp (UTC) to scan for round start times (exclusive) */;
}
export interface ModesmodesArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface QueuesqueuesArgs {
  pageToken: string | null /** Optional: Token to access the next page of data */;
}
export interface DebugSessionUpdatesdebugSessionUpdatesArgs {
  forAccount: string | null /** AccountID to look up for activity changes (optional, defaults to logged in account) */;
}
export interface GroupgroupArgs {
  forAccount: string | null /** AccountID to look up for group changes (optional, defaults to logged in account) */;
}
export interface GroupOffersgroupOffersArgs {
  forAccount: string | null /** AccountID to look up for group changes (optional, defaults to logged in account) */;
}
export interface MatchmakingmatchmakingArgs {
  forAccount: string | null /** AccountID to look up for activity changes (optional, defaults to logged in account) */;
}
export interface NotificationsnotificationsArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription */;
}
export interface OvermindSummariesovermindSummariesArgs {
  forAccount: string | null /** AccountID to look up for activity changes (optional, defaults to logged in account) */;
}
export interface ShardCharacterUpdatesshardCharacterUpdatesArgs {
  onShard: number | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
/** CU.Databases.Channels.PatchPermissions */
export enum PatchPermissions {
  Public = 'Public',
  AllBackers = 'AllBackers',
  InternalTest = 'InternalTest',
  Development = 'Development',
  Alpha = 'Alpha',
  Beta1 = 'Beta1',
  Beta2 = 'Beta2',
  Beta3 = 'Beta3',
  Live = 'Live'
}
/** CSE.VersionedData.Colossus.Profile.QuestStatus */
export enum QuestStatus {
  Running = 'Running',
  Completed = 'Completed',
  Expired = 'Expired'
}
/** CSE.GameplayDefs.CharacterClassID */
export enum CharacterClassID {
  None = 'None'
}
/** CSE.GameplayDefs.PerkType */
export enum PerkType {
  Invalid = 'Invalid',
  Currency = 'Currency',
  Costume = 'Costume',
  Key = 'Key',
  Portrait = 'Portrait',
  Weapon = 'Weapon',
  CurrentBattlePassXP = 'CurrentBattlePassXP',
  Emote = 'Emote',
  RuneMod = 'RuneMod',
  QuestXP = 'QuestXP',
  SprintFX = 'SprintFX',
  RuneModTierKey = 'RuneModTierKey',
  StatusMod = 'StatusMod',
  StatMod = 'StatMod'
}
/** CSE.GameplayDefs.QuestType */
export enum QuestType {
  Invalid = 'Invalid',
  Normal = 'Normal',
  BattlePass = 'BattlePass',
  DailyNormal = 'DailyNormal',
  DailyHard = 'DailyHard',
  Champion = 'Champion',
  SubQuest = 'SubQuest'
}
/** CSE.GameplayDefs.PerkRarity */
export enum PerkRarity {
  Default = 'Default',
  Common = 'Common',
  Rare = 'Rare',
  Unique = 'Unique'
}
/** CSE.GameplayDefs.LAEOp */
export enum LAEOp {
  Add = 'Add',
  Multiply = 'Multiply',
  AddPercent = 'AddPercent',
  UpperBoundValue = 'UpperBoundValue',
  LowerBoundValue = 'LowerBoundValue',
  UpperBoundMultiplier = 'UpperBoundMultiplier',
  LowerBoundMultiplier = 'LowerBoundMultiplier',
  Set = 'Set'
}
/** CSE.GameplayDefs.StoreTab */
export enum StoreTab {
  Invalid = 'Invalid',
  Bundle = 'Bundle',
  Costume = 'Costume',
  Weapon = 'Weapon',
  SprintFX = 'SprintFX',
  Emote = 'Emote',
  Portrait = 'Portrait',
  QuestXP = 'QuestXP'
}
/** CSE.GameplayDefs.StatDisplayType */
export enum StatDisplayType {
  Value = 'Value',
  Percent = 'Percent',
  IconOnly = 'IconOnly'
}
/** CSE.GameplayDefs.StatType */
export enum StatType {
  None = 'None',
  Primary = 'Primary',
  Secondary = 'Secondary',
  Derived = 'Derived',
  Hidden = 'Hidden'
}
/** CU.WebApi.Models.Matchmaking.MatchAccess */
export enum MatchAccess {
  Forbidden = 'Forbidden',
  Offline = 'Offline',
  Online = 'Online'
}
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  Group = 'Group'
}
/** CSE.Models.BackerLevel */
export enum BackerLevel {
  none = 'none',
  builder = 'builder',
  founder = 'founder'
}
/** CSE.GameplayDefs.ScenarioResolution */
export enum ScenarioResolution {
  Started = 'Started',
  Finished = 'Finished',
  Restarted = 'Restarted',
  Killed = 'Killed'
}
/** CSE.Notifications.ContentFlags */
export enum ContentFlags {
  None = 'None',
  Revoke = 'Revoke',
  Template = 'Template',
  Localized = 'Localized',
  Markup = 'Markup'
}
/** ServerLib.GraphQL.ServerUpdateType */
export enum ServerUpdateType {
  None = 'None',
  Updated = 'Updated',
  UpdatedAll = 'UpdatedAll',
  UnavailableAll = 'UnavailableAll'
}
/** ServerLib.ApiModels.PatcherCharacterUpdateType */
export enum PatcherCharacterUpdateType {
  None = 'None',
  Updated = 'Updated',
  Removed = 'Removed'
}
/** CSE.GameplayDefs.StatusStackingDef+StatusDurationModification */
export enum StatusDurationModification {
  RefreshDuration = 'RefreshDuration',
  AddAmountToDuration = 'AddAmountToDuration',
  SetNewDuration = 'SetNewDuration',
  SetNewDurationIfGreater = 'SetNewDurationIfGreater',
  DoNothing = 'DoNothing'
}
/** CSE.GameplayDefs.StatusStackingDef+StatusRemovalOrder */
export enum StatusRemovalOrder {
  Invalid = 'Invalid',
  KeepOldest = 'KeepOldest',
  KeepNewest = 'KeepNewest',
  KeepOldestFromSource = 'KeepOldestFromSource',
  ApplyOldest = 'ApplyOldest',
  ApplyNewest = 'ApplyNewest'
}
/** AccessType */
export enum AccessType {
  Public = 'Public',
  Live = 'Live',
  Beta3 = 'Beta3',
  Beta2 = 'Beta2',
  Beta1 = 'Beta1',
  Alpha = 'Alpha',
  InternalTest = 'InternalTest',
  Employees = 'Employees',
  Invalid = 'Invalid'
}
/** ServerLib.ApiModels.ServerStatus */
export enum ServerStatus {
  Offline = 'Offline',
  Starting = 'Starting',
  Online = 'Online'
}
