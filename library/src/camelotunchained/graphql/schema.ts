/* tslint:disable */

/** CSEUtilsNET.Strings.DisplayInfoDescription */
export type DisplayInfoDescription = any;

/** CSEUtilsNET.Strings.CUDisplayInfoIcon */
export type CUDisplayInfoIcon = any;

/** CSEUtilsNET.Strings.DisplayInfoName */
export type DisplayInfoName = any;

/** CSE.GameplayDefs.Tags.GameplayTag */
export type GameplayTag = any;

/** CSE.GameplayDefs.AbilityInstanceID */
export type AbilityInstanceID = any;

/** CSE.GameplayDefs.EntityID */
export type EntityID = any;

/** CSE.GameplayDefs.CharacterID */
export type CharacterID = any;

export type Decimal = any;

/** CSEUtilsNET.NormalizedString */
export type NormalizedString = any;

/** CSE.GameplayDefs.GroupID */
export type GroupID = any;

/** VoxJobInstanceID */
export type VoxJobInstanceID = any;

/** CSE.GameplayDefs.ContainerDrawerID */
export type ContainerDrawerID = any;

/** CSE.GameplayDefs.ItemInstanceID */
export type ItemInstanceID = any;

/** CU.Buildings.BuildingPlotInstanceID */
export type BuildingPlotInstanceID = any;

/** CSE.GameplayDefs.ScenarioInstanceID */
export type ScenarioInstanceID = any;

/** ShardID */
export type ShardID = any;

/** CU.ItemStackHash */
export type ItemStackHash = any;

/** VoxNotesInstanceID */
export type VoxNotesInstanceID = any;

/** CU.Groups.InviteCode */
export type InviteCode = any;

/** CU.Groups.TargetID */
export type TargetID = any;

/** CSE.GameplayDefs.ScenarioTeamID */
export type ScenarioTeamID = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CSE.GameplayDefs.ItemQuality */
export type ItemQuality = any;

/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryInstanceID */
export type CharacterDaySummaryInstanceID = any;

/** CU.Databases.Models.Progression.Logs.ShardDaySummaryInstanceID */
export type ShardDaySummaryInstanceID = any;

/** CSE.Account.AccountID */
export type AccountID = any;

/** CU.MatchQueueInstanceID */
export type MatchQueueInstanceID = any;

/** CSE.GameplayDefs.RoundInstanceID */
export type RoundInstanceID = any;

/** CSE.GameplayDefs.RoleID */
export type RoleID = any;

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
/** ServerLib.ApiModels.IPatcherAlertUpdate */
export interface IPatcherAlertUpdate {
  alert: PatcherAlert | null;
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
/** CU.WebApi.GraphQL.Legacy.IMatchmakingUpdate */
export interface IMatchmakingUpdate {
  type: MatchmakingUpdateType | null;
}
/** The root query object. */
export interface CUQuery {
  alerts: (Alert | null)[] | null /** Gets a list of alerts */;
  channels: (Channel | null)[] | null /** List all channels. */;
  character: CUCharacter | null /** Get a character by id and shard. */;
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  crafting: CraftingRecipes | null /** Information about crafting recipes, nearby vox status, and potential interactions with the current vox job. */;
  entityItems: EntityItemResult | null /** retrieve information about an item that is stored in an entity currently loaded on the server */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  game: GameDefsGQLData | null /** Information about gameplay definition data */;
  invite: Invite | null /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
  invites:
    | (Invite | null)[]
    | null /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
  item: Item | null /** retrieve information about an item */;
  motd: (MessageOfTheDay | null)[] | null /** Gets a list of Message of the Days */;
  myActiveScenarioScoreboard: MyScenarioScoreboard | null /** Gets information about the active scenario score a user is in. */;
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
  myprogression: CharacterProgressionData | null /** Information about progression data for the character. */;
  myScenarioQueue: MyScenarioQueue | null /** Gets information about available scenarios and their queue status */;
  patcherAlerts: (PatcherAlert | null)[] | null /** Gets patcher alerts */;
  patcherHero: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  scenariosummary: ScenarioSummaryDBModel | null /** retrieve information about a scenario */;
  secureTrade: SecureTradeStatus | null /** Information about current secure item trade the player is engaged in. */;
  serverTimestamp: string | null /** Retrieve the current time on the server. */;
  shardCharacters:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
  shardprogression: ShardProgressionData | null /** Information about progression data for the entire shard. */;
  status: Status | null /** Information about statuses */;
  traits: TraitsInfo | null /** Get all possible traits. */;
  voxJob: VoxJobStatusGQL | null /** retrieve information about a vox job */;
  world: WorldData | null /** Information about the current game world */;
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
  maxBlood: Decimal | null;
  maxHealth: Decimal | null;
  maxPanic: Decimal | null;
  maxStamina: Decimal | null;
  name: NormalizedString | null;
  order: GroupID | null;
  progression: ProgressionComponentDBModel | null;
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
/** CU.Databases.Models.ProgressionComponentDBModel */
export interface ProgressionComponentDBModel {
  progressionNodes: (string | null)[] | null;
  progressionXP: (ProgresssionXPDBModel | null)[] | null;
  statBonuses: (ProgresssionStatBonusDBModel | null)[] | null;
}
/** CU.Databases.Models.ProgresssionXPDBModel */
export interface ProgresssionXPDBModel {
  id: string | null;
  xP: number | null;
}
/** CU.Databases.Models.ProgresssionStatBonusDBModel */
export interface ProgresssionStatBonusDBModel {
  amount: Decimal | null;
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
/** ServerLib.Crafting.CraftingRecipes */
export interface CraftingRecipes {
  nearestVoxEntityID: EntityID | null /** Entity ID of the closest vox that can be crafted with */;
  recipes: (RecipeDefRef | null)[] | null /** List of recipes for vox jobs */;
  voxJobGroupLog: (VoxJobGroupLogDBModel | null)[] | null;
  voxJobGroupLogs: (VoxJobGroupLogDBModel | null)[] | null;
  voxJobLogCount: number | null;
  voxJobLogs: (VoxJobLogDBModel | null)[] | null;
  voxNotes: (VoxNotesDBModel | null)[] | null;
}
/** CSE.GameplayDefs.RecipeDefRef */
export interface RecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  ingredients: (RecipeIngredientDef | null)[] | null /** Input ingredients required for this recipe */;
  job: VoxJobDefRef | null;
  outputItem: ItemDefRef | null /** Output Item for this recipe */;
}
/** CSE.GameplayDefs.RecipeIngredientDef */
export interface RecipeIngredientDef {
  ingredient: ItemDefRef | null /** The item required by this part of the recipe */;
  maxQuality: Decimal | null /** The maximum quality the ingredient must be.  Value is 0-1 */;
  minQuality: Decimal | null /** The minimum quality the ingredient must be.  Value is 0-1 */;
  requirement: ItemRequirementDefRef | null /** Extra requirements on the item, not used if the ingredient is provided. */;
  slot: RecipeSlotTypeDefRef | null /** The type of slot the ingredient will go in */;
  unitCount:
    | number
    | null /** The units of this item that must be provided. Note that multiple sets of final product can be produced given sufficient amounts of all ingredients */;
}
/** CSE.GameplayDefs.ItemDefRef */
export interface ItemDefRef {
  defaultResourceID: string | null;
  deploySettings: DeploySettingsDefRef | null;
  description: string | null /** Description of the item */;
  equipRequirements: string | null;
  gearSlotSets: (GearSlotSet | null)[] | null /** the sets of gear slots this item can be equipped to */;
  iconUrl: string | null /** URL to the item's icon */;
  id: string | null /** Unique item identifier */;
  isStackableItem: boolean | null;
  itemType: ItemType | null;
  name: string | null /** Name of the item */;
  numericItemDefID: number | null;
  substanceDefinition: SubstanceDefRef | null /** Substance information for this item definition */;
  tags: (GameplayTag | null)[] | null /** Tags on this item, these can be referenced by recipes */;
  voxUpgradeModule: VoxUpgradeModuleDefRef | null;
}
/** CSE.GameplayDefs.DeploySettingsDefRef */
export interface DeploySettingsDefRef {
  controlRequirements: string | null;
  isDoor: boolean | null;
  itemPlacementType: ItemPlacementType | null;
  itemTemplateType: ItemTemplateType | null;
  mapIconClass: string | null;
  maxPitch: Decimal | null;
  maxTerrainPitch: Decimal | null;
  plotSize: string | null;
  requiredZoneType: ZoneType | null;
  resourceID: string | null;
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
/** CSE.GameplayDefs.GearSlotDefRef */
export interface GearSlotDefRef {
  gearSlotType: GearSlotType | null /** Which type of slot this is */;
  iconClass: string | null;
  id: string | null /** Unique gear slot identifier */;
  name: string | null;
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
/** CSE.GameplayDefs.ItemRequirementDefRef */
export interface ItemRequirementDefRef {
  condition: string | null;
  description: string | null;
  errorDescription: string | null;
  iconURL: string | null;
  id: string | null;
}
/** CSE.GameplayDefs.RecipeSlotTypeDefRef */
export interface RecipeSlotTypeDefRef {
  description: string | null /** Slot Type description */;
  name: string | null /** Slot Type name */;
}
/** CSE.GameplayDefs.VoxJobDefRef */
export interface VoxJobDefRef {
  description: string | null;
  id: string | null;
  jobType: VoxJobType | null;
  name: string | null;
}
/** CU.Databases.Models.Items.VoxJobGroupLogDBModel */
export interface VoxJobGroupLogDBModel {
  crafterID: CharacterID | null;
  favorite: boolean | null;
  jobIdentifier: string | null;
  jobType: VoxJobType | null;
  lastCrafted: string | null;
  notes: string | null;
  timesCrafted: number | null;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel */
export interface VoxJobLogDBModel {
  crafterID: CharacterID | null;
  dateEnded: string | null;
  dateStarted: string | null;
  favorite: boolean | null;
  id: VoxJobInstanceID | null;
  inputItems: (Item | null)[] | null;
  itemHash: ItemStackHash | null;
  jobIdentifier: string | null;
  jobType: VoxJobType | null;
  notes: string | null;
  outputItems: (OutputItem | null)[] | null;
  voxDurabilityCost: Decimal | null;
}
/** World.Item */
export interface Item {
  actions: (ItemActionDefGQL | null)[] | null;
  containerColor: ColorRGBA | null /** the UI color for the container UI */;
  containerDrawers: (ContainerDrawerGQL | null)[] | null;
  debugname: string | null /** name of the item which includes some basic item information */;
  givenName: string | null /** Custom name given to item at crafting item */;
  hasSubItems: boolean | null /** if this item has sub items */;
  id: ItemInstanceID | null /** Unique instance ID for item. */;
  location: ItemLocationDescription | null /** details about the location of the item */;
  permissibleHolder: FlagsPermissibleHolderGQL | null;
  resourceList: (ItemResourceGQL | null)[] | null;
  scenarioRelationship: ScenarioRelationship | null;
  shardID: ShardID | null;
  stackHash: ItemStackHash | null /** Identifies items that are of the same type and have the same stats. */;
  staticDefinition: ItemDefRef | null /** The definition for the item. */;
  statList: (StatGQL | null)[] | null;
  stats: (ItemStatSetGQL | null)[] | null /** stats of this item */;
  voxStatus: VoxStatus | null /** The status of the nearest vox belonging to your player */;
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
  id: ContainerDrawerID | null;
  requirements: RequirementDefRef | null;
  stats: ContainerDefStat_Single | null;
}
/** CSE.GameplayDefs.RequirementDefRef */
export interface RequirementDefRef {
  description: string | null;
  icon: string | null;
  id: string | null;
}

export interface ContainerDefStat_Single {
  maxItemCount: Decimal | null /** MaxItemCount */;
  maxItemMass: Decimal | null /** MaxItemMass */;
}
/** World.Items.ItemLocationDescription */
export interface ItemLocationDescription {
  building: BuildingPlacedLocation | null /** Location filled if this item in a building place object */;
  equipped: EquippedLocation | null /** Location filled if this item is equipped */;
  ground: OnGroundLocation | null /** Location filled if this item in on the ground */;
  inContainer: InContainerLocation | null /** Location filled if this item is in a container */;
  inventory: InventoryLocation | null /** Location filled if this item is in a player's inventory */;
  inVox: InVoxJobLocation | null /** Location filled if this item is in a vox */;
}
/** World.BuildingPlacedLocation */
export interface BuildingPlacedLocation {
  buildingID: BuildingPlotInstanceID | null;
}
/** World.EquippedLocation */
export interface EquippedLocation {
  characterID: CharacterID | null /** The character the item is equipped on */;
  gearSlots: (GearSlotDefRef | null)[] | null /** The gear slots the item is equipped to */;
}
/** World.OnGroundLocation */
export interface OnGroundLocation {
  groupID: ItemInstanceID | null /** The group id set for stacked ground items */;
  isDeployed: boolean | null;
}
/** World.InContainerLocation */
export interface InContainerLocation {
  containerInstanceID: ItemInstanceID | null /** The item ID of the container this item is in */;
  drawerID: ContainerDrawerID | null /** The drawer this item is in */;
  position: number | null /** The UI position of the item */;
}
/** World.InventoryLocation */
export interface InventoryLocation {
  characterID: CharacterID | null /** The character that has this item in their inventory */;
  position: number | null /** The UI position of the item */;
}
/** World.InVoxJobLocation */
export interface InVoxJobLocation {
  itemSlot: RecipeSlotTypeDefRef | null /** The slot this item is associated with the recipe */;
  voxInstanceID: ItemInstanceID | null /** The item ID of the vox this item is contained in */;
  voxJobInstanceID: VoxJobInstanceID | null /** The id of the job this item is contained in */;
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
/** World.ScenarioRelationship */
export interface ScenarioRelationship {
  restrictedToScenario: boolean | null;
  scenarioID: ScenarioInstanceID | null;
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
/** World.VoxStatus */
export interface VoxStatus {
  jobs: (VoxJobStatus | null)[] | null;
}
/** World.VoxJobStatus */
export interface VoxJobStatus {
  endQuality: Decimal | null /** The player specified end quality for a substance. Only for Purify jobs */;
  givenName: string | null /** The custom name for the item being produced. Only for Make jobs */;
  id: VoxJobInstanceID | null;
  ingredients:
    | (Item | null)[]
    | null /** A list of all ingredients that are currently stored in the vox.  These are destroyed at the end of the job */;
  jobState: VoxJobState | null /** The current state the job is in. */;
  jobType: VoxJobType | null /** Which type of crafting job is currently being utilized */;
  outputItems:
    | (VoxJobOutputItem | null)[]
    | null /** The list of all items which will be rewarded when the vox job is completed.  This information is only available is job is fully configured and ready to run */;
  possibleIngredients: (Item | null)[] | null /** List of inventory items compatible with the current vox job */;
  possibleIngredientsWithSlots:
    | (PossibleVoxIngredientGQL | null)[]
    | null /** List of inventory items compatible with the current vox job */;
  possibleItemSlots: (RecipeSlotTypeDefRef | null)[] | null /** List of sub item slots this vox job uses */;
  recipe: RecipeDefRef | null /** The recipe details. */;
  recipesMatchingIngredients:
    | (string | null)[]
    | null /** ID's of recipes which match the current ingredient list in the vox */;
  startTime:
    | string
    | null /** What time the job was started.  The job must be in the Running or Finished state for this information to be valid. */;
  timeRemaining: Decimal | null /** The total seconds remaining for this job to finish.  This information is only valid while the job is running. */;
  totalCraftingTime: Decimal | null /** How long the job will take to run.  This information is only available is job is fully configured and ready to run */;
  usedRepairPoints: Decimal | null /** How many repair points will be used when repairing the item. Only for Repair jobs */;
  voxDurabilityCost: Decimal | null /** How much damage the vox will take from performing this job. */;
}
/** CU.Databases.Models.Items.VoxJobOutputItem */
export interface VoxJobOutputItem {
  item: Item | null;
  outputItemType: VoxJobOutputItemType | null;
}
/** World.PossibleVoxIngredientGQL */
export interface PossibleVoxIngredientGQL {
  item: Item | null;
  slots: (RecipeSlotTypeDefRef | null)[] | null;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel+OutputItem */
export interface OutputItem {
  item: Item | null;
  outputItemType: VoxJobOutputItemType | null;
}
/** CU.Databases.Models.Items.VoxNotesDBModel */
export interface VoxNotesDBModel {
  characterID: CharacterID | null;
  created: string | null;
  id: VoxNotesInstanceID | null;
  lastEdited: string | null;
  notes: string | null;
}
/** ServerLib.Items.EntityItemResult */
export interface EntityItemResult {
  items:
    | (Item | null)[]
    | null /** List of items contained within this item.  This includes wrapped items, inventory, and equipment items */;
}
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
  factions: (FactionDef | null)[] | null /** All possible factions */;
  gearSlots: (GearSlotDefRef | null)[] | null /** Static information about gear slots */;
  genders: (GenderDefGQL | null)[] | null /** All possible genders */;
  item: ItemDefRef | null /** Static information about a specific item */;
  items: (ItemDefRef | null)[] | null /** Static information about items */;
  itemStats: (ItemStatDefinitionGQL | null)[] | null /** Array of definitions for all available item stats */;
  itemTooltipCategories:
    | (ItemTooltipCategoryDef | null)[]
    | null /** Array of category information for item tooltips */;
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
/** CSE.GameplayDefs.FactionDef */
export interface FactionDef {
  description: string | null;
  hueRotation: number | null;
  id: Faction | null;
  name: string | null;
}
/** ServerLib.GraphQL.Models.GenderDefGQL */
export interface GenderDefGQL {
  id: string | null;
  name: string | null;
  numericID: number | null;
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
  itemLowQualityThreshold: Decimal | null;
  maxCharacterNameLength: number | null;
  minCharacterNameLength: number | null;
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
/** CU.Databases.Models.Content.MessageOfTheDay */
export interface MessageOfTheDay {
  channels: (number | null)[] | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the message of the day. */;
  id: string | null;
  jSONContent: string | null /** JSON data about the HTML Content for the message of the day */;
  title: string | null;
  utcCreated: string | null;
  utcDisplayEnd: string | null;
  utcDisplayStart: string | null;
}
/** CU.WebApi.GraphQL.Legacy.MyScenarioScoreboard */
export interface MyScenarioScoreboard {
  description: string | null;
  icon: string | null;
  id: ScenarioInstanceID | null;
  name: string | null;
  rounds: (RoundScore | null)[] | null;
  roundStartTime: Decimal | null;
  teams: Faction_TeamScore | null;
}
/** CU.WebApi.GraphQL.Legacy.RoundScore */
export interface RoundScore {
  active: boolean | null;
  roundIndex: number | null;
  winningTeamIDs: (ScenarioTeamID | null)[] | null;
}

export interface Faction_TeamScore {
  arthurian: TeamScore | null /** Arthurian */;
  factionless: TeamScore | null /** Factionless */;
  tdd: TeamScore | null /** TDD */;
  viking: TeamScore | null /** Viking */;
}
/** CU.WebApi.GraphQL.Legacy.TeamScore */
export interface TeamScore {
  players: (PlayerScore | null)[] | null;
  score: number | null;
}
/** CU.WebApi.GraphQL.Legacy.PlayerScore */
export interface PlayerScore {
  characterID: CharacterID | null;
  name: string | null;
  score: number | null;
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
  blood: CurrentMax | null;
  canInvite: boolean | null;
  canKick: boolean | null;
  characterID: string | null;
  classID: string | null;
  displayOrder: number | null;
  entityID: string | null;
  faction: Faction | null;
  gender: string | null;
  health: Health | null;
  isAlive: boolean | null;
  isLeader: boolean | null;
  isReady: boolean | null;
  name: string | null;
  position: Vec3f | null;
  race: string | null;
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
  readiedGearSlots: (GearSlotDefRef | null)[] | null;
  resistances: (StatGQL | null)[] | null;
  totalMass: Decimal | null;
}
/** World.EquippedItem */
export interface EquippedItem {
  gearSlots: (GearSlotDefRef | null)[] | null /** the list of all the gear slots the item is in */;
  item: Item | null /** The item that is equipped */;
}
/** ServerLib.Items.MyInventory */
export interface MyInventory {
  itemCount: number | null;
  items: (Item | null)[] | null;
  nestedItemCount: number | null;
  totalMass: Decimal | null;
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
/** ServerLib.Progression.CharacterProgressionData */
export interface CharacterProgressionData {
  accountSummary: AccountProgressionSummary | null /** Information about all characters belonging to this account. */;
  adjustmentsByDayLogID:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** A character adjustments for a specific day log for this character. */;
  characterAdjustments:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** Information about what adjustments happened for this player over the date range provided. */;
  characterDays:
    | (CharacterDaySummaryDBModel | null)[]
    | null /** Information about what happened for this player over the date range provided. */;
  collectedProgressionSummary: CharacterSummaryDBModel | null /** Global information about this character. */;
  dayBySummaryNumber: CharacterDaySummaryDBModel | null /** A specific summary number for this character. */;
  dayLogByID: CharacterDaySummaryDBModel | null /** A specific day log for this character. */;
  unCollectedDayLogs: (CharacterDaySummaryDBModel | null)[] | null /** All unhandled progression days. */;
}
/** ServerLib.Progression.AccountProgressionSummary */
export interface AccountProgressionSummary {
  activeDayCount: number | null;
  characterCount: number | null;
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  distanceMoved: number | null;
  scenarioOutcomes: ScenarioOutcome_UInt32 | null;
  secondsActive: number | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel */
export interface CraftingSummaryDBModel {
  alchemySummary: JobSummaryDBModel | null;
  purifySummary: JobSummaryDBModel | null;
  recipeSummary: JobSummaryDBModel | null;
  repairSummary: JobSummaryDBModel | null;
  salvageSummary: JobSummaryDBModel | null;
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

export interface ScenarioOutcome_UInt32 {
  draw: number | null /** Draw */;
  invalid: number | null /** Invalid */;
  killed: number | null /** Killed */;
  lose: number | null /** Lose */;
  restart: number | null /** Restart */;
  win: number | null /** Win */;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentDBModel */
export interface CharacterAdjustmentDBModel {
  adjustment: CharacterAdjustmentGQLField | null;
  characterDayLogID: CharacterDaySummaryInstanceID | null;
  dayEnd: string | null;
  reason: CharacterAdjustmentReasonGQLField | null;
  sequence: number | null;
  shardDayLogID: ShardDaySummaryInstanceID | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentGQLField */
export interface CharacterAdjustmentGQLField {
  addItem: CharacterAdjustmentAddItem | null;
  applyStatus: CharacterAdjustmentApplyStatus | null;
  playerStat: CharacterAdjustmentPlayerStat | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAddItem */
export interface CharacterAdjustmentAddItem {
  itemDef: ItemDefRef | null;
  itemInstanceIDS: (ItemInstanceID | null)[] | null;
  quality: ItemQuality | null;
  staticDefinitionID: string | null;
  unitCount: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentApplyStatus */
export interface CharacterAdjustmentApplyStatus {
  statusID: string | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentPlayerStat */
export interface CharacterAdjustmentPlayerStat {
  newBonus: Decimal | null;
  previousBonus: Decimal | null;
  stat: string | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentReasonGQLField */
export interface CharacterAdjustmentReasonGQLField {
  adminGrant: boolean | null;
  useAbilities: CharacterAdjustmentReasonUseAbilities | null;
  useAbilityComponent: CharacterAdjustmentReasonUseAbilityComponent | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilities */
export interface CharacterAdjustmentReasonUseAbilities {
  inCombatCount: number | null;
  nonCombatCount: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilityComponent */
export interface CharacterAdjustmentReasonUseAbilityComponent {
  abilityComponentDef: AbilityComponentGQL | null;
  abilityComponentID: string | null;
  inCombatCount: number | null;
  nonCombatCount: number | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel */
export interface CharacterDaySummaryDBModel {
  abilityComponentsUsed: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  accountID: AccountID | null;
  adjustments: (CharacterAdjustmentDBModel | null)[] | null;
  characterID: CharacterID | null;
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  dayEnd: string | null;
  dayStart: string | null;
  distanceMoved: number | null;
  id: CharacterDaySummaryInstanceID | null;
  plots: PlotSummaryDBModel | null;
  scenarios: (FinishedScenario | null)[] | null;
  secondsActive: number | null;
  shardDayLogID: ShardDaySummaryInstanceID | null;
  shardID: ShardID | null;
  state: States | null;
  summaryNumber: number | null;
}
/** CU.Databases.Models.Progression.Logs.AbilityComponentUsedSummaryDBModel */
export interface AbilityComponentUsedSummaryDBModel {
  abilityComponentDef: AbilityComponentGQL | null;
  abilityComponentID: string | null;
  usedInCombatCount: number | null;
  usedNonCombatCount: number | null;
}
/** CU.Databases.Models.Progression.Logs.PlotSummaryDBModel */
export interface PlotSummaryDBModel {
  factionPlotsCaptured: number | null;
  scenarioPlotsCaptured: number | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+FinishedScenario */
export interface FinishedScenario {
  activeAtEnd: boolean | null;
  outcome: ScenarioOutcome | null;
  scenarioDefinitionID: string | null;
  scenarioID: ScenarioInstanceID | null;
  score: number | null;
  teamID: ScenarioTeamID | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterSummaryDBModel */
export interface CharacterSummaryDBModel {
  abilityComponentUsed: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  accountID: AccountID | null;
  activeDayCount: number | null;
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  distanceMoved: number | null;
  lastDayLogProcessedID: CharacterDaySummaryInstanceID | null;
  lastDayProcessedStart: string | null;
  plots: PlotSummaryDBModel | null;
  scenarioOutcomes: ScenarioOutcome_UInt32 | null;
  secondsActive: number | null;
  shardID: ShardID | null;
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
  scenarioDef: ScenarioDef | null;
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
/** CSE.GameplayDefs.ScenarioDef */
export interface ScenarioDef {
  displayDescription: string | null;
  displayName: string | null;
  icon: string | null;
  id: string | null;
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
/** ServerLib.Progression.ShardProgressionData */
export interface ShardProgressionData {
  adjustmentsSummary: CharacterAdjustmentSummary | null /** Information about rewards over a time frame or specific day */;
  progressionDaySummary: ShardDaySummaryDBModel | null /** Information about a particular day */;
  progressionSummary: ShardSummaryDBModel | null /** Global information about this shard. */;
  progressionSummaryRange: ShardSummaryDBModel | null /** Global information about this shard given the time frame. */;
  realmSummary: RealmDaySummaryDBModel | null /** Information about what happened to a realm on a given day. */;
  scenarioSummaries: PagedScenarioSummaries | null /** Information about all the finished scenarios within a date range */;
  shardDays: PagedShardDaySummaries | null /** Information about what happened on a shard over the date range provided. */;
}
/** ServerLib.Progression.CharacterAdjustmentSummary */
export interface CharacterAdjustmentSummary {
  averageAdjustementsPerCharacter: Decimal | null;
  characterCount: number | null;
  characterIDWithMaxAdjustments: CharacterID | null;
  items: (ItemsAdded | null)[] | null;
  maxAdjustmentsOnCharacter: number | null;
  stats: (StatBonusPoints | null)[] | null;
  statusesApplied: (StatusApplied | null)[] | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+ItemsAdded */
export interface ItemsAdded {
  staticDefinitionID: string | null;
  unitCount: number | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatBonusPoints */
export interface StatBonusPoints {
  bonusChange: Decimal | null;
  stat: string | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatusApplied */
export interface StatusApplied {
  count: number | null;
  statusID: string | null;
}
/** CU.Databases.Models.Progression.Logs.ShardDaySummaryDBModel */
export interface ShardDaySummaryDBModel {
  dayEnd: string | null;
  dayStart: string | null;
  nonPlayerCharacters: CharacterSummary | null;
  playerCharacters: CharacterSummary | null;
  plots: PlotSummary | null;
  scenarios: (ScenarioSummary | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+CharacterSummary */
export interface CharacterSummary {
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  distanceMoved: number | null /** Distance traveled by all characters ever for this shard. */;
  secondsActive:
    | number
    | null /** How many seconds of the game have been played by all characters ever for this shard. */;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+PlotSummary */
export interface PlotSummary {
  blocksCreated: number | null;
  blocksDestroyed: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+ScenarioSummary */
export interface ScenarioSummary {
  finished: number | null;
  killed: number | null;
  restarted: number | null;
  started: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel */
export interface ShardSummaryDBModel {
  daysProcessed: number | null;
  nonPlayerCharacters: CharacterSummary | null;
  playerCharacters: CharacterSummary | null;
  plots: PlotSummary | null;
  realmSummaries: Faction_RealmSummaryDBModel | null;
  scenarios: ScenarioSummary | null;
  shardID: ShardID | null;
}

export interface Faction_RealmSummaryDBModel {
  arthurian: RealmSummaryDBModel | null /** Arthurian */;
  factionless: RealmSummaryDBModel | null /** Factionless */;
  tdd: RealmSummaryDBModel | null /** TDD */;
  viking: RealmSummaryDBModel | null /** Viking */;
}
/** CU.Databases.Models.Progression.Logs.RealmSummaryDBModel */
export interface RealmSummaryDBModel {
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  distanceMoved: number | null;
  faction: Faction | null;
  secondsActive: number | null;
}
/** CU.Databases.Models.Progression.Logs.RealmDaySummaryDBModel */
export interface RealmDaySummaryDBModel {
  abilityComponentsUsed: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  characterCount: number | null;
  crafting: CraftingSummaryDBModel | null;
  damage: DamageSummaryDBModel | null;
  dayEnd: string | null;
  dayStart: string | null;
  distanceMoved: number | null;
  faction: Faction | null;
  secondsActive: number | null;
  shardDayLogID: ShardDaySummaryInstanceID | null;
  shardID: ShardID | null;
}
/** ServerLib.Progression.PagedScenarioSummaries */
export interface PagedScenarioSummaries {
  data: (ScenarioSummaryDBModel | null)[] | null;
  totalCount: number | null;
}
/** ServerLib.Progression.PagedShardDaySummaries */
export interface PagedShardDaySummaries {
  data: (ShardDaySummaryDBModel | null)[] | null;
  totalCount: number | null;
}
/** ServerLib.Status.Status */
export interface Status {
  statuses: (StatusDef | null)[] | null /** List of all status defs */;
}
/** CSE.GameplayDefs.StatusDef */
export interface StatusDef {
  blocksAbilities: boolean | null /** if the status blocks abilities from running */;
  description: string | null /** description of the status */;
  iconClass: string | null /** iconClass of the status */;
  iconURL: string | null /** icon url of the status */;
  id: string | null;
  name: string | null /** name of the status */;
  numericID: number | null;
  stacking: StatusStackingDef | null;
  statusTags: (string | null)[] | null;
  uIText: string | null;
  uIVisibility: StatusUIVisibility | null;
}
/** CSE.GameplayDefs.StatusStackingDef */
export interface StatusStackingDef {
  group: string | null;
  removalOrder: StatusRemovalOrder | null;
  statusDurationModType: StatusDurationModification | null;
}
/** CSE.GameplayDefs.Store.Cache.TraitsInfo */
export interface TraitsInfo {
  maxAllowed: number | null;
  minRequired: number | null;
  traits: (Trait | null)[] | null;
}
/** ServerLib.Crafting.VoxJobStatusGQL */
export interface VoxJobStatusGQL {
  status: VoxJobStatus | null;
}
/** ServerLib.Game.WorldData */
export interface WorldData {
  map: MapData | null;
  spawnPoints: (SpawnPoint | null)[] | null /** Currently active spawn points available to you. */;
}
/** ServerLib.Game.MapData */
export interface MapData {
  dynamic: (MapPoint | null)[] | null;
  static: (MapPoint | null)[] | null;
}
/** ServerLib.Game.MapPoint */
export interface MapPoint {
  actions: MapPointActions | null;
  anchor: (Decimal | null)[] | null;
  color: string | null;
  offset: (Decimal | null)[] | null;
  position: (Decimal | null)[] | null;
  size: (Decimal | null)[] | null;
  src: string | null;
  tooltip: string | null;
  zone: ZoneInstanceID | null;
}
/** ServerLib.Game.MapPointActions */
export interface MapPointActions {
  onClick: MapPointAction | null;
}
/** ServerLib.Game.MapPointAction */
export interface MapPointAction {
  command: string | null;
  type: MapPointActionType | null;
}
/** ServerLib.ApiModels.SpawnPoint */
export interface SpawnPoint {
  faction: Faction | null;
  id: string | null;
  position: Vec3f | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  activeGroupUpdates: IGroupUpdate | null /** Updates to a group member in an active group */;
  featureFlags: (string | null)[] | null /** Enabled feature flags */;
  interactiveAlerts: IInteractiveAlert | null /** Alerts */;
  myGroupNotifications: IGroupNotification | null /** Group related notifications for your specific character. Tells you when you joined a group, etc. */;
  myInventoryItems: Item | null /** Real-time updates for inventory items */;
  passiveAlerts: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  patcherAlerts: IPatcherAlertUpdate | null /** Gets updates for patcher alerts */;
  secureTradeUpdates: ISecureTradeUpdate | null /** Updates to a secure trade */;
  serverUpdates: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
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
/** CSE.GameplayDefs.AlchemyResultDef */
export interface AlchemyResultDef {
  id: string | null;
  name: string | null;
}
/** CSE.GameplayDefs.BlockDef */
export interface BlockDef {
  id: string | null /** Unique block identifier */;
}
/** CSE.GameplayDefs.ReagentDef */
export interface ReagentDef {
  id: string | null;
  requiredContainer: ItemRequirementDefRef | null;
}
/** CSE.GameplayDefs.SiegeEngineSettingsDef */
export interface SiegeEngineSettingsDef {
  id: string | null /** Unique identifier for this definition */;
}
/** CSE.GameplayDefs.WeaponConfigDef */
export interface WeaponConfigDef {
  id: string | null /** Unique weapon identifier */;
}
/** CSE.GameplayDefs.ResourceNodeSubItemDef+Entry+HarvestItem */
export interface HarvestItem {
  itemDefinition: ItemDefRef | null;
  maxQuality: Decimal | null;
  maxUnitCount: number | null;
  minQuality: Decimal | null;
  minUnitCount: number | null;
  weight: Decimal | null;
}
/** CSE.GameplayDefs.ResourceNodeSubItemDef+Entry */
export interface Entry {
  faction: Faction | null;
  harvestItems: (HarvestItem | null)[] | null;
}
/** CSE.GameplayDefs.ResourceNodeSubItemDef */
export interface ResourceNodeSubItemDef {
  entries: (Entry | null)[] | null;
  id: string | null;
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
/** CU.WebApi.GraphQL.Legacy.MatchmakingEntered */
export interface MatchmakingEntered extends IMatchmakingUpdate {
  gameMode: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.Legacy.MatchmakingError */
export interface MatchmakingError extends IMatchmakingUpdate {
  code: number | null;
  message: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.Legacy.MatchmakingServerReady */
export interface MatchmakingServerReady extends IMatchmakingUpdate {
  host: string | null;
  port: number | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.Legacy.MatchmakingKickOff */
export interface MatchmakingKickOff extends IMatchmakingUpdate {
  matchID: string | null;
  secondsToWait: Decimal | null;
  serializedTeamMates: string | null;
  type: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.Legacy.Scoreboard */
export interface Scoreboard {
  description: string | null;
  icon: string | null;
  id: ScenarioInstanceID | null;
  name: string | null;
  rounds: (RoundScore | null)[] | null;
  roundStartTime: Decimal | null;
  teams: Faction_TeamScore | null;
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
/** World.BuildingConstructionLocation */
export interface BuildingConstructionLocation {
  buildingID: BuildingPlotInstanceID | null;
}
/** World.InVoxUpgradeModuleLocation */
export interface InVoxUpgradeModuleLocation {
  position: number | null /** The UI position of the item */;
  voxInstanceID: ItemInstanceID | null /** The item ID of the vox this item is contained in */;
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
/** ServerLib.ApiModels.PatcherAlertUpdate */
export interface PatcherAlertUpdate extends IPatcherAlertUpdate {
  alert: PatcherAlert | null;
}
/** CSE.GameplayDefs.Store.Cache.FactionTrait */
export interface FactionTrait {
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
/** CSE.GameplayDefs.Store.Cache.RaceTrait */
export interface RaceTrait {
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
/** CSE.GameplayDefs.Store.Cache.ClassTrait */
export interface ClassTrait {
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
export interface AlertsalertsArgs {
  destination: string | null /** Required: Where the alert will show up. */;
}
export interface CharactercharacterArgs {
  id: string | null;
  shard: number | null;
}
export interface EntityItemsentityItemsArgs {
  id: string | null /** Entity ID. (required) */;
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
export interface ItemitemArgs {
  shard: number | null /** Shard ID. (required) */;
  id: string | null /** Item ID. (required) */;
}
export interface MotdmotdArgs {
  channel: number | null /** Required: Channel ID from which to return message of the day */;
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
export interface ShardprogressionshardprogressionArgs {
  shard: number | null /** The id of the shard to request progression data from. */;
}
export interface VoxJobvoxJobArgs {
  entityID: string | null /** Entity ID. (required) */;
  voxJobID: string | null /** vox job ID. (required) */;
}
export interface AbilityabilityArgs {
  id: number | null /** ID of the ability. */;
}
export interface VoxJobGroupLogvoxJobGroupLogArgs {
  jobIdentifier: string | null;
  jobType: string | null;
}
export interface VoxJobLogCountvoxJobLogCountArgs {
  favoriteFilter: string | null;
  textFilter: string | null;
  jobIdentifier: string | null;
  jobType: string | null;
}
export interface VoxJobLogsvoxJobLogsArgs {
  favoriteFilter: string | null;
  textFilter: string | null;
  jobIdentifier: string | null;
  jobType: string | null;
  dateSort: string | null;
  page: number | null;
  count: number | null;
}
export interface PossibleIngredientspossibleIngredientsArgs {
  slot: string | null /** The slot to get ingredients for. (required) */;
}
export interface AbilityComponentsabilityComponentsArgs {
  all: boolean | null /** if all the components should be returned, intead of those for this character */;
}
export interface ItemitemArgs {
  itemid: string | null /** The id of the item to look for. (required) */;
}
export interface AccountSummaryaccountSummaryArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface AdjustmentsByDayLogIdadjustmentsByDayLogIDArgs {
  logID: string | null /** The id of the log to look for adjustments for. (required) */;
}
export interface CharacterAdjustmentscharacterAdjustmentsArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface CharacterDayscharacterDaysArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface DayBySummaryNumberdayBySummaryNumberArgs {
  summaryNumber: string | null /** The summary number of the log to look for. (required) */;
}
export interface DayLogByIddayLogByIDArgs {
  logID: string | null /** The id of the log to look for. (required) */;
}
export interface AdjustmentsSummaryadjustmentsSummaryArgs {
  logID: string | null /** The specific day to look for, used instead of date range if specified. */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface ProgressionDaySummaryprogressionDaySummaryArgs {
  logID: string | null /** The specific day to look for */;
}
export interface ProgressionSummaryRangeprogressionSummaryRangeArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface RealmSummaryrealmSummaryArgs {
  shardDayID: string | null /** The specific log to look for */;
  faction: string | null /** The faction to look for */;
}
export interface ScenarioSummariesscenarioSummariesArgs {
  skip: number | null /** The number of entries to skip. */;
  limit: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface ShardDaysshardDaysArgs {
  skip: number | null /** The number of entries to skip. */;
  limit: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
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
/** CSE.GameplayDefs.VoxJobType */
export enum VoxJobType {
  Invalid = 'Invalid',
  Recipe = 'Recipe',
  Purify = 'Purify',
  Repair = 'Repair',
  Salvage = 'Salvage',
  Alchemy = 'Alchemy'
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
  ScenarioRole = 'ScenarioRole'
}
/** CU.Databases.Models.Items.VoxJobState */
export enum VoxJobState {
  None = 'None',
  Configuring = 'Configuring',
  Queued = 'Queued',
  Running = 'Running',
  Finished = 'Finished',
  Collecting = 'Collecting'
}
/** CU.Databases.Models.Items.VoxJobOutputItemType */
export enum VoxJobOutputItemType {
  Invalid = 'Invalid',
  Normal = 'Normal',
  Byproduct = 'Byproduct',
  Unused = 'Unused'
}
/** CSE.GameplayDefs.UnitFrameDisplay */
export enum UnitFrameDisplay {
  Hidden = 'Hidden',
  HiddenWhenCurrentValue0 = 'HiddenWhenCurrentValue0',
  Visible = 'Visible'
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
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  Trade = 'Trade',
  Group = 'Group',
  Progression = 'Progression'
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
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+States */
export enum States {
  Unpublished = 'Unpublished',
  Initial = 'Initial',
  Handled = 'Handled',
  Preserved = 'Preserved'
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
/** World.SecureTradeState */
export enum SecureTradeState {
  None = 'None',
  Invited = 'Invited',
  ModifyingItems = 'ModifyingItems',
  Locked = 'Locked',
  Confirmed = 'Confirmed'
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
/** CSE.GameplayDefs.StatusStackingDef+StatusDurationModification */
export enum StatusDurationModification {
  RefreshDuration = 'RefreshDuration',
  AddAmountToDuration = 'AddAmountToDuration',
  SetNewDuration = 'SetNewDuration',
  SetNewDurationIfGreater = 'SetNewDurationIfGreater',
  DoNothing = 'DoNothing'
}
/** CSE.GameplayDefs.StatusUIVisibility */
export enum StatusUIVisibility {
  Hidden = 'Hidden',
  Hud = 'Hud',
  PopupOnAdd = 'PopupOnAdd',
  PopupOnRemove = 'PopupOnRemove',
  ShowInactive = 'ShowInactive',
  ShowAllActive = 'ShowAllActive',
  ShowAll = 'ShowAll'
}
/** ServerLib.Game.MapPointActionType */
export enum MapPointActionType {
  ClientCommand = 'ClientCommand'
}
/** CSE.GameplayDefs.ZoneInstanceID */
export enum ZoneInstanceID {
  None = 'None',
  Invalid = 'Invalid'
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
/** CU.WebApi.GraphQL.Legacy.MatchmakingUpdateType */
export enum MatchmakingUpdateType {
  None = 'None',
  Entered = 'Entered',
  Error = 'Error',
  KickOff = 'KickOff',
  ServerReady = 'ServerReady'
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
