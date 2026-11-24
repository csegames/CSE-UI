/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ClassDef } from '../dataSources/manifest/classManifest';
import { ProgressionTrackDef } from '../dataSources/manifest/progressionTrackManifest';
import { GameDefsState } from '../redux/gameDefsSlice';
import {
  PlayerEntityStateModel,
  ProgressState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { AbilityWithActivation } from '../redux/abilitiesSlice';
import { BorderType } from '../components/FactionBorder';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralLevel,
  StringIDGeneralParenthesis
} from './stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

export const TAG_PREFIX_ARCHETYPE_CLASS = 'Asset.Class.';
export const TAG_PREFIX_SPECIALIZATION = 'Asset.Specialization.';
export const TAG_PREFIX_PASSIVE = 'Asset.Passive.';
const TAG_PREFIX_TRADESKILL = 'Tradeskill.';
const TAG_REALM_PROGRESSION = 'UI.Progression.Realm';

// Corners scale with the icon, since their 4vmin/2vmin defaults would cover most of a small one.
const LEARNED_ICON_CORNER_RATIO = 0.6;
const LOCKED_ICON_CORNER_RATIO = 0.4;

// String IDs
export const StringIDAbilityBookClassProgression = 'AbilityBookClassProgression';
export const StringIDAbilityBookTradeskillProgression = 'AbilityBookTradeskillProgression';
export const StringIDAbilityBookRealmProgression = 'AbilityBookRealmProgression';

export function isArchetypeTrack(track: ProgressionTrackDef): boolean {
  return track.tags.some((tag) => tag.startsWith(TAG_PREFIX_ARCHETYPE_CLASS));
}

export function isTradeskillTrack(track: ProgressionTrackDef): boolean {
  return track.tags.some((tag) => tag.startsWith(TAG_PREFIX_TRADESKILL));
}

function isRealmProgressionTrack(track: ProgressionTrackDef): boolean {
  return track.tags.includes(TAG_REALM_PROGRESSION);
}

// Tradeskill levels and realm renown ranks are shown as-is. Every other track shows level 0 as level 1.
export function getTrackDisplayLevel(track: ProgressionTrackDef, level: number): number {
  return isTradeskillTrack(track) || isRealmProgressionTrack(track) ? level : level + 1;
}

export function findClassProgressionTrack(
  classDef: ClassDef,
  progressionTracks: Record<string, ProgressionTrackDef>,
  isMatch: (track: ProgressionTrackDef) => boolean
): ProgressionTrackDef | undefined {
  return classDef.progressionTracks.map((ptID) => progressionTracks[ptID]).find((track) => !!track && isMatch(track));
}

export function isSpecializationTrack(track: ProgressionTrackDef): boolean {
  return track.tags.some((tag) => tag.startsWith(TAG_PREFIX_SPECIALIZATION));
}

export function getTradeskillTitle(
  track: ProgressionTrackDef,
  level: number,
  stringTable: Record<string, StringTableEntryDef>
): string {
  const levelText = getTokenizedStringTableValue(StringIDGeneralLevel, stringTable, { LEVEL: level.toFixed(0) });
  const levelInParentheses = getTokenizedStringTableValue(StringIDGeneralParenthesis, stringTable, {
    CONTENTS: levelText
  });
  return `${getStringTableValue(track.nameKey, stringTable)} ${levelInParentheses}`;
}

export function getAbilityIconBorderProps(
  isLearned: boolean,
  iconSizeVmin: number
): { type: BorderType; cornerSize: string } {
  const ratio = isLearned ? LEARNED_ICON_CORNER_RATIO : LOCKED_ICON_CORNER_RATIO;
  return {
    type: isLearned ? BorderType.Primary : BorderType.Secondary,
    cornerSize: `${(iconSizeVmin * ratio).toFixed(2)}vmin`
  };
}

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
    const track = defs.progressionTracks[ptID];
    return !!track && isSpecializationTrack(track);
  });

  const characterLevel = self.characterLevel ?? 0;
  const spentPoints = specializationTracks.reduce<number>((pointsSoFar, ptID) => {
    return pointsSoFar + (self.progression[ptID]?.level ?? 0);
  }, 0);

  return characterLevel - spentPoints;
}

export function findRealmProgressionTrack(
  classDef: ClassDef,
  progressionTracks: Record<string, ProgressionTrackDef>
): ProgressionTrackDef | undefined {
  return findClassProgressionTrack(classDef, progressionTracks, isRealmProgressionTrack);
}

// Each trained pool unlock arrives in self.progression as its own entry, keyed "<trackID>.<unlockID>".
export function getPoolUnlockTrackID(trackID: string, unlockID: string): string {
  return `${trackID}.${unlockID}`;
}

// Realm Renown points earned (the realm track's level) minus the tier costs already paid for its unlocks.
export function getAvailableRealmProgressionPoints(
  realmTrack: ProgressionTrackDef | undefined,
  progression: Record<string, ProgressState>
): number {
  if (!realmTrack) {
    return 0;
  }

  const spentPoints = getSpentRealmProgressionPoints(realmTrack, progression);

  return (progression[realmTrack.id]?.level ?? 0) - spentPoints;
}

export function getSpentRealmProgressionPoints(
  realmTrack: ProgressionTrackDef | undefined,
  progression: Record<string, ProgressState>
): number {
  if (!realmTrack) {
    return 0;
  }

  let spentPoints = 0;
  Object.values(realmTrack.poolsByCategory).forEach((pools) => {
    pools.forEach((pool) => {
      pool.unlocks.forEach((unlock) => {
        const unlockLevel = progression[getPoolUnlockTrackID(realmTrack.id, unlock.unlockID)]?.level ?? 0;
        for (let i = 0; i < unlockLevel && i < unlock.costByTier.length; ++i) {
          spentPoints += unlock.costByTier[i];
        }
      });
    });
  });

  return spentPoints;
}

export function playStagedLevelChangeSound(stagedLevelChange: number): void {
  if (stagedLevelChange > 1) {
    clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_MULTI_SELECT);
  } else if (stagedLevelChange === 1) {
    clientAPI.playGameSound(SoundEvents.PLAY_CP_UI_ABILITY_STAGING);
  } else if (stagedLevelChange < 0) {
    clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_DESELECT);
  }
}

export function getAbilityByDisplayDefID(
  displayDefID: number,
  abilities: Record<number, AbilityWithActivation>,
  abilityIDsByDisplayDefID: Record<number, number>
): AbilityWithActivation | undefined {
  const abilityID = abilityIDsByDisplayDefID[displayDefID];
  return abilityID !== undefined ? abilities[abilityID] : undefined;
}
