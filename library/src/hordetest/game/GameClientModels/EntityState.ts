/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { initUpdatable, Updatable, executeUpdateCallbacks } from '../../../_baseGame/GameClientModels/_Updatable';

declare global {
  interface EntityStateModel {
    entityID: string;
    name: string;
    isAlive: boolean;
    position: Vec3f;
  }

  interface PlayerStateModel extends EntityStateModel {
    type: 'player';
    characterID: string;
    health: CurrentMax[];
    blood: CurrentMax;
    stamina: CurrentMax;
    level: number;
  }

  type AnyEntityStateModel = PlayerStateModel;
  type AnyEntityState = Readonly<AnyEntityStateModel> & Updatable;

  type PlayerStateUpdatable = Readonly<PlayerStateModel> & Updatable;
  interface PlayerState extends PlayerStateUpdatable {}

  type ImmutablePlayerState = DeepImmutableObject<PlayerState>;
  type ImmutableEntityState = DeepImmutableObject<AnyEntityStateModel & Updatable>;
}

function defaultEntityStateModel(): EntityStateModel {
  return {
    entityID: '',
    name: 'unknown',
    isAlive: false,
    position: { x: NaN, y: NaN, z: NaN },
  };
}

function defaultCurrentMax(): CurrentMax {
  return {
    current: 100,
    max: 100,
  }
}

export function defaultPlayerStateModel(): PlayerStateModel {
  return {
    ...defaultEntityStateModel(),
    type: 'player',
    characterID: 'default-character-id',
    health: [defaultCurrentMax()],
    stamina: defaultCurrentMax(),
    blood: defaultCurrentMax(),
    level: 1,
  };
}

export const EntityState_Update = 'entityState.update';
export const EntityState_Removed = 'entityState.removed';

function onReceiveEntityStateUpdate(state: AnyEntityState) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${EntityState_Update}`);
    try {
      console.log(JSON.stringify(state));
    } catch {}
    console.groupEnd();
  }

  if (typeof hordetest._devGame.entities[state.entityID] === 'undefined') {
    hordetest._devGame.entities[state.entityID] = cloneDeep(state);
    hordetest._devGame.entities[state.entityID].updateEventName = EntityState_Update;
    // init Updatable.
    initUpdatable(hordetest._devGame.entities[state.entityID]);
  } else {
    hordetest._devGame.entities[state.entityID] = cloneDeep(state);
    hordetest._devGame.entities[state.entityID].updateEventName = EntityState_Update;
  }

  if (state.entityID === hordetest.game.selfPlayerState.entityID) {
    executeUpdateCallbacks(hordetest.game.selfPlayerState);
  }

  executeUpdateCallbacks(hordetest._devGame.entities[state.entityID]);
}

function onReceiveEntityStateRemoved(entityID: string) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${EntityState_Removed}`);
    console.log(entityID);
    console.groupEnd();
  }

  if (typeof hordetest._devGame.entities[entityID] === 'undefined') {
    return;
  }

  delete hordetest._devGame.entities[entityID];
}

export default function() {
  if (typeof engine !== 'undefined') {
    engine.on(EntityState_Update, onReceiveEntityStateUpdate);
    engine.on(EntityState_Removed, onReceiveEntityStateRemoved);
  }
}
