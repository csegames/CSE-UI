/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Promise } from 'es6-promise';
import * as RestClientLegacy from './RestClientLegacy';
import * as RestClient from './RestClient';

export function getMessageOfTheDay() {
  return RestClient.getJSON('messageoftheday');
}

// TODO update this to use new Rest Client
export function getCraftedAbilities(accessToken: string, characterID: string) {
  return RestClientLegacy.getJSON('craftedabilities', true, {
    Authorization: accessToken,
    characterID,
  });
}

// TODO update this to use new Rest Client
export function getControlGame(includeControlPoints: boolean = false) {
  return RestClientLegacy.getJSON('game/controlgame', false, { includeControlPoints });
}

// TODO update this to use new Rest Client
export function getAllPlayers() {
  return RestClientLegacy.getJSON('game/players');
}

// TODO update this to use new Rest Client
export function postPlotPermissions(query: Object) {
  return RestClientLegacy.postJSON('plot/modifypermissions', true, false, query);
}

// Control Game
export * from './resources/ControlGame';

// TODO update this to use new Rest Client
export function postReleasePlot(query: Object) {
  return RestClientLegacy.postJSON('plot/releaseplot', true, false, query);
}

export function postRemoveQueuedBlueprint(query: Object) {
  return RestClientLegacy.postJSON('plot/removequeuedblueprint', true, false, query);
}

export function postReorderBuildQueue(query: Object) {
  return RestClientLegacy.postJSON('plot/reorderqueue', true, false, query);
}

export function postGetQueueStatus(query: Object) {
  return RestClientLegacy.postJSON('plot/getqueuestatus', true, false, query);
}

// Blueprints
export * from './resources/Blueprints';

// Game Data
export * from './resources/GameData';

// Servers
export * from './resources/Servers';

// Characters
export * from './resources/Characters';
