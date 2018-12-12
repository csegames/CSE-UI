/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux';

import racesReducer from './races';
const races = racesReducer;

import playerClassesReducer from './playerClasses';
const playerClasses = playerClassesReducer;

import factionsReducer from './factions';
const factions = factionsReducer;

import gendersReducer from './genders';
const gender = gendersReducer;

import characterReducer from './character';
const character = characterReducer;

import banesAndBoonsReducer from './banesAndBoons';
const banesAndBoons = banesAndBoonsReducer;

export default combineReducers({
  races,
  playerClasses,
  factions,
  gender,
  character,
  banesAndBoons,
});
