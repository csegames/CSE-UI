/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum archetype {
  NONE = -1,
  FIREMAGE = 0,
  EARTHMAGE,
  WATERMAGE,
  FIGHTER,
  HEALER,
  MELEECOMBATTEST,
  ARCHERTEST,
  BLACKKNIGHT,
  FIANNA,
  MJOLNIR,
  PHYSICIAN,
  EMPATH,
  STONEHEALER,
  BLACKGUARD,
  FORESTSTALKER,
  WINTERSSHADOW
};

export function archetypeToString(a: archetype): string {
  switch (a) {
    case archetype.FIREMAGE: return 'Fire Mage';
    case archetype.EARTHMAGE: return 'Earth Mage';
    case archetype.WATERMAGE: return 'Water Mage';
    case archetype.FIGHTER: return 'Fighter';
    case archetype.HEALER: return 'Healer';
    case archetype.MELEECOMBATTEST: return 'Melee Test';
    case archetype.ARCHERTEST: return 'Archer Test';
    case archetype.BLACKKNIGHT: return 'Black Knight';
    case archetype.FIANNA: return 'Fianna';
    case archetype.MJOLNIR: return 'Mjölnir';
    case archetype.PHYSICIAN: return 'Physician';
    case archetype.EMPATH: return 'Empath';
    case archetype.STONEHEALER: return 'Stonehealer';
    case archetype.BLACKGUARD: return 'Blackguard';
    case archetype.FORESTSTALKER: return 'Forest Stalker';
    case archetype.WINTERSSHADOW: return 'Winter\'s Shadow';
  }
}

export default archetype;
