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


export interface ItemQueryVariables {
  shard: number;
  id: string;
}

export interface ItemQuery {
  // retrieve information about an item
  item: {
    // stats of this item
    stats: {
      // Stats shared by all types of items
      item: BasicItemFragment,
    } | null,
  } | null;
}

export interface MyCharacterQuery {
  // Get the character of the currently logged in user.
  myCharacter: {
    id: string | null,
    name: string | null,
    faction: Faction | null,
    race: Race | null,
    gender: Gender | null,
    archetype: Archetype | null,
    order: string | null,
  } | null;
}

export interface MyEquippedItemsQuery {
  // retrieve all the session users equipped items
  myEquippedItems: Array< {
    // the list of all the gear slots the item is in
    gearSlots: Array< {
      // Unique gear slot identifier
      id: string | null,
    } > | null,
    // The item that is equipped
    item: {
      // Unique instance ID for item.
      id: string | null,
      // Custom name given to item at crafting item
      givenName: string | null,
      // stats of this item
      stats: {
        // Stats shared by all types of items
        item: BasicItemFragment,
        // Weapon specific stats
        weapon: WeaponStatsFragment,
      } | null,
      // The definition for the item.
      staticDefinition: {
        // Unique item identifier
        id: string | null,
        // URL to the item's icon
        iconUrl: string | null,
        // Name of the item
        name: string | null,
        // Description of the item
        description: string | null,
        // the sets of gear slots this item can be equipped to
        gearSlotSets: Array< {
          // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
          gearSlots: Array< {
            // Unique gear slot identifier
            id: string | null,
          } > | null,
        } > | null,
      } | null,
    } | null,
  } > | null;
}

export interface MyInventoryItemsQuery {
  // retrieve all items in the session users inventory
  myInventoryItems: Array< {
    // Unique instance ID for item.
    id: string | null,
    // Custom name given to item at crafting item
    givenName: string | null,
    // stats of this item
    stats: {
      // Stats shared by all types of items
      item: BasicItemFragment,
      // Block specific stats
      block: BuildingBlockStatFragment,
      // Container specific stats
      container: {
        // The max item count that can be placed into a container, only used if the value is greater then 1.  Stacks of substances/blocks count as 1 item per stack.
        maxItemCount: number | null,
        // The max item mass of all contained items that can be placed into a container, only used if the value is greater then 1
        maxItemMass: number | null,
      } | null,
      // Siege engine specific stats
      siegeEngine: {
        // Health
        health: number | null,
        // YawSpeedDegPerSec
        yawSpeedDegPerSec: number | null,
        // PitchSpeedDegPerSec
        pitchSpeedDegPerSec: number | null,
      } | null,
      // Weapon specific stats
      weapon: WeaponStatsFragment,
    } | null,
    // The definition for the item.
    staticDefinition: {
      // Unique item identifier
      id: string | null,
      // URL to the item's icon
      iconUrl: string | null,
      // Name of the item
      name: string | null,
      // Description of the item
      description: string | null,
      isVox: boolean | null,
      // the sets of gear slots this item can be equipped to
      gearSlotSets: Array< {
        // A list of gear slots which makes up a valid set of places a item can be equipped on at once.
        gearSlots: Array< {
          // Unique gear slot identifier
          id: string | null,
        } > | null,
      } > | null,
    } | null,
  } > | null;
}

export interface BasicItemFragment {
  // The quality of the item, this will be a value between 0-1
  quality: number | null;
  // The mass of the item
  mass: number | null;
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

export interface BuildingBlockStatFragment {
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
