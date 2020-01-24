/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum StoreItemType {
  Weapon,
  Skin,
  Accessory,
  Bundle,
}

export enum Rarity {
  Common,
  Rare,
  Epic,
  Legendary
}

export enum Champion {
  Amazon,
  Berserker,
  Celt,
  Knight,
}

export interface Skin {
  type: StoreItemType.Skin | StoreItemType.Weapon;
  isUnlocked: boolean;
  id: string;
  name: string;
  rarity: Rarity;
  champion?: Champion;
  image: string;
  cost: number;
  description: string;
  isFeatured?: boolean;
  isComingSoon?: boolean;
}

export interface Bundle {
  type: StoreItemType.Bundle;
  isUnlocked: boolean;
  id: string;
  name: string;
  image: string;
  cost: number;
  description: string;
  isFeatured?: boolean;
  isComingSoon?: boolean;
}

export type StoreItem = Skin | Bundle;

export const skins: StoreItem[] = [
  {
    type: StoreItemType.Bundle,
    isFeatured: true,
    isUnlocked: false,
    id: 'bundle1',
    name: 'Champion Skin Bundle',
    image: 'images/fullscreen/startscreen/store/bundle-champ.jpg',
    cost: 4000,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    // isFeatured: true,
    isComingSoon: true,
  },

  {
    type: StoreItemType.Bundle,
    isFeatured: true,
    isUnlocked: false,
    id: 'bundle2',
    name: 'Champion Weapon Skin Bundle',
    image: 'images/fullscreen/startscreen/store/bundle-weapon.jpg',
    cost: 9001,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin1',
    name: 'Aella Skin',
    image: 'images/fullscreen/startscreen/store/skins-amazon.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Amazon,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },


  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin2',
    name: 'Jalb Al-Sulh Skin',
    image: 'images/fullscreen/startscreen/store/skins-knight.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Knight,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin3',
    name: 'Bjorn-Snur Skin',
    image: 'images/fullscreen/startscreen/store/skins-berserker.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Berserker,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin4',
    name: 'Gwenllian Skin',
    image: 'images/fullscreen/startscreen/store/skins-celt.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Celt,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon1',
    name: 'Gwenllian Weapon',
    image: 'images/fullscreen/startscreen/store/weapons-spear.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Celt,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon2',
    name: 'Jalb Al-Sulh Weapon',
    image: 'images/fullscreen/startscreen/store/weapons-sword.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Knight,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon3',
    name: 'Bjorn-Snur Weapon',
    image: 'images/fullscreen/startscreen/store/weapons-axe.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Berserker,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon3',
    name: 'Aella Weapon',
    image: 'images/fullscreen/startscreen/store/weapons-bow.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Amazon,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon5',
    name: 'Gwenllian Weapon 2',
    image: 'images/fullscreen/startscreen/store/weapons-spear.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Celt,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon6',
    name: 'Jalb Al-Sulh Weapon 2',
    image: 'images/fullscreen/startscreen/store/weapons-sword.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Knight,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon7',
    name: 'Bjorn-Snur Weapon 2',
    image: 'images/fullscreen/startscreen/store/weapons-axe.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Berserker,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon8',
    name: 'Aella Weapon 2',
    image: 'images/fullscreen/startscreen/store/weapons-bow.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Amazon,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin5',
    name: 'Aella Skin 2',
    image: 'images/fullscreen/startscreen/store/skins-amazon.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Amazon,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin6',
    name: 'Jalb Al-Sulh Skin 2',
    image: 'images/fullscreen/startscreen/store/skins-knight.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Knight,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin7',
    name: 'Bjorn-Snur Skin 2',
    image: 'images/fullscreen/startscreen/store/skins-berserker.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Berserker,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin8',
    name: 'Gwenllian Skin',
    image: 'images/fullscreen/startscreen/store/skins-celt.png',
    cost: 500,
    rarity: Rarity.Common,
    champion: Champion.Celt,
    description: 'Lorem ipsum dolor sit amet',
    isComingSoon: true,
  },

];
