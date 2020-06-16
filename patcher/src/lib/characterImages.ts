/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { includes } from 'lodash';
import { SimpleCharacter, Archetype, Race } from 'gql/interfaces';

export function shouldFlipCharImage(character: SimpleCharacter) {
  return (character.archetype === Archetype.WintersShadow);
}

export function isSpecialClass(a: Archetype) {
  // These are classes that had their images taken from the website.
  if (a === Archetype.Minstrel ||
      a === Archetype.FlameWarden ||
      a === Archetype.DarkFool ||
      a === Archetype.Druid ||
      a === Archetype.Skald ||
      a === Archetype.WaveWeaver ||
      a === Archetype.Abbot ||
      a === Archetype.Helbound ||
      a === Archetype.BlessedCrow) {
    return true;
  }

  return false;
}

export function getCharImage(character: SimpleCharacter) {
  if (!character || !character.race || !character.gender || !character.archetype) return '';

  let race = Race[character.race].toLowerCase();
  if (includes(race, 'human')) {
    race = 'human';
  }

  const archetype = Archetype[character.archetype].toLowerCase();
  if (isSpecialClass(character.archetype)) {
    return `/ui/images/classes/any-${archetype}.png`;
  }

  const gender = (character.gender as any) === 'Male' ? 'm' : 'f';

  return `/ui/images/character-select/${race}-${gender}-${archetype}-select.png`;
}
