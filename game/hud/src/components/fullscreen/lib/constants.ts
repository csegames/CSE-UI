/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArmorType } from './itemInterfaces';

// Scales are relative to UHD
export const HD_SCALE = 0.5;
export const MID_SCALE = 0.6;

export const SLOT_DIMENSIONS = {
  WIDTH: 80,
  HEIGHT: 80,
};

export const emptyStackHash = '00000000000000000000000000000000';
// nullVal and emptyStackHash are two different things. nullVal is shorter in length.
export const nullVal = '0000000000000000000000';

export const placeholderIcon = 'images/unknown-item.jpg';

export const MORE_THAN_STAT_COLOR = '#DFBA79';
export const LESS_THAN_STAT_COLOR = '#AA9B81';

export const TOOLTIP_PADDING = '10px';

export const tradeActionButtonIcons = {
  GOLD_BUTTON: 'images/trade/gold-button.png',
  GREY_BUTTON: 'images/trade/grey-button.png',
  PRESSED_BUTTON: 'images/trade/pressed-button.png',
  UNLOCKED_BUTTON: 'images/trade/unlock-button.png',
};

// --- Item tooltips ---
export const shortenedWeaponStatWords = {
  ['Deflection Recovery']: 'Deflection Rcvry',
  ['Falloff Max Distance']: 'Max FO Dist',
  ['Falloff Min Distance']: 'Min FO Dist',
  ['Falloff Reduction']: 'FO Reduction',
  ['Physical Preparation Time']: 'Prep',
  ['Physical Recovery Time']: 'Recovery',
  ['Stamina Cost']: 'Stamina',
  ['Armor Penetration']: 'AP',

  Amount: '',
  Damage: 'Dmg',
  Fallback: 'FB',
  Penetration: 'Pen',
  Physical: 'Phys',
  Preparation: 'Prep',
  Projectile: 'Prjtl',
  Requirement: '',
};

// s = seconds, m = meters, m/s meters per second
export const weaponStatUnits = {
  deflectionRecovery: 's',
  physicalPreparationTime: 's',
  physicalRecoveryTime: 's',
  falloffMinDistance: 'm',
  falloffMaxDistance: 'm',
  range: 'm',
  physicalProjectileSpeed: 'm/s',
  knockbackAmount: 'N',
};
// -------------------

export const colors = {
  filterOn: '#c0f6d4',
  filterBackgroundColor: '#372F2D',
  lighterFilterBColor: '#5e4f4b',
  searchInputBackgroundColor: '#443F3C',
  searchInputBorder: '#746F6C',
  infoText: '#9E8871',
  smallMoney: '#fff',
  OneHundredKMoney: '#ffff00',
  TenMMoney: '#33cc33',
  goldIcon: '#FAAE26',
  bagIcon: '#8c4321',
  weightIcon: '#d4d2d1',
  inventoryContainerBackgroundColor: 'rgba(255, 0, 0, 0.3)',
  inventoryContainerBorderColor: '#ececec',
  primaryTabPanelColor: '#372F2D',
  tabColorGray: '#464646',
  tabColorRed: '#998677',
  tabActiveBorder: '#EA6D54',
  tabHoverColorGray: '#737271',
  tabHoverColorRed: '#b09885',
  tabClickColorGray: '#8c8987',
  tabClickColorRed: '#c7a993',
  tooltipViking: 'rgba(35, 155, 242, 0.25)',
  tooltipArt: 'rgba(247, 33, 33, 0.25)',
  tooltipTDD: 'rgba(196, 216, 1, 0.25)',
};

export const characterAvatarIcon = {
  MaleHumanMaleA: 'images/paperdoll/icons/icon_humans-m-art.png',
  FemaleHumanMaleA: 'images/paperdoll/icons/icon_humans-f-art.png',
  MaleHumanMaleV: 'images/paperdoll/icons/icon_humans-m-vik.png',
  FemaleHumanMaleV: 'images/paperdoll/icons/icon_humans-f-vik.png',
  MaleHumanMaleT: 'images/paperdoll/icons/icon_humans-m-tdd.png',
  FemaleHumanMaleT: 'images/paperdoll/icons/icon_humans-f-tdd.png',
  MaleLuchorpan: 'images/paperdoll/icons/icon_luchorpan-m.png',
  FemaleLuchorpan: 'images/paperdoll/icons/icon_luchorpan-f.png',
  MaleValkyrie: 'images/paperdoll/icons/icon_valkyrie-m.png',
  FemaleValkyrie: 'images/paperdoll/icons/icon_valkyrie-f.png',
  MalePict: 'images/paperdoll/icons/icon_pict-m.png',
  FemalePict: 'images/paperdoll/icons/icon_pict-f.png',
};

export enum GearSlots {
  Invalid = 'Invalid',
  Head = 'Head',
  Torso = 'Torso',
  Arms = 'Arms',
  Legs = 'Legs',
  Hands = 'Hands',
  Feet = 'Feet',
  Cloak = 'Cloak',
  HeadUnder = 'HeadUnder',
  TorsoUnder = 'TorsoUnder',
  ArmsUnder = 'ArmsUnder',
  LegsUnder = 'LegsUnder',
  HandsUnder = 'HandsUnder',
  FeetUnder = 'FeetUnder',
  OneHandedWeaponRight = 'OneHandedWeaponRight',
  OneHandedWeaponLeft = 'OneHandedWeaponLeft',
  TwoHandedWeapon = 'TwoHandedWeapon',
}

export const displaySlotNames = {
  Invalid: 'Invalid',
  Head: 'HEAD',
  Torso: 'TORSO',
  Arms: 'ARMS',
  Legs: 'LEGS',
  Hands: 'HANDS',
  Feet: 'FEET',
  Cloak: 'CLOAK',
  HeadUnder: 'HEAD UNDER',
  TorsoUnder: 'TORSO UNDER',
  ArmsUnder: 'ARMS UNDER',
  LegsUnder: 'LEGS UNDER',
  HandsUnder: 'HANDS UNDER',
  FeetUnder: 'FEET UNDER',
  OneHandedWeaponRight: '1H RIGHT',
  OneHandedWeaponLeft: '1H LEFT',
  TwoHandedWeapon: '2H WEAPON',
};

export const armorCategories = {
  Invalid: 'Invalid',
  Head: 'H',
  Torso: 'T',
  Arms: 'A',
  Legs: 'L',
  Hands: 'H',
  Feet: 'F',
  Cloak: 'T',
  HeadUnder: 'H',
  TorsoUnder: 'T',
  ArmsUnder: 'A',
  LegsUnder: 'L',
  HandsUnder: 'H',
  FeetUnder: 'F',
};

export const defaultSlotIcons = {
  Invalid: 'Invalid',
  Head: 'icon-slot-face',
  Torso: 'icon-slot-chest',
  Arms: 'icon-slot-forearmleft',
  Legs: 'icon-slot-thighs',
  Hands: 'icon-slot-hand',
  Feet: 'icon-slot-feet',
  Cloak: 'icon-slot-cloak',
  HeadUnder: 'icon-slot-face',
  TorsoUnder: 'icon-slot-chest',
  ArmsUnder: 'icon-slot-forearmleft',
  LegsUnder: 'icon-slot-thighs',
  HandsUnder: 'icon-slot-hand',
  FeetUnder: 'icon-slot-feet',
  OneHandedWeaponRight: 'icon-slot-left-hand-weapon',
  OneHandedWeaponLeft: 'icon-slot-left-hand-weapon',
  TwoHandedWeapon: 'icon-slot-two-hand-weapon',
};

export const footerInfoIcons = {
  gold: 'icon-ui-gold',
  itemCount: 'icon-ui-bag',
  weight: 'icon-ui-weight',
};

export const rowActionIcons = {
  addRow: 'fa-plus',
  removeRow: 'fa-minus',
  pruneRows: 'fa-compress',
};

export const characterBodyPartIcons = {
  Head: 'icon-health-head',
  LeftArm: 'icon-health-arm',
  RightArm: 'icon-health-arm',
  LeftLeg: 'icon-health-leg',
  RightLeg: 'icon-health-leg',
  Torso: 'icon-health-torso',
  _BODY_BEGIN: 'icon-health-torso',
};

const filterIconPrefix = 'icon-filter-';

export const inventoryFilterButtonInfo: {[id: string]: { icon: string, name: string, armorType?: ArmorType }} = {
  // Armor
  Armor: {
    icon: `${filterIconPrefix}armor`,
    name: 'Armor',
  },
  UnderLayer: {
    icon: `${filterIconPrefix}underlayer`,
    name: 'UnderLayer',
  },
  OuterLayer: {
    icon: `${filterIconPrefix}outerlayer`,
    name: 'OuterLayer',
  },

  // Light Armor
  SkullLight: {
    icon: `${filterIconPrefix}light-skull`,
    name: 'SkullLight',
    armorType: ArmorType.Light,
  },
  FaceLight: {
    icon: `${filterIconPrefix}light-face`,
    name: 'FaceLight',
    armorType: ArmorType.Light,
  },
  NeckLight: {
    icon: `${filterIconPrefix}light-neck`,
    name: 'NeckLight',
    armorType: ArmorType.Light,
  },
  ChestLight: {
    icon: `${filterIconPrefix}light-chest`,
    name: 'ChestLight',
    armorType: ArmorType.Light,
  },
  CloakLight: {
    icon: `${filterIconPrefix}light-cloak`,
    name: 'CloakLight',
    armorType: ArmorType.Light,
  },
  BackLight: {
    icon: `${filterIconPrefix}light-back`,
    name: 'BackLight',
    armorType: ArmorType.Light,
  },
  WaistLight: {
    icon: `${filterIconPrefix}light-waist`,
    name: 'WaistLight',
    armorType: ArmorType.Light,
  },
  ForearmLeftLight: {
    icon: `${filterIconPrefix}light-forearm`,
    name: 'ForearmLeftLight',
    armorType: ArmorType.Light,
  },
  ForearmRightLight: {
    icon: `${filterIconPrefix}light-forearm`,
    name: 'ForearmRightLight',
    armorType: ArmorType.Light,
  },
  ShoulderLeftLight: {
    icon: `${filterIconPrefix}light-shoulder`,
    name: 'ShoulderLeftLight',
    armorType: ArmorType.Light,
  },
  ShoulderRightLight: {
    icon: `${filterIconPrefix}light-shoulder`,
    name: 'ShoulderRightLight',
    armorType: ArmorType.Light,
  },
  HandLeftLight: {
    icon: `${filterIconPrefix}light-hand`,
    name: 'HandLeftLight',
    armorType: ArmorType.Light,
  },
  HandRightLight: {
    icon: `${filterIconPrefix}light-hand`,
    name: 'HandRightLight',
    armorType: ArmorType.Light,
  },
  ShinsLight: {
    icon: `${filterIconPrefix}light-shins`,
    name: 'ShinsLight',
    armorType: ArmorType.Light,
  },
  ThighsLight: {
    icon: `${filterIconPrefix}light-thighs`,
    name: 'ThighsLight',
    armorType: ArmorType.Light,
  },
  FeetLight: {
    icon: `${filterIconPrefix}light-feet`,
    name: 'FeetLight',
    armorType: ArmorType.Light,
  },

  // Medium armor
  SkullMedium: {
    icon: `${filterIconPrefix}medium-skull`,
    name: 'SkullMedium',
    armorType: ArmorType.Medium,
  },
  FaceMedium: {
    icon: `${filterIconPrefix}medium-face`,
    name: 'FaceMedium',
    armorType: ArmorType.Medium,
  },
  NeckMedium: {
    icon: `${filterIconPrefix}medium-neck`,
    name: 'NeckMedium',
    armorType: ArmorType.Medium,
  },
  ChestMedium: {
    icon: `${filterIconPrefix}medium-chest`,
    name: 'ChestMedium',
    armorType: ArmorType.Medium,
  },
  CloakMedium: {
    icon: `${filterIconPrefix}medium-cloak`,
    name: 'CloakMedium',
    armorType: ArmorType.Medium,
  },
  BackMedium: {
    icon: `${filterIconPrefix}medium-back`,
    name: 'BackMedium',
    armorType: ArmorType.Medium,
  },
  WaistMedium: {
    icon: `${filterIconPrefix}medium-waist`,
    name: 'WaistMedium',
    armorType: ArmorType.Medium,
  },
  ForearmLeftMedium: {
    icon: `${filterIconPrefix}medium-forearm`,
    name: 'ForearmLeftMedium',
    armorType: ArmorType.Medium,
  },
  ForearmRightMedium: {
    icon: `${filterIconPrefix}medium-forearm`,
    name: 'ForearmRightMedium',
    armorType: ArmorType.Medium,
  },
  ShoulderLeftMedium: {
    icon: `${filterIconPrefix}medium-shoulder`,
    name: 'ShoulderLeftMedium',
    armorType: ArmorType.Medium,
  },
  ShoulderRightMedium: {
    icon: `${filterIconPrefix}medium-shoulder`,
    name: 'ShoulderRightMedium',
    armorType: ArmorType.Medium,
  },
  HandLeftMedium: {
    icon: `${filterIconPrefix}medium-hand`,
    name: 'HandLeftMedium',
    armorType: ArmorType.Medium,
  },
  HandRightMedium: {
    icon: `${filterIconPrefix}medium-hand`,
    name: 'HandRightMedium',
    armorType: ArmorType.Medium,
  },
  ShinsMedium: {
    icon: `${filterIconPrefix}medium-shins`,
    name: 'ShinsMedium',
    armorType: ArmorType.Medium,
  },
  ThighsMedium: {
    icon: `${filterIconPrefix}medium-thighs`,
    name: 'ThighsMedium',
    armorType: ArmorType.Medium,
  },
  FeetMedium: {
    icon: `${filterIconPrefix}medium-feet`,
    name: 'FeetMedium',
    armorType: ArmorType.Medium,
  },

  // Heavy armor
  SkullHeavy: {
    icon: `${filterIconPrefix}heavy-skull`,
    name: 'SkullHeavy',
    armorType: ArmorType.Heavy,
  },
  FaceHeavy: {
    icon: `${filterIconPrefix}heavy-face`,
    name: 'FaceHeavy',
    armorType: ArmorType.Heavy,
  },
  NeckHeavy: {
    icon: `${filterIconPrefix}heavy-neck`,
    name: 'NeckHeavy',
    armorType: ArmorType.Heavy,
  },
  ChestHeavy: {
    icon: `${filterIconPrefix}heavy-chest`,
    name: 'ChestHeavy',
    armorType: ArmorType.Heavy,
  },
  CloakHeavy: {
    icon: `${filterIconPrefix}heavy-cloak`,
    name: 'CloakHeavy',
    armorType: ArmorType.Heavy,
  },
  BackHeavy: {
    icon: `${filterIconPrefix}heavy-back`,
    name: 'BackHeavy',
    armorType: ArmorType.Heavy,
  },
  WaistHeavy: {
    icon: `${filterIconPrefix}heavy-waist`,
    name: 'WaistHeavy',
    armorType: ArmorType.Heavy,
  },
  ForearmLeftHeavy: {
    icon: `${filterIconPrefix}heavy-forearm`,
    name: 'ForearmLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  ForearmRightHeavy: {
    icon: `${filterIconPrefix}heavy-forearm`,
    name: 'ForearmRightHeavy',
    armorType: ArmorType.Heavy,
  },
  ShoulderLeftHeavy: {
    icon: `${filterIconPrefix}heavy-shoulder`,
    name: 'ShoulderLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  ShoulderRightHeavy: {
    icon: `${filterIconPrefix}heavy-shoulder`,
    name: 'ShoulderRightHeavy',
    armorType: ArmorType.Heavy,
  },
  HandLeftHeavy: {
    icon: `${filterIconPrefix}heavy-hand`,
    name: 'HandLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  HandRightHeavy: {
    icon: `${filterIconPrefix}heavy-hand`,
    name: 'HandRightHeavy',
    armorType: ArmorType.Heavy,
  },
  ShinsHeavy: {
    icon: `${filterIconPrefix}heavy-shins`,
    name: 'ShinsHeavy',
    armorType: ArmorType.Heavy,
  },
  ThighsHeavy: {
    icon: `${filterIconPrefix}heavy-thighs`,
    name: 'ThighsHeavy',
    armorType: ArmorType.Heavy,
  },
  FeetHeavy: {
    icon: `${filterIconPrefix}heavy-feet`,
    name: 'FeetHeavy',
    armorType: ArmorType.Heavy,
  },

  // Weapon
  Weapon: {
    icon: `${filterIconPrefix}weapons`,
    name: 'Weapon',
  },
  Axe: {
    icon: `${filterIconPrefix}axe`,
    name: 'Axe',
  },
  Bow: {
    icon: `${filterIconPrefix}bow`,
    name: 'Bow',
  },
  Dagger: {
    icon: `${filterIconPrefix}dagger`,
    name: 'Dagger',
  },
  GreatAxe: {
    icon: `${filterIconPrefix}great-axe`,
    name: 'GreatAxe',
  },
  GreatHammer: {
    icon: `${filterIconPrefix}great-hammer`,
    name: 'GreatHammer',
  },
  GreatMace: {
    icon: `${filterIconPrefix}great-mace`,
    name: 'GreatMace',
  },
  GreatSword: {
    icon: `${filterIconPrefix}great-sword`,
    name: 'GreatSword',
  },
  Hammer: {
    icon: `${filterIconPrefix}hammer`,
    name: 'Hammer',
  },
  LongSword: {
    icon: `${filterIconPrefix}long-sword`,
    name: 'LongSword',
  },
  Mace: {
    icon: `${filterIconPrefix}mace`,
    name: 'Mace',
  },
  Polearm: {
    icon: `${filterIconPrefix}polearm`,
    name: 'Polearm',
  },
  Shield: {
    icon: `${filterIconPrefix}shield`,
    name: 'Shield',
  },
  Spear: {
    icon: `${filterIconPrefix}spear`,
    name: 'Spear',
  },
  Staff: {
    icon: `${filterIconPrefix}staff`,
    name: 'Staff',
  },
  Sword: {
    icon: `${filterIconPrefix}sword`,
    name: 'Sword',
  },
  Torch: {
    icon: `${filterIconPrefix}torch`,
    name: 'Torch',
  },

  // Crafting
  Alloys: {
    icon: `${filterIconPrefix}alloys`,
    name: 'Alloys',
  },
  Substances: {
    icon: `${filterIconPrefix}substances`,
    name: 'Substances',
  },
  BlackLog: {
    icon: `${filterIconPrefix}black-log`,
    name: 'BlackLog',
  },
  CherryBoard: {
    icon: `${filterIconPrefix}cherry-board`,
    name: 'CherryBoard',
  },
  CherryLog: {
    icon: `${filterIconPrefix}cherry-log`,
    name: 'CherryLog',
  },
  Cloths: {
    icon: `${filterIconPrefix}cloths`,
    name: 'Cloths',
  },
  RawCloths: {
    icon: `${filterIconPrefix}cloths-raw`,
    name: 'RawCloths',
  },
  DarkLog: {
    icon: `${filterIconPrefix}dark-log`,
    name: 'DarkLog',
  },
  IgneousOre: {
    icon: `${filterIconPrefix}igneous-ore`,
    name: 'IgneousOre',
  },
  Leathers: {
    icon: `${filterIconPrefix}leathers`,
    name: 'Leathers',
  },
  RawLeathers: {
    icon: `${filterIconPrefix}leathers-raw`,
    name: 'RawLeathers',
  },
  LightLog: {
    icon: `${filterIconPrefix}light-log`,
    name: 'LightLog',
  },
  MetalBar: {
    icon: `${filterIconPrefix}metal-bar`,
    name: 'MetalBar',
  },
  Metals: {
    icon: `${filterIconPrefix}metals`,
    name: 'Metals',
  },
  RawMetals: {
    icon: `${filterIconPrefix}metals-raw`,
    name: 'RawMetals',
  },
  MetamorphicOre: {
    icon: `${filterIconPrefix}metamorphic-ore`,
    name: 'MetamorphicOre',
  },
  SedimentaryOre: {
    icon: `${filterIconPrefix}sedimentary-ore`,
    name: 'SedimentaryOre',
  },
  SoftMetalBar: {
    icon: `${filterIconPrefix}softmetal-bar`,
    name: 'SoftMetalBar',
  },
  Stones: {
    icon: `${filterIconPrefix}stones`,
    name: 'Stones',
  },
  RawStones: {
    icon: `${filterIconPrefix}stones-raw`,
    name: 'RawStones',
  },
  Woods: {
    icon: `${filterIconPrefix}woods`,
    name: 'Woods',
  },
  RawWoods: {
    icon: `${filterIconPrefix}woods-raw`,
    name: 'RawWoods',
  },

  // Misc
  Ammo: {
    icon: `${filterIconPrefix}munitions`,
    name: 'Ammo',
  },
  Bandages: {
    icon: `${filterIconPrefix}bandages`,
    name: 'Bandages',
  },
  Arrow: {
    icon: `${filterIconPrefix}arrow`,
    name: 'Arrow',
  },
  BasaltSlab: {
    icon: `${filterIconPrefix}basalt-slab`,
    name: 'BasaltSlab',
  },
  BlackBoard: {
    icon: `${filterIconPrefix}black-board`,
    name: 'BlackBoard',
  },
  Blocks: {
    icon: `${filterIconPrefix}blocks`,
    name: 'Blocks',
  },
  Bolt: {
    icon: `${filterIconPrefix}bolt`,
    name: 'Bolt',
  },
  Building: {
    icon: `${filterIconPrefix}building`,
    name: 'Building',
  },
  Consumables: {
    icon: `${filterIconPrefix}consumables`,
    name: 'Consumables',
  },
  DarkBoard: {
    icon: `${filterIconPrefix}dark-board`,
    name: 'DarkBoard',
  },
  Decor: {
    icon: `${filterIconPrefix}decor`,
    name: 'Decor',
  },
  Deployables: {
    icon: `${filterIconPrefix}deployables`,
    name: 'Deployables',
  },
  Focus: {
    icon: `${filterIconPrefix}focus`,
    name: 'Focus',
  },
  GneissSlab: {
    icon: `${filterIconPrefix}gneiss-slab`,
    name: 'GneissSlab',
  },
  GraniteSlab: {
    icon: `${filterIconPrefix}granite-slab`,
    name: 'GraniteSlab',
  },
  HardMetalBar: {
    icon: `${filterIconPrefix}hardmetal-bar`,
    name: 'HardMetalBar',
  },
  Interactive: {
    icon: `${filterIconPrefix}interactive`,
    name: 'Interactive',
  },
  LightBoard: {
    icon: `${filterIconPrefix}light-board`,
    name: 'LightBoard',
  },
  MarbleSlab: {
    icon: `${filterIconPrefix}marble-slab`,
    name: 'MarbleSlab',
  },
  Potion: {
    icon: `${filterIconPrefix}potion`,
    name: 'Potion',
  },
  QuartziteSlab: {
    icon: `${filterIconPrefix}quartzite-slab`,
    name: 'QuartziteSlab',
  },
  Reagents: {
    icon: `${filterIconPrefix}reagents`,
    name: 'Reagents',
  },
  SandstoneSlab: {
    icon: `${filterIconPrefix}sandstone-slab`,
    name: 'SandstoneSlab',
  },
  Siege: {
    icon: `${filterIconPrefix}siege`,
    name: 'Siege',
  },
  SlateSlab: {
    icon: `${filterIconPrefix}slate-slab`,
    name: 'SlateSlab',
  },
  Thrown: {
    icon: `${filterIconPrefix}thrown`,
    name: 'Thrown',
  },
  Trap: {
    icon: `${filterIconPrefix}trap`,
    name: 'Trap',
  },
  Vial: {
    icon: `${filterIconPrefix}vial`,
    name: 'Vial',
  },
};
