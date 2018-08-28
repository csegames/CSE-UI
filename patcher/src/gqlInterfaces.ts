/* tslint:disable */

/** ShardID */
export type ShardID = any;

/** The `Date` scalar type represents a timestamp provided in UTC. `Date` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any;

export type Decimal = any;

/** CU.Groups.InviteCode */
export type InviteCode = any;

/** CU.Groups.TargetID */
export type TargetID = any;

/** CU.Groups.GroupID */
export type GroupID = any;

/** CU.CharacterID */
export type CharacterID = any;

/** CU.Skills.SkillID */
export type SkillID = any;

/** CSE.EntityID */
export type EntityID = any;

/** CU.ScenarioInstanceID */
export type ScenarioInstanceID = any;

/** CU.RoundInstanceID */
export type RoundInstanceID = any;

/** CU.ScenarioTeamID */
export type ScenarioTeamID = any;

/** CU.RoleID */
export type RoleID = any;

/** ItemInstanceID */
export type ItemInstanceID = any;

/** CU.ItemStackHash */
export type ItemStackHash = any;

/** CU.Databases.Models.ContainerDrawerID */
export type ContainerDrawerID = any;

/** CU.Buildings.BuildingPlotInstanceID */
export type BuildingPlotInstanceID = any;

/** World.StatusID */
export type StatusID = any;

/** CSE.Account.AccountID */
export type AccountID = any;

/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryInstanceID */
export type CharacterDaySummaryInstanceID = any;

/** CU.Databases.Models.Progression.Logs.ShardDaySummaryInstanceID */
export type ShardDaySummaryInstanceID = any;

/** CU.Databases.Models.Items.ItemQuality */
export type ItemQuality = any;

/** CU.Databases.Models.ResourceNodeInstanceID */
export type ResourceNodeInstanceID = any;

/** CU.Databases.Models.Items.SecureTradeInstanceID */
export type SecureTradeInstanceID = any;
/** ServerLib.GraphQL.TestInterface */
export interface TestInterface {
  integer: number | null;
  float: Decimal | null;
}
/** ServerLib.GraphQL.Character */
export interface Character {
  name: string | null;
  race: string | null;
}
/** ServerLib.GraphQL.Models.IInteractiveAlert */
export interface IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
}
/** ServerLib.GraphQL.Models.ISecureTradeUpdate */
export interface ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
}
/** The root query object. */
export interface CUQuery {
  connectedServices: ConnectedServices | null /** Status information for connected services */;
  invite: Invite | null /** Get group invite by InviteCode. Arguments: shard (required), code (required). */;
  invites:
    | (Invite | null)[]
    | null /** Get group invites. Arguments: shard (required), forGroup (optional), toGroup | toCharacter (optional and exclusive, if both are provided, toGroup will be used). */;
  myCharacter: CUCharacter | null /** Get the character of the currently logged in user. */;
  character: CUCharacter | null /** Get a character by id and shard. */;
  motd:
    | (MessageOfTheDay | null)[]
    | null /** Gets a list of Message of the Days */;
  patchNotes: (PatchNote | null)[] | null /** Gets patch notes */;
  patchNote: PatchNote | null /** Gets a single patch note */;
  patcherAlerts: (PatchNote | null)[] | null /** Gets patcher alerts */;
  patcherHero: (PatcherHero | null)[] | null /** Gets Patcher Hero content */;
  scenariosummary: ScenarioSummaryDBModel | null /** retrieve information about a scenario */;
  substances:
    | (SubstanceDefRef | null)[]
    | null /** list all available substances */;
  gearSlots: (GearSlotDefRef | null)[] | null /** gearSlots */;
  item: Item | null /** retrieve information about an item */;
  traits: TraitsInfo | null /** Get all possible traits. */;
  buildingPlotByInstanceID: BuildingPlotResult | null /** retrieve information about a building plot */;
  buildingPlotByEntityID: BuildingPlotResult | null /** retrieve information about a building plot by its entity ID */;
  metrics: MetricsData | null /** metrics data */;
  status: Status | null /** Information about statuses */;
  myprogression: CharacterProgressionData | null /** Information about progression data for the character. */;
  shardprogression: ShardProgressionData | null /** Information about progression data for the entire shard. */;
  entityItems: EntityItemResult | null /** retrieve information about an item that is stored in an entity currently loaded on the server */;
  myInventory: MyInventory | null /** Retrieve data about the character's inventory */;
  myEquippedItems: MyEquippedItems | null /** retrieve all the session users equipped items */;
  resourceNode: ResourceNodeResult | null /** retrieve information about a resource node */;
  secureTrade: SecureTradeStatus | null /** Information about current secure item trade the player is engaged in. */;
  test: Test | null /** Just here for testing, please ignore. */;
  myPassiveAlerts:
    | (PassiveAlert | null)[]
    | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  skill: Skill | null /** Gets information about a skill by id */;
  myInteractiveAlerts: (IInteractiveAlert | null)[] | null /** Alerts */;
  world: WorldData | null /** Information about the current game world */;
  crafting: CraftingRecipes | null /** Information about crafting recipes, nearby vox status, and potential interactions with the current vox job. */;
  channels: (Channel | null)[] | null /** List all channels. */;
}
/** ServerLib.GraphQL.ConnectedServices */
export interface ConnectedServices {
  asyncRPC: (AsyncRPCConnectionStatus | null)[] | null;
  worldState: (WorldStateStatus | null)[] | null;
  servers: (ServerModel | null)[] | null;
}
/** CU.ServerStatus.AsyncRPCConnectionStatus */
export interface AsyncRPCConnectionStatus {
  clientType: string | null;
  status: string | null;
  address: string | null;
}
/** CU.ServerStatus.WorldStateStatus */
export interface WorldStateStatus {
  shard: ShardID | null;
  address: string | null;
  lastState: Date | null;
  entityCount: number | null;
  worldReceiver: string | null;
  physicsReceiver: string | null;
  proxyStatus: (ProxyStatus | null)[] | null;
}
/** CU.ServerStatus.ProxyStatus */
export interface ProxyStatus {
  iP: string | null;
  cPU: Decimal | null;
  publicIP: string | null;
  privateIP: string | null;
  currentState: string | null;
  goalState: string | null;
  stateClass: string | null;
}
/** ServerLib.ApiModels.ServerModel */
export interface ServerModel {
  accessLevel: AccessType | null;
  channelID: number | null;
  channelPatchPermissions: number | null;
  host: string | null;
  name: string | null;
  playerMaximum: number | null;
  shardID: number | null;
  status: ServerStatus | null;
  apiHost: string | null;
}
/** CU.Groups.Invite */
export interface Invite {
  code: InviteCode | null;
  shard: ShardID | null;
  status: InviteStatus | null;
  targetsID128: TargetID | null;
  forGroup: GroupID | null;
  forGroupType: GroupTypes | null;
  created: Date | null;
  forGroupName: string | null;
  fromName: string | null;
  durationTicks: number | null;
  uses: number | null;
  maxUses: number | null;
}
/** CU.Databases.Models.CUCharacter */
export interface CUCharacter {
  name: string | null;
  progression: ProgressionComponentGQLField | null;
  id: CharacterID | null;
  faction: Faction | null;
  race: Race | null;
  gender: Gender | null;
  archetype: Archetype | null;
  order: GroupID | null;
  traits: (Trait | null)[] | null;
  stats: (CharacterStatField | null)[] | null;
  maxHealth: Decimal | null;
  maxBlood: Decimal | null;
  maxStamina: Decimal | null;
  maxPanic: Decimal | null;
  session: SessionStatsField | null;
  skills: (Skill | null)[] | null;
  entityID: EntityID | null;
}
/** CU.Databases.Models.ProgressionComponentGQLField */
export interface ProgressionComponentGQLField {
  characterStats: (CharacterStatProgressionGQLField | null)[] | null;
  skillParts: (SkillPartProgressionGQLField | null)[] | null;
}
/** CU.Databases.Models.CharacterStatProgressionGQLField */
export interface CharacterStatProgressionGQLField {
  stat: PlayerStat | null;
  bonusPoints: number | null;
  progressionPoints: number | null;
}
/** CU.Databases.Models.SkillPartProgressionGQLField */
export interface SkillPartProgressionGQLField {
  skillPartID: string | null;
  level: number | null;
  progressionPoints: number | null;
}
/** World.Trait */
export interface Trait {
  required: boolean | null /** Whether or not this is a required trait. */;
  category: TraitCategory | null /** Category */;
  id: string | null;
  name: string | null /** The name of this trait */;
  icon: string | null /** Url for the icon for this trait */;
  description: string | null /** The description of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  exclusives: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** World.ExclusiveTraitsInfo */
export interface ExclusiveTraitsInfo {
  ids: (string | null)[] | null;
  maxAllowed: number | null;
  minRequired: number | null;
}
/** ServerLib.CharacterStatField */
export interface CharacterStatField {
  stat: PlayerStat | null;
  value: Decimal | null;
  description: string | null;
}
/** ServerLib.SessionStatsField */
export interface SessionStatsField {
  sessionStartTicks: Decimal | null;
  sessionStartDate: Date | null;
  skillPartsUsed: (SkillPartsUsedField | null)[] | null;
}
/** ServerLib.SkillPartsUsedField */
export interface SkillPartsUsedField {
  skillPart: SkillPartDef | null;
  timesUsed: number | null;
}
/** World.SkillPartDef */
export interface SkillPartDef {
  icon: string | null;
  id: string | null;
  name: string | null;
}
/** ServerLib.GraphQL.Models.Skill */
export interface Skill {
  name: string | null;
  icon: string | null;
  notes: string | null;
  id: SkillID | null;
  tracks: SkillTracks | null;
}
/** CU.Databases.Models.Content.MessageOfTheDay */
export interface MessageOfTheDay {
  title: string | null;
  htmlContent: string | null /** HTML Content for the patch note. */;
  channels:
    | (number | null)[]
    | null /** Which channels will this patch note be presented on. */;
  id: string | null;
  utcDisplayStart: Date | null;
  utcDisplayEnd: Date | null;
  utcCreated: Date | null;
}
/** CU.Databases.Models.Content.PatchNote */
export interface PatchNote {
  channels:
    | (ChannelID | null)[]
    | null /** Which channels will this patch note be presented on. */;
  htmlContent: string | null /** HTML Content for the patch note. */;
  title: string | null;
  patchNumber: string | null;
  id: string | null;
  utcDisplayStart: Date | null;
  utcDisplayEnd: Date | null;
  utcCreated: Date | null;
}
/** CU.Databases.Models.Content.PatcherHero */
export interface PatcherHero {
  id: string | null;
  utcDisplayStart: Date | null;
  utcDisplayEnd: Date | null;
  utcCreated: Date | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel */
export interface ScenarioSummaryDBModel {
  scenarioInstanceID: ScenarioInstanceID | null;
  shardID: ShardID | null;
  startTime: Date | null;
  endTime: Date | null;
  creatorAdminID: CharacterID | null;
  rounds: (RoundOutcome | null)[] | null;
  resolution: ScenarioResolution | null;
  teamOutcomes:
    | (TeamOutcomeScenarioField | null)[]
    | null /** details for what the each team did for the whole scenario */;
  scenarioDef: ScenarioDef | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+RoundOutcome */
export interface RoundOutcome {
  roundInstanceID: RoundInstanceID | null;
  roundIndex: number | null;
  startTime: Date | null;
  endTime: Date | null;
  resolution: ScenarioResolution | null;
  adminID: CharacterID | null;
  teamOutcomes: (TeamOutcomeRound | null)[] | null;
  myRoundOutcome: CharacterOutcomeDBModel | null /** details for what the caller did during this round */;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeRound */
export interface TeamOutcomeRound {
  teamID: ScenarioTeamID | null;
  score: number | null;
  role: RoleID | null;
  outcome: ScenarioOutcome | null;
  participants: (CharacterOutcomeDBModel | null)[] | null;
  damageSummary: DamageSummaryDBModel | null /** damage summary sum across all participants in this round */;
  participantCount:
    | number
    | null /** how many characters participated in this round */;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+CharacterOutcomeDBModel */
export interface CharacterOutcomeDBModel {
  displayName: string | null;
  characterType: ProgressionCharacterType | null;
  damage: DamageSummaryDBModel | null;
  score: number | null;
  crafting: CraftingSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.DamageSummaryDBModel */
export interface DamageSummaryDBModel {
  healingApplied: CountPerTargetTypeDBModel | null;
  healingReceived: CountPerTargetTypeDBModel | null;
  damageApplied: CountPerTargetTypeDBModel | null;
  damageReceived: CountPerTargetTypeDBModel | null;
  killCount: CountPerTargetTypeDBModel | null;
  deathCount: CountPerTargetTypeDBModel | null;
  killAssistCount: CountPerTargetTypeDBModel | null;
  createCount: CountPerTargetTypeDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CountPerTargetTypeDBModel */
export interface CountPerTargetTypeDBModel {
  self: number | null;
  playerCharacter: number | null;
  nonPlayerCharacter: number | null;
  dummy: number | null;
  anyCharacter: number | null;
  resourceNode: number | null;
  item: number | null;
  building: number | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel */
export interface CraftingSummaryDBModel {
  blockSummary: JobSummaryDBModel | null;
  grindSummary: JobSummaryDBModel | null;
  makeSummary: JobSummaryDBModel | null;
  purifySummary: JobSummaryDBModel | null;
  repairSummary: JobSummaryDBModel | null;
  salvageSummary: JobSummaryDBModel | null;
  shapeSummary: JobSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.CraftingSummaryDBModel+JobSummaryDBModel */
export interface JobSummaryDBModel {
  started: number | null;
  canceled: number | null;
  collected: number | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenarioField */
export interface TeamOutcomeScenarioField {
  participants: (CharacterOutcomeDBModel | null)[] | null;
  teamID: ScenarioTeamID | null;
  outcome: ScenarioOutcome | null;
}
/** Scenario.ScenarioDef */
export interface ScenarioDef {
  displayDescription: string | null;
  displayName: string | null;
  icon: string | null;
  id: string | null;
}
/** World.SubstanceDefRef */
export interface SubstanceDefRef {
  id: string | null /** The unique identifier for this substance */;
  purifyItemDef: ItemDefRef | null;
  minQuality: Decimal | null /** the minimum quality this substance comes in */;
  maxQuality: Decimal | null /** the maximum quality this substance comes in */;
}
/** World.ItemDefRef */
export interface ItemDefRef {
  id: string | null /** Unique item identifier */;
  numericItemDefID: number | null;
  defaultResourceID: string | null;
  iconUrl: string | null /** URL to the item's icon */;
  name: string | null /** Name of the item */;
  description: string | null /** Description of the item */;
  tags:
    | (string | null)[]
    | null /** Tags on this item, these can be referenced by recipes */;
  substanceDefinition: SubstanceDefRef | null /** Substance information for this item definition */;
  isVox: boolean | null;
  isVoxToken: boolean | null;
  isPlotDeed: boolean | null;
  deploySettings: DeploySettingsDefRef | null;
  gearSlotSets:
    | (GearSlotSet | null)[]
    | null /** the sets of gear slots this item can be equipped to */;
  itemType: ItemType | null /** The type of item */;
}
/** World.DeploySettingsDefRef */
export interface DeploySettingsDefRef {
  resourceID: string | null;
  isDoor: boolean | null;
  itemPlacementType: ItemPlacementType | null;
  requiredZoneType: ZoneType | null;
  snapToGround: boolean | null;
  rotateYaw: boolean | null;
  rotatePitch: boolean | null;
  rotateRoll: boolean | null;
  alwaysShowOnMap: boolean | null;
  mapIconURL: string | null;
  mapIconAnchorX: Decimal | null;
  mapIconAnchorY: Decimal | null;
  plotSize: string | null;
  skipDeployLimitCheck: boolean | null;
  buildingTemplateItem: boolean | null;
  maxPitch: Decimal | null;
  maxTerrainPitch: Decimal | null;
}
/** World.GearSlotSet */
export interface GearSlotSet {
  gearSlots:
    | (GearSlotDefRef | null)[]
    | null /** A list of gear slots which makes up a valid set of places a item can be equipped on at once. */;
}
/** World.GearSlotDefRef */
export interface GearSlotDefRef {
  id: string | null /** Unique gear slot identifier */;
  gearLayer: GearLayerDefRef | null /** Which layer this slot belongs to */;
  subpartIDs:
    | (SubpartId | null)[]
    | null /** Which body subparts this slot belongs to */;
}
/** World.GearLayerDefRef */
export interface GearLayerDefRef {
  id: string | null /** Unique ID for this layer */;
  armorStatCalculationType: ArmorStatCalculationType | null /** How any armor stats are added in when calculating damage on this layer */;
  gearLayerType: GearLayerType | null /** The type of gear layer */;
}
/** World.Item */
export interface Item {
  givenName: string | null /** Custom name given to item at crafting item */;
  id: ItemInstanceID | null /** Unique instance ID for item. */;
  scenarioRelationship: ScenarioRelationship | null;
  shardID: ShardID | null;
  stackHash: ItemStackHash | null /** Identifies items that are of the same type and have the same stats. */;
  staticDefinition: ItemDefRef | null /** The definition for the item. */;
  stats: ItemStatsDescription | null /** stats of this item */;
  debugname:
    | string
    | null /** name of the item which includes some basic item information */;
  containerColor: ColorRGBA | null /** the UI color for the container UI */;
  voxItems:
    | (Item | null)[]
    | null /** items contained within the vox job of this item */;
  location: ItemLocationDescription | null /** details about the location of the item */;
  equiprequirement: ItemEquipRequirement | null /** information about if this item can be equipped. */;
  containerDrawers: (ContainerDrawerGQL | null)[] | null;
  permissibleHolder: FlagsPermissibleHolderGQL | null;
  actions: (ItemActionDefGQL | null)[] | null;
}
/** World.ScenarioRelationship */
export interface ScenarioRelationship {
  restrictedToScenario: boolean | null;
  scenarioID: ScenarioInstanceID | null;
}
/** World.Items.ItemStatsDescription */
export interface ItemStatsDescription {
  item: ItemStat_Single | null /** Stats shared by all types of items */;
  alloy: AlloyStat_Single | null /** Alloy specific stats */;
  substance: SubstanceStat_Single | null /** Substance specific stats */;
  durability: DurabilityStat_Single | null /** Durability specific stats */;
  weapon: WeaponStat_Single | null /** Weapon specific stats */;
  block: BuildingBlockStat_Single | null /** Block specific stats */;
  siegeEngine: SiegeEngineStat_Single | null /** Siege engine specific stats */;
  armor: (ArmorStatSet | null)[] | null;
  armorBySubpart: (ArmorStatBySubpart | null)[] | null;
}

export interface ItemStat_Single {
  quality: Decimal | null /** The quality of the item, this will be a value between 0-1 */;
  selfMass: Decimal | null /** The mass of the item without the mass of anything inside of it */;
  totalMass: Decimal | null /** The mass of the item and anything inside of it */;
  encumbrance: Decimal | null /** The encumbrance of an item is used while the item is equipped to encumber the player equipping the item */;
  agilityRequirement: Decimal | null /** The agility stat requirement that must be met to equip this item */;
  dexterityRequirement: Decimal | null /** The dexterity stat requirement that must be met to equip this item */;
  strengthRequirement: Decimal | null /** The strength stat requirement that must be met to equip this item */;
  vitalityRequirement: Decimal | null /** The vitality stat requirement that must be met to equip this item */;
  enduranceRequirement: Decimal | null /** The endurance stat requirement that must be met to equip this item */;
  attunementRequirement: Decimal | null /** The attunement stat requirement that must be met to equip this item */;
  willRequirement: Decimal | null /** The will stat requirement that must be met to equip this item */;
  faithRequirement: Decimal | null /** The faith stat requirement that must be met to equip this item */;
  resonanceRequirement: Decimal | null /** The resonance stat requirement that must be met to equip this item */;
  unitCount: Decimal | null /** The stack count on this item.  For items which do not stack, this value will always be 1. */;
  nestedItemCount: Decimal | null /** The number of items that are nested under this one.  Either as container contents or vox ingredients. */;
}

export interface AlloyStat_Single {
  unitHealth: Decimal | null /** UnitHealth */;
  unitMass: Decimal | null /** UnitMass */;
  massBonus: Decimal | null /** MassBonus */;
  encumbranceBonus: Decimal | null /** EncumbranceBonus */;
  maxRepairPointsBonus: Decimal | null /** MaxRepairPointsBonus */;
  maxHealthBonus: Decimal | null /** MaxHealthBonus */;
  healthLossPerUseBonus: Decimal | null /** HealthLossPerUseBonus */;
  weightBonus: Decimal | null /** WeightBonus */;
  strengthRequirementBonus: Decimal | null /** StrengthRequirementBonus */;
  dexterityRequirementBonus: Decimal | null /** DexterityRequirementBonus */;
  agilityRequirementBonus: Decimal | null /** AgilityRequirementBonus */;
  vitalityRequirementBonus: Decimal | null /** VitalityRequirementBonus */;
  enduranceRequirementBonus: Decimal | null /** EnduranceRequirementBonus */;
  attunementRequirementBonus: Decimal | null /** AttunementRequirementBonus */;
  willRequirementBonus: Decimal | null /** WillRequirementBonus */;
  faithRequirementBonus: Decimal | null /** FaithRequirementBonus */;
  resonanceRequirementBonus: Decimal | null /** ResonanceRequirementBonus */;
  fractureThresholdBonus: Decimal | null /** FractureThresholdBonus */;
  fractureChanceBonus: Decimal | null /** FractureChanceBonus */;
  densityBonus: Decimal | null /** DensityBonus */;
  malleabilityBonus: Decimal | null /** MalleabilityBonus */;
  meltingPointBonus: Decimal | null /** MeltingPointBonus */;
  hardnessBonus: Decimal | null /** HardnessBonus */;
  fractureBonus: Decimal | null /** FractureBonus */;
  armorClassBonus: Decimal | null /** ArmorClassBonus */;
  resistSlashingBonus: Decimal | null /** ResistSlashingBonus */;
  resistPiercingBonus: Decimal | null /** ResistPiercingBonus */;
  resistCrushingBonus: Decimal | null /** ResistCrushingBonus */;
  resistAcidBonus: Decimal | null /** ResistAcidBonus */;
  resistPoisonBonus: Decimal | null /** ResistPoisonBonus */;
  resistDiseaseBonus: Decimal | null /** ResistDiseaseBonus */;
  resistEarthBonus: Decimal | null /** ResistEarthBonus */;
  resistWaterBonus: Decimal | null /** ResistWaterBonus */;
  resistFireBonus: Decimal | null /** ResistFireBonus */;
  resistAirBonus: Decimal | null /** ResistAirBonus */;
  resistLightningBonus: Decimal | null /** ResistLightningBonus */;
  resistFrostBonus: Decimal | null /** ResistFrostBonus */;
  resistLifeBonus: Decimal | null /** ResistLifeBonus */;
  resistMindBonus: Decimal | null /** ResistMindBonus */;
  resistSpiritBonus: Decimal | null /** ResistSpiritBonus */;
  resistRadiantBonus: Decimal | null /** ResistRadiantBonus */;
  resistDeathBonus: Decimal | null /** ResistDeathBonus */;
  resistShadowBonus: Decimal | null /** ResistShadowBonus */;
  resistChaosBonus: Decimal | null /** ResistChaosBonus */;
  resistVoidBonus: Decimal | null /** ResistVoidBonus */;
  resistArcaneBonus: Decimal | null /** ResistArcaneBonus */;
  mitigateBonus: Decimal | null /** MitigateBonus */;
  piercingDamageBonus: Decimal | null /** PiercingDamageBonus */;
  piercingBleedBonus: Decimal | null /** PiercingBleedBonus */;
  piercingArmorPenetrationBonus: Decimal | null /** PiercingArmorPenetrationBonus */;
  falloffMinDistanceBonus: Decimal | null /** FalloffMinDistanceBonus */;
  falloffMaxDistanceBonus: Decimal | null /** FalloffMaxDistanceBonus */;
  falloffReductionBonus: Decimal | null /** FalloffReductionBonus */;
  slashingDamageBonus: Decimal | null /** SlashingDamageBonus */;
  slashingBleedBonus: Decimal | null /** SlashingBleedBonus */;
  slashingArmorPenetrationBonus: Decimal | null /** SlashingArmorPenetrationBonus */;
  crushingDamageBonus: Decimal | null /** CrushingDamageBonus */;
  fallbackCrushingDamageBonus: Decimal | null /** FallbackCrushingDamageBonus */;
  distruptionBonus: Decimal | null /** DistruptionBonus */;
  stabilityBonus: Decimal | null /** StabilityBonus */;
  deflectionAmountBonus: Decimal | null /** DeflectionAmountBonus */;
  deflectionRecoveryBonus: Decimal | null /** DeflectionRecoveryBonus */;
  physicalProjectileSpeedBonus: Decimal | null /** PhysicalProjectileSpeedBonus */;
  knockbackAmountBonus: Decimal | null /** KnockbackAmountBonus */;
  staminaCostBonus: Decimal | null /** StaminaCostBonus */;
  physicalPreparationTimeBonus: Decimal | null /** PhysicalPreparationTimeBonus */;
  physicalRecoveryTimeBonus: Decimal | null /** PhysicalRecoveryTimeBonus */;
}

export interface SubstanceStat_Single {
  unitHealth: Decimal | null /** UnitHealth */;
  magicalResistance: Decimal | null /** MagicalResistance */;
  meltingPoint: Decimal | null /** MeltingPoint */;
  massFactor: Decimal | null /** MassFactor */;
  hardnessFactor: Decimal | null /** HardnessFactor */;
  elasticity: Decimal | null /** Elasticity */;
  fractureChance: Decimal | null /** FractureChance */;
  unitMass: Decimal | null /** UnitMass */;
}

export interface DurabilityStat_Single {
  maxRepairPoints: Decimal | null /** The number of repair points this item was created at */;
  maxHealth: Decimal | null /** The amount of health this item was created at and will be restored to each time it is repaired */;
  fractureThreshold: Decimal | null /** FractureThreshold */;
  fractureChance: Decimal | null /** FractureChance */;
  currentRepairPoints: Decimal | null /** The current number of repair points remaining on this item. This value will be reduced when the item is repaired */;
  currentHealth: Decimal | null /** The current health on this item. This value is reduced when the item is used or attacked. */;
  healthLossPerUse: Decimal | null /** Factor used to decide how much health the item will lose each time it is used. */;
}

export interface WeaponStat_Single {
  piercingDamage: Decimal | null /** PiercingDamage */;
  piercingBleed: Decimal | null /** PiercingBleed */;
  piercingArmorPenetration: Decimal | null /** PiercingArmorPenetration */;
  slashingDamage: Decimal | null /** SlashingDamage */;
  slashingBleed: Decimal | null /** SlashingBleed */;
  slashingArmorPenetration: Decimal | null /** SlashingArmorPenetration */;
  crushingDamage: Decimal | null /** CrushingDamage */;
  fallbackCrushingDamage: Decimal | null /** FallbackCrushingDamage */;
  disruption: Decimal | null /** Disruption */;
  deflectionAmount: Decimal | null /** DeflectionAmount */;
  physicalProjectileSpeed: Decimal | null /** PhysicalProjectileSpeed */;
  knockbackAmount: Decimal | null /** KnockbackAmount */;
  stability: Decimal | null /** Stability */;
  falloffMinDistance: Decimal | null /** FalloffMinDistance */;
  falloffMaxDistance: Decimal | null /** FalloffMaxDistance */;
  falloffReduction: Decimal | null /** FalloffReduction */;
  deflectionRecovery: Decimal | null /** DeflectionRecovery */;
  staminaCost: Decimal | null /** StaminaCost */;
  physicalPreparationTime: Decimal | null /** PhysicalPreparationTime */;
  physicalRecoveryTime: Decimal | null /** PhysicalRecoveryTime */;
  range: Decimal | null /** Range */;
}

export interface BuildingBlockStat_Single {
  compressiveStrength: Decimal | null /** CompressiveStrength */;
  shearStrength: Decimal | null /** ShearStrength */;
  tensileStrength: Decimal | null /** TensileStrength */;
  density: Decimal | null /** Density */;
  healthUnits: Decimal | null /** HealthUnits */;
  buildTimeUnits: Decimal | null /** BuildTimeUnits */;
  unitMass: Decimal | null /** UnitMass */;
}

export interface SiegeEngineStat_Single {
  yawSpeedDegPerSec: Decimal | null /** YawSpeedDegPerSec */;
  pitchSpeedDegPerSec: Decimal | null /** PitchSpeedDegPerSec */;
}
/** World.Items.ArmorStatSet */
export interface ArmorStatSet {
  statsPerSlot: (ArmorStats | null)[] | null;
}
/** World.Items.ArmorStats */
export interface ArmorStats {
  gearSlot: GearSlotDefRef | null;
  stats: ArmorStat_Single | null;
  resistances: DamageType_Single | null;
  mitigations: DamageType_Single | null;
}

export interface ArmorStat_Single {
  armorClass: Decimal | null /** ArmorClass */;
}

export interface DamageType_Single {
  none: Decimal | null /** None */;
  slashing: Decimal | null /** Slashing */;
  piercing: Decimal | null /** Piercing */;
  crushing: Decimal | null /** Crushing */;
  physical: Decimal | null /** Physical */;
  acid: Decimal | null /** Acid */;
  poison: Decimal | null /** Poison */;
  disease: Decimal | null /** Disease */;
  corruption: Decimal | null /** Corruption */;
  earth: Decimal | null /** Earth */;
  water: Decimal | null /** Water */;
  fire: Decimal | null /** Fire */;
  air: Decimal | null /** Air */;
  lightning: Decimal | null /** Lightning */;
  frost: Decimal | null /** Frost */;
  elemental: Decimal | null /** Elemental */;
  life: Decimal | null /** Life */;
  mind: Decimal | null /** Mind */;
  spirit: Decimal | null /** Spirit */;
  radiant: Decimal | null /** Radiant */;
  light: Decimal | null /** Light */;
  death: Decimal | null /** Death */;
  shadow: Decimal | null /** Shadow */;
  chaos: Decimal | null /** Chaos */;
  void: Decimal | null /** Void */;
  dark: Decimal | null /** Dark */;
  arcane: Decimal | null /** Arcane */;
  sYSTEM: Decimal | null /** SYSTEM */;
  all: Decimal | null /** All */;
}
/** World.Items.ArmorStatBySubpart */
export interface ArmorStatBySubpart {
  subPartId: SubpartId | null;
  stats: ArmorStat_Single | null;
  resistances: DamageType_Single | null;
}
/** CU.Databases.ColorRGBA */
export interface ColorRGBA {
  r: number | null;
  g: number | null;
  b: number | null;
  a: Decimal | null;
  rgba: string | null /** Color in RGBA format */;
  hex: string | null /** Color in Hex format */;
  hexa: string | null /** Color in Hex format with alpha */;
}
/** World.Items.ItemLocationDescription */
export interface ItemLocationDescription {
  equipped: EquippedLocation | null /** Location filled if this item is equipped */;
  inContainer: InContainerLocation | null /** Location filled if this item is in a container */;
  inVox: InVoxJobLocation | null /** Location filled if this item is in a vox */;
  inventory: InventoryLocation | null /** Location filled if this item is in a player's inventory */;
  ground: OnGroundLocation | null /** Location filled if this item in on the ground */;
  building: BuildingPlacedLocation | null /** Location filled if this item in a building place object */;
}
/** World.EquippedLocation */
export interface EquippedLocation {
  characterID: CharacterID | null /** The character the item is equipped on */;
  gearSlots:
    | (GearSlotDefRef | null)[]
    | null /** The gear slots the item is equipped to */;
}
/** World.InContainerLocation */
export interface InContainerLocation {
  containerInstanceID: ItemInstanceID | null /** The item ID of the container this item is in */;
  position: number | null /** The UI position of the item */;
  drawerID: ContainerDrawerID | null /** The drawer this item is in */;
}
/** World.InVoxJobLocation */
export interface InVoxJobLocation {
  voxInstanceID: ItemInstanceID | null /** The item ID of the vox this item is contained in */;
  itemSlot: SubItemSlot | null /** The slot this item is associated with the recipe */;
}
/** World.InventoryLocation */
export interface InventoryLocation {
  characterID: CharacterID | null /** The character that has this item in their inventory */;
  position: number | null /** The UI position of the item */;
}
/** World.OnGroundLocation */
export interface OnGroundLocation {
  isDeployed: boolean | null;
  groupID: ItemInstanceID | null /** The group id set for stacked ground items */;
}
/** World.BuildingPlacedLocation */
export interface BuildingPlacedLocation {
  buildingID: BuildingPlotInstanceID | null;
}
/** World.Items.ItemEquipRequirement */
export interface ItemEquipRequirement {
  status: EquipRequirementStatus | null;
  requirementDescription: string | null;
  errorDescription: string | null;
}
/** ServerLib.ContainerDrawerGQL */
export interface ContainerDrawerGQL {
  id: ContainerDrawerID | null;
  containedItems: (Item | null)[] | null;
  requirements: RequirementDef | null;
  stats: ContainerDefStat_Single | null;
}
/** World.RequirementDef */
export interface RequirementDef {
  description: string | null;
  icon: string | null;
}

export interface ContainerDefStat_Single {
  maxItemCount: Decimal | null /** MaxItemCount */;
  maxItemMass: Decimal | null /** MaxItemMass */;
}
/** ServerLib.FlagsPermissibleHolderGQL */
export interface FlagsPermissibleHolderGQL {
  userPermissions: number | null;
  userGrants: (FlagsPermissibleGrantGQL | null)[] | null;
  permissibleSets: (FlagsPermissibleSetGQL | null)[] | null;
  noActiveSetsPermissions: FlagsPermissibleGQL | null;
}
/** ServerLib.FlagsPermissibleGrantGQL */
export interface FlagsPermissibleGrantGQL {
  grantPermissions: number | null;
  permissions: number | null;
  target: PermissibleTargetGQL | null;
  grants: (FlagsPermissibleGrantGQL | null)[] | null;
}
/** ServerLib.PermissibleTargetGQL */
export interface PermissibleTargetGQL {
  targetType: PermissibleTargetType | null;
  description: string | null;
  characterName: string | null;
}
/** ServerLib.FlagsPermissibleSetGQL */
export interface FlagsPermissibleSetGQL {
  keyType: PermissibleSetKeyType | null;
  userMatchesKey: boolean | null;
  isActive: boolean | null;
  permissibles: (FlagsPermissibleGQL | null)[] | null;
  keyDescription: string | null;
}
/** ServerLib.FlagsPermissibleGQL */
export interface FlagsPermissibleGQL {
  permissions: number | null;
  target: PermissibleTargetGQL | null;
  grants: (FlagsPermissibleGrantGQL | null)[] | null;
}
/** World.ItemActionDefGQL */
export interface ItemActionDefGQL {
  id: string | null;
  name: string | null;
  cooldownSeconds: Decimal | null;
  enabled: boolean | null;
  lastTimePerformed: Date | null;
  uIReaction: ItemActionUIReaction | null;
  showWhenDisabled: boolean | null;
}
/** World.TraitsInfo */
export interface TraitsInfo {
  traits: (Trait | null)[] | null;
  minRequired: number | null;
  maxAllowed: number | null;
}
/** World.BuildingPlotResult */
export interface BuildingPlotResult {
  entityID: EntityID | null;
  instanceID: BuildingPlotInstanceID | null;
  buildingPlacedItemsCount: number | null;
  ownedByName: string | null;
  contestedState: PlotContestedState | null;
  currentCaptureScore: Decimal | null;
  capturingFaction: Faction | null;
  scoreToCapture: Decimal | null;
  position: Vec3f | null;
  size: Vec3f | null;
  maxBlocks: number | null;
  faction: Faction | null;
  permissions: FlagsPermissibleHolderGQL | null;
  permissibleKeyType: PermissibleSetKeyType | null;
}
/** CSE.Vec3f */
export interface Vec3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** ServerLib.MetricsData */
export interface MetricsData {
  playerCounts: (PlayerCount | null)[] | null;
  currentPlayerCount: PlayerCount | null;
}
/** ServerLib.PlayerCount */
export interface PlayerCount {
  total: number | null;
  bots: number | null;
  arthurian: number | null;
  tuatha: number | null;
  viking: number | null;
  timeTicks: number | null;
}
/** ServerLib.Status.Status */
export interface Status {
  statuses:
    | (StatusDef | null)[]
    | null /** Mapping of all numeric status IDs to StatusDefs */;
}
/** World.StatusDef */
export interface StatusDef {
  description: string | null;
  iconURL: string | null;
  id: StatusID | null;
  name: string | null;
  uiText: string | null;
  numericID: number | null /** id used for networking the status */;
}
/** ServerLib.Progression.CharacterProgressionData */
export interface CharacterProgressionData {
  collectedProgressionSummary: CharacterSummaryDBModel | null /** Global information about this character. */;
  unCollectedDayLogs:
    | (CharacterDaySummaryDBModel | null)[]
    | null /** All unhandled progression days. */;
  dayLogByID: CharacterDaySummaryDBModel | null /** A specific day log for this character. */;
  dayBySummaryNumber: CharacterDaySummaryDBModel | null /** A specific summary number for this character. */;
  adjustmentsByDayLogID:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** A character adjustments for a specific day log for this character. */;
  characterDays:
    | (CharacterDaySummaryDBModel | null)[]
    | null /** Information about what happened for this player over the date range provided. */;
  characterAdjustments:
    | (CharacterAdjustmentDBModel | null)[]
    | null /** Information about what adjustments happened for this player over the date range provided. */;
  accountSummary: AccountProgressionSummary | null /** Information about all characters belonging to this account. */;
}
/** CU.Databases.Models.Progression.Logs.CharacterSummaryDBModel */
export interface CharacterSummaryDBModel {
  accountID: AccountID | null;
  shardID: ShardID | null;
  lastDayLogProcessedID: CharacterDaySummaryInstanceID | null;
  lastDayProcessedStart: Date | null;
  activeDayCount: number | null;
  secondsActive: number | null;
  distanceMoved: number | null;
  damage: DamageSummaryDBModel | null;
  plots: PlotSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
  skillPartsUsed: (SkillPartUsedSummaryDBModel | null)[] | null;
  scenarioOutcomes: ScenarioOutcome_UInt32 | null;
}
/** CU.Databases.Models.Progression.Logs.PlotSummaryDBModel */
export interface PlotSummaryDBModel {
  factionPlotsCaptured: number | null;
  scenarioPlotsCaptured: number | null;
}
/** CU.Databases.Models.Progression.Logs.SkillPartUsedSummaryDBModel */
export interface SkillPartUsedSummaryDBModel {
  skillPartID: string | null;
  usedInCombatCount: number | null;
  usedNonCombatCount: number | null;
  skillPartDef: SkillPartDef | null;
}

export interface ScenarioOutcome_UInt32 {
  invalid: number | null /** Invalid */;
  win: number | null /** Win */;
  lose: number | null /** Lose */;
  draw: number | null /** Draw */;
  killed: number | null /** Killed */;
  restart: number | null /** Restart */;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel */
export interface CharacterDaySummaryDBModel {
  id: CharacterDaySummaryInstanceID | null;
  shardDayLogID: ShardDaySummaryInstanceID | null;
  shardID: ShardID | null;
  summaryNumber: number | null;
  dayStart: Date | null;
  dayEnd: Date | null;
  characterID: CharacterID | null;
  secondsActive: number | null;
  distanceMoved: number | null;
  skillPartsUsed: (SkillPartUsedSummaryDBModel | null)[] | null;
  damage: DamageSummaryDBModel | null;
  plots: PlotSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
  state: States | null;
  scenarios: (FinishedScenario | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+FinishedScenario */
export interface FinishedScenario {
  scenarioID: ScenarioInstanceID | null;
  scenarioDefinitionID: string | null;
  outcome: ScenarioOutcome | null;
  activeAtEnd: boolean | null;
  teamID: ScenarioTeamID | null;
  score: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentDBModel */
export interface CharacterAdjustmentDBModel {
  shardDayLogID: ShardDaySummaryInstanceID | null;
  characterDayLogID: CharacterDaySummaryInstanceID | null;
  reason: CharacterAdjustmentReasonGQLField | null;
  adjustment: CharacterAdjustmentGQLField | null;
  dayEnd: Date | null;
  sequence: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentReasonGQLField */
export interface CharacterAdjustmentReasonGQLField {
  skillPartLevel: CharacterAdjustmentReasonSkillPartLevel | null;
  useSkillPart: CharacterAdjustmentReasonUseSkillPart | null;
  useSkills: CharacterAdjustmentReasonUseSkills | null;
  adminGrant: boolean | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonSkillPartLevel */
export interface CharacterAdjustmentReasonSkillPartLevel {
  skillPartID: string | null;
  skillPartLevel: number | null;
  skillPartDef: SkillPartDef | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseSkillPart */
export interface CharacterAdjustmentReasonUseSkillPart {
  skillID: string | null;
  inCombatCount: number | null;
  nonCombatCount: number | null;
  skillPartDef: SkillPartDef | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Reasons.CharacterAdjustmentReasonUseSkills */
export interface CharacterAdjustmentReasonUseSkills {
  inCombatCount: number | null;
  nonCombatCount: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.CharacterAdjustmentGQLField */
export interface CharacterAdjustmentGQLField {
  addItem: CharacterAdjustmentAddItem | null;
  playerStat: CharacterAdjustmentPlayerStat | null;
  skillPart: CharacterAdjustmentSkillPartProgress | null;
  skillNode: CharacterAdjustmentApplySkillNode | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentAddItem */
export interface CharacterAdjustmentAddItem {
  itemInstanceIDS: (ItemInstanceID | null)[] | null;
  staticDefinitionID: string | null;
  unitCount: number | null;
  quality: ItemQuality | null;
  itemDef: ItemDefRef | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentPlayerStat */
export interface CharacterAdjustmentPlayerStat {
  playerStat: PlayerStat | null;
  previousBonus: number | null;
  newBonus: number | null;
  previousProgressionPoints: number | null;
  newProgressionPoints: number | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentSkillPartProgress */
export interface CharacterAdjustmentSkillPartProgress {
  skillPartID: string | null;
  previousLevel: number | null;
  previousProgressionPoints: number | null;
  newLevel: number | null;
  newProgressPoints: number | null;
  skillPartDef: SkillPartDef | null;
}
/** CU.Databases.Models.Progression.CharacterAdjustments.Adjustments.CharacterAdjustmentApplySkillNode */
export interface CharacterAdjustmentApplySkillNode {
  skillNodePath: string | null;
}
/** ServerLib.Progression.AccountProgressionSummary */
export interface AccountProgressionSummary {
  characterCount: number | null;
  activeDayCount: number | null;
  secondsActive: number | null;
  distanceMoved: number | null;
  statsGained: number | null;
  skillPartLevels: number | null;
  damage: DamageSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
  scenarioOutcomes: ScenarioOutcome_UInt32 | null;
}
/** ServerLib.Progression.ShardProgressionData */
export interface ShardProgressionData {
  progressionSummary: ShardSummaryDBModel | null /** Global information about this shard. */;
  progressionDaySummary: ShardDaySummaryDBModel | null /** Information about a particular day */;
  shardDays: PagedShardDaySummaries | null /** Information about what happened on a shard over the date range provided. */;
  progressionSummaryRange: ShardSummaryDBModel | null /** Global information about this shard given the time frame. */;
  adjustmentsSummary: CharacterAdjustmentSummary | null /** Information about rewards over a time frame or specific day */;
  scenarioSummaries: PagedScenarioSummaries | null /** Information about all the finished scenarios within a date range */;
  realmSummary: RealmDaySummaryDBModel | null /** Information about what happened to a realm on a given day. */;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel */
export interface ShardSummaryDBModel {
  shardID: ShardID | null;
  playerCharacters: CharacterSummary | null;
  nonPlayerCharacters: CharacterSummary | null;
  plots: PlotSummary | null;
  scenarios: ScenarioSummary | null;
  realmSummaries: Faction_RealmSummaryDBModel | null;
  daysProcessed: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+CharacterSummary */
export interface CharacterSummary {
  secondsActive:
    | number
    | null /** How many seconds of the game have been played by all characters ever for this shard. */;
  distanceMoved:
    | number
    | null /** Distance traveled by all characters ever for this shard. */;
  damage: DamageSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+PlotSummary */
export interface PlotSummary {
  blocksCreated: number | null;
  blocksDestroyed: number | null;
}
/** CU.Databases.Models.Progression.Logs.ShardSummaryDBModel+ScenarioSummary */
export interface ScenarioSummary {
  started: number | null;
  finished: number | null;
  restarted: number | null;
  killed: number | null;
}

export interface Faction_RealmSummaryDBModel {
  factionless: RealmSummaryDBModel | null /** Factionless */;
  tdd: RealmSummaryDBModel | null /** TDD */;
  viking: RealmSummaryDBModel | null /** Viking */;
  arthurian: RealmSummaryDBModel | null /** Arthurian */;
  cOUNT: RealmSummaryDBModel | null /** COUNT */;
}
/** CU.Databases.Models.Progression.Logs.RealmSummaryDBModel */
export interface RealmSummaryDBModel {
  faction: Faction | null;
  secondsActive: number | null;
  distanceMoved: number | null;
  damage: DamageSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
}
/** CU.Databases.Models.Progression.Logs.ShardDaySummaryDBModel */
export interface ShardDaySummaryDBModel {
  dayStart: Date | null;
  dayEnd: Date | null;
  playerCharacters: CharacterSummary | null;
  nonPlayerCharacters: CharacterSummary | null;
  plots: PlotSummary | null;
  scenarios: (ScenarioSummary | null)[] | null;
}
/** ServerLib.Progression.PagedShardDaySummaries */
export interface PagedShardDaySummaries {
  totalCount: number | null;
  data: (ShardDaySummaryDBModel | null)[] | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary */
export interface CharacterAdjustmentSummary {
  items: (ItemsAdded | null)[] | null;
  stats: (StatBonusPoints | null)[] | null;
  skillParts: (SkillPartLevels | null)[] | null;
  skillNodseApplied: (SkillNodeApplied | null)[] | null;
  characterCount: number | null;
  maxAdjustmentsOnCharacter: number | null;
  characterIDWithMaxAdjustments: CharacterID | null;
  averageAdjustementsPerCharacter: Decimal | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+ItemsAdded */
export interface ItemsAdded {
  staticDefinitionID: string | null;
  unitCount: number | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+StatBonusPoints */
export interface StatBonusPoints {
  stat: PlayerStat | null;
  bonusChange: number | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+SkillPartLevels */
export interface SkillPartLevels {
  skillPartID: string | null;
  levelChange: number | null;
}
/** ServerLib.Progression.CharacterAdjustmentSummary+SkillNodeApplied */
export interface SkillNodeApplied {
  skillNodePath: string | null;
  count: number | null;
}
/** ServerLib.Progression.PagedScenarioSummaries */
export interface PagedScenarioSummaries {
  totalCount: number | null;
  data: (ScenarioSummaryDBModel | null)[] | null;
}
/** CU.Databases.Models.Progression.Logs.RealmDaySummaryDBModel */
export interface RealmDaySummaryDBModel {
  shardDayLogID: ShardDaySummaryInstanceID | null;
  faction: Faction | null;
  shardID: ShardID | null;
  dayStart: Date | null;
  dayEnd: Date | null;
  secondsActive: number | null;
  distanceMoved: number | null;
  characterCount: number | null;
  skillPartsUsed: (SkillPartUsedSummaryDBModel | null)[] | null;
  damage: DamageSummaryDBModel | null;
  crafting: CraftingSummaryDBModel | null;
}
/** ServerLib.Items.EntityItemResult */
export interface EntityItemResult {
  items:
    | (Item | null)[]
    | null /** List of items contained within this item.  This includes wrapped items, inventory, and equipment items */;
}
/** ServerLib.Items.MyInventory */
export interface MyInventory {
  items: (Item | null)[] | null;
  itemCount: number | null;
  nestedItemCount: number | null;
  totalMass: Decimal | null;
}
/** ServerLib.Items.MyEquippedItems */
export interface MyEquippedItems {
  items: (EquippedItem | null)[] | null;
  itemCount: number | null;
  totalMass: Decimal | null;
  armorStats: (SubpartArmorStats | null)[] | null;
}
/** World.EquippedItem */
export interface EquippedItem {
  gearSlots:
    | (GearSlotDefRef | null)[]
    | null /** the list of all the gear slots the item is in */;
  item: Item | null /** The item that is equipped */;
}
/** ServerLib.Items.SubpartArmorStats */
export interface SubpartArmorStats {
  subpartID: SubpartId | null;
  armorClass: Decimal | null;
  resistances: DamageType_Single | null;
  mitigations: DamageType_Single | null;
}
/** ServerLib.Items.ResourceNodeResult */
export interface ResourceNodeResult {
  staticDefinition: ResourceNodeDefRef | null;
  resourceNodeInstanceID: ResourceNodeInstanceID | null;
  currentHealth: Decimal | null;
  maxHealth: Decimal | null;
  faction: Faction | null;
  subItems: (ResourceNodeSubItem | null)[] | null;
  permissibleHolder: FlagsPermissibleHolderGQL | null;
}
/** World.ResourceNodeDefRef */
export interface ResourceNodeDefRef {
  id: string | null;
  name: string | null;
  requirements: RequirementDef | null;
  secondsBetweenUse: number | null;
  maxActors: number | null;
  mapIconURL: string | null;
  mapIconAnchorX: Decimal | null;
  mapIconAnchorY: Decimal | null;
}
/** World.ResourceNodeSubItem */
export interface ResourceNodeSubItem {
  subItemDefinitionRef: ResourceNodeSubItemDefRef | null;
  takenCount: number | null;
}
/** World.ResourceNodeSubItemDefRef */
export interface ResourceNodeSubItemDefRef {
  id: string | null;
  startingUnits: number | null;
  entries: (Entry | null)[] | null;
}
/** World.ResourceNodeSubItemDef+Entry */
export interface Entry {
  faction: Faction | null;
  harvestItems: (HarvestItem | null)[] | null;
}
/** World.ResourceNodeSubItemDef+Entry+HarvestItem */
export interface HarvestItem {
  itemDefinition: ItemDefRef | null;
  weight: number | null;
  minQuality: Decimal | null /** the min quality that could result */;
  maxQuality: Decimal | null /** the max quality that could result */;
  minUnitCount: number | null /** the min unit count that could result */;
  maxUnitCount: number | null /** the max unit count that could result */;
}
/** ServerLib.Items.SecureTradeStatus */
export interface SecureTradeStatus {
  myState: SecureTradeState | null /** The state of the trade, from your perspective */;
  myItems: (Item | null)[] | null /** The items you've added to the trade */;
  theirEntityID: EntityID | null /** The entity ID of who is being traded with */;
  theirState: SecureTradeState | null /** The state of the trade, from the perspective of the entity you are trading with */;
  theirItems:
    | (Item | null)[]
    | null /** The items you will get from this trade */;
}
/** ServerLib.GraphQL.Test */
export interface Test extends TestInterface {
  integer: number | null;
  float: Decimal | null;
  string: string | null;
  characters: (Character | null)[] | null;
  sg1: TestEnum_String | null;
  sg1Titles: TestEnum_String | null;
  sg1Floats: TestEnum_Single | null;
  homeArray: (string | null)[] | null;
  homeList: (string | null)[] | null;
  weapons: (string | null)[] | null;
  customField: ItemQuality | null /** testtesttest */;
}

export interface TestEnum_String {
  jackson: string | null /** Jackson */;
  carter: string | null /** Carter */;
  oneill: string | null /** Oneill */;
  tealc: string | null /** Tealc */;
}

export interface TestEnum_Single {
  jackson: Decimal | null /** Jackson */;
  carter: Decimal | null /** Carter */;
  oneill: Decimal | null /** Oneill */;
  tealc: Decimal | null /** Tealc */;
}
/** ServerLib.GraphQL.Models.PassiveAlert */
export interface PassiveAlert {
  targetID: CharacterID | null;
  message: string | null;
}
/** ServerLib.Game.WorldData */
export interface WorldData {
  spawnPoints:
    | (SpawnPoint | null)[]
    | null /** Currently active spawn points available to you. */;
  map: MapData | null;
}
/** ServerLib.ApiModels.SpawnPoint */
export interface SpawnPoint {
  id: string | null;
  faction: Faction | null;
  position: Vec3f | null;
}
/** ServerLib.Game.MapData */
export interface MapData {
  static: (MapPoint | null)[] | null;
  dynamic: (MapPoint | null)[] | null;
}
/** ServerLib.Game.MapPoint */
export interface MapPoint {
  position: (Decimal | null)[] | null;
  anchor: (Decimal | null)[] | null;
  tooltip: string | null;
  actions: MapPointActions | null;
  src: string | null;
  color: string | null;
  offset: (Decimal | null)[] | null;
  size: (Decimal | null)[] | null;
}
/** ServerLib.Game.MapPointActions */
export interface MapPointActions {
  onClick: MapPointAction | null;
}
/** ServerLib.Game.MapPointAction */
export interface MapPointAction {
  type: MapPointActionType | null;
  command: string | null;
}
/** ServerLib.Crafting.CraftingRecipes */
export interface CraftingRecipes {
  voxStatus: VoxStatus | null /** The status of the nearest vox belonging to your player */;
  recipesMatchingIngredients:
    | (string | null)[]
    | null /** ID's of recipes which match the current ingredient list in the vox */;
  possibleIngredients:
    | (Item | null)[]
    | null /** List of inventory items compatible with the current vox job */;
  possibleIngredientsWithSlots:
    | (PossibleVoxIngredientGQL | null)[]
    | null /** List of inventory items compatible with the current vox job */;
  possibleItemSlots:
    | (SubItemSlot | null)[]
    | null /** List of sub item slots this vox job uses */;
  blockRecipes:
    | (BlockRecipeDefRef | null)[]
    | null /** List of recipes for the Block vox job */;
  purifyRecipes:
    | (PurifyRecipeDefRef | null)[]
    | null /** List of recipes for the Purify vox job */;
  grindRecipes:
    | (GrindRecipeDefRef | null)[]
    | null /** List of recipes for the Grind vox job */;
  shapeRecipes:
    | (ShapeRecipeDefRef | null)[]
    | null /** List of recipes for the Shape vox job which have been discovered by the player.  Shape recipes are discovered when the right combination of materials are added to a vox during a shape job. */;
  makeRecipes:
    | (MakeRecipeDefRef | null)[]
    | null /** List of recipes for the Make vox job */;
}
/** World.VoxStatus */
export interface VoxStatus {
  voxState: VoxState | null /** The result of searching for a nearby vox. */;
  jobType: VoxJobType | null /** Which type of crafting job is currently being utilized */;
  jobState: VoxJobState | null /** The current state the job is in. */;
  voxHealthCost:
    | number
    | null /** How much damage the vox will take from performing this job. */;
  outputItems:
    | (Item | null)[]
    | null /** The list of all items which will be rewarded when the vox job is completed.  This information is only available is job is fully configured and ready to run */;
  totalCraftingTime: Decimal | null /** How long the job will take to run.  This information is only available is job is fully configured and ready to run */;
  timeRemaining: Decimal | null /** The total seconds remaining for this job to finish.  This information is only valid while the job is running. */;
  givenName:
    | string
    | null /** The custom name for the item being produced. Only for Make jobs */;
  itemCount: number | null /** How many item to make. Only for Make jobs */;
  recipeID:
    | string
    | null /** The ID of the recipe which will be performed.  This could be one of serveral types of recipes depending on the vox job type */;
  endQuality: Decimal | null /** The player specified end quality for a substance. Only for Purify jobs */;
  usedRepairPoints:
    | number
    | null /** How many repair points will be used when repairing the item. Only for Repair jobs */;
  startTime: Date | null /** What time the job was started.  The job must be in the Running or Finished state for this information to be valid. */;
  ingredients:
    | (Item | null)[]
    | null /** A list of all ingredients that are currently stored in the vox.  These are destroyed at the end of the job */;
  grindRecipe: GrindRecipeDefRef | null /** The grind recipe details. Only for Grind jobs */;
  purifyRecipe: PurifyRecipeDefRef | null /** The purify recipe details. Only for Purify jobs */;
  blockRecipe: BlockRecipeDefRef | null /** The block recipe details. Only for Block jobs */;
  shapeRecipe: ShapeRecipeDefRef | null /** The shape recipe details. Only for Shape jobs */;
  makeRecipe: MakeRecipeDefRef | null /** The make recipe details. Only for Make jobs */;
}
/** World.GrindRecipeDefRef */
export interface GrindRecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  ingredientItem: ItemDefRef | null /** Required item template of the ingredient */;
  outputItem: ItemDefRef | null /** Item template for the item produced by this recipe */;
}
/** World.PurifyRecipeDefRef */
export interface PurifyRecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  ingredientItem: ItemDefRef | null /** Required item template of the ingredient */;
  outputItem: ItemDefRef | null /** Item template for the item produced by this recipe */;
}
/** World.BlockRecipeDefRef */
export interface BlockRecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  outputItem: ItemDefRef | null /** The template of the block item which will be produced by this recipe */;
  ingredients:
    | (RecipeIngredientDef | null)[]
    | null /** Ingredient rules for crafting the item */;
}
/** World.RecipeIngredientDef */
export interface RecipeIngredientDef {
  ingredient: ItemDefRef | null /** The item required by this part of the recipe */;
  requirementPath:
    | string
    | null /** Extra requirements on the item, not used if the ingredient is provided. */;
  minPercent: Decimal | null /** The minimum bounds for the percent of this ingredient is required.  Percent is calculated by: ingredientUnitCount/sumUnitCountOfAllIngredients */;
  maxPercent: Decimal | null /** The maximum bounds for the percent of this ingredient is required.  Percent is calculated by: ingredientUnitCount/sumUnitCountOfAllIngredients */;
  minQuality: Decimal | null /** The minimum quality the ingredient must be.  Value is 0-1 */;
  maxQuality: Decimal | null /** The maximum quality the ingredient must be.  Value is 0-1 */;
}
/** World.ShapeRecipeDefRef */
export interface ShapeRecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  realmUse: (Faction | null)[] | null;
  infusionSlots: number | null;
  infuseAmountAllowed: Decimal | null;
  outputItem: ItemDefRef | null /** The item template for the item produced by this recipe */;
  lossPercent: Decimal | null /** What percentage of the substances added to the crafting job will be lost in the crafting process */;
  ingredients:
    | (RecipeIngredientDef | null)[]
    | null /** Input ingredients required for this recipe */;
}
/** World.MakeRecipeDefRef */
export interface MakeRecipeDefRef {
  id: string | null /** Unique recipe identifier */;
  outputItem: ItemDefRef | null /** The item this recipe creates */;
  ingredients: (MakeIngredientDef | null)[] | null /** Ingredient rules */;
}
/** World.MakeIngredientDef */
export interface MakeIngredientDef {
  slot: SubItemSlot | null /** The name of the slot this ingredient will go in */;
  ingredient: ItemDefRef | null /** The specific ingredient required by this ingredient rule.  If this is empty, the recipe does not required a specific item. */;
  requirementDescription:
    | string
    | null /** Additional requirements for the ingredient */;
  minQuality: Decimal | null /** The minimum quality the ingredient must be.  Value is 0-1 */;
  maxQuality: Decimal | null /** The maximum quality the ingredient must be.  Value is 0-1 */;
  unitCount:
    | number
    | null /** How many of this item are required to create one copy of the output item */;
}
/** World.PossibleVoxIngredientGQL */
export interface PossibleVoxIngredientGQL {
  item: Item | null;
  slots: (SubItemSlot | null)[] | null;
}
/** ServerLib.ApiModels.Channel */
export interface Channel {
  id: number | null;
  name: string | null;
  description: string | null;
  permissions: PatchPermissions | null;
}
/** The root subscriptions object. */
export interface CUSubscription {
  myInventoryItems: Item | null /** Real-time updates for inventory items */;
  passiveAlerts: PassiveAlert | null /** Alerts that notify players something happened but do not need to be reacted to. */;
  interactiveAlerts: IInteractiveAlert | null /** Alerts */;
  secureTradeUpdates: ISecureTradeUpdate | null /** Updates to a secure trade */;
}
/** CU.Permissions.PermissionInfo */
export interface PermissionInfo {
  id: string | null;
  name: string | null;
  description: string | null;
  enables: (string | null)[] | null;
}
/** CU.ServerStatus.BuildServerStatusDetail */
export interface BuildServerStatusDetail {
  serverName: string | null;
  timestamp: Date | null;
  state: States | null;
  id: ChannelID | null;
  isBuilding: boolean | null;
  buildStart: Date | null;
  buildFinished: Date | null;
}
/** CU.ServerStatus.ShardState */
export interface ShardState {
  shardID: number | null;
  activeGroupCount: number | null;
  playersInWarbands: number | null;
  playersInBattlegroups: number | null;
}
/** CU.ServerStatus.GroupServerStatusDetail */
export interface GroupServerStatusDetail {
  serverName: string | null;
  state: States | null;
  timestamp: Date | null;
  uptime: string | null;
  buildNumber: number | null;
  groupInfo: (ShardState | null)[] | null;
}
/** CU.ServerStatus.PatchChannelStatus */
export interface PatchChannelStatus {
  id: number | null;
  isUpdating: boolean | null;
  lastUpdated: Date | null;
  fileCount: number | null;
  compressedSize: number | null;
  uncompressedSize: number | null;
}
/** CU.ServerStatus.PatchServerStatusDetail */
export interface PatchServerStatusDetail {
  serverName: string | null;
  timestamp: Date | null;
  state: States | null;
  channels: (PatchChannelStatus | null)[] | null;
}
/** CU.ServerStatus.WebAPIStatusDetail */
export interface WebAPIStatusDetail {
  serverName: string | null;
  state: States | null;
  asyncRPC: (AsyncRPCConnectionStatus | null)[] | null;
  worldState: (WorldStateStatus | null)[] | null;
  timestamp: Date | null;
  uptime: string | null;
  buildNumber: number | null;
}
/** CU.Groups.CustomRank */
export interface CustomRank {
  level: number | null;
  name: string | null;
  groupID: GroupID | null;
  permissions: (PermissionInfo | null)[] | null;
}
/** CU.Databases.Models.CharacterStatProgressionDBModel */
export interface CharacterStatProgressionDBModel {
  bonusPoints: number | null;
  progressionPoints: number | null;
}
/** CU.Databases.Models.SkillPartProgressionDBModel */
export interface SkillPartProgressionDBModel {
  level: number | null;
  progressionPoints: number | null;
}
/** CU.Databases.Models.Content.PatcherAlert */
export interface PatcherAlert {
  message: string | null /** HTML Content for the patcher alert. */;
  id: string | null;
  utcDisplayStart: Date | null;
  utcDisplayEnd: Date | null;
  utcCreated: Date | null;
}
/** CU.Databases.Models.Progression.Logs.ScenarioSummaryDBModel+TeamOutcomeScenario */
export interface TeamOutcomeScenario {
  teamID: ScenarioTeamID | null;
  outcome: ScenarioOutcome | null;
}
/** CSE.Euler3f */
export interface Euler3f {
  x: Decimal | null;
  y: Decimal | null;
  z: Decimal | null;
}
/** CSEUtilsNET.GraphiteRenderJson */
export interface GraphiteRenderJson {
  target: string | null;
  datapoints: (Decimal | null)[][] | null;
}
/** World.SecureTradeLocation */
export interface SecureTradeLocation {
  characterID: CharacterID | null /** The character that currently owns this item */;
}
/** World.BlockDef */
export interface BlockDef {
  id: string | null /** Unique block identifier */;
}
/** World.SiegeEngineItemDef */
export interface SiegeEngineItemDef {
  id: string | null /** Unique identifier for this definition */;
}
/** World.WeaponConfigDef */
export interface WeaponConfigDef {
  id: string | null /** Unique weapon identifier */;
  weaponType: WeaponType | null /** The weapon type field */;
  ammo: boolean | null /** If true, this item is some kind of ammunition */;
}
/** World.FactionTrait */
export interface FactionTrait {
  required: boolean | null /** Whether or not this is a required trait. */;
  category: TraitCategory | null /** Category */;
  id: string | null;
  name: string | null /** The name of this trait */;
  icon: string | null /** Url for the icon for this trait */;
  description: string | null /** The description of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  exclusives: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** World.RaceTrait */
export interface RaceTrait {
  required: boolean | null /** Whether or not this is a required trait. */;
  category: TraitCategory | null /** Category */;
  id: string | null;
  name: string | null /** The name of this trait */;
  icon: string | null /** Url for the icon for this trait */;
  description: string | null /** The description of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  exclusives: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** World.ClassTrait */
export interface ClassTrait {
  required: boolean | null /** Whether or not this is a required trait. */;
  category: TraitCategory | null /** Category */;
  id: string | null;
  name: string | null /** The name of this trait */;
  icon: string | null /** Url for the icon for this trait */;
  description: string | null /** The description of this trait */;
  points: number | null /** The point value of this trait */;
  prerequisites:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that are required to be selected in order to select this trait */;
  ranks:
    | (string | null)[]
    | null /** THIS CURRENTLY RETURNS NULL. List of trait id's that act as pointers to different ranks of a trait */;
  exclusives: ExclusiveTraitsInfo | null /** THIS CURRENTLY RETURNS NULL. List of exclusive groups. An exclusive group describes traits that can only be picked up to a certain amount of points. */;
  specifier: string | null /** Specifies the defining type based on category */;
}
/** ServerLib.GraphQL.SG1Member */
export interface SG1Member extends Character {
  name: string | null;
  race: string | null;
  rank: string | null;
}
/** ServerLib.GraphQL.Goauld */
export interface Goauld extends Character {
  name: string | null;
  race: string | null;
  homePlanet: string | null;
}
/** ServerLib.GraphQL.Models.GroupAlert */
export interface GroupAlert extends IInteractiveAlert {
  category: AlertCategory | null;
  targetID: CharacterID | null;
  when: number | null;
  kind: GroupAlertKind | null;
  fromName: string | null;
  fromID: CharacterID | null;
  forGroup: GroupID | null;
  forGroupName: string | null;
  code: InviteCode | null;
}
/** ServerLib.GraphQL.Models.TradeAlert */
export interface TradeAlert extends IInteractiveAlert {
  targetID: CharacterID | null;
  when: number | null;
  otherEntityID: EntityID | null;
  otherName: string | null;
  category: AlertCategory | null;
  kind: TradeAlertKind | null;
  secureTradeID: SecureTradeInstanceID | null;
}
/** ServerLib.GraphQL.Models.ProgressionAlert */
export interface ProgressionAlert extends IInteractiveAlert {
  targetID: CharacterID | null;
  when: number | null;
  category: AlertCategory | null;
}
/** ServerLib.GraphQL.Models.SecureTradeCompletedUpdate */
export interface SecureTradeCompletedUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
  reason: SecureTradeDoneReason | null;
}
/** ServerLib.GraphQL.Models.SecureTradeStateUpdate */
export interface SecureTradeStateUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
  otherEntityState: SecureTradeState | null;
}
/** ServerLib.GraphQL.Models.SecureTradeItemUpdate */
export interface SecureTradeItemUpdate extends ISecureTradeUpdate {
  category: SecureTradeUpdateCategory | null;
  targetID: CharacterID | null;
  tradeID: SecureTradeInstanceID | null;
  otherEntityItems: (Item | null)[] | null;
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
export interface CharactercharacterArgs {
  id: string | null;
  shard: number | null;
}
export interface MotdmotdArgs {
  channel:
    | number
    | null /** Required: Channel ID from which to return message of the day */;
}
export interface PatchNotespatchNotesArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
  channel:
    | number
    | null /** Required: Channel ID from which to return patch notes. */;
}
export interface PatchNotepatchNoteArgs {
  id: string | null /** Required: ID of the patch note. */;
}
export interface PatcherAlertspatcherAlertsArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return. */;
}
export interface PatcherHeropatcherHeroArgs {
  from: Date | null /** Optional: Oldest date (non-inclusive) from which to return patch notes. */;
  to: Date | null /** Optional: Newest date (non-inclusive) from which to return patch notes. */;
}
export interface ScenariosummaryscenariosummaryArgs {
  id: string | null /** Scenario Instance ID. (required) */;
  shard: number | null /** The id of the shard to request data from. */;
}
export interface ItemitemArgs {
  shard: number | null /** Shard ID. (required) */;
  id: string | null /** Item ID. (required) */;
}
export interface BuildingPlotByInstanceIdbuildingPlotByInstanceIDArgs {
  id: string | null /** Building Plot Instance ID. */;
}
export interface BuildingPlotByEntityIdbuildingPlotByEntityIDArgs {
  id: string | null /** Building Plot entity ID. */;
}
export interface ShardprogressionshardprogressionArgs {
  shard:
    | number
    | null /** The id of the shard to request progression data from. */;
}
export interface EntityItemsentityItemsArgs {
  id: string | null /** Entity ID. (required) */;
}
export interface ResourceNoderesourceNodeArgs {
  shard: number | null /** Shard ID. (required) */;
  id: string | null /** Entity ID. (required) */;
}
export interface SkillskillArgs {
  id: number | null /** ID of the skill. */;
  shard: number | null /** Shard ID to look for the skill. */;
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
export interface CurrentPlayerCountcurrentPlayerCountArgs {
  server: string | null /** Server ShardID */;
  shard: number | null /** Server ShardID */;
}
export interface DayLogByIddayLogByIDArgs {
  logID: string | null /** The id of the log to look for. (required) */;
}
export interface DayBySummaryNumberdayBySummaryNumberArgs {
  summaryNumber:
    | string
    | null /** The summary number of the log to look for. (required) */;
}
export interface AdjustmentsByDayLogIdadjustmentsByDayLogIDArgs {
  logID:
    | string
    | null /** The id of the log to look for adjustments for. (required) */;
}
export interface CharacterDayscharacterDaysArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface CharacterAdjustmentscharacterAdjustmentsArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface AccountSummaryaccountSummaryArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface ProgressionDaySummaryprogressionDaySummaryArgs {
  logID: string | null /** The specific day to look for */;
}
export interface ShardDaysshardDaysArgs {
  skip: number | null /** The number of entries to skip. */;
  limit: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface ProgressionSummaryRangeprogressionSummaryRangeArgs {
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface AdjustmentsSummaryadjustmentsSummaryArgs {
  logID:
    | string
    | null /** The specific day to look for, used instead of date range if specified. */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface ScenarioSummariesscenarioSummariesArgs {
  skip: number | null /** The number of entries to skip. */;
  limit: number | null /** Maximum number of entries to return. (max: 30) */;
  startDate: Date | null /** The starting date to look for. */;
  endDate: Date | null /** The ending date to look for. */;
}
export interface RealmSummaryrealmSummaryArgs {
  shardDayID: string | null /** The specific log to look for */;
  faction: string | null /** The faction to look for */;
}
export interface PossibleIngredientspossibleIngredientsArgs {
  slot:
    | string
    | null /** The slot to get ingredients for. (required) - Valid values: Invalid, PrimaryIngredient, SecondaryIngredient1, SecondaryIngredient2, SecondaryIngredient3, SecondaryIngredient4, Alloy, WeaponBlade, WeaponHandle, NonRecipe */;
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
/** CU.Groups.InviteStatus */
export enum InviteStatus {
  Active = "Active",
  Revoked = "Revoked",
  UsageLimitReached = "UsageLimitReached",
  Expired = "Expired"
}
/** CU.Groups.GroupTypes */
export enum GroupTypes {
  Warband = "Warband",
  Battlegroup = "Battlegroup",
  Order = "Order",
  Campaign = "Campaign"
}
/** CU.PlayerStat */
export enum PlayerStat {
  Strength = "Strength",
  Dexterity = "Dexterity",
  Agility = "Agility",
  Vitality = "Vitality",
  Endurance = "Endurance",
  Attunement = "Attunement",
  Will = "Will",
  Faith = "Faith",
  Resonance = "Resonance",
  Eyesight = "Eyesight",
  Hearing = "Hearing",
  Presence = "Presence",
  Clarity = "Clarity",
  Affinity = "Affinity",
  Mass = "Mass",
  MaxMoveSpeed = "MaxMoveSpeed",
  MoveAcceleration = "MoveAcceleration",
  MaxTurnSpeed = "MaxTurnSpeed",
  Vision = "Vision",
  Detection = "Detection",
  Encumbrance = "Encumbrance",
  EncumbranceReduction = "EncumbranceReduction",
  CarryCapacity = "CarryCapacity",
  MaxPanic = "MaxPanic",
  PanicDecay = "PanicDecay",
  MaxHP = "MaxHP",
  HealthRegeneration = "HealthRegeneration",
  MaxStamina = "MaxStamina",
  StaminaRegeneration = "StaminaRegeneration",
  AbilityPreparationSpeed = "AbilityPreparationSpeed",
  AbilityRecoverySpeed = "AbilityRecoverySpeed",
  CooldownSpeed = "CooldownSpeed",
  Age = "Age",
  Concealment = "Concealment",
  VeilSubtlety = "VeilSubtlety",
  VeilResist = "VeilResist",
  HealingReceivedBonus = "HealingReceivedBonus",
  EnhancementDuration = "EnhancementDuration",
  HeatTolerance = "HeatTolerance",
  ColdTolerance = "ColdTolerance",
  MaxBlood = "MaxBlood",
  BloodRegeneration = "BloodRegeneration",
  EffectPowerBonus = "EffectPowerBonus",
  None = "None"
}
/** CU.Faction */
export enum Faction {
  Factionless = "Factionless",
  TDD = "TDD",
  Viking = "Viking",
  Arthurian = "Arthurian",
  COUNT = "COUNT"
}
/** CU.Race */
export enum Race {
  Tuatha = "Tuatha",
  Hamadryad = "Hamadryad",
  Luchorpan = "Luchorpan",
  Firbog = "Firbog",
  Valkyrie = "Valkyrie",
  Helbound = "Helbound",
  FrostGiant = "FrostGiant",
  Dvergr = "Dvergr",
  Strm = "Strm",
  CaitSith = "CaitSith",
  Golem = "Golem",
  Gargoyle = "Gargoyle",
  StormRider = "StormRider",
  StormRiderT = "StormRiderT",
  StormRiderV = "StormRiderV",
  HumanMaleV = "HumanMaleV",
  HumanMaleA = "HumanMaleA",
  HumanMaleT = "HumanMaleT",
  Pict = "Pict",
  Any = "Any"
}
/** CU.Gender */
export enum Gender {
  None = "None",
  Male = "Male",
  Female = "Female"
}
/** CU.Archetype */
export enum Archetype {
  None = "None",
  EarthMage = "EarthMage",
  WaterMage = "WaterMage",
  Fighter = "Fighter",
  Healer = "Healer",
  Archer = "Archer",
  MeleeCombatTest = "MeleeCombatTest",
  ArcherTest = "ArcherTest",
  BlackKnight = "BlackKnight",
  Fianna = "Fianna",
  Mjolnir = "Mjolnir",
  Physician = "Physician",
  Empath = "Empath",
  Stonehealer = "Stonehealer",
  Blackguard = "Blackguard",
  ForestStalker = "ForestStalker",
  WintersShadow = "WintersShadow",
  FireMage = "FireMage",
  Any = "Any"
}
/** World.TraitCategory */
export enum TraitCategory {
  General = "General",
  Faction = "Faction",
  Race = "Race",
  Class = "Class"
}
/** World.SkillTracks */
export enum SkillTracks {
  None = "None",
  PrimaryWeapon = "PrimaryWeapon",
  SecondaryWeapon = "SecondaryWeapon",
  BothWeapons = "BothWeapons",
  Voice = "Voice",
  Mind = "Mind",
  All = "All",
  ErrorFlag = "ErrorFlag",
  EitherWeaponPreferPrimary = "EitherWeaponPreferPrimary",
  EitherWeaponPreferSecondary = "EitherWeaponPreferSecondary",
  ChoiceFlags = "ChoiceFlags"
}
/** CSEUtilsNET.ChannelID */
export enum ChannelID {
  None = "None"
}
/** CU.Databases.Models.Progression.Logs.ScenarioResolution */
export enum ScenarioResolution {
  Started = "Started",
  Finished = "Finished",
  Restarted = "Restarted",
  Killed = "Killed"
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
/** CU.Databases.Models.Progression.ProgressionCharacterType */
export enum ProgressionCharacterType {
  Unknown = "Unknown",
  PlayerCharacter = "PlayerCharacter",
  NonPlayerCharacter = "NonPlayerCharacter",
  Dummy = "Dummy"
}
/** World.ItemPlacementType */
export enum ItemPlacementType {
  None = "None",
  Door = "Door",
  Plot = "Plot"
}
/** CU.ZoneType */
export enum ZoneType {
  None = "None",
  Home = "Home",
  Builder = "Builder",
  Contested = "Contested"
}
/** armor stat calculation types are used when computing how much of an effect a piece of equipped armor has on a per GearSlot basis. */
export enum ArmorStatCalculationType {
  None = "None",
  Average = "Average",
  Add = "Add"
}
/** World.GearLayerType */
export enum GearLayerType {
  Unknown = "Unknown",
  Weapon = "Weapon",
  Armor = "Armor"
}
/** CU.Skills.SubpartId */
export enum SubpartId {
  None = "None",
  _BODY_PART_COUNT = "_BODY_PART_COUNT",
  Any = "Any",
  _BUILDING_VAL = "_BUILDING_VAL",
  _BODY_VAL = "_BODY_VAL",
  _BODY_BEGIN = "_BODY_BEGIN",
  Head = "Head",
  LeftArm = "LeftArm",
  RightArm = "RightArm",
  LeftLeg = "LeftLeg",
  RightLeg = "RightLeg",
  _BODY_END = "_BODY_END",
  _SINGULAR_VAL = "_SINGULAR_VAL",
  _TYPE_MASK = "_TYPE_MASK"
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
  SiegeEngine = "SiegeEngine"
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
/** World.Items.ItemEquipRequirement+EquipRequirementStatus */
export enum EquipRequirementStatus {
  Unknown = "Unknown",
  NoRequirement = "NoRequirement",
  RequirementMet = "RequirementMet",
  RequirementNotMet = "RequirementNotMet",
  NoCharacterContext = "NoCharacterContext"
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
/** CU.Databases.Models.Permissibles.PermissibleSetKeyType */
export enum PermissibleSetKeyType {
  Invalid = "Invalid",
  Faction = "Faction",
  ScenarioTeam = "ScenarioTeam",
  ScenarioRole = "ScenarioRole"
}
/** World.ItemActionUIReaction */
export enum ItemActionUIReaction {
  None = "None",
  CloseInventory = "CloseInventory",
  PlacementMode = "PlacementMode",
  OpenMiniMap = "OpenMiniMap"
}
/** World.BuildingPlotResult+PlotContestedState */
export enum PlotContestedState {
  Invalid = "Invalid",
  Contested = "Contested",
  NonContested = "NonContested",
  ChangingControl = "ChangingControl"
}
/** CU.Databases.Models.Progression.Logs.CharacterDaySummaryDBModel+States */
export enum States {
  Initial = "Initial",
  Handled = "Handled",
  Preserved = "Preserved"
}
/** World.SecureTradeState */
export enum SecureTradeState {
  None = "None",
  Invited = "Invited",
  ModifyingItems = "ModifyingItems",
  Locked = "Locked",
  Confirmed = "Confirmed"
}
/** ServerLib.GraphQL.Models.AlertCategory */
export enum AlertCategory {
  None = "None",
  Trade = "Trade",
  Group = "Group",
  Progression = "Progression"
}
/** ServerLib.Game.MapPointActionType */
export enum MapPointActionType {
  ClientCommand = "ClientCommand"
}
/** World.VoxState */
export enum VoxState {
  NotFound = "NotFound",
  NotOwnedByPlayer = "NotOwnedByPlayer",
  Found = "Found"
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
/** CU.Databases.Models.Items.VoxJobState */
export enum VoxJobState {
  None = "None",
  Configuring = "Configuring",
  Running = "Running",
  Finished = "Finished"
}
/** CU.Databases.Models.PatchPermissions */
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
/** ServerLib.GraphQL.Models.SecureTradeUpdateCategory */
export enum SecureTradeUpdateCategory {
  None = "None",
  Complete = "Complete",
  StateUpdate = "StateUpdate",
  ItemUpdate = "ItemUpdate"
}
/** World.WeaponType */
export enum WeaponType {
  NONE = "NONE",
  Arrow = "Arrow",
  Dagger = "Dagger",
  Sword = "Sword",
  Hammer = "Hammer",
  Axe = "Axe",
  Mace = "Mace",
  GreatSword = "GreatSword",
  GreatHammer = "GreatHammer",
  GreatAxe = "GreatAxe",
  GreatMace = "GreatMace",
  Spear = "Spear",
  Staff = "Staff",
  Polearm = "Polearm",
  Shield = "Shield",
  LongBow = "LongBow",
  ShortBow = "ShortBow",
  Throwing = "Throwing",
  Focus = "Focus",
  LongSword = "LongSword",
  All = "All"
}
/** ServerLib.GraphQL.Models.GroupAlertKind */
export enum GroupAlertKind {
  None = "None",
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
