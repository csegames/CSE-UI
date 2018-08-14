//  This file was automatically generated and should not be edited.
/* tslint:disable */

// CU.PlayerStat
export type PlayerStat =
  "Strength" | // Strength
  "Dexterity" | // Dexterity
  "Agility" | // Agility
  "Vitality" | // Vitality
  "Endurance" | // Endurance
  "Attunement" | // Attunement
  "Will" | // Will
  "Faith" | // Faith
  "Resonance" | // Resonance
  "Eyesight" | // Eyesight
  "Hearing" | // Hearing
  "Presence" | // Presence
  "Clarity" | // Clarity
  "Affinity" | // Affinity
  "Mass" | // Mass
  "MaxMoveSpeed" | // MaxMoveSpeed
  "MoveAcceleration" | // MoveAcceleration
  "MaxTurnSpeed" | // MaxTurnSpeed
  "Vision" | // Vision
  "Detection" | // Detection
  "Encumbrance" | // Encumbrance
  "EncumbranceReduction" | // EncumbranceReduction
  "CarryCapacity" | // CarryCapacity
  "MaxPanic" | // MaxPanic
  "PanicDecay" | // PanicDecay
  "MaxHP" | // MaxHP
  "HealthRegeneration" | // HealthRegeneration
  "MaxStamina" | // MaxStamina
  "StaminaRegeneration" | // StaminaRegeneration
  "AbilityPreparationSpeed" | // AbilityPreparationSpeed
  "AbilityRecoverySpeed" | // AbilityRecoverySpeed
  "CooldownSpeed" | // CooldownSpeed
  "Age" | // Age
  "Concealment" | // Concealment
  "VeilSubtlety" | // VeilSubtlety
  "VeilResist" | // VeilResist
  "HealingReceivedBonus" | // HealingReceivedBonus
  "EnhancementDuration" | // EnhancementDuration
  "HeatTolerance" | // HeatTolerance
  "ColdTolerance" | // ColdTolerance
  "MaxBlood" | // MaxBlood
  "BloodRegeneration" | // BloodRegeneration
  "EffectPowerBonus" | // EffectPowerBonus
  "None"; // None


// CU.Faction
export type Faction =
  "Factionless" | // Factionless
  "TDD" | // TDD
  "Viking" | // Viking
  "Arthurian" | // Arthurian
  "COUNT"; // COUNT


// CU.Race
export type Race =
  "Tuatha" | // Mage (Earth)
  "Hamadryad" | // Fighter
  "Luchorpan" | // Healer
  "Firbog" | // Mage (Earth)
  "Valkyrie" | // Mage (Water)
  "Helbound" | // Healer
  "FrostGiant" | // Fighter
  "Dvergr" | // Fighter
  "Strm" | // Mage (Fire)
  "CaitSith" | // Fighter
  "Golem" | // Healer
  "Gargoyle" | // Fighter
  "StormRider" | // MeleeCombatTest
  "StormRiderT" | // MeleeCombatTest
  "StormRiderV" | // ArcherCombatTest
  "HumanMaleV" | // MeleeCombatTest
  "HumanMaleA" | // MeleeCombatTest
  "HumanMaleT" | // MeleeCombatTest
  "Pict" | // Pict
  "Any"; // Any


// CU.Gender
export type Gender =
  "None" | // None
  "Male" | // Male
  "Female"; // Female


// CU.Archetype
export type Archetype =
  "None" | // None
  "EarthMage" | // EarthMage
  "WaterMage" | // WaterMage
  "Fighter" | // Fighter
  "Healer" | // Healer
  "Archer" | // Archer
  "MeleeCombatTest" | // MeleeCombatTest
  "ArcherTest" | // ArcherTest
  "BlackKnight" | // BlackKnight
  "Fianna" | // Fianna
  "Mjolnir" | // Mjolnir
  "Physician" | // Physician
  "Empath" | // Empath
  "Stonehealer" | // Stonehealer
  "Blackguard" | // Blackguard
  "ForestStalker" | // ForestStalker
  "WintersShadow" | // WintersShadow
  "FireMage" | // FireMage
  "Any"; // Any


// World.ItemActionUIReaction
export type ItemActionUIReaction =
  "None" | // None
  "CloseInventory" | // CloseInventory
  "PlacementMode" | // PlacementMode
  "OpenMiniMap"; // OpenMiniMap


// CU.Skills.SubpartId
export type SubpartId =
  "None" | // None
  "_BODY_PART_COUNT" | // _BODY_PART_COUNT
  "Any" | // Any
  "_BUILDING_VAL" | // _BUILDING_VAL
  "_BODY_VAL" | // _BODY_VAL
  "_BODY_BEGIN" | // _BODY_BEGIN
  "Head" | // Head
  "LeftArm" | // LeftArm
  "RightArm" | // RightArm
  "LeftLeg" | // LeftLeg
  "RightLeg" | // RightLeg
  "_BODY_END" | // _BODY_END
  "_SINGULAR_VAL" | // _SINGULAR_VAL
  "_TYPE_MASK"; // _TYPE_MASK


// World.Items.ItemEquipRequirement+EquipRequirementStatus
export type EquipRequirementStatus =
  "Unknown" | // Unknown
  "NotEquippable" | // NotEquippable
  "NoRequirement" | // NoRequirement
  "RequirementMet" | // RequirementMet
  "RequirementNotMet" | // RequirementNotMet
  "NoCharacterContext"; // NoCharacterContext


// World.ItemType
export type ItemType =
  "Basic" | // Basic item that does not fit into any other categories
  "Vox" | // A crafting station vox
  "Ammo" | // Ammo for skills and siege engines
  "Armor" | // Equipment that can be worn
  "Weapon" | // Weapons which can be equipped and used by skills
  "Block" | // A building block
  "Alloy" | // An alloy, made from substances, and used in crafting
  "Substance" | // Substances harvested from resource nodes, used in crafting
  "SiegeEngine"; // Controllable items used in siege combat


// CU.Databases.Models.Permissibles.PermissibleTargetType
export type PermissibleTargetType =
  "Invalid" | // Invalid
  "Any" | // Any
  "Faction" | // Faction
  "Character" | // Character
  "ScenarioTeam" | // ScenarioTeam
  "Warband" | // Warband
  "CharactersWarband" | // CharactersWarband
  "CharactersFaction" | // CharactersFaction
  "CharactersOrder" | // CharactersOrder
  "InNoScenario" | // InNoScenario
  "Inverse" | // Inverse
  "And" | // And
  "ScenarioRole" | // ScenarioRole
  "Scenario" | // Scenario
  "Account"; // Account


// CU.Databases.Models.Permissibles.PermissibleSetKeyType
export type PermissibleSetKeyType =
  "Invalid" | // Invalid
  "Faction" | // Faction
  "ScenarioTeam" | // ScenarioTeam
  "ScenarioRole"; // ScenarioRole


// World.SecureTradeState
export type SecureTradeState =
  "None" | // No trade is taking place
  "Invited" | // An invite has been sent to another entity to start a trade
  "ModifyingItems" | // Trade session has been accepted, items can now be added to the trade session
  "Locked" | // Trade items have been marked as locked.  In this state, items may not be added or removed from the trade session.  The trade cannot move on to the confirmed state unless both parties are in the locked (or confirmed) state
  "Confirmed"; // Mark the trade as confirmed.  In this state, items may not be added or removed from the trade session.  When the second party has confirmed the trade, the items will be swapped.


export interface CharacterInfoQuery {
  // Get the character of the currently logged in user.
  myCharacter: MyCharacterFragment & {
    progression: {
      skillParts: Array< {
        skillPartID: string | null,
        level: number | null,
        progressionPoints: number | null,
      } > | null,
      characterStats: Array< {
        stat: PlayerStat | null,
        bonusPoints: number | null,
        progressionPoints: number | null,
      } > | null,
    } | null,
  } | null;
}

export interface InventoryBaseQuery {
  // Retrieve data about the character's inventory
  myInventory: {
    items: Array<InventoryItemFragment>,
    itemCount: number | null,
    totalMass: number | null,
  } | null;
}

export interface ItemAddedQueryVariables {
  id: string;
  shard: number;
}

export interface ItemAddedQuery {
  // retrieve information about an item
  item: InventoryItemFragment;
}

export interface PaperDollContainerQuery {
  // retrieve all the session users equipped items
  myEquippedItems: {
    items: Array<EquippedItemFragment>,
  } | null;
}

export interface TradeWindowQuery {
  // Information about current secure item trade the player is engaged in.
  secureTrade: SecureTradeFragment;
}

export interface AlloyStatsFragment {
  // UnitHealth
  unitHealth: number | null;
  // UnitMass
  unitMass: number | null;
  // MassBonus
  massBonus: number | null;
  // EncumbranceBonus
  encumbranceBonus: number | null;
  // MaxRepairPointsBonus
  maxRepairPointsBonus: number | null;
  // MaxHealthBonus
  maxHealthBonus: number | null;
  // HealthLossPerUseBonus
  healthLossPerUseBonus: number | null;
  // WeightBonus
  weightBonus: number | null;
  // StrengthRequirementBonus
  strengthRequirementBonus: number | null;
  // DexterityRequirementBonus
  dexterityRequirementBonus: number | null;
  // VitalityRequirementBonus
  vitalityRequirementBonus: number | null;
  // EnduranceRequirementBonus
  enduranceRequirementBonus: number | null;
  // AttunementRequirementBonus
  attunementRequirementBonus: number | null;
  // WillRequirementBonus
  willRequirementBonus: number | null;
  // FaithRequirementBonus
  faithRequirementBonus: number | null;
  // ResonanceRequirementBonus
  resonanceRequirementBonus: number | null;
  // FractureThresholdBonus
  fractureThresholdBonus: number | null;
  // FractureChanceBonus
  fractureChanceBonus: number | null;
  // DensityBonus
  densityBonus: number | null;
  // MalleabilityBonus
  malleabilityBonus: number | null;
  // MeltingPointBonus
  meltingPointBonus: number | null;
  // HardnessBonus
  hardnessBonus: number | null;
  // FractureBonus
  fractureBonus: number | null;
  // ArmorClassBonus
  armorClassBonus: number | null;
  // ResistSlashingBonus
  resistSlashingBonus: number | null;
  // ResistPiercingBonus
  resistPiercingBonus: number | null;
  // ResistCrushingBonus
  resistCrushingBonus: number | null;
  // ResistAcidBonus
  resistAcidBonus: number | null;
  // ResistPoisonBonus
  resistPoisonBonus: number | null;
  // ResistDiseaseBonus
  resistDiseaseBonus: number | null;
  // ResistEarthBonus
  resistEarthBonus: number | null;
  // ResistWaterBonus
  resistWaterBonus: number | null;
  // ResistFireBonus
  resistFireBonus: number | null;
  // ResistAirBonus
  resistAirBonus: number | null;
  // ResistLightningBonus
  resistLightningBonus: number | null;
  // ResistFrostBonus
  resistFrostBonus: number | null;
  // ResistLifeBonus
  resistLifeBonus: number | null;
  // ResistMindBonus
  resistMindBonus: number | null;
  // ResistSpiritBonus
  resistSpiritBonus: number | null;
  // ResistRadiantBonus
  resistRadiantBonus: number | null;
  // ResistDeathBonus
  resistDeathBonus: number | null;
  // ResistShadowBonus
  resistShadowBonus: number | null;
  // ResistChaosBonus
  resistChaosBonus: number | null;
  // ResistVoidBonus
  resistVoidBonus: number | null;
  // ResistArcaneBonus
  resistArcaneBonus: number | null;
  // MitigateBonus
  mitigateBonus: number | null;
  // PiercingDamageBonus
  piercingDamageBonus: number | null;
  // PiercingArmorPenetrationBonus
  piercingArmorPenetrationBonus: number | null;
  // FalloffMinDistanceBonus
  falloffMinDistanceBonus: number | null;
  // FalloffReductionBonus
  falloffReductionBonus: number | null;
  // SlashingDamageBonus
  slashingDamageBonus: number | null;
  // SlashingBleedBonus
  slashingBleedBonus: number | null;
  // SlashingArmorPenetrationBonus
  slashingArmorPenetrationBonus: number | null;
  // CrushingDamageBonus
  crushingDamageBonus: number | null;
  // FallbackCrushingDamageBonus
  fallbackCrushingDamageBonus: number | null;
  // DistruptionBonus
  distruptionBonus: number | null;
  // StabilityBonus
  stabilityBonus: number | null;
  // DeflectionAmountBonus
  deflectionAmountBonus: number | null;
  // DeflectionRecoveryBonus
  deflectionRecoveryBonus: number | null;
  // KnockbackAmountBonus
  knockbackAmountBonus: number | null;
  // StaminaCostBonus
  staminaCostBonus: number | null;
  // PhysicalPreparationTimeBonus
  physicalPreparationTimeBonus: number | null;
  // PhysicalRecoveryTimeBonus
  physicalRecoveryTimeBonus: number | null;
}

export interface ArmorBySubpartFragment {
  subPartId: SubpartId | null;
  resistances: DamageTypeValuesFragment;
}

export interface ArmorPartsFragment {
  statsPerSlot: Array< {
    gearSlot: GearSlotDefRefFragment,
    stats: {
      // ArmorClass
      armorClass: number | null,
    } | null,
    resistances: DamageTypeValuesFragment,
    mitigations: DamageTypeValuesFragment,
  } > | null;
}

export interface BasicItemFragment {
  // The quality of the item, this will be a value between 0-1
  quality: number | null;
  // The mass of the item without the mass of anything inside of it
  selfMass: number | null;
  // The mass of the item and anything inside of it
  totalMass: number | null;
  // The encumbrance of an item is used while the item is equipped to encumber the player equipping the item
  encumbrance: number | null;
  // The agility stat requirement that must be met to equip this item
  agilityRequirement: number | null;
  // The dexterity stat requirement that must be met to equip this item
  dexterityRequirement: number | null;
  // The strength stat requirement that must be met to equip this item
  strengthRequirement: number | null;
  // The vitality stat requirement that must be met to equip this item
  vitalityRequirement: number | null;
  // The endurance stat requirement that must be met to equip this item
  enduranceRequirement: number | null;
  // The attunement stat requirement that must be met to equip this item
  attunementRequirement: number | null;
  // The will stat requirement that must be met to equip this item
  willRequirement: number | null;
  // The faith stat requirement that must be met to equip this item
  faithRequirement: number | null;
  // The resonance stat requirement that must be met to equip this item
  resonanceRequirement: number | null;
  // The stack count on this item.  For items which do not stack, this value will always be 1.
  unitCount: number | null;
}

export interface BuildingBlockStatsFragment {
  // CompressiveStrength
  compressiveStrength: number | null;
  // ShearStrength
  shearStrength: number | null;
  // TensileStrength
  tensileStrength: number | null;
  // Density
  density: number | null;
  // HealthUnits
  healthUnits: number | null;
  // BuildTimeUnits
  buildTimeUnits: number | null;
  // UnitMass
  unitMass: number | null;
}

export interface ContainedItemsFragment {
  // Unique instance ID for item.
  id: string | null;
  // Custom name given to item at crafting item
  givenName: string | null;
  // Identifies items that are of the same type and have the same stats.
  stackHash: string | null;
  // the UI color for the container UI
  containerColor: ContainerColorFragment;
  // details about the location of the item
  location: ItemLocationFragment;
  actions: Array<ItemActionsFragment>;
  // stats of this item
  stats: ItemStatsFragment;
  // information about if this item can be equipped.
  equiprequirement: EquipRequirementFragment;
  // The definition for the item.
  staticDefinition: {
    // Unique item identifier
    id: string | null,
    // Description of the item
    description: string | null,
    // Name of the item
    name: string | null,
    // URL to the item's icon
    iconUrl: string | null,
    // The type of item
    itemType: ItemType | null,
    defaultResourceID: string | null,
    deploySettings: {
      resourceID: string | null,
      isDoor: boolean | null,
      snapToGround: boolean | null,
      rotateYaw: boolean | null,
      rotatePitch: boolean | null,
      rotateRoll: boolean | null,
    } | null,
    // the sets of gear slots this item can be equipped to
    gearSlotSets: Array< {
      // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
      gearSlots: Array<GearSlotDefRefFragment>,
    } > | null,
    isVox: boolean | null,
  } | null;
  permissibleHolder: PermissibleHolderFragment;
  containerDrawers: Array< {
    id: string | null,
    requirements: RequirementsFragment,
    stats: ContainerStatsFragment,
    containedItems: Array< {
      // Unique instance ID for item.
      id: string | null,
      // Custom name given to item at crafting item
      givenName: string | null,
      // Identifies items that are of the same type and have the same stats.
      stackHash: string | null,
      // the UI color for the container UI
      containerColor: ContainerColorFragment,
      // details about the location of the item
      location: ItemLocationFragment,
      actions: Array<ItemActionsFragment>,
      // stats of this item
      stats: ItemStatsFragment,
      // information about if this item can be equipped.
      equiprequirement: EquipRequirementFragment,
      // The definition for the item.
      staticDefinition: {
        // Unique item identifier
        id: string | null,
        // Description of the item
        description: string | null,
        // Name of the item
        name: string | null,
        // URL to the item's icon
        iconUrl: string | null,
        // The type of item
        itemType: ItemType | null,
        defaultResourceID: string | null,
        deploySettings: {
          resourceID: string | null,
          isDoor: boolean | null,
          snapToGround: boolean | null,
          rotateYaw: boolean | null,
          rotatePitch: boolean | null,
          rotateRoll: boolean | null,
        } | null,
        // the sets of gear slots this item can be equipped to
        gearSlotSets: Array< {
          // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
          gearSlots: Array<GearSlotDefRefFragment>,
        } > | null,
        isVox: boolean | null,
      } | null,
      permissibleHolder: PermissibleHolderFragment,
    } > | null,
  } > | null;
}

export interface ContainerColorFragment {
  r: number | null;
  g: number | null;
  b: number | null;
  a: number | null;
  // Color in RGBA format
  rgba: string | null;
  // Color in Hex format
  hex: string | null;
  // Color in Hex format with alpha
  hexa: string | null;
}

export interface ContainerDrawersFragment {
  id: string | null;
  requirements: RequirementsFragment;
  containedItems: Array<ContainedItemsFragment>;
  stats: ContainerStatsFragment;
}

export interface ContainerStatsFragment {
  // MaxItemCount
  maxItemCount: number | null;
  // MaxItemMass
  maxItemMass: number | null;
}

export interface DamageTypeValuesFragment {
  // Slashing
  slashing: number | null;
  // Piercing
  piercing: number | null;
  // Crushing
  crushing: number | null;
  // Physical
  physical: number | null;
  // Acid
  acid: number | null;
  // Poison
  poison: number | null;
  // Disease
  disease: number | null;
  // Earth
  earth: number | null;
  // Water
  water: number | null;
  // Fire
  fire: number | null;
  // Air
  air: number | null;
  // Lightning
  lightning: number | null;
  // Frost
  frost: number | null;
  // Elemental
  elemental: number | null;
  // Life
  life: number | null;
  // Mind
  mind: number | null;
  // Spirit
  spirit: number | null;
  // Radiant
  radiant: number | null;
  // Light
  light: number | null;
  // Death
  death: number | null;
  // Shadow
  shadow: number | null;
  // Chaos
  chaos: number | null;
  // Void
  void: number | null;
  // Dark
  dark: number | null;
  // Arcane
  arcane: number | null;
}

export interface DurabilityStatsFragment {
  // The number of repair points this item was created at
  maxRepairPoints: number | null;
  // The amount of health this item was created at and will be restored to each time it is repaired
  maxHealth: number | null;
  // FractureThreshold
  fractureThreshold: number | null;
  // FractureChance
  fractureChance: number | null;
  // The current number of repair points remaining on this item. This value will be reduced when the item is repaired
  currentRepairPoints: number | null;
  // The current health on this item. This value is reduced when the item is used or attacked.
  currentHealth: number | null;
  // Factor used to decide how much health the item will lose each time it is used.
  healthLossPerUse: number | null;
}

export interface EquipRequirementFragment {
  status: EquipRequirementStatus | null;
  requirementDescription: string | null;
  errorDescription: string | null;
}

export interface EquippedItemFragment {
  // the list of all the gear slots the item is in
  gearSlots: Array<GearSlotDefRefFragment>;
  // The item that is equipped
  item: InventoryItemFragment;
}

export interface GearSlotDefRefFragment {
  // Unique gear slot identifier
  id: string | null;
  // Which body subparts this slot belongs to
  subpartIDs: Array< SubpartId | null > | null;
}

export interface InventoryItemFragment {
  // Unique instance ID for item.
  id: string | null;
  // Custom name given to item at crafting item
  givenName: string | null;
  // Identifies items that are of the same type and have the same stats.
  stackHash: string | null;
  // the UI color for the container UI
  containerColor: ContainerColorFragment;
  // details about the location of the item
  location: ItemLocationFragment;
  actions: Array<ItemActionsFragment>;
  // stats of this item
  stats: ItemStatsFragment;
  // information about if this item can be equipped.
  equiprequirement: EquipRequirementFragment;
  // The definition for the item.
  staticDefinition: {
    // Unique item identifier
    id: string | null,
    numericItemDefID: number | null,
    // Description of the item
    description: string | null,
    // Name of the item
    name: string | null,
    // URL to the item's icon
    iconUrl: string | null,
    // The type of item
    itemType: ItemType | null,
    defaultResourceID: string | null,
    deploySettings: {
      resourceID: string | null,
      isDoor: boolean | null,
      snapToGround: boolean | null,
      rotateYaw: boolean | null,
      rotatePitch: boolean | null,
      rotateRoll: boolean | null,
    } | null,
    // the sets of gear slots this item can be equipped to
    gearSlotSets: Array< {
      // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
      gearSlots: Array<GearSlotDefRefFragment>,
    } > | null,
    isVox: boolean | null,
  } | null;
  containerDrawers: Array<ContainerDrawersFragment>;
  permissibleHolder: PermissibleHolderFragment;
}

export interface ItemActionsFragment {
  id: string | null;
  name: string | null;
  cooldownSeconds: number | null;
  enabled: boolean | null;
  lastTimePerformed: string | null;
  uIReaction: ItemActionUIReaction | null;
  showWhenDisabled: boolean | null;
}

export interface ItemLocationFragment {
  // Location filled if this item is in a container
  inContainer: {
    // The UI position of the item
    position: number | null,
  } | null;
  // Location filled if this item is in a player's inventory
  inventory: {
    // The UI position of the item
    position: number | null,
  } | null;
  // Location filled if this item is equipped
  equipped: {
    // The gear slots the item is equipped to
    gearSlots: Array< {
      // Unique gear slot identifier
      id: string | null,
    } > | null,
  } | null;
}

export interface ItemStatsFragment {
  // Stats shared by all types of items
  item: BasicItemFragment;
  // Alloy specific stats
  alloy: AlloyStatsFragment;
  // Substance specific stats
  substance: SubstanceStatsFragment;
  // Weapon specific stats
  weapon: WeaponStatsFragment;
  armor: Array<ArmorPartsFragment>;
  armorBySubpart: Array<ArmorBySubpartFragment>;
  // Durability specific stats
  durability: DurabilityStatsFragment;
  // Block specific stats
  block: BuildingBlockStatsFragment;
}

export interface MyCharacterFragment {
  id: string | null;
  name: string | null;
  faction: Faction | null;
  race: Race | null;
  gender: Gender | null;
  archetype: Archetype | null;
}

export interface PermissibleHolderFragment {
  userPermissions: number | null;
  userGrants: Array< {
    permissions: number | null,
    target: {
      targetType: PermissibleTargetType | null,
      description: string | null,
    } | null,
  } > | null;
  permissibleSets: Array< {
    keyType: PermissibleSetKeyType | null,
    isActive: boolean | null,
    permissibles: Array< {
      permissions: number | null,
      target: {
        targetType: PermissibleTargetType | null,
        description: string | null,
      } | null,
    } > | null,
  } > | null;
}

export interface RequirementsFragment {
  description: string | null;
  icon: string | null;
}

export interface SecureTradeFragment {
  // The state of the trade, from your perspective
  myState: SecureTradeState | null;
  // The items you've added to the trade
  myItems: Array<InventoryItemFragment>;
  // The entity ID of who is being traded with
  theirEntityID: string | null;
  // The state of the trade, from the perspective of the entity you are trading with
  theirState: SecureTradeState | null;
  // The items you will get from this trade
  theirItems: Array<InventoryItemFragment>;
}

export interface SubstanceStatsFragment {
  // UnitHealth
  unitHealth: number | null;
  // MagicalResistance
  magicalResistance: number | null;
  // MeltingPoint
  meltingPoint: number | null;
  // MassFactor
  massFactor: number | null;
  // HardnessFactor
  hardnessFactor: number | null;
  // Elasticity
  elasticity: number | null;
  // FractureChance
  fractureChance: number | null;
  // UnitMass
  unitMass: number | null;
}

export interface WeaponStatsFragment {
  // PiercingDamage
  piercingDamage: number | null;
  // PiercingBleed
  piercingBleed: number | null;
  // PiercingArmorPenetration
  piercingArmorPenetration: number | null;
  // SlashingDamage
  slashingDamage: number | null;
  // SlashingBleed
  slashingBleed: number | null;
  // SlashingArmorPenetration
  slashingArmorPenetration: number | null;
  // CrushingDamage
  crushingDamage: number | null;
  // FallbackCrushingDamage
  fallbackCrushingDamage: number | null;
  // Disruption
  disruption: number | null;
  // DeflectionAmount
  deflectionAmount: number | null;
  // PhysicalProjectileSpeed
  physicalProjectileSpeed: number | null;
  // KnockbackAmount
  knockbackAmount: number | null;
  // Stability
  stability: number | null;
  // FalloffMinDistance
  falloffMinDistance: number | null;
  // FalloffMaxDistance
  falloffMaxDistance: number | null;
  // FalloffReduction
  falloffReduction: number | null;
  // DeflectionRecovery
  deflectionRecovery: number | null;
  // StaminaCost
  staminaCost: number | null;
  // PhysicalPreparationTime
  physicalPreparationTime: number | null;
  // PhysicalRecoveryTime
  physicalRecoveryTime: number | null;
  // Range
  range: number | null;
}
/* tslint:enable */
