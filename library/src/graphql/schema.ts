/* tslint:disable */

export interface CUQuery {
  orders: PagedOrders | null;
  order: Order | null;
  myOrder: Order | null;
  warbands: Array<Warband> | null;
  warband: Warband | null;
  myWarbands: Array<Warband> | null;
  traits: Array<Trait> | null;
  skillComponents: Array<SkillComponent> | null;
  skillNetworks: Array<SkillNetwork> | null;
  myCharacter: CUCharacter | null;
  character: CUCharacter | null;
  gearSlots: Array<GearSlotDefRef> | null;
  item: Item | null;
  entityItems: EntityItemResult | null;
  crafting: CraftingRecipes | null;
  myEquippedItems: Array<EquippedItem> | null;
  substances: Array<SubstanceDef> | null;
  myInventory: MyInventory | null;
}

export interface OrdersCUQueryArgs {
  shard: number | null;
  filter: string | null;
  count: number | null;
  skip: number | null;
  includeDisbanded: boolean | null;
  sort: string | null;
  reverseSort: boolean | null;
}

export interface OrderCUQueryArgs {
  id: string | null;
  shard: number | null;
}

export interface WarbandsCUQueryArgs {
  shard: number | null;
}

export interface WarbandCUQueryArgs {
  id: string | null;
  shard: number | null;
}

export interface CharacterCUQueryArgs {
  id: string | null;
  shard: number | null;
}

export interface ItemCUQueryArgs {
  shard: number | null;
  id: string | null;
}

export interface EntityItemsCUQueryArgs {
  id: string | null;
}

export interface PagedOrders {
  totalCount: number;
  data: Array<Order> | null;
}

export interface Order {
  created: Date;
  realm: Faction | null;
  id: string | null;
  members: Array<OrderMember> | null;
  memberCount: number | null;
  formerMembers: Array<OrderMember> | null;
  myMemberInfo: OrderMember | null;
  name: string | null;
  ranks: Array<CustomRank> | null;
  shard: number | null;
  permissions: Array<PermissionInfo> | null;
  creator: string | null;
  recentActions: Array<MemberAction> | null;
  invites: Array<Invite> | null;
  disbanded: boolean | null;
  disbandDate: Date | null;
}

export interface InvitesOrderArgs {
  limit: number | null;
  skip: number | null;
}

export type Date = any;

export type Faction = "FACTIONLESS" | "TDD" | "VIKING" | "ARTHURIAN" | "COUNT" | "Factionless" | "Viking" | "Arthurian";

export interface OrderMember {
  name: string | null;
  id: string | null;
  joined: Date;
  parted: Date;
  rank: CustomRank | null;
  extraPermissions: Array<PermissionInfo> | null;
  permissions: Array<PermissionInfo> | null;
  race: Race | null;
  gender: Gender | null;
  class: Class | null;
  lastLogin: Date | null;
  kills: number | null;
}

export interface CustomRank {
  name: string;
  level: number;
  permissions: Array<PermissionInfo> | null;
}

export interface PermissionInfo {
  tag: string | null;
  name: string;
  description: string;
  enables: Array<string> | null;
}

export type Race = "TUATHA" | "HAMADRYAD" | "LUCHORPAN" | "FIRBOG" | "VALKYRIE" | "HELBOUND" | "FROST_GIANT" | "DVERGR" | "STRM" | "CAIT_SITH" | "GOLEM" | "GARGOYLE" | "STORM_RIDER" | "STORM_RIDER_T" | "STORM_RIDER_V" | "HUMAN_MALE_V" | "HUMAN_MALE_A" | "HUMAN_MALE_T" | "PICT" | "ANY" | "Tuatha" | "Hamadryad" | "Luchorpan" | "Firbog" | "Valkyrie" | "Helbound" | "FrostGiant" | "Dvergr" | "Strm" | "CaitSith" | "Golem" | "Gargoyle" | "StormRider" | "StormRiderT" | "StormRiderV" | "HumanMaleV" | "HumanMaleA" | "HumanMaleT" | "Pict" | "Any";

export type Gender = "NONE" | "MALE" | "FEMALE" | "None" | "Male" | "Female";

export type Class = "FIRE_MAGE" | "EARTH_MAGE" | "WATER_MAGE" | "FIGHTER" | "HEALER" | "ARCHER" | "MELEE_COMBAT_TEST" | "ARCHER_TEST" | "BLACK_KNIGHT" | "FIANNA" | "MJOLNIR" | "PHYSICIAN" | "EMPATH" | "STONEHEALER" | "BLACKGUARD" | "FOREST_STALKER" | "WINTERS_SHADOW" | "ANY" | "FireMage" | "EarthMage" | "WaterMage" | "Fighter" | "Healer" | "Archer" | "MeleeCombatTest" | "ArcherTest" | "BlackKnight" | "Fianna" | "Mjolnir" | "Physician" | "Empath" | "Stonehealer" | "Blackguard" | "ForestStalker" | "WintersShadow" | "Any";

export interface MemberAction {
  id: string | null;
  memberID: string | null;
  type: MemberActionType | null;
  groupID: string | null;
  when: Date | null;
  message: string | null;
}

export type MemberActionType = "CREATED" | "DISBANDED" | "CHARACTER_JOINED" | "GROUP_JOINED" | "CHARACTER_QUIT" | "GROUP_QUIT" | "CHARACTER_KICKED" | "GROUP_KICKED" | "CHARACTER_INVITED" | "GROUP_INVITED" | "CHARACTER_ACCEPTED_INVITE" | "CHANGED_ROLE" | "ASSIGN_RANK" | "UPDATED_ROLE_PERMISSIONS" | "UPDATED_RANK_PERMISSIONS" | "CHANGED_NAME" | "CHARACTER_PERMISSIONS_CHANGED" | "GROUP_PERMISSIONS_CHANGED" | "CREATE_RANK" | "REMOVE_RANK" | "RENAME_RANK" | "ADD_RANK_PERMISSIONS" | "REMOVE_RANK_PERMISSIONS" | "SET_RANK_PERMISSIONS" | "CHANGE_RANK_LEVEL" | "TRANSFERED_OWNERSHIP" | "ABANDONDED" | "DEPOSITED_ITEM_IN_STASH" | "INVITED_ORDER" | "SHARED_COUNT" | "WITHDREW_ITEM_FROM_STASH" | "ORDER_ACCEPTED_INVITE" | "WARBAND_COUNT" | "DEPOSITED_CURRENCY_IN_STASH" | "ALLIANCE_COUNT" | "CHANGE_DISPLAY_ORDER" | "INVITED_ALLIANCE" | "ALLIANCE_SHARED_COUNT" | "WITHDREW_CURRENCY_FROM_STASH" | "ALLIANCE_ACCEPTED_INVITE" | "SET_LEADER" | "INVITED_WARBAND" | "ORDER_COUNT" | "WARBAND_ACCEPTED_INVITE" | "CAMPAIGN_COUNT" | "Created" | "Disbanded" | "CharacterJoined" | "GroupJoined" | "CharacterQuit" | "GroupQuit" | "CharacterKicked" | "GroupKicked" | "CharacterInvited" | "GroupInvited" | "CharacterAcceptedInvite" | "ChangedRole" | "AssignRank" | "UpdatedRolePermissions" | "UpdatedRankPermissions" | "ChangedName" | "CharacterPermissionsChanged" | "GroupPermissionsChanged" | "CreateRank" | "RemoveRank" | "RenameRank" | "AddRankPermissions" | "RemoveRankPermissions" | "SetRankPermissions" | "ChangeRankLevel" | "TransferedOwnership" | "DepositedItemInStash" | "WithdrewItemFromStash" | "DepositedCurrencyInStash" | "AllianceAcceptedInvite" | "OrderCount" | "WarbandAcceptedInvite" | "CampaignCount";

export type Invite = CharacterInvite | GroupInvite;

export interface CharacterInvite extends InviteInterface {
  id: string | null;
  inviteCode: string | null;
  groupID: string | null;
  groupType: GroupType | null;
  memberID: string | null;
  member: Character | null;
  inviteeID: string | null;
  invitee: Character | null;
  status: InviteStatus | null;
}

export interface InviteInterface {
  id: string | null;
  inviteCode: string | null;
  groupID: string | null;
  groupType: GroupType | null;
  memberID: string | null;
  member: Character | null;
  inviteeID: string | null;
  status: InviteStatus | null;
}

export type GroupType = "WARBAND" | "ORDER" | "ALLIANCE" | "CAMPAIGN" | "Warband" | "Order" | "Alliance" | "Campaign";

export interface Character {
  id: string | null;
  name: string | null;
  kills: number | null;
  race: Race | null;
  gender: Gender | null;
  realm: Faction | null;
  class: Class | null;
  lastLogin: Date | null;
  deleted: boolean | null;
  order: Order | null;
  invites: Array<CharacterInvite> | null;
}

export type InviteStatus = "ACTIVE" | "ACCEPTED" | "DECLINED" | "RESCINDED" | "EXPIRED" | "Active" | "Accepted" | "Declined" | "Rescinded" | "Expired";

export interface GroupInvite extends InviteInterface {
  id: string | null;
  inviteCode: string | null;
  groupID: string | null;
  groupType: GroupType | null;
  memberID: string | null;
  member: Character | null;
  inviteeID: string | null;
  status: InviteStatus | null;
}

export interface Warband {
  created: Date;
  realm: Faction | null;
  id: string | null;
  name: string | null;
  ranks: Array<CustomRank> | null;
  shard: number | null;
  permissions: Array<PermissionInfo> | null;
  creator: string | null;
  members: Array<WarbandMember> | null;
  memberCount: number | null;
  formerMembers: Array<WarbandMember> | null;
}

export interface WarbandMember {
  name: string | null;
  id: string | null;
  joined: Date;
  parted: Date;
  rank: string | null;
  extraPermissions: Array<string> | null;
  race: Race | null;
  gender: Gender | null;
  class: Class | null;
  lastLogin: Date | null;
  kills: number | null;
}

export interface Trait {
  id: string | null;
  name: string | null;
  icon: string | null;
  description: string | null;
  points: number | null;
  requires: boolean | null;
  category: string | null;
  specifer: string | null;
}

export interface SkillComponent {
  name: string;
  id: string | null;
  icon: string;
  cooldown: number;
  description: string;
  stage: AbilityComponentType | null;
  category: AbilityComponentSubType | null;
  track: number | null;
}

export type AbilityComponentType = "PRIMARY" | "SECONDARY" | "OPTIONAL_MODIFIER" | "SPECIAL_MODAL" | "INDEPENDANT_MODAL" | "Primary" | "Secondary" | "OptionalModifier" | "SpecialModal" | "IndependantModal";

export type AbilityComponentSubType = "NONE" | "RUNE" | "SHAPE" | "RANGE" | "SIZE" | "INFUSION" | "FOCUS" | "TRANSPOSITION" | "MAGICAL_TYPE" | "WEAPON" | "STYLE" | "SPEED" | "POTENTIAL" | "STANCE" | "PHYSICAL_TYPE" | "RANGED_WEAPON" | "LOAD" | "PREPARE" | "DRAW" | "AIM" | "RANGED_TYPE" | "VOICE" | "INSTRUMENT" | "SHOUT" | "SONG" | "INFLECTION" | "TECHNIQUE" | "SOUND_TYPE" | "STONE" | "DELIVERY" | "STONE_TYPE" | "RUNE_SELF" | "SHAPE_SELF" | "MAGIC_SELF" | "RUNE_NO_PARTS" | "MAGIC_NO_PARTS" | "RUNE_SELF_NO_PARTS" | "MAGIC_SELF_NO_PARTS" | "TARGET" | "SIEGE_WEAPON" | "SIEGE_LOAD" | "SIEGE_PREPARE" | "SIEGE_DRAW" | "SIEGE_AIM" | "None" | "Rune" | "Shape" | "Range" | "Size" | "Infusion" | "Focus" | "Transposition" | "MagicalType" | "Weapon" | "Style" | "Speed" | "Potential" | "Stance" | "PhysicalType" | "RangedWeapon" | "Load" | "Prepare" | "Draw" | "Aim" | "RangedType" | "Voice" | "Instrument" | "Shout" | "Song" | "Inflection" | "Technique" | "SoundType" | "Stone" | "Delivery" | "StoneType" | "RuneSelf" | "ShapeSelf" | "MagicSelf" | "RuneNoParts" | "MagicNoParts" | "RuneSelfNoParts" | "MagicSelfNoParts" | "Target" | "SiegeWeapon" | "SiegeLoad" | "SiegePrepare" | "SiegeDraw" | "SiegeAim";

export interface SkillNetwork {
  name: string;
  id: string | null;
  connections: Array<SkillNetworkConnection> | null;
  requiredParts: Array<AbilityComponentSubType> | null;
}

export interface SkillNetworkConnection {
  key: AbilityComponentSubType | null;
  values: Array<AbilityComponentSubType> | null;
}

export interface CUCharacter {
  name: string | null;
  id: CharacterID | null;
  faction: Faction | null;
  race: Race | null;
  gender: Gender | null;
  archetype: Archetype | null;
  order: GroupID | null;
}

export type CharacterID = any;

export type Archetype = "FireMage" | "EarthMage" | "WaterMage" | "Fighter" | "Healer" | "Archer" | "MeleeCombatTest" | "ArcherTest" | "BlackKnight" | "Fianna" | "Mjolnir" | "Physician" | "Empath" | "Stonehealer" | "Blackguard" | "ForestStalker" | "WintersShadow" | "Any";

export type GroupID = any;

export interface GearSlotDefRef {
  id: string | null;
  gearLayer: GearLayerDefRef | null;
  subpartIDs: Array<SubpartId> | null;
}

export interface GearLayerDefRef {
  id: string | null;
  armorStatCalculationType: ArmorStatCalculationType | null;
  gearLayerType: GearLayerType | null;
}

export type ArmorStatCalculationType = "None" | "Average" | "Add";

export type GearLayerType = "Unknown" | "Weapon" | "Armor";

export type SubpartId = "None" | "_BODY_PART_COUNT" | "Any" | "_BUILDING_VAL" | "_BODY_VAL" | "_BODY_BEGIN" | "Head" | "LeftArm" | "RightArm" | "LeftLeg" | "RightLeg" | "_BODY_END" | "_SINGULAR_VAL" | "_TYPE_MASK";

export interface Item {
  givenName: string | null;
  id: ItemInstanceID | null;
  shardID: ShardID | null;
  stackHash: ItemStackHash | null;
  staticDefinition: ItemDefRef | null;
  stats: ItemStatsDescription | null;
  name: string | null;
  containedItems: Array<Item> | null;
  voxItems: Array<Item> | null;
  location: ItemLocationDescription | null;
}

export type ItemInstanceID = any;

export type ShardID = any;

export type ItemStackHash = any;

export interface ItemDefRef {
  id: string | null;
  iconUrl: string | null;
  name: string | null;
  description: string | null;
  tags: Array<string> | null;
  isVox: boolean | null;
  gearSlotSets: Array<GearSlotSet> | null;
  itemType: ItemType | null;
}

export interface GearSlotSet {
  gearSlots: Array<GearSlotDefRef> | null;
}

export type ItemType = "Basic" | "Vox" | "Ammo" | "Armor" | "Weapon" | "Block" | "Alloy" | "Substance" | "SiegeEngine";

export interface ItemStatsDescription {
  item: ItemStat_Single | null;
  alloy: AlloyStat_Single | null;
  substance: SubstanceStat_Single | null;
  durability: DurabilityStat_Single | null;
  weapon: WeaponStat_Single | null;
  block: BuildingBlockStat_Single | null;
  container: ContainerStat_Single | null;
  siegeEngine: SiegeEngineStat_Single | null;
  armor: ArmorParts | null;
}

export interface ItemStat_Single {
  quality: number | null;
  selfMass: number | null;
  totalMass: number | null;
  encumbrance: number | null;
  agilityRequirement: number | null;
  dexterityRequirement: number | null;
  strengthRequirement: number | null;
  unitCount: number | null;
}

export interface AlloyStat_Single {
  hardness: number | null;
  impactToughness: number | null;
  fractureChance: number | null;
  malleability: number | null;
  massPCF: number | null;
  density: number | null;
  meltingPoint: number | null;
  thermConductivity: number | null;
  slashingResistance: number | null;
  piercingResistance: number | null;
  crushingResistance: number | null;
  acidResistance: number | null;
  poisonResistance: number | null;
  diseaseResistance: number | null;
  earthResistance: number | null;
  waterResistance: number | null;
  fireResistance: number | null;
  airResistance: number | null;
  lightningResistance: number | null;
  frostResistance: number | null;
  lifeResistance: number | null;
  mindResistance: number | null;
  spiritResistance: number | null;
  radiantResistance: number | null;
  deathResistance: number | null;
  shadowResistance: number | null;
  chaosResistance: number | null;
  voidResistance: number | null;
  arcaneResistance: number | null;
  magicalResistance: number | null;
  hardnessFactor: number | null;
  strengthFactor: number | null;
  fractureFactor: number | null;
  massFactor: number | null;
  damageResistance: number | null;
}

export interface SubstanceStat_Single {
  hardness: number | null;
  impactToughness: number | null;
  fractureChance: number | null;
  malleability: number | null;
  massPCF: number | null;
  density: number | null;
  meltingPoint: number | null;
  thermConductivity: number | null;
  slashingResistance: number | null;
  piercingResistance: number | null;
  crushingResistance: number | null;
  acidResistance: number | null;
  poisonResistance: number | null;
  diseaseResistance: number | null;
  earthResistance: number | null;
  waterResistance: number | null;
  fireResistance: number | null;
  airResistance: number | null;
  lightningResistance: number | null;
  frostResistance: number | null;
  lifeResistance: number | null;
  mindResistance: number | null;
  spiritResistance: number | null;
  radiantResistance: number | null;
  deathResistance: number | null;
  shadowResistance: number | null;
  chaosResistance: number | null;
  voidResistance: number | null;
  arcaneResistance: number | null;
  magicalResistance: number | null;
  hardnessFactor: number | null;
  strengthFactor: number | null;
  fractureFactor: number | null;
  massFactor: number | null;
}

export interface DurabilityStat_Single {
  maxRepairPoints: number | null;
  maxDurability: number | null;
  fractureThreshold: number | null;
  fractureChance: number | null;
  currentRepairPoints: number | null;
  currentDurability: number | null;
}

export interface WeaponStat_Single {
  piercingDamage: number | null;
  piercingBleed: number | null;
  piercingArmorPenetration: number | null;
  slashingDamage: number | null;
  slashingBleed: number | null;
  slashingArmorPenetration: number | null;
  crushingDamage: number | null;
  fallbackCrushingDamage: number | null;
  disruption: number | null;
  deflectionAmount: number | null;
  physicalProjectileSpeed: number | null;
  knockbackAmount: number | null;
  stability: number | null;
  falloffMinDistance: number | null;
  falloffMaxDistance: number | null;
  falloffReduction: number | null;
  deflectionRecovery: number | null;
  staminaCost: number | null;
  physicalPreparationTime: number | null;
  physicalRecoveryTime: number | null;
  range: number | null;
}

export interface BuildingBlockStat_Single {
  compressiveStrength: number | null;
  shearStrength: number | null;
  tensileStrength: number | null;
  density: number | null;
  healthUnits: number | null;
  buildTimeUnits: number | null;
  unitMass: number | null;
}

export interface ContainerStat_Single {
  maxItemCount: number | null;
  maxItemMass: number | null;
}

export interface SiegeEngineStat_Single {
  health: number | null;
  yawSpeedDegPerSec: number | null;
  pitchSpeedDegPerSec: number | null;
}

export interface ArmorParts {
  neck: ArmorStats | null;
  face: ArmorStats | null;
  shoulderRightUnder: ArmorStats | null;
  waist: ArmorStats | null;
  back: ArmorStats | null;
  thighsUnder: ArmorStats | null;
  forearmRightUnder: ArmorStats | null;
  forearmLeft: ArmorStats | null;
  feetUnder: ArmorStats | null;
  feet: ArmorStats | null;
  handLeft: ArmorStats | null;
  chest: ArmorStats | null;
  forearmRight: ArmorStats | null;
  backUnder: ArmorStats | null;
  skullUnder: ArmorStats | null;
  shoulderLeft: ArmorStats | null;
  waistUnder: ArmorStats | null;
  shins: ArmorStats | null;
  neckUnder: ArmorStats | null;
  handRightUnder: ArmorStats | null;
  forearmLeftUnder: ArmorStats | null;
  cloak: ArmorStats | null;
  shoulderLeftUnder: ArmorStats | null;
  chestUnder: ArmorStats | null;
  handRight: ArmorStats | null;
  shoulderRight: ArmorStats | null;
  skull: ArmorStats | null;
  thighs: ArmorStats | null;
  handLeftUnder: ArmorStats | null;
  shinsUnder: ArmorStats | null;
  faceUnder: ArmorStats | null;
}

export interface ArmorStats {
  stats: ArmorStat_Single | null;
  resistances: DamageType_Single | null;
  mitigations: DamageType_Single | null;
}

export interface ArmorStat_Single {
  armorClass: number | null;
}

export interface DamageType_Single {
  none: number | null;
  slashing: number | null;
  piercing: number | null;
  crushing: number | null;
  physical: number | null;
  acid: number | null;
  poison: number | null;
  disease: number | null;
  earth: number | null;
  water: number | null;
  fire: number | null;
  air: number | null;
  lightning: number | null;
  frost: number | null;
  elemental: number | null;
  life: number | null;
  mind: number | null;
  spirit: number | null;
  radiant: number | null;
  light: number | null;
  death: number | null;
  shadow: number | null;
  chaos: number | null;
  void: number | null;
  dark: number | null;
  arcane: number | null;
  other: number | null;
  sYSTEM: number | null;
  all: number | null;
}

export interface ItemLocationDescription {
  equipped: EquippedLocation | null;
  inContainer: InContainerLocation | null;
  inVox: InVoxJobLocation | null;
  inventory: InventoryLocation | null;
  ground: OnGroundLocation | null;
}

export interface EquippedLocation {
  characterID: CharacterID | null;
  gearSlots: Array<GearSlotDefRef> | null;
}

export interface InContainerLocation {
  containerInstanceID: ItemInstanceID | null;
  position: number | null;
}

export interface InVoxJobLocation {
  voxInstanceID: ItemInstanceID | null;
  itemSlot: SubItemSlot | null;
}

export type SubItemSlot = "INVALID" | "PRIMARY_SUBSTANCE" | "SECONDARY_SUBSTANCE_1" | "SECONDARY_SUBSTANCE_2" | "SECONDARY_SUBSTANCE_3" | "ALLOY" | "WEAPON_BLADE" | "WEAPON_HANDLE" | "NON_RECIPE";

export interface InventoryLocation {
  characterID: CharacterID | null;
  position: number | null;
}

export interface OnGroundLocation {
  groupID: ItemInstanceID | null;
}

export interface EntityItemResult {
  items: Array<Item> | null;
}

export interface CraftingRecipes {
  voxStatus: VoxStatus | null;
  recipesMatchingIngredients: Array<string> | null;
  possibleIngredients: Array<Item> | null;
  possibleItemSlots: Array<SubItemSlot> | null;
  blockRecipes: Array<BlockRecipeDefRef> | null;
  purifyRecipes: Array<PurifyRecipeDefRef> | null;
  grindRecipes: Array<GrindRecipeDefRef> | null;
  refineRecipes: Array<RefineRecipeDefRef> | null;
  shapeRecipes: Array<ShapeRecipeDefRef> | null;
  makeRecipes: Array<MakeRecipeDefRef> | null;
}

export interface PossibleIngredientsCraftingRecipesArgs {
  slot: SubItemSlot | null;
}

export interface VoxStatus {
  voxState: VoxState | null;
  jobType: string | null;
  jobState: VoxJobState | null;
  ingredients: Array<Item> | null;
  outputItems: Array<Item> | null;
  totalCraftingTime: number | null;
  timeRemaining: number | null;
  givenName: string | null;
  itemCount: number | null;
  recipeID: string | null;
  endQuality: number | null;
  usedRepairPoints: number | null;
  startTime: Date | null;
  grindRecipe: GrindRecipeDefRef | null;
  purifyRecipe: PurifyRecipeDefRef | null;
  blockRecipe: BlockRecipeDefRef | null;
  refineRecipe: RefineRecipeDefRef | null;
  shapeRecipe: ShapeRecipeDefRef | null;
  makeRecipe: MakeRecipeDefRef | null;
}

export type VoxState = "NotFound" | "NotOwnedByPlayer" | "Found";

export type VoxJobState = "None" | "Configuring" | "Running" | "Finished";

export interface GrindRecipeDefRef {
  id: string | null;
  ingredientItem: ItemDefRef | null;
  outputItem: ItemDefRef | null;
}

export interface PurifyRecipeDefRef {
  id: string | null;
  ingredientItem: ItemDefRef | null;
  outputItem: ItemDefRef | null;
}

export interface BlockRecipeDefRef {
  id: string | null;
  outputItem: ItemDefRef | null;
  ingredients: Array<RecipeIngredientDef> | null;
}

export interface RecipeIngredientDef {
  ingredient: ItemDefRef | null;
  requirementPath: string | null;
  minPercent: Decimal | null;
  maxPercent: Decimal | null;
  minQuality: number | null;
  maxQuality: number | null;
}

export type Decimal = any;

export interface RefineRecipeDefRef {
  id: string | null;
  ingredientItem: ItemDefRef | null;
}

export interface ShapeRecipeDefRef {
  id: string | null;
  outputItem: ItemDefRef | null;
  ingredients: Array<RecipeIngredientDef> | null;
}

export interface MakeRecipeDefRef {
  id: string | null;
  outputItemDef: ItemDefRef | null;
  ingredients: Array<MakeIngredientDef> | null;
}

export interface MakeIngredientDef {
  slot: SubItemSlot | null;
  ingredientDef: ItemDefRef | null;
  requirementDescription: string | null;
  minQuality: number | null;
  maxQuality: number | null;
  unitCount: number | null;
}

export interface EquippedItem {
  gearSlots: Array<GearSlotDefRef> | null;
  item: Item | null;
}

export interface SubstanceDef {
  id: string | null;
}

export interface MyInventory {
  items: Array<Item> | null;
  itemCount: number | null;
  totalMass: number | null;
  currency: number | null;
}

export interface SiegeEngineItemDef {
  id: string | null;
}

export interface WeaponConfigDef {
  id: string | null;
  weaponType: WeaponType | null;
  ammo: boolean | null;
  ammoType: AmmoType | null;
}

export type WeaponType = "NONE" | "Arrow" | "Dagger" | "Sword" | "Hammer" | "Axe" | "Mace" | "GreatSword" | "GreatHammer" | "GreatAxe" | "GreatMace" | "Spear" | "Staff" | "Polearm" | "Shield" | "Bow" | "Throwing" | "Focus" | "LongSword" | "All";

export type AmmoType = "None" | "BasicArrow" | "BasicElixir" | "Bolt" | "Black" | "BlackArrow" | "Flight" | "FlightArrow" | "Blunt" | "BluntArrow" | "Broadhead" | "BroadheadArrow" | "Barbed" | "BarbedArrow" | "Leafblade" | "LeafbladeArrow" | "Serrated" | "SerratedArrow" | "Notched" | "NotchedArrow" | "Crescent" | "CrescentArrow" | "Light" | "LightArrow" | "DartPoint" | "DartPointArrow" | "Forked" | "ForkedArrow" | "Heavy" | "War" | "HeavyWarArrow" | "Siege" | "BasicSiegeBolt" | "BluntSiegeBolt" | "LightSiegeBolt" | "HeavySiegeBolt";
