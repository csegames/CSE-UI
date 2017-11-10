/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Promise } from 'es6-promise';
import * as RestClient from './../RestClient';
import * as RestUtil from './../RestUtil';
import channelId from '../../core/constants/channelId';
import { Race, Faction, Gender, Archetype } from '../..';

// Get Characters
export function getCharacters(): Promise<SimpleCharacter[]> {
  return RestClient.getJSON('/characters', true);
}

// Get Characters On Shard
export function getCharactersOnShard(shardID: number = 1): Promise<SimpleCharacter[]> {
  return RestClient.getJSON(`/characters/${shardID}`, true);
}

// Get Character On Shard
export function getCharacterOnShard(shardID: number, characterID: string): Promise<Character> {
  return RestClient.getJSON(`/characters/${shardID}/${characterID}`, true);
}

// Delete Character On Shard
export function deleteCharacterOnShard(shardID: number, characterID: string) {
  return RestClient.deleteJSON(`/characters/${shardID}/${characterID}`, true);
}

// Create a Character
export function createCharacter(shardID: number, channelId: channelId, data: CharacterCreateRequest) {
  return RestClient.postJSON(`/characters/${shardID}/${channelId}`, true, data)
  // API is returing the full URL get getCharacterOnShard with the ID, we will strip out the ID and return it
    .then((path) => {
      return path.split('/').pop();
    });
}

// Response when calling getCharacters or getCharactersOnShard
export interface SimpleCharacter {
  archetype: Archetype;
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: string;
  name: string;
  race: Race;
  shardID: number;
}

// Response when calling getCharacterOnShard
export interface Character {
  archetype: Archetype;
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: string;
  name: string;
  race: Race;
  shardID: any;

  attributes: any;
  banes: any;
  boons: any;
}

// Request Model when calling createCharacter
export interface CharacterCreateRequest {
  name: string;
  faction: Faction;
  race: Race;
  gender: Gender;
  attributes: {
    strength: number;
    dexterity: number;
    agility: number;
    vitality: number;
    endurance: number;
    attunement: number;
    will: number;
    faith: number;
    resonance: number;
    eyesight: number;
  };
  boons: {
    [index: string]: number;
  };
  banes: {
    [index: string]: number;
  };
}
