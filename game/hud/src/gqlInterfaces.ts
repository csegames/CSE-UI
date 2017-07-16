//  This file was automatically generated and should not be edited.
/* tslint:disable */

// One of the three realms in Camelot Unchained.
export type Faction =
  "FACTIONLESS" |
  "TDD" | // The Tuatha Dé Danann
  "VIKING" |
  "ARTHURIAN" |
  "COUNT" | // COUNT
  "Factionless" | // No Faction or All Factions (NPC Only)
  "Viking" | // The Vikings
  "Arthurian"; // The Arthurians


// One of the races in Camelot Unchained.
export type Race =
  "TUATHA" |
  "HAMADRYAD" |
  "LUCHORPAN" |
  "FIRBOG" |
  "VALKYRIE" |
  "HELBOUND" |
  "FROST_GIANT" |
  "DVERGR" |
  "STRM" |
  "CAIT_SITH" |
  "GOLEM" |
  "GARGOYLE" |
  "STORM_RIDER" |
  "STORM_RIDER_T" |
  "STORM_RIDER_V" |
  "HUMAN_MALE_V" |
  "HUMAN_MALE_A" |
  "HUMAN_MALE_T" |
  "PICT" |
  "ANY" |
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
  "Pict" | // Pictish?
  "Any"; // Any


// A gender.
export type Gender =
  "NONE" |
  "MALE" |
  "FEMALE" |
  "None" | // None
  "Male" | // Male
  "Female"; // Female


// Archetype
export type Archetype =
  "FireMage" | // A firey mage
  "EarthMage" | // An earthy mage
  "WaterMage" | // A watery mage
  "Fighter" | // A melee fighter
  "Healer" | // Some might call this a medic
  "Archer" | // Pew Pew Pew
  "MeleeCombatTest" | // A test melee archetype
  "ArcherTest" | // A test archer archetype
  "BlackKnight" | // The Dark Knight
  "Fianna" | // Some tree thing
  "Mjolnir" | // THORR!!!
  "Physician" | // What's up Doc?
  "Empath" | // An emo healer
  "Stonehealer" | // Me heal with rock!
  "Blackguard" | // Stronk guard
  "ForestStalker" | // He be stalking yo trees
  "WintersShadow" | // Sounds cold
  "Any"; // Any


// ItemType
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


export interface StatInfoQuery {
  // retrieve all the session users equipped items
  myEquippedItems: Array< {
    // The item that is equipped
    item: {
      // stats of this item
      stats: {
        // Weapon specific stats
        weapon: WeaponStatsFragment,
        armor: ArmorPartsFragment,
      } | null,
    } | null,
  } > | null;
}

export interface CharacterInfoQuery {
  // Get the character of the currently logged in user.
  myCharacter: {
    name: string | null,
    id: string | null,
    faction: Faction | null,
    race: Race | null,
    gender: Gender | null,
    archetype: Archetype | null,
  } | null;
}

export interface ContextMenuContentQueryVariables {
  id: string;
  shard: number;
}

export interface ContextMenuContentQuery {
  // retrieve information about an item
  item: InventoryItemFragment;
}

export interface InventoryBaseQuery {
  // Retrieve data about the character's inventory
  myInventory: {
    items: Array<InventoryItemFragment>,
    itemCount: number | null,
    totalMass: number | null,
    currency: number | null,
  } | null;
}

export interface PaperDollContainerQuery {
  // retrieve all the session users equipped items
  myEquippedItems: Array< {
    // the list of all the gear slots the item is in
    gearSlots: Array< {
      // Unique gear slot identifier
      id: string | null,
    } > | null,
    // The item that is equipped
    item: InventoryItemFragment,
  } > | null;
  // Get the character of the currently logged in user.
  myCharacter: {
    id: string | null,
    name: string | null,
  } | null;
  // Gets the session users order.
  myOrder: {
    // The GroupID of the Order.
    id: string | null,
    // The name of the Order.
    name: string | null,
  } | null;
}

export interface ItemInfoQueryVariables {
  shard: number;
  id: string;
}

export interface ItemInfoQuery {
  // retrieve information about an item
  item: InventoryItemFragment & {
    // stats of this item
    stats: {
      // Stats shared by all types of items
      item: BasicItemFragment,
      // Alloy specific stats
      alloy: AlloyStatsFragment,
      // Substance specific stats
      substance: SubstanceStatsFragment,
      // Durability specific stats
      durability: DurabilityStatsFragment,
      // Block specific stats
      block: BlockStatsFragment,
      // Container specific stats
      container: ContainerStatsFragment,
      // Siege engine specific stats
      siegeEngine: SiegeEngineStatsFragment,
      // Weapon specific stats
      weapon: WeaponStatsFragment,
      armor: ArmorPartsFragment,
    } | null,
  } | null;
}

export interface AlloyStatsFragment {
  // Hardness
  hardness: number | null;
  // ImpactToughness
  impactToughness: number | null;
  // FractureChance
  fractureChance: number | null;
  // Malleability
  malleability: number | null;
  // MassPCF
  massPCF: number | null;
  // Density
  density: number | null;
  // MeltingPoint
  meltingPoint: number | null;
  // ThermConductivity
  thermConductivity: number | null;
  // SlashingResistance
  slashingResistance: number | null;
  // PiercingResistance
  piercingResistance: number | null;
  // CrushingResistance
  crushingResistance: number | null;
  // AcidResistance
  acidResistance: number | null;
  // PoisonResistance
  poisonResistance: number | null;
  // DiseaseResistance
  diseaseResistance: number | null;
  // EarthResistance
  earthResistance: number | null;
  // WaterResistance
  waterResistance: number | null;
  // FireResistance
  fireResistance: number | null;
  // AirResistance
  airResistance: number | null;
  // LightningResistance
  lightningResistance: number | null;
  // FrostResistance
  frostResistance: number | null;
  // LifeResistance
  lifeResistance: number | null;
  // MindResistance
  mindResistance: number | null;
  // SpiritResistance
  spiritResistance: number | null;
  // RadiantResistance
  radiantResistance: number | null;
  // DeathResistance
  deathResistance: number | null;
  // ShadowResistance
  shadowResistance: number | null;
  // ChaosResistance
  chaosResistance: number | null;
  // VoidResistance
  voidResistance: number | null;
  // ArcaneResistance
  arcaneResistance: number | null;
  // MagicalResistance
  magicalResistance: number | null;
  // HardnessFactor
  hardnessFactor: number | null;
  // StrengthFactor
  strengthFactor: number | null;
  // FractureFactor
  fractureFactor: number | null;
  // MassFactor
  massFactor: number | null;
  // DamageResistance
  damageResistance: number | null;
}

export interface ArmorPartsFragment {
  neck: {
    resistances: DamageTypeValuesFragment,
  } | null;
  face: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shoulderRightUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  waist: {
    resistances: DamageTypeValuesFragment,
  } | null;
  back: {
    resistances: DamageTypeValuesFragment,
  } | null;
  thighsUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  forearmLeft: {
    resistances: DamageTypeValuesFragment,
  } | null;
  feetUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  feet: {
    resistances: DamageTypeValuesFragment,
  } | null;
  handLeft: {
    resistances: DamageTypeValuesFragment,
  } | null;
  chest: {
    resistances: DamageTypeValuesFragment,
  } | null;
  forearmRight: {
    resistances: DamageTypeValuesFragment,
  } | null;
  backUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  skullUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shoulderLeft: {
    resistances: DamageTypeValuesFragment,
  } | null;
  waistUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shins: {
    resistances: DamageTypeValuesFragment,
  } | null;
  neckUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  handRightUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  forearmLeftUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  cloak: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shoulderLeftUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  chestUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  handRight: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shoulderRight: {
    resistances: DamageTypeValuesFragment,
  } | null;
  skull: {
    resistances: DamageTypeValuesFragment,
  } | null;
  thighs: {
    resistances: DamageTypeValuesFragment,
  } | null;
  handLeftUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  shinsUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
  faceUnder: {
    resistances: DamageTypeValuesFragment,
  } | null;
}

export interface BasicItemFragment {
  // The quality of the item, this will be a value between 0-1
  quality: number | null;
  // The encumbrance of an item is used while the item is equipped to encumber the player equipping the item
  encumbrance: number | null;
  // The agility stat requirement that must be met to equip this item
  agilityRequirement: number | null;
  // The dexterity stat requirement that must be met to equip this item
  dexterityRequirement: number | null;
  // The strength stat requirement that must be met to equip this item
  strengthRequirement: number | null;
  // The stack count on this item.  For items which do not stack, this value will always be 1.
  unitCount: number | null;
}

export interface BlockStatsFragment {
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

export interface ContainerStatsFragment {
  // The max item count that can be placed into a container, only used if the value is greater then 1.  Stacks of substances/blocks count as 1 item per stack.
  maxItemCount: number | null;
  // The max item mass of all contained items that can be placed into a container, only used if the value is greater then 1
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
  // The amount of durability this item was created at and will be restored to each time it is repaired
  maxDurability: number | null;
  // FractureThreshold
  fractureThreshold: number | null;
  // FractureChance
  fractureChance: number | null;
  // The current number of repair points remaining on this item. This value will be reduced when the item is repaired
  currentRepairPoints: number | null;
  // The current durability on this item. This value is reduced when the item is used.
  currentDurability: number | null;
}

export interface InventoryItemFragment {
  // Unique instance ID for item.
  id: string | null;
  // Identifies items that are of the same type and have the same stats.
  stackHash: string | null;
  // details about the location of the item
  location: {
    // Location filled if this item is in a player's inventory
    inventory: {
      // The UI position of the item
      position: number | null,
    } | null,
  } | null;
  // stats of this item
  stats: {
    // Stats shared by all types of items
    item: {
      // The quality of the item, this will be a value between 0-1
      quality: number | null,
      // The mass of the item and anything inside of it
      totalMass: number | null,
      // The stack count on this item.  For items which do not stack, this value will always be 1.
      unitCount: number | null,
    } | null,
  } | null;
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
    // the sets of gear slots this item can be equipped to
    gearSlotSets: Array< {
      // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
      gearSlots: Array< {
        // Unique gear slot identifier
        id: string | null,
      } > | null,
    } > | null,
  } | null;
}

export interface SiegeEngineStatsFragment {
  // Health
  health: number | null;
  // YawSpeedDegPerSec
  yawSpeedDegPerSec: number | null;
  // PitchSpeedDegPerSec
  pitchSpeedDegPerSec: number | null;
}

export interface SubstanceStatsFragment {
  // Hardness
  hardness: number | null;
  // ImpactToughness
  impactToughness: number | null;
  // FractureChance
  fractureChance: number | null;
  // Malleability
  malleability: number | null;
  // MassPCF
  massPCF: number | null;
  // Density
  density: number | null;
  // MeltingPoint
  meltingPoint: number | null;
  // ThermConductivity
  thermConductivity: number | null;
  // SlashingResistance
  slashingResistance: number | null;
  // PiercingResistance
  piercingResistance: number | null;
  // CrushingResistance
  crushingResistance: number | null;
  // AcidResistance
  acidResistance: number | null;
  // PoisonResistance
  poisonResistance: number | null;
  // DiseaseResistance
  diseaseResistance: number | null;
  // EarthResistance
  earthResistance: number | null;
  // WaterResistance
  waterResistance: number | null;
  // FireResistance
  fireResistance: number | null;
  // AirResistance
  airResistance: number | null;
  // LightningResistance
  lightningResistance: number | null;
  // FrostResistance
  frostResistance: number | null;
  // LifeResistance
  lifeResistance: number | null;
  // MindResistance
  mindResistance: number | null;
  // SpiritResistance
  spiritResistance: number | null;
  // RadiantResistance
  radiantResistance: number | null;
  // DeathResistance
  deathResistance: number | null;
  // ShadowResistance
  shadowResistance: number | null;
  // ChaosResistance
  chaosResistance: number | null;
  // VoidResistance
  voidResistance: number | null;
  // ArcaneResistance
  arcaneResistance: number | null;
  // MagicalResistance
  magicalResistance: number | null;
  // HardnessFactor
  hardnessFactor: number | null;
  // StrengthFactor
  strengthFactor: number | null;
  // FractureFactor
  fractureFactor: number | null;
  // MassFactor
  massFactor: number | null;
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
