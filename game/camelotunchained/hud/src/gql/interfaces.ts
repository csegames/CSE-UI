/* tslint:disable */
import { GraphQLResolveInfo } from "graphql";

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
  parent?: Parent,
  args?: Args,
  context?: Context,
  info?: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionResolver<
  Result,
  Parent = any,
  Context = any,
  Args = any
> = {
  subscribe<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
};

export type Decimal = any;

/** CSE.EntityID */
export type EntityID = any;

/** CU.Buildings.BuildingPlotInstanceID */
export type BuildingPlotInstanceID = any;

/** CU.Abilities.AbilityInstanceID */
export type AbilityInstanceID = any;

/** CU.CharacterID */
export type CharacterID = any;

/** NormalizedString */
export type NormalizedString = any;

/** CU.Groups.GroupID */
export type GroupID = any;

/** CU.Stat */
export type Stat = any;

/** VoxJobInstanceID */
export type VoxJobInstanceID = any;

/** CU.Databases.Models.ContainerDrawerID */
export type ContainerDrawerID = any;

/** ItemInstanceID */
export type ItemInstanceID = any;

/** CU.ScenarioInstanceID */
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

/** CU.ScenarioTeamID */
export type ScenarioTeamID = any;

/** The `Date` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

/** CU.Databases.Models.Items.ItemQuality */
export type ItemQuality = any;

/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryInstanceID */
export type CharacterDaySummaryInstanceID = any;

/** CU.Databases.Models.Progression.Logs.ShardDaySummaryInstanceID */
export type ShardDaySummaryInstanceID = any;

/** AccountID */
export type AccountID = any;

/** CU.MatchQueueInstanceID */
export type MatchQueueInstanceID = any;

/** CU.Databases.Models.ResourceNodeInstanceID */
export type ResourceNodeInstanceID = any;

/** CU.RoundInstanceID */
export type RoundInstanceID = any;

/** CU.RoleID */
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
  info?: ActiveWarband | null;
  members?: (GroupMemberState | null)[] | null;
}
/** CU.Groups.IGroup */
export interface IGroup {
  created?: string | null;
  faction?: Faction | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  shard?: ShardID | null;
}
/** CU.Groups.IGroupMember */
export interface IGroupMember {
  faction?: Faction | null;
  gender?: Gender | null;
  groupID?: GroupID | null;
  id?: CharacterID | null;
  joined?: string | null;
  name?: NormalizedString | null;
  parted?: string | null;
  permissions?: (string | null)[] | null;
  race?: Race | null;
  rank?: string | null;
  shardID?: ShardID | null;
}
/** CU.Groups.IWarband */
export interface IWarband {
  order?: GroupID | null;
}
/** CU.WebApi.GraphQL.IGraphQLBattlegroup */
export interface IGraphQLBattlegroup {
  battlegroup?: Battlegroup | null;
  members?: (GroupMemberState | null)[] | null;
}
/** ServerLib.GraphQL.Models.IInteractiveAlert */
export interface IInteractiveAlert {
  category?: AlertCategory | null;
  targetID?: CharacterID | null;
  when?: number | null;
}
/** ServerLib.GraphQL.TestInterface */
export interface TestInterface {
  float?: Decimal | null;
  integer?: number | null;
}
/** ServerLib.GraphQL.Character */
export interface Character {
  name?: string | null;
  race?: string | null;
}
/** CU.WebApi.GraphQL.IGroupUpdate */
export interface IGroupUpdate {
  characterID?: CharacterID | null;
  groupID?: GroupID | null;
  updateType?: GroupUpdateType | null;
}
/** CU.Groups.IGroupNotification */
export interface IGroupNotification {
  characterID?: CharacterID | null;
  groupID?: GroupID | null;
  groupType?: GroupTypes | null;
  type?: GroupNotificationType | null;
}
/** ServerLib.ApiModels.IPatcherAlertUpdate */
export interface IPatcherAlertUpdate {
  alert?: PatcherAlert | null;
}
/** ServerLib.GraphQL.Models.ISecureTradeUpdate */
export interface ISecureTradeUpdate {
  category?: SecureTradeUpdateCategory | null;
  targetID?: CharacterID | null;
  tradeID?: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.IServerUpdate */
export interface IServerUpdate {
  type?: ServerUpdateType | null;
}
/** ServerLib.ApiModels.IPatcherCharacterUpdate */
export interface IPatcherCharacterUpdate {
  shard?: ShardID | null;
  type?: PatcherCharacterUpdateType | null;
}
/** CU.WebApi.GraphQL.IMatchmakingUpdate */
export interface IMatchmakingUpdate {
  type?: MatchmakingUpdateType | null;
}
/** The root query object. */
export interface CUQuery {
  buildingPlotByEntityID?: BuildingPlotResult | null /** retrieve information about a building plot by its entity ID */;
  buildingPlotByInstanceID?: BuildingPlotResult | null /** retrieve information about a building plot */;
  channels?: (Channel | null)[] | null /** List all channels. */;
  character?: CUCharacter | null /** Get a character by id and shard. */;
  connectedServices?: ConnectedServices | null /** Status information for connected services */;
  crafting?: CraftingRecipes | null /** Information about crafting recipes, nearby vox status, and potential interactions with the current vox job. */;
  entityItems?: EntityItemResult | null /** retrieve information about an item that is stored in an entity currently loaded on the server */;
  game?: GameDefsGQLData | null /** Information about gameplay definition data */;
  gearSlots?: (GearSlotDefRef | null)[] | null /** gearSlots */;
  invite?: Invite | null /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
  invites?:
    | (Invite | null)[]
    | null /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
  item?: Item | null /** retrieve information about an item */;
  metrics?: MetricsData | null /** metrics data */;
  motd?:
    | (MessageOfTheDay | null)[]
    | null /** Gets a list of Message of the Days */;
  myActiveScenarioScoreboard?: MyScenarioScoreboard | null /** Gets information about the active scenario score a user is in. */;
  myActiveWarband?: GraphQLActiveWarband | null /** A users active warband */;
  myBattlegroup?: GraphQLBattlegroup | null /** A users battleground */;
  myCharacter?: CUCharacter | null /** Get the character of the currently logged in user. */;
  myEquippedItems?: MyEquippedItems | null /** retrieve all the session users equipped items */;
  myInteractiveAlerts?: (IInteractiveAlert | null)[] | null /** Alerts */;
  myInventory?: MyInventory | null /** Retrieve data about the character's inventory */;
  myOrder?: Order | null /** Gets information about the order your character is in, if any. */;
  myPassiveAlerts?:
    | (PassiveAlert | null)[]
    | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  myprogression?: CharacterProgressionData | null /** Information about progression data for the character. */;
  myScenarioQueue?: MyScenarioQueue | null /** Gets information about available scenarios and their queue status */;
  patcherAlerts?: (PatcherAlert | null)[] | null /** Gets patcher alerts */;
  patcherHero?: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  patchNote?: PatchNote | null /** Gets a single patch note */;
  patchNotes?: (PatchNote | null)[] | null /** Gets patch notes */;
  resourceNode?: ResourceNodeResult | null /** retrieve information about a resource node */;
  scenariosummary?: ScenarioSummaryDBModel | null /** retrieve information about a scenario */;
  secureTrade?: SecureTradeStatus | null /** Information about current secure item trade the player is engaged in. */;
  shardCharacters?:
    | (SimpleCharacter | null)[]
    | null /** Gets all the characters from the requested shard for the account. */;
  shardprogression?: ShardProgressionData | null /** Information about progression data for the entire shard. */;
  status?: Status | null /** Information about statuses */;
  substances?:
    | (SubstanceDefRef | null)[]
    | null /** list all available substances */;
  test?: Test | null /** Just here for testing, please ignore. */;
  traits?: TraitsInfo | null /** Get all possible traits. */;
  voxJob?: VoxJobStatusGQL | null /** retrieve information about a vox job */;
  world?: WorldData | null /** Information about the current game world */;
}
/** World.BuildingPlotResult */
export interface BuildingPlotResult {
  buildingPlacedItemsCount?: number | null;
  capturingFaction?: Faction | null;
  contestedState?: PlotContestedState | null;
  currentCaptureScore?: Decimal | null;
  entityID?: EntityID | null;
  faction?: Faction | null;
  instanceID?: BuildingPlotInstanceID | null;
  maxBlocks?: number | null;
  ownedByName?: string | null;
  permissibleKeyType?: PermissibleSetKeyType | null;
  permissions?: FlagsPermissibleHolderGQL | null;
  position?: Vec3f | null;
  scoreToCapture?: Decimal | null;
  size?: Vec3f | null;
}
/** ServerLib.FlagsPermissibleHolderGQL */
export interface FlagsPermissibleHolderGQL {
  noActiveSetsPermissions?: FlagsPermissibleGQL | null;
  permissibleSets?: (FlagsPermissibleSetGQL | null)[] | null;
  userGrants?: (FlagsPermissibleGrantGQL | null)[] | null;
  userPermissions?: number | null;
}
/** ServerLib.FlagsPermissibleGQL */
export interface FlagsPermissibleGQL {
  grants?: (FlagsPermissibleGrantGQL | null)[] | null;
  permissions?: number | null;
  target?: PermissibleTargetGQL | null;
}
/** ServerLib.FlagsPermissibleGrantGQL */
export interface FlagsPermissibleGrantGQL {
  grantPermissions?: number | null;
  grants?: (FlagsPermissibleGrantGQL | null)[] | null;
  permissions?: number | null;
  target?: PermissibleTargetGQL | null;
}
/** ServerLib.PermissibleTargetGQL */
export interface PermissibleTargetGQL {
  characterName?: string | null;
  description?: string | null;
  targetType?: PermissibleTargetType | null;
}
/** ServerLib.FlagsPermissibleSetGQL */
export interface FlagsPermissibleSetGQL {
  isActive?: boolean | null;
  keyDescription?: string | null;
  keyType?: PermissibleSetKeyType | null;
  permissibles?: (FlagsPermissibleGQL | null)[] | null;
  userMatchesKey?: boolean | null;
}
/** Vec3f */
export interface Vec3f {
  x?: Decimal | null;
  y?: Decimal | null;
  z?: Decimal | null;
}
/** ServerLib.ApiModels.Channel */
export interface Channel {
  description?: string | null;
  id?: number | null;
  name?: string | null;
  permissions?: PatchPermissions | null;
}
/** CU.Databases.Models.CUCharacter */
export interface CUCharacter {
  abilities?: (Ability | null)[] | null;
  ability?: Ability | null;
  archetype?: Archetype | null;
  entityID?: EntityID | null;
  faction?: Faction | null;
  gender?: Gender | null;
  id?: CharacterID | null;
  maxBlood?: Decimal | null;
  maxHealth?: Decimal | null;
  maxPanic?: Decimal | null;
  maxStamina?: Decimal | null;
  name?: NormalizedString | null;
  order?: GroupID | null;
  progression?: ProgressionComponentGQLField | null;
  race?: Race | null;
  session?: SessionStatsField | null;
  stats?: (CharacterStatField | null)[] | null;
  traits?: (Trait | null)[] | null;
}
/** ServerLib.GraphQL.Models.AbilityGQL */
export interface Ability {
  abilityComponents?: (AbilityComponentDefRef | null)[] | null;
  abilityNetwork?: AbilityNetworkDefRef | null;
  description?: string | null;
  icon?: string | null;
  id?: AbilityInstanceID | null;
  name?: string | null;
  readOnly?: boolean | null;
  tracks?: AbilityTracks | null;
}
/** World.Cogs.Abilities.AbilityComponentDefRef */
export interface AbilityComponentDefRef {
  abilityComponentCategory?: AbilityComponentCategoryDefRef | null;
  abilityTags?: (string | null)[] | null;
  display?: DisplayInfoDef | null;
  id?: string | null;
  networkRequirements?: (AbilityNetworkRequirementGQL | null)[] | null;
  progression?: AbilityComponentProgressionDef | null;
}
/** World.Cogs.Abilities.AbilityComponentCategoryDefRef */
export interface AbilityComponentCategoryDefRef {
  displayInfo?: DisplayInfoDef | null;
  displayOption?: AbilityComponentCategoryDisplay | null;
  id?: string | null;
  isPrimary?: boolean | null;
  isRequired?: boolean | null;
}
/** World.Abilities.DisplayInfoDef */
export interface DisplayInfoDef {
  description?: string | null;
  iconClass?: string | null;
  iconURL?: string | null;
  name?: string | null;
}
/** World.Abilities.AbilityNetworkRequirementGQL */
export interface AbilityNetworkRequirementGQL {
  excludeComponent?: ExcludeAbilityComponentDef | null;
  excludeTag?: ExcludeTagDef | null;
  requireComponent?: RequireAbilityComponentDef | null;
  requireTag?: RequireTagDef | null;
}
/** World.Abilities.ExcludeAbilityComponentDef */
export interface ExcludeAbilityComponentDef {
  component?: AbilityComponentDefRef | null;
}
/** World.Abilities.ExcludeTagDef */
export interface ExcludeTagDef {
  tag?: string | null;
}
/** World.Abilities.RequireAbilityComponentDef */
export interface RequireAbilityComponentDef {
  component?: AbilityComponentDefRef | null;
}
/** World.Abilities.RequireTagDef */
export interface RequireTagDef {
  tag?: string | null;
}
/** World.AbilityComponentProgressionDef */
export interface AbilityComponentProgressionDef {
  levels?: AbilityComponentLevelTableDefRef | null;
  requirements?: (AbilityComponentProgressionRequirementGQL | null)[] | null;
}
/** World.AbilityComponentLevelTableDefRef */
export interface AbilityComponentLevelTableDefRef {
  id?: string | null;
  levels?: (Level | null)[] | null;
}
/** World.AbilityComponentLevelTableDef+Level */
export interface Level {
  levelNumber?: number | null;
  progressionForLevel?: number | null;
}
/** World.AbilityComponentProgressionRequirementGQL */
export interface AbilityComponentProgressionRequirementGQL {
  maxLevel?: OtherComponentAtMaxLevelRequirementDef | null;
}
/** World.OtherComponentAtMaxLevelRequirementDef */
export interface OtherComponentAtMaxLevelRequirementDef {
  otherComponent?: AbilityComponentDefRef | null;
}
/** World.Cogs.Abilities.AbilityNetworkDefRef */
export interface AbilityNetworkDefRef {
  componentCategories?: (AbilityComponentCategoryDefRef | null)[] | null;
  display?: DisplayInfoDef | null;
  id?: string | null;
}
/** CU.Databases.Models.ProgressionComponentGQLField */
export interface ProgressionComponentGQLField {
  abilityComponents?: (AbilityComponentProgressionGQLField | null)[] | null;
  characterStats?: (CharacterStatProgressionGQLField | null)[] | null;
}
/** CU.Databases.Models.AbilityComponentProgressionGQLField */
export interface AbilityComponentProgressionGQLField {
  abilityComponentID?: string | null;
  level?: number | null;
  progressionPoints?: number | null;
}
/** CU.Databases.Models.CharacterStatProgressionGQLField */
export interface CharacterStatProgressionGQLField {
  bonusPoints?: number | null;
  progressionPoints?: number | null;
  stat?: Stat | null;
}
/** ServerLib.SessionStatsField */
export interface SessionStatsField {
  sessionStartDate?: string | null;
  sessionStartTicks?: Decimal | null;
  skillPartsUsed?: (SkillPartsUsedField | null)[] | null;
}
/** ServerLib.SkillPartsUsedField */
export interface SkillPartsUsedField {
  skillPart?: AbilityComponentGQL | null;
  timesUsed?: number | null;
}
/** ServerLib.AbilityComponentGQL */
export interface AbilityComponentGQL {
  description?: string | null;
  icon?: string | null;
  id?: string | null;
  name?: string | null;
}
/** ServerLib.CharacterStatField */
export interface CharacterStatField {
  description?: string | null;
  stat?: Stat | null;
  value?: Decimal | null;
}
/** World.Trait */
export interface Trait {
  category?: TraitCategory | null /** Category */;
  description?: string | null /** The description of this trait */;
  exclusives?: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  icon?: string | null /** Url for the icon for this trait */;
  id?: string | null;
  name?: string | null /** The name of this trait */;
  points?: number | null /** The point value of this trait */;
  prerequisites?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required?: boolean | null /** Whether or not this is a required trait. */;
  specifier?:
    | string
    | null /** Specifies the defining type based on category */;
}
/** World.ExclusiveTraitsInfo */
export interface ExclusiveTraitsInfo {
  ids?: (string | null)[] | null;
  maxAllowed?: number | null;
  minRequired?: number | null;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {
  servers?: (ServerModel | null)[] | null;
}
/** ServerLib.ApiModels.ServerModel */
export interface ServerModel {
  accessLevel?: AccessType | null;
  apiHost?: string | null;
  channelID?: number | null;
  channelPatchPermissions?: number | null;
  host?: string | null;
  name?: string | null;
  playerMaximum?: number | null;
  shardID?: number | null;
  status?: ServerStatus | null;
}
/** ServerLib.Crafting.CraftingRecipes */
export interface CraftingRecipes {
  blockRecipes?:
    | (BlockRecipeDefRef | null)[]
    | null /** List of recipes for the Block vox job */;
  grindRecipes?:
    | (GrindRecipeDefRef | null)[]
    | null /** List of recipes for the Grind vox job */;
  makeRecipes?:
    | (MakeRecipeDefRef | null)[]
    | null /** List of recipes for the Make vox job */;
  nearestVoxEntityID?: EntityID | null /** Entity ID of the closest vox that can be crafted with */;
  purifyRecipes?:
    | (PurifyRecipeDefRef | null)[]
    | null /** List of recipes for the Purify vox job */;
  shapeRecipes?:
    | (ShapeRecipeDefRef | null)[]
    | null /** List of recipes for the Shape vox job which have been discovered by the player.  Shape recipes are discovered when the right combination of materials are added to a vox during a shape job. */;
  voxJobGroupLog?: (VoxJobGroupLogDBModel | null)[] | null;
  voxJobGroupLogs?: (VoxJobGroupLogDBModel | null)[] | null;
  voxJobLogCount?: number | null;
  voxJobLogs?: (VoxJobLogDBModel | null)[] | null;
  voxNotes?: (VoxNotesDBModel | null)[] | null;
}
/** World.BlockRecipeDefRef */
export interface BlockRecipeDefRef {
  id?: string | null /** Unique recipe identifier */;
  ingredients?:
    | (RecipeIngredientDef | null)[]
    | null /** Ingredient rules for crafting the item */;
  outputItem?: ItemDefRef | null /** The template of the block item which will be produced by this recipe */;
}
/** World.RecipeIngredientDef */
export interface RecipeIngredientDef {
  ingredient?: ItemDefRef | null /** The item required by this part of the recipe */;
  maxQuality?: Decimal | null /** The maximum quality the ingredient must be.  Value is 0-1 */;
  maxUnitCount?:
    | number
    | null /** The maximum units of this item that must be provided. Note that multiple sets of final product can be produced given sufficient amounts of all ingredients */;
  minQuality?: Decimal | null /** The minimum quality the ingredient must be.  Value is 0-1 */;
  minUnitCount?:
    | number
    | null /** The minimum units of this item that must be provided */;
  requirement?: ItemRequirementByStringIDDefRef | null /** Extra requirements on the item, not used if the ingredient is provided. */;
}
/** World.ItemDefRef */
export interface ItemDefRef {
  alloyDefinition?: AlloyDefRef | null /** Alloy information for this item definition */;
  defaultResourceID?: string | null;
  deploySettings?: DeploySettingsDefRef | null;
  description?: string | null /** Description of the item */;
  gearSlotSets?:
    | (GearSlotSet | null)[]
    | null /** the sets of gear slots this item can be equipped to */;
  iconUrl?: string | null /** URL to the item's icon */;
  id?: string | null /** Unique item identifier */;
  isPlotDeed?: boolean | null;
  isStackableItem?: boolean | null;
  isVox?: boolean | null;
  isVoxToken?: boolean | null;
  itemType?: ItemType | null /** The type of item */;
  name?: string | null /** Name of the item */;
  numericItemDefID?: number | null;
  substanceDefinition?: SubstanceDefRef | null /** Substance information for this item definition */;
  tags?:
    | (string | null)[]
    | null /** Tags on this item, these can be referenced by recipes */;
}
/** World.AlloyDefRef */
export interface AlloyDefRef {
  id?: string | null;
  subType?: string | null;
  type?: string | null;
}
/** World.DeploySettingsDefRef */
export interface DeploySettingsDefRef {
  alwaysShowOnMap?: boolean | null;
  isDoor?: boolean | null;
  itemPlacementType?: ItemPlacementType | null;
  itemTemplateType?: ItemTemplateType | null;
  mapIconAnchorX?: Decimal | null;
  mapIconAnchorY?: Decimal | null;
  mapIconURL?: string | null;
  maxPitch?: Decimal | null;
  maxTerrainPitch?: Decimal | null;
  plotSize?: string | null;
  requiredZoneType?: ZoneType | null;
  resourceID?: string | null;
  rotatePitch?: boolean | null;
  rotateRoll?: boolean | null;
  rotateYaw?: boolean | null;
  skipDeployLimitCheck?: boolean | null;
  snapToGround?: boolean | null;
}
/** World.GearSlotSet */
export interface GearSlotSet {
  gearSlots?:
    | (GearSlotDefRef | null)[]
    | null /** A list of gear slots which makes up a valid set of places a item can be equipped on at once. */;
}
/** World.GearSlotDefRef */
export interface GearSlotDefRef {
  gearSlotType?: GearSlotType | null /** Which type of slot this is */;
  id?: string | null /** Unique gear slot identifier */;
}
/** World.SubstanceDefRef */
export interface SubstanceDefRef {
  id?: string | null /** The unique identifier for this substance */;
  maxQuality?: Decimal | null /** the maximum quality this substance comes in */;
  minQuality?: Decimal | null /** the minimum quality this substance comes in */;
  purifyItemDef?: ItemDefRef | null;
  type?: string | null /** The type of substance. Ex.) Metal, Flesh, etc. */;
}
/** World.Cogs.ItemRequirementByStringIDDefRef */
export interface ItemRequirementByStringIDDefRef {
  condition?: string | null;
  description?: string | null;
  errorDescription?: string | null;
  iconURL?: string | null;
  id?: string | null;
}
/** World.GrindRecipeDefRef */
export interface GrindRecipeDefRef {
  id?: string | null /** Unique recipe identifier */;
  ingredientItem?: ItemDefRef | null /** Required item template of the ingredient */;
  outputItem?: ItemDefRef | null /** Item template for the item produced by this recipe */;
}
/** World.MakeRecipeDefRef */
export interface MakeRecipeDefRef {
  id?: string | null /** Unique recipe identifier */;
  ingredients?: (MakeIngredientDef | null)[] | null /** Ingredient rules */;
  outputItem?: ItemDefRef | null /** The item this recipe creates */;
}
/** World.MakeIngredientDef */
export interface MakeIngredientDef {
  ingredient?: ItemDefRef | null /** The specific ingredient required by this ingredient rule.  If this is empty, the recipe does not required a specific item. */;
  maxQuality?: Decimal | null /** The maximum quality the ingredient must be.  Value is 0-1 */;
  minQuality?: Decimal | null /** The minimum quality the ingredient must be.  Value is 0-1 */;
  requirement?: ItemRequirementByStringIDDefRef | null /** Extra requirements on the item, not used if the ingredient is provided. */;
  slot?: SubItemSlot | null /** The name of the slot this ingredient will go in */;
  unitCount?:
    | number
    | null /** How many of this item are required to create one copy of the output item */;
}
/** World.PurifyRecipeDefRef */
export interface PurifyRecipeDefRef {
  id?: string | null /** Unique recipe identifier */;
  ingredientItem?: ItemDefRef | null /** Required item template of the ingredient */;
  outputItem?: ItemDefRef | null /** Item template for the item produced by this recipe */;
}
/** World.ShapeRecipeDefRef */
export interface ShapeRecipeDefRef {
  id?: string | null /** Unique recipe identifier */;
  infuseAmountAllowed?: Decimal | null;
  infusionSlots?: number | null;
  ingredients?:
    | (RecipeIngredientDef | null)[]
    | null /** Input ingredients required for this recipe */;
  lossPercent?: Decimal | null /** What percentage of the substances added to the crafting job will be lost in the crafting process */;
  outputItem?: ItemDefRef | null /** The item template for the item produced by this recipe */;
  realmUse?: (Faction | null)[] | null;
}
/** CU.Databases.Models.Items.VoxJobGroupLogDBModel */
export interface VoxJobGroupLogDBModel {
  crafterID?: CharacterID | null;
  favorite?: boolean | null;
  jobIdentifier?: string | null;
  jobType?: VoxJobType | null;
  lastCrafted?: string | null;
  notes?: string | null;
  timesCrafted?: number | null;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel */
export interface VoxJobLogDBModel {
  crafterID?: CharacterID | null;
  dateEnded?: string | null;
  dateStarted?: string | null;
  favorite?: boolean | null;
  id?: VoxJobInstanceID | null;
  inputItems?: (Item | null)[] | null;
  itemHash?: ItemStackHash | null;
  jobIdentifier?: string | null;
  jobType?: VoxJobType | null;
  notes?: string | null;
  outputItems?: (OutputItem | null)[] | null;
  voxHealthCost?: number | null;
}
/** World.Item */
export interface Item {
  actions?: (ItemActionDefGQL | null)[] | null;
  containerColor?: ColorRGBA | null /** the UI color for the container UI */;
  containerDrawers?: (ContainerDrawerGQL | null)[] | null;
  debugname?:
    | string
    | null /** name of the item which includes some basic item information */;
  equiprequirement?: ItemEquipRequirement | null /** information about if this item can be equipped. */;
  givenName?: string | null /** Custom name given to item at crafting item */;
  hasSubItems?: boolean | null /** if this item has sub items */;
  id?: ItemInstanceID | null /** Unique instance ID for item. */;
  location?: ItemLocationDescription | null /** details about the location of the item */;
  permissibleHolder?: FlagsPermissibleHolderGQL | null;
  scenarioRelationship?: ScenarioRelationship | null;
  shardID?: ShardID | null;
  stackHash?: ItemStackHash | null /** Identifies items that are of the same type and have the same stats. */;
  staticDefinition?: ItemDefRef | null /** The definition for the item. */;
  stats?: ItemStatsDescription | null /** stats of this item */;
  voxStatus?: VoxStatus | null /** The status of the nearest vox belonging to your player */;
}
/** World.ItemActionDefGQL */
export interface ItemActionDefGQL {
  cooldownSeconds?: Decimal | null;
  disabledDescription?: string | null;
  enabled?: boolean | null;
  id?: string | null;
  interactionPointFilter?: (BoneAlias | null)[] | null;
  lastTimePerformed?: string | null;
  name?: string | null;
  showWhenDisabled?: boolean | null;
  uIReaction?: ItemActionUIReaction | null;
}
/** CU.Databases.ColorRGBA */
export interface ColorRGBA {
  a?: Decimal | null;
  b?: number | null;
  g?: number | null;
  hex?: string | null /** Color in Hex format */;
  hexa?: string | null /** Color in Hex format with alpha */;
  r?: number | null;
  rgba?: string | null /** Color in RGBA format */;
}
/** ServerLib.ContainerDrawerGQL */
export interface ContainerDrawerGQL {
  containedItems?: (Item | null)[] | null;
  id?: ContainerDrawerID | null;
  requirements?: RequirementDef | null;
  stats?: ContainerDefStat_Single | null;
}
/** World.RequirementDef */
export interface RequirementDef {
  description?: string | null;
  icon?: string | null;
}

export interface ContainerDefStat_Single {
  maxItemCount?: Decimal | null /** MaxItemCount */;
  maxItemMass?: Decimal | null /** MaxItemMass */;
}
/** World.Items.ItemEquipRequirement */
export interface ItemEquipRequirement {
  errorDescription?: string | null;
  requirementDescription?: string | null;
  status?: EquipRequirementStatus | null;
}
/** World.Items.ItemLocationDescription */
export interface ItemLocationDescription {
  building?: BuildingPlacedLocation | null /** Location filled if this item in a building place object */;
  equipped?: EquippedLocation | null /** Location filled if this item is equipped */;
  ground?: OnGroundLocation | null /** Location filled if this item in on the ground */;
  inContainer?: InContainerLocation | null /** Location filled if this item is in a container */;
  inventory?: InventoryLocation | null /** Location filled if this item is in a player's inventory */;
  inVox?: InVoxJobLocation | null /** Location filled if this item is in a vox */;
}
/** World.BuildingPlacedLocation */
export interface BuildingPlacedLocation {
  buildingID?: BuildingPlotInstanceID | null;
}
/** World.EquippedLocation */
export interface EquippedLocation {
  characterID?: CharacterID | null /** The character the item is equipped on */;
  gearSlots?:
    | (GearSlotDefRef | null)[]
    | null /** The gear slots the item is equipped to */;
}
/** World.OnGroundLocation */
export interface OnGroundLocation {
  groupID?: ItemInstanceID | null /** The group id set for stacked ground items */;
  isDeployed?: boolean | null;
}
/** World.InContainerLocation */
export interface InContainerLocation {
  containerInstanceID?: ItemInstanceID | null /** The item ID of the container this item is in */;
  drawerID?: ContainerDrawerID | null /** The drawer this item is in */;
  position?: number | null /** The UI position of the item */;
}
/** World.InventoryLocation */
export interface InventoryLocation {
  characterID?: CharacterID | null /** The character that has this item in their inventory */;
  position?: number | null /** The UI position of the item */;
}
/** World.InVoxJobLocation */
export interface InVoxJobLocation {
  itemSlot?: SubItemSlot | null /** The slot this item is associated with the recipe */;
  voxInstanceID?: ItemInstanceID | null /** The item ID of the vox this item is contained in */;
  voxJobInstanceID?: VoxJobInstanceID | null /** The id of the job this item is contained in */;
}
/** World.ScenarioRelationship */
export interface ScenarioRelationship {
  restrictedToScenario?: boolean | null;
  scenarioID?: ScenarioInstanceID | null;
}
/** World.Items.ItemStatsDescription */
export interface ItemStatsDescription {
  alloy?: AlloyStat_Single | null /** Alloy specific stats */;
  armor?: ArmorStat_Single | null;
  block?: BuildingBlockStat_Single | null /** Block specific stats */;
  damageResistances?: DamageType_Single | null /** Resistances which effect how much damage this item takes */;
  deploy?: DeployStat_Single | null /** Deploy specific stats */;
  durability?: DurabilityStat_Single | null /** Durability specific stats */;
  item?: ItemStat_Single | null /** Stats shared by all types of items */;
  resistances?: DamageType_Single | null /** Resistances which are added the entity wearing the item */;
  siegeEngine?: SiegeEngineStat_Single | null /** Siege engine specific stats */;
  substance?: SubstanceStat_Single | null /** Substance specific stats */;
  weapon?: WeaponStat_Single | null /** Weapon specific stats */;
}

export interface AlloyStat_Single {
  agilityRequirementBonus?: Decimal | null /** AgilityRequirementBonus */;
  armorClassBonus?: Decimal | null /** ArmorClassBonus */;
  attunementRequirementBonus?: Decimal | null /** AttunementRequirementBonus */;
  crushingDamageBonus?: Decimal | null /** CrushingDamageBonus */;
  deflectionAmountBonus?: Decimal | null /** DeflectionAmountBonus */;
  deflectionRecoveryBonus?: Decimal | null /** DeflectionRecoveryBonus */;
  densityBonus?: Decimal | null /** DensityBonus */;
  dexterityRequirementBonus?: Decimal | null /** DexterityRequirementBonus */;
  distruptionBonus?: Decimal | null /** DistruptionBonus */;
  encumbranceBonus?: Decimal | null /** EncumbranceBonus */;
  enduranceRequirementBonus?: Decimal | null /** EnduranceRequirementBonus */;
  faithRequirementBonus?: Decimal | null /** FaithRequirementBonus */;
  fallbackCrushingDamageBonus?: Decimal | null /** FallbackCrushingDamageBonus */;
  falloffMaxDistanceBonus?: Decimal | null /** FalloffMaxDistanceBonus */;
  falloffMinDistanceBonus?: Decimal | null /** FalloffMinDistanceBonus */;
  falloffReductionBonus?: Decimal | null /** FalloffReductionBonus */;
  fractureBonus?: Decimal | null /** FractureBonus */;
  fractureChanceBonus?: Decimal | null /** FractureChanceBonus */;
  fractureThresholdBonus?: Decimal | null /** FractureThresholdBonus */;
  hardnessBonus?: Decimal | null /** HardnessBonus */;
  healthLossPerUseBonus?: Decimal | null /** HealthLossPerUseBonus */;
  knockbackAmountBonus?: Decimal | null /** KnockbackAmountBonus */;
  malleabilityBonus?: Decimal | null /** MalleabilityBonus */;
  massBonus?: Decimal | null /** MassBonus */;
  maxHealthBonus?: Decimal | null /** MaxHealthBonus */;
  maxRepairPointsBonus?: Decimal | null /** MaxRepairPointsBonus */;
  meltingPointBonus?: Decimal | null /** MeltingPointBonus */;
  mitigateBonus?: Decimal | null /** MitigateBonus */;
  physicalPreparationTimeBonus?: Decimal | null /** PhysicalPreparationTimeBonus */;
  physicalProjectileSpeedBonus?: Decimal | null /** PhysicalProjectileSpeedBonus */;
  physicalRecoveryTimeBonus?: Decimal | null /** PhysicalRecoveryTimeBonus */;
  piercingArmorPenetrationBonus?: Decimal | null /** PiercingArmorPenetrationBonus */;
  piercingBleedBonus?: Decimal | null /** PiercingBleedBonus */;
  piercingDamageBonus?: Decimal | null /** PiercingDamageBonus */;
  resistAcidBonus?: Decimal | null /** ResistAcidBonus */;
  resistAirBonus?: Decimal | null /** ResistAirBonus */;
  resistArcaneBonus?: Decimal | null /** ResistArcaneBonus */;
  resistChaosBonus?: Decimal | null /** ResistChaosBonus */;
  resistCrushingBonus?: Decimal | null /** ResistCrushingBonus */;
  resistDeathBonus?: Decimal | null /** ResistDeathBonus */;
  resistDiseaseBonus?: Decimal | null /** ResistDiseaseBonus */;
  resistEarthBonus?: Decimal | null /** ResistEarthBonus */;
  resistFireBonus?: Decimal | null /** ResistFireBonus */;
  resistFrostBonus?: Decimal | null /** ResistFrostBonus */;
  resistLifeBonus?: Decimal | null /** ResistLifeBonus */;
  resistLightningBonus?: Decimal | null /** ResistLightningBonus */;
  resistMindBonus?: Decimal | null /** ResistMindBonus */;
  resistPiercingBonus?: Decimal | null /** ResistPiercingBonus */;
  resistPoisonBonus?: Decimal | null /** ResistPoisonBonus */;
  resistRadiantBonus?: Decimal | null /** ResistRadiantBonus */;
  resistShadowBonus?: Decimal | null /** ResistShadowBonus */;
  resistSlashingBonus?: Decimal | null /** ResistSlashingBonus */;
  resistSpiritBonus?: Decimal | null /** ResistSpiritBonus */;
  resistVoidBonus?: Decimal | null /** ResistVoidBonus */;
  resistWaterBonus?: Decimal | null /** ResistWaterBonus */;
  resonanceRequirementBonus?: Decimal | null /** ResonanceRequirementBonus */;
  slashingArmorPenetrationBonus?: Decimal | null /** SlashingArmorPenetrationBonus */;
  slashingBleedBonus?: Decimal | null /** SlashingBleedBonus */;
  slashingDamageBonus?: Decimal | null /** SlashingDamageBonus */;
  stabilityBonus?: Decimal | null /** StabilityBonus */;
  staminaCostBonus?: Decimal | null /** StaminaCostBonus */;
  strengthRequirementBonus?: Decimal | null /** StrengthRequirementBonus */;
  unitHealth?: Decimal | null /** UnitHealth */;
  unitMass?: Decimal | null /** UnitMass */;
  vitalityRequirementBonus?: Decimal | null /** VitalityRequirementBonus */;
  weightBonus?: Decimal | null /** WeightBonus */;
  willRequirementBonus?: Decimal | null /** WillRequirementBonus */;
}

export interface ArmorStat_Single {
  armorClass?: Decimal | null /** ArmorClass */;
}

export interface BuildingBlockStat_Single {
  buildTimeUnits?: Decimal | null /** BuildTimeUnits */;
  compressiveStrength?: Decimal | null /** CompressiveStrength */;
  density?: Decimal | null /** Density */;
  healthUnits?: Decimal | null /** HealthUnits */;
  shearStrength?: Decimal | null /** ShearStrength */;
  tensileStrength?: Decimal | null /** TensileStrength */;
  unitMass?: Decimal | null /** UnitMass */;
}

export interface DamageType_Single {
  acid?: Decimal | null /** Acid */;
  air?: Decimal | null /** Air */;
  all?: Decimal | null /** All */;
  arcane?: Decimal | null /** Arcane */;
  chaos?: Decimal | null /** Chaos */;
  corruption?: Decimal | null /** Corruption */;
  crushing?: Decimal | null /** Crushing */;
  dark?: Decimal | null /** Dark */;
  death?: Decimal | null /** Death */;
  disease?: Decimal | null /** Disease */;
  earth?: Decimal | null /** Earth */;
  elemental?: Decimal | null /** Elemental */;
  fire?: Decimal | null /** Fire */;
  frost?: Decimal | null /** Frost */;
  life?: Decimal | null /** Life */;
  light?: Decimal | null /** Light */;
  lightning?: Decimal | null /** Lightning */;
  mind?: Decimal | null /** Mind */;
  none?: Decimal | null /** None */;
  physical?: Decimal | null /** Physical */;
  piercing?: Decimal | null /** Piercing */;
  poison?: Decimal | null /** Poison */;
  radiant?: Decimal | null /** Radiant */;
  shadow?: Decimal | null /** Shadow */;
  slashing?: Decimal | null /** Slashing */;
  spirit?: Decimal | null /** Spirit */;
  sYSTEM?: Decimal | null /** SYSTEM */;
  void?: Decimal | null /** Void */;
  water?: Decimal | null /** Water */;
}

export interface DeployStat_Single {
  currentEnergy?: Decimal | null /** CurrentEnergy */;
  maxEnergy?: Decimal | null /** MaxEnergy */;
  readySeconds?: Decimal | null /** ReadySeconds */;
  readyStability?: Decimal | null /** ReadyStability */;
  unreadySeconds?: Decimal | null /** UnreadySeconds */;
  unreadyStability?: Decimal | null /** UnreadyStability */;
}

export interface DurabilityStat_Single {
  currentHealth?: Decimal | null /** The current health on this item. This value is reduced when the item is used or attacked. */;
  currentRepairPoints?: Decimal | null /** The current number of repair points remaining on this item. This value will be reduced when the item is repaired */;
  fractureChance?: Decimal | null /** FractureChance */;
  fractureThreshold?: Decimal | null /** FractureThreshold */;
  healthLossPerUse?: Decimal | null /** Factor used to decide how much health the item will lose each time it is used. */;
  maxHealth?: Decimal | null /** The amount of health this item was created at and will be restored to each time it is repaired */;
  maxRepairPoints?: Decimal | null /** The number of repair points this item was created at */;
}

export interface ItemStat_Single {
  agilityRequirement?: Decimal | null /** The agility stat requirement that must be met to equip this item */;
  attunementRequirement?: Decimal | null /** The attunement stat requirement that must be met to equip this item */;
  dexterityRequirement?: Decimal | null /** The dexterity stat requirement that must be met to equip this item */;
  encumbrance?: Decimal | null /** The encumbrance of an item is used while the item is equipped to encumber the player equipping the item */;
  enduranceRequirement?: Decimal | null /** The endurance stat requirement that must be met to equip this item */;
  faithRequirement?: Decimal | null /** The faith stat requirement that must be met to equip this item */;
  nestedItemCount?: Decimal | null /** The number of items that are nested under this one.  Either as container contents or vox ingredients. */;
  quality?: Decimal | null /** The quality of the item, this will be a value between 0-1 */;
  resonanceRequirement?: Decimal | null /** The resonance stat requirement that must be met to equip this item */;
  selfMass?: Decimal | null /** The mass of the item without the mass of anything inside of it */;
  strengthRequirement?: Decimal | null /** The strength stat requirement that must be met to equip this item */;
  totalMass?: Decimal | null /** The mass of the item and anything inside of it */;
  unitCount?: Decimal | null /** The stack count on this item.  For items which do not stack, this value will always be 1. */;
  unitMass?: Decimal | null /** The mass of one unit of this item */;
  vitalityRequirement?: Decimal | null /** The vitality stat requirement that must be met to equip this item */;
  willRequirement?: Decimal | null /** The will stat requirement that must be met to equip this item */;
}

export interface SiegeEngineStat_Single {
  pitchSpeedDegPerSec?: Decimal | null /** PitchSpeedDegPerSec */;
  yawSpeedDegPerSec?: Decimal | null /** YawSpeedDegPerSec */;
}

export interface SubstanceStat_Single {
  elasticity?: Decimal | null /** Elasticity */;
  fractureChance?: Decimal | null /** FractureChance */;
  hardnessFactor?: Decimal | null /** HardnessFactor */;
  magicalResistance?: Decimal | null /** MagicalResistance */;
  massFactor?: Decimal | null /** MassFactor */;
  meltingPoint?: Decimal | null /** MeltingPoint */;
  unitHealth?: Decimal | null /** UnitHealth */;
  unitMass?: Decimal | null /** UnitMass */;
}

export interface WeaponStat_Single {
  crushingDamage?: Decimal | null /** CrushingDamage */;
  deflectionAmount?: Decimal | null /** DeflectionAmount */;
  deflectionRecovery?: Decimal | null /** DeflectionRecovery */;
  disruption?: Decimal | null /** Disruption */;
  fallbackCrushingDamage?: Decimal | null /** FallbackCrushingDamage */;
  falloffMaxDistance?: Decimal | null /** FalloffMaxDistance */;
  falloffMinDistance?: Decimal | null /** FalloffMinDistance */;
  falloffReduction?: Decimal | null /** FalloffReduction */;
  knockbackAmount?: Decimal | null /** KnockbackAmount */;
  magicPower?: Decimal | null /** MagicPower */;
  physicalPreparationTime?: Decimal | null /** PhysicalPreparationTime */;
  physicalProjectileSpeed?: Decimal | null /** PhysicalProjectileSpeed */;
  physicalRecoveryTime?: Decimal | null /** PhysicalRecoveryTime */;
  piercingArmorPenetration?: Decimal | null /** PiercingArmorPenetration */;
  piercingBleed?: Decimal | null /** PiercingBleed */;
  piercingDamage?: Decimal | null /** PiercingDamage */;
  range?: Decimal | null /** Range */;
  slashingArmorPenetration?: Decimal | null /** SlashingArmorPenetration */;
  slashingBleed?: Decimal | null /** SlashingBleed */;
  slashingDamage?: Decimal | null /** SlashingDamage */;
  stability?: Decimal | null /** Stability */;
  staminaCost?: Decimal | null /** StaminaCost */;
}
/** World.VoxStatus */
export interface VoxStatus {
  jobs?: (VoxJobStatus | null)[] | null;
}
/** World.VoxJobStatus */
export interface VoxJobStatus {
  blockRecipe?: BlockRecipeDefRef | null /** The block recipe details. Only for Block jobs */;
  endQuality?: Decimal | null /** The player specified end quality for a substance. Only for Purify jobs */;
  givenName?:
    | string
    | null /** The custom name for the item being produced. Only for Make jobs */;
  grindRecipe?: GrindRecipeDefRef | null /** The grind recipe details. Only for Grind jobs */;
  id?: VoxJobInstanceID | null;
  ingredients?:
    | (Item | null)[]
    | null /** A list of all ingredients that are currently stored in the vox.  These are destroyed at the end of the job */;
  itemCount?: number | null /** How many item to make. Only for Make jobs */;
  jobState?: VoxJobState | null /** The current state the job is in. */;
  jobType?: VoxJobType | null /** Which type of crafting job is currently being utilized */;
  makeRecipe?: MakeRecipeDefRef | null /** The make recipe details. Only for Make jobs */;
  outputItems?:
    | (VoxJobOutputItem | null)[]
    | null /** The list of all items which will be rewarded when the vox job is completed.  This information is only available is job is fully configured and ready to run */;
  possibleIngredients?:
    | (Item | null)[]
    | null /** List of inventory items compatible with the current vox job */;
  possibleIngredientsWithSlots?:
    | (PossibleVoxIngredientGQL | null)[]
    | null /** List of inventory items compatible with the current vox job */;
  possibleItemSlots?:
    | (SubItemSlot | null)[]
    | null /** List of sub item slots this vox job uses */;
  purifyRecipe?: PurifyRecipeDefRef | null /** The purify recipe details. Only for Purify jobs */;
  recipeID?:
    | string
    | null /** The ID of the recipe which will be performed.  This could be one of serveral types of recipes depending on the vox job type */;
  recipesMatchingIngredients?:
    | (string | null)[]
    | null /** ID's of recipes which match the current ingredient list in the vox */;
  shapeRecipe?: ShapeRecipeDefRef | null /** The shape recipe details. Only for Shape jobs */;
  startTime?:
    | string
    | null /** What time the job was started.  The job must be in the Running or Finished state for this information to be valid. */;
  timeRemaining?: Decimal | null /** The total seconds remaining for this job to finish.  This information is only valid while the job is running. */;
  totalCraftingTime?: Decimal | null /** How long the job will take to run.  This information is only available is job is fully configured and ready to run */;
  usedRepairPoints?:
    | number
    | null /** How many repair points will be used when repairing the item. Only for Repair jobs */;
  voxHealthCost?:
    | number
    | null /** How much damage the vox will take from performing this job. */;
}
/** CU.Databases.Models.Items.VoxJobOutputItem */
export interface VoxJobOutputItem {
  item?: Item | null;
  outputItemType?: VoxJobOutputItemType | null;
}
/** World.PossibleVoxIngredientGQL */
export interface PossibleVoxIngredientGQL {
  item?: Item | null;
  slots?: (SubItemSlot | null)[] | null;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel+OutputItem */
export interface OutputItem {
  item?: Item | null;
  outputItemType?: VoxJobOutputItemType | null;
}
/** CU.Databases.Models.Items.VoxNotesDBModel */
export interface VoxNotesDBModel {
  characterID?: CharacterID | null;
  created?: string | null;
  id?: VoxNotesInstanceID | null;
  lastEdited?: string | null;
  notes?: string | null;
}
/** ServerLib.Items.EntityItemResult */
export interface EntityItemResult {
  items?:
    | (Item | null)[]
    | null /** List of items contained within this item.  This includes wrapped items, inventory, and equipment items */;
}
/** ServerLib.Game.GameDefsGQLData */
export interface GameDefsGQLData {
  abilityComponentLevelTables?:
    | (AbilityComponentLevelTableDefRef | null)[]
    | null /** All abilty component level tables */;
  abilityComponents?:
    | (AbilityComponentDefRef | null)[]
    | null /** All possible ability components for the game or a particular class */;
  abilityNetworks?:
    | (AbilityNetworkDefRef | null)[]
    | null /** All possible ability networks */;
  baseStatValues?:
    | (StatBonusGQL | null)[]
    | null /** Base stat values which apply to all races */;
  class?: ClassDef | null /** Static information about a specific class */;
  item?: ItemDefRef | null /** Static information about a specific item */;
  items?: (ItemDefRef | null)[] | null /** Static information about items */;
  raceStatMods?:
    | (RaceStatBonuses | null)[]
    | null /** Stat modifiers that are applied additively to the base stat value for each Race */;
  stats?:
    | (StatDefinitionGQL | null)[]
    | null /** Array of definitions for all available stats */;
}
/** ServerLib.Game.StatBonusGQL */
export interface StatBonusGQL {
  amount?: Decimal | null;
  stat?: Stat | null;
}
/** World.Cogs.ClassDef */
export interface ClassDef {
  archetype?: Archetype | null;
  buildableAbilityNetworks?: (AbilityNetworkDefRef | null)[] | null;
  faction?: Faction | null;
  id?: string | null;
}
/** ServerLib.Game.RaceStatBonuses */
export interface RaceStatBonuses {
  race?: Race | null;
  statBonuses?: (StatBonusGQL | null)[] | null;
}
/** ServerLib.Game.StatDefinitionGQL */
export interface StatDefinitionGQL {
  addPointsAtCharacterCreation?: boolean | null;
  description?: string | null;
  id?: Stat | null;
  name?: string | null;
  operation?: string | null;
  showAtCharacterCreation?: boolean | null;
  statType?: StatType | null;
}
/** CU.Groups.Invite */
export interface Invite {
  code?: InviteCode | null;
  created?: string | null;
  durationTicks?: number | null;
  forGroup?: GroupID | null;
  forGroupName?: string | null;
  forGroupType?: GroupTypes | null;
  fromName?: string | null;
  maxUses?: number | null;
  shard?: ShardID | null;
  status?: InviteStatus | null;
  targetsID128?: TargetID | null;
  uses?: number | null;
}
/** ServerLib.MetricsData */
export interface MetricsData {
  currentPlayerCount?: PlayerCount | null;
  playerCounts?: (PlayerCount | null)[] | null;
}
/** ServerLib.PlayerCount */
export interface PlayerCount {
  arthurian?: number | null;
  bots?: number | null;
  timeTicks?: number | null;
  total?: number | null;
  tuatha?: number | null;
  viking?: number | null;
}
/** CU.Databases.Models.Content.MessageOfTheDay */
export interface MessageOfTheDay {
  channels?:
    | (number | null)[]
    | null /** Which channels will this patch note be presented on. */;
  htmlContent?: string | null /** HTML Content for the message of the day. */;
  id?: string | null;
  jSONContent?:
    | string
    | null /** JSON data about the HTML Content for the message of the day */;
  title?: string | null;
  utcCreated?: string | null;
  utcDisplayEnd?: string | null;
  utcDisplayStart?: string | null;
}
/** CU.WebApi.GraphQL.MyScenarioScoreboard */
export interface MyScenarioScoreboard {
  description?: string | null;
  icon?: string | null;
  id?: ScenarioInstanceID | null;
  name?: string | null;
  rounds?: (RoundScore | null)[] | null;
  roundStartTime?: Decimal | null;
  teams?: Faction_TeamScore | null;
}
/** CU.WebApi.GraphQL.RoundScore */
export interface RoundScore {
  active?: boolean | null;
  roundIndex?: number | null;
  winningTeamIDs?: (ScenarioTeamID | null)[] | null;
}

export interface Faction_TeamScore {
  arthurian?: TeamScore | null /** Arthurian */;
  cOUNT?: TeamScore | null /** COUNT */;
  factionless?: TeamScore | null /** Factionless */;
  tdd?: TeamScore | null /** TDD */;
  viking?: TeamScore | null /** Viking */;
}
/** CU.WebApi.GraphQL.TeamScore */
export interface TeamScore {
  players?: (PlayerScore | null)[] | null;
  score?: number | null;
}
/** CU.WebApi.GraphQL.PlayerScore */
export interface PlayerScore {
  characterID?: CharacterID | null;
  name?: string | null;
  score?: number | null;
}
/** CU.WebApi.GraphQL.GraphQLActiveWarband */
export interface GraphQLActiveWarband extends IGraphQLActiveWarband {
  info?: ActiveWarband | null;
  members?: (GroupMemberState | null)[] | null;
}
/** CU.Groups.ActiveWarband */
export interface ActiveWarband extends IGroup, IWarband {
  battlegroup?: GroupID | null;
  created?: string | null;
  disbanded?: string | null;
  faction?: Faction | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  id?: GroupID | null;
  leader?: CharacterID | null;
  leaderPermissions?: (string | null)[] | null;
  maxMemberCount?: number | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  membersAsString?: (string | null)[] | null;
  order?: GroupID | null;
  shard?: ShardID | null;
}
/** CU.WebApi.GraphQL.GroupMemberState */
export interface GroupMemberState {
  blood?: CurrentMax | null;
  canInvite?: boolean | null;
  canKick?: boolean | null;
  characterID?: string | null;
  classID?: Archetype | null;
  displayOrder?: number | null;
  entityID?: string | null;
  faction?: Faction | null;
  gender?: Gender | null;
  health?: (Health | null)[] | null;
  isAlive?: boolean | null;
  isLeader?: boolean | null;
  isReady?: boolean | null;
  name?: string | null;
  position?: Vec3f | null;
  race?: Race | null;
  rankLevel?: number | null;
  stamina?: CurrentMax | null;
  statuses?: (StatusEffect | null)[] | null;
  type?: string | null;
  warbandID?: string | null;
}
/** CU.WebApi.GraphQL.CurrentMax */
export interface CurrentMax {
  current?: Decimal | null;
  max?: Decimal | null;
}
/** CU.WebApi.GraphQL.Health */
export interface Health {
  current?: Decimal | null;
  max?: Decimal | null;
  wounds?: number | null;
}
/** CU.WebApi.GraphQL.StatusEffect */
export interface StatusEffect {
  description?: string | null;
  duration?: Decimal | null;
  iconURL?: string | null;
  id?: string | null;
  name?: string | null;
  startTime?: Decimal | null;
}
/** CU.WebApi.GraphQL.GraphQLBattlegroup */
export interface GraphQLBattlegroup extends IGraphQLBattlegroup {
  battlegroup?: Battlegroup | null;
  members?: (GroupMemberState | null)[] | null;
}
/** CU.Groups.Battlegroup */
export interface Battlegroup extends IGroup {
  created?: string | null;
  disbanded?: string | null;
  faction?: Faction | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  id?: GroupID | null;
  leader?: CharacterID | null;
  leaderPermissions?: (string | null)[] | null;
  maxMemberCount?: number | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  membersAsString?: (string | null)[] | null;
  shard?: ShardID | null;
  warbands?: (GroupID | null)[] | null;
}
/** ServerLib.Items.MyEquippedItems */
export interface MyEquippedItems {
  armorClass?: Decimal | null;
  itemCount?: number | null;
  items?: (EquippedItem | null)[] | null;
  readiedGearSlots?: (GearSlotDefRef | null)[] | null;
  resistances?: DamageType_Single | null;
  totalMass?: Decimal | null;
}
/** World.EquippedItem */
export interface EquippedItem {
  gearSlots?:
    | (GearSlotDefRef | null)[]
    | null /** the list of all the gear slots the item is in */;
  item?: Item | null /** The item that is equipped */;
}
/** ServerLib.Items.MyInventory */
export interface MyInventory {
  itemCount?: number | null;
  items?: (Item | null)[] | null;
  nestedItemCount?: number | null;
  totalMass?: Decimal | null;
}
/** CU.Groups.Order */
export interface Order extends IGroup {
  created?: string | null;
  disbanded?: string | null;
  faction?: Faction | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  id?: GroupID | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  membersAsString?: (string | null)[] | null;
  name?: NormalizedString | null;
  shard?: ShardID | null;
}
/** CU.WebApi.GraphQL.PassiveAlert */
export interface PassiveAlert {
  message?: string | null;
  targetID?: CharacterID | null;
}
/** ServerLib.Progression.CharacterProgressionData */
export interface CharacterProgressionData {
  accountSummary?: AccountProgressionSummary | null /** Information about all characters belonging to this account. */;
  adjustmentsByDayLogID?:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** A character adjustments for a specific day log for this character. */;
  characterAdjustments?:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** Information about what adjustments happened for this player over the date range provided. */;
  characterDays?:
    | (CharacterDaySummaryDBModel | null)[]
    | null /** Information about what happened for this player over the date range provided. */;
  collectedProgressionSummary?: CharacterSummaryDBModel | null /** Global information about this character. */;
  dayBySummaryNumber?: CharacterDaySummaryDBModel | null /** A specific summary number for this character. */;
  dayLogByID?: CharacterDaySummaryDBModel | null /** A specific day log for this character. */;
  unCollectedDayLogs?:
    | (CharacterDaySummaryDBModel | null)[]
    | null /** All unhandled progression days. */;
}
/** ServerLib.Progression.AccountProgressionSummary */
export interface AccountProgressionSummary {
  activeDayCount?: number | null;
  characterCount?: number | null;
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  distanceMoved?: number | null;
  scenarioOutcomes?: ScenarioOutcome_UInt32 | null;
  secondsActive?: number | null;
  skillPartLevels?: number | null;
  statsGained?: number | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel */
export interface CraftingSummaryDBModel {
  blockSummary?: JobSummaryDBModel | null;
  grindSummary?: JobSummaryDBModel | null;
  makeSummary?: JobSummaryDBModel | null;
  purifySummary?: JobSummaryDBModel | null;
  repairSummary?: JobSummaryDBModel | null;
  salvageSummary?: JobSummaryDBModel | null;
  shapeSummary?: JobSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel+JobSummaryDBModel */
export interface JobSummaryDBModel {
  canceled?: number | null;
  collected?: number | null;
  started?: number | null;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel */
export interface DamageSummaryDBModel {
  createCount?: CountPerTargetTypeDBModel | null;
  damageApplied?: CountPerTargetTypeDBModel | null;
  damageReceived?: CountPerTargetTypeDBModel | null;
  deathCount?: CountPerTargetTypeDBModel | null;
  healingApplied?: CountPerTargetTypeDBModel | null;
  healingReceived?: CountPerTargetTypeDBModel | null;
  killAssistCount?: CountPerTargetTypeDBModel | null;
  killCount?: CountPerTargetTypeDBModel | null;
  perCharacterClass?: (DataPerCharacterClassDBModel | null)[] | null;
  woundsApplied?: CountPerTargetTypeDBModel | null;
  woundsHealedApplied?: CountPerTargetTypeDBModel | null;
  woundsHealedReceived?: CountPerTargetTypeDBModel | null;
  woundsReceived?: CountPerTargetTypeDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CountPerTargetTypeDBModel */
export interface CountPerTargetTypeDBModel {
  anyCharacter?: number | null;
  building?: number | null;
  dummy?: number | null;
  item?: number | null;
  nonPlayerCharacter?: number | null;
  playerCharacter?: number | null;
  resourceNode?: number | null;
  self?: number | null;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel+DataPerCharacterClassDBModel */
export interface DataPerCharacterClassDBModel {
  characterClass?: Archetype | null;
  killAssistCount?: number | null;
  killCount?: number | null;
}

export interface ScenarioOutcome_UInt32 {
  draw?: number | null /** Draw */;
  invalid?: number | null /** Invalid */;
  killed?: number | null /** Killed */;
  lose?: number | null /** Lose */;
  restart?: number | null /** Restart */;
  win?: number | null /** Win */;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentDBModel */
export interface CharacterAdjustmentDBModel {
  adjustment?: CharacterAdjustmentGQLField | null;
  characterDayLogID?: CharacterDaySummaryInstanceID | null;
  dayEnd?: string | null;
  reason?: CharacterAdjustmentReasonGQLField | null;
  sequence?: number | null;
  shardDayLogID?: ShardDaySummaryInstanceID | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentGQLField */
export interface CharacterAdjustmentGQLField {
  abilityComponent?: CharacterAdjustmentAbilityComponentProgress | null;
  addItem?: CharacterAdjustmentAddItem | null;
  applyStatus?: CharacterAdjustmentApplyStatus | null;
  playerStat?: CharacterAdjustmentPlayerStat | null;
  skillPart?: CharacterAdjustmentSkillPartProgress | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAbilityComponentProgress */
export interface CharacterAdjustmentAbilityComponentProgress {
  abilityComponentDef?: AbilityComponentGQL | null;
  abilityComponentID?: string | null;
  newLevel?: number | null;
  newProgressPoints?: number | null;
  previousLevel?: number | null;
  previousProgressionPoints?: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAddItem */
export interface CharacterAdjustmentAddItem {
  itemDef?: ItemDefRef | null;
  itemInstanceIDS?: (ItemInstanceID | null)[] | null;
  quality?: ItemQuality | null;
  staticDefinitionID?: string | null;
  unitCount?: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentApplyStatus */
export interface CharacterAdjustmentApplyStatus {
  statusID?: string | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentPlayerStat */
export interface CharacterAdjustmentPlayerStat {
  newBonus?: number | null;
  newProgressionPoints?: number | null;
  previousBonus?: number | null;
  previousProgressionPoints?: number | null;
  stat?: Stat | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentSkillPartProgress */
export interface CharacterAdjustmentSkillPartProgress {
  newLevel?: number | null;
  newProgressPoints?: number | null;
  previousLevel?: number | null;
  previousProgressionPoints?: number | null;
  skillPartID?: string | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentReasonGQLField */
export interface CharacterAdjustmentReasonGQLField {
  abilityComponentLevel?: CharacterAdjustmentReasonAbilityComponentLevel | null;
  adminGrant?: boolean | null;
  useAbilities?: CharacterAdjustmentReasonUseAbilities | null;
  useAbilityComponent?: CharacterAdjustmentReasonUseAbilityComponent | null;
  useSkillPart?: CharacterAdjustmentReasonUseSkillPart | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonAbilityComponentLevel */
export interface CharacterAdjustmentReasonAbilityComponentLevel {
  abilityComponentDef?: AbilityComponentGQL | null;
  abilityComponentID?: string | null;
  abilityComponentLevel?: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilities */
export interface CharacterAdjustmentReasonUseAbilities {
  inCombatCount?: number | null;
  nonCombatCount?: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilityComponent */
export interface CharacterAdjustmentReasonUseAbilityComponent {
  abilityComponentDef?: AbilityComponentGQL | null;
  abilityComponentID?: string | null;
  inCombatCount?: number | null;
  nonCombatCount?: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseSkillPart */
export interface CharacterAdjustmentReasonUseSkillPart {
  abilityInstanceID?: string | null;
  inCombatCount?: number | null;
  nonCombatCount?: number | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel */
export interface CharacterDaySummaryDBModel {
  abilityComponentsUsed?: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  accountID?: AccountID | null;
  adjustments?: (CharacterAdjustmentDBModel | null)[] | null;
  characterID?: CharacterID | null;
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  dayEnd?: string | null;
  dayStart?: string | null;
  distanceMoved?: number | null;
  id?: CharacterDaySummaryInstanceID | null;
  plots?: PlotSummaryDBModel | null;
  scenarios?: (FinishedScenario | null)[] | null;
  secondsActive?: number | null;
  shardDayLogID?: ShardDaySummaryInstanceID | null;
  shardID?: ShardID | null;
  state?: States | null;
  summaryNumber?: number | null;
}
/** CU.Databases.Models.Progression.Logs.AbilityComponentUsedSummaryDBModel */
export interface AbilityComponentUsedSummaryDBModel {
  abilityComponentDef?: AbilityComponentGQL | null;
  abilityComponentID?: string | null;
  usedInCombatCount?: number | null;
  usedNonCombatCount?: number | null;
}
/** CU.Databases.Models.Progression.Logs.PlotSummaryDBModel */
export interface PlotSummaryDBModel {
  factionPlotsCaptured?: number | null;
  scenarioPlotsCaptured?: number | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+FinishedScenario */
export interface FinishedScenario {
  activeAtEnd?: boolean | null;
  outcome?: ScenarioOutcome | null;
  scenarioDefinitionID?: string | null;
  scenarioID?: ScenarioInstanceID | null;
  score?: number | null;
  teamID?: ScenarioTeamID | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterSummaryDBModel */
export interface CharacterSummaryDBModel {
  abilityComponentUsed?: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  accountID?: AccountID | null;
  activeDayCount?: number | null;
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  distanceMoved?: number | null;
  lastDayLogProcessedID?: CharacterDaySummaryInstanceID | null;
  lastDayProcessedStart?: string | null;
  plots?: PlotSummaryDBModel | null;
  scenarioOutcomes?: ScenarioOutcome_UInt32 | null;
  secondsActive?: number | null;
  shardID?: ShardID | null;
}
/** CU.WebApi.GraphQL.MyScenarioQueue */
export interface MyScenarioQueue {
  availableMatches?: (Match | null)[] | null;
}
/** CU.WebApi.GraphQL.Match */
export interface Match {
  charactersNeededToStartNextGameByFaction?: Faction_Int32 | null;
  gamesInProgress?: number | null;
  icon?: string | null;
  id?: MatchQueueInstanceID | null;
  inScenarioID?: ScenarioInstanceID | null;
  isInScenario?: boolean | null;
  isQueued?: boolean | null;
  name?: string | null;
  totalBackfillsNeededByFaction?: Faction_Int32 | null;
}

export interface Faction_Int32 {
  arthurian?: number | null /** Arthurian */;
  cOUNT?: number | null /** COUNT */;
  factionless?: number | null /** Factionless */;
  tdd?: number | null /** TDD */;
  viking?: number | null /** Viking */;
}
/** CU.Databases.Models.Content.PatcherAlert */
export interface PatcherAlert {
  id?: string | null;
  message?: string | null /** HTML Content for the patcher alert. */;
  utcCreated?: string | null;
  utcDisplayEnd?: string | null;
  utcDisplayStart?: string | null;
}
/** CU.Databases.Models.Content.PatcherHero */
export interface PatcherHero {
  id?: string | null;
  utcCreated?: string | null;
  utcDisplayEnd?: string | null;
  utcDisplayStart?: string | null;
}
/** CU.Databases.Models.Content.PatchNote */
export interface PatchNote {
  channels?:
    | (number | null)[]
    | null /** Which channels will this patch note be presented on. */;
  htmlContent?: string | null /** HTML Content for the patch note. */;
  id?: string | null;
  jSONContent?:
    | string
    | null /** JSON data of HTML Content for the patch note. */;
  patchNumber?: string | null;
  title?: string | null;
  utcCreated?: string | null;
  utcDisplayEnd?: string | null;
  utcDisplayStart?: string | null;
}
/** ServerLib.Items.ResourceNodeResult */
export interface ResourceNodeResult {
  currentHealth?: Decimal | null;
  faction?: Faction | null;
  maxHealth?: Decimal | null;
  permissibleHolder?: FlagsPermissibleHolderGQL | null;
  resourceNodeInstanceID?: ResourceNodeInstanceID | null;
  staticDefinition?: ResourceNodeDefRef | null;
  subItems?: (ResourceNodeSubItem | null)[] | null;
}
/** World.ResourceNodeDefRef */
export interface ResourceNodeDefRef {
  id?: string | null;
  mapIconAnchorX?: Decimal | null;
  mapIconAnchorY?: Decimal | null;
  mapIconURL?: string | null;
  maxActors?: number | null;
  name?: string | null;
  requirements?: RequirementDef | null;
  secondsBetweenUse?: number | null;
}
/** World.ResourceNodeSubItem */
export interface ResourceNodeSubItem {
  subItemDefinitionRef?: ResourceNodeSubItemDefRef | null;
  takenCount?: number | null;
}
/** World.ResourceNodeSubItemDefRef */
export interface ResourceNodeSubItemDefRef {
  entries?: (Entry | null)[] | null;
  id?: string | null;
  startingUnits?: number | null;
}
/** World.ResourceNodeSubItemDef+Entry */
export interface Entry {
  faction?: Faction | null;
  harvestItems?: (HarvestItem | null)[] | null;
}
/** World.ResourceNodeSubItemDef+Entry+HarvestItem */
export interface HarvestItem {
  itemDefinition?: ItemDefRef | null;
  maxQuality?: Decimal | null /** the max quality that could result */;
  maxUnitCount?: number | null /** the max unit count that could result */;
  minQuality?: Decimal | null /** the min quality that could result */;
  minUnitCount?: number | null /** the min unit count that could result */;
  weight?: number | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel */
export interface ScenarioSummaryDBModel {
  creatorAdminID?: CharacterID | null;
  endTime?: string | null;
  resolution?: ScenarioResolution | null;
  rounds?: (RoundOutcome | null)[] | null;
  scenarioDef?: ScenarioDef | null;
  scenarioInstanceID?: ScenarioInstanceID | null;
  shardID?: ShardID | null;
  startTime?: string | null;
  teamOutcomes?:
    | (TeamOutcomeScenarioField | null)[]
    | null /** details for what the each team did for the whole scenario */;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+RoundOutcome */
export interface RoundOutcome {
  adminID?: CharacterID | null;
  endTime?: string | null;
  myRoundOutcome?: CharacterOutcomeDBModel | null /** details for what the caller did during this round */;
  resolution?: ScenarioResolution | null;
  roundIndex?: number | null;
  roundInstanceID?: RoundInstanceID | null;
  startTime?: string | null;
  teamOutcomes?: (TeamOutcomeRound | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+CharacterOutcomeDBModel */
export interface CharacterOutcomeDBModel {
  characterType?: ProgressionCharacterType | null;
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  displayName?: string | null;
  score?: number | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeRound */
export interface TeamOutcomeRound {
  damageSummary?: DamageSummaryDBModel | null /** damage summary sum across all participants in this round */;
  outcome?: ScenarioOutcome | null;
  participantCount?:
    | number
    | null /** how many characters participated in this round */;
  participants?: (CharacterOutcomeDBModel | null)[] | null;
  role?: RoleID | null;
  score?: number | null;
  teamID?: ScenarioTeamID | null;
}
/** Scenario.ScenarioDef */
export interface ScenarioDef {
  displayDescription?: string | null;
  displayName?: string | null;
  icon?: string | null;
  id?: string | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenarioField */
export interface TeamOutcomeScenarioField {
  outcome?: ScenarioOutcome | null;
  participants?: (CharacterOutcomeDBModel | null)[] | null;
  teamID?: ScenarioTeamID | null;
}
/** ServerLib.Items.SecureTradeStatus */
export interface SecureTradeStatus {
  myItems?: (Item | null)[] | null /** The items you've added to the trade */;
  myState?: SecureTradeState | null /** The state of the trade, from your perspective */;
  theirEntityID?: EntityID | null /** The entity ID of who is being traded with */;
  theirItems?:
    | (Item | null)[]
    | null /** The items you will get from this trade */;
  theirState?: SecureTradeState | null /** The state of the trade, from the perspective of the entity you are trading with */;
}
/** ServerLib.ApiModels.SimpleCharacter */
export interface SimpleCharacter {
  archetype?: Archetype | null;
  faction?: Faction | null;
  gender?: Gender | null;
  id?: CharacterID | null;
  lastLogin?: string | null;
  name?: string | null;
  race?: Race | null;
  shardID?: ShardID | null;
}
/** ServerLib.Progression.ShardProgressionData */
export interface ShardProgressionData {
  adjustmentsSummary?: CharacterAdjustmentSummary | null /** Information about rewards over a time frame or specific day */;
  progressionDaySummary?: ShardDaySummaryDBModel | null /** Information about a particular day */;
  progressionSummary?: ShardSummaryDBModel | null /** Global information about this shard. */;
  progressionSummaryRange?: ShardSummaryDBModel | null /** Global information about this shard given the time frame. */;
  realmSummary?: RealmDaySummaryDBModel | null /** Information about what happened to a realm on a given day. */;
  scenarioSummaries?: PagedScenarioSummaries | null /** Information about all the finished scenarios within a date range */;
  shardDays?: PagedShardDaySummaries | null /** Information about what happened on a shard over the date range provided. */;
}
/** ServerLib.Progression.CharacterAdjustmentSummary */
export interface CharacterAdjustmentSummary {
  averageAdjustementsPerCharacter?: Decimal | null;
  characterCount?: number | null;
  characterIDWithMaxAdjustments?: CharacterID | null;
  items?: (ItemsAdded | null)[] | null;
  maxAdjustmentsOnCharacter?: number | null;
  skillParts?: (SkillPartLevels | null)[] | null;
  stats?: (StatBonusPoints | null)[] | null;
  statusesApplied?: (StatusApplied | null)[] | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+ItemsAdded */
export interface ItemsAdded {
  staticDefinitionID?: string | null;
  unitCount?: number | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+SkillPartLevels */
export interface SkillPartLevels {
  levelChange?: number | null;
  skillPartID?: string | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatBonusPoints */
export interface StatBonusPoints {
  bonusChange?: number | null;
  stat?: Stat | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatusApplied */
export interface StatusApplied {
  count?: number | null;
  statusID?: string | null;
}
/** CU.Databases.Models.Progression.Logs.ShardDaySummaryDBModel */
export interface ShardDaySummaryDBModel {
  dayEnd?: string | null;
  dayStart?: string | null;
  nonPlayerCharacters?: CharacterSummary | null;
  playerCharacters?: CharacterSummary | null;
  plots?: PlotSummary | null;
  scenarios?: (ScenarioSummary | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+CharacterSummary */
export interface CharacterSummary {
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  distanceMoved?:
    | number
    | null /** Distance traveled by all characters ever for this shard. */;
  secondsActive?:
    | number
    | null /** How many seconds of the game have been played by all characters ever for this shard. */;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+PlotSummary */
export interface PlotSummary {
  blocksCreated?: number | null;
  blocksDestroyed?: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+ScenarioSummary */
export interface ScenarioSummary {
  finished?: number | null;
  killed?: number | null;
  restarted?: number | null;
  started?: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel */
export interface ShardSummaryDBModel {
  daysProcessed?: number | null;
  nonPlayerCharacters?: CharacterSummary | null;
  playerCharacters?: CharacterSummary | null;
  plots?: PlotSummary | null;
  realmSummaries?: Faction_RealmSummaryDBModel | null;
  scenarios?: ScenarioSummary | null;
  shardID?: ShardID | null;
}

export interface Faction_RealmSummaryDBModel {
  arthurian?: RealmSummaryDBModel | null /** Arthurian */;
  cOUNT?: RealmSummaryDBModel | null /** COUNT */;
  factionless?: RealmSummaryDBModel | null /** Factionless */;
  tdd?: RealmSummaryDBModel | null /** TDD */;
  viking?: RealmSummaryDBModel | null /** Viking */;
}
/** CU.Databases.Models.Progression.Logs.RealmSummaryDBModel */
export interface RealmSummaryDBModel {
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  distanceMoved?: number | null;
  faction?: Faction | null;
  secondsActive?: number | null;
}
/** CU.Databases.Models.Progression.Logs.RealmDaySummaryDBModel */
export interface RealmDaySummaryDBModel {
  abilityComponentsUsed?: (AbilityComponentUsedSummaryDBModel | null)[] | null;
  characterCount?: number | null;
  crafting?: CraftingSummaryDBModel | null;
  damage?: DamageSummaryDBModel | null;
  dayEnd?: string | null;
  dayStart?: string | null;
  distanceMoved?: number | null;
  faction?: Faction | null;
  secondsActive?: number | null;
  shardDayLogID?: ShardDaySummaryInstanceID | null;
  shardID?: ShardID | null;
}
/** ServerLib.Progression.PagedScenarioSummaries */
export interface PagedScenarioSummaries {
  data?: (ScenarioSummaryDBModel | null)[] | null;
  totalCount?: number | null;
}
/** ServerLib.Progression.PagedShardDaySummaries */
export interface PagedShardDaySummaries {
  data?: (ShardDaySummaryDBModel | null)[] | null;
  totalCount?: number | null;
}
/** ServerLib.Status.Status */
export interface Status {
  statuses?: (StatusDef | null)[] | null /** List of all status defs */;
}
/** World.Cogs.StatusDef */
export interface StatusDef {
  blocksAbilities?:
    | boolean
    | null /** if the status blocks abilities from running */;
  description?: string | null /** description of the status */;
  iconClass?: string | null /** iconClass of the status */;
  iconURL?: string | null /** icon url of the status */;
  id?: string | null;
  name?: string | null /** name of the status */;
  numericID?: number | null;
  stacking?: StatusStackingDef | null;
  statusTags?: (string | null)[] | null;
  uIText?: string | null;
  uIVisiblity?: StatusUIVisiblity | null;
}
/** World.StatusStackingDef */
export interface StatusStackingDef {
  group?: string | null;
  removalOrder?: StatusRemovalOrder | null;
  statusDurationModType?: StatusDurationModification | null;
}
/** ServerLib.GraphQL.Test */
export interface Test extends TestInterface {
  characters?: (Character | null)[] | null;
  customField?: ItemQuality | null /** testtesttest */;
  float?: Decimal | null;
  homeArray?: (string | null)[] | null;
  homeList?: (string | null)[] | null;
  integer?: number | null;
  sg1?: TestEnum_String | null;
  sg1Floats?: TestEnum_Single | null;
  sg1Titles?: TestEnum_String | null;
  string?: string | null;
  weapons?: (string | null)[] | null;
}

export interface TestEnum_String {
  carter?: string | null /** Carter */;
  jackson?: string | null /** Jackson */;
  oneill?: string | null /** Oneill */;
  tealc?: string | null /** Tealc */;
}

export interface TestEnum_Single {
  carter?: Decimal | null /** Carter */;
  jackson?: Decimal | null /** Jackson */;
  oneill?: Decimal | null /** Oneill */;
  tealc?: Decimal | null /** Tealc */;
}
/** World.TraitsInfo */
export interface TraitsInfo {
  maxAllowed?: number | null;
  minRequired?: number | null;
  traits?: (Trait | null)[] | null;
}
/** ServerLib.Crafting.VoxJobStatusGQL */
export interface VoxJobStatusGQL {
  status?: VoxJobStatus | null;
}
/** ServerLib.Game.WorldData */
export interface WorldData {
  map?: MapData | null;
  spawnPoints?:
    | (SpawnPoint | null)[]
    | null /** Currently active spawn points available to you. */;
}
/** ServerLib.Game.MapData */
export interface MapData {
  dynamic?: (MapPoint | null)[] | null;
  static?: (MapPoint | null)[] | null;
}
/** ServerLib.Game.MapPoint */
export interface MapPoint {
  actions?: MapPointActions | null;
  anchor?: (Decimal | null)[] | null;
  color?: string | null;
  offset?: (Decimal | null)[] | null;
  position?: (Decimal | null)[] | null;
  size?: (Decimal | null)[] | null;
  src?: string | null;
  tooltip?: string | null;
  zone?: ZoneInstanceID | null;
}
/** ServerLib.Game.MapPointActions */
export interface MapPointActions {
  onClick?: MapPointAction | null;
}
/** ServerLib.Game.MapPointAction */
export interface MapPointAction {
  command?: string | null;
  type?: MapPointActionType | null;
}
/** ServerLib.ApiModels.SpawnPoint */
export interface SpawnPoint {
  faction?: Faction | null;
  id?: string | null;
  position?: Vec3f | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  activeGroupUpdates?: IGroupUpdate | null /** Updates to a group member in an active group */;
  interactiveAlerts?: IInteractiveAlert | null /** Alerts */;
  myGroupNotifications?: IGroupNotification | null /** Group related notifications for your specific character. Tells you when you joined a group, etc. */;
  myInventoryItems?: Item | null /** Real-time updates for inventory items */;
  passiveAlerts?: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  patcherAlerts?: IPatcherAlertUpdate | null /** Gets updates for patcher alerts */;
  secureTradeUpdates?: ISecureTradeUpdate | null /** Updates to a secure trade */;
  serverUpdates?: IServerUpdate | null /** Subscription for updates to servers */;
  shardCharacterUpdates?: IPatcherCharacterUpdate | null /** Subscription for simple updates to characters on a shard */;
}
/** CU.WebApi.GraphQL.GroupMemberUpdate */
export interface GroupMemberUpdate extends IGroupUpdate {
  characterID?: CharacterID | null;
  groupID?: GroupID | null;
  memberState?: string | null;
  updateType?: GroupUpdateType | null;
}
/** CU.WebApi.GraphQL.GroupMemberRemovedUpdate */
export interface GroupMemberRemovedUpdate extends IGroupUpdate {
  characterID?: CharacterID | null;
  groupID?: GroupID | null;
  updateType?: GroupUpdateType | null;
}
/** CU.WebApi.GraphQL.GroupNotification */
export interface GroupNotification extends IGroupNotification {
  characterID?: CharacterID | null;
  groupID?: GroupID | null;
  groupType?: GroupTypes | null;
  type?: GroupNotificationType | null;
}
/** CU.WebApi.GraphQL.MatchmakingEntered */
export interface MatchmakingEntered extends IMatchmakingUpdate {
  gameMode?: string | null;
  type?: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingError */
export interface MatchmakingError extends IMatchmakingUpdate {
  code?: number | null;
  message?: string | null;
  type?: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingServerReady */
export interface MatchmakingServerReady extends IMatchmakingUpdate {
  host?: string | null;
  port?: number | null;
  type?: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.MatchmakingKickOff */
export interface MatchmakingKickOff extends IMatchmakingUpdate {
  matchID?: string | null;
  secondsToWait?: Decimal | null;
  serializedTeamMates?: string | null;
  type?: MatchmakingUpdateType | null;
}
/** CU.WebApi.GraphQL.Scoreboard */
export interface Scoreboard {
  description?: string | null;
  icon?: string | null;
  id?: ScenarioInstanceID | null;
  name?: string | null;
  rounds?: (RoundScore | null)[] | null;
  roundStartTime?: Decimal | null;
  teams?: Faction_TeamScore | null;
}
/** CU.Permissions.PermissionInfo */
export interface PermissionInfo {
  description?: string | null;
  enables?: (string | null)[] | null;
  id?: string | null;
  name?: string | null;
}
/** CU.Groups.CustomRank */
export interface CustomRank {
  groupID?: GroupID | null;
  level?: number | null;
  name?: string | null;
  permissions?: (PermissionInfo | null)[] | null;
}
/** CU.Groups.Group */
export interface Group extends IGroup {
  created?: string | null;
  disbanded?: string | null;
  faction?: Faction | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  membersAsString?: (string | null)[] | null;
  shard?: ShardID | null;
}
/** CU.Groups.Warband */
export interface Warband extends IGroup, IWarband {
  banner?: string | null;
  created?: string | null;
  disbanded?: string | null;
  faction?: Faction | null;
  formerActiveMembers?: (IGroupMember | null)[] | null;
  formerMembers?: (IGroupMember | null)[] | null;
  groupType?: GroupTypes | null;
  id?: GroupID | null;
  isPermanent?: boolean | null;
  maxMemberCount?: number | null;
  maxRankCount?: number | null;
  memberCount?: number | null;
  members?: (IGroupMember | null)[] | null;
  membersAsString?: (string | null)[] | null;
  name?: NormalizedString | null;
  order?: GroupID | null;
  shard?: ShardID | null;
}
/** CU.GraphQL.Euler3fGQL */
export interface Euler3f {
  pitch?: Decimal | null;
  roll?: Decimal | null;
  yaw?: Decimal | null;
}
/** CU.Databases.Models.CharacterStatProgressionDBModel */
export interface CharacterStatProgressionDBModel {
  bonusPoints?: number | null;
  progressionPoints?: number | null;
}
/** CU.Databases.Models.AbilityComponentProgressionDBModel */
export interface AbilityComponentProgressionDBModel {
  level?: number | null;
  progressionPoints?: number | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenario */
export interface TeamOutcomeScenario {
  outcome?: ScenarioOutcome | null;
  teamID?: ScenarioTeamID | null;
}
/** ServerLib.GraphQL.ServerUpdated */
export interface ServerUpdated extends IServerUpdate {
  server?: ServerModel | null;
  type?: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUpdatedAll */
export interface ServerUpdatedAll extends IServerUpdate {
  server?: ServerModel | null;
  type?: ServerUpdateType | null;
}
/** ServerLib.GraphQL.ServerUnavailableAllUpdate */
export interface ServerUnavailableAllUpdate extends IServerUpdate {
  type?: ServerUpdateType | null;
}
/** ServerLib.GraphQL.SG1Member */
export interface SG1Member extends Character {
  name?: string | null;
  race?: string | null;
  rank?: string | null;
}
/** ServerLib.GraphQL.Goauld */
export interface Goauld extends Character {
  homePlanet?: string | null;
  name?: string | null;
  race?: string | null;
}
/** ServerLib.GraphQL.Models.GroupAlert */
export interface GroupAlert extends IInteractiveAlert {
  category?: AlertCategory | null;
  code?: InviteCode | null;
  forGroup?: GroupID | null;
  forGroupName?: string | null;
  fromID?: CharacterID | null;
  fromName?: string | null;
  kind?: GroupAlertKind | null;
  targetID?: CharacterID | null;
  when?: number | null;
}
/** ServerLib.GraphQL.Models.TradeAlert */
export interface TradeAlert extends IInteractiveAlert {
  category?: AlertCategory | null;
  kind?: TradeAlertKind | null;
  otherEntityID?: EntityID | null;
  otherName?: string | null;
  secureTradeID?: SecureTradeInstanceID | null;
  targetID?: CharacterID | null;
  when?: number | null;
}
/** ServerLib.GraphQL.Models.ProgressionAlert */
export interface ProgressionAlert extends IInteractiveAlert {
  category?: AlertCategory | null;
  targetID?: CharacterID | null;
  when?: number | null;
}
/** ServerLib.GraphQL.Models.SecureTradeCompletedUpdate */
export interface SecureTradeCompletedUpdate extends ISecureTradeUpdate {
  category?: SecureTradeUpdateCategory | null;
  reason?: SecureTradeDoneReason | null;
  targetID?: CharacterID | null;
  tradeID?: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.Models.SecureTradeStateUpdate */
export interface SecureTradeStateUpdate extends ISecureTradeUpdate {
  category?: SecureTradeUpdateCategory | null;
  otherEntityState?: SecureTradeState | null;
  targetID?: CharacterID | null;
  tradeID?: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.Models.SecureTradeItemUpdate */
export interface SecureTradeItemUpdate extends ISecureTradeUpdate {
  category?: SecureTradeUpdateCategory | null;
  otherEntityItems?: (Item | null)[] | null;
  targetID?: CharacterID | null;
  tradeID?: SecureTradeInstanceID | null;
}
/** ServerLib.ApiModels.CharacterUpdate */
export interface CharacterUpdate extends IPatcherCharacterUpdate {
  character?: SimpleCharacter | null;
  shard?: ShardID | null;
  type?: PatcherCharacterUpdateType | null;
}
/** ServerLib.ApiModels.CharacterRemovedUpdate */
export interface CharacterRemovedUpdate extends IPatcherCharacterUpdate {
  characterID?: CharacterID | null;
  shard?: ShardID | null;
  type?: PatcherCharacterUpdateType | null;
}
/** ServerLib.ApiModels.PatcherAlertUpdate */
export interface PatcherAlertUpdate extends IPatcherAlertUpdate {
  alert?: PatcherAlert | null;
}
/** World.FactionTrait */
export interface FactionTrait {
  category?: TraitCategory | null /** Category */;
  description?: string | null /** The description of this trait */;
  exclusives?: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  icon?: string | null /** Url for the icon for this trait */;
  id?: string | null;
  name?: string | null /** The name of this trait */;
  points?: number | null /** The point value of this trait */;
  prerequisites?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required?: boolean | null /** Whether or not this is a required trait. */;
  specifier?:
    | string
    | null /** Specifies the defining type based on category */;
}
/** World.RaceTrait */
export interface RaceTrait {
  category?: TraitCategory | null /** Category */;
  description?: string | null /** The description of this trait */;
  exclusives?: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  icon?: string | null /** Url for the icon for this trait */;
  id?: string | null;
  name?: string | null /** The name of this trait */;
  points?: number | null /** The point value of this trait */;
  prerequisites?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required?: boolean | null /** Whether or not this is a required trait. */;
  specifier?:
    | string
    | null /** Specifies the defining type based on category */;
}
/** World.ClassTrait */
export interface ClassTrait {
  category?: TraitCategory | null /** Category */;
  description?: string | null /** The description of this trait */;
  exclusives?: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  icon?: string | null /** Url for the icon for this trait */;
  id?: string | null;
  name?: string | null /** The name of this trait */;
  points?: number | null /** The point value of this trait */;
  prerequisites?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks?:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  required?: boolean | null /** Whether or not this is a required trait. */;
  specifier?:
    | string
    | null /** Specifies the defining type based on category */;
}
/** World.SecureTradeLocation */
export interface SecureTradeLocation {
  characterID?: CharacterID | null /** The character that currently owns this item */;
}
/** World.BlockDef */
export interface BlockDef {
  id?: string | null /** Unique block identifier */;
}
/** World.SiegeEngineSettingsDef */
export interface SiegeEngineSettingsDef {
  id?: string | null /** Unique identifier for this definition */;
}
/** World.WeaponConfigDef */
export interface WeaponConfigDef {
  ammo?: boolean | null /** If true, this item is some kind of ammunition */;
  id?: string | null /** Unique weapon identifier */;
}
export interface BuildingPlotByEntityIdbuildingPlotByEntityIDArgs {
  id?: string | null /** Building Plot entity ID. */;
}
export interface BuildingPlotByInstanceIdbuildingPlotByInstanceIDArgs {
  id?: string | null /** Building Plot Instance ID. */;
}
export interface CharactercharacterArgs {
  id?: string | null;
  shard?: number | null;
}
export interface EntityItemsentityItemsArgs {
  id?: string | null /** Entity ID. (required) */;
}
export interface InviteinviteArgs {
  shard?: number | null /** shard id. (required) */;
  code?: string | null /** invite code. (required) */;
}
export interface InvitesinvitesArgs {
  shard?: number | null /** shard id. (required) */;
  forGroup?:
    | string
    | null /** ID of group from which invites are sent for. (optional) */;
  toGroup?:
    | string
    | null /** ID of group to which invites are sent to. (optional) */;
  toCharacter?:
    | string
    | null /** ID of character to which invites are sent to. (optional) */;
  includeInactive?:
    | boolean
    | null /** Should the response include inactive invites? */;
}
export interface ItemitemArgs {
  shard?: number | null /** Shard ID. (required) */;
  id?: string | null /** Item ID. (required) */;
}
export interface MotdmotdArgs {
  channel?:
    | number
    | null /** Required: Channel ID from which to return message of the day */;
}
export interface MyEquippedItemsmyEquippedItemsArgs {
  allowOfflineItems?:
    | boolean
    | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
}
export interface MyInventorymyInventoryArgs {
  allowOfflineItems?:
    | boolean
    | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
}
export interface PatcherAlertspatcherAlertsArgs {
  from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return. */;
  to?: Date | null /** Optional: Newest date (non-inclusive) from which to return. */;
}
export interface PatcherHeropatcherHeroArgs {
  from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to?: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
}
export interface PatchNotepatchNoteArgs {
  id?: string | null /** Required: ID of the patch note. */;
}
export interface PatchNotespatchNotesArgs {
  from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to?: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  channel?:
    | number
    | null /** Required: Channel ID from which to return patch notes. */;
}
export interface ResourceNoderesourceNodeArgs {
  shard?: number | null /** Shard ID. (required) */;
  id?: string | null /** Entity ID. (required) */;
}
export interface ScenariosummaryscenariosummaryArgs {
  id?: string | null /** Scenario Instance ID. (required) */;
  shard?: number | null /** The id of the shard to request data from. */;
}
export interface ShardCharactersshardCharactersArgs {
  onShard?:
    | number
    | null /** If you want to request for a specific shard, use this parameter. Otherwise, will fetch characters on all shards. */;
}
export interface ShardprogressionshardprogressionArgs {
  shard?:
    | number
    | null /** The id of the shard to request progression data from. */;
}
export interface VoxJobvoxJobArgs {
  entityID?: string | null /** Entity ID. (required) */;
  voxJobID?: string | null /** vox job ID. (required) */;
}
export interface AbilityabilityArgs {
  id?: number | null /** ID of the ability. */;
}
export interface VoxJobGroupLogvoxJobGroupLogArgs {
  jobIdentifier?: string | null;
  jobType?: string | null;
}
export interface VoxJobLogCountvoxJobLogCountArgs {
  favoriteFilter?: string | null;
  textFilter?: string | null;
  jobIdentifier?: string | null;
  jobType?: string | null;
}
export interface VoxJobLogsvoxJobLogsArgs {
  favoriteFilter?: string | null;
  textFilter?: string | null;
  jobIdentifier?: string | null;
  jobType?: string | null;
  dateSort?: string | null;
  page?: number | null;
  count?: number | null;
}
export interface PossibleIngredientspossibleIngredientsArgs {
  slot?:
    | string
    | null /** The slot to get ingredients for. (required) - Valid values: Invalid, PrimaryIngredient, SecondaryIngredient1, SecondaryIngredient2, SecondaryIngredient3, SecondaryIngredient4, Alloy, WeaponBlade, WeaponHandle, NonRecipe */;
}
export interface AbilityComponentsabilityComponentsArgs {
  class?: string | null /** What class to filter for, optional */;
  race?: string | null /** What race to filter for, optional */;
}
export interface ClassclassArgs {
  class?: string | null /** The class type to look for. (required) */;
}
export interface ItemitemArgs {
  itemid?: string | null /** The id of the item to look for. (required) */;
}
export interface CurrentPlayerCountcurrentPlayerCountArgs {
  server?: string | null /** Server ShardID */;
  shard?: number | null /** Server ShardID */;
}
export interface PlayerCountsplayerCountsArgs {
  server?: string | null /** Server name (default: Hatchery) */;
  from?:
    | string
    | null /** Time from which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: -1h) */;
  until?:
    | string
    | null /** Time until which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: now) */;
}
export interface AccountSummaryaccountSummaryArgs {
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface AdjustmentsByDayLogIdadjustmentsByDayLogIDArgs {
  logID?:
    | string
    | null /** The id of the log to look for adjustments for. (required) */;
}
export interface CharacterAdjustmentscharacterAdjustmentsArgs {
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface CharacterDayscharacterDaysArgs {
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface DayBySummaryNumberdayBySummaryNumberArgs {
  summaryNumber?:
    | string
    | null /** The summary number of the log to look for. (required) */;
}
export interface DayLogByIddayLogByIDArgs {
  logID?: string | null /** The id of the log to look for. (required) */;
}
export interface AdjustmentsSummaryadjustmentsSummaryArgs {
  logID?:
    | string
    | null /** The specific day to look for, used instead of date range if specified. */;
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface ProgressionDaySummaryprogressionDaySummaryArgs {
  logID?: string | null /** The specific day to look for */;
}
export interface ProgressionSummaryRangeprogressionSummaryRangeArgs {
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface RealmSummaryrealmSummaryArgs {
  shardDayID?: string | null /** The specific log to look for */;
  faction?: string | null /** The faction to look for */;
}
export interface ScenarioSummariesscenarioSummariesArgs {
  skip?: number | null /** The number of entries to skip. */;
  limit?: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface ShardDaysshardDaysArgs {
  skip?: number | null /** The number of entries to skip. */;
  limit?: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate?: Date | null /** The starting date to look for. */;
  endDate?: Date | null /** The ending date to look for. */;
}
export interface PatcherAlertspatcherAlertsArgs {
  onShard?:
    | number
    | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
export interface ShardCharacterUpdatesshardCharacterUpdatesArgs {
  onShard?:
    | number
    | null /** Shard ID of the server you'd like to subscribe to for character updates */;
}
/** CU.Faction */
export enum Faction {
  Factionless = "Factionless",
  TDD = "TDD",
  Viking = "Viking",
  Arthurian = "Arthurian",
  COUNT = "COUNT"
}
/** World.BuildingPlotResult+PlotContestedState */
export enum PlotContestedState {
  Invalid = "Invalid",
  Contested = "Contested",
  NonContested = "NonContested",
  ChangingControl = "ChangingControl"
}
/** CU.Databases.Models.Permissibles.PermissibleSetKeyType */
export enum PermissibleSetKeyType {
  Invalid = "Invalid",
  Faction = "Faction",
  ScenarioTeam = "ScenarioTeam",
  ScenarioRole = "ScenarioRole"
}
/** CU.Databases.Models.Permissibles.PermissibleTargetType */
export enum PermissibleTargetType {
  Invalid = "Invalid",
  Any = "Any",
  Faction = "Faction",
  Character = "Character",
  ScenarioTeam = "ScenarioTeam",
  Warband = "Warband",
  CharactersWarband = "CharactersWarband",
  CharactersFaction = "CharactersFaction",
  CharactersOrder = "CharactersOrder",
  InNoScenario = "InNoScenario",
  Inverse = "Inverse",
  And = "And",
  ScenarioRole = "ScenarioRole",
  Scenario = "Scenario",
  Account = "Account"
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
/** World.Cogs.Abilities.AbilityComponentCategoryDisplay */
export enum AbilityComponentCategoryDisplay {
  Invalid = "Invalid",
  Standard = "Standard",
  Option = "Option"
}
/** World.AbilityTracks */
export enum AbilityTracks {
  None = "None",
  First = "First",
  PrimaryWeapon = "PrimaryWeapon",
  SecondaryWeapon = "SecondaryWeapon",
  BothWeapons = "BothWeapons",
  Voice = "Voice",
  Last = "Last",
  Mind = "Mind",
  All = "All",
  ErrorFlag = "ErrorFlag",
  EitherWeaponPreferPrimary = "EitherWeaponPreferPrimary",
  EitherWeaponPreferSecondary = "EitherWeaponPreferSecondary",
  ChoiceFlags = "ChoiceFlags"
}
/** CU.Archetype */
export enum Archetype {
  Druid = "Druid",
  WaveWeaver = "WaveWeaver",
  BlackKnight = "BlackKnight",
  Fianna = "Fianna",
  Mjolnir = "Mjolnir",
  Physician = "Physician",
  Empath = "Empath",
  Stonehealer = "Stonehealer",
  Blackguard = "Blackguard",
  ForestStalker = "ForestStalker",
  WintersShadow = "WintersShadow",
  FlameWarden = "FlameWarden",
  Minstrel = "Minstrel",
  DarkFool = "DarkFool",
  Skald = "Skald",
  Abbot = "Abbot",
  BlessedCrow = "BlessedCrow",
  Helbound = "Helbound"
}
/** CU.Gender */
export enum Gender {
  None = "None",
  Male = "Male",
  Female = "Female"
}
/** CU.Race */
export enum Race {
  Luchorpan = "Luchorpan",
  Valkyrie = "Valkyrie",
  HumanMaleV = "HumanMaleV",
  HumanMaleA = "HumanMaleA",
  HumanMaleT = "HumanMaleT",
  Pict = "Pict",
  Charlotte = "Charlotte",
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
  DragonArthurian = "DragonArthurian",
  DragonTDD = "DragonTDD",
  DragonViking = "DragonViking",
  DragonFactionless = "DragonFactionless"
}
/** World.TraitCategory */
export enum TraitCategory {
  General = "General",
  Faction = "Faction",
  Race = "Race",
  Class = "Class"
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
/** World.ItemPlacementType */
export enum ItemPlacementType {
  None = "None",
  Door = "Door",
  Plot = "Plot",
  BuildingFaceSide = "BuildingFaceSide",
  BuildingFaceBottom = "BuildingFaceBottom",
  BuildingFaceTop = "BuildingFaceTop"
}
/** World.ItemTemplateType */
export enum ItemTemplateType {
  None = "None",
  TemplateOnly = "TemplateOnly",
  Entity = "Entity"
}
/** CU.ZoneType */
export enum ZoneType {
  None = "None",
  Home = "Home",
  Builder = "Builder",
  Contested = "Contested"
}
/** World.GearSlotType */
export enum GearSlotType {
  Unknown = "Unknown",
  Weapon = "Weapon",
  Armor = "Armor"
}
/** World.ItemType */
export enum ItemType {
  Basic = "Basic",
  Vox = "Vox",
  Ammo = "Ammo",
  Armor = "Armor",
  Weapon = "Weapon",
  Block = "Block",
  Alloy = "Alloy",
  Substance = "Substance",
  SiegeEngine = "SiegeEngine",
  Infusion = "Infusion"
}
/** CU.SubItemSlot */
export enum SubItemSlot {
  Invalid = "Invalid",
  PrimaryIngredient = "PrimaryIngredient",
  SecondaryIngredient1 = "SecondaryIngredient1",
  SecondaryIngredient2 = "SecondaryIngredient2",
  SecondaryIngredient3 = "SecondaryIngredient3",
  SecondaryIngredient4 = "SecondaryIngredient4",
  Alloy = "Alloy",
  WeaponBlade = "WeaponBlade",
  WeaponHandle = "WeaponHandle",
  NonRecipe = "NonRecipe"
}
/** CU.Databases.Models.Items.VoxJobType */
export enum VoxJobType {
  Invalid = "Invalid",
  Block = "Block",
  Grind = "Grind",
  Make = "Make",
  Purify = "Purify",
  Repair = "Repair",
  Salvage = "Salvage",
  Shape = "Shape"
}
/** CSE.BoneAlias */
export enum BoneAlias {
  Unknown = "Unknown",
  BodyPelvis = "BodyPelvis",
  Attachment1 = "Attachment1",
  Attachment2 = "Attachment2",
  Attachment3 = "Attachment3",
  Attachment4 = "Attachment4",
  Attachment5 = "Attachment5",
  Attachment6 = "Attachment6",
  Attachment7 = "Attachment7",
  SpineSacral = "SpineSacral",
  SpineLumbar = "SpineLumbar",
  SpineThoracic = "SpineThoracic",
  SpineCervical = "SpineCervical",
  BodyTorso = "BodyTorso",
  BodyNeck = "BodyNeck",
  BodyHead = "BodyHead",
  HairScalp = "HairScalp",
  HairBody = "HairBody",
  HairEnd = "HairEnd",
  TailBase = "TailBase",
  TailMiddle = "TailMiddle",
  TailEnd = "TailEnd",
  ArmLeftClavical = "ArmLeftClavical",
  ArmLeftPauldron = "ArmLeftPauldron",
  ArmLeftHumerus = "ArmLeftHumerus",
  ArmLeftElbow = "ArmLeftElbow",
  ArmLeftUlna = "ArmLeftUlna",
  HandLeftPalm = "HandLeftPalm",
  HandLeftThumbProximal = "HandLeftThumbProximal",
  HandLeftThumbMiddle = "HandLeftThumbMiddle",
  HandLeftThumbPhalanx = "HandLeftThumbPhalanx",
  HandLeftIndexFingerProximal = "HandLeftIndexFingerProximal",
  HandLeftIndexFingerMiddle = "HandLeftIndexFingerMiddle",
  HandLeftIndexFingerPhalanx = "HandLeftIndexFingerPhalanx",
  HandLeftMiddleFingerProximal = "HandLeftMiddleFingerProximal",
  HandLeftMiddleFingerMiddle = "HandLeftMiddleFingerMiddle",
  HandLeftMiddleFingerPhalanx = "HandLeftMiddleFingerPhalanx",
  HandLeftRingFingerProximal = "HandLeftRingFingerProximal",
  HandLeftRingFingerMiddle = "HandLeftRingFingerMiddle",
  HandLeftRingFingerPhalanx = "HandLeftRingFingerPhalanx",
  HandLeftPinkyProximal = "HandLeftPinkyProximal",
  HandLeftPinkyMiddle = "HandLeftPinkyMiddle",
  HandLeftPinkyPhalanx = "HandLeftPinkyPhalanx",
  ArmRightClavical = "ArmRightClavical",
  ArmRightPauldron = "ArmRightPauldron",
  ArmRightHumerus = "ArmRightHumerus",
  ArmRightElbow = "ArmRightElbow",
  ArmRightUlna = "ArmRightUlna",
  HandRightPalm = "HandRightPalm",
  HandRightThumbProximal = "HandRightThumbProximal",
  HandRightThumbMiddle = "HandRightThumbMiddle",
  HandRightThumbPhalanx = "HandRightThumbPhalanx",
  HandRightIndexFingerProximal = "HandRightIndexFingerProximal",
  HandRightIndexFingerMiddle = "HandRightIndexFingerMiddle",
  HandRightIndexFingerPhalanx = "HandRightIndexFingerPhalanx",
  HandRightMiddleFingerProximal = "HandRightMiddleFingerProximal",
  HandRightMiddleFingerMiddle = "HandRightMiddleFingerMiddle",
  HandRightMiddleFingerPhalanx = "HandRightMiddleFingerPhalanx",
  HandRightRingFingerProximal = "HandRightRingFingerProximal",
  HandRightRingFingerMiddle = "HandRightRingFingerMiddle",
  HandRightRingFingerPhalanx = "HandRightRingFingerPhalanx",
  HandRightPinkyProximal = "HandRightPinkyProximal",
  HandRightPinkyMiddle = "HandRightPinkyMiddle",
  HandRightPinkyPhalanx = "HandRightPinkyPhalanx",
  TabardLower = "TabardLower",
  TabardUpper = "TabardUpper",
  CapeTop = "CapeTop",
  CapeUpperMiddle = "CapeUpperMiddle",
  CapeLowerMiddle = "CapeLowerMiddle",
  CapeEnd = "CapeEnd",
  CapeLeftTail = "CapeLeftTail",
  CapeRightTail = "CapeRightTail",
  LegLeftThigh = "LegLeftThigh",
  LegLeftCalf = "LegLeftCalf",
  FootLeftAnkle = "FootLeftAnkle",
  FootLeftToes = "FootLeftToes",
  LegRightThigh = "LegRightThigh",
  LegRightCalf = "LegRightCalf",
  FootRightAnkle = "FootRightAnkle",
  FootRightToes = "FootRightToes",
  SkirtBackUpper = "SkirtBackUpper",
  SkirtBackMiddle = "SkirtBackMiddle",
  SkirtBackLower = "SkirtBackLower",
  SkirtFrontUpper = "SkirtFrontUpper",
  SkirtFrontMiddle = "SkirtFrontMiddle",
  SkirtFrontLower = "SkirtFrontLower",
  SkirtLeftUpper = "SkirtLeftUpper",
  SkirtLeftMiddle = "SkirtLeftMiddle",
  SkirtLeftLower = "SkirtLeftLower",
  SkirtRightUpper = "SkirtRightUpper",
  SkirtRightMiddle = "SkirtRightMiddle",
  SkirtRightLower = "SkirtRightLower",
  TassetLeftUpper = "TassetLeftUpper",
  TassetLeftLower = "TassetLeftLower",
  TassetRightUpper = "TassetRightUpper",
  TassetRightLower = "TassetRightLower",
  WingRoot = "WingRoot",
  WingLeftBase = "WingLeftBase",
  WingLeftMiddle = "WingLeftMiddle",
  WingLeftTip = "WingLeftTip",
  WingRightBase = "WingRightBase",
  WingRightMiddle = "WingRightMiddle",
  WingRightTip = "WingRightTip",
  SiegeRotate = "SiegeRotate",
  SiegePitch = "SiegePitch",
  SiegeCharacterCenter = "SiegeCharacterCenter",
  SiegeCharacterCenter2 = "SiegeCharacterCenter2",
  SiegeCharacterCenter3 = "SiegeCharacterCenter3",
  SiegeCharacterCenter4 = "SiegeCharacterCenter4",
  SiegeCharacterCenter5 = "SiegeCharacterCenter5",
  SiegeCharacterCenter6 = "SiegeCharacterCenter6",
  SiegeCharacterCenter7 = "SiegeCharacterCenter7",
  SiegeCharacterCenter8 = "SiegeCharacterCenter8",
  Hinge1 = "Hinge1",
  Hinge2 = "Hinge2",
  CollisionAttach1 = "CollisionAttach1",
  CollisionAttach2 = "CollisionAttach2",
  CollisionAttach3 = "CollisionAttach3",
  CollisionAttach4 = "CollisionAttach4",
  BuildingAttachWall = "BuildingAttachWall",
  BuildingAttachCeiling = "BuildingAttachCeiling",
  TrailSlashStart01 = "TrailSlashStart01",
  TrailSlashEnd01 = "TrailSlashEnd01",
  TrailSlashStart02 = "TrailSlashStart02",
  TrailSlashEnd02 = "TrailSlashEnd02",
  TrailPierceStart01 = "TrailPierceStart01",
  TrailPierceEnd01 = "TrailPierceEnd01",
  TrailPierceStart02 = "TrailPierceStart02",
  TrailPierceEnd02 = "TrailPierceEnd02",
  TrailCrushStart01 = "TrailCrushStart01",
  TrailCrushEnd01 = "TrailCrushEnd01",
  TrailCrushStart02 = "TrailCrushStart02",
  TrailCrushEnd02 = "TrailCrushEnd02",
  TrailGripStart01 = "TrailGripStart01",
  TrailGripEnd01 = "TrailGripEnd01",
  TrailShaftStart01 = "TrailShaftStart01",
  TrailShaftEnd01 = "TrailShaftEnd01",
  TrailMotionStart = "TrailMotionStart",
  TrailMotionEnd = "TrailMotionEnd",
  PointStringTop = "PointStringTop",
  PointStringBottom = "PointStringBottom",
  PointKnock = "PointKnock",
  PointPommel01 = "PointPommel01",
  PointVfx01 = "PointVfx01",
  PointVfxCenter01 = "PointVfxCenter01",
  PointVfxRadius01 = "PointVfxRadius01",
  PointFocusSource = "PointFocusSource",
  GameplayCameraFocus = "GameplayCameraFocus",
  GameplayProjectileOrigin = "GameplayProjectileOrigin"
}
/** World.ItemActionUIReaction */
export enum ItemActionUIReaction {
  None = "None",
  CloseInventory = "CloseInventory",
  PlacementMode = "PlacementMode",
  OpenMiniMap = "OpenMiniMap",
  OpenCraftingUI = "OpenCraftingUI"
}
/** World.Items.ItemEquipRequirement+EquipRequirementStatus */
export enum EquipRequirementStatus {
  Unknown = "Unknown",
  NoRequirement = "NoRequirement",
  RequirementMet = "RequirementMet",
  RequirementNotMet = "RequirementNotMet",
  NoCharacterContext = "NoCharacterContext"
}
/** CU.Databases.Models.Items.VoxJobState */
export enum VoxJobState {
  None = "None",
  Configuring = "Configuring",
  Running = "Running",
  Finished = "Finished",
  Collecting = "Collecting"
}
/** CU.Databases.Models.Items.VoxJobOutputItemType */
export enum VoxJobOutputItemType {
  Invalid = "Invalid",
  Normal = "Normal",
  Byproduct = "Byproduct",
  Unused = "Unused"
}
/** CU.StatType */
export enum StatType {
  None = "None",
  Primary = "Primary",
  Secondary = "Secondary",
  Derived = "Derived",
  Hidden = "Hidden"
}
/** CU.Groups.GroupTypes */
export enum GroupTypes {
  Warband = "Warband",
  Battlegroup = "Battlegroup",
  Order = "Order",
  Campaign = "Campaign"
}
/** CU.Groups.InviteStatus */
export enum InviteStatus {
  Active = "Active",
  Revoked = "Revoked",
  UsageLimitReached = "UsageLimitReached",
  Expired = "Expired"
}
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  Trade = "Trade",
  Group = "Group",
  Progression = "Progression"
}
/** CU.Databases.Models.Progression.Events.ScenarioOutcome */
export enum ScenarioOutcome {
  Invalid = "Invalid",
  Win = "Win",
  Lose = "Lose",
  Draw = "Draw",
  Killed = "Killed",
  Restart = "Restart"
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+States */
export enum States {
  Unpublished = "Unpublished",
  Initial = "Initial",
  Handled = "Handled",
  Preserved = "Preserved"
}
/** CU.Databases.Models.Progression.Logs.ScenarioResolution */
export enum ScenarioResolution {
  Started = "Started",
  Finished = "Finished",
  Restarted = "Restarted",
  Killed = "Killed"
}
/** CU.Databases.Models.Progression.ProgressionCharacterType */
export enum ProgressionCharacterType {
  Unknown = "Unknown",
  PlayerCharacter = "PlayerCharacter",
  NonPlayerCharacter = "NonPlayerCharacter",
  Dummy = "Dummy"
}
/** World.SecureTradeState */
export enum SecureTradeState {
  None = "None",
  Invited = "Invited",
  ModifyingItems = "ModifyingItems",
  Locked = "Locked",
  Confirmed = "Confirmed"
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
/** ServerLib.Game.MapPointActionType */
export enum MapPointActionType {
  ClientCommand = "ClientCommand"
}
/** CU.Presence.ZoneInstanceID */
export enum ZoneInstanceID {
  None = "None"
}
/** CU.WebApi.GraphQL.GroupUpdateType */
export enum GroupUpdateType {
  None = "None",
  MemberJoined = "MemberJoined",
  MemberUpdate = "MemberUpdate",
  MemberRemoved = "MemberRemoved"
}
/** CU.Groups.GroupNotificationType */
export enum GroupNotificationType {
  None = "None",
  Joined = "Joined",
  Removed = "Removed"
}
/** ServerLib.GraphQL.Models.SecureTradeUpdateCategory */
export enum SecureTradeUpdateCategory {
  None = "None",
  Complete = "Complete",
  StateUpdate = "StateUpdate",
  ItemUpdate = "ItemUpdate"
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
/** CU.WebApi.GraphQL.MatchmakingUpdateType */
export enum MatchmakingUpdateType {
  None = "None",
  Entered = "Entered",
  Error = "Error",
  KickOff = "KickOff",
  ServerReady = "ServerReady"
}
/** ServerLib.GraphQL.Models.GroupAlertKind */
export enum GroupAlertKind {
  WarbandInvite = "WarbandInvite",
  BattlegroupInvite = "BattlegroupInvite",
  OrderInvite = "OrderInvite",
  CampaignInvite = "CampaignInvite"
}
/** ServerLib.GraphQL.Models.TradeAlertKind */
export enum TradeAlertKind {
  None = "None",
  NewInvite = "NewInvite",
  InviteRevoked = "InviteRevoked",
  InviteAccepted = "InviteAccepted",
  InviteDeclined = "InviteDeclined"
}
/** ServerLib.GraphQL.Models.SecureTradeDoneReason */
export enum SecureTradeDoneReason {
  None = "None",
  Completed = "Completed",
  Canceled = "Canceled"
}

/** The root query object. */
export namespace CUQueryResolvers {
  export interface Resolvers<Context = any> {
    buildingPlotByEntityID?: BuildingPlotByEntityIdResolver<
      BuildingPlotResult | null,
      any,
      Context
    > /** retrieve information about a building plot by its entity ID */;
    buildingPlotByInstanceID?: BuildingPlotByInstanceIdResolver<
      BuildingPlotResult | null,
      any,
      Context
    > /** retrieve information about a building plot */;
    channels?: ChannelsResolver<
      (Channel | null)[] | null,
      any,
      Context
    > /** List all channels. */;
    character?: CharacterResolver<
      CUCharacter | null,
      any,
      Context
    > /** Get a character by id and shard. */;
    connectedServices?: ConnectedServicesResolver<
      ConnectedServices | null,
      any,
      Context
    > /** Status information for connected services */;
    crafting?: CraftingResolver<
      CraftingRecipes | null,
      any,
      Context
    > /** Information about crafting recipes, nearby vox status, and potential interactions with the current vox job. */;
    entityItems?: EntityItemsResolver<
      EntityItemResult | null,
      any,
      Context
    > /** retrieve information about an item that is stored in an entity currently loaded on the server */;
    game?: GameResolver<
      GameDefsGQLData | null,
      any,
      Context
    > /** Information about gameplay definition data */;
    gearSlots?: GearSlotsResolver<
      (GearSlotDefRef | null)[] | null,
      any,
      Context
    > /** gearSlots */;
    invite?: InviteResolver<
      Invite | null,
      any,
      Context
    > /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
    invites?: InvitesResolver<
      (Invite | null)[] | null,
      any,
      Context
    > /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
    item?: ItemResolver<
      Item | null,
      any,
      Context
    > /** retrieve information about an item */;
    metrics?: MetricsResolver<
      MetricsData | null,
      any,
      Context
    > /** metrics data */;
    motd?: MotdResolver<
      (MessageOfTheDay | null)[] | null,
      any,
      Context
    > /** Gets a list of Message of the Days */;
    myActiveScenarioScoreboard?: MyActiveScenarioScoreboardResolver<
      MyScenarioScoreboard | null,
      any,
      Context
    > /** Gets information about the active scenario score a user is in. */;
    myActiveWarband?: MyActiveWarbandResolver<
      GraphQLActiveWarband | null,
      any,
      Context
    > /** A users active warband */;
    myBattlegroup?: MyBattlegroupResolver<
      GraphQLBattlegroup | null,
      any,
      Context
    > /** A users battleground */;
    myCharacter?: MyCharacterResolver<
      CUCharacter | null,
      any,
      Context
    > /** Get the character of the currently logged in user. */;
    myEquippedItems?: MyEquippedItemsResolver<
      MyEquippedItems | null,
      any,
      Context
    > /** retrieve all the session users equipped items */;
    myInteractiveAlerts?: MyInteractiveAlertsResolver<
      (IInteractiveAlert | null)[] | null,
      any,
      Context
    > /** Alerts */;
    myInventory?: MyInventoryResolver<
      MyInventory | null,
      any,
      Context
    > /** Retrieve data about the character's inventory */;
    myOrder?: MyOrderResolver<
      Order | null,
      any,
      Context
    > /** Gets information about the order your character is in, if any. */;
    myPassiveAlerts?: MyPassiveAlertsResolver<
      (PassiveAlert | null)[] | null,
      any,
      Context
    > /** Alerts that notify players something happened but do not need to be reacted to. */;
    myprogression?: MyprogressionResolver<
      CharacterProgressionData | null,
      any,
      Context
    > /** Information about progression data for the character. */;
    myScenarioQueue?: MyScenarioQueueResolver<
      MyScenarioQueue | null,
      any,
      Context
    > /** Gets information about available scenarios and their queue status */;
    patcherAlerts?: PatcherAlertsResolver<
      (PatcherAlert | null)[] | null,
      any,
      Context
    > /** Gets patcher alerts */;
    patcherHero?: PatcherHeroResolver<
      (PatcherHero | null)[] | null,
      any,
      Context
    > /** Gets Patcher Hero content */;
    patchNote?: PatchNoteResolver<
      PatchNote | null,
      any,
      Context
    > /** Gets a single patch note */;
    patchNotes?: PatchNotesResolver<
      (PatchNote | null)[] | null,
      any,
      Context
    > /** Gets patch notes */;
    resourceNode?: ResourceNodeResolver<
      ResourceNodeResult | null,
      any,
      Context
    > /** retrieve information about a resource node */;
    scenariosummary?: ScenariosummaryResolver<
      ScenarioSummaryDBModel | null,
      any,
      Context
    > /** retrieve information about a scenario */;
    secureTrade?: SecureTradeResolver<
      SecureTradeStatus | null,
      any,
      Context
    > /** Information about current secure item trade the player is engaged in. */;
    shardCharacters?: ShardCharactersResolver<
      (SimpleCharacter | null)[] | null,
      any,
      Context
    > /** Gets all the characters from the requested shard for the account. */;
    shardprogression?: ShardprogressionResolver<
      ShardProgressionData | null,
      any,
      Context
    > /** Information about progression data for the entire shard. */;
    status?: StatusResolver<
      Status | null,
      any,
      Context
    > /** Information about statuses */;
    substances?: SubstancesResolver<
      (SubstanceDefRef | null)[] | null,
      any,
      Context
    > /** list all available substances */;
    test?: TestResolver<
      Test | null,
      any,
      Context
    > /** Just here for testing, please ignore. */;
    traits?: TraitsResolver<
      TraitsInfo | null,
      any,
      Context
    > /** Get all possible traits. */;
    voxJob?: VoxJobResolver<
      VoxJobStatusGQL | null,
      any,
      Context
    > /** retrieve information about a vox job */;
    world?: WorldResolver<
      WorldData | null,
      any,
      Context
    > /** Information about the current game world */;
  }

  export type BuildingPlotByEntityIdResolver<
    R = BuildingPlotResult | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, BuildingPlotByEntityIdArgs>;
  export interface BuildingPlotByEntityIdArgs {
    id?: string | null /** Building Plot entity ID. */;
  }

  export type BuildingPlotByInstanceIdResolver<
    R = BuildingPlotResult | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, BuildingPlotByInstanceIdArgs>;
  export interface BuildingPlotByInstanceIdArgs {
    id?: string | null /** Building Plot Instance ID. */;
  }

  export type ChannelsResolver<
    R = (Channel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterResolver<
    R = CUCharacter | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, CharacterArgs>;
  export interface CharacterArgs {
    id?: string | null;
    shard?: number | null;
  }

  export type ConnectedServicesResolver<
    R = ConnectedServices | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingRecipes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EntityItemsResolver<
    R = EntityItemResult | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, EntityItemsArgs>;
  export interface EntityItemsArgs {
    id?: string | null /** Entity ID. (required) */;
  }

  export type GameResolver<
    R = GameDefsGQLData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GearSlotsResolver<
    R = (GearSlotDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InviteResolver<
    R = Invite | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, InviteArgs>;
  export interface InviteArgs {
    shard?: number | null /** shard id. (required) */;
    code?: string | null /** invite code. (required) */;
  }

  export type InvitesResolver<
    R = (Invite | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, InvitesArgs>;
  export interface InvitesArgs {
    shard?: number | null /** shard id. (required) */;
    forGroup?:
      | string
      | null /** ID of group from which invites are sent for. (optional) */;
    toGroup?:
      | string
      | null /** ID of group to which invites are sent to. (optional) */;
    toCharacter?:
      | string
      | null /** ID of character to which invites are sent to. (optional) */;
    includeInactive?:
      | boolean
      | null /** Should the response include inactive invites? */;
  }

  export type ItemResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ItemArgs>;
  export interface ItemArgs {
    shard?: number | null /** Shard ID. (required) */;
    id?: string | null /** Item ID. (required) */;
  }

  export type MetricsResolver<
    R = MetricsData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MotdResolver<
    R = (MessageOfTheDay | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, MotdArgs>;
  export interface MotdArgs {
    channel?:
      | number
      | null /** Required: Channel ID from which to return message of the day */;
  }

  export type MyActiveScenarioScoreboardResolver<
    R = MyScenarioScoreboard | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyActiveWarbandResolver<
    R = GraphQLActiveWarband | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyBattlegroupResolver<
    R = GraphQLBattlegroup | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyCharacterResolver<
    R = CUCharacter | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyEquippedItemsResolver<
    R = MyEquippedItems | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, MyEquippedItemsArgs>;
  export interface MyEquippedItemsArgs {
    allowOfflineItems?:
      | boolean
      | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
  }

  export type MyInteractiveAlertsResolver<
    R = (IInteractiveAlert | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyInventoryResolver<
    R = MyInventory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, MyInventoryArgs>;
  export interface MyInventoryArgs {
    allowOfflineItems?:
      | boolean
      | null /** If true and the character is not found in the worldstate, look for items in the DB.  If false and the character is not found an error is returned */;
  }

  export type MyOrderResolver<
    R = Order | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyPassiveAlertsResolver<
    R = (PassiveAlert | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyprogressionResolver<
    R = CharacterProgressionData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyScenarioQueueResolver<
    R = MyScenarioQueue | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PatcherAlertsResolver<
    R = (PatcherAlert | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PatcherAlertsArgs>;
  export interface PatcherAlertsArgs {
    from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return. */;
    to?: Date | null /** Optional: Newest date (non-inclusive) from which to return. */;
  }

  export type PatcherHeroResolver<
    R = (PatcherHero | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PatcherHeroArgs>;
  export interface PatcherHeroArgs {
    from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
    to?: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  }

  export type PatchNoteResolver<
    R = PatchNote | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PatchNoteArgs>;
  export interface PatchNoteArgs {
    id?: string | null /** Required: ID of the patch note. */;
  }

  export type PatchNotesResolver<
    R = (PatchNote | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PatchNotesArgs>;
  export interface PatchNotesArgs {
    from?: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
    to?: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
    channel?:
      | number
      | null /** Required: Channel ID from which to return patch notes. */;
  }

  export type ResourceNodeResolver<
    R = ResourceNodeResult | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ResourceNodeArgs>;
  export interface ResourceNodeArgs {
    shard?: number | null /** Shard ID. (required) */;
    id?: string | null /** Entity ID. (required) */;
  }

  export type ScenariosummaryResolver<
    R = ScenarioSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ScenariosummaryArgs>;
  export interface ScenariosummaryArgs {
    id?: string | null /** Scenario Instance ID. (required) */;
    shard?: number | null /** The id of the shard to request data from. */;
  }

  export type SecureTradeResolver<
    R = SecureTradeStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardCharactersResolver<
    R = (SimpleCharacter | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ShardCharactersArgs>;
  export interface ShardCharactersArgs {
    onShard?:
      | number
      | null /** If you want to request for a specific shard, use this parameter. Otherwise, will fetch characters on all shards. */;
  }

  export type ShardprogressionResolver<
    R = ShardProgressionData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ShardprogressionArgs>;
  export interface ShardprogressionArgs {
    shard?:
      | number
      | null /** The id of the shard to request progression data from. */;
  }

  export type StatusResolver<
    R = Status | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SubstancesResolver<
    R = (SubstanceDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TestResolver<
    R = Test | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TraitsResolver<
    R = TraitsInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxJobResolver<
    R = VoxJobStatusGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, VoxJobArgs>;
  export interface VoxJobArgs {
    entityID?: string | null /** Entity ID. (required) */;
    voxJobID?: string | null /** vox job ID. (required) */;
  }

  export type WorldResolver<
    R = WorldData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.BuildingPlotResult */
export namespace BuildingPlotResultResolvers {
  export interface Resolvers<Context = any> {
    buildingPlacedItemsCount?: BuildingPlacedItemsCountResolver<
      number | null,
      any,
      Context
    >;
    capturingFaction?: CapturingFactionResolver<Faction | null, any, Context>;
    contestedState?: ContestedStateResolver<
      PlotContestedState | null,
      any,
      Context
    >;
    currentCaptureScore?: CurrentCaptureScoreResolver<
      Decimal | null,
      any,
      Context
    >;
    entityID?: EntityIdResolver<EntityID | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    instanceID?: InstanceIdResolver<
      BuildingPlotInstanceID | null,
      any,
      Context
    >;
    maxBlocks?: MaxBlocksResolver<number | null, any, Context>;
    ownedByName?: OwnedByNameResolver<string | null, any, Context>;
    permissibleKeyType?: PermissibleKeyTypeResolver<
      PermissibleSetKeyType | null,
      any,
      Context
    >;
    permissions?: PermissionsResolver<
      FlagsPermissibleHolderGQL | null,
      any,
      Context
    >;
    position?: PositionResolver<Vec3f | null, any, Context>;
    scoreToCapture?: ScoreToCaptureResolver<Decimal | null, any, Context>;
    size?: SizeResolver<Vec3f | null, any, Context>;
  }

  export type BuildingPlacedItemsCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CapturingFactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ContestedStateResolver<
    R = PlotContestedState | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CurrentCaptureScoreResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EntityIdResolver<
    R = EntityID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InstanceIdResolver<
    R = BuildingPlotInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxBlocksResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OwnedByNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissibleKeyTypeResolver<
    R = PermissibleSetKeyType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissionsResolver<
    R = FlagsPermissibleHolderGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Vec3f | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreToCaptureResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SizeResolver<
    R = Vec3f | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.FlagsPermissibleHolderGQL */
export namespace FlagsPermissibleHolderGQLResolvers {
  export interface Resolvers<Context = any> {
    noActiveSetsPermissions?: NoActiveSetsPermissionsResolver<
      FlagsPermissibleGQL | null,
      any,
      Context
    >;
    permissibleSets?: PermissibleSetsResolver<
      (FlagsPermissibleSetGQL | null)[] | null,
      any,
      Context
    >;
    userGrants?: UserGrantsResolver<
      (FlagsPermissibleGrantGQL | null)[] | null,
      any,
      Context
    >;
    userPermissions?: UserPermissionsResolver<number | null, any, Context>;
  }

  export type NoActiveSetsPermissionsResolver<
    R = FlagsPermissibleGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissibleSetsResolver<
    R = (FlagsPermissibleSetGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UserGrantsResolver<
    R = (FlagsPermissibleGrantGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UserPermissionsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.FlagsPermissibleGQL */
export namespace FlagsPermissibleGQLResolvers {
  export interface Resolvers<Context = any> {
    grants?: GrantsResolver<
      (FlagsPermissibleGrantGQL | null)[] | null,
      any,
      Context
    >;
    permissions?: PermissionsResolver<number | null, any, Context>;
    target?: TargetResolver<PermissibleTargetGQL | null, any, Context>;
  }

  export type GrantsResolver<
    R = (FlagsPermissibleGrantGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissionsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetResolver<
    R = PermissibleTargetGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.FlagsPermissibleGrantGQL */
export namespace FlagsPermissibleGrantGQLResolvers {
  export interface Resolvers<Context = any> {
    grantPermissions?: GrantPermissionsResolver<number | null, any, Context>;
    grants?: GrantsResolver<
      (FlagsPermissibleGrantGQL | null)[] | null,
      any,
      Context
    >;
    permissions?: PermissionsResolver<number | null, any, Context>;
    target?: TargetResolver<PermissibleTargetGQL | null, any, Context>;
  }

  export type GrantPermissionsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GrantsResolver<
    R = (FlagsPermissibleGrantGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissionsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetResolver<
    R = PermissibleTargetGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.PermissibleTargetGQL */
export namespace PermissibleTargetGQLResolvers {
  export interface Resolvers<Context = any> {
    characterName?: CharacterNameResolver<string | null, any, Context>;
    description?: DescriptionResolver<string | null, any, Context>;
    targetType?: TargetTypeResolver<PermissibleTargetType | null, any, Context>;
  }

  export type CharacterNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetTypeResolver<
    R = PermissibleTargetType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.FlagsPermissibleSetGQL */
export namespace FlagsPermissibleSetGQLResolvers {
  export interface Resolvers<Context = any> {
    isActive?: IsActiveResolver<boolean | null, any, Context>;
    keyDescription?: KeyDescriptionResolver<string | null, any, Context>;
    keyType?: KeyTypeResolver<PermissibleSetKeyType | null, any, Context>;
    permissibles?: PermissiblesResolver<
      (FlagsPermissibleGQL | null)[] | null,
      any,
      Context
    >;
    userMatchesKey?: UserMatchesKeyResolver<boolean | null, any, Context>;
  }

  export type IsActiveResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KeyDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KeyTypeResolver<
    R = PermissibleSetKeyType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissiblesResolver<
    R = (FlagsPermissibleGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UserMatchesKeyResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Vec3f */
export namespace Vec3fResolvers {
  export interface Resolvers<Context = any> {
    x?: XResolver<Decimal | null, any, Context>;
    y?: YResolver<Decimal | null, any, Context>;
    z?: ZResolver<Decimal | null, any, Context>;
  }

  export type XResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type YResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ZResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.Channel */
export namespace ChannelResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    id?: IdResolver<number | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    permissions?: PermissionsResolver<PatchPermissions | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissionsResolver<
    R = PatchPermissions | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.CUCharacter */
export namespace CUCharacterResolvers {
  export interface Resolvers<Context = any> {
    abilities?: AbilitiesResolver<(Ability | null)[] | null, any, Context>;
    ability?: AbilityResolver<Ability | null, any, Context>;
    archetype?: ArchetypeResolver<Archetype | null, any, Context>;
    entityID?: EntityIdResolver<EntityID | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    gender?: GenderResolver<Gender | null, any, Context>;
    id?: IdResolver<CharacterID | null, any, Context>;
    maxBlood?: MaxBloodResolver<Decimal | null, any, Context>;
    maxHealth?: MaxHealthResolver<Decimal | null, any, Context>;
    maxPanic?: MaxPanicResolver<Decimal | null, any, Context>;
    maxStamina?: MaxStaminaResolver<Decimal | null, any, Context>;
    name?: NameResolver<NormalizedString | null, any, Context>;
    order?: OrderResolver<GroupID | null, any, Context>;
    progression?: ProgressionResolver<
      ProgressionComponentGQLField | null,
      any,
      Context
    >;
    race?: RaceResolver<Race | null, any, Context>;
    session?: SessionResolver<SessionStatsField | null, any, Context>;
    stats?: StatsResolver<(CharacterStatField | null)[] | null, any, Context>;
    traits?: TraitsResolver<(Trait | null)[] | null, any, Context>;
  }

  export type AbilitiesResolver<
    R = (Ability | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityResolver<
    R = Ability | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AbilityArgs>;
  export interface AbilityArgs {
    id?: number | null /** ID of the ability. */;
  }

  export type ArchetypeResolver<
    R = Archetype | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EntityIdResolver<
    R = EntityID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GenderResolver<
    R = Gender | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxBloodResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxPanicResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxStaminaResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = NormalizedString | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OrderResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionResolver<
    R = ProgressionComponentGQLField | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceResolver<
    R = Race | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SessionResolver<
    R = SessionStatsField | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsResolver<
    R = (CharacterStatField | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TraitsResolver<
    R = (Trait | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.AbilityGQL */
export namespace AbilityResolvers {
  export interface Resolvers<Context = any> {
    abilityComponents?: AbilityComponentsResolver<
      (AbilityComponentDefRef | null)[] | null,
      any,
      Context
    >;
    abilityNetwork?: AbilityNetworkResolver<
      AbilityNetworkDefRef | null,
      any,
      Context
    >;
    description?: DescriptionResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<AbilityInstanceID | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    readOnly?: ReadOnlyResolver<boolean | null, any, Context>;
    tracks?: TracksResolver<AbilityTracks | null, any, Context>;
  }

  export type AbilityComponentsResolver<
    R = (AbilityComponentDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityNetworkResolver<
    R = AbilityNetworkDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = AbilityInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReadOnlyResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TracksResolver<
    R = AbilityTracks | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.Abilities.AbilityComponentDefRef */
export namespace AbilityComponentDefRefResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentCategory?: AbilityComponentCategoryResolver<
      AbilityComponentCategoryDefRef | null,
      any,
      Context
    >;
    abilityTags?: AbilityTagsResolver<(string | null)[] | null, any, Context>;
    display?: DisplayResolver<DisplayInfoDef | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    networkRequirements?: NetworkRequirementsResolver<
      (AbilityNetworkRequirementGQL | null)[] | null,
      any,
      Context
    >;
    progression?: ProgressionResolver<
      AbilityComponentProgressionDef | null,
      any,
      Context
    >;
  }

  export type AbilityComponentCategoryResolver<
    R = AbilityComponentCategoryDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityTagsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayResolver<
    R = DisplayInfoDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NetworkRequirementsResolver<
    R = (AbilityNetworkRequirementGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionResolver<
    R = AbilityComponentProgressionDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.Abilities.AbilityComponentCategoryDefRef */
export namespace AbilityComponentCategoryDefRefResolvers {
  export interface Resolvers<Context = any> {
    displayInfo?: DisplayInfoResolver<DisplayInfoDef | null, any, Context>;
    displayOption?: DisplayOptionResolver<
      AbilityComponentCategoryDisplay | null,
      any,
      Context
    >;
    id?: IdResolver<string | null, any, Context>;
    isPrimary?: IsPrimaryResolver<boolean | null, any, Context>;
    isRequired?: IsRequiredResolver<boolean | null, any, Context>;
  }

  export type DisplayInfoResolver<
    R = DisplayInfoDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayOptionResolver<
    R = AbilityComponentCategoryDisplay | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsPrimaryResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsRequiredResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.DisplayInfoDef */
export namespace DisplayInfoDefResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    iconClass?: IconClassResolver<string | null, any, Context>;
    iconURL?: IconUrlResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconClassResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.AbilityNetworkRequirementGQL */
export namespace AbilityNetworkRequirementGQLResolvers {
  export interface Resolvers<Context = any> {
    excludeComponent?: ExcludeComponentResolver<
      ExcludeAbilityComponentDef | null,
      any,
      Context
    >;
    excludeTag?: ExcludeTagResolver<ExcludeTagDef | null, any, Context>;
    requireComponent?: RequireComponentResolver<
      RequireAbilityComponentDef | null,
      any,
      Context
    >;
    requireTag?: RequireTagResolver<RequireTagDef | null, any, Context>;
  }

  export type ExcludeComponentResolver<
    R = ExcludeAbilityComponentDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExcludeTagResolver<
    R = ExcludeTagDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequireComponentResolver<
    R = RequireAbilityComponentDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequireTagResolver<
    R = RequireTagDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.ExcludeAbilityComponentDef */
export namespace ExcludeAbilityComponentDefResolvers {
  export interface Resolvers<Context = any> {
    component?: ComponentResolver<AbilityComponentDefRef | null, any, Context>;
  }

  export type ComponentResolver<
    R = AbilityComponentDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.ExcludeTagDef */
export namespace ExcludeTagDefResolvers {
  export interface Resolvers<Context = any> {
    tag?: TagResolver<string | null, any, Context>;
  }

  export type TagResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.RequireAbilityComponentDef */
export namespace RequireAbilityComponentDefResolvers {
  export interface Resolvers<Context = any> {
    component?: ComponentResolver<AbilityComponentDefRef | null, any, Context>;
  }

  export type ComponentResolver<
    R = AbilityComponentDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Abilities.RequireTagDef */
export namespace RequireTagDefResolvers {
  export interface Resolvers<Context = any> {
    tag?: TagResolver<string | null, any, Context>;
  }

  export type TagResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.AbilityComponentProgressionDef */
export namespace AbilityComponentProgressionDefResolvers {
  export interface Resolvers<Context = any> {
    levels?: LevelsResolver<
      AbilityComponentLevelTableDefRef | null,
      any,
      Context
    >;
    requirements?: RequirementsResolver<
      (AbilityComponentProgressionRequirementGQL | null)[] | null,
      any,
      Context
    >;
  }

  export type LevelsResolver<
    R = AbilityComponentLevelTableDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementsResolver<
    R = (AbilityComponentProgressionRequirementGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.AbilityComponentLevelTableDefRef */
export namespace AbilityComponentLevelTableDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context>;
    levels?: LevelsResolver<(Level | null)[] | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LevelsResolver<
    R = (Level | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.AbilityComponentLevelTableDef+Level */
export namespace LevelResolvers {
  export interface Resolvers<Context = any> {
    levelNumber?: LevelNumberResolver<number | null, any, Context>;
    progressionForLevel?: ProgressionForLevelResolver<
      number | null,
      any,
      Context
    >;
  }

  export type LevelNumberResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionForLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.AbilityComponentProgressionRequirementGQL */
export namespace AbilityComponentProgressionRequirementGQLResolvers {
  export interface Resolvers<Context = any> {
    maxLevel?: MaxLevelResolver<
      OtherComponentAtMaxLevelRequirementDef | null,
      any,
      Context
    >;
  }

  export type MaxLevelResolver<
    R = OtherComponentAtMaxLevelRequirementDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.OtherComponentAtMaxLevelRequirementDef */
export namespace OtherComponentAtMaxLevelRequirementDefResolvers {
  export interface Resolvers<Context = any> {
    otherComponent?: OtherComponentResolver<
      AbilityComponentDefRef | null,
      any,
      Context
    >;
  }

  export type OtherComponentResolver<
    R = AbilityComponentDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.Abilities.AbilityNetworkDefRef */
export namespace AbilityNetworkDefRefResolvers {
  export interface Resolvers<Context = any> {
    componentCategories?: ComponentCategoriesResolver<
      (AbilityComponentCategoryDefRef | null)[] | null,
      any,
      Context
    >;
    display?: DisplayResolver<DisplayInfoDef | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
  }

  export type ComponentCategoriesResolver<
    R = (AbilityComponentCategoryDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayResolver<
    R = DisplayInfoDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.ProgressionComponentGQLField */
export namespace ProgressionComponentGQLFieldResolvers {
  export interface Resolvers<Context = any> {
    abilityComponents?: AbilityComponentsResolver<
      (AbilityComponentProgressionGQLField | null)[] | null,
      any,
      Context
    >;
    characterStats?: CharacterStatsResolver<
      (CharacterStatProgressionGQLField | null)[] | null,
      any,
      Context
    >;
  }

  export type AbilityComponentsResolver<
    R = (AbilityComponentProgressionGQLField | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterStatsResolver<
    R = (CharacterStatProgressionGQLField | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.AbilityComponentProgressionGQLField */
export namespace AbilityComponentProgressionGQLFieldResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentID?: AbilityComponentIdResolver<
      string | null,
      any,
      Context
    >;
    level?: LevelResolver<number | null, any, Context>;
    progressionPoints?: ProgressionPointsResolver<number | null, any, Context>;
  }

  export type AbilityComponentIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.CharacterStatProgressionGQLField */
export namespace CharacterStatProgressionGQLFieldResolvers {
  export interface Resolvers<Context = any> {
    bonusPoints?: BonusPointsResolver<number | null, any, Context>;
    progressionPoints?: ProgressionPointsResolver<number | null, any, Context>;
    stat?: StatResolver<Stat | null, any, Context>;
  }

  export type BonusPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.SessionStatsField */
export namespace SessionStatsFieldResolvers {
  export interface Resolvers<Context = any> {
    sessionStartDate?: SessionStartDateResolver<string | null, any, Context>;
    sessionStartTicks?: SessionStartTicksResolver<Decimal | null, any, Context>;
    skillPartsUsed?: SkillPartsUsedResolver<
      (SkillPartsUsedField | null)[] | null,
      any,
      Context
    >;
  }

  export type SessionStartDateResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SessionStartTicksResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartsUsedResolver<
    R = (SkillPartsUsedField | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.SkillPartsUsedField */
export namespace SkillPartsUsedFieldResolvers {
  export interface Resolvers<Context = any> {
    skillPart?: SkillPartResolver<AbilityComponentGQL | null, any, Context>;
    timesUsed?: TimesUsedResolver<number | null, any, Context>;
  }

  export type SkillPartResolver<
    R = AbilityComponentGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TimesUsedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.AbilityComponentGQL */
export namespace AbilityComponentGQLResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.CharacterStatField */
export namespace CharacterStatFieldResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    stat?: StatResolver<Stat | null, any, Context>;
    value?: ValueResolver<Decimal | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Trait */
export namespace TraitResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<
      TraitCategory | null,
      any,
      Context
    > /** Category */;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** The description of this trait */;
    exclusives?: ExclusivesResolver<
      ExclusiveTraitsInfo | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
    icon?: IconResolver<
      string | null,
      any,
      Context
    > /** Url for the icon for this trait */;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<
      string | null,
      any,
      Context
    > /** The name of this trait */;
    points?: PointsResolver<
      number | null,
      any,
      Context
    > /** The point value of this trait */;
    prerequisites?: PrerequisitesResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
    ranks?: RanksResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
    required?: RequiredResolver<
      boolean | null,
      any,
      Context
    > /** Whether or not this is a required trait. */;
    specifier?: SpecifierResolver<
      string | null,
      any,
      Context
    > /** Specifies the defining type based on category */;
  }

  export type CategoryResolver<
    R = TraitCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExclusivesResolver<
    R = ExclusiveTraitsInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PrerequisitesResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RanksResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequiredResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpecifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ExclusiveTraitsInfo */
export namespace ExclusiveTraitsInfoResolvers {
  export interface Resolvers<Context = any> {
    ids?: IdsResolver<(string | null)[] | null, any, Context>;
    maxAllowed?: MaxAllowedResolver<number | null, any, Context>;
    minRequired?: MinRequiredResolver<number | null, any, Context>;
  }

  export type IdsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxAllowedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinRequiredResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.ConnectedServices */
export namespace ConnectedServicesResolvers {
  export interface Resolvers<Context = any> {
    servers?: ServersResolver<(ServerModel | null)[] | null, any, Context>;
  }

  export type ServersResolver<
    R = (ServerModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.ServerModel */
export namespace ServerModelResolvers {
  export interface Resolvers<Context = any> {
    accessLevel?: AccessLevelResolver<AccessType | null, any, Context>;
    apiHost?: ApiHostResolver<string | null, any, Context>;
    channelID?: ChannelIdResolver<number | null, any, Context>;
    channelPatchPermissions?: ChannelPatchPermissionsResolver<
      number | null,
      any,
      Context
    >;
    host?: HostResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    playerMaximum?: PlayerMaximumResolver<number | null, any, Context>;
    shardID?: ShardIdResolver<number | null, any, Context>;
    status?: StatusResolver<ServerStatus | null, any, Context>;
  }

  export type AccessLevelResolver<
    R = AccessType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ApiHostResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ChannelIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ChannelPatchPermissionsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HostResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlayerMaximumResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = ServerStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Crafting.CraftingRecipes */
export namespace CraftingRecipesResolvers {
  export interface Resolvers<Context = any> {
    blockRecipes?: BlockRecipesResolver<
      (BlockRecipeDefRef | null)[] | null,
      any,
      Context
    > /** List of recipes for the Block vox job */;
    grindRecipes?: GrindRecipesResolver<
      (GrindRecipeDefRef | null)[] | null,
      any,
      Context
    > /** List of recipes for the Grind vox job */;
    makeRecipes?: MakeRecipesResolver<
      (MakeRecipeDefRef | null)[] | null,
      any,
      Context
    > /** List of recipes for the Make vox job */;
    nearestVoxEntityID?: NearestVoxEntityIdResolver<
      EntityID | null,
      any,
      Context
    > /** Entity ID of the closest vox that can be crafted with */;
    purifyRecipes?: PurifyRecipesResolver<
      (PurifyRecipeDefRef | null)[] | null,
      any,
      Context
    > /** List of recipes for the Purify vox job */;
    shapeRecipes?: ShapeRecipesResolver<
      (ShapeRecipeDefRef | null)[] | null,
      any,
      Context
    > /** List of recipes for the Shape vox job which have been discovered by the player.  Shape recipes are discovered when the right combination of materials are added to a vox during a shape job. */;
    voxJobGroupLog?: VoxJobGroupLogResolver<
      (VoxJobGroupLogDBModel | null)[] | null,
      any,
      Context
    >;
    voxJobGroupLogs?: VoxJobGroupLogsResolver<
      (VoxJobGroupLogDBModel | null)[] | null,
      any,
      Context
    >;
    voxJobLogCount?: VoxJobLogCountResolver<number | null, any, Context>;
    voxJobLogs?: VoxJobLogsResolver<
      (VoxJobLogDBModel | null)[] | null,
      any,
      Context
    >;
    voxNotes?: VoxNotesResolver<
      (VoxNotesDBModel | null)[] | null,
      any,
      Context
    >;
  }

  export type BlockRecipesResolver<
    R = (BlockRecipeDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GrindRecipesResolver<
    R = (GrindRecipeDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MakeRecipesResolver<
    R = (MakeRecipeDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NearestVoxEntityIdResolver<
    R = EntityID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PurifyRecipesResolver<
    R = (PurifyRecipeDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShapeRecipesResolver<
    R = (ShapeRecipeDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxJobGroupLogResolver<
    R = (VoxJobGroupLogDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, VoxJobGroupLogArgs>;
  export interface VoxJobGroupLogArgs {
    jobIdentifier?: string | null;
    jobType?: string | null;
  }

  export type VoxJobGroupLogsResolver<
    R = (VoxJobGroupLogDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxJobLogCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, VoxJobLogCountArgs>;
  export interface VoxJobLogCountArgs {
    favoriteFilter?: string | null;
    textFilter?: string | null;
    jobIdentifier?: string | null;
    jobType?: string | null;
  }

  export type VoxJobLogsResolver<
    R = (VoxJobLogDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, VoxJobLogsArgs>;
  export interface VoxJobLogsArgs {
    favoriteFilter?: string | null;
    textFilter?: string | null;
    jobIdentifier?: string | null;
    jobType?: string | null;
    dateSort?: string | null;
    page?: number | null;
    count?: number | null;
  }

  export type VoxNotesResolver<
    R = (VoxNotesDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.BlockRecipeDefRef */
export namespace BlockRecipeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique recipe identifier */;
    ingredients?: IngredientsResolver<
      (RecipeIngredientDef | null)[] | null,
      any,
      Context
    > /** Ingredient rules for crafting the item */;
    outputItem?: OutputItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The template of the block item which will be produced by this recipe */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientsResolver<
    R = (RecipeIngredientDef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.RecipeIngredientDef */
export namespace RecipeIngredientDefResolvers {
  export interface Resolvers<Context = any> {
    ingredient?: IngredientResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The item required by this part of the recipe */;
    maxQuality?: MaxQualityResolver<
      Decimal | null,
      any,
      Context
    > /** The maximum quality the ingredient must be.  Value is 0-1 */;
    maxUnitCount?: MaxUnitCountResolver<
      number | null,
      any,
      Context
    > /** The maximum units of this item that must be provided. Note that multiple sets of final product can be produced given sufficient amounts of all ingredients */;
    minQuality?: MinQualityResolver<
      Decimal | null,
      any,
      Context
    > /** The minimum quality the ingredient must be.  Value is 0-1 */;
    minUnitCount?: MinUnitCountResolver<
      number | null,
      any,
      Context
    > /** The minimum units of this item that must be provided */;
    requirement?: RequirementResolver<
      ItemRequirementByStringIDDefRef | null,
      any,
      Context
    > /** Extra requirements on the item, not used if the ingredient is provided. */;
  }

  export type IngredientResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxUnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinUnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementResolver<
    R = ItemRequirementByStringIDDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ItemDefRef */
export namespace ItemDefRefResolvers {
  export interface Resolvers<Context = any> {
    alloyDefinition?: AlloyDefinitionResolver<
      AlloyDefRef | null,
      any,
      Context
    > /** Alloy information for this item definition */;
    defaultResourceID?: DefaultResourceIdResolver<string | null, any, Context>;
    deploySettings?: DeploySettingsResolver<
      DeploySettingsDefRef | null,
      any,
      Context
    >;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** Description of the item */;
    gearSlotSets?: GearSlotSetsResolver<
      (GearSlotSet | null)[] | null,
      any,
      Context
    > /** the sets of gear slots this item can be equipped to */;
    iconUrl?: IconUrlResolver<
      string | null,
      any,
      Context
    > /** URL to the item's icon */;
    id?: IdResolver<string | null, any, Context> /** Unique item identifier */;
    isPlotDeed?: IsPlotDeedResolver<boolean | null, any, Context>;
    isStackableItem?: IsStackableItemResolver<boolean | null, any, Context>;
    isVox?: IsVoxResolver<boolean | null, any, Context>;
    isVoxToken?: IsVoxTokenResolver<boolean | null, any, Context>;
    itemType?: ItemTypeResolver<
      ItemType | null,
      any,
      Context
    > /** The type of item */;
    name?: NameResolver<string | null, any, Context> /** Name of the item */;
    numericItemDefID?: NumericItemDefIdResolver<number | null, any, Context>;
    substanceDefinition?: SubstanceDefinitionResolver<
      SubstanceDefRef | null,
      any,
      Context
    > /** Substance information for this item definition */;
    tags?: TagsResolver<
      (string | null)[] | null,
      any,
      Context
    > /** Tags on this item, these can be referenced by recipes */;
  }

  export type AlloyDefinitionResolver<
    R = AlloyDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DefaultResourceIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeploySettingsResolver<
    R = DeploySettingsDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GearSlotSetsResolver<
    R = (GearSlotSet | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsPlotDeedResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsStackableItemResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsVoxResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsVoxTokenResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemTypeResolver<
    R = ItemType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NumericItemDefIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SubstanceDefinitionResolver<
    R = SubstanceDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TagsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.AlloyDefRef */
export namespace AlloyDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context>;
    subType?: SubTypeResolver<string | null, any, Context>;
    type?: TypeResolver<string | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SubTypeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.DeploySettingsDefRef */
export namespace DeploySettingsDefRefResolvers {
  export interface Resolvers<Context = any> {
    alwaysShowOnMap?: AlwaysShowOnMapResolver<boolean | null, any, Context>;
    isDoor?: IsDoorResolver<boolean | null, any, Context>;
    itemPlacementType?: ItemPlacementTypeResolver<
      ItemPlacementType | null,
      any,
      Context
    >;
    itemTemplateType?: ItemTemplateTypeResolver<
      ItemTemplateType | null,
      any,
      Context
    >;
    mapIconAnchorX?: MapIconAnchorXResolver<Decimal | null, any, Context>;
    mapIconAnchorY?: MapIconAnchorYResolver<Decimal | null, any, Context>;
    mapIconURL?: MapIconUrlResolver<string | null, any, Context>;
    maxPitch?: MaxPitchResolver<Decimal | null, any, Context>;
    maxTerrainPitch?: MaxTerrainPitchResolver<Decimal | null, any, Context>;
    plotSize?: PlotSizeResolver<string | null, any, Context>;
    requiredZoneType?: RequiredZoneTypeResolver<ZoneType | null, any, Context>;
    resourceID?: ResourceIdResolver<string | null, any, Context>;
    rotatePitch?: RotatePitchResolver<boolean | null, any, Context>;
    rotateRoll?: RotateRollResolver<boolean | null, any, Context>;
    rotateYaw?: RotateYawResolver<boolean | null, any, Context>;
    skipDeployLimitCheck?: SkipDeployLimitCheckResolver<
      boolean | null,
      any,
      Context
    >;
    snapToGround?: SnapToGroundResolver<boolean | null, any, Context>;
  }

  export type AlwaysShowOnMapResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsDoorResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemPlacementTypeResolver<
    R = ItemPlacementType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemTemplateTypeResolver<
    R = ItemTemplateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconAnchorXResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconAnchorYResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxPitchResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxTerrainPitchResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlotSizeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequiredZoneTypeResolver<
    R = ZoneType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResourceIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RotatePitchResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RotateRollResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RotateYawResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkipDeployLimitCheckResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SnapToGroundResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.GearSlotSet */
export namespace GearSlotSetResolvers {
  export interface Resolvers<Context = any> {
    gearSlots?: GearSlotsResolver<
      (GearSlotDefRef | null)[] | null,
      any,
      Context
    > /** A list of gear slots which makes up a valid set of places a item can be equipped on at once. */;
  }

  export type GearSlotsResolver<
    R = (GearSlotDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.GearSlotDefRef */
export namespace GearSlotDefRefResolvers {
  export interface Resolvers<Context = any> {
    gearSlotType?: GearSlotTypeResolver<
      GearSlotType | null,
      any,
      Context
    > /** Which type of slot this is */;
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique gear slot identifier */;
  }

  export type GearSlotTypeResolver<
    R = GearSlotType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.SubstanceDefRef */
export namespace SubstanceDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** The unique identifier for this substance */;
    maxQuality?: MaxQualityResolver<
      Decimal | null,
      any,
      Context
    > /** the maximum quality this substance comes in */;
    minQuality?: MinQualityResolver<
      Decimal | null,
      any,
      Context
    > /** the minimum quality this substance comes in */;
    purifyItemDef?: PurifyItemDefResolver<ItemDefRef | null, any, Context>;
    type?: TypeResolver<
      string | null,
      any,
      Context
    > /** The type of substance. Ex.) Metal, Flesh, etc. */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PurifyItemDefResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.ItemRequirementByStringIDDefRef */
export namespace ItemRequirementByStringIDDefRefResolvers {
  export interface Resolvers<Context = any> {
    condition?: ConditionResolver<string | null, any, Context>;
    description?: DescriptionResolver<string | null, any, Context>;
    errorDescription?: ErrorDescriptionResolver<string | null, any, Context>;
    iconURL?: IconUrlResolver<string | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
  }

  export type ConditionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ErrorDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.GrindRecipeDefRef */
export namespace GrindRecipeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique recipe identifier */;
    ingredientItem?: IngredientItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** Required item template of the ingredient */;
    outputItem?: OutputItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** Item template for the item produced by this recipe */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.MakeRecipeDefRef */
export namespace MakeRecipeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique recipe identifier */;
    ingredients?: IngredientsResolver<
      (MakeIngredientDef | null)[] | null,
      any,
      Context
    > /** Ingredient rules */;
    outputItem?: OutputItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The item this recipe creates */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientsResolver<
    R = (MakeIngredientDef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.MakeIngredientDef */
export namespace MakeIngredientDefResolvers {
  export interface Resolvers<Context = any> {
    ingredient?: IngredientResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The specific ingredient required by this ingredient rule.  If this is empty, the recipe does not required a specific item. */;
    maxQuality?: MaxQualityResolver<
      Decimal | null,
      any,
      Context
    > /** The maximum quality the ingredient must be.  Value is 0-1 */;
    minQuality?: MinQualityResolver<
      Decimal | null,
      any,
      Context
    > /** The minimum quality the ingredient must be.  Value is 0-1 */;
    requirement?: RequirementResolver<
      ItemRequirementByStringIDDefRef | null,
      any,
      Context
    > /** Extra requirements on the item, not used if the ingredient is provided. */;
    slot?: SlotResolver<
      SubItemSlot | null,
      any,
      Context
    > /** The name of the slot this ingredient will go in */;
    unitCount?: UnitCountResolver<
      number | null,
      any,
      Context
    > /** How many of this item are required to create one copy of the output item */;
  }

  export type IngredientResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementResolver<
    R = ItemRequirementByStringIDDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlotResolver<
    R = SubItemSlot | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.PurifyRecipeDefRef */
export namespace PurifyRecipeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique recipe identifier */;
    ingredientItem?: IngredientItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** Required item template of the ingredient */;
    outputItem?: OutputItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** Item template for the item produced by this recipe */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ShapeRecipeDefRef */
export namespace ShapeRecipeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique recipe identifier */;
    infuseAmountAllowed?: InfuseAmountAllowedResolver<
      Decimal | null,
      any,
      Context
    >;
    infusionSlots?: InfusionSlotsResolver<number | null, any, Context>;
    ingredients?: IngredientsResolver<
      (RecipeIngredientDef | null)[] | null,
      any,
      Context
    > /** Input ingredients required for this recipe */;
    lossPercent?: LossPercentResolver<
      Decimal | null,
      any,
      Context
    > /** What percentage of the substances added to the crafting job will be lost in the crafting process */;
    outputItem?: OutputItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The item template for the item produced by this recipe */;
    realmUse?: RealmUseResolver<(Faction | null)[] | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InfuseAmountAllowedResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InfusionSlotsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientsResolver<
    R = (RecipeIngredientDef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LossPercentResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RealmUseResolver<
    R = (Faction | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Items.VoxJobGroupLogDBModel */
export namespace VoxJobGroupLogDBModelResolvers {
  export interface Resolvers<Context = any> {
    crafterID?: CrafterIdResolver<CharacterID | null, any, Context>;
    favorite?: FavoriteResolver<boolean | null, any, Context>;
    jobIdentifier?: JobIdentifierResolver<string | null, any, Context>;
    jobType?: JobTypeResolver<VoxJobType | null, any, Context>;
    lastCrafted?: LastCraftedResolver<string | null, any, Context>;
    notes?: NotesResolver<string | null, any, Context>;
    timesCrafted?: TimesCraftedResolver<number | null, any, Context>;
  }

  export type CrafterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FavoriteResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobIdentifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobTypeResolver<
    R = VoxJobType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastCraftedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TimesCraftedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel */
export namespace VoxJobLogDBModelResolvers {
  export interface Resolvers<Context = any> {
    crafterID?: CrafterIdResolver<CharacterID | null, any, Context>;
    dateEnded?: DateEndedResolver<string | null, any, Context>;
    dateStarted?: DateStartedResolver<string | null, any, Context>;
    favorite?: FavoriteResolver<boolean | null, any, Context>;
    id?: IdResolver<VoxJobInstanceID | null, any, Context>;
    inputItems?: InputItemsResolver<(Item | null)[] | null, any, Context>;
    itemHash?: ItemHashResolver<ItemStackHash | null, any, Context>;
    jobIdentifier?: JobIdentifierResolver<string | null, any, Context>;
    jobType?: JobTypeResolver<VoxJobType | null, any, Context>;
    notes?: NotesResolver<string | null, any, Context>;
    outputItems?: OutputItemsResolver<
      (OutputItem | null)[] | null,
      any,
      Context
    >;
    voxHealthCost?: VoxHealthCostResolver<number | null, any, Context>;
  }

  export type CrafterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DateEndedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DateStartedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FavoriteResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = VoxJobInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InputItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemHashResolver<
    R = ItemStackHash | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobIdentifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobTypeResolver<
    R = VoxJobType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemsResolver<
    R = (OutputItem | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxHealthCostResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Item */
export namespace ItemResolvers {
  export interface Resolvers<Context = any> {
    actions?: ActionsResolver<(ItemActionDefGQL | null)[] | null, any, Context>;
    containerColor?: ContainerColorResolver<
      ColorRGBA | null,
      any,
      Context
    > /** the UI color for the container UI */;
    containerDrawers?: ContainerDrawersResolver<
      (ContainerDrawerGQL | null)[] | null,
      any,
      Context
    >;
    debugname?: DebugnameResolver<
      string | null,
      any,
      Context
    > /** name of the item which includes some basic item information */;
    equiprequirement?: EquiprequirementResolver<
      ItemEquipRequirement | null,
      any,
      Context
    > /** information about if this item can be equipped. */;
    givenName?: GivenNameResolver<
      string | null,
      any,
      Context
    > /** Custom name given to item at crafting item */;
    hasSubItems?: HasSubItemsResolver<
      boolean | null,
      any,
      Context
    > /** if this item has sub items */;
    id?: IdResolver<
      ItemInstanceID | null,
      any,
      Context
    > /** Unique instance ID for item. */;
    location?: LocationResolver<
      ItemLocationDescription | null,
      any,
      Context
    > /** details about the location of the item */;
    permissibleHolder?: PermissibleHolderResolver<
      FlagsPermissibleHolderGQL | null,
      any,
      Context
    >;
    scenarioRelationship?: ScenarioRelationshipResolver<
      ScenarioRelationship | null,
      any,
      Context
    >;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
    stackHash?: StackHashResolver<
      ItemStackHash | null,
      any,
      Context
    > /** Identifies items that are of the same type and have the same stats. */;
    staticDefinition?: StaticDefinitionResolver<
      ItemDefRef | null,
      any,
      Context
    > /** The definition for the item. */;
    stats?: StatsResolver<
      ItemStatsDescription | null,
      any,
      Context
    > /** stats of this item */;
    voxStatus?: VoxStatusResolver<
      VoxStatus | null,
      any,
      Context
    > /** The status of the nearest vox belonging to your player */;
  }

  export type ActionsResolver<
    R = (ItemActionDefGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ContainerColorResolver<
    R = ColorRGBA | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ContainerDrawersResolver<
    R = (ContainerDrawerGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DebugnameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EquiprequirementResolver<
    R = ItemEquipRequirement | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GivenNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HasSubItemsResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = ItemInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LocationResolver<
    R = ItemLocationDescription | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissibleHolderResolver<
    R = FlagsPermissibleHolderGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioRelationshipResolver<
    R = ScenarioRelationship | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StackHashResolver<
    R = ItemStackHash | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaticDefinitionResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsResolver<
    R = ItemStatsDescription | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxStatusResolver<
    R = VoxStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ItemActionDefGQL */
export namespace ItemActionDefGQLResolvers {
  export interface Resolvers<Context = any> {
    cooldownSeconds?: CooldownSecondsResolver<Decimal | null, any, Context>;
    disabledDescription?: DisabledDescriptionResolver<
      string | null,
      any,
      Context
    >;
    enabled?: EnabledResolver<boolean | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    interactionPointFilter?: InteractionPointFilterResolver<
      (BoneAlias | null)[] | null,
      any,
      Context
    >;
    lastTimePerformed?: LastTimePerformedResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    showWhenDisabled?: ShowWhenDisabledResolver<boolean | null, any, Context>;
    uIReaction?: UIReactionResolver<ItemActionUIReaction | null, any, Context>;
  }

  export type CooldownSecondsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisabledDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EnabledResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InteractionPointFilterResolver<
    R = (BoneAlias | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastTimePerformedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShowWhenDisabledResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UIReactionResolver<
    R = ItemActionUIReaction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.ColorRGBA */
export namespace ColorRGBAResolvers {
  export interface Resolvers<Context = any> {
    a?: AResolver<Decimal | null, any, Context>;
    b?: BResolver<number | null, any, Context>;
    g?: GResolver<number | null, any, Context>;
    hex?: HexResolver<string | null, any, Context> /** Color in Hex format */;
    hexa?: HexaResolver<
      string | null,
      any,
      Context
    > /** Color in Hex format with alpha */;
    r?: RResolver<number | null, any, Context>;
    rgba?: RgbaResolver<
      string | null,
      any,
      Context
    > /** Color in RGBA format */;
  }

  export type AResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HexResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HexaResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RgbaResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ContainerDrawerGQL */
export namespace ContainerDrawerGQLResolvers {
  export interface Resolvers<Context = any> {
    containedItems?: ContainedItemsResolver<
      (Item | null)[] | null,
      any,
      Context
    >;
    id?: IdResolver<ContainerDrawerID | null, any, Context>;
    requirements?: RequirementsResolver<RequirementDef | null, any, Context>;
    stats?: StatsResolver<ContainerDefStat_Single | null, any, Context>;
  }

  export type ContainedItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = ContainerDrawerID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementsResolver<
    R = RequirementDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsResolver<
    R = ContainerDefStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.RequirementDef */
export namespace RequirementDefResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace ContainerDefStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    maxItemCount?: MaxItemCountResolver<
      Decimal | null,
      any,
      Context
    > /** MaxItemCount */;
    maxItemMass?: MaxItemMassResolver<
      Decimal | null,
      any,
      Context
    > /** MaxItemMass */;
  }

  export type MaxItemCountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxItemMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Items.ItemEquipRequirement */
export namespace ItemEquipRequirementResolvers {
  export interface Resolvers<Context = any> {
    errorDescription?: ErrorDescriptionResolver<string | null, any, Context>;
    requirementDescription?: RequirementDescriptionResolver<
      string | null,
      any,
      Context
    >;
    status?: StatusResolver<EquipRequirementStatus | null, any, Context>;
  }

  export type ErrorDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = EquipRequirementStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Items.ItemLocationDescription */
export namespace ItemLocationDescriptionResolvers {
  export interface Resolvers<Context = any> {
    building?: BuildingResolver<
      BuildingPlacedLocation | null,
      any,
      Context
    > /** Location filled if this item in a building place object */;
    equipped?: EquippedResolver<
      EquippedLocation | null,
      any,
      Context
    > /** Location filled if this item is equipped */;
    ground?: GroundResolver<
      OnGroundLocation | null,
      any,
      Context
    > /** Location filled if this item in on the ground */;
    inContainer?: InContainerResolver<
      InContainerLocation | null,
      any,
      Context
    > /** Location filled if this item is in a container */;
    inventory?: InventoryResolver<
      InventoryLocation | null,
      any,
      Context
    > /** Location filled if this item is in a player's inventory */;
    inVox?: InVoxResolver<
      InVoxJobLocation | null,
      any,
      Context
    > /** Location filled if this item is in a vox */;
  }

  export type BuildingResolver<
    R = BuildingPlacedLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EquippedResolver<
    R = EquippedLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroundResolver<
    R = OnGroundLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InContainerResolver<
    R = InContainerLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InventoryResolver<
    R = InventoryLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InVoxResolver<
    R = InVoxJobLocation | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.BuildingPlacedLocation */
export namespace BuildingPlacedLocationResolvers {
  export interface Resolvers<Context = any> {
    buildingID?: BuildingIdResolver<
      BuildingPlotInstanceID | null,
      any,
      Context
    >;
  }

  export type BuildingIdResolver<
    R = BuildingPlotInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.EquippedLocation */
export namespace EquippedLocationResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<
      CharacterID | null,
      any,
      Context
    > /** The character the item is equipped on */;
    gearSlots?: GearSlotsResolver<
      (GearSlotDefRef | null)[] | null,
      any,
      Context
    > /** The gear slots the item is equipped to */;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GearSlotsResolver<
    R = (GearSlotDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.OnGroundLocation */
export namespace OnGroundLocationResolvers {
  export interface Resolvers<Context = any> {
    groupID?: GroupIdResolver<
      ItemInstanceID | null,
      any,
      Context
    > /** The group id set for stacked ground items */;
    isDeployed?: IsDeployedResolver<boolean | null, any, Context>;
  }

  export type GroupIdResolver<
    R = ItemInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsDeployedResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.InContainerLocation */
export namespace InContainerLocationResolvers {
  export interface Resolvers<Context = any> {
    containerInstanceID?: ContainerInstanceIdResolver<
      ItemInstanceID | null,
      any,
      Context
    > /** The item ID of the container this item is in */;
    drawerID?: DrawerIdResolver<
      ContainerDrawerID | null,
      any,
      Context
    > /** The drawer this item is in */;
    position?: PositionResolver<
      number | null,
      any,
      Context
    > /** The UI position of the item */;
  }

  export type ContainerInstanceIdResolver<
    R = ItemInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DrawerIdResolver<
    R = ContainerDrawerID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.InventoryLocation */
export namespace InventoryLocationResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<
      CharacterID | null,
      any,
      Context
    > /** The character that has this item in their inventory */;
    position?: PositionResolver<
      number | null,
      any,
      Context
    > /** The UI position of the item */;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.InVoxJobLocation */
export namespace InVoxJobLocationResolvers {
  export interface Resolvers<Context = any> {
    itemSlot?: ItemSlotResolver<
      SubItemSlot | null,
      any,
      Context
    > /** The slot this item is associated with the recipe */;
    voxInstanceID?: VoxInstanceIdResolver<
      ItemInstanceID | null,
      any,
      Context
    > /** The item ID of the vox this item is contained in */;
    voxJobInstanceID?: VoxJobInstanceIdResolver<
      VoxJobInstanceID | null,
      any,
      Context
    > /** The id of the job this item is contained in */;
  }

  export type ItemSlotResolver<
    R = SubItemSlot | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxInstanceIdResolver<
    R = ItemInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxJobInstanceIdResolver<
    R = VoxJobInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ScenarioRelationship */
export namespace ScenarioRelationshipResolvers {
  export interface Resolvers<Context = any> {
    restrictedToScenario?: RestrictedToScenarioResolver<
      boolean | null,
      any,
      Context
    >;
    scenarioID?: ScenarioIdResolver<ScenarioInstanceID | null, any, Context>;
  }

  export type RestrictedToScenarioResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioIdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Items.ItemStatsDescription */
export namespace ItemStatsDescriptionResolvers {
  export interface Resolvers<Context = any> {
    alloy?: AlloyResolver<
      AlloyStat_Single | null,
      any,
      Context
    > /** Alloy specific stats */;
    armor?: ArmorResolver<ArmorStat_Single | null, any, Context>;
    block?: BlockResolver<
      BuildingBlockStat_Single | null,
      any,
      Context
    > /** Block specific stats */;
    damageResistances?: DamageResistancesResolver<
      DamageType_Single | null,
      any,
      Context
    > /** Resistances which effect how much damage this item takes */;
    deploy?: DeployResolver<
      DeployStat_Single | null,
      any,
      Context
    > /** Deploy specific stats */;
    durability?: DurabilityResolver<
      DurabilityStat_Single | null,
      any,
      Context
    > /** Durability specific stats */;
    item?: ItemResolver<
      ItemStat_Single | null,
      any,
      Context
    > /** Stats shared by all types of items */;
    resistances?: ResistancesResolver<
      DamageType_Single | null,
      any,
      Context
    > /** Resistances which are added the entity wearing the item */;
    siegeEngine?: SiegeEngineResolver<
      SiegeEngineStat_Single | null,
      any,
      Context
    > /** Siege engine specific stats */;
    substance?: SubstanceResolver<
      SubstanceStat_Single | null,
      any,
      Context
    > /** Substance specific stats */;
    weapon?: WeaponResolver<
      WeaponStat_Single | null,
      any,
      Context
    > /** Weapon specific stats */;
  }

  export type AlloyResolver<
    R = AlloyStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ArmorResolver<
    R = ArmorStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BlockResolver<
    R = BuildingBlockStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResistancesResolver<
    R = DamageType_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeployResolver<
    R = DeployStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DurabilityResolver<
    R = DurabilityStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemResolver<
    R = ItemStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistancesResolver<
    R = DamageType_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SiegeEngineResolver<
    R = SiegeEngineStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SubstanceResolver<
    R = SubstanceStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WeaponResolver<
    R = WeaponStat_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace AlloyStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    agilityRequirementBonus?: AgilityRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** AgilityRequirementBonus */;
    armorClassBonus?: ArmorClassBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ArmorClassBonus */;
    attunementRequirementBonus?: AttunementRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** AttunementRequirementBonus */;
    crushingDamageBonus?: CrushingDamageBonusResolver<
      Decimal | null,
      any,
      Context
    > /** CrushingDamageBonus */;
    deflectionAmountBonus?: DeflectionAmountBonusResolver<
      Decimal | null,
      any,
      Context
    > /** DeflectionAmountBonus */;
    deflectionRecoveryBonus?: DeflectionRecoveryBonusResolver<
      Decimal | null,
      any,
      Context
    > /** DeflectionRecoveryBonus */;
    densityBonus?: DensityBonusResolver<
      Decimal | null,
      any,
      Context
    > /** DensityBonus */;
    dexterityRequirementBonus?: DexterityRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** DexterityRequirementBonus */;
    distruptionBonus?: DistruptionBonusResolver<
      Decimal | null,
      any,
      Context
    > /** DistruptionBonus */;
    encumbranceBonus?: EncumbranceBonusResolver<
      Decimal | null,
      any,
      Context
    > /** EncumbranceBonus */;
    enduranceRequirementBonus?: EnduranceRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** EnduranceRequirementBonus */;
    faithRequirementBonus?: FaithRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FaithRequirementBonus */;
    fallbackCrushingDamageBonus?: FallbackCrushingDamageBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FallbackCrushingDamageBonus */;
    falloffMaxDistanceBonus?: FalloffMaxDistanceBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffMaxDistanceBonus */;
    falloffMinDistanceBonus?: FalloffMinDistanceBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffMinDistanceBonus */;
    falloffReductionBonus?: FalloffReductionBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffReductionBonus */;
    fractureBonus?: FractureBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FractureBonus */;
    fractureChanceBonus?: FractureChanceBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FractureChanceBonus */;
    fractureThresholdBonus?: FractureThresholdBonusResolver<
      Decimal | null,
      any,
      Context
    > /** FractureThresholdBonus */;
    hardnessBonus?: HardnessBonusResolver<
      Decimal | null,
      any,
      Context
    > /** HardnessBonus */;
    healthLossPerUseBonus?: HealthLossPerUseBonusResolver<
      Decimal | null,
      any,
      Context
    > /** HealthLossPerUseBonus */;
    knockbackAmountBonus?: KnockbackAmountBonusResolver<
      Decimal | null,
      any,
      Context
    > /** KnockbackAmountBonus */;
    malleabilityBonus?: MalleabilityBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MalleabilityBonus */;
    massBonus?: MassBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MassBonus */;
    maxHealthBonus?: MaxHealthBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MaxHealthBonus */;
    maxRepairPointsBonus?: MaxRepairPointsBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MaxRepairPointsBonus */;
    meltingPointBonus?: MeltingPointBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MeltingPointBonus */;
    mitigateBonus?: MitigateBonusResolver<
      Decimal | null,
      any,
      Context
    > /** MitigateBonus */;
    physicalPreparationTimeBonus?: PhysicalPreparationTimeBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalPreparationTimeBonus */;
    physicalProjectileSpeedBonus?: PhysicalProjectileSpeedBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalProjectileSpeedBonus */;
    physicalRecoveryTimeBonus?: PhysicalRecoveryTimeBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalRecoveryTimeBonus */;
    piercingArmorPenetrationBonus?: PiercingArmorPenetrationBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingArmorPenetrationBonus */;
    piercingBleedBonus?: PiercingBleedBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingBleedBonus */;
    piercingDamageBonus?: PiercingDamageBonusResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingDamageBonus */;
    resistAcidBonus?: ResistAcidBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistAcidBonus */;
    resistAirBonus?: ResistAirBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistAirBonus */;
    resistArcaneBonus?: ResistArcaneBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistArcaneBonus */;
    resistChaosBonus?: ResistChaosBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistChaosBonus */;
    resistCrushingBonus?: ResistCrushingBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistCrushingBonus */;
    resistDeathBonus?: ResistDeathBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistDeathBonus */;
    resistDiseaseBonus?: ResistDiseaseBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistDiseaseBonus */;
    resistEarthBonus?: ResistEarthBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistEarthBonus */;
    resistFireBonus?: ResistFireBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistFireBonus */;
    resistFrostBonus?: ResistFrostBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistFrostBonus */;
    resistLifeBonus?: ResistLifeBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistLifeBonus */;
    resistLightningBonus?: ResistLightningBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistLightningBonus */;
    resistMindBonus?: ResistMindBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistMindBonus */;
    resistPiercingBonus?: ResistPiercingBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistPiercingBonus */;
    resistPoisonBonus?: ResistPoisonBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistPoisonBonus */;
    resistRadiantBonus?: ResistRadiantBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistRadiantBonus */;
    resistShadowBonus?: ResistShadowBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistShadowBonus */;
    resistSlashingBonus?: ResistSlashingBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistSlashingBonus */;
    resistSpiritBonus?: ResistSpiritBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistSpiritBonus */;
    resistVoidBonus?: ResistVoidBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistVoidBonus */;
    resistWaterBonus?: ResistWaterBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResistWaterBonus */;
    resonanceRequirementBonus?: ResonanceRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** ResonanceRequirementBonus */;
    slashingArmorPenetrationBonus?: SlashingArmorPenetrationBonusResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingArmorPenetrationBonus */;
    slashingBleedBonus?: SlashingBleedBonusResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingBleedBonus */;
    slashingDamageBonus?: SlashingDamageBonusResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingDamageBonus */;
    stabilityBonus?: StabilityBonusResolver<
      Decimal | null,
      any,
      Context
    > /** StabilityBonus */;
    staminaCostBonus?: StaminaCostBonusResolver<
      Decimal | null,
      any,
      Context
    > /** StaminaCostBonus */;
    strengthRequirementBonus?: StrengthRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** StrengthRequirementBonus */;
    unitHealth?: UnitHealthResolver<
      Decimal | null,
      any,
      Context
    > /** UnitHealth */;
    unitMass?: UnitMassResolver<Decimal | null, any, Context> /** UnitMass */;
    vitalityRequirementBonus?: VitalityRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** VitalityRequirementBonus */;
    weightBonus?: WeightBonusResolver<
      Decimal | null,
      any,
      Context
    > /** WeightBonus */;
    willRequirementBonus?: WillRequirementBonusResolver<
      Decimal | null,
      any,
      Context
    > /** WillRequirementBonus */;
  }

  export type AgilityRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ArmorClassBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AttunementRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CrushingDamageBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeflectionAmountBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeflectionRecoveryBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DensityBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DexterityRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistruptionBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EncumbranceBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EnduranceRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FaithRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FallbackCrushingDamageBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffMaxDistanceBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffMinDistanceBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffReductionBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureChanceBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureThresholdBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HardnessBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealthLossPerUseBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KnockbackAmountBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MalleabilityBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MassBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxHealthBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRepairPointsBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MeltingPointBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MitigateBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalPreparationTimeBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalProjectileSpeedBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalRecoveryTimeBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingArmorPenetrationBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingBleedBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingDamageBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistAcidBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistAirBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistArcaneBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistChaosBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistCrushingBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistDeathBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistDiseaseBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistEarthBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistFireBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistFrostBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistLifeBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistLightningBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistMindBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistPiercingBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistPoisonBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistRadiantBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistShadowBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistSlashingBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistSpiritBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistVoidBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistWaterBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResonanceRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingArmorPenetrationBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingBleedBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingDamageBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StabilityBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaminaCostBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StrengthRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VitalityRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WeightBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WillRequirementBonusResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace ArmorStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    armorClass?: ArmorClassResolver<
      Decimal | null,
      any,
      Context
    > /** ArmorClass */;
  }

  export type ArmorClassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace BuildingBlockStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    buildTimeUnits?: BuildTimeUnitsResolver<
      Decimal | null,
      any,
      Context
    > /** BuildTimeUnits */;
    compressiveStrength?: CompressiveStrengthResolver<
      Decimal | null,
      any,
      Context
    > /** CompressiveStrength */;
    density?: DensityResolver<Decimal | null, any, Context> /** Density */;
    healthUnits?: HealthUnitsResolver<
      Decimal | null,
      any,
      Context
    > /** HealthUnits */;
    shearStrength?: ShearStrengthResolver<
      Decimal | null,
      any,
      Context
    > /** ShearStrength */;
    tensileStrength?: TensileStrengthResolver<
      Decimal | null,
      any,
      Context
    > /** TensileStrength */;
    unitMass?: UnitMassResolver<Decimal | null, any, Context> /** UnitMass */;
  }

  export type BuildTimeUnitsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CompressiveStrengthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DensityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealthUnitsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShearStrengthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TensileStrengthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace DamageType_SingleResolvers {
  export interface Resolvers<Context = any> {
    acid?: AcidResolver<Decimal | null, any, Context> /** Acid */;
    air?: AirResolver<Decimal | null, any, Context> /** Air */;
    all?: AllResolver<Decimal | null, any, Context> /** All */;
    arcane?: ArcaneResolver<Decimal | null, any, Context> /** Arcane */;
    chaos?: ChaosResolver<Decimal | null, any, Context> /** Chaos */;
    corruption?: CorruptionResolver<
      Decimal | null,
      any,
      Context
    > /** Corruption */;
    crushing?: CrushingResolver<Decimal | null, any, Context> /** Crushing */;
    dark?: DarkResolver<Decimal | null, any, Context> /** Dark */;
    death?: DeathResolver<Decimal | null, any, Context> /** Death */;
    disease?: DiseaseResolver<Decimal | null, any, Context> /** Disease */;
    earth?: EarthResolver<Decimal | null, any, Context> /** Earth */;
    elemental?: ElementalResolver<
      Decimal | null,
      any,
      Context
    > /** Elemental */;
    fire?: FireResolver<Decimal | null, any, Context> /** Fire */;
    frost?: FrostResolver<Decimal | null, any, Context> /** Frost */;
    life?: LifeResolver<Decimal | null, any, Context> /** Life */;
    light?: LightResolver<Decimal | null, any, Context> /** Light */;
    lightning?: LightningResolver<
      Decimal | null,
      any,
      Context
    > /** Lightning */;
    mind?: MindResolver<Decimal | null, any, Context> /** Mind */;
    none?: NoneResolver<Decimal | null, any, Context> /** None */;
    physical?: PhysicalResolver<Decimal | null, any, Context> /** Physical */;
    piercing?: PiercingResolver<Decimal | null, any, Context> /** Piercing */;
    poison?: PoisonResolver<Decimal | null, any, Context> /** Poison */;
    radiant?: RadiantResolver<Decimal | null, any, Context> /** Radiant */;
    shadow?: ShadowResolver<Decimal | null, any, Context> /** Shadow */;
    slashing?: SlashingResolver<Decimal | null, any, Context> /** Slashing */;
    spirit?: SpiritResolver<Decimal | null, any, Context> /** Spirit */;
    sYSTEM?: SYstemResolver<Decimal | null, any, Context> /** SYSTEM */;
    void?: VoidResolver<Decimal | null, any, Context> /** Void */;
    water?: WaterResolver<Decimal | null, any, Context> /** Water */;
  }

  export type AcidResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AirResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AllResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ArcaneResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ChaosResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CorruptionResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CrushingResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DarkResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeathResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DiseaseResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EarthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ElementalResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FireResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FrostResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LifeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LightResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LightningResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MindResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NoneResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PoisonResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RadiantResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShadowResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpiritResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SYstemResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoidResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WaterResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace DeployStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    currentEnergy?: CurrentEnergyResolver<
      Decimal | null,
      any,
      Context
    > /** CurrentEnergy */;
    maxEnergy?: MaxEnergyResolver<
      Decimal | null,
      any,
      Context
    > /** MaxEnergy */;
    readySeconds?: ReadySecondsResolver<
      Decimal | null,
      any,
      Context
    > /** ReadySeconds */;
    readyStability?: ReadyStabilityResolver<
      Decimal | null,
      any,
      Context
    > /** ReadyStability */;
    unreadySeconds?: UnreadySecondsResolver<
      Decimal | null,
      any,
      Context
    > /** UnreadySeconds */;
    unreadyStability?: UnreadyStabilityResolver<
      Decimal | null,
      any,
      Context
    > /** UnreadyStability */;
  }

  export type CurrentEnergyResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxEnergyResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReadySecondsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReadyStabilityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnreadySecondsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnreadyStabilityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace DurabilityStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    currentHealth?: CurrentHealthResolver<
      Decimal | null,
      any,
      Context
    > /** The current health on this item. This value is reduced when the item is used or attacked. */;
    currentRepairPoints?: CurrentRepairPointsResolver<
      Decimal | null,
      any,
      Context
    > /** The current number of repair points remaining on this item. This value will be reduced when the item is repaired */;
    fractureChance?: FractureChanceResolver<
      Decimal | null,
      any,
      Context
    > /** FractureChance */;
    fractureThreshold?: FractureThresholdResolver<
      Decimal | null,
      any,
      Context
    > /** FractureThreshold */;
    healthLossPerUse?: HealthLossPerUseResolver<
      Decimal | null,
      any,
      Context
    > /** Factor used to decide how much health the item will lose each time it is used. */;
    maxHealth?: MaxHealthResolver<
      Decimal | null,
      any,
      Context
    > /** The amount of health this item was created at and will be restored to each time it is repaired */;
    maxRepairPoints?: MaxRepairPointsResolver<
      Decimal | null,
      any,
      Context
    > /** The number of repair points this item was created at */;
  }

  export type CurrentHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CurrentRepairPointsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureChanceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureThresholdResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealthLossPerUseResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRepairPointsResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace ItemStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    agilityRequirement?: AgilityRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The agility stat requirement that must be met to equip this item */;
    attunementRequirement?: AttunementRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The attunement stat requirement that must be met to equip this item */;
    dexterityRequirement?: DexterityRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The dexterity stat requirement that must be met to equip this item */;
    encumbrance?: EncumbranceResolver<
      Decimal | null,
      any,
      Context
    > /** The encumbrance of an item is used while the item is equipped to encumber the player equipping the item */;
    enduranceRequirement?: EnduranceRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The endurance stat requirement that must be met to equip this item */;
    faithRequirement?: FaithRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The faith stat requirement that must be met to equip this item */;
    nestedItemCount?: NestedItemCountResolver<
      Decimal | null,
      any,
      Context
    > /** The number of items that are nested under this one.  Either as container contents or vox ingredients. */;
    quality?: QualityResolver<
      Decimal | null,
      any,
      Context
    > /** The quality of the item, this will be a value between 0-1 */;
    resonanceRequirement?: ResonanceRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The resonance stat requirement that must be met to equip this item */;
    selfMass?: SelfMassResolver<
      Decimal | null,
      any,
      Context
    > /** The mass of the item without the mass of anything inside of it */;
    strengthRequirement?: StrengthRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The strength stat requirement that must be met to equip this item */;
    totalMass?: TotalMassResolver<
      Decimal | null,
      any,
      Context
    > /** The mass of the item and anything inside of it */;
    unitCount?: UnitCountResolver<
      Decimal | null,
      any,
      Context
    > /** The stack count on this item.  For items which do not stack, this value will always be 1. */;
    unitMass?: UnitMassResolver<
      Decimal | null,
      any,
      Context
    > /** The mass of one unit of this item */;
    vitalityRequirement?: VitalityRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The vitality stat requirement that must be met to equip this item */;
    willRequirement?: WillRequirementResolver<
      Decimal | null,
      any,
      Context
    > /** The will stat requirement that must be met to equip this item */;
  }

  export type AgilityRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AttunementRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DexterityRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EncumbranceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EnduranceRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FaithRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NestedItemCountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResonanceRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SelfMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StrengthRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitCountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VitalityRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WillRequirementResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace SiegeEngineStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    pitchSpeedDegPerSec?: PitchSpeedDegPerSecResolver<
      Decimal | null,
      any,
      Context
    > /** PitchSpeedDegPerSec */;
    yawSpeedDegPerSec?: YawSpeedDegPerSecResolver<
      Decimal | null,
      any,
      Context
    > /** YawSpeedDegPerSec */;
  }

  export type PitchSpeedDegPerSecResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type YawSpeedDegPerSecResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace SubstanceStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    elasticity?: ElasticityResolver<
      Decimal | null,
      any,
      Context
    > /** Elasticity */;
    fractureChance?: FractureChanceResolver<
      Decimal | null,
      any,
      Context
    > /** FractureChance */;
    hardnessFactor?: HardnessFactorResolver<
      Decimal | null,
      any,
      Context
    > /** HardnessFactor */;
    magicalResistance?: MagicalResistanceResolver<
      Decimal | null,
      any,
      Context
    > /** MagicalResistance */;
    massFactor?: MassFactorResolver<
      Decimal | null,
      any,
      Context
    > /** MassFactor */;
    meltingPoint?: MeltingPointResolver<
      Decimal | null,
      any,
      Context
    > /** MeltingPoint */;
    unitHealth?: UnitHealthResolver<
      Decimal | null,
      any,
      Context
    > /** UnitHealth */;
    unitMass?: UnitMassResolver<Decimal | null, any, Context> /** UnitMass */;
  }

  export type ElasticityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FractureChanceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HardnessFactorResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MagicalResistanceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MassFactorResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MeltingPointResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace WeaponStat_SingleResolvers {
  export interface Resolvers<Context = any> {
    crushingDamage?: CrushingDamageResolver<
      Decimal | null,
      any,
      Context
    > /** CrushingDamage */;
    deflectionAmount?: DeflectionAmountResolver<
      Decimal | null,
      any,
      Context
    > /** DeflectionAmount */;
    deflectionRecovery?: DeflectionRecoveryResolver<
      Decimal | null,
      any,
      Context
    > /** DeflectionRecovery */;
    disruption?: DisruptionResolver<
      Decimal | null,
      any,
      Context
    > /** Disruption */;
    fallbackCrushingDamage?: FallbackCrushingDamageResolver<
      Decimal | null,
      any,
      Context
    > /** FallbackCrushingDamage */;
    falloffMaxDistance?: FalloffMaxDistanceResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffMaxDistance */;
    falloffMinDistance?: FalloffMinDistanceResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffMinDistance */;
    falloffReduction?: FalloffReductionResolver<
      Decimal | null,
      any,
      Context
    > /** FalloffReduction */;
    knockbackAmount?: KnockbackAmountResolver<
      Decimal | null,
      any,
      Context
    > /** KnockbackAmount */;
    magicPower?: MagicPowerResolver<
      Decimal | null,
      any,
      Context
    > /** MagicPower */;
    physicalPreparationTime?: PhysicalPreparationTimeResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalPreparationTime */;
    physicalProjectileSpeed?: PhysicalProjectileSpeedResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalProjectileSpeed */;
    physicalRecoveryTime?: PhysicalRecoveryTimeResolver<
      Decimal | null,
      any,
      Context
    > /** PhysicalRecoveryTime */;
    piercingArmorPenetration?: PiercingArmorPenetrationResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingArmorPenetration */;
    piercingBleed?: PiercingBleedResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingBleed */;
    piercingDamage?: PiercingDamageResolver<
      Decimal | null,
      any,
      Context
    > /** PiercingDamage */;
    range?: RangeResolver<Decimal | null, any, Context> /** Range */;
    slashingArmorPenetration?: SlashingArmorPenetrationResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingArmorPenetration */;
    slashingBleed?: SlashingBleedResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingBleed */;
    slashingDamage?: SlashingDamageResolver<
      Decimal | null,
      any,
      Context
    > /** SlashingDamage */;
    stability?: StabilityResolver<
      Decimal | null,
      any,
      Context
    > /** Stability */;
    staminaCost?: StaminaCostResolver<
      Decimal | null,
      any,
      Context
    > /** StaminaCost */;
  }

  export type CrushingDamageResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeflectionAmountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeflectionRecoveryResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisruptionResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FallbackCrushingDamageResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffMaxDistanceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffMinDistanceResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FalloffReductionResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KnockbackAmountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MagicPowerResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalPreparationTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalProjectileSpeedResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PhysicalRecoveryTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingArmorPenetrationResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingBleedResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PiercingDamageResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RangeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingArmorPenetrationResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingBleedResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlashingDamageResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StabilityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaminaCostResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.VoxStatus */
export namespace VoxStatusResolvers {
  export interface Resolvers<Context = any> {
    jobs?: JobsResolver<(VoxJobStatus | null)[] | null, any, Context>;
  }

  export type JobsResolver<
    R = (VoxJobStatus | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.VoxJobStatus */
export namespace VoxJobStatusResolvers {
  export interface Resolvers<Context = any> {
    blockRecipe?: BlockRecipeResolver<
      BlockRecipeDefRef | null,
      any,
      Context
    > /** The block recipe details. Only for Block jobs */;
    endQuality?: EndQualityResolver<
      Decimal | null,
      any,
      Context
    > /** The player specified end quality for a substance. Only for Purify jobs */;
    givenName?: GivenNameResolver<
      string | null,
      any,
      Context
    > /** The custom name for the item being produced. Only for Make jobs */;
    grindRecipe?: GrindRecipeResolver<
      GrindRecipeDefRef | null,
      any,
      Context
    > /** The grind recipe details. Only for Grind jobs */;
    id?: IdResolver<VoxJobInstanceID | null, any, Context>;
    ingredients?: IngredientsResolver<
      (Item | null)[] | null,
      any,
      Context
    > /** A list of all ingredients that are currently stored in the vox.  These are destroyed at the end of the job */;
    itemCount?: ItemCountResolver<
      number | null,
      any,
      Context
    > /** How many item to make. Only for Make jobs */;
    jobState?: JobStateResolver<
      VoxJobState | null,
      any,
      Context
    > /** The current state the job is in. */;
    jobType?: JobTypeResolver<
      VoxJobType | null,
      any,
      Context
    > /** Which type of crafting job is currently being utilized */;
    makeRecipe?: MakeRecipeResolver<
      MakeRecipeDefRef | null,
      any,
      Context
    > /** The make recipe details. Only for Make jobs */;
    outputItems?: OutputItemsResolver<
      (VoxJobOutputItem | null)[] | null,
      any,
      Context
    > /** The list of all items which will be rewarded when the vox job is completed.  This information is only available is job is fully configured and ready to run */;
    possibleIngredients?: PossibleIngredientsResolver<
      (Item | null)[] | null,
      any,
      Context
    > /** List of inventory items compatible with the current vox job */;
    possibleIngredientsWithSlots?: PossibleIngredientsWithSlotsResolver<
      (PossibleVoxIngredientGQL | null)[] | null,
      any,
      Context
    > /** List of inventory items compatible with the current vox job */;
    possibleItemSlots?: PossibleItemSlotsResolver<
      (SubItemSlot | null)[] | null,
      any,
      Context
    > /** List of sub item slots this vox job uses */;
    purifyRecipe?: PurifyRecipeResolver<
      PurifyRecipeDefRef | null,
      any,
      Context
    > /** The purify recipe details. Only for Purify jobs */;
    recipeID?: RecipeIdResolver<
      string | null,
      any,
      Context
    > /** The ID of the recipe which will be performed.  This could be one of serveral types of recipes depending on the vox job type */;
    recipesMatchingIngredients?: RecipesMatchingIngredientsResolver<
      (string | null)[] | null,
      any,
      Context
    > /** ID's of recipes which match the current ingredient list in the vox */;
    shapeRecipe?: ShapeRecipeResolver<
      ShapeRecipeDefRef | null,
      any,
      Context
    > /** The shape recipe details. Only for Shape jobs */;
    startTime?: StartTimeResolver<
      string | null,
      any,
      Context
    > /** What time the job was started.  The job must be in the Running or Finished state for this information to be valid. */;
    timeRemaining?: TimeRemainingResolver<
      Decimal | null,
      any,
      Context
    > /** The total seconds remaining for this job to finish.  This information is only valid while the job is running. */;
    totalCraftingTime?: TotalCraftingTimeResolver<
      Decimal | null,
      any,
      Context
    > /** How long the job will take to run.  This information is only available is job is fully configured and ready to run */;
    usedRepairPoints?: UsedRepairPointsResolver<
      number | null,
      any,
      Context
    > /** How many repair points will be used when repairing the item. Only for Repair jobs */;
    voxHealthCost?: VoxHealthCostResolver<
      number | null,
      any,
      Context
    > /** How much damage the vox will take from performing this job. */;
  }

  export type BlockRecipeResolver<
    R = BlockRecipeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EndQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GivenNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GrindRecipeResolver<
    R = GrindRecipeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = VoxJobInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IngredientsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobStateResolver<
    R = VoxJobState | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JobTypeResolver<
    R = VoxJobType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MakeRecipeResolver<
    R = MakeRecipeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemsResolver<
    R = (VoxJobOutputItem | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PossibleIngredientsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PossibleIngredientsArgs>;
  export interface PossibleIngredientsArgs {
    slot?:
      | string
      | null /** The slot to get ingredients for. (required) - Valid values: Invalid, PrimaryIngredient, SecondaryIngredient1, SecondaryIngredient2, SecondaryIngredient3, SecondaryIngredient4, Alloy, WeaponBlade, WeaponHandle, NonRecipe */;
  }

  export type PossibleIngredientsWithSlotsResolver<
    R = (PossibleVoxIngredientGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PossibleItemSlotsResolver<
    R = (SubItemSlot | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PurifyRecipeResolver<
    R = PurifyRecipeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RecipeIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RecipesMatchingIngredientsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShapeRecipeResolver<
    R = ShapeRecipeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TimeRemainingResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalCraftingTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsedRepairPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VoxHealthCostResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Items.VoxJobOutputItem */
export namespace VoxJobOutputItemResolvers {
  export interface Resolvers<Context = any> {
    item?: ItemResolver<Item | null, any, Context>;
    outputItemType?: OutputItemTypeResolver<
      VoxJobOutputItemType | null,
      any,
      Context
    >;
  }

  export type ItemResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemTypeResolver<
    R = VoxJobOutputItemType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.PossibleVoxIngredientGQL */
export namespace PossibleVoxIngredientGQLResolvers {
  export interface Resolvers<Context = any> {
    item?: ItemResolver<Item | null, any, Context>;
    slots?: SlotsResolver<(SubItemSlot | null)[] | null, any, Context>;
  }

  export type ItemResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SlotsResolver<
    R = (SubItemSlot | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Items.VoxJobLogDBModel+OutputItem */
export namespace OutputItemResolvers {
  export interface Resolvers<Context = any> {
    item?: ItemResolver<Item | null, any, Context>;
    outputItemType?: OutputItemTypeResolver<
      VoxJobOutputItemType | null,
      any,
      Context
    >;
  }

  export type ItemResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutputItemTypeResolver<
    R = VoxJobOutputItemType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Items.VoxNotesDBModel */
export namespace VoxNotesDBModelResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    created?: CreatedResolver<string | null, any, Context>;
    id?: IdResolver<VoxNotesInstanceID | null, any, Context>;
    lastEdited?: LastEditedResolver<string | null, any, Context>;
    notes?: NotesResolver<string | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = VoxNotesInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastEditedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Items.EntityItemResult */
export namespace EntityItemResultResolvers {
  export interface Resolvers<Context = any> {
    items?: ItemsResolver<
      (Item | null)[] | null,
      any,
      Context
    > /** List of items contained within this item.  This includes wrapped items, inventory, and equipment items */;
  }

  export type ItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.GameDefsGQLData */
export namespace GameDefsGQLDataResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentLevelTables?: AbilityComponentLevelTablesResolver<
      (AbilityComponentLevelTableDefRef | null)[] | null,
      any,
      Context
    > /** All abilty component level tables */;
    abilityComponents?: AbilityComponentsResolver<
      (AbilityComponentDefRef | null)[] | null,
      any,
      Context
    > /** All possible ability components for the game or a particular class */;
    abilityNetworks?: AbilityNetworksResolver<
      (AbilityNetworkDefRef | null)[] | null,
      any,
      Context
    > /** All possible ability networks */;
    baseStatValues?: BaseStatValuesResolver<
      (StatBonusGQL | null)[] | null,
      any,
      Context
    > /** Base stat values which apply to all races */;
    class?: ClassResolver<
      ClassDef | null,
      any,
      Context
    > /** Static information about a specific class */;
    item?: ItemResolver<
      ItemDefRef | null,
      any,
      Context
    > /** Static information about a specific item */;
    items?: ItemsResolver<
      (ItemDefRef | null)[] | null,
      any,
      Context
    > /** Static information about items */;
    raceStatMods?: RaceStatModsResolver<
      (RaceStatBonuses | null)[] | null,
      any,
      Context
    > /** Stat modifiers that are applied additively to the base stat value for each Race */;
    stats?: StatsResolver<
      (StatDefinitionGQL | null)[] | null,
      any,
      Context
    > /** Array of definitions for all available stats */;
  }

  export type AbilityComponentLevelTablesResolver<
    R = (AbilityComponentLevelTableDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentsResolver<
    R = (AbilityComponentDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AbilityComponentsArgs>;
  export interface AbilityComponentsArgs {
    class?: string | null /** What class to filter for, optional */;
  }

  export type AbilityNetworksResolver<
    R = (AbilityNetworkDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BaseStatValuesResolver<
    R = (StatBonusGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ClassResolver<
    R = ClassDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ClassArgs>;
  export interface ClassArgs {
    class?: string | null /** The class type to look for. (required) */;
  }

  export type ItemResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ItemArgs>;
  export interface ItemArgs {
    itemid?: string | null /** The id of the item to look for. (required) */;
  }

  export type ItemsResolver<
    R = (ItemDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceStatModsResolver<
    R = (RaceStatBonuses | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsResolver<
    R = (StatDefinitionGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.StatBonusGQL */
export namespace StatBonusGQLResolvers {
  export interface Resolvers<Context = any> {
    amount?: AmountResolver<Decimal | null, any, Context>;
    stat?: StatResolver<Stat | null, any, Context>;
  }

  export type AmountResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.ClassDef */
export namespace ClassDefResolvers {
  export interface Resolvers<Context = any> {
    archetype?: ArchetypeResolver<Archetype | null, any, Context>;
    buildableAbilityNetworks?: BuildableAbilityNetworksResolver<
      (AbilityNetworkDefRef | null)[] | null,
      any,
      Context
    >;
    faction?: FactionResolver<Faction | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
  }

  export type ArchetypeResolver<
    R = Archetype | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BuildableAbilityNetworksResolver<
    R = (AbilityNetworkDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.RaceStatBonuses */
export namespace RaceStatBonusesResolvers {
  export interface Resolvers<Context = any> {
    race?: RaceResolver<Race | null, any, Context>;
    statBonuses?: StatBonusesResolver<
      (StatBonusGQL | null)[] | null,
      any,
      Context
    >;
  }

  export type RaceResolver<
    R = Race | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatBonusesResolver<
    R = (StatBonusGQL | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.StatDefinitionGQL */
export namespace StatDefinitionGQLResolvers {
  export interface Resolvers<Context = any> {
    addPointsAtCharacterCreation?: AddPointsAtCharacterCreationResolver<
      boolean | null,
      any,
      Context
    >;
    description?: DescriptionResolver<string | null, any, Context>;
    id?: IdResolver<Stat | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    operation?: OperationResolver<string | null, any, Context>;
    showAtCharacterCreation?: ShowAtCharacterCreationResolver<
      boolean | null,
      any,
      Context
    >;
    statType?: StatTypeResolver<StatType | null, any, Context>;
  }

  export type AddPointsAtCharacterCreationResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OperationResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShowAtCharacterCreationResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatTypeResolver<
    R = StatType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.Invite */
export namespace InviteResolvers {
  export interface Resolvers<Context = any> {
    code?: CodeResolver<InviteCode | null, any, Context>;
    created?: CreatedResolver<string | null, any, Context>;
    durationTicks?: DurationTicksResolver<number | null, any, Context>;
    forGroup?: ForGroupResolver<GroupID | null, any, Context>;
    forGroupName?: ForGroupNameResolver<string | null, any, Context>;
    forGroupType?: ForGroupTypeResolver<GroupTypes | null, any, Context>;
    fromName?: FromNameResolver<string | null, any, Context>;
    maxUses?: MaxUsesResolver<number | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
    status?: StatusResolver<InviteStatus | null, any, Context>;
    targetsID128?: TargetsId128Resolver<TargetID | null, any, Context>;
    uses?: UsesResolver<number | null, any, Context>;
  }

  export type CodeResolver<
    R = InviteCode | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DurationTicksResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ForGroupResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ForGroupNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ForGroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FromNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxUsesResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = InviteStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetsId128Resolver<
    R = TargetID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsesResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.MetricsData */
export namespace MetricsDataResolvers {
  export interface Resolvers<Context = any> {
    currentPlayerCount?: CurrentPlayerCountResolver<
      PlayerCount | null,
      any,
      Context
    >;
    playerCounts?: PlayerCountsResolver<
      (PlayerCount | null)[] | null,
      any,
      Context
    >;
  }

  export type CurrentPlayerCountResolver<
    R = PlayerCount | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, CurrentPlayerCountArgs>;
  export interface CurrentPlayerCountArgs {
    server?: string | null /** Server ShardID */;
    shard?: number | null /** Server ShardID */;
  }

  export type PlayerCountsResolver<
    R = (PlayerCount | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PlayerCountsArgs>;
  export interface PlayerCountsArgs {
    server?: string | null /** Server name (default: Hatchery) */;
    from?:
      | string
      | null /** Time from which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: -1h) */;
    until?:
      | string
      | null /** Time until which to get metrics. See http://graphite-api.readthedocs.io/en/latest/api.html#from-until for more info. (default: now) */;
  }
}
/** ServerLib.PlayerCount */
export namespace PlayerCountResolvers {
  export interface Resolvers<Context = any> {
    arthurian?: ArthurianResolver<number | null, any, Context>;
    bots?: BotsResolver<number | null, any, Context>;
    timeTicks?: TimeTicksResolver<number | null, any, Context>;
    total?: TotalResolver<number | null, any, Context>;
    tuatha?: TuathaResolver<number | null, any, Context>;
    viking?: VikingResolver<number | null, any, Context>;
  }

  export type ArthurianResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BotsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TimeTicksResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TuathaResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VikingResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Content.MessageOfTheDay */
export namespace MessageOfTheDayResolvers {
  export interface Resolvers<Context = any> {
    channels?: ChannelsResolver<
      (number | null)[] | null,
      any,
      Context
    > /** Which channels will this patch note be presented on. */;
    htmlContent?: HtmlContentResolver<
      string | null,
      any,
      Context
    > /** HTML Content for the message of the day. */;
    id?: IdResolver<string | null, any, Context>;
    jSONContent?: JSonContentResolver<
      string | null,
      any,
      Context
    > /** JSON data about the HTML Content for the message of the day */;
    title?: TitleResolver<string | null, any, Context>;
    utcCreated?: UtcCreatedResolver<string | null, any, Context>;
    utcDisplayEnd?: UtcDisplayEndResolver<string | null, any, Context>;
    utcDisplayStart?: UtcDisplayStartResolver<string | null, any, Context>;
  }

  export type ChannelsResolver<
    R = (number | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HtmlContentResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JSonContentResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcCreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MyScenarioScoreboard */
export namespace MyScenarioScoreboardResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<ScenarioInstanceID | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    rounds?: RoundsResolver<(RoundScore | null)[] | null, any, Context>;
    roundStartTime?: RoundStartTimeResolver<Decimal | null, any, Context>;
    teams?: TeamsResolver<Faction_TeamScore | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundsResolver<
    R = (RoundScore | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundStartTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamsResolver<
    R = Faction_TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.RoundScore */
export namespace RoundScoreResolvers {
  export interface Resolvers<Context = any> {
    active?: ActiveResolver<boolean | null, any, Context>;
    roundIndex?: RoundIndexResolver<number | null, any, Context>;
    winningTeamIDs?: WinningTeamIDsResolver<
      (ScenarioTeamID | null)[] | null,
      any,
      Context
    >;
  }

  export type ActiveResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundIndexResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WinningTeamIDsResolver<
    R = (ScenarioTeamID | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace Faction_TeamScoreResolvers {
  export interface Resolvers<Context = any> {
    arthurian?: ArthurianResolver<
      TeamScore | null,
      any,
      Context
    > /** Arthurian */;
    cOUNT?: COuntResolver<TeamScore | null, any, Context> /** COUNT */;
    factionless?: FactionlessResolver<
      TeamScore | null,
      any,
      Context
    > /** Factionless */;
    tdd?: TddResolver<TeamScore | null, any, Context> /** TDD */;
    viking?: VikingResolver<TeamScore | null, any, Context> /** Viking */;
  }

  export type ArthurianResolver<
    R = TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type COuntResolver<
    R = TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionlessResolver<
    R = TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TddResolver<
    R = TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VikingResolver<
    R = TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.TeamScore */
export namespace TeamScoreResolvers {
  export interface Resolvers<Context = any> {
    players?: PlayersResolver<(PlayerScore | null)[] | null, any, Context>;
    score?: ScoreResolver<number | null, any, Context>;
  }

  export type PlayersResolver<
    R = (PlayerScore | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.PlayerScore */
export namespace PlayerScoreResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    score?: ScoreResolver<number | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.GraphQLActiveWarband */
export namespace GraphQLActiveWarbandResolvers {
  export interface Resolvers<Context = any> {
    info?: InfoResolver<ActiveWarband | null, any, Context>;
    members?: MembersResolver<(GroupMemberState | null)[] | null, any, Context>;
  }

  export type InfoResolver<
    R = ActiveWarband | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (GroupMemberState | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.ActiveWarband */
export namespace ActiveWarbandResolvers {
  export interface Resolvers<Context = any> {
    battlegroup?: BattlegroupResolver<GroupID | null, any, Context>;
    created?: CreatedResolver<string | null, any, Context>;
    disbanded?: DisbandedResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    formerMembers?: FormerMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    id?: IdResolver<GroupID | null, any, Context>;
    leader?: LeaderResolver<CharacterID | null, any, Context>;
    leaderPermissions?: LeaderPermissionsResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    maxMemberCount?: MaxMemberCountResolver<number | null, any, Context>;
    maxRankCount?: MaxRankCountResolver<number | null, any, Context>;
    memberCount?: MemberCountResolver<number | null, any, Context>;
    members?: MembersResolver<(IGroupMember | null)[] | null, any, Context>;
    membersAsString?: MembersAsStringResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    order?: OrderResolver<GroupID | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
  }

  export type BattlegroupResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisbandedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LeaderResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LeaderPermissionsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxMemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRankCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersAsStringResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OrderResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.GroupMemberState */
export namespace GroupMemberStateResolvers {
  export interface Resolvers<Context = any> {
    blood?: BloodResolver<CurrentMax | null, any, Context>;
    canInvite?: CanInviteResolver<boolean | null, any, Context>;
    canKick?: CanKickResolver<boolean | null, any, Context>;
    characterID?: CharacterIdResolver<string | null, any, Context>;
    classID?: ClassIdResolver<Archetype | null, any, Context>;
    displayOrder?: DisplayOrderResolver<number | null, any, Context>;
    entityID?: EntityIdResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    gender?: GenderResolver<Gender | null, any, Context>;
    health?: HealthResolver<(Health | null)[] | null, any, Context>;
    isAlive?: IsAliveResolver<boolean | null, any, Context>;
    isLeader?: IsLeaderResolver<boolean | null, any, Context>;
    isReady?: IsReadyResolver<boolean | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    position?: PositionResolver<Vec3f | null, any, Context>;
    race?: RaceResolver<Race | null, any, Context>;
    rankLevel?: RankLevelResolver<number | null, any, Context>;
    stamina?: StaminaResolver<CurrentMax | null, any, Context>;
    statuses?: StatusesResolver<(StatusEffect | null)[] | null, any, Context>;
    type?: TypeResolver<string | null, any, Context>;
    warbandID?: WarbandIdResolver<string | null, any, Context>;
  }

  export type BloodResolver<
    R = CurrentMax | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CanInviteResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CanKickResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ClassIdResolver<
    R = Archetype | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayOrderResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EntityIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GenderResolver<
    R = Gender | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealthResolver<
    R = (Health | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsAliveResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsLeaderResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsReadyResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Vec3f | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceResolver<
    R = Race | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RankLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaminaResolver<
    R = CurrentMax | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusesResolver<
    R = (StatusEffect | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WarbandIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.CurrentMax */
export namespace CurrentMaxResolvers {
  export interface Resolvers<Context = any> {
    current?: CurrentResolver<Decimal | null, any, Context>;
    max?: MaxResolver<Decimal | null, any, Context>;
  }

  export type CurrentResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.Health */
export namespace HealthResolvers {
  export interface Resolvers<Context = any> {
    current?: CurrentResolver<Decimal | null, any, Context>;
    max?: MaxResolver<Decimal | null, any, Context>;
    wounds?: WoundsResolver<number | null, any, Context>;
  }

  export type CurrentResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WoundsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.StatusEffect */
export namespace StatusEffectResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    duration?: DurationResolver<Decimal | null, any, Context>;
    iconURL?: IconUrlResolver<string | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    startTime?: StartTimeResolver<Decimal | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DurationResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.GraphQLBattlegroup */
export namespace GraphQLBattlegroupResolvers {
  export interface Resolvers<Context = any> {
    battlegroup?: BattlegroupResolver<Battlegroup | null, any, Context>;
    members?: MembersResolver<(GroupMemberState | null)[] | null, any, Context>;
  }

  export type BattlegroupResolver<
    R = Battlegroup | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (GroupMemberState | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.Battlegroup */
export namespace BattlegroupResolvers {
  export interface Resolvers<Context = any> {
    created?: CreatedResolver<string | null, any, Context>;
    disbanded?: DisbandedResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    formerMembers?: FormerMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    id?: IdResolver<GroupID | null, any, Context>;
    leader?: LeaderResolver<CharacterID | null, any, Context>;
    leaderPermissions?: LeaderPermissionsResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    maxMemberCount?: MaxMemberCountResolver<number | null, any, Context>;
    maxRankCount?: MaxRankCountResolver<number | null, any, Context>;
    memberCount?: MemberCountResolver<number | null, any, Context>;
    members?: MembersResolver<(IGroupMember | null)[] | null, any, Context>;
    membersAsString?: MembersAsStringResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    shard?: ShardResolver<ShardID | null, any, Context>;
    warbands?: WarbandsResolver<(GroupID | null)[] | null, any, Context>;
  }

  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisbandedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LeaderResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LeaderPermissionsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxMemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRankCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersAsStringResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WarbandsResolver<
    R = (GroupID | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Items.MyEquippedItems */
export namespace MyEquippedItemsResolvers {
  export interface Resolvers<Context = any> {
    armorClass?: ArmorClassResolver<Decimal | null, any, Context>;
    itemCount?: ItemCountResolver<number | null, any, Context>;
    items?: ItemsResolver<(EquippedItem | null)[] | null, any, Context>;
    readiedGearSlots?: ReadiedGearSlotsResolver<
      (GearSlotDefRef | null)[] | null,
      any,
      Context
    >;
    resistances?: ResistancesResolver<DamageType_Single | null, any, Context>;
    totalMass?: TotalMassResolver<Decimal | null, any, Context>;
  }

  export type ArmorClassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemsResolver<
    R = (EquippedItem | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReadiedGearSlotsResolver<
    R = (GearSlotDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResistancesResolver<
    R = DamageType_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.EquippedItem */
export namespace EquippedItemResolvers {
  export interface Resolvers<Context = any> {
    gearSlots?: GearSlotsResolver<
      (GearSlotDefRef | null)[] | null,
      any,
      Context
    > /** the list of all the gear slots the item is in */;
    item?: ItemResolver<
      Item | null,
      any,
      Context
    > /** The item that is equipped */;
  }

  export type GearSlotsResolver<
    R = (GearSlotDefRef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Items.MyInventory */
export namespace MyInventoryResolvers {
  export interface Resolvers<Context = any> {
    itemCount?: ItemCountResolver<number | null, any, Context>;
    items?: ItemsResolver<(Item | null)[] | null, any, Context>;
    nestedItemCount?: NestedItemCountResolver<number | null, any, Context>;
    totalMass?: TotalMassResolver<Decimal | null, any, Context>;
  }

  export type ItemCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NestedItemCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalMassResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.Order */
export namespace OrderResolvers {
  export interface Resolvers<Context = any> {
    created?: CreatedResolver<string | null, any, Context>;
    disbanded?: DisbandedResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    formerMembers?: FormerMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    id?: IdResolver<GroupID | null, any, Context>;
    maxRankCount?: MaxRankCountResolver<number | null, any, Context>;
    memberCount?: MemberCountResolver<number | null, any, Context>;
    members?: MembersResolver<(IGroupMember | null)[] | null, any, Context>;
    membersAsString?: MembersAsStringResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    name?: NameResolver<NormalizedString | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
  }

  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisbandedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRankCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersAsStringResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = NormalizedString | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.PassiveAlert */
export namespace PassiveAlertResolvers {
  export interface Resolvers<Context = any> {
    message?: MessageResolver<string | null, any, Context>;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
  }

  export type MessageResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.CharacterProgressionData */
export namespace CharacterProgressionDataResolvers {
  export interface Resolvers<Context = any> {
    accountSummary?: AccountSummaryResolver<
      AccountProgressionSummary | null,
      any,
      Context
    > /** Information about all characters belonging to this account. */;
    adjustmentsByDayLogID?: AdjustmentsByDayLogIdResolver<
      (CharacterAdjustmentDBModel | null)[] | null,
      any,
      Context
    > /** A character adjustments for a specific day log for this character. */;
    characterAdjustments?: CharacterAdjustmentsResolver<
      (CharacterAdjustmentDBModel | null)[] | null,
      any,
      Context
    > /** Information about what adjustments happened for this player over the date range provided. */;
    characterDays?: CharacterDaysResolver<
      (CharacterDaySummaryDBModel | null)[] | null,
      any,
      Context
    > /** Information about what happened for this player over the date range provided. */;
    collectedProgressionSummary?: CollectedProgressionSummaryResolver<
      CharacterSummaryDBModel | null,
      any,
      Context
    > /** Global information about this character. */;
    dayBySummaryNumber?: DayBySummaryNumberResolver<
      CharacterDaySummaryDBModel | null,
      any,
      Context
    > /** A specific summary number for this character. */;
    dayLogByID?: DayLogByIdResolver<
      CharacterDaySummaryDBModel | null,
      any,
      Context
    > /** A specific day log for this character. */;
    unCollectedDayLogs?: UnCollectedDayLogsResolver<
      (CharacterDaySummaryDBModel | null)[] | null,
      any,
      Context
    > /** All unhandled progression days. */;
  }

  export type AccountSummaryResolver<
    R = AccountProgressionSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AccountSummaryArgs>;
  export interface AccountSummaryArgs {
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type AdjustmentsByDayLogIdResolver<
    R = (CharacterAdjustmentDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AdjustmentsByDayLogIdArgs>;
  export interface AdjustmentsByDayLogIdArgs {
    logID?:
      | string
      | null /** The id of the log to look for adjustments for. (required) */;
  }

  export type CharacterAdjustmentsResolver<
    R = (CharacterAdjustmentDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, CharacterAdjustmentsArgs>;
  export interface CharacterAdjustmentsArgs {
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type CharacterDaysResolver<
    R = (CharacterDaySummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, CharacterDaysArgs>;
  export interface CharacterDaysArgs {
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type CollectedProgressionSummaryResolver<
    R = CharacterSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayBySummaryNumberResolver<
    R = CharacterDaySummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DayBySummaryNumberArgs>;
  export interface DayBySummaryNumberArgs {
    summaryNumber?:
      | string
      | null /** The summary number of the log to look for. (required) */;
  }

  export type DayLogByIdResolver<
    R = CharacterDaySummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DayLogByIdArgs>;
  export interface DayLogByIdArgs {
    logID?: string | null /** The id of the log to look for. (required) */;
  }

  export type UnCollectedDayLogsResolver<
    R = (CharacterDaySummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.AccountProgressionSummary */
export namespace AccountProgressionSummaryResolvers {
  export interface Resolvers<Context = any> {
    activeDayCount?: ActiveDayCountResolver<number | null, any, Context>;
    characterCount?: CharacterCountResolver<number | null, any, Context>;
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<number | null, any, Context>;
    scenarioOutcomes?: ScenarioOutcomesResolver<
      ScenarioOutcome_UInt32 | null,
      any,
      Context
    >;
    secondsActive?: SecondsActiveResolver<number | null, any, Context>;
    skillPartLevels?: SkillPartLevelsResolver<number | null, any, Context>;
    statsGained?: StatsGainedResolver<number | null, any, Context>;
  }

  export type ActiveDayCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioOutcomesResolver<
    R = ScenarioOutcome_UInt32 | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartLevelsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsGainedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel */
export namespace CraftingSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    blockSummary?: BlockSummaryResolver<JobSummaryDBModel | null, any, Context>;
    grindSummary?: GrindSummaryResolver<JobSummaryDBModel | null, any, Context>;
    makeSummary?: MakeSummaryResolver<JobSummaryDBModel | null, any, Context>;
    purifySummary?: PurifySummaryResolver<
      JobSummaryDBModel | null,
      any,
      Context
    >;
    repairSummary?: RepairSummaryResolver<
      JobSummaryDBModel | null,
      any,
      Context
    >;
    salvageSummary?: SalvageSummaryResolver<
      JobSummaryDBModel | null,
      any,
      Context
    >;
    shapeSummary?: ShapeSummaryResolver<JobSummaryDBModel | null, any, Context>;
  }

  export type BlockSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GrindSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MakeSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PurifySummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RepairSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SalvageSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShapeSummaryResolver<
    R = JobSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel+JobSummaryDBModel */
export namespace JobSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    canceled?: CanceledResolver<number | null, any, Context>;
    collected?: CollectedResolver<number | null, any, Context>;
    started?: StartedResolver<number | null, any, Context>;
  }

  export type CanceledResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CollectedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel */
export namespace DamageSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    createCount?: CreateCountResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    damageApplied?: DamageAppliedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    damageReceived?: DamageReceivedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    deathCount?: DeathCountResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    healingApplied?: HealingAppliedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    healingReceived?: HealingReceivedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    killAssistCount?: KillAssistCountResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    killCount?: KillCountResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    perCharacterClass?: PerCharacterClassResolver<
      (DataPerCharacterClassDBModel | null)[] | null,
      any,
      Context
    >;
    woundsApplied?: WoundsAppliedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    woundsHealedApplied?: WoundsHealedAppliedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    woundsHealedReceived?: WoundsHealedReceivedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
    woundsReceived?: WoundsReceivedResolver<
      CountPerTargetTypeDBModel | null,
      any,
      Context
    >;
  }

  export type CreateCountResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageAppliedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageReceivedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DeathCountResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealingAppliedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HealingReceivedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KillAssistCountResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KillCountResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PerCharacterClassResolver<
    R = (DataPerCharacterClassDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WoundsAppliedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WoundsHealedAppliedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WoundsHealedReceivedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WoundsReceivedResolver<
    R = CountPerTargetTypeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CountPerTargetTypeDBModel */
export namespace CountPerTargetTypeDBModelResolvers {
  export interface Resolvers<Context = any> {
    anyCharacter?: AnyCharacterResolver<number | null, any, Context>;
    building?: BuildingResolver<number | null, any, Context>;
    dummy?: DummyResolver<number | null, any, Context>;
    item?: ItemResolver<number | null, any, Context>;
    nonPlayerCharacter?: NonPlayerCharacterResolver<
      number | null,
      any,
      Context
    >;
    playerCharacter?: PlayerCharacterResolver<number | null, any, Context>;
    resourceNode?: ResourceNodeResolver<number | null, any, Context>;
    self?: SelfResolver<number | null, any, Context>;
  }

  export type AnyCharacterResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BuildingResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DummyResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonPlayerCharacterResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlayerCharacterResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResourceNodeResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SelfResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel+DataPerCharacterClassDBModel */
export namespace DataPerCharacterClassDBModelResolvers {
  export interface Resolvers<Context = any> {
    characterClass?: CharacterClassResolver<Archetype | null, any, Context>;
    killAssistCount?: KillAssistCountResolver<number | null, any, Context>;
    killCount?: KillCountResolver<number | null, any, Context>;
  }

  export type CharacterClassResolver<
    R = Archetype | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KillAssistCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KillCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace ScenarioOutcome_UInt32Resolvers {
  export interface Resolvers<Context = any> {
    draw?: DrawResolver<number | null, any, Context> /** Draw */;
    invalid?: InvalidResolver<number | null, any, Context> /** Invalid */;
    killed?: KilledResolver<number | null, any, Context> /** Killed */;
    lose?: LoseResolver<number | null, any, Context> /** Lose */;
    restart?: RestartResolver<number | null, any, Context> /** Restart */;
    win?: WinResolver<number | null, any, Context> /** Win */;
  }

  export type DrawResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InvalidResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KilledResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LoseResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RestartResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WinResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentDBModel */
export namespace CharacterAdjustmentDBModelResolvers {
  export interface Resolvers<Context = any> {
    adjustment?: AdjustmentResolver<
      CharacterAdjustmentGQLField | null,
      any,
      Context
    >;
    characterDayLogID?: CharacterDayLogIdResolver<
      CharacterDaySummaryInstanceID | null,
      any,
      Context
    >;
    dayEnd?: DayEndResolver<string | null, any, Context>;
    reason?: ReasonResolver<
      CharacterAdjustmentReasonGQLField | null,
      any,
      Context
    >;
    sequence?: SequenceResolver<number | null, any, Context>;
    shardDayLogID?: ShardDayLogIdResolver<
      ShardDaySummaryInstanceID | null,
      any,
      Context
    >;
  }

  export type AdjustmentResolver<
    R = CharacterAdjustmentGQLField | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterDayLogIdResolver<
    R = CharacterDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReasonResolver<
    R = CharacterAdjustmentReasonGQLField | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SequenceResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardDayLogIdResolver<
    R = ShardDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentGQLField */
export namespace CharacterAdjustmentGQLFieldResolvers {
  export interface Resolvers<Context = any> {
    abilityComponent?: AbilityComponentResolver<
      CharacterAdjustmentAbilityComponentProgress | null,
      any,
      Context
    >;
    addItem?: AddItemResolver<CharacterAdjustmentAddItem | null, any, Context>;
    applyStatus?: ApplyStatusResolver<
      CharacterAdjustmentApplyStatus | null,
      any,
      Context
    >;
    playerStat?: PlayerStatResolver<
      CharacterAdjustmentPlayerStat | null,
      any,
      Context
    >;
    skillPart?: SkillPartResolver<
      CharacterAdjustmentSkillPartProgress | null,
      any,
      Context
    >;
  }

  export type AbilityComponentResolver<
    R = CharacterAdjustmentAbilityComponentProgress | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AddItemResolver<
    R = CharacterAdjustmentAddItem | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ApplyStatusResolver<
    R = CharacterAdjustmentApplyStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlayerStatResolver<
    R = CharacterAdjustmentPlayerStat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartResolver<
    R = CharacterAdjustmentSkillPartProgress | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAbilityComponentProgress */
export namespace CharacterAdjustmentAbilityComponentProgressResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentDef?: AbilityComponentDefResolver<
      AbilityComponentGQL | null,
      any,
      Context
    >;
    abilityComponentID?: AbilityComponentIdResolver<
      string | null,
      any,
      Context
    >;
    newLevel?: NewLevelResolver<number | null, any, Context>;
    newProgressPoints?: NewProgressPointsResolver<number | null, any, Context>;
    previousLevel?: PreviousLevelResolver<number | null, any, Context>;
    previousProgressionPoints?: PreviousProgressionPointsResolver<
      number | null,
      any,
      Context
    >;
  }

  export type AbilityComponentDefResolver<
    R = AbilityComponentGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NewLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NewProgressPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAddItem */
export namespace CharacterAdjustmentAddItemResolvers {
  export interface Resolvers<Context = any> {
    itemDef?: ItemDefResolver<ItemDefRef | null, any, Context>;
    itemInstanceIDS?: ItemInstanceIdsResolver<
      (ItemInstanceID | null)[] | null,
      any,
      Context
    >;
    quality?: QualityResolver<ItemQuality | null, any, Context>;
    staticDefinitionID?: StaticDefinitionIdResolver<
      string | null,
      any,
      Context
    >;
    unitCount?: UnitCountResolver<number | null, any, Context>;
  }

  export type ItemDefResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemInstanceIdsResolver<
    R = (ItemInstanceID | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QualityResolver<
    R = ItemQuality | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaticDefinitionIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentApplyStatus */
export namespace CharacterAdjustmentApplyStatusResolvers {
  export interface Resolvers<Context = any> {
    statusID?: StatusIdResolver<string | null, any, Context>;
  }

  export type StatusIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentPlayerStat */
export namespace CharacterAdjustmentPlayerStatResolvers {
  export interface Resolvers<Context = any> {
    newBonus?: NewBonusResolver<number | null, any, Context>;
    newProgressionPoints?: NewProgressionPointsResolver<
      number | null,
      any,
      Context
    >;
    previousBonus?: PreviousBonusResolver<number | null, any, Context>;
    previousProgressionPoints?: PreviousProgressionPointsResolver<
      number | null,
      any,
      Context
    >;
    stat?: StatResolver<Stat | null, any, Context>;
  }

  export type NewBonusResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NewProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousBonusResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentSkillPartProgress */
export namespace CharacterAdjustmentSkillPartProgressResolvers {
  export interface Resolvers<Context = any> {
    newLevel?: NewLevelResolver<number | null, any, Context>;
    newProgressPoints?: NewProgressPointsResolver<number | null, any, Context>;
    previousLevel?: PreviousLevelResolver<number | null, any, Context>;
    previousProgressionPoints?: PreviousProgressionPointsResolver<
      number | null,
      any,
      Context
    >;
    skillPartID?: SkillPartIdResolver<string | null, any, Context>;
  }

  export type NewLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NewProgressPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PreviousProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentReasonGQLField */
export namespace CharacterAdjustmentReasonGQLFieldResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentLevel?: AbilityComponentLevelResolver<
      CharacterAdjustmentReasonAbilityComponentLevel | null,
      any,
      Context
    >;
    adminGrant?: AdminGrantResolver<boolean | null, any, Context>;
    useAbilities?: UseAbilitiesResolver<
      CharacterAdjustmentReasonUseAbilities | null,
      any,
      Context
    >;
    useAbilityComponent?: UseAbilityComponentResolver<
      CharacterAdjustmentReasonUseAbilityComponent | null,
      any,
      Context
    >;
    useSkillPart?: UseSkillPartResolver<
      CharacterAdjustmentReasonUseSkillPart | null,
      any,
      Context
    >;
  }

  export type AbilityComponentLevelResolver<
    R = CharacterAdjustmentReasonAbilityComponentLevel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AdminGrantResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UseAbilitiesResolver<
    R = CharacterAdjustmentReasonUseAbilities | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UseAbilityComponentResolver<
    R = CharacterAdjustmentReasonUseAbilityComponent | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UseSkillPartResolver<
    R = CharacterAdjustmentReasonUseSkillPart | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonAbilityComponentLevel */
export namespace CharacterAdjustmentReasonAbilityComponentLevelResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentDef?: AbilityComponentDefResolver<
      AbilityComponentGQL | null,
      any,
      Context
    >;
    abilityComponentID?: AbilityComponentIdResolver<
      string | null,
      any,
      Context
    >;
    abilityComponentLevel?: AbilityComponentLevelResolver<
      number | null,
      any,
      Context
    >;
  }

  export type AbilityComponentDefResolver<
    R = AbilityComponentGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentLevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilities */
export namespace CharacterAdjustmentReasonUseAbilitiesResolvers {
  export interface Resolvers<Context = any> {
    inCombatCount?: InCombatCountResolver<number | null, any, Context>;
    nonCombatCount?: NonCombatCountResolver<number | null, any, Context>;
  }

  export type InCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseAbilityComponent */
export namespace CharacterAdjustmentReasonUseAbilityComponentResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentDef?: AbilityComponentDefResolver<
      AbilityComponentGQL | null,
      any,
      Context
    >;
    abilityComponentID?: AbilityComponentIdResolver<
      string | null,
      any,
      Context
    >;
    inCombatCount?: InCombatCountResolver<number | null, any, Context>;
    nonCombatCount?: NonCombatCountResolver<number | null, any, Context>;
  }

  export type AbilityComponentDefResolver<
    R = AbilityComponentGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseSkillPart */
export namespace CharacterAdjustmentReasonUseSkillPartResolvers {
  export interface Resolvers<Context = any> {
    abilityInstanceID?: AbilityInstanceIdResolver<string | null, any, Context>;
    inCombatCount?: InCombatCountResolver<number | null, any, Context>;
    nonCombatCount?: NonCombatCountResolver<number | null, any, Context>;
  }

  export type AbilityInstanceIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel */
export namespace CharacterDaySummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentsUsed?: AbilityComponentsUsedResolver<
      (AbilityComponentUsedSummaryDBModel | null)[] | null,
      any,
      Context
    >;
    accountID?: AccountIdResolver<AccountID | null, any, Context>;
    adjustments?: AdjustmentsResolver<
      (CharacterAdjustmentDBModel | null)[] | null,
      any,
      Context
    >;
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    dayEnd?: DayEndResolver<string | null, any, Context>;
    dayStart?: DayStartResolver<string | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<number | null, any, Context>;
    id?: IdResolver<CharacterDaySummaryInstanceID | null, any, Context>;
    plots?: PlotsResolver<PlotSummaryDBModel | null, any, Context>;
    scenarios?: ScenariosResolver<
      (FinishedScenario | null)[] | null,
      any,
      Context
    >;
    secondsActive?: SecondsActiveResolver<number | null, any, Context>;
    shardDayLogID?: ShardDayLogIdResolver<
      ShardDaySummaryInstanceID | null,
      any,
      Context
    >;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
    state?: StateResolver<States | null, any, Context>;
    summaryNumber?: SummaryNumberResolver<number | null, any, Context>;
  }

  export type AbilityComponentsUsedResolver<
    R = (AbilityComponentUsedSummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AccountIdResolver<
    R = AccountID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AdjustmentsResolver<
    R = (CharacterAdjustmentDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = CharacterDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlotsResolver<
    R = PlotSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenariosResolver<
    R = (FinishedScenario | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardDayLogIdResolver<
    R = ShardDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StateResolver<
    R = States | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SummaryNumberResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.AbilityComponentUsedSummaryDBModel */
export namespace AbilityComponentUsedSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentDef?: AbilityComponentDefResolver<
      AbilityComponentGQL | null,
      any,
      Context
    >;
    abilityComponentID?: AbilityComponentIdResolver<
      string | null,
      any,
      Context
    >;
    usedInCombatCount?: UsedInCombatCountResolver<number | null, any, Context>;
    usedNonCombatCount?: UsedNonCombatCountResolver<
      number | null,
      any,
      Context
    >;
  }

  export type AbilityComponentDefResolver<
    R = AbilityComponentGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AbilityComponentIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsedInCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsedNonCombatCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.PlotSummaryDBModel */
export namespace PlotSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    factionPlotsCaptured?: FactionPlotsCapturedResolver<
      number | null,
      any,
      Context
    >;
    scenarioPlotsCaptured?: ScenarioPlotsCapturedResolver<
      number | null,
      any,
      Context
    >;
  }

  export type FactionPlotsCapturedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioPlotsCapturedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+FinishedScenario */
export namespace FinishedScenarioResolvers {
  export interface Resolvers<Context = any> {
    activeAtEnd?: ActiveAtEndResolver<boolean | null, any, Context>;
    outcome?: OutcomeResolver<ScenarioOutcome | null, any, Context>;
    scenarioDefinitionID?: ScenarioDefinitionIdResolver<
      string | null,
      any,
      Context
    >;
    scenarioID?: ScenarioIdResolver<ScenarioInstanceID | null, any, Context>;
    score?: ScoreResolver<number | null, any, Context>;
    teamID?: TeamIdResolver<ScenarioTeamID | null, any, Context>;
  }

  export type ActiveAtEndResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutcomeResolver<
    R = ScenarioOutcome | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioDefinitionIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioIdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamIdResolver<
    R = ScenarioTeamID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.CharacterSummaryDBModel */
export namespace CharacterSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentUsed?: AbilityComponentUsedResolver<
      (AbilityComponentUsedSummaryDBModel | null)[] | null,
      any,
      Context
    >;
    accountID?: AccountIdResolver<AccountID | null, any, Context>;
    activeDayCount?: ActiveDayCountResolver<number | null, any, Context>;
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<number | null, any, Context>;
    lastDayLogProcessedID?: LastDayLogProcessedIdResolver<
      CharacterDaySummaryInstanceID | null,
      any,
      Context
    >;
    lastDayProcessedStart?: LastDayProcessedStartResolver<
      string | null,
      any,
      Context
    >;
    plots?: PlotsResolver<PlotSummaryDBModel | null, any, Context>;
    scenarioOutcomes?: ScenarioOutcomesResolver<
      ScenarioOutcome_UInt32 | null,
      any,
      Context
    >;
    secondsActive?: SecondsActiveResolver<number | null, any, Context>;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
  }

  export type AbilityComponentUsedResolver<
    R = (AbilityComponentUsedSummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AccountIdResolver<
    R = AccountID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ActiveDayCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastDayLogProcessedIdResolver<
    R = CharacterDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastDayProcessedStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlotsResolver<
    R = PlotSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioOutcomesResolver<
    R = ScenarioOutcome_UInt32 | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MyScenarioQueue */
export namespace MyScenarioQueueResolvers {
  export interface Resolvers<Context = any> {
    availableMatches?: AvailableMatchesResolver<
      (Match | null)[] | null,
      any,
      Context
    >;
  }

  export type AvailableMatchesResolver<
    R = (Match | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.Match */
export namespace MatchResolvers {
  export interface Resolvers<Context = any> {
    charactersNeededToStartNextGameByFaction?: CharactersNeededToStartNextGameByFactionResolver<
      Faction_Int32 | null,
      any,
      Context
    >;
    gamesInProgress?: GamesInProgressResolver<number | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<MatchQueueInstanceID | null, any, Context>;
    inScenarioID?: InScenarioIdResolver<
      ScenarioInstanceID | null,
      any,
      Context
    >;
    isInScenario?: IsInScenarioResolver<boolean | null, any, Context>;
    isQueued?: IsQueuedResolver<boolean | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    totalBackfillsNeededByFaction?: TotalBackfillsNeededByFactionResolver<
      Faction_Int32 | null,
      any,
      Context
    >;
  }

  export type CharactersNeededToStartNextGameByFactionResolver<
    R = Faction_Int32 | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GamesInProgressResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = MatchQueueInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InScenarioIdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsInScenarioResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsQueuedResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalBackfillsNeededByFactionResolver<
    R = Faction_Int32 | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace Faction_Int32Resolvers {
  export interface Resolvers<Context = any> {
    arthurian?: ArthurianResolver<number | null, any, Context> /** Arthurian */;
    cOUNT?: COuntResolver<number | null, any, Context> /** COUNT */;
    factionless?: FactionlessResolver<
      number | null,
      any,
      Context
    > /** Factionless */;
    tdd?: TddResolver<number | null, any, Context> /** TDD */;
    viking?: VikingResolver<number | null, any, Context> /** Viking */;
  }

  export type ArthurianResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type COuntResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionlessResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TddResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VikingResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Content.PatcherAlert */
export namespace PatcherAlertResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context>;
    message?: MessageResolver<
      string | null,
      any,
      Context
    > /** HTML Content for the patcher alert. */;
    utcCreated?: UtcCreatedResolver<string | null, any, Context>;
    utcDisplayEnd?: UtcDisplayEndResolver<string | null, any, Context>;
    utcDisplayStart?: UtcDisplayStartResolver<string | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MessageResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcCreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Content.PatcherHero */
export namespace PatcherHeroResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context>;
    utcCreated?: UtcCreatedResolver<string | null, any, Context>;
    utcDisplayEnd?: UtcDisplayEndResolver<string | null, any, Context>;
    utcDisplayStart?: UtcDisplayStartResolver<string | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcCreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Content.PatchNote */
export namespace PatchNoteResolvers {
  export interface Resolvers<Context = any> {
    channels?: ChannelsResolver<
      (number | null)[] | null,
      any,
      Context
    > /** Which channels will this patch note be presented on. */;
    htmlContent?: HtmlContentResolver<
      string | null,
      any,
      Context
    > /** HTML Content for the patch note. */;
    id?: IdResolver<string | null, any, Context>;
    jSONContent?: JSonContentResolver<
      string | null,
      any,
      Context
    > /** JSON data of HTML Content for the patch note. */;
    patchNumber?: PatchNumberResolver<string | null, any, Context>;
    title?: TitleResolver<string | null, any, Context>;
    utcCreated?: UtcCreatedResolver<string | null, any, Context>;
    utcDisplayEnd?: UtcDisplayEndResolver<string | null, any, Context>;
    utcDisplayStart?: UtcDisplayStartResolver<string | null, any, Context>;
  }

  export type ChannelsResolver<
    R = (number | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HtmlContentResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JSonContentResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PatchNumberResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcCreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UtcDisplayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Items.ResourceNodeResult */
export namespace ResourceNodeResultResolvers {
  export interface Resolvers<Context = any> {
    currentHealth?: CurrentHealthResolver<Decimal | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    maxHealth?: MaxHealthResolver<Decimal | null, any, Context>;
    permissibleHolder?: PermissibleHolderResolver<
      FlagsPermissibleHolderGQL | null,
      any,
      Context
    >;
    resourceNodeInstanceID?: ResourceNodeInstanceIdResolver<
      ResourceNodeInstanceID | null,
      any,
      Context
    >;
    staticDefinition?: StaticDefinitionResolver<
      ResourceNodeDefRef | null,
      any,
      Context
    >;
    subItems?: SubItemsResolver<
      (ResourceNodeSubItem | null)[] | null,
      any,
      Context
    >;
  }

  export type CurrentHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxHealthResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissibleHolderResolver<
    R = FlagsPermissibleHolderGQL | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResourceNodeInstanceIdResolver<
    R = ResourceNodeInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaticDefinitionResolver<
    R = ResourceNodeDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SubItemsResolver<
    R = (ResourceNodeSubItem | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ResourceNodeDefRef */
export namespace ResourceNodeDefRefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context>;
    mapIconAnchorX?: MapIconAnchorXResolver<Decimal | null, any, Context>;
    mapIconAnchorY?: MapIconAnchorYResolver<Decimal | null, any, Context>;
    mapIconURL?: MapIconUrlResolver<string | null, any, Context>;
    maxActors?: MaxActorsResolver<number | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    requirements?: RequirementsResolver<RequirementDef | null, any, Context>;
    secondsBetweenUse?: SecondsBetweenUseResolver<number | null, any, Context>;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconAnchorXResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconAnchorYResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MapIconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxActorsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequirementsResolver<
    R = RequirementDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsBetweenUseResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ResourceNodeSubItem */
export namespace ResourceNodeSubItemResolvers {
  export interface Resolvers<Context = any> {
    subItemDefinitionRef?: SubItemDefinitionRefResolver<
      ResourceNodeSubItemDefRef | null,
      any,
      Context
    >;
    takenCount?: TakenCountResolver<number | null, any, Context>;
  }

  export type SubItemDefinitionRefResolver<
    R = ResourceNodeSubItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TakenCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ResourceNodeSubItemDefRef */
export namespace ResourceNodeSubItemDefRefResolvers {
  export interface Resolvers<Context = any> {
    entries?: EntriesResolver<(Entry | null)[] | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    startingUnits?: StartingUnitsResolver<number | null, any, Context>;
  }

  export type EntriesResolver<
    R = (Entry | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartingUnitsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ResourceNodeSubItemDef+Entry */
export namespace EntryResolvers {
  export interface Resolvers<Context = any> {
    faction?: FactionResolver<Faction | null, any, Context>;
    harvestItems?: HarvestItemsResolver<
      (HarvestItem | null)[] | null,
      any,
      Context
    >;
  }

  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HarvestItemsResolver<
    R = (HarvestItem | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ResourceNodeSubItemDef+Entry+HarvestItem */
export namespace HarvestItemResolvers {
  export interface Resolvers<Context = any> {
    itemDefinition?: ItemDefinitionResolver<ItemDefRef | null, any, Context>;
    maxQuality?: MaxQualityResolver<
      Decimal | null,
      any,
      Context
    > /** the max quality that could result */;
    maxUnitCount?: MaxUnitCountResolver<
      number | null,
      any,
      Context
    > /** the max unit count that could result */;
    minQuality?: MinQualityResolver<
      Decimal | null,
      any,
      Context
    > /** the min quality that could result */;
    minUnitCount?: MinUnitCountResolver<
      number | null,
      any,
      Context
    > /** the min unit count that could result */;
    weight?: WeightResolver<number | null, any, Context>;
  }

  export type ItemDefinitionResolver<
    R = ItemDefRef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxUnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinQualityResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinUnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WeightResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel */
export namespace ScenarioSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    creatorAdminID?: CreatorAdminIdResolver<CharacterID | null, any, Context>;
    endTime?: EndTimeResolver<string | null, any, Context>;
    resolution?: ResolutionResolver<ScenarioResolution | null, any, Context>;
    rounds?: RoundsResolver<(RoundOutcome | null)[] | null, any, Context>;
    scenarioDef?: ScenarioDefResolver<ScenarioDef | null, any, Context>;
    scenarioInstanceID?: ScenarioInstanceIdResolver<
      ScenarioInstanceID | null,
      any,
      Context
    >;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
    startTime?: StartTimeResolver<string | null, any, Context>;
    teamOutcomes?: TeamOutcomesResolver<
      (TeamOutcomeScenarioField | null)[] | null,
      any,
      Context
    > /** details for what the each team did for the whole scenario */;
  }

  export type CreatorAdminIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EndTimeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResolutionResolver<
    R = ScenarioResolution | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundsResolver<
    R = (RoundOutcome | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioDefResolver<
    R = ScenarioDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenarioInstanceIdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamOutcomesResolver<
    R = (TeamOutcomeScenarioField | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+RoundOutcome */
export namespace RoundOutcomeResolvers {
  export interface Resolvers<Context = any> {
    adminID?: AdminIdResolver<CharacterID | null, any, Context>;
    endTime?: EndTimeResolver<string | null, any, Context>;
    myRoundOutcome?: MyRoundOutcomeResolver<
      CharacterOutcomeDBModel | null,
      any,
      Context
    > /** details for what the caller did during this round */;
    resolution?: ResolutionResolver<ScenarioResolution | null, any, Context>;
    roundIndex?: RoundIndexResolver<number | null, any, Context>;
    roundInstanceID?: RoundInstanceIdResolver<
      RoundInstanceID | null,
      any,
      Context
    >;
    startTime?: StartTimeResolver<string | null, any, Context>;
    teamOutcomes?: TeamOutcomesResolver<
      (TeamOutcomeRound | null)[] | null,
      any,
      Context
    >;
  }

  export type AdminIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EndTimeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyRoundOutcomeResolver<
    R = CharacterOutcomeDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ResolutionResolver<
    R = ScenarioResolution | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundIndexResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundInstanceIdResolver<
    R = RoundInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamOutcomesResolver<
    R = (TeamOutcomeRound | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+CharacterOutcomeDBModel */
export namespace CharacterOutcomeDBModelResolvers {
  export interface Resolvers<Context = any> {
    characterType?: CharacterTypeResolver<
      ProgressionCharacterType | null,
      any,
      Context
    >;
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    displayName?: DisplayNameResolver<string | null, any, Context>;
    score?: ScoreResolver<number | null, any, Context>;
  }

  export type CharacterTypeResolver<
    R = ProgressionCharacterType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeRound */
export namespace TeamOutcomeRoundResolvers {
  export interface Resolvers<Context = any> {
    damageSummary?: DamageSummaryResolver<
      DamageSummaryDBModel | null,
      any,
      Context
    > /** damage summary sum across all participants in this round */;
    outcome?: OutcomeResolver<ScenarioOutcome | null, any, Context>;
    participantCount?: ParticipantCountResolver<
      number | null,
      any,
      Context
    > /** how many characters participated in this round */;
    participants?: ParticipantsResolver<
      (CharacterOutcomeDBModel | null)[] | null,
      any,
      Context
    >;
    role?: RoleResolver<RoleID | null, any, Context>;
    score?: ScoreResolver<number | null, any, Context>;
    teamID?: TeamIdResolver<ScenarioTeamID | null, any, Context>;
  }

  export type DamageSummaryResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OutcomeResolver<
    R = ScenarioOutcome | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ParticipantCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ParticipantsResolver<
    R = (CharacterOutcomeDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoleResolver<
    R = RoleID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScoreResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamIdResolver<
    R = ScenarioTeamID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Scenario.ScenarioDef */
export namespace ScenarioDefResolvers {
  export interface Resolvers<Context = any> {
    displayDescription?: DisplayDescriptionResolver<
      string | null,
      any,
      Context
    >;
    displayName?: DisplayNameResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
  }

  export type DisplayDescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenarioField */
export namespace TeamOutcomeScenarioFieldResolvers {
  export interface Resolvers<Context = any> {
    outcome?: OutcomeResolver<ScenarioOutcome | null, any, Context>;
    participants?: ParticipantsResolver<
      (CharacterOutcomeDBModel | null)[] | null,
      any,
      Context
    >;
    teamID?: TeamIdResolver<ScenarioTeamID | null, any, Context>;
  }

  export type OutcomeResolver<
    R = ScenarioOutcome | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ParticipantsResolver<
    R = (CharacterOutcomeDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamIdResolver<
    R = ScenarioTeamID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Items.SecureTradeStatus */
export namespace SecureTradeStatusResolvers {
  export interface Resolvers<Context = any> {
    myItems?: MyItemsResolver<
      (Item | null)[] | null,
      any,
      Context
    > /** The items you've added to the trade */;
    myState?: MyStateResolver<
      SecureTradeState | null,
      any,
      Context
    > /** The state of the trade, from your perspective */;
    theirEntityID?: TheirEntityIdResolver<
      EntityID | null,
      any,
      Context
    > /** The entity ID of who is being traded with */;
    theirItems?: TheirItemsResolver<
      (Item | null)[] | null,
      any,
      Context
    > /** The items you will get from this trade */;
    theirState?: TheirStateResolver<
      SecureTradeState | null,
      any,
      Context
    > /** The state of the trade, from the perspective of the entity you are trading with */;
  }

  export type MyItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyStateResolver<
    R = SecureTradeState | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TheirEntityIdResolver<
    R = EntityID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TheirItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TheirStateResolver<
    R = SecureTradeState | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.SimpleCharacter */
export namespace SimpleCharacterResolvers {
  export interface Resolvers<Context = any> {
    archetype?: ArchetypeResolver<Archetype | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    gender?: GenderResolver<Gender | null, any, Context>;
    id?: IdResolver<CharacterID | null, any, Context>;
    lastLogin?: LastLoginResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    race?: RaceResolver<Race | null, any, Context>;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
  }

  export type ArchetypeResolver<
    R = Archetype | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GenderResolver<
    R = Gender | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastLoginResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceResolver<
    R = Race | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.ShardProgressionData */
export namespace ShardProgressionDataResolvers {
  export interface Resolvers<Context = any> {
    adjustmentsSummary?: AdjustmentsSummaryResolver<
      CharacterAdjustmentSummary | null,
      any,
      Context
    > /** Information about rewards over a time frame or specific day */;
    progressionDaySummary?: ProgressionDaySummaryResolver<
      ShardDaySummaryDBModel | null,
      any,
      Context
    > /** Information about a particular day */;
    progressionSummary?: ProgressionSummaryResolver<
      ShardSummaryDBModel | null,
      any,
      Context
    > /** Global information about this shard. */;
    progressionSummaryRange?: ProgressionSummaryRangeResolver<
      ShardSummaryDBModel | null,
      any,
      Context
    > /** Global information about this shard given the time frame. */;
    realmSummary?: RealmSummaryResolver<
      RealmDaySummaryDBModel | null,
      any,
      Context
    > /** Information about what happened to a realm on a given day. */;
    scenarioSummaries?: ScenarioSummariesResolver<
      PagedScenarioSummaries | null,
      any,
      Context
    > /** Information about all the finished scenarios within a date range */;
    shardDays?: ShardDaysResolver<
      PagedShardDaySummaries | null,
      any,
      Context
    > /** Information about what happened on a shard over the date range provided. */;
  }

  export type AdjustmentsSummaryResolver<
    R = CharacterAdjustmentSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AdjustmentsSummaryArgs>;
  export interface AdjustmentsSummaryArgs {
    logID?:
      | string
      | null /** The specific day to look for, used instead of date range if specified. */;
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type ProgressionDaySummaryResolver<
    R = ShardDaySummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ProgressionDaySummaryArgs>;
  export interface ProgressionDaySummaryArgs {
    logID?: string | null /** The specific day to look for */;
  }

  export type ProgressionSummaryResolver<
    R = ShardSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionSummaryRangeResolver<
    R = ShardSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ProgressionSummaryRangeArgs>;
  export interface ProgressionSummaryRangeArgs {
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type RealmSummaryResolver<
    R = RealmDaySummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, RealmSummaryArgs>;
  export interface RealmSummaryArgs {
    shardDayID?: string | null /** The specific log to look for */;
    faction?: string | null /** The faction to look for */;
  }

  export type ScenarioSummariesResolver<
    R = PagedScenarioSummaries | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ScenarioSummariesArgs>;
  export interface ScenarioSummariesArgs {
    skip?: number | null /** The number of entries to skip. */;
    limit?: number | null /** Maximum number of entries to return. (max: 30) */;
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }

  export type ShardDaysResolver<
    R = PagedShardDaySummaries | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ShardDaysArgs>;
  export interface ShardDaysArgs {
    skip?: number | null /** The number of entries to skip. */;
    limit?: number | null /** Maximum number of entries to return. (max: 30) */;
    startDate?: Date | null /** The starting date to look for. */;
    endDate?: Date | null /** The ending date to look for. */;
  }
}
/** ServerLib.Progression.CharacterAdjustmentSummary */
export namespace CharacterAdjustmentSummaryResolvers {
  export interface Resolvers<Context = any> {
    averageAdjustementsPerCharacter?: AverageAdjustementsPerCharacterResolver<
      Decimal | null,
      any,
      Context
    >;
    characterCount?: CharacterCountResolver<number | null, any, Context>;
    characterIDWithMaxAdjustments?: CharacterIdWithMaxAdjustmentsResolver<
      CharacterID | null,
      any,
      Context
    >;
    items?: ItemsResolver<(ItemsAdded | null)[] | null, any, Context>;
    maxAdjustmentsOnCharacter?: MaxAdjustmentsOnCharacterResolver<
      number | null,
      any,
      Context
    >;
    skillParts?: SkillPartsResolver<
      (SkillPartLevels | null)[] | null,
      any,
      Context
    >;
    stats?: StatsResolver<(StatBonusPoints | null)[] | null, any, Context>;
    statusesApplied?: StatusesAppliedResolver<
      (StatusApplied | null)[] | null,
      any,
      Context
    >;
  }

  export type AverageAdjustementsPerCharacterResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterIdWithMaxAdjustmentsResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ItemsResolver<
    R = (ItemsAdded | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxAdjustmentsOnCharacterResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartsResolver<
    R = (SkillPartLevels | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatsResolver<
    R = (StatBonusPoints | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusesAppliedResolver<
    R = (StatusApplied | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+ItemsAdded */
export namespace ItemsAddedResolvers {
  export interface Resolvers<Context = any> {
    staticDefinitionID?: StaticDefinitionIdResolver<
      string | null,
      any,
      Context
    >;
    unitCount?: UnitCountResolver<number | null, any, Context>;
  }

  export type StaticDefinitionIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UnitCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+SkillPartLevels */
export namespace SkillPartLevelsResolvers {
  export interface Resolvers<Context = any> {
    levelChange?: LevelChangeResolver<number | null, any, Context>;
    skillPartID?: SkillPartIdResolver<string | null, any, Context>;
  }

  export type LevelChangeResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SkillPartIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatBonusPoints */
export namespace StatBonusPointsResolvers {
  export interface Resolvers<Context = any> {
    bonusChange?: BonusChangeResolver<number | null, any, Context>;
    stat?: StatResolver<Stat | null, any, Context>;
  }

  export type BonusChangeResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatResolver<
    R = Stat | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatusApplied */
export namespace StatusAppliedResolvers {
  export interface Resolvers<Context = any> {
    count?: CountResolver<number | null, any, Context>;
    statusID?: StatusIdResolver<string | null, any, Context>;
  }

  export type CountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ShardDaySummaryDBModel */
export namespace ShardDaySummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    dayEnd?: DayEndResolver<string | null, any, Context>;
    dayStart?: DayStartResolver<string | null, any, Context>;
    nonPlayerCharacters?: NonPlayerCharactersResolver<
      CharacterSummary | null,
      any,
      Context
    >;
    playerCharacters?: PlayerCharactersResolver<
      CharacterSummary | null,
      any,
      Context
    >;
    plots?: PlotsResolver<PlotSummary | null, any, Context>;
    scenarios?: ScenariosResolver<
      (ScenarioSummary | null)[] | null,
      any,
      Context
    >;
  }

  export type DayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonPlayerCharactersResolver<
    R = CharacterSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlayerCharactersResolver<
    R = CharacterSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlotsResolver<
    R = PlotSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenariosResolver<
    R = (ScenarioSummary | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+CharacterSummary */
export namespace CharacterSummaryResolvers {
  export interface Resolvers<Context = any> {
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<
      number | null,
      any,
      Context
    > /** Distance traveled by all characters ever for this shard. */;
    secondsActive?: SecondsActiveResolver<
      number | null,
      any,
      Context
    > /** How many seconds of the game have been played by all characters ever for this shard. */;
  }

  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+PlotSummary */
export namespace PlotSummaryResolvers {
  export interface Resolvers<Context = any> {
    blocksCreated?: BlocksCreatedResolver<number | null, any, Context>;
    blocksDestroyed?: BlocksDestroyedResolver<number | null, any, Context>;
  }

  export type BlocksCreatedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BlocksDestroyedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+ScenarioSummary */
export namespace ScenarioSummaryResolvers {
  export interface Resolvers<Context = any> {
    finished?: FinishedResolver<number | null, any, Context>;
    killed?: KilledResolver<number | null, any, Context>;
    restarted?: RestartedResolver<number | null, any, Context>;
    started?: StartedResolver<number | null, any, Context>;
  }

  export type FinishedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KilledResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RestartedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StartedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel */
export namespace ShardSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    daysProcessed?: DaysProcessedResolver<number | null, any, Context>;
    nonPlayerCharacters?: NonPlayerCharactersResolver<
      CharacterSummary | null,
      any,
      Context
    >;
    playerCharacters?: PlayerCharactersResolver<
      CharacterSummary | null,
      any,
      Context
    >;
    plots?: PlotsResolver<PlotSummary | null, any, Context>;
    realmSummaries?: RealmSummariesResolver<
      Faction_RealmSummaryDBModel | null,
      any,
      Context
    >;
    scenarios?: ScenariosResolver<ScenarioSummary | null, any, Context>;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
  }

  export type DaysProcessedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NonPlayerCharactersResolver<
    R = CharacterSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlayerCharactersResolver<
    R = CharacterSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PlotsResolver<
    R = PlotSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RealmSummariesResolver<
    R = Faction_RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ScenariosResolver<
    R = ScenarioSummary | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace Faction_RealmSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    arthurian?: ArthurianResolver<
      RealmSummaryDBModel | null,
      any,
      Context
    > /** Arthurian */;
    cOUNT?: COuntResolver<
      RealmSummaryDBModel | null,
      any,
      Context
    > /** COUNT */;
    factionless?: FactionlessResolver<
      RealmSummaryDBModel | null,
      any,
      Context
    > /** Factionless */;
    tdd?: TddResolver<RealmSummaryDBModel | null, any, Context> /** TDD */;
    viking?: VikingResolver<
      RealmSummaryDBModel | null,
      any,
      Context
    > /** Viking */;
  }

  export type ArthurianResolver<
    R = RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type COuntResolver<
    R = RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionlessResolver<
    R = RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TddResolver<
    R = RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type VikingResolver<
    R = RealmSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.RealmSummaryDBModel */
export namespace RealmSummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<number | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    secondsActive?: SecondsActiveResolver<number | null, any, Context>;
  }

  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.RealmDaySummaryDBModel */
export namespace RealmDaySummaryDBModelResolvers {
  export interface Resolvers<Context = any> {
    abilityComponentsUsed?: AbilityComponentsUsedResolver<
      (AbilityComponentUsedSummaryDBModel | null)[] | null,
      any,
      Context
    >;
    characterCount?: CharacterCountResolver<number | null, any, Context>;
    crafting?: CraftingResolver<CraftingSummaryDBModel | null, any, Context>;
    damage?: DamageResolver<DamageSummaryDBModel | null, any, Context>;
    dayEnd?: DayEndResolver<string | null, any, Context>;
    dayStart?: DayStartResolver<string | null, any, Context>;
    distanceMoved?: DistanceMovedResolver<number | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    secondsActive?: SecondsActiveResolver<number | null, any, Context>;
    shardDayLogID?: ShardDayLogIdResolver<
      ShardDaySummaryInstanceID | null,
      any,
      Context
    >;
    shardID?: ShardIdResolver<ShardID | null, any, Context>;
  }

  export type AbilityComponentsUsedResolver<
    R = (AbilityComponentUsedSummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CharacterCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CraftingResolver<
    R = CraftingSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DamageResolver<
    R = DamageSummaryDBModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayEndResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DayStartResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DistanceMovedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsActiveResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardDayLogIdResolver<
    R = ShardDaySummaryInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardIdResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.PagedScenarioSummaries */
export namespace PagedScenarioSummariesResolvers {
  export interface Resolvers<Context = any> {
    data?: DataResolver<(ScenarioSummaryDBModel | null)[] | null, any, Context>;
    totalCount?: TotalCountResolver<number | null, any, Context>;
  }

  export type DataResolver<
    R = (ScenarioSummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Progression.PagedShardDaySummaries */
export namespace PagedShardDaySummariesResolvers {
  export interface Resolvers<Context = any> {
    data?: DataResolver<(ShardDaySummaryDBModel | null)[] | null, any, Context>;
    totalCount?: TotalCountResolver<number | null, any, Context>;
  }

  export type DataResolver<
    R = (ShardDaySummaryDBModel | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TotalCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Status.Status */
export namespace StatusResolvers {
  export interface Resolvers<Context = any> {
    statuses?: StatusesResolver<
      (StatusDef | null)[] | null,
      any,
      Context
    > /** List of all status defs */;
  }

  export type StatusesResolver<
    R = (StatusDef | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.Cogs.StatusDef */
export namespace StatusDefResolvers {
  export interface Resolvers<Context = any> {
    blocksAbilities?: BlocksAbilitiesResolver<
      boolean | null,
      any,
      Context
    > /** if the status blocks abilities from running */;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** description of the status */;
    iconClass?: IconClassResolver<
      string | null,
      any,
      Context
    > /** iconClass of the status */;
    iconURL?: IconUrlResolver<
      string | null,
      any,
      Context
    > /** icon url of the status */;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context> /** name of the status */;
    numericID?: NumericIdResolver<number | null, any, Context>;
    stacking?: StackingResolver<StatusStackingDef | null, any, Context>;
    statusTags?: StatusTagsResolver<(string | null)[] | null, any, Context>;
    uIText?: UITextResolver<string | null, any, Context>;
    uIVisiblity?: UIVisiblityResolver<StatusUIVisiblity | null, any, Context>;
  }

  export type BlocksAbilitiesResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconClassResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconUrlResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NumericIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StackingResolver<
    R = StatusStackingDef | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusTagsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UITextResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UIVisiblityResolver<
    R = StatusUIVisiblity | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.StatusStackingDef */
export namespace StatusStackingDefResolvers {
  export interface Resolvers<Context = any> {
    group?: GroupResolver<string | null, any, Context>;
    removalOrder?: RemovalOrderResolver<
      StatusRemovalOrder | null,
      any,
      Context
    >;
    statusDurationModType?: StatusDurationModTypeResolver<
      StatusDurationModification | null,
      any,
      Context
    >;
  }

  export type GroupResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RemovalOrderResolver<
    R = StatusRemovalOrder | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StatusDurationModTypeResolver<
    R = StatusDurationModification | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Test */
export namespace TestResolvers {
  export interface Resolvers<Context = any> {
    characters?: CharactersResolver<(Character | null)[] | null, any, Context>;
    customField?: CustomFieldResolver<
      ItemQuality | null,
      any,
      Context
    > /** testtesttest */;
    float?: FloatResolver<Decimal | null, any, Context>;
    homeArray?: HomeArrayResolver<(string | null)[] | null, any, Context>;
    homeList?: HomeListResolver<(string | null)[] | null, any, Context>;
    integer?: IntegerResolver<number | null, any, Context>;
    sg1?: Sg1Resolver<TestEnum_String | null, any, Context>;
    sg1Floats?: Sg1FloatsResolver<TestEnum_Single | null, any, Context>;
    sg1Titles?: Sg1TitlesResolver<TestEnum_String | null, any, Context>;
    string?: StringResolver<string | null, any, Context>;
    weapons?: WeaponsResolver<(string | null)[] | null, any, Context>;
  }

  export type CharactersResolver<
    R = (Character | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CustomFieldResolver<
    R = ItemQuality | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FloatResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HomeArrayResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HomeListResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IntegerResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type Sg1Resolver<
    R = TestEnum_String | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type Sg1FloatsResolver<
    R = TestEnum_Single | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type Sg1TitlesResolver<
    R = TestEnum_String | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StringResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WeaponsResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace TestEnum_StringResolvers {
  export interface Resolvers<Context = any> {
    carter?: CarterResolver<string | null, any, Context> /** Carter */;
    jackson?: JacksonResolver<string | null, any, Context> /** Jackson */;
    oneill?: OneillResolver<string | null, any, Context> /** Oneill */;
    tealc?: TealcResolver<string | null, any, Context> /** Tealc */;
  }

  export type CarterResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JacksonResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OneillResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TealcResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace TestEnum_SingleResolvers {
  export interface Resolvers<Context = any> {
    carter?: CarterResolver<Decimal | null, any, Context> /** Carter */;
    jackson?: JacksonResolver<Decimal | null, any, Context> /** Jackson */;
    oneill?: OneillResolver<Decimal | null, any, Context> /** Oneill */;
    tealc?: TealcResolver<Decimal | null, any, Context> /** Tealc */;
  }

  export type CarterResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type JacksonResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OneillResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TealcResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.TraitsInfo */
export namespace TraitsInfoResolvers {
  export interface Resolvers<Context = any> {
    maxAllowed?: MaxAllowedResolver<number | null, any, Context>;
    minRequired?: MinRequiredResolver<number | null, any, Context>;
    traits?: TraitsResolver<(Trait | null)[] | null, any, Context>;
  }

  export type MaxAllowedResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MinRequiredResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TraitsResolver<
    R = (Trait | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Crafting.VoxJobStatusGQL */
export namespace VoxJobStatusGQLResolvers {
  export interface Resolvers<Context = any> {
    status?: StatusResolver<VoxJobStatus | null, any, Context>;
  }

  export type StatusResolver<
    R = VoxJobStatus | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.WorldData */
export namespace WorldDataResolvers {
  export interface Resolvers<Context = any> {
    map?: MapResolver<MapData | null, any, Context>;
    spawnPoints?: SpawnPointsResolver<
      (SpawnPoint | null)[] | null,
      any,
      Context
    > /** Currently active spawn points available to you. */;
  }

  export type MapResolver<
    R = MapData | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpawnPointsResolver<
    R = (SpawnPoint | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.MapData */
export namespace MapDataResolvers {
  export interface Resolvers<Context = any> {
    dynamic?: DynamicResolver<(MapPoint | null)[] | null, any, Context>;
    static?: StaticResolver<(MapPoint | null)[] | null, any, Context>;
  }

  export type DynamicResolver<
    R = (MapPoint | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StaticResolver<
    R = (MapPoint | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.MapPoint */
export namespace MapPointResolvers {
  export interface Resolvers<Context = any> {
    actions?: ActionsResolver<MapPointActions | null, any, Context>;
    anchor?: AnchorResolver<(Decimal | null)[] | null, any, Context>;
    color?: ColorResolver<string | null, any, Context>;
    offset?: OffsetResolver<(Decimal | null)[] | null, any, Context>;
    position?: PositionResolver<(Decimal | null)[] | null, any, Context>;
    size?: SizeResolver<(Decimal | null)[] | null, any, Context>;
    src?: SrcResolver<string | null, any, Context>;
    tooltip?: TooltipResolver<string | null, any, Context>;
    zone?: ZoneResolver<ZoneInstanceID | null, any, Context>;
  }

  export type ActionsResolver<
    R = MapPointActions | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AnchorResolver<
    R = (Decimal | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ColorResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OffsetResolver<
    R = (Decimal | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = (Decimal | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SizeResolver<
    R = (Decimal | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SrcResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TooltipResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ZoneResolver<
    R = ZoneInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.MapPointActions */
export namespace MapPointActionsResolvers {
  export interface Resolvers<Context = any> {
    onClick?: OnClickResolver<MapPointAction | null, any, Context>;
  }

  export type OnClickResolver<
    R = MapPointAction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.Game.MapPointAction */
export namespace MapPointActionResolvers {
  export interface Resolvers<Context = any> {
    command?: CommandResolver<string | null, any, Context>;
    type?: TypeResolver<MapPointActionType | null, any, Context>;
  }

  export type CommandResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = MapPointActionType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.SpawnPoint */
export namespace SpawnPointResolvers {
  export interface Resolvers<Context = any> {
    faction?: FactionResolver<Faction | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    position?: PositionResolver<Vec3f | null, any, Context>;
  }

  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Vec3f | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** The root subscriptions object. */
export namespace CUSubscriptionResolvers {
  export interface Resolvers<Context = any> {
    activeGroupUpdates?: ActiveGroupUpdatesResolver<
      IGroupUpdate | null,
      any,
      Context
    > /** Updates to a group member in an active group */;
    interactiveAlerts?: InteractiveAlertsResolver<
      IInteractiveAlert | null,
      any,
      Context
    > /** Alerts */;
    myGroupNotifications?: MyGroupNotificationsResolver<
      IGroupNotification | null,
      any,
      Context
    > /** Group related notifications for your specific character. Tells you when you joined a group, etc. */;
    myInventoryItems?: MyInventoryItemsResolver<
      Item | null,
      any,
      Context
    > /** Real-time updates for inventory items */;
    passiveAlerts?: PassiveAlertsResolver<
      PassiveAlert | null,
      any,
      Context
    > /** Alerts that notify players something happened but do not need to be reacted to. */;
    patcherAlerts?: PatcherAlertsResolver<
      IPatcherAlertUpdate | null,
      any,
      Context
    > /** Gets updates for patcher alerts */;
    secureTradeUpdates?: SecureTradeUpdatesResolver<
      ISecureTradeUpdate | null,
      any,
      Context
    > /** Updates to a secure trade */;
    serverUpdates?: ServerUpdatesResolver<
      IServerUpdate | null,
      any,
      Context
    > /** Subscription for updates to servers */;
    shardCharacterUpdates?: ShardCharacterUpdatesResolver<
      IPatcherCharacterUpdate | null,
      any,
      Context
    > /** Subscription for simple updates to characters on a shard */;
  }

  export type ActiveGroupUpdatesResolver<
    R = IGroupUpdate | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type InteractiveAlertsResolver<
    R = IInteractiveAlert | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyGroupNotificationsResolver<
    R = IGroupNotification | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MyInventoryItemsResolver<
    R = Item | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PassiveAlertsResolver<
    R = PassiveAlert | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PatcherAlertsResolver<
    R = IPatcherAlertUpdate | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PatcherAlertsArgs>;
  export interface PatcherAlertsArgs {
    onShard?:
      | number
      | null /** Shard ID of the server you'd like to subscribe to for character updates */;
  }

  export type SecureTradeUpdatesResolver<
    R = ISecureTradeUpdate | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ServerUpdatesResolver<
    R = IServerUpdate | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardCharacterUpdatesResolver<
    R = IPatcherCharacterUpdate | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ShardCharacterUpdatesArgs>;
  export interface ShardCharacterUpdatesArgs {
    onShard?:
      | number
      | null /** Shard ID of the server you'd like to subscribe to for character updates */;
  }
}
/** CU.WebApi.GraphQL.GroupMemberUpdate */
export namespace GroupMemberUpdateResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    groupID?: GroupIdResolver<GroupID | null, any, Context>;
    memberState?: MemberStateResolver<string | null, any, Context>;
    updateType?: UpdateTypeResolver<GroupUpdateType | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupIdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberStateResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UpdateTypeResolver<
    R = GroupUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.GroupMemberRemovedUpdate */
export namespace GroupMemberRemovedUpdateResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    groupID?: GroupIdResolver<GroupID | null, any, Context>;
    updateType?: UpdateTypeResolver<GroupUpdateType | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupIdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UpdateTypeResolver<
    R = GroupUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.GroupNotification */
export namespace GroupNotificationResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    groupID?: GroupIdResolver<GroupID | null, any, Context>;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    type?: TypeResolver<GroupNotificationType | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupIdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = GroupNotificationType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MatchmakingEntered */
export namespace MatchmakingEnteredResolvers {
  export interface Resolvers<Context = any> {
    gameMode?: GameModeResolver<string | null, any, Context>;
    type?: TypeResolver<MatchmakingUpdateType | null, any, Context>;
  }

  export type GameModeResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = MatchmakingUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MatchmakingError */
export namespace MatchmakingErrorResolvers {
  export interface Resolvers<Context = any> {
    code?: CodeResolver<number | null, any, Context>;
    message?: MessageResolver<string | null, any, Context>;
    type?: TypeResolver<MatchmakingUpdateType | null, any, Context>;
  }

  export type CodeResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MessageResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = MatchmakingUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MatchmakingServerReady */
export namespace MatchmakingServerReadyResolvers {
  export interface Resolvers<Context = any> {
    host?: HostResolver<string | null, any, Context>;
    port?: PortResolver<number | null, any, Context>;
    type?: TypeResolver<MatchmakingUpdateType | null, any, Context>;
  }

  export type HostResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PortResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = MatchmakingUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.MatchmakingKickOff */
export namespace MatchmakingKickOffResolvers {
  export interface Resolvers<Context = any> {
    matchID?: MatchIdResolver<string | null, any, Context>;
    secondsToWait?: SecondsToWaitResolver<Decimal | null, any, Context>;
    serializedTeamMates?: SerializedTeamMatesResolver<
      string | null,
      any,
      Context
    >;
    type?: TypeResolver<MatchmakingUpdateType | null, any, Context>;
  }

  export type MatchIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecondsToWaitResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SerializedTeamMatesResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = MatchmakingUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.WebApi.GraphQL.Scoreboard */
export namespace ScoreboardResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    icon?: IconResolver<string | null, any, Context>;
    id?: IdResolver<ScenarioInstanceID | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    rounds?: RoundsResolver<(RoundScore | null)[] | null, any, Context>;
    roundStartTime?: RoundStartTimeResolver<Decimal | null, any, Context>;
    teams?: TeamsResolver<Faction_TeamScore | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = ScenarioInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundsResolver<
    R = (RoundScore | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoundStartTimeResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamsResolver<
    R = Faction_TeamScore | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Permissions.PermissionInfo */
export namespace PermissionInfoResolvers {
  export interface Resolvers<Context = any> {
    description?: DescriptionResolver<string | null, any, Context>;
    enables?: EnablesResolver<(string | null)[] | null, any, Context>;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
  }

  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EnablesResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.CustomRank */
export namespace CustomRankResolvers {
  export interface Resolvers<Context = any> {
    groupID?: GroupIdResolver<GroupID | null, any, Context>;
    level?: LevelResolver<number | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    permissions?: PermissionsResolver<
      (PermissionInfo | null)[] | null,
      any,
      Context
    >;
  }

  export type GroupIdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PermissionsResolver<
    R = (PermissionInfo | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.Group */
export namespace GroupResolvers {
  export interface Resolvers<Context = any> {
    created?: CreatedResolver<string | null, any, Context>;
    disbanded?: DisbandedResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    formerMembers?: FormerMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    maxRankCount?: MaxRankCountResolver<number | null, any, Context>;
    memberCount?: MemberCountResolver<number | null, any, Context>;
    members?: MembersResolver<(IGroupMember | null)[] | null, any, Context>;
    membersAsString?: MembersAsStringResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    shard?: ShardResolver<ShardID | null, any, Context>;
  }

  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisbandedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRankCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersAsStringResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Groups.Warband */
export namespace WarbandResolvers {
  export interface Resolvers<Context = any> {
    banner?: BannerResolver<string | null, any, Context>;
    created?: CreatedResolver<string | null, any, Context>;
    disbanded?: DisbandedResolver<string | null, any, Context>;
    faction?: FactionResolver<Faction | null, any, Context>;
    formerActiveMembers?: FormerActiveMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    formerMembers?: FormerMembersResolver<
      (IGroupMember | null)[] | null,
      any,
      Context
    >;
    groupType?: GroupTypeResolver<GroupTypes | null, any, Context>;
    id?: IdResolver<GroupID | null, any, Context>;
    isPermanent?: IsPermanentResolver<boolean | null, any, Context>;
    maxMemberCount?: MaxMemberCountResolver<number | null, any, Context>;
    maxRankCount?: MaxRankCountResolver<number | null, any, Context>;
    memberCount?: MemberCountResolver<number | null, any, Context>;
    members?: MembersResolver<(IGroupMember | null)[] | null, any, Context>;
    membersAsString?: MembersAsStringResolver<
      (string | null)[] | null,
      any,
      Context
    >;
    name?: NameResolver<NormalizedString | null, any, Context>;
    order?: OrderResolver<GroupID | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
  }

  export type BannerResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CreatedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisbandedResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FactionResolver<
    R = Faction | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerActiveMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FormerMembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GroupTypeResolver<
    R = GroupTypes | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IsPermanentResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxMemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MaxRankCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MemberCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersResolver<
    R = (IGroupMember | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MembersAsStringResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = NormalizedString | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OrderResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.GraphQL.Euler3fGQL */
export namespace Euler3fResolvers {
  export interface Resolvers<Context = any> {
    pitch?: PitchResolver<Decimal | null, any, Context>;
    roll?: RollResolver<Decimal | null, any, Context>;
    yaw?: YawResolver<Decimal | null, any, Context>;
  }

  export type PitchResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RollResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type YawResolver<
    R = Decimal | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.CharacterStatProgressionDBModel */
export namespace CharacterStatProgressionDBModelResolvers {
  export interface Resolvers<Context = any> {
    bonusPoints?: BonusPointsResolver<number | null, any, Context>;
    progressionPoints?: ProgressionPointsResolver<number | null, any, Context>;
  }

  export type BonusPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.AbilityComponentProgressionDBModel */
export namespace AbilityComponentProgressionDBModelResolvers {
  export interface Resolvers<Context = any> {
    level?: LevelResolver<number | null, any, Context>;
    progressionPoints?: ProgressionPointsResolver<number | null, any, Context>;
  }

  export type LevelResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ProgressionPointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenario */
export namespace TeamOutcomeScenarioResolvers {
  export interface Resolvers<Context = any> {
    outcome?: OutcomeResolver<ScenarioOutcome | null, any, Context>;
    teamID?: TeamIdResolver<ScenarioTeamID | null, any, Context>;
  }

  export type OutcomeResolver<
    R = ScenarioOutcome | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TeamIdResolver<
    R = ScenarioTeamID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.ServerUpdated */
export namespace ServerUpdatedResolvers {
  export interface Resolvers<Context = any> {
    server?: ServerResolver<ServerModel | null, any, Context>;
    type?: TypeResolver<ServerUpdateType | null, any, Context>;
  }

  export type ServerResolver<
    R = ServerModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = ServerUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.ServerUpdatedAll */
export namespace ServerUpdatedAllResolvers {
  export interface Resolvers<Context = any> {
    server?: ServerResolver<ServerModel | null, any, Context>;
    type?: TypeResolver<ServerUpdateType | null, any, Context>;
  }

  export type ServerResolver<
    R = ServerModel | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = ServerUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.ServerUnavailableAllUpdate */
export namespace ServerUnavailableAllUpdateResolvers {
  export interface Resolvers<Context = any> {
    type?: TypeResolver<ServerUpdateType | null, any, Context>;
  }

  export type TypeResolver<
    R = ServerUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.SG1Member */
export namespace SG1MemberResolvers {
  export interface Resolvers<Context = any> {
    name?: NameResolver<string | null, any, Context>;
    race?: RaceResolver<string | null, any, Context>;
    rank?: RankResolver<string | null, any, Context>;
  }

  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RankResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Goauld */
export namespace GoauldResolvers {
  export interface Resolvers<Context = any> {
    homePlanet?: HomePlanetResolver<string | null, any, Context>;
    name?: NameResolver<string | null, any, Context>;
    race?: RaceResolver<string | null, any, Context>;
  }

  export type HomePlanetResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RaceResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.GroupAlert */
export namespace GroupAlertResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<AlertCategory | null, any, Context>;
    code?: CodeResolver<InviteCode | null, any, Context>;
    forGroup?: ForGroupResolver<GroupID | null, any, Context>;
    forGroupName?: ForGroupNameResolver<string | null, any, Context>;
    fromID?: FromIdResolver<CharacterID | null, any, Context>;
    fromName?: FromNameResolver<string | null, any, Context>;
    kind?: KindResolver<GroupAlertKind | null, any, Context>;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    when?: WhenResolver<number | null, any, Context>;
  }

  export type CategoryResolver<
    R = AlertCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CodeResolver<
    R = InviteCode | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ForGroupResolver<
    R = GroupID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ForGroupNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FromIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FromNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KindResolver<
    R = GroupAlertKind | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WhenResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.TradeAlert */
export namespace TradeAlertResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<AlertCategory | null, any, Context>;
    kind?: KindResolver<TradeAlertKind | null, any, Context>;
    otherEntityID?: OtherEntityIdResolver<EntityID | null, any, Context>;
    otherName?: OtherNameResolver<string | null, any, Context>;
    secureTradeID?: SecureTradeIdResolver<
      SecureTradeInstanceID | null,
      any,
      Context
    >;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    when?: WhenResolver<number | null, any, Context>;
  }

  export type CategoryResolver<
    R = AlertCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type KindResolver<
    R = TradeAlertKind | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OtherEntityIdResolver<
    R = EntityID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OtherNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SecureTradeIdResolver<
    R = SecureTradeInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WhenResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.ProgressionAlert */
export namespace ProgressionAlertResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<AlertCategory | null, any, Context>;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    when?: WhenResolver<number | null, any, Context>;
  }

  export type CategoryResolver<
    R = AlertCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type WhenResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.SecureTradeCompletedUpdate */
export namespace SecureTradeCompletedUpdateResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<SecureTradeUpdateCategory | null, any, Context>;
    reason?: ReasonResolver<SecureTradeDoneReason | null, any, Context>;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    tradeID?: TradeIdResolver<SecureTradeInstanceID | null, any, Context>;
  }

  export type CategoryResolver<
    R = SecureTradeUpdateCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ReasonResolver<
    R = SecureTradeDoneReason | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TradeIdResolver<
    R = SecureTradeInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.SecureTradeStateUpdate */
export namespace SecureTradeStateUpdateResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<SecureTradeUpdateCategory | null, any, Context>;
    otherEntityState?: OtherEntityStateResolver<
      SecureTradeState | null,
      any,
      Context
    >;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    tradeID?: TradeIdResolver<SecureTradeInstanceID | null, any, Context>;
  }

  export type CategoryResolver<
    R = SecureTradeUpdateCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OtherEntityStateResolver<
    R = SecureTradeState | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TradeIdResolver<
    R = SecureTradeInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.GraphQL.Models.SecureTradeItemUpdate */
export namespace SecureTradeItemUpdateResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<SecureTradeUpdateCategory | null, any, Context>;
    otherEntityItems?: OtherEntityItemsResolver<
      (Item | null)[] | null,
      any,
      Context
    >;
    targetID?: TargetIdResolver<CharacterID | null, any, Context>;
    tradeID?: TradeIdResolver<SecureTradeInstanceID | null, any, Context>;
  }

  export type CategoryResolver<
    R = SecureTradeUpdateCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OtherEntityItemsResolver<
    R = (Item | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TargetIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TradeIdResolver<
    R = SecureTradeInstanceID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.CharacterUpdate */
export namespace CharacterUpdateResolvers {
  export interface Resolvers<Context = any> {
    character?: CharacterResolver<SimpleCharacter | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
    type?: TypeResolver<PatcherCharacterUpdateType | null, any, Context>;
  }

  export type CharacterResolver<
    R = SimpleCharacter | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = PatcherCharacterUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.CharacterRemovedUpdate */
export namespace CharacterRemovedUpdateResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<CharacterID | null, any, Context>;
    shard?: ShardResolver<ShardID | null, any, Context>;
    type?: TypeResolver<PatcherCharacterUpdateType | null, any, Context>;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ShardResolver<
    R = ShardID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = PatcherCharacterUpdateType | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** ServerLib.ApiModels.PatcherAlertUpdate */
export namespace PatcherAlertUpdateResolvers {
  export interface Resolvers<Context = any> {
    alert?: AlertResolver<PatcherAlert | null, any, Context>;
  }

  export type AlertResolver<
    R = PatcherAlert | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.FactionTrait */
export namespace FactionTraitResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<
      TraitCategory | null,
      any,
      Context
    > /** Category */;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** The description of this trait */;
    exclusives?: ExclusivesResolver<
      ExclusiveTraitsInfo | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
    icon?: IconResolver<
      string | null,
      any,
      Context
    > /** Url for the icon for this trait */;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<
      string | null,
      any,
      Context
    > /** The name of this trait */;
    points?: PointsResolver<
      number | null,
      any,
      Context
    > /** The point value of this trait */;
    prerequisites?: PrerequisitesResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
    ranks?: RanksResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
    required?: RequiredResolver<
      boolean | null,
      any,
      Context
    > /** Whether or not this is a required trait. */;
    specifier?: SpecifierResolver<
      string | null,
      any,
      Context
    > /** Specifies the defining type based on category */;
  }

  export type CategoryResolver<
    R = TraitCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExclusivesResolver<
    R = ExclusiveTraitsInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PrerequisitesResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RanksResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequiredResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpecifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.RaceTrait */
export namespace RaceTraitResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<
      TraitCategory | null,
      any,
      Context
    > /** Category */;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** The description of this trait */;
    exclusives?: ExclusivesResolver<
      ExclusiveTraitsInfo | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
    icon?: IconResolver<
      string | null,
      any,
      Context
    > /** Url for the icon for this trait */;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<
      string | null,
      any,
      Context
    > /** The name of this trait */;
    points?: PointsResolver<
      number | null,
      any,
      Context
    > /** The point value of this trait */;
    prerequisites?: PrerequisitesResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
    ranks?: RanksResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
    required?: RequiredResolver<
      boolean | null,
      any,
      Context
    > /** Whether or not this is a required trait. */;
    specifier?: SpecifierResolver<
      string | null,
      any,
      Context
    > /** Specifies the defining type based on category */;
  }

  export type CategoryResolver<
    R = TraitCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExclusivesResolver<
    R = ExclusiveTraitsInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PrerequisitesResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RanksResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequiredResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpecifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.ClassTrait */
export namespace ClassTraitResolvers {
  export interface Resolvers<Context = any> {
    category?: CategoryResolver<
      TraitCategory | null,
      any,
      Context
    > /** Category */;
    description?: DescriptionResolver<
      string | null,
      any,
      Context
    > /** The description of this trait */;
    exclusives?: ExclusivesResolver<
      ExclusiveTraitsInfo | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
    icon?: IconResolver<
      string | null,
      any,
      Context
    > /** Url for the icon for this trait */;
    id?: IdResolver<string | null, any, Context>;
    name?: NameResolver<
      string | null,
      any,
      Context
    > /** The name of this trait */;
    points?: PointsResolver<
      number | null,
      any,
      Context
    > /** The point value of this trait */;
    prerequisites?: PrerequisitesResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
    ranks?: RanksResolver<
      (string | null)[] | null,
      any,
      Context
    > /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
    required?: RequiredResolver<
      boolean | null,
      any,
      Context
    > /** Whether or not this is a required trait. */;
    specifier?: SpecifierResolver<
      string | null,
      any,
      Context
    > /** Specifies the defining type based on category */;
  }

  export type CategoryResolver<
    R = TraitCategory | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExclusivesResolver<
    R = ExclusiveTraitsInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IconResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PointsResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PrerequisitesResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RanksResolver<
    R = (string | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RequiredResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SpecifierResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.SecureTradeLocation */
export namespace SecureTradeLocationResolvers {
  export interface Resolvers<Context = any> {
    characterID?: CharacterIdResolver<
      CharacterID | null,
      any,
      Context
    > /** The character that currently owns this item */;
  }

  export type CharacterIdResolver<
    R = CharacterID | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.BlockDef */
export namespace BlockDefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string | null, any, Context> /** Unique block identifier */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.SiegeEngineSettingsDef */
export namespace SiegeEngineSettingsDefResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique identifier for this definition */;
  }

  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** World.WeaponConfigDef */
export namespace WeaponConfigDefResolvers {
  export interface Resolvers<Context = any> {
    ammo?: AmmoResolver<
      boolean | null,
      any,
      Context
    > /** If true, this item is some kind of ammunition */;
    id?: IdResolver<
      string | null,
      any,
      Context
    > /** Unique weapon identifier */;
  }

  export type AmmoResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace AbilityBookQuery {
  export type Variables = {
    class: string;
  };

  export type Query = {
    __typename?: "Query";
    game?: Game | null;
    myCharacter?: MyCharacter | null;
  };

  export type Game = {
    __typename?: "GameDefsGQLData";
    abilityComponents?: (AbilityComponents | null)[] | null;
  };

  export type AbilityComponents = AbilityComponent.Fragment;

  export type MyCharacter = {
    __typename?: "CUCharacter";
    progression?: Progression | null;
    abilities?: (Abilities | null)[] | null;
  };

  export type Progression = {
    __typename?: "ProgressionComponentGQLField";
    abilityComponents?: (_AbilityComponents | null)[] | null;
  };

  export type _AbilityComponents = {
    __typename?: "AbilityComponentProgressionGQLField";
    abilityComponentID?: string | null;
    level?: number | null;
    progressionPoints?: number | null;
  };

  export type Abilities = {
    __typename?: "Ability";
    id?: AbilityInstanceID | null;
    name?: string | null;
    description?: string | null;
    icon?: string | null;
    readOnly?: boolean | null;
    abilityComponents?: (__AbilityComponents | null)[] | null;
    abilityNetwork?: AbilityNetwork | null;
  };

  export type __AbilityComponents = AbilityComponent.Fragment;

  export type AbilityNetwork = {
    __typename?: "AbilityNetworkDefRef";
    id?: string | null;
    componentCategories?: (ComponentCategories | null)[] | null;
    display?: Display | null;
  };

  export type ComponentCategories = {
    __typename?: "AbilityComponentCategoryDefRef";
    id?: string | null;
    displayInfo?: DisplayInfo | null;
  };

  export type DisplayInfo = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };
}

export namespace WarbandContextQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myActiveWarband?: MyActiveWarband | null;
  };

  export type MyActiveWarband = {
    __typename?: "GraphQLActiveWarband";
    info?: Info | null;
    members?: (Members | null)[] | null;
  };

  export type Info = {
    __typename?: "ActiveWarband";
    id?: GroupID | null;
  };

  export type Members = GroupMember.Fragment;
}

export namespace WarbandNotificationSubscription {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    myGroupNotifications?: MyGroupNotifications | null;
  };

  export type MyGroupNotifications = {
    __typename?: "IGroupNotification";
    type?: GroupNotificationType | null;
    groupType?: GroupTypes | null;
    characterID?: CharacterID | null;
    groupID?: GroupID | null;
  };
}

export namespace WarbandUpdateSubscription {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    activeGroupUpdates?: ActiveGroupUpdates | null;
  };

  export type ActiveGroupUpdates = {
    __typename?:
      | GroupMemberUpdateInlineFragment["__typename"]
      | GroupMemberRemovedUpdateInlineFragment["__typename"];
    updateType?: GroupUpdateType | null;
    groupID?: GroupID | null;
  } & (
    | GroupMemberUpdateInlineFragment
    | GroupMemberRemovedUpdateInlineFragment);

  export type GroupMemberUpdateInlineFragment = {
    __typename?: "GroupMemberUpdate";
    memberState?: string | null;
  };

  export type GroupMemberRemovedUpdateInlineFragment = {
    __typename?: "GroupMemberRemovedUpdate";
    characterID?: CharacterID | null;
  };
}

export namespace AbilityTypeSelectQuery {
  export type Variables = {
    raceID: string;
    classID: string;
  };

  export type Query = {
    __typename?: "Query";
    game?: Game | null;
  };

  export type Game = {
    __typename?: "GameDefsGQLData";
    class?: Class | null;
    race?: Race | null;
  };

  export type Race = {
    __typename?: "RaceDef";
    buildableAbilityNetworks?: (BuildableAbilityNetworks | null)[] | null;
  };

  export type Class = {
    __typename?: "ClassDef";
    buildableAbilityNetworks?: (BuildableAbilityNetworks | null)[] | null;
  };

  export type BuildableAbilityNetworks = {
    __typename?: "AbilityNetworkDefRef";
    id?: string | null;
    display?: Display | null;
  };

  export type Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };
}

export namespace AbilityBuilderQuery {
  export type Variables = {
    class: string;
  };

  export type Query = {
    __typename?: "Query";
    game?: Game | null;
  };

  export type Game = {
    __typename?: "GameDefsGQLData";
    abilityNetworks?: (AbilityNetworks | null)[] | null;
    abilityComponents?: (AbilityComponents | null)[] | null;
  };

  export type AbilityNetworks = {
    __typename?: "AbilityNetworkDefRef";
    id?: string | null;
    display?: Display | null;
    componentCategories?: (ComponentCategories | null)[] | null;
  };

  export type Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type ComponentCategories = {
    __typename?: "AbilityComponentCategoryDefRef";
    id?: string | null;
    isPrimary?: boolean | null;
    isRequired?: boolean | null;
    displayOption?: AbilityComponentCategoryDisplay | null;
    displayInfo?: DisplayInfo | null;
  };

  export type DisplayInfo = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type AbilityComponents = AbilityComponent.Fragment;
}

export namespace DefenseListGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myEquippedItems?: MyEquippedItems | null;
  };

  export type MyEquippedItems = {
    __typename?: "MyEquippedItems";
    armorClass?: Decimal | null;
    resistances?: Resistances | null;
  };

  export type Resistances = DamageTypeValues.Fragment;
}

export namespace GeneralStatsGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myCharacter?: MyCharacter | null;
  };

  export type MyCharacter = {
    __typename?: "CUCharacter";
    maxHealth?: Decimal | null;
    maxBlood?: Decimal | null;
    maxStamina?: Decimal | null;
    maxPanic?: Decimal | null;
    stats?: (Stats | null)[] | null;
  };

  export type Stats = {
    __typename?: "CharacterStatField";
    stat?: Stat | null;
    value?: Decimal | null;
    description?: string | null;
  };
}

export namespace OffenseListGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myEquippedItems?: MyEquippedItems | null;
  };

  export type MyEquippedItems = {
    __typename?: "MyEquippedItems";
    items?: (Items | null)[] | null;
  };

  export type Items = {
    __typename?: "EquippedItem";
    gearSlots?: (GearSlots | null)[] | null;
    item?: Item | null;
  };

  export type GearSlots = {
    __typename?: "GearSlotDefRef";
    id?: string | null;
  };

  export type Item = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    staticDefinition?: StaticDefinition | null;
    stats?: Stats | null;
  };

  export type StaticDefinition = {
    __typename?: "ItemDefRef";
    itemType?: ItemType | null;
  };

  export type Stats = {
    __typename?: "ItemStatsDescription";
    weapon?: Weapon | null;
  };

  export type Weapon = WeaponStats.Fragment;
}

export namespace SessionGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myCharacter?: MyCharacter | null;
  };

  export type MyCharacter = {
    __typename?: "CUCharacter";
    session?: Session | null;
  };

  export type Session = {
    __typename?: "SessionStatsField";
    sessionStartDate?: string | null;
    skillPartsUsed?: (SkillPartsUsed | null)[] | null;
  };

  export type SkillPartsUsed = {
    __typename?: "SkillPartsUsedField";
    skillPart?: SkillPart | null;
    timesUsed?: number | null;
  };

  export type SkillPart = {
    __typename?: "AbilityComponentGQL";
    id?: string | null;
    icon?: string | null;
    name?: string | null;
    description?: string | null;
  };
}

export namespace TraitsInfoGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myCharacter?: MyCharacter | null;
  };

  export type MyCharacter = {
    __typename?: "CUCharacter";
    traits?: (Traits | null)[] | null;
  };

  export type Traits = {
    __typename?: "Trait";
    id?: string | null;
    name?: string | null;
    icon?: string | null;
    description?: string | null;
    points?: number | null;
  };
}

export namespace CraftingBaseQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    crafting?: Crafting | null;
  };

  export type Crafting = {
    __typename?: "CraftingRecipes";
    nearestVoxEntityID?: EntityID | null;
    blockRecipes?: (BlockRecipes | null)[] | null;
    purifyRecipes?: (PurifyRecipes | null)[] | null;
    grindRecipes?: (GrindRecipes | null)[] | null;
    shapeRecipes?: (ShapeRecipes | null)[] | null;
    makeRecipes?: (MakeRecipes | null)[] | null;
    voxJobGroupLogs?: (VoxJobGroupLogs | null)[] | null;
  };

  export type BlockRecipes = BlockRecipes.Fragment;

  export type PurifyRecipes = PurifyRecipes.Fragment;

  export type GrindRecipes = GrindRecipes.Fragment;

  export type ShapeRecipes = ShapeRecipes.Fragment;

  export type MakeRecipes = MakeRecipes.Fragment;

  export type VoxJobGroupLogs = VoxJobGroupLog.Fragment;
}

export namespace JobPanelPageQuery {
  export type Variables = {
    entityID: string;
    voxJobID: string;
  };

  export type Query = {
    __typename?: "Query";
    voxJob?: VoxJob | null;
  };

  export type VoxJob = {
    __typename?: "VoxJobStatusGQL";
    status?: Status | null;
  };

  export type Status = VoxJob.Fragment;
}

export namespace JobPanelTabQuery {
  export type Variables = {
    entityID: string;
    voxJobID: string;
  };

  export type Query = {
    __typename?: "Query";
    voxJob?: VoxJob | null;
  };

  export type VoxJob = {
    __typename?: "VoxJobStatusGQL";
    status?: Status | null;
  };

  export type Status = {
    __typename?: "VoxJobStatus";
    jobState?: VoxJobState | null;
    recipeID?: string | null;
    jobType?: VoxJobType | null;
  };
}

export namespace CraftHistoryLogCountQuery {
  export type Variables = {
    jobIdentifier: string;
    jobType: string;
  };

  export type Query = {
    __typename?: "Query";
    crafting?: Crafting | null;
  };

  export type Crafting = {
    __typename?: "CraftingRecipes";
    voxJobLogCount?: number | null;
  };
}

export namespace CraftHistoryQuery {
  export type Variables = {
    page: number;
    count: number;
    textFilter: string;
    jobIdentifier: string;
    jobType: string;
  };

  export type Query = {
    __typename?: "Query";
    crafting?: Crafting | null;
  };

  export type Crafting = {
    __typename?: "CraftingRecipes";
    voxJobLogs?: (VoxJobLogs | null)[] | null;
  };

  export type VoxJobLogs = VoxJobLog.Fragment;
}

export namespace RecipeBookNotesQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    crafting?: Crafting | null;
  };

  export type Crafting = {
    __typename?: "CraftingRecipes";
    voxNotes?: (VoxNotes | null)[] | null;
  };

  export type VoxNotes = VoxNote.Fragment;
}

export namespace VoxInventoryQuery {
  export type Variables = {
    voxEntityID: string;
  };

  export type Query = {
    __typename?: "Query";
    entityItems?: EntityItems | null;
  };

  export type EntityItems = {
    __typename?: "EntityItemResult";
    items?: (Items | null)[] | null;
  };

  export type Items = InventoryItem.Fragment;
}

export namespace VoxStatusQuery {
  export type Variables = {
    entityId: string;
  };

  export type Query = {
    __typename?: "Query";
    entityItems?: EntityItems | null;
  };

  export type EntityItems = {
    __typename?: "EntityItemResult";
    items?: (Items | null)[] | null;
  };

  export type Items = VoxItem.Fragment;
}

export namespace ContextMenuActionGQL {
  export type Variables = {
    id: string;
    shardID: number;
  };

  export type Query = {
    __typename?: "Query";
    item?: Item | null;
  };

  export type Item = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    actions?: (Actions | null)[] | null;
  };

  export type Actions = {
    __typename?: "ItemActionDefGQL";
    id?: string | null;
    lastTimePerformed?: string | null;
  };
}

export namespace PaperDollContainerGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myEquippedItems?: MyEquippedItems | null;
  };

  export type MyEquippedItems = {
    __typename?: "MyEquippedItems";
    readiedGearSlots?: (ReadiedGearSlots | null)[] | null;
    items?: (Items | null)[] | null;
  };

  export type ReadiedGearSlots = {
    __typename?: "GearSlotDefRef";
    id?: string | null;
    gearSlotType?: GearSlotType | null;
  };

  export type Items = EquippedItem.Fragment;
}

export namespace TradeWindowQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    secureTrade?: SecureTrade | null;
  };

  export type SecureTrade = {
    __typename?: "SecureTradeStatus";
    myState?: SecureTradeState | null;
    myItems?: (MyItems | null)[] | null;
    theirEntityID?: EntityID | null;
    theirState?: SecureTradeState | null;
    theirItems?: (TheirItems | null)[] | null;
  };

  export type MyItems = InventoryItem.Fragment;

  export type TheirItems = InventoryItem.Fragment;
}

export namespace TradeWindowSubscription {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    secureTradeUpdates?: SecureTradeUpdates | null;
  };

  export type SecureTradeUpdates = {
    __typename?:
      | SecureTradeCompletedUpdateInlineFragment["__typename"]
      | SecureTradeStateUpdateInlineFragment["__typename"]
      | SecureTradeItemUpdateInlineFragment["__typename"];
    category?: SecureTradeUpdateCategory | null;
    targetID?: CharacterID | null;
    tradeID?: SecureTradeInstanceID | null;
  } & (
    | SecureTradeCompletedUpdateInlineFragment
    | SecureTradeStateUpdateInlineFragment
    | SecureTradeItemUpdateInlineFragment);

  export type SecureTradeCompletedUpdateInlineFragment = {
    __typename?: "SecureTradeCompletedUpdate";
    reason?: SecureTradeDoneReason | null;
  };

  export type SecureTradeStateUpdateInlineFragment = {
    __typename?: "SecureTradeStateUpdate";
    otherEntityState?: SecureTradeState | null;
  };

  export type SecureTradeItemUpdateInlineFragment = {
    __typename?: "SecureTradeItemUpdate";
    otherEntityItems?: (OtherEntityItems | null)[] | null;
  };

  export type OtherEntityItems = InventoryItem.Fragment;
}

export namespace BattleGroupsIDQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myBattlegroup?: MyBattlegroup | null;
  };

  export type MyBattlegroup = {
    __typename?: "GraphQLBattlegroup";
    battlegroup?: Battlegroup | null;
  };

  export type Battlegroup = {
    __typename?: "Battlegroup";
    id?: GroupID | null;
  };
}

export namespace BattleGroupNotificationSubscription {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    myGroupNotifications?: MyGroupNotifications | null;
  };

  export type MyGroupNotifications = {
    __typename?: "IGroupNotification";
    type?: GroupNotificationType | null;
    groupType?: GroupTypes | null;
    characterID?: CharacterID | null;
    groupID?: GroupID | null;
  };
}

export namespace BattleGroupUpdateSubscription {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    activeGroupUpdates?: ActiveGroupUpdates | null;
  };

  export type ActiveGroupUpdates = {
    __typename?:
      | GroupMemberUpdateInlineFragment["__typename"]
      | GroupMemberRemovedUpdateInlineFragment["__typename"];
    updateType?: GroupUpdateType | null;
    groupID?: GroupID | null;
  } & (
    | GroupMemberUpdateInlineFragment
    | GroupMemberRemovedUpdateInlineFragment);

  export type GroupMemberUpdateInlineFragment = {
    __typename?: "GroupMemberUpdate";
    memberState?: string | null;
  };

  export type GroupMemberRemovedUpdateInlineFragment = {
    __typename?: "GroupMemberRemovedUpdate";
    characterID?: CharacterID | null;
  };
}

export namespace BattleGroupsListQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myBattlegroup?: MyBattlegroup | null;
  };

  export type MyBattlegroup = {
    __typename?: "GraphQLBattlegroup";
    battlegroup?: Battlegroup | null;
    members?: (Members | null)[] | null;
  };

  export type Battlegroup = {
    __typename?: "Battlegroup";
    id?: GroupID | null;
    warbands?: (GroupID | null)[] | null;
  };

  export type Members = GroupMember.Fragment;
}

export namespace BattleGroupWatchListQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myActiveWarband?: MyActiveWarband | null;
    myBattlegroup?: MyBattlegroup | null;
  };

  export type MyActiveWarband = {
    __typename?: "GraphQLActiveWarband";
    info?: Info | null;
    members?: (Members | null)[] | null;
  };

  export type Info = {
    __typename?: "ActiveWarband";
    id?: GroupID | null;
  };

  export type Members = GroupMember.Fragment;

  export type MyBattlegroup = {
    __typename?: "GraphQLBattlegroup";
    battlegroup?: Battlegroup | null;
    members?: (_Members | null)[] | null;
  };

  export type Battlegroup = {
    __typename?: "Battlegroup";
    id?: GroupID | null;
    warbands?: (GroupID | null)[] | null;
  };

  export type _Members = GroupMember.Fragment;
}

export namespace MapPoiProviderGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    world?: World | null;
  };

  export type World = {
    __typename?: "WorldData";
    map?: Map | null;
  };

  export type Map = {
    __typename?: "MapData";
    static?: (Static | null)[] | null;
    dynamic?: (Dynamic | null)[] | null;
  };

  export type Static = {
    __typename?: "MapPoint";
    zone?: ZoneInstanceID | null;
    position?: (Decimal | null)[] | null;
    tooltip?: string | null;
    src?: string | null;
  };

  export type Dynamic = {
    __typename?: "MapPoint";
    zone?: ZoneInstanceID | null;
    position?: (Decimal | null)[] | null;
    tooltip?: string | null;
    src?: string | null;
  };
}

export namespace WarbandMembersPoiQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myActiveWarband?: MyActiveWarband | null;
  };

  export type MyActiveWarband = {
    __typename?: "GraphQLActiveWarband";
    info?: Info | null;
    members?: (Members | null)[] | null;
  };

  export type Info = {
    __typename?: "ActiveWarband";
    id?: GroupID | null;
  };

  export type Members = GroupMember.Fragment;
}

export namespace FullScenarioScoreboardQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myActiveScenarioScoreboard?: MyActiveScenarioScoreboard | null;
  };

  export type MyActiveScenarioScoreboard = {
    __typename?: "MyScenarioScoreboard";
    id?: ScenarioInstanceID | null;
    name?: string | null;
    rounds?: (Rounds | null)[] | null;
    teams?: Teams | null;
  };

  export type Rounds = {
    __typename?: "RoundScore";
    active?: boolean | null;
    roundIndex?: number | null;
    winningTeamIDs?: (ScenarioTeamID | null)[] | null;
  };

  export type Teams = {
    __typename?: "Faction_TeamScore";
    tdd?: Tdd | null;
    viking?: Viking | null;
    arthurian?: Arthurian | null;
  };

  export type Tdd = {
    __typename?: "TeamScore";
    score?: number | null;
    players?: (Players | null)[] | null;
  };

  export type Players = {
    __typename?: "PlayerScore";
    name?: string | null;
    score?: number | null;
  };

  export type Viking = {
    __typename?: "TeamScore";
    score?: number | null;
    players?: (_Players | null)[] | null;
  };

  export type _Players = {
    __typename?: "PlayerScore";
    name?: string | null;
    score?: number | null;
  };

  export type Arthurian = {
    __typename?: "TeamScore";
    score?: number | null;
    players?: (__Players | null)[] | null;
  };

  export type __Players = {
    __typename?: "PlayerScore";
    name?: string | null;
    score?: number | null;
  };
}

export namespace MiniScenarioScoreboardQuery {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myActiveScenarioScoreboard?: MyActiveScenarioScoreboard | null;
  };

  export type MyActiveScenarioScoreboard = {
    __typename?: "MyScenarioScoreboard";
    id?: ScenarioInstanceID | null;
    teams?: Teams | null;
  };

  export type Teams = {
    __typename?: "Faction_TeamScore";
    tdd?: Tdd | null;
    viking?: Viking | null;
    arthurian?: Arthurian | null;
  };

  export type Tdd = {
    __typename?: "TeamScore";
    score?: number | null;
  };

  export type Viking = {
    __typename?: "TeamScore";
    score?: number | null;
  };

  export type Arthurian = {
    __typename?: "TeamScore";
    score?: number | null;
  };
}

export namespace ProgressionGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myprogression?: Myprogression | null;
  };

  export type Myprogression = {
    __typename?: "CharacterProgressionData";
    unCollectedDayLogs?: (UnCollectedDayLogs | null)[] | null;
  };

  export type UnCollectedDayLogs = {
    __typename?: "CharacterDaySummaryDBModel";
    id?: CharacterDaySummaryInstanceID | null;
    dayStart?: string | null;
    dayEnd?: string | null;
    secondsActive?: number | null;
    distanceMoved?: number | null;
    abilityComponentsUsed?: (AbilityComponentsUsed | null)[] | null;
    damage?: Damage | null;
    plots?: Plots | null;
    crafting?: Crafting | null;
    state?: States | null;
    scenarios?: (Scenarios | null)[] | null;
  };

  export type AbilityComponentsUsed = {
    __typename?: "AbilityComponentUsedSummaryDBModel";
    abilityComponentID?: string | null;
    usedInCombatCount?: number | null;
    usedNonCombatCount?: number | null;
    abilityComponentDef?: AbilityComponentDef | null;
  };

  export type AbilityComponentDef = AbilityComponentDefinition.Fragment;

  export type Damage = {
    __typename?: "DamageSummaryDBModel";
    healingApplied?: HealingApplied | null;
    healingReceived?: HealingReceived | null;
    damageApplied?: DamageApplied | null;
    killCount?: KillCount | null;
    deathCount?: DeathCount | null;
    killAssistCount?: KillAssistCount | null;
    createCount?: CreateCount | null;
  };

  export type HealingApplied = damagePerTarget.Fragment;

  export type HealingReceived = damagePerTarget.Fragment;

  export type DamageApplied = damagePerTarget.Fragment;

  export type KillCount = damagePerTarget.Fragment;

  export type DeathCount = damagePerTarget.Fragment;

  export type KillAssistCount = damagePerTarget.Fragment;

  export type CreateCount = damagePerTarget.Fragment;

  export type Plots = {
    __typename?: "PlotSummaryDBModel";
    factionPlotsCaptured?: number | null;
    scenarioPlotsCaptured?: number | null;
  };

  export type Crafting = {
    __typename?: "CraftingSummaryDBModel";
    blockSummary?: BlockSummary | null;
    grindSummary?: GrindSummary | null;
    makeSummary?: MakeSummary | null;
    purifySummary?: PurifySummary | null;
    repairSummary?: RepairSummary | null;
    salvageSummary?: SalvageSummary | null;
    shapeSummary?: ShapeSummary | null;
  };

  export type BlockSummary = craftingJobSummary.Fragment;

  export type GrindSummary = craftingJobSummary.Fragment;

  export type MakeSummary = craftingJobSummary.Fragment;

  export type PurifySummary = craftingJobSummary.Fragment;

  export type RepairSummary = craftingJobSummary.Fragment;

  export type SalvageSummary = craftingJobSummary.Fragment;

  export type ShapeSummary = craftingJobSummary.Fragment;

  export type Scenarios = {
    __typename?: "FinishedScenario";
    outcome?: ScenarioOutcome | null;
    activeAtEnd?: boolean | null;
    score?: number | null;
  };
}

export namespace RewardsViewGQL {
  export type Variables = {
    logID: string;
  };

  export type Query = {
    __typename?: "Query";
    myprogression?: Myprogression | null;
  };

  export type Myprogression = {
    __typename?: "CharacterProgressionData";
    adjustmentsByDayLogID?: (AdjustmentsByDayLogId | null)[] | null;
  };

  export type AdjustmentsByDayLogId = RewardsViewAdjustmentModel.Fragment;
}

export namespace InventoryBaseGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myInventory?: MyInventory | null;
  };

  export type MyInventory = {
    __typename?: "MyInventory";
    items?: (Items | null)[] | null;
    itemCount?: number | null;
    totalMass?: Decimal | null;
  };

  export type Items = InventoryItem.Fragment;
}

export namespace InteractiveAlertGQL {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";
    myInteractiveAlerts?: (MyInteractiveAlerts | null)[] | null;
  };

  export type MyInteractiveAlerts = {
    __typename?:
      | TradeAlertInlineFragment["__typename"]
      | GroupAlertInlineFragment["__typename"];
    category?: AlertCategory | null;
    targetID?: CharacterID | null;
  } & (TradeAlertInlineFragment | GroupAlertInlineFragment);

  export type TradeAlertInlineFragment = {
    __typename?: "TradeAlert";
    otherEntityID?: EntityID | null;
    otherName?: string | null;
    kind?: TradeAlertKind | null;
  };

  export type GroupAlertInlineFragment = {
    __typename?: "GroupAlert";
    kind?: GroupAlertKind | null;
    fromName?: string | null;
    fromID?: CharacterID | null;
    forGroup?: GroupID | null;
    forGroupName?: string | null;
    code?: InviteCode | null;
  };
}

export namespace InteractiveAlertSubscriptionGQL {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";
    interactiveAlerts?: InteractiveAlerts | null;
  };

  export type InteractiveAlerts = {
    __typename?:
      | TradeAlertInlineFragment["__typename"]
      | GroupAlertInlineFragment["__typename"];
    category?: AlertCategory | null;
    targetID?: CharacterID | null;
  } & (TradeAlertInlineFragment | GroupAlertInlineFragment);

  export type TradeAlertInlineFragment = {
    __typename?: "TradeAlert";
    targetID?: CharacterID | null;
    secureTradeID?: SecureTradeInstanceID | null;
    otherEntityID?: EntityID | null;
    otherName?: string | null;
    kind?: TradeAlertKind | null;
  };

  export type GroupAlertInlineFragment = {
    __typename?: "GroupAlert";
    kind?: GroupAlertKind | null;
    fromName?: string | null;
    fromID?: CharacterID | null;
    forGroup?: GroupID | null;
    forGroupName?: string | null;
    code?: InviteCode | null;
  };
}

export namespace AbilityComponent {
  export type Fragment = {
    __typename?: "AbilityComponentDefRef";
    id?: string | null;
    display?: Display | null;
    abilityComponentCategory?: AbilityComponentCategory | null;
    progression?: Progression | null;
    abilityTags?: (string | null)[] | null;
    networkRequirements?: (NetworkRequirements | null)[] | null;
  };

  export type Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
    description?: string | null;
    iconURL?: string | null;
  };

  export type AbilityComponentCategory = {
    __typename?: "AbilityComponentCategoryDefRef";
    id?: string | null;
    displayInfo?: DisplayInfo | null;
  };

  export type DisplayInfo = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
    description?: string | null;
    iconURL?: string | null;
  };

  export type Progression = {
    __typename?: "AbilityComponentProgressionDef";
    levels?: Levels | null;
  };

  export type Levels = {
    __typename?: "AbilityComponentLevelTableDefRef";
    id?: string | null;
    levels?: (_Levels | null)[] | null;
  };

  export type _Levels = {
    __typename?: "Level";
    levelNumber?: number | null;
    progressionForLevel?: number | null;
  };

  export type NetworkRequirements = {
    __typename?: "AbilityNetworkRequirementGQL";
    requireTag?: RequireTag | null;
    excludeTag?: ExcludeTag | null;
    requireComponent?: RequireComponent | null;
    excludeComponent?: ExcludeComponent | null;
  };

  export type RequireTag = {
    __typename?: "RequireTagDef";
    tag?: string | null;
  };

  export type ExcludeTag = {
    __typename?: "ExcludeTagDef";
    tag?: string | null;
  };

  export type RequireComponent = {
    __typename?: "RequireAbilityComponentDef";
    component?: Component | null;
  };

  export type Component = {
    __typename?: "AbilityComponentDefRef";
    id?: string | null;
    display?: _Display | null;
    abilityComponentCategory?: _AbilityComponentCategory | null;
  };

  export type _Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type _AbilityComponentCategory = {
    __typename?: "AbilityComponentCategoryDefRef";
    displayInfo?: _DisplayInfo | null;
  };

  export type _DisplayInfo = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type ExcludeComponent = {
    __typename?: "ExcludeAbilityComponentDef";
    component?: _Component | null;
  };

  export type _Component = {
    __typename?: "AbilityComponentDefRef";
    id?: string | null;
    display?: __Display | null;
    abilityComponentCategory?: __AbilityComponentCategory | null;
  };

  export type __Display = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };

  export type __AbilityComponentCategory = {
    __typename?: "AbilityComponentCategoryDefRef";
    displayInfo?: __DisplayInfo | null;
  };

  export type __DisplayInfo = {
    __typename?: "DisplayInfoDef";
    name?: string | null;
  };
}

export namespace AlloyStats {
  export type Fragment = {
    __typename?: "AlloyStat_Single";
    unitHealth?: Decimal | null;
    unitMass?: Decimal | null;
    massBonus?: Decimal | null;
    encumbranceBonus?: Decimal | null;
    maxRepairPointsBonus?: Decimal | null;
    maxHealthBonus?: Decimal | null;
    healthLossPerUseBonus?: Decimal | null;
    weightBonus?: Decimal | null;
    strengthRequirementBonus?: Decimal | null;
    dexterityRequirementBonus?: Decimal | null;
    vitalityRequirementBonus?: Decimal | null;
    enduranceRequirementBonus?: Decimal | null;
    attunementRequirementBonus?: Decimal | null;
    willRequirementBonus?: Decimal | null;
    faithRequirementBonus?: Decimal | null;
    resonanceRequirementBonus?: Decimal | null;
    fractureThresholdBonus?: Decimal | null;
    fractureChanceBonus?: Decimal | null;
    densityBonus?: Decimal | null;
    malleabilityBonus?: Decimal | null;
    meltingPointBonus?: Decimal | null;
    hardnessBonus?: Decimal | null;
    fractureBonus?: Decimal | null;
    armorClassBonus?: Decimal | null;
    resistSlashingBonus?: Decimal | null;
    resistPiercingBonus?: Decimal | null;
    resistCrushingBonus?: Decimal | null;
    resistAcidBonus?: Decimal | null;
    resistPoisonBonus?: Decimal | null;
    resistDiseaseBonus?: Decimal | null;
    resistEarthBonus?: Decimal | null;
    resistWaterBonus?: Decimal | null;
    resistFireBonus?: Decimal | null;
    resistAirBonus?: Decimal | null;
    resistLightningBonus?: Decimal | null;
    resistFrostBonus?: Decimal | null;
    resistLifeBonus?: Decimal | null;
    resistMindBonus?: Decimal | null;
    resistSpiritBonus?: Decimal | null;
    resistRadiantBonus?: Decimal | null;
    resistDeathBonus?: Decimal | null;
    resistShadowBonus?: Decimal | null;
    resistChaosBonus?: Decimal | null;
    resistVoidBonus?: Decimal | null;
    resistArcaneBonus?: Decimal | null;
    mitigateBonus?: Decimal | null;
    piercingDamageBonus?: Decimal | null;
    piercingArmorPenetrationBonus?: Decimal | null;
    falloffMinDistanceBonus?: Decimal | null;
    falloffReductionBonus?: Decimal | null;
    slashingDamageBonus?: Decimal | null;
    slashingBleedBonus?: Decimal | null;
    slashingArmorPenetrationBonus?: Decimal | null;
    crushingDamageBonus?: Decimal | null;
    fallbackCrushingDamageBonus?: Decimal | null;
    distruptionBonus?: Decimal | null;
    stabilityBonus?: Decimal | null;
    deflectionAmountBonus?: Decimal | null;
    deflectionRecoveryBonus?: Decimal | null;
    knockbackAmountBonus?: Decimal | null;
    staminaCostBonus?: Decimal | null;
    physicalPreparationTimeBonus?: Decimal | null;
    physicalRecoveryTimeBonus?: Decimal | null;
  };
}

export namespace BasicItemStats {
  export type Fragment = {
    __typename?: "ItemStat_Single";
    quality?: Decimal | null;
    selfMass?: Decimal | null;
    totalMass?: Decimal | null;
    encumbrance?: Decimal | null;
    agilityRequirement?: Decimal | null;
    dexterityRequirement?: Decimal | null;
    strengthRequirement?: Decimal | null;
    vitalityRequirement?: Decimal | null;
    enduranceRequirement?: Decimal | null;
    attunementRequirement?: Decimal | null;
    willRequirement?: Decimal | null;
    faithRequirement?: Decimal | null;
    resonanceRequirement?: Decimal | null;
    unitCount?: Decimal | null;
  };
}

export namespace BuildingBlockStats {
  export type Fragment = {
    __typename?: "BuildingBlockStat_Single";
    compressiveStrength?: Decimal | null;
    shearStrength?: Decimal | null;
    tensileStrength?: Decimal | null;
    density?: Decimal | null;
    healthUnits?: Decimal | null;
    buildTimeUnits?: Decimal | null;
    unitMass?: Decimal | null;
  };
}

export namespace ContainedItems {
  export type Fragment = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    givenName?: string | null;
    stackHash?: ItemStackHash | null;
    containerColor?: ContainerColor | null;
    location?: Location | null;
    actions?: (Actions | null)[] | null;
    stats?: Stats | null;
    equiprequirement?: Equiprequirement | null;
    staticDefinition?: StaticDefinition | null;
    permissibleHolder?: PermissibleHolder | null;
    containerDrawers?: (ContainerDrawers | null)[] | null;
  };

  export type ContainerColor = ContainerColor.Fragment;

  export type Location = ItemLocation.Fragment;

  export type Actions = ItemActions.Fragment;

  export type Stats = ItemStats.Fragment;

  export type Equiprequirement = EquipRequirement.Fragment;

  export type StaticDefinition = ItemDefRef.Fragment;

  export type PermissibleHolder = PermissibleHolder.Fragment;

  export type ContainerDrawers = {
    __typename?: "ContainerDrawerGQL";
    id?: ContainerDrawerID | null;
    requirements?: Requirements | null;
    stats?: _Stats | null;
    containedItems?: (ContainedItems | null)[] | null;
  };

  export type Requirements = Requirements.Fragment;

  export type _Stats = ContainerStats.Fragment;

  export type ContainedItems = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    givenName?: string | null;
    stackHash?: ItemStackHash | null;
    containerColor?: _ContainerColor | null;
    actions?: (_Actions | null)[] | null;
    location?: _Location | null;
    stats?: __Stats | null;
    equiprequirement?: _Equiprequirement | null;
    staticDefinition?: _StaticDefinition | null;
    permissibleHolder?: _PermissibleHolder | null;
  };

  export type _ContainerColor = ContainerColor.Fragment;

  export type _Actions = ItemActions.Fragment;

  export type _Location = ItemLocation.Fragment;

  export type __Stats = ItemStats.Fragment;

  export type _Equiprequirement = EquipRequirement.Fragment;

  export type _StaticDefinition = ItemDefRef.Fragment;

  export type _PermissibleHolder = PermissibleHolder.Fragment;
}

export namespace ContainerColor {
  export type Fragment = {
    __typename?: "ColorRGBA";
    r?: number | null;
    g?: number | null;
    b?: number | null;
    a?: Decimal | null;
    rgba?: string | null;
    hex?: string | null;
    hexa?: string | null;
  };
}

export namespace ContainerDrawers {
  export type Fragment = {
    __typename?: "ContainerDrawerGQL";
    id?: ContainerDrawerID | null;
    requirements?: Requirements | null;
    containedItems?: (ContainedItems | null)[] | null;
    stats?: Stats | null;
  };

  export type Requirements = Requirements.Fragment;

  export type ContainedItems = ContainedItems.Fragment;

  export type Stats = ContainerStats.Fragment;
}

export namespace ContainerStats {
  export type Fragment = {
    __typename?: "ContainerDefStat_Single";
    maxItemCount?: Decimal | null;
    maxItemMass?: Decimal | null;
  };
}

export namespace DamageTypeValues {
  export type Fragment = {
    __typename?: "DamageType_Single";
    slashing?: Decimal | null;
    piercing?: Decimal | null;
    crushing?: Decimal | null;
    physical?: Decimal | null;
    acid?: Decimal | null;
    poison?: Decimal | null;
    disease?: Decimal | null;
    earth?: Decimal | null;
    water?: Decimal | null;
    fire?: Decimal | null;
    air?: Decimal | null;
    lightning?: Decimal | null;
    frost?: Decimal | null;
    elemental?: Decimal | null;
    life?: Decimal | null;
    mind?: Decimal | null;
    spirit?: Decimal | null;
    radiant?: Decimal | null;
    light?: Decimal | null;
    death?: Decimal | null;
    shadow?: Decimal | null;
    chaos?: Decimal | null;
    void?: Decimal | null;
    dark?: Decimal | null;
    arcane?: Decimal | null;
  };
}

export namespace DurabilityStats {
  export type Fragment = {
    __typename?: "DurabilityStat_Single";
    maxRepairPoints?: Decimal | null;
    maxHealth?: Decimal | null;
    fractureThreshold?: Decimal | null;
    fractureChance?: Decimal | null;
    currentRepairPoints?: Decimal | null;
    currentHealth?: Decimal | null;
    healthLossPerUse?: Decimal | null;
  };
}

export namespace EquippedItem {
  export type Fragment = {
    __typename?: "EquippedItem";
    gearSlots?: (GearSlots | null)[] | null;
    item?: Item | null;
  };

  export type GearSlots = GearSlotDefRef.Fragment;

  export type Item = InventoryItem.Fragment;
}

export namespace EquipRequirement {
  export type Fragment = {
    __typename?: "ItemEquipRequirement";
    status?: EquipRequirementStatus | null;
    requirementDescription?: string | null;
    errorDescription?: string | null;
  };
}

export namespace GearSlotDefRef {
  export type Fragment = {
    __typename?: "GearSlotDefRef";
    id?: string | null;
  };
}

export namespace GroupMember {
  export type Fragment = {
    __typename?: "GroupMemberState";
    entityID?: string | null;
    type?: string | null;
    warbandID?: string | null;
    characterID?: string | null;
    faction?: Faction | null;
    name?: string | null;
    isAlive?: boolean | null;
    race?: Race | null;
    gender?: Gender | null;
    classID?: Archetype | null;
    statuses?: (Statuses | null)[] | null;
    health?: (Health | null)[] | null;
    stamina?: Stamina | null;
    blood?: Blood | null;
    position?: Position | null;
    isLeader?: boolean | null;
    canKick?: boolean | null;
    rankLevel?: number | null;
  };

  export type Statuses = {
    __typename?: "StatusEffect";
    id?: string | null;
    iconURL?: string | null;
    description?: string | null;
    name?: string | null;
  };

  export type Health = {
    __typename?: "Health";
    current?: Decimal | null;
    max?: Decimal | null;
    wounds?: number | null;
  };

  export type Stamina = {
    __typename?: "CurrentMax";
    current?: Decimal | null;
    max?: Decimal | null;
  };

  export type Blood = {
    __typename?: "CurrentMax";
    current?: Decimal | null;
    max?: Decimal | null;
  };

  export type Position = {
    __typename?: "Vec3f";
    x?: Decimal | null;
    y?: Decimal | null;
    z?: Decimal | null;
  };
}

export namespace InventoryItem {
  export type Fragment = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    givenName?: string | null;
    stackHash?: ItemStackHash | null;
    hasSubItems?: boolean | null;
    containerColor?: ContainerColor | null;
    location?: Location | null;
    actions?: (Actions | null)[] | null;
    stats?: Stats | null;
    equiprequirement?: Equiprequirement | null;
    staticDefinition?: StaticDefinition | null;
    containerDrawers?: (ContainerDrawers | null)[] | null;
    permissibleHolder?: PermissibleHolder | null;
  };

  export type ContainerColor = ContainerColor.Fragment;

  export type Location = ItemLocation.Fragment;

  export type Actions = ItemActions.Fragment;

  export type Stats = ItemStats.Fragment;

  export type Equiprequirement = EquipRequirement.Fragment;

  export type StaticDefinition = ItemDefRef.Fragment;

  export type ContainerDrawers = ContainerDrawers.Fragment;

  export type PermissibleHolder = PermissibleHolder.Fragment;
}

export namespace ItemActions {
  export type Fragment = {
    __typename?: "ItemActionDefGQL";
    id?: string | null;
    name?: string | null;
    cooldownSeconds?: Decimal | null;
    enabled?: boolean | null;
    lastTimePerformed?: string | null;
    uIReaction?: ItemActionUIReaction | null;
    showWhenDisabled?: boolean | null;
  };
}

export namespace ItemDefRef {
  export type Fragment = {
    __typename?: "ItemDefRef";
    id?: string | null;
    description?: string | null;
    name?: string | null;
    iconUrl?: string | null;
    itemType?: ItemType | null;
    defaultResourceID?: string | null;
    numericItemDefID?: number | null;
    isStackableItem?: boolean | null;
    tags?: (string | null)[] | null;
    deploySettings?: DeploySettings | null;
    gearSlotSets?: (GearSlotSets | null)[] | null;
    substanceDefinition?: SubstanceDefinition | null;
    alloyDefinition?: AlloyDefinition | null;
    isVox?: boolean | null;
  };

  export type DeploySettings = {
    __typename?: "DeploySettingsDefRef";
    resourceID?: string | null;
    isDoor?: boolean | null;
    snapToGround?: boolean | null;
    rotateYaw?: boolean | null;
    rotatePitch?: boolean | null;
    rotateRoll?: boolean | null;
  };

  export type GearSlotSets = {
    __typename?: "GearSlotSet";
    gearSlots?: (GearSlots | null)[] | null;
  };

  export type GearSlots = GearSlotDefRef.Fragment;

  export type SubstanceDefinition = {
    __typename?: "SubstanceDefRef";
    id?: string | null;
    type?: string | null;
    minQuality?: Decimal | null;
    maxQuality?: Decimal | null;
  };

  export type AlloyDefinition = {
    __typename?: "AlloyDefRef";
    id?: string | null;
    type?: string | null;
    subType?: string | null;
  };
}

export namespace ItemLocation {
  export type Fragment = {
    __typename?: "ItemLocationDescription";
    inContainer?: InContainer | null;
    inventory?: Inventory | null;
    equipped?: Equipped | null;
    inVox?: InVox | null;
  };

  export type InContainer = {
    __typename?: "InContainerLocation";
    position?: number | null;
  };

  export type Inventory = {
    __typename?: "InventoryLocation";
    position?: number | null;
  };

  export type Equipped = {
    __typename?: "EquippedLocation";
    gearSlots?: (GearSlots | null)[] | null;
  };

  export type GearSlots = {
    __typename?: "GearSlotDefRef";
    id?: string | null;
  };

  export type InVox = {
    __typename?: "InVoxJobLocation";
    voxInstanceID?: ItemInstanceID | null;
    voxJobInstanceID?: VoxJobInstanceID | null;
    itemSlot?: SubItemSlot | null;
  };
}

export namespace ItemStats {
  export type Fragment = {
    __typename?: "ItemStatsDescription";
    item?: Item | null;
    alloy?: Alloy | null;
    substance?: Substance | null;
    weapon?: Weapon | null;
    armor?: Armor | null;
    durability?: Durability | null;
    block?: Block | null;
    resistances?: Resistances | null;
  };

  export type Item = BasicItemStats.Fragment;

  export type Alloy = AlloyStats.Fragment;

  export type Substance = SubstanceStats.Fragment;

  export type Weapon = WeaponStats.Fragment;

  export type Armor = {
    __typename?: "ArmorStat_Single";
    armorClass?: Decimal | null;
  };

  export type Durability = DurabilityStats.Fragment;

  export type Block = BuildingBlockStats.Fragment;

  export type Resistances = DamageTypeValues.Fragment;
}

export namespace MyCharacter {
  export type Fragment = {
    __typename?: "CUCharacter";
    id?: CharacterID | null;
    name?: NormalizedString | null;
    faction?: Faction | null;
    race?: Race | null;
    gender?: Gender | null;
    archetype?: Archetype | null;
  };
}

export namespace PermissibleHolder {
  export type Fragment = {
    __typename?: "FlagsPermissibleHolderGQL";
    userPermissions?: number | null;
    userGrants?: (UserGrants | null)[] | null;
    permissibleSets?: (PermissibleSets | null)[] | null;
  };

  export type UserGrants = {
    __typename?: "FlagsPermissibleGrantGQL";
    permissions?: number | null;
    target?: Target | null;
  };

  export type Target = {
    __typename?: "PermissibleTargetGQL";
    targetType?: PermissibleTargetType | null;
    description?: string | null;
  };

  export type PermissibleSets = {
    __typename?: "FlagsPermissibleSetGQL";
    keyType?: PermissibleSetKeyType | null;
    isActive?: boolean | null;
    permissibles?: (Permissibles | null)[] | null;
  };

  export type Permissibles = {
    __typename?: "FlagsPermissibleGQL";
    permissions?: number | null;
    target?: _Target | null;
  };

  export type _Target = {
    __typename?: "PermissibleTargetGQL";
    targetType?: PermissibleTargetType | null;
    description?: string | null;
  };
}

export namespace Requirements {
  export type Fragment = {
    __typename?: "RequirementDef";
    description?: string | null;
    icon?: string | null;
  };
}

export namespace SecureTrade {
  export type Fragment = {
    __typename?: "SecureTradeStatus";
    myState?: SecureTradeState | null;
    myItems?: (MyItems | null)[] | null;
    theirEntityID?: EntityID | null;
    theirState?: SecureTradeState | null;
    theirItems?: (TheirItems | null)[] | null;
  };

  export type MyItems = InventoryItem.Fragment;

  export type TheirItems = InventoryItem.Fragment;
}

export namespace SubstanceStats {
  export type Fragment = {
    __typename?: "SubstanceStat_Single";
    unitHealth?: Decimal | null;
    magicalResistance?: Decimal | null;
    meltingPoint?: Decimal | null;
    massFactor?: Decimal | null;
    hardnessFactor?: Decimal | null;
    elasticity?: Decimal | null;
    fractureChance?: Decimal | null;
    unitMass?: Decimal | null;
  };
}

export namespace WeaponStats {
  export type Fragment = {
    __typename?: "WeaponStat_Single";
    piercingDamage?: Decimal | null;
    piercingBleed?: Decimal | null;
    piercingArmorPenetration?: Decimal | null;
    slashingDamage?: Decimal | null;
    slashingBleed?: Decimal | null;
    slashingArmorPenetration?: Decimal | null;
    crushingDamage?: Decimal | null;
    fallbackCrushingDamage?: Decimal | null;
    magicPower?: Decimal | null;
    disruption?: Decimal | null;
    deflectionAmount?: Decimal | null;
    physicalProjectileSpeed?: Decimal | null;
    knockbackAmount?: Decimal | null;
    stability?: Decimal | null;
    falloffMinDistance?: Decimal | null;
    falloffMaxDistance?: Decimal | null;
    falloffReduction?: Decimal | null;
    deflectionRecovery?: Decimal | null;
    staminaCost?: Decimal | null;
    physicalPreparationTime?: Decimal | null;
    physicalRecoveryTime?: Decimal | null;
    range?: Decimal | null;
  };
}

export namespace craftingJobSummary {
  export type Fragment = {
    __typename?: "JobSummaryDBModel";
    started?: number | null;
    canceled?: number | null;
    collected?: number | null;
  };
}

export namespace damagePerTarget {
  export type Fragment = {
    __typename?: "CountPerTargetTypeDBModel";
    self?: number | null;
    playerCharacter?: number | null;
    nonPlayerCharacter?: number | null;
    building?: number | null;
    item?: number | null;
    resourceNode?: number | null;
  };
}

export namespace AbilityComponentDefinition {
  export type Fragment = {
    __typename?: "AbilityComponentGQL";
    icon?: string | null;
    id?: string | null;
    name?: string | null;
  };
}

export namespace RewardsViewItemDefinition {
  export type Fragment = {
    __typename?: "ItemDefRef";
    id?: string | null;
    numericItemDefID?: number | null;
    defaultResourceID?: string | null;
    iconUrl?: string | null;
    name?: string | null;
    description?: string | null;
    tags?: (string | null)[] | null;
    itemType?: ItemType | null;
  };
}

export namespace RewardsViewAbilityComponentDefinition {
  export type Fragment = {
    __typename?: "AbilityComponentGQL";
    icon?: string | null;
    id?: string | null;
    name?: string | null;
  };
}

export namespace RewardsViewAbilityComponentLevelReason {
  export type Fragment = {
    __typename?: "CharacterAdjustmentReasonAbilityComponentLevel";
    abilityComponentID?: string | null;
    abilityComponentLevel?: number | null;
    abilityComponentDef?: AbilityComponentDef | null;
  };

  export type AbilityComponentDef = RewardsViewAbilityComponentDefinition.Fragment;
}

export namespace RewardsViewUseAbilityComponentReason {
  export type Fragment = {
    __typename?: "CharacterAdjustmentReasonUseAbilityComponent";
    abilityComponentID?: string | null;
    inCombatCount?: number | null;
    nonCombatCount?: number | null;
    abilityComponentDef?: AbilityComponentDef | null;
  };

  export type AbilityComponentDef = RewardsViewAbilityComponentDefinition.Fragment;
}

export namespace RewardsViewUseAbilitiesReason {
  export type Fragment = {
    __typename?: "CharacterAdjustmentReasonUseAbilities";
    inCombatCount?: number | null;
    nonCombatCount?: number | null;
  };
}

export namespace RewardsViewAddItemAdjustment {
  export type Fragment = {
    __typename?: "CharacterAdjustmentAddItem";
    itemInstanceIDS?: (ItemInstanceID | null)[] | null;
    staticDefinitionID?: string | null;
    unitCount?: number | null;
    quality?: ItemQuality | null;
    itemDef?: ItemDef | null;
  };

  export type ItemDef = RewardsViewItemDefinition.Fragment;
}

export namespace RewardsViewPlayerStatAdjustment {
  export type Fragment = {
    __typename?: "CharacterAdjustmentPlayerStat";
    stat?: Stat | null;
    previousBonus?: number | null;
    newBonus?: number | null;
    previousProgressionPoints?: number | null;
    newProgressionPoints?: number | null;
  };
}

export namespace RewardsViewAbilityComponentAdjustment {
  export type Fragment = {
    __typename?: "CharacterAdjustmentAbilityComponentProgress";
    abilityComponentID?: string | null;
    previousLevel?: number | null;
    previousProgressionPoints?: number | null;
    newLevel?: number | null;
    newProgressPoints?: number | null;
    abilityComponentDef?: AbilityComponentDef | null;
  };

  export type AbilityComponentDef = RewardsViewAbilityComponentDefinition.Fragment;
}

export namespace RewardsViewApplyStatusAdjustment {
  export type Fragment = {
    __typename?: "CharacterAdjustmentApplyStatus";
    statusID?: string | null;
  };
}

export namespace RewardsViewAdjustmentModel {
  export type Fragment = {
    __typename?: "CharacterAdjustmentDBModel";
    reason?: Reason | null;
    adjustment?: Adjustment | null;
  };

  export type Reason = {
    __typename?: "CharacterAdjustmentReasonGQLField";
    abilityComponentLevel?: AbilityComponentLevel | null;
    useAbilityComponent?: UseAbilityComponent | null;
    useAbilities?: UseAbilities | null;
  };

  export type AbilityComponentLevel = RewardsViewAbilityComponentLevelReason.Fragment;

  export type UseAbilityComponent = RewardsViewUseAbilityComponentReason.Fragment;

  export type UseAbilities = RewardsViewUseAbilitiesReason.Fragment;

  export type Adjustment = {
    __typename?: "CharacterAdjustmentGQLField";
    addItem?: AddItem | null;
    playerStat?: PlayerStat | null;
    abilityComponent?: AbilityComponent | null;
    applyStatus?: ApplyStatus | null;
  };

  export type AddItem = RewardsViewAddItemAdjustment.Fragment;

  export type PlayerStat = RewardsViewPlayerStatAdjustment.Fragment;

  export type AbilityComponent = RewardsViewAbilityComponentAdjustment.Fragment;

  export type ApplyStatus = RewardsViewApplyStatusAdjustment.Fragment;
}

export namespace BlockRecipes {
  export type Fragment = {
    __typename?: "BlockRecipeDefRef";
    id?: string | null;
    outputItem?: OutputItem | null;
    ingredients?: (Ingredients | null)[] | null;
  };

  export type OutputItem = ItemDefRef.Fragment;

  export type Ingredients = {
    __typename?: "RecipeIngredientDef";
    minUnitCount?: number | null;
    maxUnitCount?: number | null;
    minQuality?: Decimal | null;
    maxQuality?: Decimal | null;
    ingredient?: Ingredient | null;
    requirement?: Requirement | null;
  };

  export type Ingredient = ItemDefRef.Fragment;

  export type Requirement = Requirement.Fragment;
}

export namespace GrindRecipes {
  export type Fragment = {
    __typename?: "GrindRecipeDefRef";
    id?: string | null;
    outputItem?: OutputItem | null;
    ingredientItem?: IngredientItem | null;
  };

  export type OutputItem = ItemDefRef.Fragment;

  export type IngredientItem = ItemDefRef.Fragment;
}

export namespace MakeRecipes {
  export type Fragment = {
    __typename?: "MakeRecipeDefRef";
    id?: string | null;
    outputItem?: OutputItem | null;
    ingredients?: (Ingredients | null)[] | null;
  };

  export type OutputItem = ItemDefRef.Fragment;

  export type Ingredients = {
    __typename?: "MakeIngredientDef";
    slot?: SubItemSlot | null;
    minQuality?: Decimal | null;
    maxQuality?: Decimal | null;
    unitCount?: number | null;
    ingredient?: Ingredient | null;
    requirement?: Requirement | null;
  };

  export type Ingredient = ItemDefRef.Fragment;

  export type Requirement = Requirement.Fragment;
}

export namespace PurifyRecipes {
  export type Fragment = {
    __typename?: "PurifyRecipeDefRef";
    id?: string | null;
    outputItem?: OutputItem | null;
    ingredientItem?: IngredientItem | null;
  };

  export type OutputItem = ItemDefRef.Fragment;

  export type IngredientItem = ItemDefRef.Fragment;
}

export namespace Requirement {
  export type Fragment = {
    __typename?: "ItemRequirementByStringIDDefRef";
    description?: string | null;
    iconURL?: string | null;
    errorDescription?: string | null;
    condition?: string | null;
  };
}

export namespace ShapeRecipes {
  export type Fragment = {
    __typename?: "ShapeRecipeDefRef";
    id?: string | null;
    outputItem?: OutputItem | null;
    ingredients?: (Ingredients | null)[] | null;
  };

  export type OutputItem = ItemDefRef.Fragment;

  export type Ingredients = {
    __typename?: "RecipeIngredientDef";
    ingredient?: Ingredient | null;
    requirement?: Requirement | null;
    minUnitCount?: number | null;
    maxUnitCount?: number | null;
    minQuality?: Decimal | null;
    maxQuality?: Decimal | null;
  };

  export type Ingredient = ItemDefRef.Fragment;

  export type Requirement = Requirement.Fragment;
}

export namespace VoxItem {
  export type Fragment = {
    __typename?: "Item";
    id?: ItemInstanceID | null;
    voxStatus?: VoxStatus | null;
  };

  export type VoxStatus = {
    __typename?: "VoxStatus";
    jobs?: (Jobs | null)[] | null;
  };

  export type Jobs = {
    __typename?: "VoxJobStatus";
    id?: VoxJobInstanceID | null;
  };
}

export namespace VoxJob {
  export type Fragment = {
    __typename?: "VoxJobStatus";
    id?: VoxJobInstanceID | null;
    jobType?: VoxJobType | null;
    jobState?: VoxJobState | null;
    voxHealthCost?: number | null;
    totalCraftingTime?: Decimal | null;
    timeRemaining?: Decimal | null;
    givenName?: string | null;
    itemCount?: number | null;
    recipeID?: string | null;
    endQuality?: Decimal | null;
    usedRepairPoints?: number | null;
    startTime?: string | null;
    possibleItemSlots?: (SubItemSlot | null)[] | null;
    outputItems?: (OutputItems | null)[] | null;
    ingredients?: (Ingredients | null)[] | null;
  };

  export type OutputItems = {
    __typename?: "VoxJobOutputItem";
    outputItemType?: VoxJobOutputItemType | null;
    item?: Item | null;
  };

  export type Item = InventoryItem.Fragment;

  export type Ingredients = InventoryItem.Fragment;
}

export namespace VoxJobGroupLog {
  export type Fragment = {
    __typename?: "VoxJobGroupLogDBModel";
    lastCrafted?: string | null;
    favorite?: boolean | null;
    timesCrafted?: number | null;
    jobType?: VoxJobType | null;
    jobIdentifier?: string | null;
    notes?: string | null;
  };
}

export namespace VoxJobLog {
  export type Fragment = {
    __typename?: "VoxJobLogDBModel";
    id?: VoxJobInstanceID | null;
    jobIdentifier?: string | null;
    dateStarted?: string | null;
    dateEnded?: string | null;
    favorite?: boolean | null;
    itemHash?: ItemStackHash | null;
    outputItems?: (OutputItems | null)[] | null;
    voxHealthCost?: number | null;
    notes?: string | null;
    inputItems?: (InputItems | null)[] | null;
  };

  export type OutputItems = {
    __typename?: "OutputItem";
    outputItemType?: VoxJobOutputItemType | null;
    item?: Item | null;
  };

  export type Item = InventoryItem.Fragment;

  export type InputItems = InventoryItem.Fragment;
}

export namespace VoxNote {
  export type Fragment = {
    __typename?: "VoxNotesDBModel";
    id?: VoxNotesInstanceID | null;
    lastEdited?: string | null;
    created?: string | null;
    characterID?: CharacterID | null;
    notes?: string | null;
  };
}
