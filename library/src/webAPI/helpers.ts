/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as def from './definitions';

export function accessLevelString(access: def.AccessType) {
  switch (access) {
    case def.AccessType.Invalid: return 'None';
    case def.AccessType.Public: return 'Everyone';
    case def.AccessType.Beta3: return 'All Backers';
    case def.AccessType.Beta2: return 'Beta 1-2, Alpha, IT';
    case def.AccessType.Beta1: return 'Beta 1, Alpha, IT';
    case def.AccessType.Alpha: return 'Alpha, IT';
    case def.AccessType.InternalTest: return 'IT';
    case def.AccessType.Employees: return 'CSE';
  }
}

export function raceString(race: def.Race) {
  switch (race) {
  case def.Race.Tuatha: return 'Tuatha';
  case def.Race.Hamadryad: return 'Hamadryad';
  case def.Race.Luchorpan: return 'Luchorpán';
  case def.Race.Firbog: return 'Fir Bog';
  case def.Race.Valkyrie: return 'Valkyrie';
  case def.Race.Helbound: return 'Helbound';
  case def.Race.FrostGiant: return 'Jötnar';
  case def.Race.Dvergr: return 'Dvergar';
  case def.Race.Strm: return 'St`rm';
  case def.Race.CaitSith: return 'Cait Sith';
  case def.Race.Golem: return '';
  case def.Race.Gargoyle: return 'Gargoyle';
  case def.Race.StormRider: return 'Stormrider';
  case def.Race.StormRiderT: return 'Stormrider';
  case def.Race.StormRiderV: return 'Stormrider';
  case def.Race.HumanMaleV: return 'Human';
  case def.Race.HumanMaleA: return 'Human';
  case def.Race.HumanMaleT: return 'Human';
  case def.Race.Pict: return 'Pict';
  case def.Race.Any: return 'ERROR';
  }
}

export function archetypeString(archetype: def.Archetype) {
  switch (archetype) {
  case def.Archetype.FireMage: return 'Fire Mage';
  case def.Archetype.EarthMage: return 'Earth Mage';
  case def.Archetype.WaterMage: return 'Water Mage';
  case def.Archetype.Fighter: return 'Fighter';
  case def.Archetype.Healer: return 'Healer';
  case def.Archetype.MeleeCombatTest: return 'Melee Test';
  case def.Archetype.Archer: return 'Archer';
  case def.Archetype.ArcherTest: return 'Archer Test';
  case def.Archetype.BlackKnight: return 'Black Knight';
  case def.Archetype.Fianna: return 'Fianna';
  case def.Archetype.Mjolnir: return 'Mjölnir';
  case def.Archetype.Physician: return 'Physician';
  case def.Archetype.Empath: return 'Empath';
  case def.Archetype.Stonehealer: return 'Stonehealer';
  case def.Archetype.Blackguard: return 'Black Guard';
  case def.Archetype.ForestStalker: return 'Forest Stalker';
  case def.Archetype.WintersShadow: return 'Winter\'s Shadow';
  case def.Archetype.Any: return 'ERROR';
  }
}
