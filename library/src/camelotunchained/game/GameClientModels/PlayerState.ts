/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultPlayerStateModel } from './EntityState';
import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/_Updatable';

import engineInit from '../../../_baseGame/GameClientModels/_Init';

export const SelfPlayer_Update = 'selfPlayerState.update';

declare global {
  type Facing2fDegrees = {
    yaw: number;
    pitch: number;
  };

  /**
 * State data extension of PlayerStateModel for the player
 */
interface SelfPlayerStateModel extends PlayerStateModel {
  characterID: string;
  zoneID: string;
  facing: Facing2fDegrees;
  cameraFacing: Facing2fDegrees;

  /**
   * Request to respawn at a specific location if a spawnLocationID is provided.
   * This method will only respawn the player if they are in a respawnable state, eg. dead
   * @param {String - optional} spawnLocationID The identifier for a spawn location.
   */
  respawn: (spawnLocationID?: string) => void;

  /**
   * Request the client target an entityID as a friendly target
   * @param {String} entityID Hex entityID of a friendly entity to target
   * @return {Boolean} whether or not the target request was successful
   */
  requestFriendlyTarget: (entityID: string) => boolean;

  /**
   * Request the client target an entityID as an enemy target
   * @param {String} entityID Hex entityID of a enemy entity to target
   * @return {Boolean} whether or not the target request was successful
   */
  requestEnemyTarget: (entityID: string) => boolean;
}

  type SelfPlayerStateUpdatable = Readonly<SelfPlayerStateModel> & Updatable;
  interface SelfPlayerState extends SelfPlayerStateUpdatable {}
  type ImmutableSelfPlayerState = DeepImmutableObject<SelfPlayerState>;
}

function noOp(...args: any[]): any {}

function initDefault(): SelfPlayerState {
  return {
    ...defaultPlayerStateModel(),

    characterID: 'unknown',
    zoneID: 'unknown',
    facing: { yaw: 0, pitch: 0 },
    cameraFacing: { yaw: 0, pitch: 0 },

    respawn: noOp,
    requestFriendlyTarget: noOp,
    requestEnemyTarget: noOp,

    // Updatable
    isReady: false,
    updateEventName: SelfPlayer_Update,
    onUpdated: createDefaultOnUpdated(SelfPlayer_Update),
    onReady: createDefaultOnReady(SelfPlayer_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  camelotunchained._devGame._cse_dev_defaultSelfPlayerState = initDefault();
  if (typeof Proxy !== 'undefined') {
    camelotunchained._devGame.selfPlayerState = new Proxy({
      isReady: true,
      updateEventName: SelfPlayer_Update,
      onUpdated: createDefaultOnUpdated(SelfPlayer_Update),
      onReady: createDefaultOnReady(SelfPlayer_Update),
    }, {
      get: (obj, key) => {
  
        if (key in camelotunchained._devGame._cse_dev_selfPlayerState) {
          if (typeof camelotunchained._devGame._cse_dev_selfPlayerState[key] === 'function') {
            return function(...args: any[]) {
              return camelotunchained._devGame._cse_dev_selfPlayerState[key](...args);
            };
          }
          return camelotunchained._devGame._cse_dev_selfPlayerState[key];
        }
  
        const entityID = camelotunchained._devGame._cse_dev_selfPlayerState.entityID;
        if (camelotunchained.game.entities[entityID] && key in camelotunchained.game.entities[entityID]) {
          return camelotunchained.game.entities[entityID][key];
        }
  
        if (key in obj) {
          return obj[key];
        }
  
        if (key === '__isProxy') {
          return true;
        }
  
        if (key in camelotunchained._devGame._cse_dev_defaultSelfPlayerState) {
          return camelotunchained._devGame._cse_dev_defaultSelfPlayerState[key];
        }
  
        if (game.debug) console.warn('Attempted to access missing property on selfPlayerState', key);
        return undefined;
      },
  
      ownKeys: (target) => {
        return Reflect.ownKeys(camelotunchained._devGame._cse_dev_defaultSelfPlayerState);
      },
  
      getOwnPropertyDescriptor: (target, prop) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(camelotunchained._devGame._cse_dev_defaultSelfPlayerState, prop);
        descriptor.value = camelotunchained.game[prop];
        descriptor.writable = false;
        // descriptor.configurable = false;
        return descriptor;
      },
    }) as SelfPlayerState;
  }

  engineInit(
    SelfPlayer_Update,
    () => ({} as any),
    () => camelotunchained._devGame._cse_dev_selfPlayerState,
    (model: SelfPlayerStateModel) => camelotunchained._devGame._cse_dev_selfPlayerState = model as SelfPlayerState);

}
