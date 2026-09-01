/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { ScenarioRoundState, Vec3f } from '../../webAPI/definitions';
import { CharacterKind } from '../types/CharacterKind';
import { Status } from '../types/Status';
import { ObjectiveUIVisibility } from '../../../_baseGame/types/Objective';
import { LifeState } from '../types/LifeState';
import { EntityResourceIDs } from '../types/EntityResourceIDs';
import { CurrentMax } from '../../../_baseGame/types/CurrentMax';
import { ObjectiveState as ObjectiveStateEnum } from '../../webAPI/definitions';

// This should map to UI::ObjectiveSnapshot
export interface ObjectiveState {
  visibility: ObjectiveUIVisibility;
  state: ObjectiveStateEnum;
  footprintRadius: number;
  indicator: number;
  indicatorLabel: string;
}

// This should map to UI::EntityTracker::Snapshot
export interface BaseEntityState {
  entityID: string;
  type: string;
  faction: number;
  name: string;
  isAlive: boolean;
  statuses: ArrayMap<Status>;
  resources: ArrayMap<EntityResource>;
  objective: ObjectiveState | null;
}

// This should map to UI::EntityResource
export interface EntityResource extends CurrentMax {
  name: string;
  id: string;
  numericID: number;
  lastDecreaseTime: number;
}

// This should map to UI::EntityTracker::PlayerSnapshot
export interface PlayerEntityState extends BaseEntityState {
  characterKind: CharacterKind;
  accountID: string;
  classID: number;
  controlledEntityID?: string;
  resources: ArrayMap<EntityResource>;
  gender: number;
  race: number;
  // FSR-specific items follow.
  currentDeaths: number;
  deathStartTime: number;
  downedStateEndTime: number;
  killersName: string;
  killersRace: number;
  lifeState: LifeState;
  maxDeaths: number;
  portraitURL: string;
  iconClass: string;
  scenarioID: string;
  scenarioRoundState: ScenarioRoundState;
  isShielded: boolean;
  // in world time
  scenarioRoundStateEndTime: number;
  scenarioRoundStateStartTime: number;
  survivedTime: number;
  teamKills: number;
  totalKills: number;
  rank: number;
}

export interface EntityPositionMapModel {
  [entityID: string]: Vec3f;
}

export interface WorldUIPositionModel {
  worldSpaceDistanceToPlayer: number;
  relativeScreenSpaceDistanceToCrosshair: number;
}

export interface WorldUIPositionMapModel {
  [id: number]: WorldUIPositionModel;
}

function defaultBaseEntityState(): BaseEntityState {
  return {
    faction: 0,
    type: '',
    entityID: '',
    name: 'unknown',
    isAlive: false,
    statuses: {},
    resources: {},
    objective: null
  };
}

export function defaultPlayerEntityState(): PlayerEntityState {
  return {
    ...defaultBaseEntityState(),
    type: 'Player',
    accountID: '',
    characterKind: CharacterKind.User,
    controlledEntityID: '',
    portraitURL: '',
    iconClass: '',
    race: 25,
    classID: null,
    gender: 0,
    currentDeaths: 0,
    maxDeaths: 0,
    survivedTime: 0,
    killersRace: 0,
    killersName: null,
    totalKills: 0,
    teamKills: 0,
    scenarioRoundState: ScenarioRoundState.Uninitialized,
    isShielded: false,
    scenarioID: null,
    scenarioRoundStateEndTime: 0,
    scenarioRoundStateStartTime: 0,
    lifeState: LifeState.Alive,
    deathStartTime: 0,
    downedStateEndTime: 0,
    rank: 0
  };
}

export function isPlayer(entity: BaseEntityState): entity is PlayerEntityState {
  return entity && typeof (entity as any).characterKind === 'number';
}

export function findEntityResource(resources: ArrayMap<EntityResource>, resourceID: EntityResourceIDs): EntityResource {
  if (!resources) {
    return null;
  }

  const resource = Object.values(resources).find((r) => r.id === resourceID);
  return resource;
}

export function findEntityResourceByNumericID(resources: ArrayMap<EntityResource>, resourceID: number): EntityResource {
  if (!resources) {
    return null;
  }

  const resource = Object.values(resources).find((r) => r.numericID === resourceID);
  return resource;
}
