/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { Promise } from 'es6-promise';
import { gql } from './gql';
import { QUERIES } from './queryText';
import { VoxIngredient, VoxStatus, VoxRecipe } from './queryTypes';

const ERRORS = {
  NotFound: 'No vox nearby',
  NotOwnedByPlayer: 'This vox is not owned by you',
  UnrecognisedResponse: 'Unexpected response from the api server',
  UnknownError: 'An unknown error occurred.  Check debug.log for details.',
  IsNull: (key: string) => 'API server returned null for ' + key,
  NotLoggedIn: 'Character not logged into game',
};

function runQuery(query: string, key: string, args: any = null) {
  return new Promise((resolve, reject) => {
    if (args) {
      let sargs = '(';
      for (const key in args) {
        sargs += key + ':' + args[key];
      }
      sargs += ')';
      query = query.replace(key, key + sargs);
    }
    gql({ query }).then((data: any) => {
      const info = data && data.crafting && data.crafting[key];
      if (info) {
        resolve(info);
      } else {
        if (data.crafting) {
          reject({ reason: ERRORS.NotLoggedIn, data });
        } else {
          // No crafting key, at least we expected that!
          reject({ reason: ERRORS.UnrecognisedResponse, data });
        }
      }
    })
    .catch((error: any) => {
      reject({ reason: error.message });
    });
  });
}

// Retrieves the status of a nearby vox for the current character.
export function voxGetStatus() {
  return new Promise((resolve, reject) => {
    runQuery(QUERIES.QUERY_VOX_STATUS, 'voxStatus')
      .then((voxStatus: VoxStatus) => {
        if (voxStatus.voxState === 'Found') {
          resolve(voxStatus);
        } else {
          reject(ERRORS[voxStatus.voxState] || voxStatus.voxState);
        }
      })
      .catch((error) => {
        reject(error.reason);
      });
  });
}

export function voxGetPossibleIngredientsForSlot(slot: string) {
  return new Promise((resolve, reject) => {
    runQuery(QUERIES.QUERY_POSSIBLE_INGREDIENTS, 'possibleIngredients', { slot: '"' + slot + '"' })
      .then((possibleIngredients: VoxIngredient[]) => {
        resolve(possibleIngredients);
      })
      .catch(() => {
        reject('Failed to load possible ingredients');
      });
  });
}

export function voxGetRecipesFor(type: string) {
  const uType = type.toUpperCase();
  const lType = type.toLowerCase();
  return new Promise((resolve, reject) => {
    runQuery(QUERIES[`QUERY_${uType}_RECIPES`], lType + 'Recipes')
      .then((recipes: VoxRecipe[]) => {
        console.log('GOT THE RECIPES');
        console.log(recipes);
        resolve(recipes);
      })
      .catch(() => {
        reject(`Could not get ${type} recipes`);
      });
  });
}

export function voxGetPossibleItemSlots() {
  return new Promise((resolve, reject) => {
    runQuery(QUERIES['QUERY_POSSIBLE_ITEMSLOTS'], 'possibleItemSlots')
      .then((stuff: any) => {
        resolve(stuff);
      })
      .catch(() => {
        reject('Could not get possible item slots');
      });
  });
}
