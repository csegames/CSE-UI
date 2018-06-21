/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { webAPI, Race, Gender } from '@csegames/camelot-unchained';

export function shouldFlipCharImage(character: webAPI.SimpleCharacter) {
  return (character.race === Race.HumanMaleA && character.gender === Gender.Female) ||
  (character.race === Race.Valkyrie && character.gender === Gender.Male) ||
  (character.race === Race.HumanMaleV && character.gender === Gender.Female);
}

const characterImages = {
  LuchorpanMale: 'images/races/standing/luchorpan-m.png',
  LuchorpanFemale: 'images/races/standing/luchorpan-f.png',
  ValkyrieMale: 'images/races/standing/valkyrie-m.png',
  ValkyrieFemale: 'images/races/standing/valkyrie-f.png',
  PictMale: 'images/races/standing/pict-m.png',
  PictFemale: 'images/races/standing/pict-f.png',
  HumanMaleVMale: 'images/races/standing/humans-m-vik.png',
  HumanMaleAMale: 'images/races/standing/humans-m-art.png',
  HumanMaleTMale: 'images/races/standing/humans-m-tdd.png',
  HumanMaleVFemale: 'images/races/standing/humans-f-vik.png',
  HumanMaleAFemale: 'images/races/standing/humans-f-art.png',
  HumanMaleTFemale: 'images/races/standing/humans-f-tdd.png',
};

export default characterImages;
