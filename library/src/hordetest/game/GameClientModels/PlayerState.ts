/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultPlayerStateModel } from './EntityState';
import { Updatable, createDefaultOnReady, createDefaultOnUpdated } from '../../../_baseGame/GameClientModels/_Updatable';
import engineInit from '../../../_baseGame/GameClientModels/_Init';

export const SelfPlayer_Update = 'selfPlayerState.update';

declare global {
  type Facing2fDegrees = {
    yaw: number;
    pitch: number;
  }

  /**
   * State data extension of PlayerStateModel for the player
   */
  interface SelfPlayerStateModel extends PlayerStateModel {
    characterID: string;
    championID: string;
    facing: Facing2fDegrees;
    playerDifferentiator: number;
    viewBearing: number;

    /**
     * Request to respawn at a specific location if a spawnLocationID is provided.
     * This method will only respawn the player if they are in a respawnable state, eg. dead
     * @param {String - optional} spawnLocationID The identifier for a spawn location.
     */
    respawn: (spawnLocationID?: string) => void;
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
    championID: 'unknown',
    facing: { yaw: 0, pitch: 0 },
    playerDifferentiator: -1,
    viewBearing: 0,

    respawn: noOp,

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

  hordetest._devGame._cse_dev_defaultSelfPlayerState = initDefault();
  if (typeof Proxy !== 'undefined') {
    hordetest._devGame.selfPlayerState = new Proxy({
      isReady: true,
      updateEventName: SelfPlayer_Update,
      onUpdated: createDefaultOnUpdated(SelfPlayer_Update),
      onReady: createDefaultOnReady(SelfPlayer_Update),
    }, {
      get: (obj, key) => {
  
        if (key in hordetest._devGame._cse_dev_selfPlayerState) {
          if (typeof hordetest._devGame._cse_dev_selfPlayerState[key] === 'function') {
            return function(...args: any[]) {
              return hordetest._devGame._cse_dev_selfPlayerState[key](...args);
            };
          }
          return hordetest._devGame._cse_dev_selfPlayerState[key];
        }
  
        const entityID = hordetest._devGame._cse_dev_selfPlayerState.entityID;
        if (hordetest.game.entities[entityID] && key in hordetest.game.entities[entityID]) {
          return hordetest.game.entities[entityID][key];
        }
  
        if (key in obj) {
          return obj[key];
        }
  
        if (key === '__isProxy') {
          return true;
        }
  
        if (key in hordetest._devGame._cse_dev_defaultSelfPlayerState) {
          return hordetest._devGame._cse_dev_defaultSelfPlayerState[key];
        }
  
        if (game.debug) console.warn('Attempted to access missing property on selfPlayerState', key);
        return undefined;
      },
  
      ownKeys: (target) => {
        return Reflect.ownKeys(hordetest._devGame._cse_dev_defaultSelfPlayerState);
      },
  
      getOwnPropertyDescriptor: (target, prop) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(hordetest._devGame._cse_dev_defaultSelfPlayerState, prop);
        descriptor.value = hordetest.game[prop];
        descriptor.writable = false;
        // descriptor.configurable = false;
        return descriptor;
      },
    }) as SelfPlayerState;
  }

  engineInit(
    SelfPlayer_Update,
    () => ({} as any),
    () => hordetest._devGame._cse_dev_selfPlayerState,
    (model: SelfPlayerStateModel) => hordetest._devGame._cse_dev_selfPlayerState = model as SelfPlayerState);

}
