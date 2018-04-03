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

const characterImages = {
  LuchorpanMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/luchorpan-m.png',
  LuchorpanFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/luchorpan-f.png',
  ValkyrieMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/valkyrie-m.png',
  ValkyrieFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/valkyrie-f.png',
  PictMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/pict-m.png',
  PictFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/pict-f.png',
  HumanMaleVMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-m-vik.png',
  HumanMaleAMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-m-art.png',
  HumanMaleTMale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-m-tdd.png',
  HumanMaleVFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-f-vik.png',
  HumanMaleAFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-f-art.png',
  HumanMaleTFemale: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/humans-f-tdd.png',
};

export default characterImages;
