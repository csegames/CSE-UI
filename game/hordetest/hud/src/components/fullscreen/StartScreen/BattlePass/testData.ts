/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Skin, StoreItemType, Rarity } from '../Store/testData';

export interface BattlePassDay {
  isUnlocked: boolean,
  dayNumber: number;
  freeRewards: Skin[];
  premiumRewards: Skin[];
}

export interface BattlePass {
  seasonNumber: number;
  seasonName: string;
  currentDay: number;
  days: BattlePassDay[];
}

const freeTestSkin1 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'freeTestSkin1' + Math.random(),
  name: 'Free Test Skin 1',
  rarity: Rarity.Common,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 300,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const freeTestSkin2 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'freeTestSkin2' + Math.random(),
  name: 'Free Test Skin 2',
  rarity: Rarity.Common,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 300,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const freeTestSkin3 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'freeTestSkin3' + Math.random(),
  name: 'Free Test Skin 3',
  rarity: Rarity.Rare,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 500,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const premiumTestSkin1 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'premTestSkin1' + Math.random(),
  name: 'Premium Test Skin 1',
  rarity: Rarity.Rare,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 300,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const premiumTestSkin2 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'premTestSkin2' + Math.random(),
  name: 'Premium Test Skin 2',
  rarity: Rarity.Epic,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 300,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const premiumTestSkin3 = (): Skin => ({
  type: StoreItemType.Skin,
  isUnlocked: false,
  id: 'premTestSkin3' + Math.random(),
  name: 'Premium Test Skin 3',
  rarity: Rarity.Legendary,
  image: 'images/fullscreen/startscreen/champion-profile/temp-axe.png',
  cost: 1000,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const getRandomNumber = () => {
  return Math.random() * 10;
}

const getBattlePassDay = (dayNumber: number, isUnlocked?: boolean): BattlePassDay => {
  const battlePassDay = {
    isUnlocked: isUnlocked ? true : false,
    dayNumber,
    freeRewards: [] as Skin[],
    premiumRewards: [] as Skin[],
  };

  if (getRandomNumber() < 5) {
    battlePassDay.freeRewards.push(freeTestSkin1());
  }

  if (getRandomNumber() < 5) {
    battlePassDay.freeRewards.push(freeTestSkin2());
  }

  if (getRandomNumber() < 5) {
    battlePassDay.freeRewards.push(freeTestSkin3());
  }

  if (getRandomNumber() < 2) {
    battlePassDay.premiumRewards.push(premiumTestSkin1());
  }

  if (getRandomNumber() < 2) {
    battlePassDay.premiumRewards.push(premiumTestSkin2());
  }

  if (getRandomNumber() < 1) {
    battlePassDay.premiumRewards.push(premiumTestSkin3());
  }

  if (battlePassDay.freeRewards.length === 0 && battlePassDay.premiumRewards.length === 0) {
    battlePassDay.freeRewards.push(freeTestSkin1());
  }

  return battlePassDay;
};

export const battlePassData: BattlePass = {
  seasonNumber: 1,
  seasonName: 'Launch Season',
  currentDay: 4,
  days: [
    getBattlePassDay(1, true),
    getBattlePassDay(2, true),
    getBattlePassDay(3, true),
    getBattlePassDay(4, true),
    getBattlePassDay(5),
    getBattlePassDay(6),
    getBattlePassDay(7),

    getBattlePassDay(8),
    getBattlePassDay(9),
    getBattlePassDay(10),
    getBattlePassDay(11),
    getBattlePassDay(12),
    getBattlePassDay(13),
    getBattlePassDay(14),

    getBattlePassDay(15),
    getBattlePassDay(16),
    getBattlePassDay(17),
    getBattlePassDay(18),
    getBattlePassDay(19),
    getBattlePassDay(20),
    getBattlePassDay(21),

    getBattlePassDay(22),
    getBattlePassDay(23),
    getBattlePassDay(24),
    getBattlePassDay(25),
    getBattlePassDay(26),
    getBattlePassDay(27),
    getBattlePassDay(28),

    getBattlePassDay(29),
    getBattlePassDay(30),
    getBattlePassDay(31),
    getBattlePassDay(32),
    getBattlePassDay(33),
    getBattlePassDay(34),
    getBattlePassDay(35),
  ],
}
