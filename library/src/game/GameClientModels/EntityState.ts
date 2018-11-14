/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { initUpdatable, Updatable, executeUpdateCallbacks } from './_Updatable';

declare global {
  interface EntityStateModel {
    faction: Faction;
    entityID: string;
    name: string;
    isAlive: boolean;

    /**
     * Players coordinates in world space.
     */
    position: {
      x: number;
      y: number;
      z: number;
    };

    // status -- null / undefined if no status on entity
    statuses: ArrayMap<{ id: number; } & Timing>;
  }

  interface SiegeStateModel extends EntityStateModel {
    type: 'siege';
    /**
     * EntityID of the entity controlling this Siege Engine
     */
    controllingEntityID?: string;

    health: CurrentMax;
  }

  interface KinematicStateModel extends EntityStateModel {
    type: 'kinematic';
  }

  interface PlayerStateModel extends EntityStateModel {
    type: 'player';
    race: Race;
    gender: Gender;
    classID: Archetype;
    stamina: CurrentMax;
    blood: CurrentMax;

    /**
     * EntityID of an entity this Player is controlling, if any.
     * ie. a siege engine, vehicle, creature ect...
     */
    controlledEntityID?: string;

    // health per body part, ordered according to the bodyParts enum found
    // in ../constants/bodyParts.ts -- TODO: use an enum from C# generated
    // through webAPI definitions.ts file
    health: ArrayMap<Health>;
  }

  type AnyEntityStateModel = PlayerStateModel | SiegeStateModel | KinematicStateModel;

  type PlayerState = Readonly<PlayerStateModel> & Updatable;
  type AnyEntityState = Readonly<AnyEntityStateModel> & Updatable;

  type ImmutableSiegeState = DeepImmutableObject<SiegeStateModel & Updatable>;
  type ImmutableKinematicState = DeepImmutableObject<KinematicStateModel & Updatable>;

  type ImmutablePlayerState = DeepImmutableObject<PlayerStateModel & Updatable>;
  type ImmutableEntityState = DeepImmutableObject<AnyEntityStateModel & Updatable>;
}


function defaultEntityStateModel(): EntityStateModel {
  return {
    faction: Faction.Factionless,
    entityID: '',
    name: 'unknown',
    isAlive: false,
    position: { x: NaN, y: NaN, z: NaN },
    statuses: {},
  };
}

export function defaultHealth() {
  return {
    current: 1000,
    max: 1000,
    wounds: 0,
  };
}

export function defaultStamAndBlood() {
  return {
    current: 1000,
    max: 1000,
  };
}

export function defaultPlayerStateModel(): PlayerStateModel {
  return {
    ...defaultEntityStateModel(),
    type: 'player',
    race: Race.HumanMaleA,
    gender: Gender.None,
    classID: Archetype.Blackguard,
    health: {
      0: defaultHealth(),
      1: defaultHealth(),
      2: defaultHealth(),
      3: defaultHealth(),
      4: defaultHealth(),
      5: defaultHealth(),
    },
    stamina: defaultStamAndBlood(),
    blood: defaultStamAndBlood(),
  };
}

export function defaultSiegeStateModel(): SiegeStateModel {
  return {
    ...defaultEntityStateModel(),
    type: 'siege',
    health: defaultStamAndBlood(),
  };
}

export const EntityState_Update = 'entityState.update';

function onReceiveEntityStateUpdate(state: AnyEntityState) {
  if (game.debug) console.log(`received entityState.update with model | ${JSON.stringify(state)}`);

  if (typeof _devGame.entities[state.entityID] === 'undefined') {
    _devGame.entities[state.entityID] = state;
    _devGame.entities[state.entityID].updateEventName = EntityState_Update;
    // init Updatable.
    initUpdatable(state);
  }

  if (state.entityID === game.selfPlayerState.entityID) {
    executeUpdateCallbacks(game.selfPlayerState);
  }

  if (game.friendlyTargetState && state.entityID === game.friendlyTargetState.entityID) {
    game.trigger('friendlyTargetPlayerState.update', game.friendlyTargetState);
  }

  if (game.enemyTargetState && state.entityID === game.enemyTargetState.entityID) {
    game.trigger('enemyTargetPlayerState.update', game.enemyTargetState);
  }

  executeUpdateCallbacks(_devGame.entities[state.entityID]);
}

export default function() {
  engine.on(EntityState_Update, onReceiveEntityStateUpdate);
}
