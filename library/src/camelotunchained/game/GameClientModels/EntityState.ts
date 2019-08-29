/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  initUpdatable,
  Updatable,
  executeUpdateCallbacks,
} from '../../../_baseGame/GameClientModels/_Updatable';

declare global {
  interface EntityStateModel {
    faction: Faction;
    entityID: string;
    name: string;
    isAlive: boolean;
    position: Vec3f;
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

  interface ResourceNodeStateModel extends EntityStateModel {
    type: 'resourceNode';
    health: CurrentMax;
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

  type AnyEntityStateModel = PlayerStateModel | SiegeStateModel | KinematicStateModel | ResourceNodeStateModel;
  type AnyEntityState = Readonly<AnyEntityStateModel> & Updatable;

  type PlayerStateUpdatable = Readonly<PlayerStateModel> & Updatable;
  interface PlayerState extends PlayerStateUpdatable {}

  type SiegeStateUpdateble = Readonly<SiegeStateModel> & Updatable;
  interface SiegeState extends SiegeStateUpdateble {}

  type ResourceNodeStateUpdateble = Readonly<ResourceNodeStateModel> & Updatable;
  interface ResourceNodeState extends ResourceNodeStateUpdateble {}

  type ImmutableSiegeState = DeepImmutableObject<SiegeState>;
  type ImmutableKinematicState = DeepImmutableObject<KinematicStateModel & Updatable>;

  type ImmutablePlayerState = DeepImmutableObject<PlayerState>;
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
    faction: Faction.Arthurian,
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
  if (game.debug) {
    console.groupCollapsed(`Client > ${EntityState_Update}`);
    try {
      console.log(JSON.stringify(state));
    } catch {}
    console.groupEnd();
  }

  if (typeof camelotunchained._devGame.entities[state.entityID] === 'undefined') {
    camelotunchained._devGame.entities[state.entityID] = cloneDeep(state);
    camelotunchained._devGame.entities[state.entityID].updateEventName = EntityState_Update;
    // init Updatable.
    initUpdatable(camelotunchained._devGame.entities[state.entityID]);
  } else {
    camelotunchained._devGame.entities[state.entityID] = cloneDeep(state);
    camelotunchained._devGame.entities[state.entityID].updateEventName = EntityState_Update;
  }

  if (state.entityID === camelotunchained.game.selfPlayerState.entityID) {
    executeUpdateCallbacks(camelotunchained.game.selfPlayerState);
  }

  if (camelotunchained.game.friendlyTargetState && state.entityID === camelotunchained.game.friendlyTargetState.entityID) {
    game.trigger('friendlyTargetPlayerState.update', camelotunchained.game.friendlyTargetState);
  }

  if (camelotunchained.game.enemyTargetState && state.entityID === camelotunchained.game.enemyTargetState.entityID) {
    game.trigger('enemyTargetPlayerState.update', camelotunchained.game.enemyTargetState);
  }

  executeUpdateCallbacks(camelotunchained._devGame.entities[state.entityID]);
}

export default function() {
  if (typeof engine !== 'undefined') {
    engine.on(EntityState_Update, onReceiveEntityStateUpdate);
  }
}
