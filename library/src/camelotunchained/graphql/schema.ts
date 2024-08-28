/* tslint:disable */

/** CSEUtilsNET.Strings.DisplayInfoDescription */
export type DisplayInfoDescription = any;

/** CSEUtilsNET.Strings.CUDisplayInfoIcon */
export type CUDisplayInfoIcon = any;

/** CSEUtilsNET.Strings.DisplayInfoName */
export type DisplayInfoName = any;

/** CSE.GameplayDefs.Tag */
export type Tag = any;

/** CSE.GameplayDefs.AbilityInstanceID */
export type AbilityInstanceID = any;

/** CSE.GameplayDefs.EntityID */
export type EntityID = any;

/** CSE.CharacterID */
export type CharacterID = any;

/** CSEUtilsNET.NormalizedString */
export type NormalizedString = any;

/** CSE.GameplayDefs.GroupID */
export type GroupID = any;

export type Decimal = any;

/** CU.Groups.InviteCode */
export type InviteCode = any;

/** ShardID */
export type ShardID = any;

/** CU.Groups.TargetID */
export type TargetID = any;

/** CSE.GameplayDefs.ItemInstanceID */
export type ItemInstanceID = any;

/** CU.ItemStackHash */
export type ItemStackHash = any;

/** CU.MatchQueueInstanceID */
export type MatchQueueInstanceID = any;

/** CSE.GameplayDefs.ScenarioInstanceID */
export type ScenarioInstanceID = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CSE.GameplayDefs.RoundInstanceID */
export type RoundInstanceID = any;

/** CSE.GameplayDefs.RoleID */
export type RoleID = any;

/** CSE.GameplayDefs.ScenarioTeamID */
export type ScenarioTeamID = any;

/** CU.Databases.Models.Items.SecureTradeInstanceID */
export type SecureTradeInstanceID = any;

/** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTime = any;

/** The `DateTimeOffset` scalar type represents a date, time and offset from UTC. `DateTimeOffset` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type DateTimeOffset = any;

/** The `Seconds` scalar type represents a period of time represented as the total number of seconds. */
export type Seconds = any;

/** The `Milliseconds` scalar type represents a period of time represented as the total number of milliseconds. */
export type Milliseconds = any;

/** CU.Buildings.BuildingPlotInstanceID */
export type BuildingPlotInstanceID = any;
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
  classID: string | null;
  faction: Faction | null;
  gender: string | null;
  groupID: GroupID | null;
  id: CharacterID | null;
  joined: string | null;
  name: NormalizedString | null;
  parted: string | null;
  permissions: (string | null)[] | null;
  race: string | null;
  rank: string | null;
  shardID: ShardID | null;
}
/** CU.Groups.IWarband */
export interface IWarband {
  order: GroupID | null;
}
/** CU.WebApi.GraphQL.IGraphQLBattlegroup */
export interface IGraphQLBattlegroup {
  battlegroup: Battlegroup | null;
  members: (GroupMemberState | null)[] | null;
}
/** ServerLib.GraphQL.Models.IInteractiveAlert */
export interface IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** CU.WebApi.GraphQL.IGroupUpdate */
export interface IGroupUpdate {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  updateType: GroupUpdateType | null;
}
/** CU.Groups.IGroupNotification */
export interface IGroupNotification {
  characterID: CharacterID | null;
  groupID: GroupID | null;
  groupType: GroupTypes | null;
  type: GroupNotificationType | null;
}
/** ServerLib.GraphQL.Models.ISecureTradeUpdate */
export interface ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
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
  channels: (Channel | null)[] | null /** List all channels. */;
  character: CUCharacter | null /** Get a character by id and shard. */;
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  invite: Invite | null /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
  invites:
    | (Invite | null)[]
    | null /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
  myActiveWarband: GraphQLActiveWarband | null /** A users active warband */;
  myBattlegroup: GraphQLBattlegroup | null /** A users battleground */;
  myCharacter: CUCharacter | null /** Get the character of the currently logged in user. */;
  myEquippedItems: MyEquippedItems | null /** retrieve all the session users equipped items */;
  myInteractiveAlerts: (IInteractiveAlert | null)[] | null /** Alerts */;
  myInventory: MyInventory | null /** Retrieve data about the character's inventory */;
  myOrder: Order | null /** Gets information about the order your character is in, if any. */;
  myPassiveAlerts:
    | (PassiveAlert | null)[]
    | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  myScenarioQueue: MyScenarioQueue | null /** Gets information about available scenarios and their queue status */;
  patcherHero: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  scenariosummary: ScenarioSummaryDBModel | null /** retrieve information about a scenario */;
  secureTrade: SecureTradeStatus | null /** Information about current secure item trade the player is engaged in. */;
  serverBuildNumber: number | null /** Build number for the actively running server */;
  serverTimestamp: string | null /** Retrieve the current time on the server. */;
  shardCharacters:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
  traits: TraitsInfo | null /** Get all possible traits. */;
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
  abilities: (Ability | null)[] | null;
  ability: Ability | null;
  archetype: string | null;
  entityID: EntityID | null;
  faction: Faction | null;
  gender: string | null;
  id: CharacterID | null;
  name: NormalizedString | null;
  order: GroupID | null;
  race: string | null;
  session: SessionStatsField | null;
  stats: (CharacterStatField | null)[] | null;
  traits: (Trait | null)[] | null;
}
/** ServerLib.GraphQL.Models.AbilityGQL */
export interface Ability {
  abilityComponents: (AbilityComponentDefRef | null)[] | null;
  abilityNetwork: AbilityNetworkDef | null;
  description: string | null;
  icon: string | null;
  id: AbilityInstanceID | null;
  name: string | null;
  readOnly: boolean | null;
  tracks: AbilityTracks | null;
}
/** CSE.GameplayDefs.AbilityComponentDefRef */
export interface AbilityComponentDefRef {
  abilityBarKind: AbilityBarKind | null;
  abilityComponentCategory: AbilityComponentCategoryDefRef | null;
  abilityTags: (Tag | null)[] | null;
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
  tag: Tag | null;
}
/** CSE.GameplayDefs.RequireAbilityComponentDef */
export interface RequireAbilityComponentDef {
  component: AbilityComponentDefRef | null;
}
/** CSE.GameplayDefs.RequireTagDef */
export interface RequireTagDef {
  tag: Tag | null;
}
/** CSE.GameplayDefs.AbilityNetworkDef */
export interface AbilityNetworkDef {
  componentCategories: (AbilityComponentCategoryDefRef | null)[] | null;
  display: DisplayInfoDef | null;
  id: string | null;
}
/** ServerLib.SessionStatsField */
export interface SessionStatsField {
  sessionStartDate: string | null;
  sessionStartTicks: Decimal | null;
  skillPartsUsed: (SkillPartsUsedField | null)[] | null;
}
/** ServerLib.SkillPartsUsedField */
export interface SkillPartsUsedField {
  skillPart: AbilityComponentGQL | null;
  timesUsed: number | null;
}
/** ServerLib.AbilityComponentGQL */
export interface AbilityComponentGQL {
  description: string | null;
  icon: string | null;
  id: string | null;
  name: string | null;
}
/** ServerLib.CharacterStatField */
export interface CharacterStatField {
  description: string | null;
  stat: string | null;
  value: Decimal | null;
}
/** CSE.GameplayDefs.Store.Cache.Trait */
export interface Trait {
  category: TraitCategory | null /** Category */;
  description: string | null /** The description of this trait */;
  exclusives: ExclusiveTraitsInfo | null /** List of exclusive traits.  Only one trait from this group may be selected. */;
  icon: string | null /** Url for the icon for this trait */;
  id: string | null;
  isBoon: boolean | null /** If this trait is a boon */;
  name: string | null /** The name of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required: boolean | null /** Whether or not this is a required trait. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** CSE.GameplayDefs.Store.Cache.ExclusiveTraitsInfo */
export interface ExclusiveTraitsInfo {
  ids: (string | null)[] | null;
  maxAllowed: number | null;
  minRequired: number | null;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {}
/** ServerLib.Game.GameDefsGQLData */
export interface GameDefsGQLData {
  abilityComponents:
    | (AbilityComponentDefRef | null)[]
    | null /** All possible ability components for the game or a particular character */;
  abilityNetworks: (AbilityNetworkDef | null)[] | null /** All possible ability networks */;
  baseStatValues: (StatBonusGQL | null)[] | null /** Base stat values which apply to all races */;
  classes: (ClassDefGQL | null)[] | null /** Static information about classes */;
  damageTypes: (DamageTypeDefGQL | null)[] | null /** Static information about damage types */;
  entityResources:
    | (EntityResourceDefinitionGQL | null)[]
    | null /** Array of definitions for all available entity resources */;
  gearSlots: (GearSlot | null)[] | null /** Static information about gear slots */;
  genders: (GenderDefGQL | null)[] | null /** All possible genders */;
  item: ItemDefRef | null /** Static information about a specific item */;
  items: (ItemDefRef | null)[] | null /** Static information about items */;
  itemStats: (ItemStatDefinitionGQL | null)[] | null /** Array of definitions for all available item stats */;
  itemTooltipCategories:
    | (ItemTooltipCategoryDef | null)[]
    | null /** Array of category information for item tooltips */;
  manifests: (ManifestDef | null)[] | null;
  races: (RaceDefGQL | null)[] | null /** Static information about races */;
  raceStatMods:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
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
/** ServerLib.GraphQL.Models.ClassDefGQL */
export interface ClassDefGQL {
  buildableAbilityNetworks: (string | null)[] | null;
  factionID: string | null;
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** ServerLib.GraphQL.Types.DamageTypeDefGQL */
export interface DamageTypeDefGQL {
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
/** ServerLib.GraphQL.Types.GearSlotGQL */
export interface GearSlot {
  gearSlotType: GearSlotType | null /** Which type of slot this is */;
  iconClass: string | null;
  id: string | null /** Unique gear slot identifier */;
  name: string | null;
  numericID: number | null /** Numeric id */;
}
/** ServerLib.GraphQL.Models.GenderDefGQL */
export interface GenderDefGQL {
  id: string | null;
  name: string | null;
  numericID: number | null;
}
/** CSE.GameplayDefs.ItemDefRef */
export interface ItemDefRef {
  defaultResourceID: string | null;
  description: string | null /** Description of the item */;
  equipRequirements: string | null;
  gearSlotSets: (GearSlotSet | null)[] | null /** the sets of gear slots this item can be equipped to */;
  iconUrl: string | null /** URL to the item's icon */;
  id: string | null /** Unique item identifier */;
  isDeployable: boolean | null;
  isStackableItem: boolean | null;
  itemType: ItemType | null;
  name: string | null /** Name of the item */;
  numericItemDefID: number | null;
  tags: (Tag | null)[] | null /** Tags on this item, these can be referenced by recipes */;
}
/** CSE.GameplayDefs.GearSlotSet */
export interface GearSlotSet {
  gearSlots:
    | (string | null)[]
    | null /** A list of gear slots which makes up a valid set of places a item can be equipped on at once. */;
}
/** ServerLib.Game.ItemStatDefinitionGQL */
export interface ItemStatDefinitionGQL {
  category: string | null;
  description: string | null;
  displayPrecision: number | null;
  displayType: StatDisplayType | null;
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
/** ServerLib.GraphQL.Types.ManifestDefGQL */
export interface ManifestDef {
  contents: string | null;
  id: string | null;
  schemaVersion: number | null;
}
/** ServerLib.GraphQL.Models.RaceDefGQL */
export interface RaceDefGQL {
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
  abilityDescriptionMaxLength: number | null;
  abilityNameMaxLength: number | null;
  abilityNameMinLength: number | null;
  inventoryCapacityBase: number | null;
  itemLowQualityThreshold: Decimal | null;
  maxCharacterNameLength: number | null;
  minCharacterNameLength: number | null;
  startingAttributePoints: number | null;
  traitsMaxPoints: number | null;
  traitsMinPoints: number | null;
  voxIngredientHardLimit: number | null;
  woundStatusTag: Tag | null;
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
/** CU.Groups.Invite */
export interface Invite {
  code: InviteCode | null;
  created: string | null;
  durationTicks: number | null;
  forGroup: GroupID | null;
  forGroupName: string | null;
  forGroupType: GroupTypes | null;
  fromName: string | null;
  maxUses: number | null;
  shard: ShardID | null;
  status: InviteStatus | null;
  targetsID128: TargetID | null;
  uses: number | null;
}
/** CU.WebApi.GraphQL.GraphQLActiveWarband */
export interface GraphQLActiveWarband extends IGraphQLActiveWarband {
  info: ActiveWarband | null;
  members: (GroupMemberState | null)[] | null;
}
/** CU.Groups.ActiveWarband */
export interface ActiveWarband extends IGroup, IWarband {
  battlegroup: GroupID | null;
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
  order: GroupID | null;
  shard: ShardID | null;
}
/** CU.WebApi.GraphQL.GroupMemberState */
export interface GroupMemberState {
  canInvite: boolean | null;
  canKick: boolean | null;
  characterID: string | null;
  classID: string | null;
  displayOrder: number | null;
  entityID: string | null;
  faction: Faction | null;
  gender: string | null;
  isAlive: boolean | null;
  isLeader: boolean | null;
  isReady: boolean | null;
  name: string | null;
  position: Vec3f | null;
  race: string | null;
  rankLevel: number | null;
  resources: (GroupMemberResource | null)[] | null;
  statuses: (GroupMemberStatus | null)[] | null;
  type: string | null;
  warbandID: string | null;
}
/** Vec3f */
export interface Vec3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** CU.WebApi.GraphQL.GroupMemberResource */
export interface GroupMemberResource {
  current: Decimal | null;
  id: string | null;
  max: Decimal | null;
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
/** CU.WebApi.GraphQL.GraphQLBattlegroup */
export interface GraphQLBattlegroup extends IGraphQLBattlegroup {
  battlegroup: Battlegroup | null;
  members: (GroupMemberState | null)[] | null;
}
/** CU.Groups.Battlegroup */
export interface Battlegroup extends IGroup {
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
  warbands: (GroupID | null)[] | null;
}
/** ServerLib.Items.MyEquippedItems */
export interface MyEquippedItems {
  armorClass: Decimal | null;
  itemCount: number | null;
  items: (EquippedItem | null)[] | null;
  readiedGearSlots: (string | null)[] | null;
  resistances: (StatGQL | null)[] | null;
}
/** World.EquippedItem */
export interface EquippedItem {
  gearSlots: (string | null)[] | null /** the list of all the gear slots the item is in */;
  item: Item | null /** The item that is equipped */;
}
/** World.Item */
export interface Item {
  actions: (ItemActionDefGQL | null)[] | null;
  containerColor: ColorRGBA | null /** the UI color for the container UI */;
  containerDrawers: (ContainerDrawerGQL | null)[] | null;
  debugname: string | null /** name of the item which includes some basic item information */;
  id: ItemInstanceID | null /** Unique instance ID for item. */;
  location: ItemLocationDescription | null /** details about the location of the item */;
  permissibleHolder: FlagsPermissibleHolderGQL | null;
  resourceList: (ItemResourceGQL | null)[] | null;
  stackHash: ItemStackHash | null /** Identifies items that are of the same type and have the same stats. */;
  staticDefinition: ItemDefRef | null /** The definition for the item. */;
  statList: (StatGQL | null)[] | null;
  stats: (ItemStatSetGQL | null)[] | null /** stats of this item */;
}
/** World.ItemActionDefGQL */
export interface ItemActionDefGQL {
  cooldownSeconds: Decimal | null;
  disabledDescription: string | null;
  enabled: boolean | null;
  id: string | null;
  interactionPointFilter: (BoneAlias | null)[] | null;
  lastTimePerformed: string | null;
  name: string | null;
  showWhenDisabled: boolean | null;
  uIReaction: ItemActionUIReaction | null;
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
/** ServerLib.ContainerDrawerGQL */
export interface ContainerDrawerGQL {
  containedItems: (Item | null)[] | null;
  maxItemPositions: number | null;
  requirements: RequirementDefRef | null;
}
/** CSE.GameplayDefs.RequirementDefRef */
export interface RequirementDefRef {
  description: string | null;
  icon: string | null;
  id: string | null;
}
/** World.Items.ItemLocationDescription */
export interface ItemLocationDescription {
  equipped: EquippedLocation | null /** Location filled if this item is equipped */;
  inContainer: InContainerLocation | null /** Location filled if this item is in a container */;
  inventory: InventoryLocation | null /** Location filled if this item is in a player's inventory */;
}
/** World.EquippedLocation */
export interface EquippedLocation {
  characterID: CharacterID | null /** The character the item is equipped on */;
  gearSlotSetIndex: number | null;
}
/** World.InContainerLocation */
export interface InContainerLocation {
  containerInstanceID: ItemInstanceID | null /** The item ID of the container this item is in */;
  drawerIndex: number | null /** The drawer this item is in */;
  position: number | null /** The UI position of the item */;
}
/** World.InventoryLocation */
export interface InventoryLocation {
  characterID: CharacterID | null /** The character that has this item in their inventory */;
  position: number | null /** The position of the item in inventory */;
}
/** World.FlagsPermissibleHolderGQL */
export interface FlagsPermissibleHolderGQL {
  noActiveSetsPermissions: FlagsPermissibleGQL | null;
  permissibleSets: (FlagsPermissibleSetGQL | null)[] | null;
  userGrants: (FlagsPermissibleGrantGQL | null)[] | null;
  userPermissions: number | null;
}
/** World.FlagsPermissibleGQL */
export interface FlagsPermissibleGQL {
  grants: (FlagsPermissibleGrantGQL | null)[] | null;
  permissions: number | null;
  target: PermissibleTargetGQL | null;
}
/** World.FlagsPermissibleGrantGQL */
export interface FlagsPermissibleGrantGQL {
  grantPermissions: number | null;
  grants: (FlagsPermissibleGrantGQL | null)[] | null;
  permissions: number | null;
  target: PermissibleTargetGQL | null;
}
/** World.PermissibleTargetGQL */
export interface PermissibleTargetGQL {
  characterName: string | null;
  description: string | null;
  targetType: PermissibleTargetType | null;
}
/** World.FlagsPermissibleSetGQL */
export interface FlagsPermissibleSetGQL {
  isActive: boolean | null;
  keyDescription: string | null;
  keyType: PermissibleSetKeyType | null;
  permissibles: (FlagsPermissibleGQL | null)[] | null;
  userMatchesKey: boolean | null;
}
/** World.Items.ItemResourceGQL */
export interface ItemResourceGQL {
  currentValue: Decimal | null;
  id: string | null;
  lastUpdateTime: Decimal | null;
  maxValue: Decimal | null;
  regen: Decimal | null;
}
/** World.Items.StatGQL */
export interface StatGQL {
  statID: string | null;
  value: Decimal | null;
}
/** World.Items.ItemStatSetGQL */
export interface ItemStatSetGQL {
  id: string | null;
  stats: (StatGQL | null)[] | null;
}
/** ServerLib.Items.MyInventory */
export interface MyInventory {
  itemCount: number | null;
  items: (Item | null)[] | null;
  nestedItemCount: number | null;
}
/** CU.Groups.Order */
export interface Order extends IGroup {
  created: string | null;
  disbanded: string | null;
  faction: Faction | null;
  formerMembers: (IGroupMember | null)[] | null;
  groupType: GroupTypes | null;
  id: GroupID | null;
  maxRankCount: number | null;
  memberCount: number | null;
  members: (IGroupMember | null)[] | null;
  membersAsString: (string | null)[] | null;
  name: NormalizedString | null;
  shard: ShardID | null;
}
/** CU.WebApi.GraphQL.PassiveAlert */
export interface PassiveAlert {
  message: string | null;
  targetID: CharacterID | null;
}
/** CU.WebApi.GraphQL.Legacy.MyScenarioQueue */
export interface MyScenarioQueue {
  availableMatches: (ScenarioMatch | null)[] | null;
}
/** CU.WebApi.GraphQL.Legacy.ScenarioMatch */
export interface ScenarioMatch {
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
  factionless: number | null /** Factionless */;
  tdd: number | null /** TDD */;
  viking: number | null /** Viking */;
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
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel */
export interface ScenarioSummaryDBModel {
  creatorAdminID: CharacterID | null;
  endTime: string | null;
  resolution: ScenarioResolution | null;
  rounds: (RoundOutcome | null)[] | null;
  scenarioInstanceID: ScenarioInstanceID | null;
  shardID: ShardID | null;
  startTime: string | null;
  teamOutcomes:
    | (TeamOutcomeScenarioField | null)[]
    | null /** details for what the each team did for the whole scenario */;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+RoundOutcome */
export interface RoundOutcome {
  adminID: CharacterID | null;
  endTime: string | null;
  myRoundOutcome: CharacterOutcomeDBModel | null /** details for what the caller did during this round */;
  resolution: ScenarioResolution | null;
  roundIndex: number | null;
  roundInstanceID: RoundInstanceID | null;
  startTime: string | null;
  teamOutcomes: (TeamOutcomeRound | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+CharacterOutcomeDBModel */
export interface CharacterOutcomeDBModel {
  characterType: ProgressionCharacterType | null;
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  displayName: string | null;
  score: number | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel */
export interface CraftingSummaryDBModel {
  alchemySummary: JobSummaryDBModel | null;
  purifySummary: JobSummaryDBModel | null;
  recipeSummary: JobSummaryDBModel | null;
  repairSummary: JobSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel+JobSummaryDBModel */
export interface JobSummaryDBModel {
  canceled: number | null;
  collected: number | null;
  started: number | null;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel */
export interface DamageSummaryDBModel {
  createCount: CountPerTargetTypeDBModel | null;
  damageApplied: CountPerTargetTypeDBModel | null;
  damageReceived: CountPerTargetTypeDBModel | null;
  deathCount: CountPerTargetTypeDBModel | null;
  healingApplied: CountPerTargetTypeDBModel | null;
  healingReceived: CountPerTargetTypeDBModel | null;
  killAssistCount: CountPerTargetTypeDBModel | null;
  killCount: CountPerTargetTypeDBModel | null;
  perCharacterClass: (DataPerCharacterClassDBModel | null)[] | null;
  woundsApplied: CountPerTargetTypeDBModel | null;
  woundsHealedApplied: CountPerTargetTypeDBModel | null;
  woundsHealedReceived: CountPerTargetTypeDBModel | null;
  woundsReceived: CountPerTargetTypeDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CountPerTargetTypeDBModel */
export interface CountPerTargetTypeDBModel {
  anyCharacter: number | null;
  building: number | null;
  item: number | null;
  nonPlayerCharacter: number | null;
  playerCharacter: number | null;
  resourceNode: number | null;
  self: number | null;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel+DataPerCharacterClassDBModel */
export interface DataPerCharacterClassDBModel {
  characterClass: string | null;
  killAssistCount: number | null;
  killCount: number | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeRound */
export interface TeamOutcomeRound {
  damageSummary: DamageSummaryDBModel | null /** damage summary sum across all participants in this round */;
  outcome: ScenarioOutcome | null;
  participantCount: number | null /** how many characters participated in this round */;
  participants: (CharacterOutcomeDBModel | null)[] | null;
  role: RoleID | null;
  score: number | null;
  teamID: ScenarioTeamID | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenarioField */
export interface TeamOutcomeScenarioField {
  outcome: ScenarioOutcome | null;
  participants: (CharacterOutcomeDBModel | null)[] | null;
  teamID: ScenarioTeamID | null;
}
/** ServerLib.Items.SecureTradeStatus */
export interface SecureTradeStatus {
  myItems: (Item | null)[] | null /** The items you've added to the trade */;
  myState: SecureTradeState | null /** The state of the trade, from your perspective */;
  theirEntityID: EntityID | null /** The entity ID of who is being traded with */;
  theirItems: (Item | null)[] | null /** The items you will get from this trade */;
  theirState: SecureTradeState | null /** The state of the trade, from the perspective of the entity you are trading with */;
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
/** CSE.GameplayDefs.Store.Cache.TraitsInfo */
export interface TraitsInfo {
  maxAllowed: number | null;
  minRequired: number | null;
  traits: (Trait | null)[] | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  activeGroupUpdates: IGroupUpdate | null /** Updates to a group member in an active group */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  interactiveAlerts: IInteractiveAlert | null /** Alerts */;
  manifestUpdates: ManifestUpdate | null /** Updates to a manifest */;
  myGroupNotifications: IGroupNotification | null /** Group related notifications for your specific character. Tells you when you joined a group, etc. */;
  myInventoryItems: Item | null /** Real-time updates for inventory items */;
  notifications: Notification | null /** Status or event broadcasts identified by purpose */;
  passiveAlerts: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  secureTradeUpdates: ISecureTradeUpdate | null /** Updates to a secure trade */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
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
/** CU.Groups.CustomRank */
export interface CustomRank {
  groupID: GroupID | null;
  level: number | null;
  name: string | null;
  permissions: (PermissionInfo | null)[] | null;
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
/** CU.Groups.Warband */
export interface Warband extends IGroup, IWarband {
  banner: string | null;
  created: string | null;
  disbanded: string | null;
  faction: Faction | null;
  formerActiveMembers: (IGroupMember | null)[] | null;
  formerMembers: (IGroupMember | null)[] | null;
  groupType: GroupTypes | null;
  id: GroupID | null;
  isPermanent: boolean | null;
  maxMemberCount: number | null;
  maxRankCount: number | null;
  memberCount: number | null;
  members: (IGroupMember | null)[] | null;
  membersAsString: (string | null)[] | null;
  name: NormalizedString | null;
  order: GroupID | null;
  shard: ShardID | null;
}
/** CU.GraphQL.Euler3fGQL */
export interface Euler3f {
  pitch: Decimal | null;
  roll: Decimal | null;
  yaw: Decimal | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenario */
export interface TeamOutcomeScenario {
  outcome: ScenarioOutcome | null;
  teamID: ScenarioTeamID | null;
}
/** CSE.GameplayDefs.StatusStackingDef */
export interface StatusStackingDef {
  group: string | null;
  removalOrder: StatusRemovalOrder | null;
  statusDurationModType: StatusDurationModification | null;
}
/** World.BuildingPlotResult */
export interface BuildingPlotResult {
  buildingPlacedItemsCount: number | null;
  capturingFaction: Faction | null;
  contestedState: PlotContestedState | null;
  currentCaptureScore: Decimal | null;
  entityID: EntityID | null;
  faction: Faction | null;
  instanceID: BuildingPlotInstanceID | null;
  maxBlocks: number | null;
  ownedByName: string | null;
  permissibleKeyType: PermissibleSetKeyType | null;
  permissions: FlagsPermissibleHolderGQL | null;
  position: Vec3f | null;
  scoreToCapture: Decimal | null;
  size: Vec3f | null;
}
/** World.SecureTradeLocation */
export interface SecureTradeLocation {
  characterID: CharacterID | null /** The character that currently owns this item */;
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
/** ServerLib.GraphQL.Models.TradeAlert */
export interface TradeAlert extends IInteractiveAlert {
  category: AlertCategory | null;
  kind: TradeAlertKind | null;
  otherEntityID: EntityID | null;
  otherName: string | null;
  secureTradeID: SecureTradeInstanceID | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** ServerLib.GraphQL.Models.ProgressionAlert */
export interface ProgressionAlert extends IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** ServerLib.GraphQL.Models.SecureTradeCompletedUpdate */
export interface SecureTradeCompletedUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  reason: SecureTradeDoneReason | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.Models.SecureTradeStateUpdate */
export interface SecureTradeStateUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  otherEntityState: SecureTradeState | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.Models.SecureTradeItemUpdate */
export interface SecureTradeItemUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  otherEntityItems: (Item | null)[] | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
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
/** ServerLib.ApiModels.SpawnPoint */
export interface SpawnPoint {
  faction: Faction | null;
  id: string | null;
  position: Vec3f | null;
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
/** CU.WebApi.GraphQL.UnusedStructure */
export interface UnusedStructure {
  unused: boolean | null;
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
  forGroup: string | null /** ID of group from which invites are sent for. (optional) */;
  toGroup: string | null /** ID of group to which invites are sent to. (optional) */;
  toCharacter: string | null /** ID of character to which invites are sent to. (optional) */;
  includeInactive: boolean | null /** Should the response include inactive invites? */;
}
export interface MyEquippedItemsmyEquippedItemsArgs {
  allowOfflineItems:
    | boolean
    | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
}
export interface MyInventorymyInventoryArgs {
  allowOfflineItems:
    | boolean
    | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
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
export interface ScenariosummaryscenariosummaryArgs {
  id: string | null /** Scenario Instance ID. (required) */;
  shard: number | null /** The id of the shard to request data from. */;
}
export interface ShardCharactersshardCharactersArgs {
  onShard:
    | number
    | null /** If you want to request for a specific shard, use this parameter. Otherwise, will fetch characters on all shards. */;
}
export interface AbilityabilityArgs {
  id: number | null /** ID of the ability. */;
}
export interface AbilityComponentsabilityComponentsArgs {
  all: boolean | null /** if all the components should be returned, intead of those for this character */;
}
export interface ItemitemArgs {
  itemid: string | null /** The id of the item to look for. (required) */;
}
export interface NotificationsnotificationsArgs {
  tags: (string | null)[] | null /** Strings to match for this subscription */;
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
/** CSE.GameplayDefs.AbilityTracks */
export enum AbilityTracks {
  None = 'None',
  PrimaryWeapon = 'PrimaryWeapon',
  First = 'First',
  SecondaryWeapon = 'SecondaryWeapon',
  BothWeapons = 'BothWeapons',
  Voice = 'Voice',
  Last = 'Last',
  Mind = 'Mind',
  ErrorFlag = 'ErrorFlag',
  All = 'All'
}
/** CSE.GameplayDefs.Faction */
export enum Faction {
  Factionless = 'Factionless',
  TDD = 'TDD',
  Viking = 'Viking',
  Arthurian = 'Arthurian'
}
/** CSE.GameplayDefs.Store.Cache.TraitCategory */
export enum TraitCategory {
  General = 'General',
  Faction = 'Faction',
  Race = 'Race',
  Class = 'Class'
}
/** CSE.GameplayDefs.UnitFrameDisplay */
export enum UnitFrameDisplay {
  Hidden = 'Hidden',
  HiddenWhenCurrentValue0 = 'HiddenWhenCurrentValue0',
  Visible = 'Visible'
}
/** CSE.GameplayDefs.GearSlotType */
export enum GearSlotType {
  Unknown = 'Unknown',
  Weapon = 'Weapon',
  Armor = 'Armor'
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
/** CSE.GameplayDefs.StatDisplayType */
export enum StatDisplayType {
  Value = 'Value',
  Percent = 'Percent',
  IconOnly = 'IconOnly'
}
/** CSE.GameplayDefs.NumericItemInstanceStatDefID */
export enum NumericItemInstanceStatDefID {
  None = 'None'
}
/** CSE.GameplayDefs.StatType */
export enum StatType {
  None = 'None',
  Primary = 'Primary',
  Secondary = 'Secondary',
  Derived = 'Derived',
  Hidden = 'Hidden'
}
/** CSE.GameplayDefs.GroupTypes */
export enum GroupTypes {
  Warband = 'Warband',
  Battlegroup = 'Battlegroup',
  Order = 'Order',
  Campaign = 'Campaign'
}
/** CU.Groups.InviteStatus */
export enum InviteStatus {
  Active = 'Active',
  Revoked = 'Revoked',
  UsageLimitReached = 'UsageLimitReached',
  Expired = 'Expired'
}
/** CSE.GameplayDefs.BoneAlias */
export enum BoneAlias {
  Unknown = 'Unknown',
  BodyPelvis = 'BodyPelvis',
  Attachment1 = 'Attachment1',
  Attachment2 = 'Attachment2',
  Attachment3 = 'Attachment3',
  Attachment4 = 'Attachment4',
  Attachment5 = 'Attachment5',
  Attachment6 = 'Attachment6',
  Attachment7 = 'Attachment7',
  SpineSacral = 'SpineSacral',
  SpineLumbar = 'SpineLumbar',
  SpineThoracic = 'SpineThoracic',
  SpineCervical = 'SpineCervical',
  BodyTorso = 'BodyTorso',
  BodyNeck = 'BodyNeck',
  BodyHead = 'BodyHead',
  HairScalp = 'HairScalp',
  HairBody = 'HairBody',
  HairEnd = 'HairEnd',
  TailBase = 'TailBase',
  TailMiddle = 'TailMiddle',
  TailEnd = 'TailEnd',
  ArmLeftClavical = 'ArmLeftClavical',
  ArmLeftPauldron = 'ArmLeftPauldron',
  ArmLeftHumerus = 'ArmLeftHumerus',
  ArmLeftElbow = 'ArmLeftElbow',
  ArmLeftUlna = 'ArmLeftUlna',
  HandLeftPalm = 'HandLeftPalm',
  HandLeftThumbProximal = 'HandLeftThumbProximal',
  HandLeftThumbMiddle = 'HandLeftThumbMiddle',
  HandLeftThumbPhalanx = 'HandLeftThumbPhalanx',
  HandLeftIndexFingerProximal = 'HandLeftIndexFingerProximal',
  HandLeftIndexFingerMiddle = 'HandLeftIndexFingerMiddle',
  HandLeftIndexFingerPhalanx = 'HandLeftIndexFingerPhalanx',
  HandLeftMiddleFingerProximal = 'HandLeftMiddleFingerProximal',
  HandLeftMiddleFingerMiddle = 'HandLeftMiddleFingerMiddle',
  HandLeftMiddleFingerPhalanx = 'HandLeftMiddleFingerPhalanx',
  HandLeftRingFingerProximal = 'HandLeftRingFingerProximal',
  HandLeftRingFingerMiddle = 'HandLeftRingFingerMiddle',
  HandLeftRingFingerPhalanx = 'HandLeftRingFingerPhalanx',
  HandLeftPinkyProximal = 'HandLeftPinkyProximal',
  HandLeftPinkyMiddle = 'HandLeftPinkyMiddle',
  HandLeftPinkyPhalanx = 'HandLeftPinkyPhalanx',
  ArmRightClavical = 'ArmRightClavical',
  ArmRightPauldron = 'ArmRightPauldron',
  ArmRightHumerus = 'ArmRightHumerus',
  ArmRightElbow = 'ArmRightElbow',
  ArmRightUlna = 'ArmRightUlna',
  HandRightPalm = 'HandRightPalm',
  HandRightThumbProximal = 'HandRightThumbProximal',
  HandRightThumbMiddle = 'HandRightThumbMiddle',
  HandRightThumbPhalanx = 'HandRightThumbPhalanx',
  HandRightIndexFingerProximal = 'HandRightIndexFingerProximal',
  HandRightIndexFingerMiddle = 'HandRightIndexFingerMiddle',
  HandRightIndexFingerPhalanx = 'HandRightIndexFingerPhalanx',
  HandRightMiddleFingerProximal = 'HandRightMiddleFingerProximal',
  HandRightMiddleFingerMiddle = 'HandRightMiddleFingerMiddle',
  HandRightMiddleFingerPhalanx = 'HandRightMiddleFingerPhalanx',
  HandRightRingFingerProximal = 'HandRightRingFingerProximal',
  HandRightRingFingerMiddle = 'HandRightRingFingerMiddle',
  HandRightRingFingerPhalanx = 'HandRightRingFingerPhalanx',
  HandRightPinkyProximal = 'HandRightPinkyProximal',
  HandRightPinkyMiddle = 'HandRightPinkyMiddle',
  HandRightPinkyPhalanx = 'HandRightPinkyPhalanx',
  TabardLower = 'TabardLower',
  TabardUpper = 'TabardUpper',
  CapeTop = 'CapeTop',
  CapeUpperMiddle = 'CapeUpperMiddle',
  CapeLowerMiddle = 'CapeLowerMiddle',
  CapeEnd = 'CapeEnd',
  CapeLeftTail = 'CapeLeftTail',
  CapeRightTail = 'CapeRightTail',
  LegLeftThigh = 'LegLeftThigh',
  LegLeftCalf = 'LegLeftCalf',
  FootLeftAnkle = 'FootLeftAnkle',
  FootLeftToes = 'FootLeftToes',
  LegRightThigh = 'LegRightThigh',
  LegRightCalf = 'LegRightCalf',
  FootRightAnkle = 'FootRightAnkle',
  FootRightToes = 'FootRightToes',
  SkirtBackUpper = 'SkirtBackUpper',
  SkirtBackMiddle = 'SkirtBackMiddle',
  SkirtBackLower = 'SkirtBackLower',
  SkirtFrontUpper = 'SkirtFrontUpper',
  SkirtFrontMiddle = 'SkirtFrontMiddle',
  SkirtFrontLower = 'SkirtFrontLower',
  SkirtLeftUpper = 'SkirtLeftUpper',
  SkirtLeftMiddle = 'SkirtLeftMiddle',
  SkirtLeftLower = 'SkirtLeftLower',
  SkirtRightUpper = 'SkirtRightUpper',
  SkirtRightMiddle = 'SkirtRightMiddle',
  SkirtRightLower = 'SkirtRightLower',
  TassetLeftUpper = 'TassetLeftUpper',
  TassetLeftLower = 'TassetLeftLower',
  TassetRightUpper = 'TassetRightUpper',
  TassetRightLower = 'TassetRightLower',
  WingRoot = 'WingRoot',
  WingLeftBase = 'WingLeftBase',
  WingLeftMiddle = 'WingLeftMiddle',
  WingLeftTip = 'WingLeftTip',
  WingRightBase = 'WingRightBase',
  WingRightMiddle = 'WingRightMiddle',
  WingRightTip = 'WingRightTip',
  SiegeRotate = 'SiegeRotate',
  SiegePitch = 'SiegePitch',
  SiegeCharacterCenter = 'SiegeCharacterCenter',
  SiegeCharacterCenter2 = 'SiegeCharacterCenter2',
  SiegeCharacterCenter3 = 'SiegeCharacterCenter3',
  SiegeCharacterCenter4 = 'SiegeCharacterCenter4',
  SiegeCharacterCenter5 = 'SiegeCharacterCenter5',
  SiegeCharacterCenter6 = 'SiegeCharacterCenter6',
  SiegeCharacterCenter7 = 'SiegeCharacterCenter7',
  SiegeCharacterCenter8 = 'SiegeCharacterCenter8',
  Hinge1 = 'Hinge1',
  Hinge2 = 'Hinge2',
  CollisionAttach1 = 'CollisionAttach1',
  CollisionAttach2 = 'CollisionAttach2',
  CollisionAttach3 = 'CollisionAttach3',
  CollisionAttach4 = 'CollisionAttach4',
  BuildingAttachWall = 'BuildingAttachWall',
  BuildingAttachCeiling = 'BuildingAttachCeiling',
  TrailSlashStart01 = 'TrailSlashStart01',
  TrailSlashEnd01 = 'TrailSlashEnd01',
  TrailSlashStart02 = 'TrailSlashStart02',
  TrailSlashEnd02 = 'TrailSlashEnd02',
  TrailPierceStart01 = 'TrailPierceStart01',
  TrailPierceEnd01 = 'TrailPierceEnd01',
  TrailPierceStart02 = 'TrailPierceStart02',
  TrailPierceEnd02 = 'TrailPierceEnd02',
  TrailCrushStart01 = 'TrailCrushStart01',
  TrailCrushEnd01 = 'TrailCrushEnd01',
  TrailCrushStart02 = 'TrailCrushStart02',
  TrailCrushEnd02 = 'TrailCrushEnd02',
  TrailGripStart01 = 'TrailGripStart01',
  TrailGripEnd01 = 'TrailGripEnd01',
  TrailShaftStart01 = 'TrailShaftStart01',
  TrailShaftEnd01 = 'TrailShaftEnd01',
  TrailMotionStart = 'TrailMotionStart',
  TrailMotionEnd = 'TrailMotionEnd',
  PointStringTop = 'PointStringTop',
  PointStringBottom = 'PointStringBottom',
  PointKnock = 'PointKnock',
  PointPommel01 = 'PointPommel01',
  PointVfx01 = 'PointVfx01',
  PointVfxCenter01 = 'PointVfxCenter01',
  PointVfxRadius01 = 'PointVfxRadius01',
  PointFocusSource = 'PointFocusSource',
  GameplayCameraFocus = 'GameplayCameraFocus',
  GameplayProjectileOrigin = 'GameplayProjectileOrigin'
}
/** CSE.GameplayDefs.ItemActionUIReaction */
export enum ItemActionUIReaction {
  None = 'None',
  CloseInventory = 'CloseInventory',
  PlacementMode = 'PlacementMode',
  OpenMiniMap = 'OpenMiniMap',
  OpenCraftingUI = 'OpenCraftingUI'
}
/** CSE.GameplayDefs.PermissibleTargetType */
export enum PermissibleTargetType {
  Invalid = 'Invalid',
  Any = 'Any',
  Faction = 'Faction',
  Character = 'Character',
  ScenarioTeam = 'ScenarioTeam',
  Warband = 'Warband',
  CharactersWarband = 'CharactersWarband',
  CharactersFaction = 'CharactersFaction',
  CharactersOrder = 'CharactersOrder',
  InNoScenario = 'InNoScenario',
  Inverse = 'Inverse',
  And = 'And',
  ScenarioRole = 'ScenarioRole',
  Scenario = 'Scenario',
  Account = 'Account'
}
/** CSE.GameplayDefs.PermissibleSetKeyType */
export enum PermissibleSetKeyType {
  Invalid = 'Invalid',
  Faction = 'Faction',
  ScenarioTeam = 'ScenarioTeam',
  ScenarioRole = 'ScenarioRole',
  Scenario = 'Scenario'
}
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  Trade = 'Trade',
  Group = 'Group',
  Progression = 'Progression'
}
/** CSE.GameplayDefs.ScenarioResolution */
export enum ScenarioResolution {
  Started = 'Started',
  Finished = 'Finished',
  Restarted = 'Restarted',
  Killed = 'Killed'
}
/** CSE.GameplayDefs.ProgressionCharacterType */
export enum ProgressionCharacterType {
  Unknown = 'Unknown',
  PlayerCharacter = 'PlayerCharacter',
  NonPlayerCharacter = 'NonPlayerCharacter'
}
/** CU.Databases.Models.Progression.Events.ScenarioOutcome */
export enum ScenarioOutcome {
  Invalid = 'Invalid',
  Win = 'Win',
  Lose = 'Lose',
  Draw = 'Draw',
  Killed = 'Killed',
  Restart = 'Restart'
}
/** World.SecureTradeState */
export enum SecureTradeState {
  None = 'None',
  Invited = 'Invited',
  ModifyingItems = 'ModifyingItems',
  Locked = 'Locked',
  Confirmed = 'Confirmed'
}
/** CU.WebApi.GraphQL.GroupUpdateType */
export enum GroupUpdateType {
  None = 'None',
  MemberJoined = 'MemberJoined',
  MemberUpdate = 'MemberUpdate',
  MemberRemoved = 'MemberRemoved'
}
/** CU.Groups.GroupNotificationType */
export enum GroupNotificationType {
  None = 'None',
  Joined = 'Joined',
  Removed = 'Removed'
}
/** CSE.Notifications.ContentFlags */
export enum ContentFlags {
  None = 'None',
  Revoke = 'Revoke',
  Template = 'Template',
  Localized = 'Localized',
  Markup = 'Markup'
}
/** ServerLib.GraphQL.Models.SecureTradeUpdateCategory */
export enum SecureTradeUpdateCategory {
  None = 'None',
  Complete = 'Complete',
  StateUpdate = 'StateUpdate',
  ItemUpdate = 'ItemUpdate'
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
/** World.BuildingPlotResult+PlotContestedState */
export enum PlotContestedState {
  Invalid = 'Invalid',
  Contested = 'Contested',
  NonContested = 'NonContested',
  ChangingControl = 'ChangingControl'
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
/** ServerLib.GraphQL.Models.GroupAlertKind */
export enum GroupAlertKind {
  WarbandInvite = 'WarbandInvite',
  BattlegroupInvite = 'BattlegroupInvite',
  OrderInvite = 'OrderInvite',
  CampaignInvite = 'CampaignInvite'
}
/** ServerLib.GraphQL.Models.TradeAlertKind */
export enum TradeAlertKind {
  None = 'None',
  NewInvite = 'NewInvite',
  InviteRevoked = 'InviteRevoked',
  InviteAccepted = 'InviteAccepted',
  InviteDeclined = 'InviteDeclined'
}
/** ServerLib.GraphQL.Models.SecureTradeDoneReason */
export enum SecureTradeDoneReason {
  None = 'None',
  Completed = 'Completed',
  Canceled = 'Canceled'
}
