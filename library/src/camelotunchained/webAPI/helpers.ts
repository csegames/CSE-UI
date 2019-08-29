/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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

export function accessLevelToPatchPermission(access: AccessType) {
  switch (access) {
    case AccessType.Public:
      return PatchPermissions.Public;
    case AccessType.Beta3:
      return PatchPermissions.Beta3;
    case AccessType.Beta2:
      return PatchPermissions.Beta2;
    case AccessType.Beta1:
      return PatchPermissions.Beta1;
    case AccessType.Alpha:
      return PatchPermissions.Alpha;
    case AccessType.InternalTest:
      return PatchPermissions.InternalTest;
    case AccessType.Employees:
      return PatchPermissions.Development;
  }
}

export function accessLevelString(access: AccessType) {
  switch (access) {
    case AccessType.Public:
      return 'Everyone';
    case AccessType.Beta3:
      return 'All Backers';
    case AccessType.Beta2:
      return 'Beta 1-2, Alpha, IT';
    case AccessType.Beta1:
      return 'Beta 1, Alpha, IT';
    case AccessType.Alpha:
      return 'Alpha, IT';
    case AccessType.InternalTest:
      return 'IT';
    case AccessType.Employees:
      return 'CSE';
  }
}

export function raceString(race: Race) {
  switch (race) {
    case Race.Luchorpan:
      return 'Luchorpán';
    case Race.Valkyrie:
      return 'Valkyrie';
    case Race.HumanMaleV:
      return 'Human';
    case Race.HumanMaleA:
      return 'Human';
    case Race.HumanMaleT:
      return 'Human';
    case Race.Pict:
      return 'Pict';
  }
}

export function archetypeString(archetype: Archetype) {
  switch (archetype) {
    case Archetype.BlackKnight:
      return 'Black Knight';
    case Archetype.Fianna:
      return 'Fianna';
    case Archetype.Mjolnir:
      return 'Mjölnir';
    case Archetype.Physician:
      return 'Physician';
    case Archetype.Empath:
      return 'Empath';
    case Archetype.Stonehealer:
      return 'Stonehealer';
    case Archetype.Blackguard:
      return 'Black Guard';
    case Archetype.ForestStalker:
      return 'Forest Stalker';
    case Archetype.WintersShadow:
      return 'Winter\'s Shadow';
  }
}
