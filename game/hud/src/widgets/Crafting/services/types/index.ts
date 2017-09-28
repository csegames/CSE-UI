/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


export interface Item {
  id: string;
  name: string;
}

export interface InventoryItem extends Item {
  static: {
    id: string;       // Static Item ID from static definition
    icon?: string;
    description?: string;
  };
  stats: {
    quality: number;
    unitCount: number;
    weight: number;
    durability: {
      current: number;
      currentPoints: number;
    };
  };
}

export interface Ingredient extends InventoryItem {
  qty: number;
}

export interface Recipe extends Item {}

export interface Message {
  type: string;
  message: string;
}
