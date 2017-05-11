/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 17:48:41
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-07 23:08:03
 */


export interface Item {
  id: string;
  name: string;
}

export interface InventoryItem extends Item {
  itemType: string;
}

export interface Ingredient extends InventoryItem {
  qty: number;
}

export interface Recipe extends Item {}
export interface Template extends Item {}
