/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-22 15:44:33
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-17 17:26:22
 */

import * as React from 'react';
import * as _ from 'lodash';

import { InventoryItemFragment } from '../../../gqlInterfaces';

export const emptyStackHash = '00000000000000000000000000000000';

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

export const displayNames = {
  Invalid: 'Invalid',
  Skull: 'Skull',
  Face: 'Face',
  Neck: 'Neck',
  Chest: 'Chest',
  Cloak: 'Cloak',
  CloakUnder: 'Cloak',
  Back: 'Back',
  Waist: 'Waist',
  ForearmLeft: 'L Forearm',
  ForearmRight: 'R Forearm',
  ShoulderLeft: 'L Shoulder',
  ShoulderRight: 'R Shoulder',
  HandLeft: 'L Hand',
  HandRight: 'R Hand',
  Shins: 'Shins',
  Thighs: 'Thighs',
  Feet: 'Feet',
  SkullUnder: 'Skull',
  FaceUnder: 'Face',
  NeckUnder: 'Neck',
  ChestUnder: 'Chest',
  BackUnder: 'Back',
  WaistUnder: 'Waist',
  ForearmLeftUnder: 'L Forearm',
  ForearmRightUnder: 'R Forearm',
  ShoulderLeftUnder: 'L Shoulder',
  ShoulderRightUnder: 'R Shoulder',
  HandLeftUnder: 'L Hand',
  HandRightUnder: 'R Hand',
  ShinsUnder: 'Shins',
  ThighsUnder: 'Thighs',
  FeetUnder: 'Feet',
  PrimaryHandWeapon: 'P Weapon',
  SecondaryHandWeapon: 'S Weapon',
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
  ForearmLeft: 'icon-slot-forearm',
  ForearmRight: 'icon-slot-forearm',
  ShoulderLeft: 'icon-slot-shoulder',
  ShoulderRight: 'icon-slot-shoulder',
  HandLeft: 'icon-slot-hand',
  HandRight: 'icon-slot-hand',
  Shins: 'icon-slot-shins',
  Thighs: 'icon-slot-thighs',
  Feet: 'icon-slot-feet',
  SkullUnder: 'icon-slot-skull',
  FaceUnder: 'icon-slot-face',
  NeckUnder: 'icon-slot-neck',
  ChestUnder: 'icon-slot-chest',
  CloakUnder: 'icon-slot-cloak',
  BackUnder: 'icon-slot-back',
  WaistUnder: 'icon-slot-waist',
  ForearmLeftUnder: 'icon-slot-forearm',
  ForearmRightUnder: 'icon-slot-forearm',
  ShoulderLeftUnder: 'icon-slot-shoulder',
  ShoulderRightUnder: 'icon-slot-shoulder',
  HandLeftUnder: 'icon-slot-hand',
  HandRightUnder: 'icon-slot-hand',
  ShinsUnder: 'icon-slot-shins',
  ThighsUnder: 'icon-slot-thighs',
  FeetUnder: 'icon-slot-feet',
  PrimaryHandWeapon: '',
  SecondaryHandWeapon: '',
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

export const characterHealthIcons = {
  head: 'icon-health-head',
  leftArm: 'icon-health-arm',
  rightArm: 'icon-health-arm',
  leftLeg: 'icon-health-leg',
  rightLeg: 'icon-health-leg',
  torso: 'icon-health-torso',
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
      _.find(set.gearSlots, (slot) => _.includes(filter.name.toLowerCase(), slot.id.toLowerCase()))) > -1 &&
      (filter.armorType ?
        _.includes(item.staticDefinition.description.toLowerCase(), filter.armorType.toString().toLowerCase()) : true);
}

export const inventoryFilterButtonInfo: {[id: string]: { icon: string, name: string, armorType?: ArmorType }} = {
  // Light armor
  SkullLight: {
    icon: 'icon-filter-light-skull',
    name: 'SkullLight',
    armorType: ArmorType.Light,
  },
  FaceLight: {
    icon: 'icon-filter-light-face',
    name: 'FaceLight',
    armorType: ArmorType.Light,
  },
  NeckLight: {
    icon: 'icon-filter-light-neck',
    name: 'NeckLight',
    armorType: ArmorType.Light,
  },
  ChestLight: {
    icon: 'icon-filter-light-chest',
    name: 'ChestLight',
    armorType: ArmorType.Light,
  },
  CloakLight: {
    icon: 'icon-filter-light-cloak',
    name: 'CloakLight',
    armorType: ArmorType.Light,
  },
  BackLight: {
    icon: 'icon-filter-light-back',
    name: 'BackLight',
    armorType: ArmorType.Light,
  },
  WaistLight: {
    icon: 'icon-filter-light-waist',
    name: 'WaistLight',
    armorType: ArmorType.Light,
  },
  ForearmLeftLight: {
    icon: 'icon-filter-light-forearm',
    name: 'ForearmLeftLight',
    armorType: ArmorType.Light,
  },
  ForearmRightLight: {
    icon: 'icon-filter-light-forearm',
    name: 'ForearmRightLight',
    armorType: ArmorType.Light,
  },
  ShoulderLeftLight: {
    icon: 'icon-filter-light-shoulder',
    name: 'ShoulderLeftLight',
    armorType: ArmorType.Light,
  },
  ShoulderRightLight: {
    icon: 'icon-filter-light-shoulder',
    name: 'ShoulderRightLight',
    armorType: ArmorType.Light,
  },
  HandLeftLight: {
    icon: 'icon-filter-light-hand',
    name: 'HandLeftLight',
    armorType: ArmorType.Light,
  },
  HandRightLight: {
    icon: 'icon-filter-light-hand',
    name: 'HandRightLight',
    armorType: ArmorType.Light,
  },
  ShinsLight: {
    icon: 'icon-filter-light-shins',
    name: 'ShinsLight',
    armorType: ArmorType.Light,
  },
  ThighsLight: {
    icon: 'icon-filter-light-thighs',
    name: 'ThighsLight',
    armorType: ArmorType.Light,
  },
  FeetLight: {
    icon: 'icon-filter-light-feet',
    name: 'FeetLight',
    armorType: ArmorType.Light,
  },

  // Medium armor
  SkullMedium: {
    icon: 'icon-filter-medium-skull',
    name: 'SkullMedium',
    armorType: ArmorType.Medium,
  },
  FaceMedium: {
    icon: 'icon-filter-medium-face',
    name: 'FaceMedium',
    armorType: ArmorType.Medium,
  },
  NeckMedium: {
    icon: 'icon-filter-medium-neck',
    name: 'NeckMedium',
    armorType: ArmorType.Medium,
  },
  ChestMedium: {
    icon: 'icon-filter-medium-chest',
    name: 'ChestMedium',
    armorType: ArmorType.Medium,
  },
  CloakMedium: {
    icon: 'icon-filter-medium-cloak',
    name: 'CloakMedium',
    armorType: ArmorType.Medium,
  },
  BackMedium: {
    icon: 'icon-filter-medium-back',
    name: 'BackMedium',
    armorType: ArmorType.Medium,
  },
  WaistMedium: {
    icon: 'icon-filter-medium-waist',
    name: 'WaistMedium',
    armorType: ArmorType.Medium,
  },
  ForearmLeftMedium: {
    icon: 'icon-filter-medium-forearm',
    name: 'ForearmLeftMedium',
    armorType: ArmorType.Medium,
  },
  ForearmRightMedium: {
    icon: 'icon-filter-medium-forearm',
    name: 'ForearmRightMedium',
    armorType: ArmorType.Medium,
  },
  ShoulderLeftMedium: {
    icon: 'icon-filter-medium-shoulder',
    name: 'ShoulderLeftMedium',
    armorType: ArmorType.Medium,
  },
  ShoulderRightMedium: {
    icon: 'icon-filter-medium-shoulder',
    name: 'ShoulderRightMedium',
    armorType: ArmorType.Medium,
  },
  HandLeftMedium: {
    icon: 'icon-filter-medium-hand',
    name: 'HandLeftMedium',
    armorType: ArmorType.Medium,
  },
  HandRightMedium: {
    icon: 'icon-filter-medium-hand',
    name: 'HandRightMedium',
    armorType: ArmorType.Medium,
  },
  ShinsMedium: {
    icon: 'icon-filter-medium-shins',
    name: 'ShinsMedium',
    armorType: ArmorType.Medium,
  },
  ThighsMedium: {
    icon: 'icon-filter-medium-thighs',
    name: 'ThighsMedium',
    armorType: ArmorType.Medium,
  },
  FeetMedium: {
    icon: 'icon-filter-medium-feet',
    name: 'FeetMedium',
    armorType: ArmorType.Medium,
  },

  // Heavy armor
  SkullHeavy: {
    icon: 'icon-filter-heavy-skull',
    name: 'SkullHeavy',
    armorType: ArmorType.Heavy,
  },
  FaceHeavy: {
    icon: 'icon-filter-heavy-face',
    name: 'FaceHeavy',
    armorType: ArmorType.Heavy,
  },
  NeckHeavy: {
    icon: 'icon-filter-heavy-neck',
    name: 'NeckHeavy',
    armorType: ArmorType.Heavy,
  },
  ChestHeavy: {
    icon: 'icon-filter-heavy-chest',
    name: 'ChestHeavy',
    armorType: ArmorType.Heavy,
  },
  CloakHeavy: {
    icon: 'icon-filter-heavy-cloak',
    name: 'CloakHeavy',
    armorType: ArmorType.Heavy,
  },
  BackHeavy: {
    icon: 'icon-filter-heavy-back',
    name: 'BackHeavy',
    armorType: ArmorType.Heavy,
  },
  WaistHeavy: {
    icon: 'icon-filter-heavy-waist',
    name: 'WaistHeavy',
    armorType: ArmorType.Heavy,
  },
  ForearmLeftHeavy: {
    icon: 'icon-filter-heavy-forearm',
    name: 'ForearmLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  ForearmRightHeavy: {
    icon: 'icon-filter-heavy-forearm',
    name: 'ForearmRightHeavy',
    armorType: ArmorType.Heavy,
  },
  ShoulderLeftHeavy: {
    icon: 'icon-filter-heavy-shoulder',
    name: 'ShoulderLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  ShoulderRightHeavy: {
    icon: 'icon-filter-heavy-shoulder',
    name: 'ShoulderRightHeavy',
    armorType: ArmorType.Heavy,
  },
  HandLeftHeavy: {
    icon: 'icon-filter-heavy-hand',
    name: 'HandLeftHeavy',
    armorType: ArmorType.Heavy,
  },
  HandRightHeavy: {
    icon: 'icon-filter-heavy-hand',
    name: 'HandRightHeavy',
    armorType: ArmorType.Heavy,
  },
  ShinsHeavy: {
    icon: 'icon-filter-heavy-shins',
    name: 'ShinsHeavy',
    armorType: ArmorType.Heavy,
  },
  ThighsHeavy: {
    icon: 'icon-filter-heavy-thighs',
    name: 'ThighsHeavy',
    armorType: ArmorType.Heavy,
  },
  FeetHeavy: {
    icon: 'icon-filter-heavy-feet',
    name: 'FeetHeavy',
    armorType: ArmorType.Heavy,
  },

  // Weapons
  Weapons: {
    icon: 'icon-filter-weapons',
    name: 'Weapons',
  },
  Axe: {
    icon: 'icon-filter-axe',
    name: 'Axe',
  },
  Bow: {
    icon: 'icon-filter-bow',
    name: 'Bow',
  },
  Dagger: {
    icon: 'icon-filter-dagger',
    name: 'Dagger',
  },
  GreatAxe: {
    icon: 'icon-filter-great-axe',
    name: 'GreatAxe',
  },
  GreatHammer: {
    icon: 'icon-filter-great-hammer',
    name: 'GreatHammer',
  },
  GreatMace: {
    icon: 'icon-filter-great-mace',
    name: 'GreatMace',
  },
  GreatSword: {
    icon: 'icon-filter-great-sword',
    name: 'GreatSword',
  },
  Hammer: {
    icon: 'icon-filter-hammer',
    name: 'Hammer',
  },
  LongSword: {
    icon: 'icon-filter-long-sword',
    name: 'LongSword',
  },
  Mace: {
    icon: 'icon-filter-mace',
    name: 'Mace',
  },
  Polearm: {
    icon: 'icon-filter-polearm',
    name: 'Polearm',
  },
  Shield: {
    icon: 'icon-filter-shield',
    name: 'Shield',
  },
  Spear: {
    icon: 'icon-filter-spear',
    name: 'Spear',
  },
  Staff: {
    icon: 'icon-filter-staff',
    name: 'Staff',
  },
  Sword: {
    icon: 'icon-filter-sword',
    name: 'Sword',
  },
  Torch: {
    icon: 'icon-filter-torch',
    name: 'Torch',
  },
};

export const inventoryFilterButtons: {
  [key: string]: InventoryFilterButton,
  } = {
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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
      webkitTransform: 'scaleX(-1)',
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

  Weapons: {
    icon: 'icon-filter-weapons',
    name: 'Weapons',
    filter: (item: InventoryItemFragment) => filterForGearSlot(item, inventoryFilterButtonInfo.PrimaryHandWeapon) ||
      filterForGearSlot(item, inventoryFilterButtonInfo.SecondaryHandWeapon),
  },
};

export const defaultFilterButtonIcons = [
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
  inventoryFilterButtons.Weapons,
];

export const inventoryEditFilterButtons: InventoryFilterButton[] = [
  inventoryFilterButtons.Weapons,

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
];
