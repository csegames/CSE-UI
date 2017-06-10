/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-05 20:16:52
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-09 21:38:33
 */

import {client, webAPI} from 'camelot-unchained';
import { Promise } from 'es6-promise';

export interface VoxResponse {
  Result: number;
  IsSuccess: boolean;
  Details: string;
  MovedItemID: string;
  DiscoveredRecipeIDs: string[];
}

// generic method to handle the promise, and deal with the reponse
function run(startRequest: () => Promise<any>) {
  return new Promise((resolve, reject) => {
    startRequest()
      .then((response: any) => {
        if (response.ok) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function setVoxJob(type: string) {
  return run(() => webAPI.CraftingAPI.setVoxJob(client.shardID, client.characterID, type));
}

export function startVoxJob() {
  return run(() => webAPI.CraftingAPI.startVoxJob(client.shardID, client.characterID));
}

export function collectVoxJob() {
  return run(() => webAPI.CraftingAPI.collectFinishedVoxJob(client.shardID, client.characterID));
}

export function clearVoxJob() {
  return run(() => webAPI.CraftingAPI.clearVoxJob(client.shardID, client.characterID));
}

export function cancelVoxJob() {
  return run(() => webAPI.CraftingAPI.cancelVoxJob(client.shardID, client.characterID));
}

export function setVoxQuality(quality: number) {
  return run(() => webAPI.CraftingAPI.setQuality(client.shardID, client.characterID, quality));
}

export function setVoxItemCount(count: number) {
  return run(() => webAPI.CraftingAPI.setVoxItemCount(client.shardID, client.characterID, count));
}

export function setVoxName(name: string) {
  return run(() => webAPI.CraftingAPI.setCustomItemName(client.shardID, client.characterID, name));
}

export function setVoxRecipe(id: string) {
  return run(() => webAPI.CraftingAPI.setRecipeID(client.shardID, client.characterID, id));
}

export function setVoxTemplate(id: string) {
  return run(() => webAPI.CraftingAPI.setTemplate(client.shardID, client.characterID, id));
}

export function addVoxIngredient(id: string, qty: number) {
  return run(() => webAPI.CraftingAPI.addIngredient(client.shardID, client.characterID, id, qty));
}

export function removeVoxIngredient(id: string, qty: number) {
  return run(() => webAPI.CraftingAPI.removeVoxIngredient(client.shardID, client.characterID, id, qty));
}
