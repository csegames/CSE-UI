/* tslint:disable */

/** CSEUtilsNET.Strings.DisplayInfoDescription */
export type DisplayInfoDescription = any;

/** CSEUtilsNET.Strings.CUDisplayInfoIcon */
export type CUDisplayInfoIcon = any;

/** CSEUtilsNET.Strings.DisplayInfoName */
export type DisplayInfoName = any;

/** CSE.GameplayDefs.Tags.GameplayTag */
export type GameplayTag = any;

export type Decimal = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CSE.GameplayDefs.CharacterID */
export type CharacterID = any;

/** ShardID */
export type ShardID = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;
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
  alerts: (Alert | null)[] | null /** Gets a list of alerts */;
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  matchmakingStatus: MatchmakingStatus | null /** Matchmaking Status */;
  patcherAlerts: (PatcherAlert | null)[] | null /** Gets patcher alerts */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  shardCharacters:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
}
/** CU.Databases.Models.Content.Alert */
export interface Alert {
  destination: string | null /** Where the alert should be displayed */;
  id: string | null;
  template: string | null /** Template for the alert */;
  type: string | null /** The type of alert */;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
  vars: (AlertVar | null)[] | null /** Variables to substitute into the template */;
}
/** CU.Databases.Models.Content.AlertVar */
export interface AlertVar {
  key: string | null /** The token this variable replaces */;
  value: string | null /** The content to use for replacement */;
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
  name: string | null;
  shardID: number | null;
  status: ServerStatus | null;
}
/** ServerLib.Game.GameDefsGQLData */
export interface GameDefsGQLData {
  abilityComponents:
    | (AbilityComponentDefRef | null)[]
    | null /** All possible ability components for the game or a particular character */;
  abilityNetworks: (AbilityNetworkDef | null)[] | null /** All possible ability networks */;
  baseStatValues: (StatBonusGQL | null)[] | null /** Base stat values which apply to all races */;
  classes: (ClassGQL | null)[] | null /** Static information about classes */;
  damageTypes: (DamageTypeGQL | null)[] | null /** Static information about damage types */;
  entityResources:
    | (EntityResourceDefinitionGQL | null)[]
    | null /** Array of definitions for all available entity resources */;
  factions: (FactionDef | null)[] | null /** All possible factions */;
  gearSlots: (GearSlotDefRef | null)[] | null /** Static information about gear slots */;
  genders: (GenderGQL | null)[] | null /** All possible genders */;
  item: ItemDefRef | null /** Static information about a specific item */;
  itemLoadouts: (ItemLoadoutDefRef | null)[] | null /** Static information about item loadouts */;
  items: (ItemDefRef | null)[] | null /** Static information about items */;
  itemStats: (ItemStatDefinitionGQL | null)[] | null /** Array of definitions for all available item stats */;
  itemTooltipCategories:
    | (ItemTooltipCategoryDef | null)[]
    | null /** Array of category information for item tooltips */;
  perks: (PerkDefRef | null)[] | null /** Static information about perks */;
  purchases: (PurchaseDefRef | null)[] | null /** Static information about possible purchases */;
  quests: (QuestDefRef | null)[] | null /** Static information about quests */;
  races: (RaceGQL | null)[] | null /** Static information about races */;
  raceStatMods:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
  rMTPurchases: (RMTPurchaseDefRef | null)[] | null /** Static information about possible RMT purchases */;
  runeModDisplay:
    | (RuneModLevelDisplayDef | null)[]
    | null /** Static information about the display of the rune mod UI before you hit the first level */;
  runeModLevels: (number | null)[] | null /** Static information about rune mod levels */;
  scenarios: (ScenarioDefGQL | null)[] | null /** Static information about scenarios */;
  settings: GameSettingsDef | null /** Static information about game settings */;
  stats: (StatDefinitionGQL | null)[] | null /** Array of definitions for all available stats */;
  stringTable: (StringTableEntryDef | null)[] | null /** Static information about string table entries */;
}
/** CSE.GameplayDefs.AbilityComponentDefRef */
export interface AbilityComponentDefRef {
  abilityBarKind: AbilityBarKind | null;
  abilityComponentCategory: AbilityComponentCategoryDefRef | null;
  abilityTags: (GameplayTag | null)[] | null;
  display: DisplayInfoDef | null;
  id: string | null;
  networkRequirements: (AbilityNetworkRequirementGQL | null)[] | null;
}
/** CSE.GameplayDefs.AbilityComponentCategoryDefRef */
export interface AbilityComponentCategoryDefRef {
  displayInfo: DisplayInfoDef | null;
  displayOption: AbilityComponentCategoryDisplay | null;
  id: string | null;
  isPrimary: boolean | null;
  isRequired: boolean | null;
}
/** CSE.GameplayDefs.DisplayInfoDef */
export interface DisplayInfoDef {
  description: DisplayInfoDescription | null;
  iconClass: string | null;
  iconURL: CUDisplayInfoIcon | null;
  name: DisplayInfoName | null;
}
/** CSE.GameplayDefs.AbilityNetworkRequirementGQL */
export interface AbilityNetworkRequirementGQL {
  excludeComponent: ExcludeAbilityComponentDef | null;
  excludeTag: ExcludeTagDef | null;
  requireComponent: RequireAbilityComponentDef | null;
  requireTag: RequireTagDef | null;
}
/** CSE.GameplayDefs.ExcludeAbilityComponentDef */
export interface ExcludeAbilityComponentDef {
  component: AbilityComponentDefRef | null;
}
/** CSE.GameplayDefs.ExcludeTagDef */
export interface ExcludeTagDef {
  tag: GameplayTag | null;
}
/** CSE.GameplayDefs.RequireAbilityComponentDef */
export interface RequireAbilityComponentDef {
  component: AbilityComponentDefRef | null;
}
/** CSE.GameplayDefs.RequireTagDef */
export interface RequireTagDef {
  tag: GameplayTag | null;
}
/** CSE.GameplayDefs.AbilityNetworkDef */
export interface AbilityNetworkDef {
  componentCategories: (AbilityComponentCategoryDefRef | null)[] | null;
  display: DisplayInfoDef | null;
  id: string | null;
}
/** ServerLib.Game.StatBonusGQL */
export interface StatBonusGQL {
  amount: Decimal | null;
  stat: string | null;
}
/** ServerLib.GraphQL.Models.ClassGQL */
export interface ClassGQL {
  buildableAbilityNetworks: (string | null)[] | null;
  factionID: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** ServerLib.GraphQL.Types.DamageTypeGQL */
export interface DamageTypeGQL {
  iconClass: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** ServerLib.Game.EntityResourceDefinitionGQL */
export interface EntityResourceDefinitionGQL {
  category: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
  sortOrder: number | null;
  tooltipTextColor: string | null;
  unitFrameDisplay: UnitFrameDisplay | null;
  unitFrameSortOrder: number | null;
}
/** CSE.GameplayDefs.FactionDef */
export interface FactionDef {
  description: string | null;
  hueRotation: number | null;
  id: Faction | null;
  name: string | null;
}
/** CSE.GameplayDefs.GearSlotDefRef */
export interface GearSlotDefRef {
  gearSlotType: GearSlotType | null /** Which type of slot this is */;
  iconClass: string | null;
  id: string | null /** Unique gear slot identifier */;
  name: string | null;
}
/** ServerLib.GraphQL.Models.GenderGQL */
export interface GenderGQL {
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** CSE.GameplayDefs.ItemDefRef */
export interface ItemDefRef {
  deploySettings: DeploySettingsDefRef | null;
  description: string | null /** Description of the item */;
  gearSlotSets: (GearSlotSet | null)[] | null /** the sets of gear slots this item can be equipped to */;
  iconUrl: string | null /** URL to the item's icon */;
  id: string | null /** Unique item identifier */;
  isStackableItem: boolean | null;
  itemType: ItemType | null;
  name: string | null /** Name of the item */;
  substanceDefinition: SubstanceDefRef | null /** Substance information for this item definition */;
  tags: (GameplayTag | null)[] | null /** Tags on this item, these can be referenced by recipes */;
  voxUpgradeModule: VoxUpgradeModuleDefRef | null;
}
/** CSE.GameplayDefs.DeploySettingsDefRef */
export interface DeploySettingsDefRef {
  isDoor: boolean | null;
  itemPlacementType: ItemPlacementType | null;
  itemTemplateType: ItemTemplateType | null;
  mapIconClass: string | null;
  maxPitch: Decimal | null;
  maxTerrainPitch: Decimal | null;
  requiredZoneType: ZoneType | null;
  rotatePitch: boolean | null;
  rotateRoll: boolean | null;
  rotateYaw: boolean | null;
  skipDeployLimitCheck: boolean | null;
  snapToGround: boolean | null;
}
/** CSE.GameplayDefs.GearSlotSet */
export interface GearSlotSet {
  gearSlots:
    | (GearSlotDefRef | null)[]
    | null /** A list of gear slots which makes up a valid set of places a item can be equipped on at once. */;
}
/** CSE.GameplayDefs.SubstanceDefRef */
export interface SubstanceDefRef {
  id: string | null /** The unique identifier for this substance */;
  maxQuality: Decimal | null;
  minQuality: Decimal | null;
  purifyItemDef: ItemDefRef | null;
}
/** CSE.GameplayDefs.VoxUpgradeModuleDefRef */
export interface VoxUpgradeModuleDefRef {
  id: string | null;
}
/** CSE.GameplayDefs.ItemLoadoutDefRef */
export interface ItemLoadoutDefRef {
  id: string | null;
}
/** ServerLib.Game.ItemStatDefinitionGQL */
export interface ItemStatDefinitionGQL {
  category: string | null;
  description: string | null;
  displayPrecision: number | null;
  displayType: ItemStatDisplayType | null;
  iconClass: string | null;
  id: string | null;
  name: string | null;
  numericID: NumericItemInstanceStatDefID | null;
  sortOrder: number | null;
  unitDescription: string | null;
}
/** CSE.GameplayDefs.ItemTooltipCategoryDef */
export interface ItemTooltipCategoryDef {
  id: string | null;
  name: string | null;
  sortOrder: number | null;
}
/** CSE.GameplayDefs.PerkDefRef */
export interface PerkDefRef {
  backgroundURL: string | null;
  champion: ClassDefRef | null;
  costume: RaceDefRef | null;
  description: string | null;
  iconURL: string | null;
  id: string | null;
  isUnique: boolean | null;
  name: string | null;
  perkType: PerkType | null;
  portraitChampionSelectImageUrl: string | null;
  portraitThumbnailURL: string | null;
  questType: QuestType | null;
  rarity: PerkRarity | null;
  runeModLevel: number | null;
  showIfUnowned: boolean | null;
  sortOrder: number | null;
  videoURL: string | null;
  weapon: ItemLoadoutDefRef | null;
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
/** CSE.GameplayDefs.PurchaseDefRef */
export interface PurchaseDefRef {
  costs: (CostDef | null)[] | null;
  description: string | null;
  iconURL: string | null;
  id: string | null;
  locks: (ProfileLockDef | null)[] | null;
  name: string | null;
  perks: (PerkReward | null)[] | null;
}
/** CSE.GameplayDefs.CostDef */
export interface CostDef {
  perk: PerkDefRef | null;
  qty: number | null;
}
/** CSE.GameplayDefs.ProfileLockDef */
export interface ProfileLockDef {
  endTime: string | null;
  perk: PerkDefRef | null;
  startTime: string | null;
}
/** CSE.GameplayDefs.PerkReward */
export interface PerkReward {
  perk: PerkDefRef | null;
  qty: number | null;
}
/** CSE.GameplayDefs.QuestDefRef */
export interface QuestDefRef {
  description: string | null;
  displaySubQuests: boolean | null;
  id: string | null;
  links: (QuestLinkDef | null)[] | null;
  name: string | null;
  premiumLock: (ProfileLockDef | null)[] | null;
  previewDate: string | null;
  questLock: (ProfileLockDef | null)[] | null;
  questType: QuestType | null;
  splashImage: string | null;
  subQuests: (QuestDefRef | null)[] | null;
}
/** CSE.GameplayDefs.QuestLinkDef */
export interface QuestLinkDef {
  premiumRewardDescriptionOverride: string | null;
  premiumRewardImageOverride: string | null;
  premiumRewardNameOverride: string | null;
  premiumRewards: (PerkReward | null)[] | null;
  progress: number | null;
  rewardDescriptionOverride: string | null;
  rewardImageOverride: string | null;
  rewardNameOverride: string | null;
  rewards: (PerkReward | null)[] | null;
}
/** ServerLib.GraphQL.Models.RaceGQL */
export interface RaceGQL {
  buildableAbilityNetworks: (string | null)[] | null;
  description: string | null;
  factionID: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
  raceTags: (string | null)[] | null;
}
/** ServerLib.Game.RaceStatBonuses */
export interface RaceStatBonuses {
  race: number | null;
  statBonuses: (StatBonusGQL | null)[] | null;
}
/** CSE.GameplayDefs.RMTPurchaseDefRef */
export interface RMTPurchaseDefRef {
  centCost: number | null;
  description: string | null;
  iconURL: string | null;
  id: number | null;
  locks: (ProfileLockDef | null)[] | null;
  name: string | null;
  perks: (PerkReward | null)[] | null;
}
/** CSE.GameplayDefs.RuneModLevelDisplayDef */
export interface RuneModLevelDisplayDef {
  icon: string | null;
  runeCount: number | null;
}
/** ServerLib.GraphQL.Types.ScenarioDefGQL */
export interface ScenarioDefGQL {
  description: string | null;
  id: string | null;
  loadingBackgroundImage: string | null;
  name: string | null;
  showPlayerProgressionTab: boolean | null;
  summaryBackgroundImage: string | null;
}
/** CSE.GameplayDefs.GameSettingsDef */
export interface GameSettingsDef {
  abilityDescriptionMaxLength: number | null;
  abilityNameMaxLength: number | null;
  abilityNameMinLength: number | null;
  dailyQuestResetsAllowed: number | null;
  hardDailyQuestCount: number | null;
  itemLowQualityThreshold: Decimal | null;
  maxCharacterNameLength: number | null;
  maxEmoteCount: number | null;
  minCharacterNameLength: number | null;
  normalDailyQuestCount: number | null;
  startingAttributePoints: number | null;
  traitsMaxPoints: number | null;
  traitsMinPoints: number | null;
  voxIngredientHardLimit: number | null;
}
/** ServerLib.Game.StatDefinitionGQL */
export interface StatDefinitionGQL {
  addPointsAtCharacterCreation: boolean | null;
  description: string | null;
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
/** ServerLib.GraphQL.MatchmakingStatus */
export interface MatchmakingStatus {
  availability: MatchmakingAvailability | null;
  channelID: ChannelID | null;
  shardID: number | null;
}
/** CU.Databases.Models.Content.PatcherAlert */
export interface PatcherAlert {
  id: string | null;
  message: string | null /** HTML Content for the patcher alert. */;
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
/** ServerLib.ApiModels.SimpleCharacter */
export interface SimpleCharacter {
  archetype: string | null;
  faction: Faction | null;
  gender: string | null;
  id: CharacterID | null;
  lastLogin: string | null;
  name: string | null;
  race: string | null;
  shardID: ShardID | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  patcherAlerts: IPatcherAlertUpdate | null /** Gets updates for patcher alerts */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
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
/** ServerLib.ApiModels.PatcherAlertUpdate */
export interface PatcherAlertUpdate extends IPatcherAlertUpdate {
  alert: PatcherAlert | null;
}
export interface AlertsalertsArgs {
  destination: string | null /** Required: Where the alert will show up. */;
}
export interface PatcherAlertspatcherAlertsArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return. */;
}
export interface PatchNotepatchNoteArgs {
  id: string | null /** Required: ID of the patch note. */;
}
export interface PatchNotespatchNotesArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  channel: number | null /** Required: Channel ID from which to return patch notes. */;
}
export interface ShardCharactersshardCharactersArgs {
  onShard:
    | number
    | null /** If you want to request for a specific shard, use this parameter. Otherwise, will fetch characters on all shards. */;
}
export interface AbilityComponentsabilityComponentsArgs {
  all: boolean | null /** if all the components should be returned, intead of those for this character */;
}
export interface ItemitemArgs {
  itemid: string | null /** The id of the item to look for. (required) */;
}
export interface ShardCharacterUpdatesshardCharacterUpdatesArgs {
  onShard: number | null /** Shard ID of the server you'd like to subscribe to for character updates */;
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
/** CSE.GameplayDefs.AbilityBarKind */
export enum AbilityBarKind {
  Normal = 'Normal',
  SiegeEngine = 'SiegeEngine',
  Other = 'Other',
  COUNT = 'COUNT'
}
/** CSE.GameplayDefs.AbilityComponentCategoryDisplay */
export enum AbilityComponentCategoryDisplay {
  Invalid = 'Invalid',
  Standard = 'Standard',
  Option = 'Option'
}
/** CSE.GameplayDefs.UnitFrameDisplay */
export enum UnitFrameDisplay {
  Hidden = 'Hidden',
  HiddenWhenCurrentValue0 = 'HiddenWhenCurrentValue0',
  Visible = 'Visible'
}
/** CSE.GameplayDefs.Faction */
export enum Faction {
  Factionless = 'Factionless',
  TDD = 'TDD',
  Viking = 'Viking',
  Arthurian = 'Arthurian'
}
/** CSE.GameplayDefs.GearSlotType */
export enum GearSlotType {
  Unknown = 'Unknown',
  Weapon = 'Weapon',
  Armor = 'Armor'
}
/** CSE.GameplayDefs.ItemPlacementType */
export enum ItemPlacementType {
  None = 'None',
  Door = 'Door',
  Plot = 'Plot',
  BuildingFaceSide = 'BuildingFaceSide',
  BuildingFaceBottom = 'BuildingFaceBottom',
  BuildingFaceTop = 'BuildingFaceTop'
}
/** CSE.GameplayDefs.ItemTemplateType */
export enum ItemTemplateType {
  None = 'None',
  TemplateOnly = 'TemplateOnly',
  Entity = 'Entity'
}
/** CSE.GameplayDefs.ZoneType */
export enum ZoneType {
  None = 'None',
  Home = 'Home',
  Builder = 'Builder',
  Contested = 'Contested'
}
/** CSE.GameplayDefs.ItemType */
export enum ItemType {
  Basic = 'Basic',
  Vox = 'Vox',
  Ammo = 'Ammo',
  Armor = 'Armor',
  Weapon = 'Weapon',
  Block = 'Block',
  Alloy = 'Alloy',
  Substance = 'Substance',
  SiegeEngine = 'SiegeEngine',
  Infusion = 'Infusion',
  DragonsWeb = 'DragonsWeb',
  AlchemyContainer = 'AlchemyContainer',
  Solvent = 'Solvent',
  Reagent = 'Reagent',
  ResourceNode = 'ResourceNode',
  HarvestTool = 'HarvestTool',
  PlotDeed = 'PlotDeed',
  Component = 'Component',
  VoxUpgradeModule = 'VoxUpgradeModule'
}
/** CSE.GameplayDefs.ItemStatDisplayType */
export enum ItemStatDisplayType {
  Value = 'Value',
  Percent = 'Percent',
  IconOnly = 'IconOnly'
}
/** CSE.GameplayDefs.NumericItemInstanceStatDefID */
export enum NumericItemInstanceStatDefID {
  None = 'None'
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
  SprintFX = 'SprintFX'
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
/** CSE.GameplayDefs.StatType */
export enum StatType {
  None = 'None',
  Primary = 'Primary',
  Secondary = 'Secondary',
  Derived = 'Derived',
  Hidden = 'Hidden'
}
/** ServerLib.GraphQL.MatchmakingAvailability */
export enum MatchmakingAvailability {
  Offline = 'Offline',
  NoAccess = 'NoAccess',
  Online = 'Online'
}
/** CSEUtilsNET.ChannelID */
export enum ChannelID {
  None = 'None'
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
