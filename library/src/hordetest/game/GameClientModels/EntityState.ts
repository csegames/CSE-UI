/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { initUpdatable, Updatable, executeUpdateCallbacks } from '../../../_baseGame/GameClientModels/Updatable';
import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { CurrentMax } from '../../graphql/schema';
import { ScenarioRoundState, Vec3f } from '../../webAPI/definitions';
import { cloneDeep } from '../../../_baseGame/utils/objectUtils';
import { CharacterKind } from '../types/CharacterKind';
import { Status } from '../types/Status';
import { hordetest } from '../..';
import { engine } from '../../../_baseGame/engine';
import { BaseGameInterface } from '../../../_baseGame/BaseGameInterface';
import { ObjectiveState } from '../../webAPI/definitions';
import { ObjectiveUIVisibility } from '../../../_baseGame/types/Objective';
import { GameInterface } from '../GameInterface';
import { LifeState } from '../types/LifeState';
import { EntityResourceIDs } from '../types/EntityResourceIDs';

// This should map to UI::ObjectiveSnapshot
export interface ObjectiveStateModel {
  visibility: ObjectiveUIVisibility;
  state: ObjectiveState;
  footprintRadius: number;
  indicator: number;
  indicatorLabel: string;
}

// This should map to UI::EntityTracker::Snapshot
export interface BaseEntityStateModel {
  entityID: string;
  type: string;
  faction: number;
  name: string;
  isAlive: boolean;
  position: Vec3f;
  statuses: ArrayMap<Status>;
  resources: ArrayMap<EntityResource>;
  objective: ObjectiveStateModel | null;
}

export type UpdatableBaseEntityStateModel = BaseEntityStateModel & Updatable;

// This should map to UI::EntityResource
export interface EntityResource extends CurrentMax {
  name: string;
  id: string;
  numericID: number;
  lastDecreaseTime: number;
}

// This should map to UI::EntityTracker::PlayerSnapshot
export interface PlayerEntityStateModel extends BaseEntityStateModel {
  characterKind: CharacterKind;
  accountID: string;
  classID: number;
  controlledEntityID?: string;
  resources: ArrayMap<EntityResource>;
  gender: number;
  race: number;
  wounds: number;
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
}

export type UpdatablePlayerEntityStateModel = PlayerEntityStateModel & Updatable;

function defaultBaseEntityStateModel(): BaseEntityStateModel {
  return {
    faction: 0,
    type: '',
    entityID: '',
    name: 'unknown',
    isAlive: false,
    position: { x: NaN, y: NaN, z: NaN },
    statuses: {},
    resources: {},
    objective: null
  };
}

function defaultCurrentMax(): CurrentMax {
  return {
    current: 100,
    max: 100
  };
}

export function defaultPlayerEntityStateModel(): PlayerEntityStateModel {
  return {
    ...defaultBaseEntityStateModel(),
    type: 'Player',
    accountID: '',
    characterKind: CharacterKind.User,
    wounds: 0,
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
    downedStateEndTime: 0
  };
}

export const Entity_Updated = 'entity.updated';
export const Entity_Removed = 'entity.removed';

function onReceiveEntityStateUpdate(game: BaseGameInterface): (state: BaseEntityStateModel) => void {
  return (state: BaseEntityStateModel) => {
    const oldEntity = hordetest._devGame.entities[state.entityID];
    const isNewEntity = hordetest._devGame.entities[state.entityID] === undefined;
    hordetest._devGame.entities[state.entityID] = {
      ...cloneDeep(state),
      updateEventName: Entity_Updated,
      isReady: oldEntity && oldEntity.isReady,
      onUpdated: oldEntity && oldEntity.onUpdated,
      onReady: oldEntity && oldEntity.onReady
    };

    if (isNewEntity) {
      initUpdatable(hordetest._devGame.entities[state.entityID]);
    }

    if (state.entityID === hordetest.game.selfPlayerState.entityID) {
      (hordetest.game as GameInterface).selfPlayerEntityState = cloneDeep(state) as UpdatablePlayerEntityStateModel;
    }

    executeUpdateCallbacks(game, hordetest._devGame.entities[state.entityID]);
  };
}

function onReceiveEntityStateRemoved(entityID: string) {
  if (hordetest._devGame.entities[entityID] === undefined) {
    return;
  }

  delete hordetest._devGame.entities[entityID];
}

function onScenarioRoundEnd() {
  // Scenario has ended, remove all entities from the list.
  Object.keys(hordetest._devGame.entities).forEach((entityID) => {
    if (hordetest._devGame.entities[entityID] === undefined) {
      return;
    }

    delete hordetest._devGame.entities[entityID];
  });
}

export function isPlayer(entity: BaseEntityStateModel): entity is PlayerEntityStateModel {
  return entity && typeof (entity as any).characterKind === 'number';
}

export function initEntityState(game: BaseGameInterface) {
  engine.on(Entity_Updated, onReceiveEntityStateUpdate(game));
  engine.on(Entity_Removed, onReceiveEntityStateRemoved);
  engine.on('scenarioRoundEnd', onScenarioRoundEnd);
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
