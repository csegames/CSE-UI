/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-02 18:21:30
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-18 12:51:14
 */

import 'isomorphic-fetch';
import { Promise } from 'es6-promise';
import { gql } from './gql';
import { QUERIES } from './queryText';
import { VoxPossibleIngredient, VoxTemplate, VoxStatus, VoxRecipe } from './queryTypes';

const ERRORS = {
  NotFound: 'No vox nearby',
  NotOwnedByPlayer: 'This vox is not owned by you',
  UnrecognisedResponse: 'Unexpected response from the api server',
  UnknownError: 'An unknown error occurred.  Check debug.log for details.',
  IsNull: (key: string) => 'API server returned null for ' + key,
  NotLoggedIn: 'Character not logged into game',
};

function runQuery(query: string, key: string) {
  return new Promise((resolve, reject) => {
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
      reject({ reason: error.reason });
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

export function voxGetPossibleIngredients() {
  return new Promise((resolve, reject) => {
    runQuery(QUERIES.QUERY_POSSIBLE_INGREDIENTS, 'possibleIngredients')
      .then((possibleIngredients: VoxPossibleIngredient[]) => {
        resolve(possibleIngredients);
      })
      .catch(() => {
        reject('No vox nearby');
      });
  });
}

export function voxGetTemplates() {
  return new Promise((resolve, reject) => {
    runQuery(QUERIES.QUERY_TEMPLATES, 'templates')
      .then((templates: VoxTemplate[]) => {
        resolve(templates);
      })
      .catch(() => {
        reject('Could not get templates');
      });
  });
}

export function voxGetRecipesFor(type: string) {
  const uType = type.toUpperCase();
  return new Promise((resolve, reject) => {
    runQuery(QUERIES[`QUERY_${uType}_RECIPES`], type + 'Recipes')
      .then((recipes: VoxRecipe[]) => {
        resolve(recipes);
      })
      .catch(() => {
        reject(`Could not get ${type} recipes`);
      });
  });
}
