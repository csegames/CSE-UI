/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StatDef } from '../dataSources/manifest/statManifest';
import { ClassDef } from '../dataSources/manifest/classManifest';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { RaceDef } from '../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../dataSources/manifest/bodyTypeManifest';

const getSpentStatPoints = (stats: Record<string, StatDef>, statsPoints: Record<string, number>) =>
  Object.values(stats).reduce((acc, stat) => {
    if (!stat.addPointsAtCharacterCreation) {
      return acc + 0;
    }
    return acc + (statsPoints[stat.id] ?? 0);
  }, 0);

export const getRemainingStatPoints = (
  stats: Record<string, StatDef>,
  statsPoints: Record<string, number>,
  startingAttributePoints: number,
  racialBonuses: Record<string, number>
) => {
  return (
    startingAttributePoints +
    Object.values(racialBonuses).reduce((total, b) => total + b, 0) -
    getSpentStatPoints(stats, statsPoints)
  );
};

export const getSelectableRaces = (factionID: Faction, racesByStringID: Record<string, RaceDef>): RaceDef[] =>
  Object.values(racesByStringID)
    .filter((race) => race.factionID === factionID && race.playerCreatable)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getSelectedRace = (
  factionID: Faction,
  raceID: string,
  racesByStringID: Record<string, RaceDef>
): RaceDef | undefined => racesByStringID[raceID] ?? getSelectableRaces(factionID, racesByStringID)[0];

export const getValidClasses = (classesByStringID: Record<string, ClassDef>, factionID: Faction): ClassDef[] =>
  Object.values(classesByStringID)
    .filter((classObj) => classObj.playerCreatable)
    .sort((a, b) => {
      const aIsDisabled = a.factionID !== factionID;
      const bIsDisabled = b.factionID !== factionID;
      if (aIsDisabled && !bIsDisabled) {
        return 1;
      }
      if (!aIsDisabled && bIsDisabled) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });

export const getSelectableClasses = (factionID: Faction, classesByStringID: Record<string, ClassDef>): ClassDef[] =>
  getValidClasses(classesByStringID, factionID).filter((validClass) => validClass.factionID === factionID);

export const getSelectedClass = (
  factionID: Faction,
  classID: string,
  classesByStringID: Record<string, ClassDef>
): ClassDef | undefined => classesByStringID[classID] ?? getSelectableClasses(factionID, classesByStringID)[0];

export const getSelectableBodyTypes = (bodyTypesByStringID: Record<string, BodyTypeDef>): BodyTypeDef[] =>
  Object.values(bodyTypesByStringID).sort((a, b) => a.name.localeCompare(b.name));

export const getSelectedBodyType = (
  bodyTypeID: string,
  bodyTypesByStringID: Record<string, BodyTypeDef>
): BodyTypeDef | undefined => bodyTypesByStringID[bodyTypeID] ?? getSelectableBodyTypes(bodyTypesByStringID)[0];
