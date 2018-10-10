/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { webAPI } from '@csegames/camelot-unchained';


export interface VoxResponse {
  Result: number;
  IsSuccess: boolean;
  Details: string;
  MovedItemID: string;
  DiscoveredRecipeIDs: string[];
}

// generic method to handle the promise, and deal with the reponse
function run(startRequest: () => any) {
  return new Promise((resolve, reject) => {
    startRequest()
      .then((response: any) => {
        try {
          const data = response.json();
          if (response.ok) {
            resolve(data);
          } else {
            reject(data);
          }
        } catch (e) {
          reject({ Code: e.number, Message: e.message });
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function setVoxJob(type: any) {
  return run(() => webAPI.CraftingAPI.SetVoxJob(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    type,
  ));
}

export function startVoxJob() {
  return run(() => webAPI.CraftingAPI.StartVoxJob(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
  ));
}

export function collectVoxJob() {
  return run(() => webAPI.CraftingAPI.CollectFinishedVoxJob(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
  ));
}

export function clearVoxJob() {
  return run(() => webAPI.CraftingAPI.ClearVoxJob(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
  ));
}

export function cancelVoxJob() {
  return run(() => webAPI.CraftingAPI.CancelVoxJob(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
  ));
}

export function setVoxQuality(quality: number) {
  return run(() => webAPI.CraftingAPI.SetQuality(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    (quality / 100),
  ));
}

export function setVoxItemCount(count: number) {
  return run(() => webAPI.CraftingAPI.SetVoxItemCount(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    count,
  ));
}

export function setVoxName(name: string) {
  return run(() => webAPI.CraftingAPI.SetCustomItemName(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    name,
  ));
}

export function setVoxRecipe(id: string) {
  return run(() => webAPI.CraftingAPI.SetRecipeID(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    id,
  ));
}

export function addVoxIngredient(id: string, qty: number, slot: number = 0) {
  return run(() => webAPI.CraftingAPI.AddIngredient(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    id,
    qty,
    slot,
  ));
}

export function removeVoxIngredient(id: string, qty: number) {
  return run(() => webAPI.CraftingAPI.RemoveVoxIngredient(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    id,
    qty,
  ));
}
