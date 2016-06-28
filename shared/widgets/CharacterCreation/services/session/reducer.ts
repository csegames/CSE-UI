/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import racesReducer from './races';
let races = racesReducer;

import playerClassesReducer from './playerClasses';
let playerClasses = playerClassesReducer;

import factionsReducer from './factions';
let factions = factionsReducer;

import attributesReducer from './attributes';
let attributes = attributesReducer;

import attributeOffsetsReducer from './attributeOffsets';
let attributeOffsets = attributeOffsetsReducer;

import gendersReducer from './genders';
let gender = gendersReducer;

import characterReducer from './character';
let character = characterReducer;

export default combineReducers({
  races,
  playerClasses,
  factions,
  attributes,
  gender,
  attributeOffsets,
  character,
});
