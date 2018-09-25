/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as def from './definitions';

export function parseResponseData(res: any) {
  if (!res.data) {
    return res;
  }

  if (typeof res.data === 'string') {
    const newRes = {
      ...res,
      data: JSON.parse(res.data),
    };
    return newRes;
  }

  return res;
}

export function accessLevelToPatchPermission(access: def.AccessType) {
  switch (access) {
    case def.AccessType.Public:
      return def.PatchPermissions.Public;
    case def.AccessType.Beta3:
      return def.PatchPermissions.Beta3;
    case def.AccessType.Beta2:
      return def.PatchPermissions.Beta2;
    case def.AccessType.Beta1:
      return def.PatchPermissions.Beta1;
    case def.AccessType.Alpha:
      return def.PatchPermissions.Alpha;
    case def.AccessType.InternalTest:
      return def.PatchPermissions.InternalTest;
    case def.AccessType.Employees:
      return def.PatchPermissions.Development;
  }
}

export function accessLevelString(access: def.AccessType) {
  switch (access) {
    case def.AccessType.Public:
      return 'Everyone';
    case def.AccessType.Beta3:
      return 'All Backers';
    case def.AccessType.Beta2:
      return 'Beta 1-2, Alpha, IT';
    case def.AccessType.Beta1:
      return 'Beta 1, Alpha, IT';
    case def.AccessType.Alpha:
      return 'Alpha, IT';
    case def.AccessType.InternalTest:
      return 'IT';
    case def.AccessType.Employees:
      return 'CSE';
  }
}

export function raceString(race: def.Race) {
  switch (race) {
    case def.Race.Luchorpan:
      return 'Luchorpán';
    case def.Race.Valkyrie:
      return 'Valkyrie';
    case def.Race.HumanMaleV:
      return 'Human';
    case def.Race.HumanMaleA:
      return 'Human';
    case def.Race.HumanMaleT:
      return 'Human';
    case def.Race.Pict:
      return 'Pict';
  }
}

export function archetypeString(archetype: def.Archetype) {
  switch (archetype) {
    case def.Archetype.BlackKnight:
      return 'Black Knight';
    case def.Archetype.Fianna:
      return 'Fianna';
    case def.Archetype.Mjolnir:
      return 'Mjölnir';
    case def.Archetype.Physician:
      return 'Physician';
    case def.Archetype.Empath:
      return 'Empath';
    case def.Archetype.Stonehealer:
      return 'Stonehealer';
    case def.Archetype.Blackguard:
      return 'Black Guard';
    case def.Archetype.ForestStalker:
      return 'Forest Stalker';
    case def.Archetype.WintersShadow:
      return 'Winter\'s Shadow';
  }
}
