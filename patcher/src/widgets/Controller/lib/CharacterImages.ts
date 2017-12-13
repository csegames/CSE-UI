/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { webAPI, Race, Gender } from 'camelot-unchained';

export function shouldFlipCharImage(character: webAPI.SimpleCharacter) {
  return (character.race === Race.HumanMaleA && character.gender === Gender.Female) ||
  (character.race === Race.Valkyrie && character.gender === Gender.Male) ||
  (character.race === Race.HumanMaleV && character.gender === Gender.Female);
}