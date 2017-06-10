/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 17:48:41
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-04 22:57:04
 */


export interface Item {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface InventoryItem extends Item {
  stats: {
    quality: number;
    unitCount: number;
    weight: number;
  };
}

export interface Ingredient extends InventoryItem {
  qty: number;
  removeId: string;       // Original Item ID from ingredient list, used when removing
}

export interface Recipe extends Item {}
export interface Template extends Item {}

export interface Message {
  type: string;
  message: string;
}

export interface SlashVoxStatus {
  type: string;
  status: string;
  ready: boolean;
  recipe: Recipe;
  name: string;
  started: string;
  endin: string;
  template: Template;
  ingredients: Ingredient[];
}
