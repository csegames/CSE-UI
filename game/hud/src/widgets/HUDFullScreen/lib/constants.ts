/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { InventoryItemFragment } from '../../../gqlInterfaces';

export const emptyStackHash = '00000000000000000000000000000000';
// nullVal and emptyStackHash are two different things. nullVal is shorter in length.
export const nullVal = '0000000000000000000000';

export const placeholderIcon = 'images/unknown-item.jpg';

export const MORE_THAN_STAT_COLOR = '#DFBA79';
export const LESS_THAN_STAT_COLOR = '#AA9B81';

export const TOOLTIP_PADDING = '10px';

export const SLOT_DIMENSIONS = {
  WIDTH: 80,
  HEIGHT: 80,
};

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
  boonPrimary: '#41ACE9',
  banePrimary: '#E85143',
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

export const gearSlots = {
  Invalid: 'Invalid',
  Skull: 'Skull',
  Face: 'Face',
  Neck: 'Neck',
  Chest: 'Chest',
  Cloak: 'Cloak',
  CloakUnder: 'CloakUnder',
  Back: 'Back',
  Waist: 'Waist',
  ForearmLeft: 'ForearmLeft',
  ForearmRight: 'ForearmRight',
  ShoulderLeft: 'ShoulderLeft',
  ShoulderRight: 'ShoulderRight',
  HandLeft: 'HandLeft',
  HandRight: 'HandRight',
  Shins: 'Shins',
  Thighs: 'Thighs',
  Feet: 'Feet',
  SkullUnder: 'SkullUnder',
  FaceUnder: 'FaceUnder',
  NeckUnder: 'NeckUnder',
  ChestUnder: 'ChestUnder',
  BackUnder: 'BackUnder',
  WaistUnder: 'WaistUnder',
  ForearmLeftUnder: 'ForearmLeftUnder',
  ForearmRightUnder: 'ForearmRightUnder',
  ShoulderLeftUnder: 'ShoulderLeftUnder',
  ShoulderRightUnder: 'ShoulderRightUnder',
  HandLeftUnder: 'HandLeftUnder',
  HandRightUnder: 'HandRightUnder',
  ShinsUnder: 'ShinsUnder',
  ThighsUnder: 'ThighsUnder',
  FeetUnder: 'FeetUnder',
  PrimaryHandWeapon: 'PrimaryHandWeapon',
  SecondaryHandWeapon: 'SecondaryHandWeapon',
};

export const displaySlotNames = {
  Invalid: 'Invalid',
  Skull: 'SKULL',
  Face: 'FACE',
  Neck: 'NECK',
  Chest: 'CHEST',
  Cloak: 'CLOAK',
  CloakUnder: 'CLOAK',
  Back: 'BACK',
  Waist: 'WAIST',
  ForearmLeft: 'L FOREARM',
  ForearmRight: 'R FOREARM',
  ShoulderLeft: 'L SHOULDER',
  ShoulderRight: 'R SHOULDER',
  HandLeft: 'L HAND',
  HandRight: 'R HAND',
  Shins: 'SHINS',
  Thighs: 'THIGHS',
  Feet: 'FEET',
  SkullUnder: 'SKULL',
  FaceUnder: 'FACE',
  NeckUnder: 'NECK',
  ChestUnder: 'CHEST',
  BackUnder: 'BACK',
  WaistUnder: 'WAIST',
  ForearmLeftUnder: 'L FOREARM',
  ForearmRightUnder: 'R FOREARM',
  ShoulderLeftUnder: 'L SHOULDER',
  ShoulderRightUnder: 'R SHOULDER',
  HandLeftUnder: 'L HAND',
  HandRightUnder: 'R HAND',
  ShinsUnder: 'SHINS',
  ThighsUnder: 'THIGHS',
  FeetUnder: 'FEET',
  PrimaryHandWeapon: 'P WEAPON',
  SecondaryHandWeapon: 'S WEAPON',
};

export const armorCategories = {
  skull: 'H',
  face: 'H',
  neck: 'H',
  chest: 'T',
  cloak: 'T',
  cloakUnder: 'T',
  back: 'T',
  waist: 'T',
  forearmLeft: 'LA',
  forearmRight: 'RA',
  shoulderLeftl: 'T',
  shoulderRight: 'T',
  handLeft: 'LA',
  handRight: 'RA',
  shins: 'L',
  thighs: 'L',
  feet: 'L',
  skullUnder: 'face',
  faceUnder: 'H',
  neckUnder: 'H',
  chestUnder: 'T',
  backUnder: 'T',
  waistUnder: 'T',
  forearmLeftUnder: 'LA',
  forearmRightUnder: 'RA',
  shoulderLeftUnder: 'T',
  shoulderRightUnder: 'T',
  handLeftUnder: 'LA',
  handRightUnder: 'RA',
  shinsUnder: 'L',
  thighsUnder: 'L',
  feetUnder: 'L',
};

export const defaultSlotIcons = {
  Skull: 'icon-slot-skull',
  Face: 'icon-slot-face',
  Neck: 'icon-slot-neck',
  Chest: 'icon-slot-chest',
  Cloak: 'icon-slot-cloak',
  Back: 'icon-slot-back',
  Waist: 'icon-slot-waist',
  ForearmLeft: 'icon-slot-forearmleft',
  ForearmRight: 'icon-slot-forearmleft',
  ShoulderLeft: 'icon-slot-shoulder',
  ShoulderRight: 'icon-slot-shoulder',
  HandLeft: 'icon-slot-hand',
  HandRight: 'icon-slot-hand',
  Shins: 'icon-slot-shin',
  Thighs: 'icon-slot-thighs',
  Feet: 'icon-slot-feet',
  SkullUnder: 'icon-slot-skull',
  FaceUnder: 'icon-slot-face',
  NeckUnder: 'icon-slot-neck',
  ChestUnder: 'icon-slot-chest',
  CloakUnder: 'icon-slot-cloak',
  BackUnder: 'icon-slot-back',
  WaistUnder: 'icon-slot-waist',
  ForearmLeftUnder: 'icon-slot-forearmleft',
  ForearmRightUnder: 'icon-slot-forearmleft',
  ShoulderLeftUnder: 'icon-slot-shoulder',
  ShoulderRightUnder: 'icon-slot-shoulder',
  HandLeftUnder: 'icon-slot-hand',
  HandRightUnder: 'icon-slot-hand',
  ShinsUnder: 'icon-slot-shin',
  ThighsUnder: 'icon-slot-thighs',
  FeetUnder: 'icon-slot-feet',
  PrimaryHandWeapon: 'icon-filter-weapons',
  SecondaryHandWeapon: 'icon-filter-weapons',
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

export enum ArmorType {
  Heavy,
  Medium,
  Light,
}
export interface InventoryFilterButton {
  // The css class for the icon to use
  icon: string;
  // Unique name for this filter (** MUST BE UNIQUE **)
  name: string;
  // Any additional styling to add to the icon displayed
  // usually for flipping an icon for left / right
  style?: React.CSSProperties;
  // Filter method returns true if the given item should
  // be displayed when this filter is active
  filter: (item: InventoryItemFragment) => boolean;
  // Used to distinguish difference between Heavy, Medium, and Light armor
  armorType?: ArmorType;
}

function filterForGearSlot(item: InventoryItemFragment, filter: { icon: string, name: string, armorType?: ArmorType }) {
  return item &&
    _.findIndex(item.staticDefinition.gearSlotSets, set =>
      _.find(set.gearSlots, slot => _.includes(filter.name.toLowerCase(), slot.id.toLowerCase()))) > -1 &&
      (filter.armorType ?
        _.includes(item.staticDefinition.description.toLowerCase(), filter.armorType.toString().toLowerCase()) : true);
}

function filterForDescription(item: InventoryItemFragment, filter: { icon: string, name: string }) {
  return item &&
    _.includes(item.staticDefinition.description.toLowerCase(), filter.name.toLowerCase());
}

function filterForItemType(item: InventoryItemFragment, filter: { icon: string, name: string }) {
  return item &&
    _.includes(item.staticDefinition.itemType.toLowerCase(), filter.name.toLowerCase());
}

function filterForLayer(item: InventoryItemFragment, layer: 'outer' | 'under') {
  return item &&
    _.findIndex(item.staticDefinition.gearSlotSets, set =>
      _.find(set.gearSlots, slot => _.includes(slot.id.toLowerCase(), layer))) > -1;
}

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

export const inventoryFilterButtons: {
  [key: string]: InventoryFilterButton,
} = {
  // Armor
  Armor: {
    ...inventoryFilterButtonInfo.Armor,
    filter: (item: InventoryItemFragment) => filterForItemType(item, inventoryFilterButtonInfo.Armor),
  },
  UnderLayer: {
    ...inventoryFilterButtonInfo.UnderLayer,
    filter: (item: InventoryItemFragment) => filterForLayer(item, 'under'),
  },
  OuterLayer: {
    ...inventoryFilterButtonInfo.OuterLayer,
    filter: (item: InventoryItemFragment) => filterForLayer(item, 'outer'),
  },
  // Light armor
  SkullLight: {
    ...inventoryFilterButtonInfo.SkullLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullLight),
  },
  FaceLight: {
    ...inventoryFilterButtonInfo.FaceLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceLight),
  },
  NeckLight: {
    ...inventoryFilterButtonInfo.NeckLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckLight),
  },
  ChestLight: {
    ...inventoryFilterButtonInfo.ChestLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestLight),
  },
  CloakLight: {
    ...inventoryFilterButtonInfo.CloakLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakLight),
  },
  BackLight: {
    ...inventoryFilterButtonInfo.BackLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackLight),
  },
  WaistLight: {
    ...inventoryFilterButtonInfo.WaistLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistLight),
  },
  ForearmLeftLight: {
    ...inventoryFilterButtonInfo.ForearmLeftLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftLight),
  },
  ForearmRightLight: {
    ...inventoryFilterButtonInfo.ForearmRightLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightLight),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShoulderLeftLight: {
    ...inventoryFilterButtonInfo.ShoulderLeftLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftLight),
  },
  ShoulderRightLight: {
    ...inventoryFilterButtonInfo.ShoulderRightLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightLight),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  HandLeftLight: {
    ...inventoryFilterButtonInfo.HandLeftLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftLight),
  },
  HandRightLight: {
    ...inventoryFilterButtonInfo.HandRightLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightLight),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShinsLight: {
    ...inventoryFilterButtonInfo.ShinsLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsLight),
  },
  ThighsLight: {
    ...inventoryFilterButtonInfo.ThighsLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsLight),
  },
  FeetLight: {
    ...inventoryFilterButtonInfo.FeetLight,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetLight),
  },
  // Medium armor
  SkullMedium: {
    ...inventoryFilterButtonInfo.SkullMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullMedium),
  },
  FaceMedium: {
    ...inventoryFilterButtonInfo.FaceMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceMedium),
  },
  NeckMedium: {
    ...inventoryFilterButtonInfo.NeckMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckMedium),
  },
  ChestMedium: {
    ...inventoryFilterButtonInfo.ChestMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestMedium),
  },
  CloakMedium: {
    ...inventoryFilterButtonInfo.CloakMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakMedium),
  },
  BackMedium: {
    ...inventoryFilterButtonInfo.BackMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackMedium),
  },
  WaistMedium: {
    ...inventoryFilterButtonInfo.WaistMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistMedium),
  },
  ForearmLeftMedium: {
    ...inventoryFilterButtonInfo.ForearmLeftMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftMedium),
  },
  ForearmRightMedium: {
    ...inventoryFilterButtonInfo.ForearmRightMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightMedium),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShoulderLeftMedium: {
    ...inventoryFilterButtonInfo.ShoulderLeftMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftMedium),
  },
  ShoulderRightMedium: {
    ...inventoryFilterButtonInfo.ShoulderRightMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightMedium),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  HandLeftMedium: {
    ...inventoryFilterButtonInfo.HandLeftMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftMedium),
  },
  HandRightMedium: {
    ...inventoryFilterButtonInfo.HandRightMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightMedium),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShinsMedium: {
    ...inventoryFilterButtonInfo.ShinsMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsMedium),
  },
  ThighsMedium: {
    ...inventoryFilterButtonInfo.ThighsMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsMedium),
  },
  FeetMedium: {
    ...inventoryFilterButtonInfo.FeetMedium,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetMedium),
  },
  // Heavy armor
  SkullHeavy: {
    ...inventoryFilterButtonInfo.SkullHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.SkullHeavy),
  },
  FaceHeavy: {
    ...inventoryFilterButtonInfo.FaceHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FaceHeavy),
  },
  NeckHeavy: {
    ...inventoryFilterButtonInfo.NeckHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.NeckHeavy),
  },
  ChestHeavy: {
    ...inventoryFilterButtonInfo.ChestHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ChestHeavy),
  },
  CloakHeavy: {
    ...inventoryFilterButtonInfo.CloakHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.CloakHeavy),
  },
  BackHeavy: {
    ...inventoryFilterButtonInfo.BackHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.BackHeavy),
  },
  WaistHeavy: {
    ...inventoryFilterButtonInfo.WaistHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.WaistHeavy),
  },
  ForearmLeftHeavy: {
    ...inventoryFilterButtonInfo.ForearmLeftHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmLeftHeavy),
  },
  ForearmRightHeavy: {
    ...inventoryFilterButtonInfo.ForearmRightHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ForearmRightHeavy),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShoulderLeftHeavy: {
    ...inventoryFilterButtonInfo.ShoulderLeftHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderLeftHeavy),
  },
  ShoulderRightHeavy: {
    ...inventoryFilterButtonInfo.ShoulderRightHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShoulderRightHeavy),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  HandLeftHeavy: {
    ...inventoryFilterButtonInfo.HandLeftHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandLeftHeavy),
  },
  HandRightHeavy: {
    ...inventoryFilterButtonInfo.HandRightHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.HandRightHeavy),
    style: {
      transform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
    },
  },
  ShinsHeavy: {
    ...inventoryFilterButtonInfo.ShinsHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ShinsHeavy),
  },
  ThighsHeavy: {
    ...inventoryFilterButtonInfo.ThighsHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.ThighsHeavy),
  },
  FeetHeavy: {
    ...inventoryFilterButtonInfo.FeetHeavy,
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.FeetHeavy),
  },
  Weapon: {
    ...inventoryFilterButtonInfo.Weapon,
    filter: (item: InventoryItemFragment) => filterForItemType(item, inventoryFilterButtonInfo.Weapon),
  },
  Axe: {
    ...inventoryFilterButtonInfo.Axe,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Axe),
  },
  Bow: {
    ...inventoryFilterButtonInfo.Bow,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Bow),
  },
  Dagger: {
    ...inventoryFilterButtonInfo.Dagger,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Dagger),
  },
  GreatAxe: {
    ...inventoryFilterButtonInfo.GreatAxe,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatAxe),
  },
  GreatHammer: {
    ...inventoryFilterButtonInfo.GreatHammer,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatHammer),
  },
  GreatMace: {
    ...inventoryFilterButtonInfo.GreatMace,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatMace),
  },
  GreatSword: {
    ...inventoryFilterButtonInfo.GreatSword,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GreatSword),
  },
  Hammer: {
    ...inventoryFilterButtonInfo.Hammer,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Hammer),
  },
  LongSword: {
    ...inventoryFilterButtonInfo.LongSword,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.LongSword),
  },
  Mace: {
    ...inventoryFilterButtonInfo.Mace,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Mace),
  },
  Polearm: {
    ...inventoryFilterButtonInfo.Polearm,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Polearm),
  },
  Shield: {
    ...inventoryFilterButtonInfo.Shield,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Shield),
  },
  Spear: {
    ...inventoryFilterButtonInfo.Spear,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Spear),
  },
  Staff: {
    ...inventoryFilterButtonInfo.Staff,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Staff),
  },
  Sword: {
    ...inventoryFilterButtonInfo.Sword,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Sword),
  },
  Torch: {
    ...inventoryFilterButtonInfo.Torch,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Torch),
  },
  Alloys: {
    ...inventoryFilterButtonInfo.Alloys,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Alloys),
  },
  Substances: {
    ...inventoryFilterButtonInfo.Substances,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Substances),
  },
  BlackLog: {
    ...inventoryFilterButtonInfo.BlackLog,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.BlackLog),
  },
  CherryBoard: {
    ...inventoryFilterButtonInfo.CherryBoard,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.CherryBoard),
  },
  CherryLog: {
    ...inventoryFilterButtonInfo.CherryLog,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.CherryLog),
  },
  Cloths: {
    ...inventoryFilterButtonInfo.Cloths,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Cloths),
  },
  RawCloths: {
    ...inventoryFilterButtonInfo.RawCloths,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.RawCloths),
  },
  DarkLog: {
    ...inventoryFilterButtonInfo.DarkLog,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.DarkLog),
  },
  IgneousOre: {
    ...inventoryFilterButtonInfo.IgneousOre,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.IgneousOre),
  },
  Leathers: {
    ...inventoryFilterButtonInfo.Leathers,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Leathers),
  },
  RawLeathers: {
    ...inventoryFilterButtonInfo.RawLeathers,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.RawLeathers),
  },
  LightLog: {
    ...inventoryFilterButtonInfo.LightLog,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.LightLog),
  },
  MetalBar: {
    ...inventoryFilterButtonInfo.MetalBar,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.MetalBar),
  },
  Metals: {
    ...inventoryFilterButtonInfo.Metals,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Metals),
  },
  RawMetals: {
    ...inventoryFilterButtonInfo.RawMetals,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.RawMetals),
  },
  MetamorphicOre: {
    ...inventoryFilterButtonInfo.MetamorphicOre,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.MetamorphicOre),
  },
  SedimentaryOre: {
    ...inventoryFilterButtonInfo.SedimentaryOre,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.SedimentaryOre),
  },
  SoftMetalBar: {
    ...inventoryFilterButtonInfo.SoftMetalBar,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.SoftMetalBar),
  },
  Stones: {
    ...inventoryFilterButtonInfo.Stones,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Stones),
  },
  RawStones: {
    ...inventoryFilterButtonInfo.RawStones,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.RawStones),
  },
  Woods: {
    ...inventoryFilterButtonInfo.Woods,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Woods),
  },
  RawWoods: {
    ...inventoryFilterButtonInfo.RawWoods,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.RawWoods),
  },
  Ammo: {
    ...inventoryFilterButtonInfo.Ammo,
    filter: (item: InventoryItemFragment) => filterForItemType(item, inventoryFilterButtonInfo.Ammo),
  },
  Bandages: {
    ...inventoryFilterButtonInfo.Bandages,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Bandages),
  },
  Arrow: {
    ...inventoryFilterButtonInfo.Arrow,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Arrow),
  },
  BasaltSlab: {
    ...inventoryFilterButtonInfo.BasaltSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.BasaltSlab),
  },
  BlackBoard: {
    ...inventoryFilterButtonInfo.BlackBoard,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.BlackBoard),
  },
  Blocks: {
    ...inventoryFilterButtonInfo.Blocks,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Blocks),
  },
  Bolt: {
    ...inventoryFilterButtonInfo.Bolt,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Bolt),
  },
  Building: {
    ...inventoryFilterButtonInfo.Building,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Building),
  },
  Consumables: {
    ...inventoryFilterButtonInfo.Consumables,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Consumables),
  },
  DarkBoard: {
    ...inventoryFilterButtonInfo.DarkBoard,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.DarkBoard),
  },
  Decor: {
    ...inventoryFilterButtonInfo.Decor,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Decor),
  },
  Deployables: {
    ...inventoryFilterButtonInfo.Deployables,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Deployables),
  },
  Focus: {
    ...inventoryFilterButtonInfo.Focus,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Focus),
  },
  GneissSlab: {
    ...inventoryFilterButtonInfo.GneissSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GneissSlab),
  },
  GraniteSlab: {
    ...inventoryFilterButtonInfo.GraniteSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.GraniteSlab),
  },
  HardMetalBar: {
    ...inventoryFilterButtonInfo.HardMetalBar,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.HardMetalBar),
  },
  Interactive: {
    ...inventoryFilterButtonInfo.Interactive,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Interactive),
  },
  LightBoard: {
    ...inventoryFilterButtonInfo.LightBoard,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.LightBoard),
  },
  MarbleSlab: {
    ...inventoryFilterButtonInfo.MarbleSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.MarbleSlab),
  },
  Potion: {
    ...inventoryFilterButtonInfo.Potion,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Potion),
  },
  QuartziteSlab: {
    ...inventoryFilterButtonInfo.QuartziteSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.QuartziteSlab),
  },
  Reagents: {
    ...inventoryFilterButtonInfo.Reagents,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Reagents),
  },
  SandstoneSlab: {
    ...inventoryFilterButtonInfo.SandstoneSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.SandstoneSlab),
  },
  Siege: {
    ...inventoryFilterButtonInfo.Siege,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Siege),
  },
  SlateSlab: {
    ...inventoryFilterButtonInfo.SlateSlab,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.SlateSlab),
  },
  Thrown: {
    ...inventoryFilterButtonInfo.Thrown,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Thrown),
  },
  Trap: {
    ...inventoryFilterButtonInfo.Trap,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Trap),
  },
  Vial: {
    ...inventoryFilterButtonInfo.Vial,
    filter: (item: InventoryItemFragment) => filterForDescription(item, inventoryFilterButtonInfo.Vial),
  },
};

export const defaultFilterButtonIcons = [
  inventoryFilterButtons.Armor,
  inventoryFilterButtons.OuterLayer,
  inventoryFilterButtons.UnderLayer,
  inventoryFilterButtons.Weapon,
  inventoryFilterButtons.Cloths,
  inventoryFilterButtons.Woods,
  inventoryFilterButtons.Metals,
  inventoryFilterButtons.Ammo,
];

export const inventoryEditFilterButtons: InventoryFilterButton[] = [
  // Light armor
  inventoryFilterButtons.SkullLight,
  inventoryFilterButtons.FaceLight,
  inventoryFilterButtons.NeckLight,
  inventoryFilterButtons.ChestLight,
  inventoryFilterButtons.CloakLight,
  inventoryFilterButtons.BackLight,
  inventoryFilterButtons.WaistLight,
  inventoryFilterButtons.ForearmLeftLight,
  inventoryFilterButtons.ForearmRightLight,
  inventoryFilterButtons.ShoulderLeftLight,
  inventoryFilterButtons.ShoulderRightLight,
  inventoryFilterButtons.HandLeftLight,
  inventoryFilterButtons.HandRightLight,
  inventoryFilterButtons.ShinsLight,
  inventoryFilterButtons.ThighsLight,
  inventoryFilterButtons.FeetLight,

  // Medium armor
  inventoryFilterButtons.SkullMedium,
  inventoryFilterButtons.FaceMedium,
  inventoryFilterButtons.NeckMedium,
  inventoryFilterButtons.ChestMedium,
  inventoryFilterButtons.CloakMedium,
  inventoryFilterButtons.BackMedium,
  inventoryFilterButtons.WaistMedium,
  inventoryFilterButtons.ForearmLeftMedium,
  inventoryFilterButtons.ForearmRightMedium,
  inventoryFilterButtons.ShoulderLeftMedium,
  inventoryFilterButtons.ShoulderRightMedium,
  inventoryFilterButtons.HandLeftMedium,
  inventoryFilterButtons.HandRightMedium,
  inventoryFilterButtons.ShinsMedium,
  inventoryFilterButtons.ThighsMedium,
  inventoryFilterButtons.FeetMedium,

  // Heavy armor
  inventoryFilterButtons.SkullHeavy,
  inventoryFilterButtons.FaceHeavy,
  inventoryFilterButtons.NeckHeavy,
  inventoryFilterButtons.ChestHeavy,
  inventoryFilterButtons.CloakHeavy,
  inventoryFilterButtons.BackHeavy,
  inventoryFilterButtons.WaistHeavy,
  inventoryFilterButtons.ForearmLeftHeavy,
  inventoryFilterButtons.ForearmRightHeavy,
  inventoryFilterButtons.ShoulderLeftHeavy,
  inventoryFilterButtons.ShoulderRightHeavy,
  inventoryFilterButtons.HandLeftHeavy,
  inventoryFilterButtons.HandRightHeavy,
  inventoryFilterButtons.ShinsHeavy,
  inventoryFilterButtons.ThighsHeavy,
  inventoryFilterButtons.FeetHeavy,

  // Weapon
  inventoryFilterButtons.Axe,
  inventoryFilterButtons.Bow,
  inventoryFilterButtons.Dagger,
  inventoryFilterButtons.GreatAxe,
  inventoryFilterButtons.GreatHammer,
  inventoryFilterButtons.GreatMace,
  inventoryFilterButtons.GreatSword,
  inventoryFilterButtons.Hammer,
  inventoryFilterButtons.LongSword,
  inventoryFilterButtons.Mace,
  inventoryFilterButtons.Polearm,
  inventoryFilterButtons.Shield,
  inventoryFilterButtons.Spear,
  inventoryFilterButtons.Staff,
  inventoryFilterButtons.Sword,
  inventoryFilterButtons.Torch,

  // Crafting
  inventoryFilterButtons.Alloys,
  inventoryFilterButtons.Substances,
  inventoryFilterButtons.BlackLog,
  inventoryFilterButtons.CherryBoard,
  inventoryFilterButtons.CherryLog,
  inventoryFilterButtons.Cloths,
  inventoryFilterButtons.RawCloths,
  inventoryFilterButtons.DarkLog,
  inventoryFilterButtons.IgneousOre,
  inventoryFilterButtons.Leathers,
  inventoryFilterButtons.RawLeathers,
  inventoryFilterButtons.LightLog,
  inventoryFilterButtons.MetalBar,
  inventoryFilterButtons.Metals,
  inventoryFilterButtons.RawMetals,
  inventoryFilterButtons.MetamorphicOre,
  inventoryFilterButtons.SedimentaryOre,
  inventoryFilterButtons.SoftMetalBar,
  inventoryFilterButtons.Stones,
  inventoryFilterButtons.RawStones,
  inventoryFilterButtons.Woods,
  inventoryFilterButtons.RawWoods,

  // Misc
  inventoryFilterButtons.Ammo,
  inventoryFilterButtons.Bandages,
  inventoryFilterButtons.Arrow,
  inventoryFilterButtons.BasaltSlab,
  inventoryFilterButtons.BlackBoard,
  inventoryFilterButtons.Blocks,
  inventoryFilterButtons.Bolt,
  inventoryFilterButtons.Building,
  inventoryFilterButtons.Consumables,
  inventoryFilterButtons.DarkBoard,
  inventoryFilterButtons.Decor,
  inventoryFilterButtons.Deployables,
  inventoryFilterButtons.Focus,
  inventoryFilterButtons.GneissSlab,
  inventoryFilterButtons.GraniteSlab,
  inventoryFilterButtons.HardMetalBar,
  inventoryFilterButtons.Interactive,
  inventoryFilterButtons.LightBoard,
  inventoryFilterButtons.MarbleSlab,
  inventoryFilterButtons.Potion,
  inventoryFilterButtons.QuartziteSlab,
  inventoryFilterButtons.Reagents,
  inventoryFilterButtons.SandstoneSlab,
  inventoryFilterButtons.Siege,
  inventoryFilterButtons.SlateSlab,
  inventoryFilterButtons.Thrown,
  inventoryFilterButtons.Trap,
  inventoryFilterButtons.Vial,
];
