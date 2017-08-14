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


export interface CharacterInfoQuery {
  // Get the character of the currently logged in user.
  myCharacter: MyCharacterFragment;
  // Gets the session users order.
  myOrder: MyOrderFragment;
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
    gender: Gender | null,
    race: Race | null,
  } | null;
  // Gets the session users order.
  myOrder: {
    // The GroupID of the Order.
    id: string | null,
    // The name of the Order.
    name: string | null,
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
  // The mass of the item and anything inside of it
  totalMass: number | null;
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
    item: BasicItemFragment,
    // Alloy specific stats
    alloy: AlloyStatsFragment,
    // Substance specific stats
    substance: SubstanceStatsFragment,
    // Weapon specific stats
    weapon: WeaponStatsFragment,
    armor: ArmorPartsFragment,
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

export interface MyCharacterFragment {
  id: string | null;
  name: string | null;
  faction: Faction | null;
  race: Race | null;
  gender: Gender | null;
  archetype: Archetype | null;
}

export interface MyOrderFragment {
  // The GroupID of the Order.
  id: string | null;
  // The realm to which the Order belongs.
  realm: Faction | null;
  // The name of the Order.
  name: string | null;
  // Gets the current session users OrderMember info if they are a member of this order.
  myMemberInfo: {
    // The character ID of the member.
    id: string | null,
    // The name of the member.
    name: string | null,
    // Kill count of the Order member.
    kills: number | null,
    // The current rank of the member.
    rank: {
      // The name of the rank.
      name: string,
    } | null,
  } | null;
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
