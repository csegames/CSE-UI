/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';

  

export function setVoxJob(shardID: number, characterID: string, job: string) {
  return create(createOptions()).call('v1/crafting/setvoxjob', { 
    shardID: shardID, 
    characterID: characterID, 
    job: job
  });
}

export function clearVoxJob(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/crafting/clearvoxjob', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function setRecipeID(shardID: number, characterID: string, recipeID: string) {
  return create(createOptions()).call('v1/crafting/setvoxrecipeid', { 
    shardID: shardID, 
    characterID: characterID, 
    recipeID: recipeID
  });
}

export function setQuality(shardID: number, characterID: string, quality: number) {
  return create(createOptions()).call('v1/crafting/setvoxquality', { 
    shardID: shardID, 
    characterID: characterID, 
    quality: quality
  });
}

export function setCustomItemName(shardID: number, characterID: string, itemName: string) {
  return create(createOptions()).call('v1/crafting/setvoxcustomitemname', { 
    shardID: shardID, 
    characterID: characterID, 
    itemName: itemName
  });
}

export function setTemplate(shardID: number, characterID: string, templateID: string) {
  return create(createOptions()).call('v1/crafting/setvoxtemplate', { 
    shardID: shardID, 
    characterID: characterID, 
    templateID: templateID
  });
}

export function addIngredient(shardID: number, characterID: string, itemInstanceID: string, unitCount: number) {
  return create(createOptions()).call('v1/crafting/addvoxingredient', { 
    shardID: shardID, 
    characterID: characterID, 
    itemInstanceID: itemInstanceID, 
    unitCount: unitCount
  });
}

export function removeVoxIngredient(shardID: number, characterID: string, itemInstanceID: string, unitCount: number) {
  return create(createOptions()).call('v1/crafting/removevoxingredient', { 
    shardID: shardID, 
    characterID: characterID, 
    itemInstanceID: itemInstanceID, 
    unitCount: unitCount
  });
}

export function startVoxJob(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/crafting/startvoxjob', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function collectFinishedVoxJob(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/crafting/collectfinishedvoxjob', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function cancelVoxJob(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/crafting/cancelvoxjob', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function setVoxItemCount(shardID: number, characterID: string, count: number) {
  return create(createOptions()).call('v1/crafting/setvoxitemcount', { 
    shardID: shardID, 
    characterID: characterID, 
    count: count
  });
}

