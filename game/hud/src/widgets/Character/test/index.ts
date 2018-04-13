/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const testDamageTypeValues = {
  none: 0,
  slashing: 1,
  piercing: 1,
  crushing: 0,
  physical: 0,
  acid: 0,
  poison: 0,
  disease: 0,
  earth: 0,
  water: 0,
  fire: 0,
  air: 0,
  lightning: 0,
  frost: 0,
  elemental: 0,
  life: 0,
  mind: 0,
  spirit: 0,
  radiant: 0,
  light: 0,
  death: 0,
  shadow: 0,
  chaos: 0,
  void: 0,
  dark: 0,
  arcane: 0,
  other: 0,
  sYSTEM: 0,
  all: 0,
};

export const testArmorStats: any = {
  neck: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  face: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  shoulderRightUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  waist: null,
  back: null,
  thighsUnder: null,
  forearmRightUnder: null,
  forearmLeft: null,
  feetUnder: null,
  feet: null,
  handLeft: null,
  chest: null,
  forearmRight: null,
  backUnder: null,
  skullUnder: null,
  shoulderLeft: null,
  waistUnder: null,
  shins: null,
  neckUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  handRightUnder: null,
  forearmLeftUnder: null,
  cloak: null,
  shoulderLeftUnder: null,
  chestUnder: null,
  handRight: null,
  shoulderRight: null,
  skull: null,
  thighs: null,
  handLeftUnder: null,
  shinsUnder: null,
  faceUnder: null,
};

export const testWeaponStats = {
  piercingDamage: 5,
  piercingBleed: 5,
  piercingArmorPenetration: 5,
  slashingDamage: 1,
  slashingBleed: 1,
  slashingArmorPenetration: 1,
  crushingDamage: 0,
  fallbackCrushingDamage: 0,
  disruption: 5,
  deflectionAmount: 0,
  physicalProjectileSpeed: 0,
  knockbackAmount: 0,
  stability: 0,
  falloffMinDistance: 0,
  falloffMaxDistance: 0,
  falloffReduction: 0,
  deflectionRecovery: 0,
  staminaCost: 0,
  physicalPreparationTime: 0,
  physicalRecoveryTime: 0,
  range: 0,
};

export const testInitializedArmorStats = {
  neck: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  face: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  shoulderRightUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
  neckUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
  },
};

export const testArmorItem = {
  id: 'testArmorId',
  name: 'Test Armor Item',
  icon: '',
  stats: {
    quality: 1,
    mass: 0,
    armor: {
      ...testInitializedArmorStats,
    },
  },
  itemType: 'Armor',
  gearSlot: ['neck', 'face', 'shoulderRightUnder', 'neckUnder'],
};

export const testWeaponItem = {
  id: 'testWeaponId',
  name: 'Test Weapon Item',
  icon: '',
  stats: {
    quality: 2,
    mass: 3,
    weapon: {
      ...testWeaponStats,
    },
  },
  itemType: 'Weapon',
  gearSlot: ['weapon'],
};

export const testInventoryItems = {
  Weapon: {
    testWeaponId: testWeaponItem,
  },
  Armor: {
    testArmorId: testArmorItem,
  },
};

export const testActualArmorItem = {
  id: 'testArmorId',
  name: 'Test Armor Item',
  icon: '',
  stats: {
    quality: 1,
    mass: 0,
    armor: {
      ...testArmorStats,
    },
  },
  itemType: 'Armor',
  gearSlot: ['neck', 'face', 'shoulderRightUnder', 'neckUnder'],
};

export const testInitialArmorItem = {
  id: 'testArmorId',
  name: 'Test Armor Item',
  icon: '',
  stats: {
    quality: 1,
    mass: 0,
    armor: {
      ...testArmorStats,
    },
  },
  itemType: 'Armor',
};

export const testInitialWeaponItem = {
  id: 'testWeaponId',
  name: 'Test Weapon Item',
  icon: '',
  stats: {
    quality: 2,
    mass: 3,
    weapon: {
      ...testWeaponStats,
    },
  },
  itemType: 'Weapon',
};

export const testInitialItems = [
  testInitialArmorItem,
  testInitialWeaponItem,
];


// This item does not contain staticDefinition.
// An item should never be in this state, but if it is, we need to handle it gracefully.
export const testBadItem = JSON.parse(`
  {
    "id": "jqOzpF9o9x5wd23khICwv0",
    "stackHash": "00000000000000000000000000000000",
    "location": {
      "inventory": {
        "position": 1
      }
    },
    "stats": {
      "item": {
        "quality": 1.0,
        "selfMass": 1.875,
        "totalMass": 1.875,
        "encumbrance": 0.75,
        "agilityRequirement": 0.0,
        "dexterityRequirement": 0.0,
        "strengthRequirement": 0.0,
        "vitalityRequirement": 0.0,
        "enduranceRequirement": 0.0,
        "attunementRequirement": 0.0,
        "willRequirement": 0.0,
        "faithRequirement": 0.0,
        "resonanceRequirement": 0.0,
        "unitCount": 1.0
      },
      "alloy": {
        "hardness": 0.0,
        "impactToughness": 0.0,
        "fractureChance": 0.0,
        "malleability": 0.0,
        "massPCF": 0.0,
        "density": 0.0,
        "meltingPoint": 0.0,
        "thermConductivity": 0.0,
        "slashingResistance": 0.0,
        "piercingResistance": 0.0,
        "crushingResistance": 0.0,
        "acidResistance": 0.0,
        "poisonResistance": 0.0,
        "diseaseResistance": 0.0,
        "earthResistance": 0.0,
        "waterResistance": 0.0,
        "fireResistance": 0.0,
        "airResistance": 0.0,
        "lightningResistance": 0.0,
        "frostResistance": 0.0,
        "lifeResistance": 0.0,
        "mindResistance": 0.0,
        "spiritResistance": 0.0,
        "radiantResistance": 0.0,
        "deathResistance": 0.0,
        "shadowResistance": 0.0,
        "chaosResistance": 0.0,
        "voidResistance": 0.0,
        "arcaneResistance": 0.0,
        "magicalResistance": 0.0,
        "hardnessFactor": 0.0,
        "strengthFactor": 0.0,
        "fractureFactor": 0.0,
        "massFactor": 0.0,
        "damageResistance": 0.0
      },
      "substance": {
        "hardness": 0.0,
        "impactToughness": 0.0,
        "fractureChance": 0.0,
        "malleability": 0.0,
        "massPCF": 0.0,
        "density": 0.0,
        "meltingPoint": 0.0,
        "thermConductivity": 0.0,
        "slashingResistance": 0.0,
        "piercingResistance": 0.0,
        "crushingResistance": 0.0,
        "acidResistance": 0.0,
        "poisonResistance": 0.0,
        "diseaseResistance": 0.0,
        "earthResistance": 0.0,
        "waterResistance": 0.0,
        "fireResistance": 0.0,
        "airResistance": 0.0,
        "lightningResistance": 0.0,
        "frostResistance": 0.0,
        "lifeResistance": 0.0,
        "mindResistance": 0.0,
        "spiritResistance": 0.0,
        "radiantResistance": 0.0,
        "deathResistance": 0.0,
        "shadowResistance": 0.0,
        "chaosResistance": 0.0,
        "voidResistance": 0.0,
        "arcaneResistance": 0.0,
        "magicalResistance": 0.0,
        "hardnessFactor": 0.0,
        "strengthFactor": 0.0,
        "fractureFactor": 0.0,
        "massFactor": 0.0
      },
      "weapon": {
        "piercingDamage": 0.0,
        "piercingBleed": 0.0,
        "piercingArmorPenetration": 0.0,
        "slashingDamage": 0.0,
        "slashingBleed": 0.0,
        "slashingArmorPenetration": 0.0,
        "crushingDamage": 0.0,
        "fallbackCrushingDamage": 0.0,
        "disruption": 0.0,
        "deflectionAmount": 0.0,
        "physicalProjectileSpeed": 0.0,
        "knockbackAmount": 0.0,
        "stability": 0.0,
        "falloffMinDistance": 0.0,
        "falloffMaxDistance": 0.0,
        "falloffReduction": 0.0,
        "deflectionRecovery": 0.0,
        "staminaCost": 0.0,
        "physicalPreparationTime": 0.0,
        "physicalRecoveryTime": 0.0,
        "range": 0.0
      },
      "armor": [
        {
          "statsPerSlot": [
            {
              "gearSlot": {
                "id": "ShoulderLeft"
              },
              "stats": {
                "armorClass": 6.0
              },
              "resistances": {
                "slashing": 0.25,
                "piercing": 0.25,
                "crushing": 0.25,
                "physical": 0.0,
                "acid": 0.12999999523162842,
                "poison": 0.12999999523162842,
                "disease": 0.12999999523162842,
                "earth": 0.12999999523162842,
                "water": 0.12999999523162842,
                "fire": 0.12999999523162842,
                "air": 0.12999999523162842,
                "lightning": 0.12999999523162842,
                "frost": 0.12999999523162842,
                "elemental": 0.0,
                "life": 0.12999999523162842,
                "mind": 0.12999999523162842,
                "spirit": 0.12999999523162842,
                "radiant": 0.12999999523162842,
                "light": 0.0,
                "death": 0.12999999523162842,
                "shadow": 0.12999999523162842,
                "chaos": 0.12999999523162842,
                "void": 0.12999999523162842,
                "dark": 0.0,
                "arcane": 0.12999999523162842
              },
              "mitigations": {
                "slashing": 0.0,
                "piercing": 0.0,
                "crushing": 0.0,
                "physical": 0.0,
                "acid": 0.0,
                "poison": 0.0,
                "disease": 0.0,
                "earth": 0.0,
                "water": 0.0,
                "fire": 0.0,
                "air": 0.0,
                "lightning": 0.0,
                "frost": 0.0,
                "elemental": 0.0,
                "life": 0.0,
                "mind": 0.0,
                "spirit": 0.0,
                "radiant": 0.0,
                "light": 0.0,
                "death": 0.0,
                "shadow": 0.0,
                "chaos": 0.0,
                "void": 0.0,
                "dark": 0.0,
                "arcane": 0.0
              }
            }
          ]
        },
        {
          "statsPerSlot": [
            {
              "gearSlot": {
                "id": "ShoulderRight"
              },
              "stats": {
                "armorClass": 6.0
              },
              "resistances": {
                "slashing": 0.25,
                "piercing": 0.25,
                "crushing": 0.25,
                "physical": 0.0,
                "acid": 0.12999999523162842,
                "poison": 0.12999999523162842,
                "disease": 0.12999999523162842,
                "earth": 0.12999999523162842,
                "water": 0.12999999523162842,
                "fire": 0.12999999523162842,
                "air": 0.12999999523162842,
                "lightning": 0.12999999523162842,
                "frost": 0.12999999523162842,
                "elemental": 0.0,
                "life": 0.12999999523162842,
                "mind": 0.12999999523162842,
                "spirit": 0.12999999523162842,
                "radiant": 0.12999999523162842,
                "light": 0.0,
                "death": 0.12999999523162842,
                "shadow": 0.12999999523162842,
                "chaos": 0.12999999523162842,
                "void": 0.12999999523162842,
                "dark": 0.0,
                "arcane": 0.12999999523162842
              },
              "mitigations": {
                "slashing": 0.0,
                "piercing": 0.0,
                "crushing": 0.0,
                "physical": 0.0,
                "acid": 0.0,
                "poison": 0.0,
                "disease": 0.0,
                "earth": 0.0,
                "water": 0.0,
                "fire": 0.0,
                "air": 0.0,
                "lightning": 0.0,
                "frost": 0.0,
                "elemental": 0.0,
                "life": 0.0,
                "mind": 0.0,
                "spirit": 0.0,
                "radiant": 0.0,
                "light": 0.0,
                "death": 0.0,
                "shadow": 0.0,
                "chaos": 0.0,
                "void": 0.0,
                "dark": 0.0,
                "arcane": 0.0
              }
            }
          ]
        }
      ]
    }
  }`,
);
