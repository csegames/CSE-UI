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

export interface Skin {
  type: StoreItemType.Skin | StoreItemType.Weapon;
  isUnlocked: boolean;
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  cost: number;
  description: string;
  isFeatured?: boolean;
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
}

export type StoreItem = Skin | Bundle;

export const skins: StoreItem[] = [
  {
    type: StoreItemType.Bundle,
    isFeatured: true,
    isUnlocked: false,
    id: 'bundle1',
    name: 'Champion Bundle: Quick Details',
    image: 'images/fullscreen/startscreen/store/bundle-champ.jpg',
    cost: 4000,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    // isFeatured: true,
  },

  {
    type: StoreItemType.Bundle,
    isFeatured: true,
    isUnlocked: false,
    id: 'bundle2',
    name: 'Champion Bundle: Awesome Bundle',
    image: 'images/fullscreen/startscreen/store/bundle-weapon.jpg',
    cost: 5000,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },

  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin1',
    name: 'Amazon Skin',
    image: 'images/fullscreen/startscreen/store/skins-amazon.png',
    cost: 500,
    rarity: Rarity.Legendary,
    description: 'Lorem ipsum dolor sit amet',
  },


  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin2',
    name: 'Knight Skin',
    image: 'images/fullscreen/startscreen/store/skins-knight.png',
    cost: 500,
    rarity: Rarity.Epic,
    description: 'Lorem ipsum dolor sit amet',
  },

  // !!!! WEAPON !!!!
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon1',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 3000,
    rarity: Rarity.Legendary,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon2',
    name: 'Axe of Awesome',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 1500,
    rarity: Rarity.Epic,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon3',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 3000,
    rarity: Rarity.Legendary,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon4',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Common,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: false,
    isUnlocked: false,
    id: 'weapon5',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Rare,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon6',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Rare,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: false,
    isUnlocked: false,
    id: 'weapon7',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Common,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon8',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Common,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon9',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Common,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Weapon,
    isFeatured: true,
    isUnlocked: false,
    id: 'weapon10',
    name: 'Plain Axe',
    image: 'images/fullscreen/startscreen/store/temp-axe.png',
    cost: 200,
    rarity: Rarity.Common,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },

  // !!!! SKIN !!!!
  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin1',
    name: 'Nice Skin',
    image: 'images/fullscreen/startscreen/champion-profile/temp-helmet.png',
    cost: 899,
    rarity: Rarity.Rare,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin2',
    name: 'Nice Skin',
    image: 'images/fullscreen/startscreen/champion-profile/temp-helmet.png',
    cost: 899,
    rarity: Rarity.Rare,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin3',
    name: 'Ultra Nice Skin',
    image: 'images/fullscreen/startscreen/champion-profile/temp-helmet.png',
    cost: 899,
    rarity: Rarity.Legendary,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    type: StoreItemType.Skin,
    isFeatured: true,
    isUnlocked: false,
    id: 'skin3',
    name: 'Great Skin',
    image: 'images/fullscreen/startscreen/champion-profile/temp-helmet.png',
    cost: 899,
    rarity: Rarity.Epic,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];
