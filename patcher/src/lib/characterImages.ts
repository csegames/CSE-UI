/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { includes } from 'lodash';
import { webAPI, Archetype, Race } from '@csegames/camelot-unchained';

export function shouldFlipCharImage(character: webAPI.SimpleCharacter) {
  return (character.archetype === Archetype.WintersShadow);
}

export function getCharImage(character: webAPI.SimpleCharacter) {
  if (!character || !character.race || !character.gender || !character.archetype) return '';

  let race = Race[character.race].toLowerCase();
  if (includes(race, 'human')) {
    race = 'human';
  }

  const gender = (character.gender as any) === 'Male' ? 'm' : 'f';
  const archetype = Archetype[character.archetype].toLowerCase();

  return `images/character-select/${race}-${gender}-${archetype}-select.png`;
}
