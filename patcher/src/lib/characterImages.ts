/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { webAPI, Archetype } from '@csegames/camelot-unchained';

export function shouldFlipCharImage(character: webAPI.SimpleCharacter) {
  return (character.archetype === Archetype.WintersShadow);
}

const characterImages = {
  // Human Male
  HumanMaleBlackKnight: 'images/character-select/human-m-blackknight-select.png',
  HumanMaleBlackguard: 'images/character-select/human-m-blackguard-select.png',
  HumanMalePhysician: 'images/character-select/human-m-physician-select.png',
  HumanMaleFianna: 'images/character-select/human-m-fianna-select.png',
  HumanMaleMjolnir: 'images/character-select/human-m-mjolnir-select.png',
  HumanMaleEmpath: 'images/character-select/human-m-mystic-select.png',
  HumanMaleStonehealer: 'images/character-select/human-m-stonehealer-select.png',
  HumanMaleForestStalker: 'images/character-select/human-m-foreststalker-select.png',
  HumanMaleWintersShadow: 'images/character-select/human-m-wintershadow-select.png',

  // Human Female
  HumanFemaleBlackKnight: 'images/character-select/human-f-blackknight-select.png',
  HumanFemaleBlackguard: 'images/character-select/human-f-blackguard-select.png',
  HumanFemalePhysician: 'images/character-select/human-f-physician-select.png',
  HumanFemaleFianna: 'images/character-select/human-f-fianna-select.png',
  HumanFemaleMjolnir: 'images/character-select/human-f-mjolnir-select.png',
  HumanFemaleEmpath: 'images/character-select/human-f-mystic-select.png',
  HumanFemaleStonehealer: 'images/character-select/human-f-stonehealer-select.png',
  HumanFemaleForestStalker: 'images/character-select/human-f-foreststalker-select.png',
  HumanFemaleWintersShadow: 'images/character-select/human-f-wintershadow-select.png',

  // Pict Male
  PictMaleBlackKnight: 'images/character-select/human-m-blackknight-select.png',
  PictMaleBlackguard: 'images/character-select/pict-m-blackguard-select.png',
  PictMalePhysician: 'images/character-select/pict-m-physician-select.png',

  // Pict Female
  PictFemaleBlackKnight: 'images/character-select/pict-f-blackknight-select.png',
  PictFemaleBlackguard: 'images/character-select/pict-f-blackguard-select.png',
  PictFemalePhysician: 'images/character-select/pict-f-physician-select.png',

  // Valkyrie Male
  ValkyrieMaleMjolnir: 'images/character-select/valk-m-mjolnir-select.png',
  ValkyrieMaleStonehealer: 'images/character-select/valk-m-stonehealer-select.png',
  ValkyrieMaleWintersShadow: 'images/character-select/valk-m-wintershadow-select.png',

  // Valkyrie Female
  ValkyrieFemaleMjolnir: 'images/character-select/valk-f-mjolnir-select.png',
  ValkyrieFemaleStonehealer: 'images/character-select/valk-f-stonehealer-select.png',
  ValkyrieFemaleWintersShadow: 'images/character-select/valk-f-wintershadow-select.png',

  // Luchorpan Male
  LuchorpanMaleFianna: 'images/character-select/luchorpan-m-fianna-select.png',
  LuchorpanMaleEmpath: 'images/character-select/luchorpan-m-mystic-select.png',
  LuchorpanMaleForestStalker: 'images/character-select/luchorpan-m-foreststalker-select.png',

  // Luchorpan Female
  LuchorpanFemaleFianna: 'images/character-select/luchorpan-f-fianna-select.png',
  LuchorpanFemaleEmpath: 'images/character-select/luchorpan-f-mystic-select.png',
  LuchorpanFemaleForestStalker: 'images/character-select/luchorpan-f-foreststalker-select.png',
};

export default characterImages;
