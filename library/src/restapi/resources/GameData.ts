/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Promise } from 'es6-promise';
import * as RestClient from './../RestClient';

// Faction Names
export function getFactionNames() {
  return RestClient.getJSON('/gamedata/factionnames');
}

// Archetypes
export function getArchetypes() {
  return RestClient.getJSON('/gamedata/archetypes');
}

// Attributes
export function getAttributes() {
  return RestClient.getJSON('/gamedata/attributes');
}
