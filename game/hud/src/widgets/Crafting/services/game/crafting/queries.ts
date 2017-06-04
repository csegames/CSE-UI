/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-02 18:21:30
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-04 22:42:03
 */

import 'isomorphic-fetch';
import { Promise } from 'es6-promise';
import { client } from 'camelot-unchained';
import { isClient } from '../slash';
import { gql } from './gql';
import * as SampleData from './querySampleData';
import { QUERIES } from './queryText';
import { VoxIngredient, VoxPossibleIngredient, VoxTemplate, VoxStatus, VoxRecipe } from './queryTypes';

const makeCraftingQuery = (name: string) => `query ${name} { crafting { ${QUERIES[name]} } }`;

function runQuery(query: string, key: string) {
  return new Promise((resolve, reject) => {
    gql({ query: makeCraftingQuery(query) }).then((data: any) => {
      const info = data && data.crafting && data.crafting[key];
      if (info) {
        resolve(info);
      } else {
        reject();
      }
    });
  });
}

// Retrieves the status of a nearby vox for the current character.
export function voxGetStatus() {
  return new Promise((resolve, reject) => {
    if (!isClient()) {
      resolve(SampleData.VoxStatus);
      return;
    }
    runQuery('QUERY_VOX_STATUS', 'voxStatus')
      .then((voxStatus: VoxStatus) => {
        resolve(voxStatus);
      })
      .catch(() => {
        reject('No vox nearby');
      });
  });
}

export function voxGetPossibleIngredients() {
  return new Promise((resolve, reject) => {
    if (!isClient()) {
      resolve(SampleData.PossibleIngredients);
      return;
    }
    runQuery('QUERY_POSSIBLE_INGREDIENTS', 'possibleIngredients')
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
    if (!isClient()) {
      resolve(SampleData.Templates);
      return;
    }
    runQuery('QUERY_TEMPLATES', 'templates')
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
    if (!isClient()) {
      resolve(SampleData.RefineRecipes);
      return;
    }
    runQuery(`QUERY_${uType}_RECIPES`, type + 'Recipes')
      .then((recipes: VoxRecipe[]) => {
        resolve(recipes);
      })
      .catch(() => {
        reject(`Could not get ${type} recipes`);
      });
  });
}
