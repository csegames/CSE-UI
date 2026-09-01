/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ClassDef } from '../dataSources/manifest/classManifest';
import { GameDefsState } from '../redux/gameDefsSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { AbilityWithActivation } from '../redux/abilitiesSlice';

export const TAG_PREFIX_ARCHETYPE_CLASS = 'Asset.Class.';
export const TAG_PREFIX_SPECIALIZATION = 'Asset.Specialization.';

// Character level minus levels already spent on specialization tracks; mirrors the "Available
// Points" the Ability Book shows per-class.
export function getAvailableAbilityPoints(
  classDef: ClassDef,
  defs: GameDefsState,
  self: PlayerEntityStateModel
): number {
  if (!classDef || !self) {
    return 0;
  }

  const specializationTracks = classDef.progressionTracks.filter((ptID) => {
    return defs.progressionTracks[ptID]?.tags.some((tag) => tag.startsWith(TAG_PREFIX_SPECIALIZATION));
  });

  const characterLevel = self.characterLevel ?? 0;
  const spentPoints = specializationTracks.reduce<number>((pointsSoFar, ptID) => {
    return pointsSoFar + (self.progression[ptID]?.level ?? 0);
  }, 0);

  return characterLevel - spentPoints;
}

export function getAbilityByDisplayDefID(
  displayDefID: number,
  abilities: Record<number, AbilityWithActivation>,
  abilityIDsByDisplayDefID: Record<number, number>
): AbilityWithActivation | undefined {
  const abilityID = abilityIDsByDisplayDefID[displayDefID];
  return abilityID !== undefined ? abilities[abilityID] : undefined;
}
