/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 11:53:40
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 14:19:47
 */

import { ql } from 'camelot-unchained';
import { CharacterSheetState } from '../services/session/character';
import { ItemInfo } from '../services/types/inventoryTypes';

export const testDamageTypeValues: ql.DamageTypeValues = {
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

export const testArmorStats: ql.ArmorStats = {
  neck: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
      ...testDamageTypeValues,
    },
  },
  face: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
      ...testDamageTypeValues,
    },
  },
  shoulderRightUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
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
    mitigations: {
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

export const testWeaponStats: ql.WeaponStats = {
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
    mitigations: {
      ...testDamageTypeValues,
    },
  },
  face: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
      ...testDamageTypeValues,
    },
  },
  shoulderRightUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
      ...testDamageTypeValues,
    },
  },
  neckUnder: {
    resistances: {
      ...testDamageTypeValues,
    },
    mitigations: {
      ...testDamageTypeValues,
    },
  },
};

export const testArmorItem: ItemInfo = {
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

export const testWeaponItem: ItemInfo = {
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

export const testCharacterSheetState: CharacterSheetState = {
  potentialCharacterSlots: [],
  equippedItems: {},
  validItems: {},
  inventoryItems: testInventoryItems,
  stacks: {},
  expandedSlots: {} as any,
  expandedId: '',
};
