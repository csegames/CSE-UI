/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as definitions from './definitions';

export function accessLevelString(access: definitions.AccessType) {
  switch (access) {
    case definitions.AccessType.INVALID: return 'None';
    case definitions.AccessType.PUBLIC: return 'Everyone';
    case definitions.AccessType.BETA3: return 'All Backers';
    case definitions.AccessType.BETA2: return 'Beta 1-2, Alpha, IT';
    case definitions.AccessType.BETA1: return 'Beta 1, Alpha, IT';
    case definitions.AccessType.ALPHA: return 'Alpha, IT';
    case definitions.AccessType.INTERNALTEST: return 'IT';
    case definitions.AccessType.EMPLOYEES: return 'CSE';
  }
}

export function raceString(race: definitions.Race) {
  switch (race) {
  case definitions.Race.TUATHA: return 'Tuatha';
  case definitions.Race.HAMADRYAD: return 'Hamadryad';
  case definitions.Race.LUCHORPAN: return 'Luchorpán';
  case definitions.Race.FIRBOG: return 'Fir Bog';
  case definitions.Race.VALKYRIE: return 'Valkyrie';
  case definitions.Race.HELBOUND: return 'Helbound';
  case definitions.Race.FROSTGIANT: return 'Jötnar';
  case definitions.Race.DVERGR: return 'Dvergar';
  case definitions.Race.STRM: return 'St`rm';
  case definitions.Race.CAITSITH: return 'Cait Sith';
  case definitions.Race.GOLEM: return '';
  case definitions.Race.GARGOYLE: return 'Gargoyle';
  case definitions.Race.STORMRIDER: return 'Stormrider';
  case definitions.Race.STORMRIDERT: return 'Stormrider';
  case definitions.Race.STORMRIDERV: return 'Stormrider';
  case definitions.Race.HUMANMALEV: return 'Human';
  case definitions.Race.HUMANMALEA: return 'Human';
  case definitions.Race.HUMANMALET: return 'Human';
  case definitions.Race.PICT: return 'Pict';
  case definitions.Race.ANY: return 'ERROR';
  }
}

export function archetypeString(archetype: definitions.Archetype) {
  switch (archetype) {
  case definitions.Archetype.FIREMAGE: return 'Fire Mage';
  case definitions.Archetype.EARTHMAGE: return 'Earth Mage';
  case definitions.Archetype.WATERMAGE: return 'Water Mage';
  case definitions.Archetype.FIGHTER: return 'Fighter';
  case definitions.Archetype.HEALER: return 'Healer';
  case definitions.Archetype.MELEECOMBATTEST: return 'Melee Test';
  case definitions.Archetype.ARCHERTEST: return 'Archer Test';
  case definitions.Archetype.BLACKKNIGHT: return 'Black Knight';
  case definitions.Archetype.FIANNA: return 'Fianna';
  case definitions.Archetype.MJOLNIR: return 'Mjölnir';
  case definitions.Archetype.PHYSICIAN: return 'Physician';
  case definitions.Archetype.EMPATH: return 'Empath';
  case definitions.Archetype.STONEHEALER: return 'Stonehealer';
  case definitions.Archetype.BLACKGUARD: return 'Black Guard';
  case definitions.Archetype.FORESTSTALKER: return 'Forest Stalker';
  case definitions.Archetype.WINTERSSHADOW: return 'Winter\'s Shadow';
  case definitions.Archetype.ANY: return 'ERROR';
  }
}
