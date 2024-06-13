/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnReady, createDefaultOnUpdated } from '../../../_baseGame/GameClientModels/Updatable';
import { engineInit } from '../../../_baseGame/GameClientModels/_Init';
import { HordeTestModel } from '../HordeTestModel';
import { BaseGameInterface } from '../../../_baseGame/BaseGameInterface';
import { defaultPlayerEntityStateModel, Entity_Updated } from './EntityState';
import { SelfPlayerStateModel } from '../../../_baseGame/GameClientModels/SelfPlayerState';

export type UpdatableSelfPlayerStateModel = Readonly<SelfPlayerStateModel> & Updatable;
const SelfPlayer_Update = 'selfPlayerState.update';

function initDefault(): UpdatableSelfPlayerStateModel {
  return {
    shardID: 0,
    characterID: '',
    accountID: '',
    zoneID: '',
    entityID: '',
    controlledEntityID: '',
    facing: { pitch: 0, yaw: 0 },
    cameraFacing: { pitch: 0, yaw: 0 },
    viewOrigin: { x: 0, y: 0, z: 0 },

    respawn: (spawnLocationID?: string) => {},
    requestEnemyTarget: (entityID?: string) => {},
    requestFriendlyTarget: (entityID?: string) => {},

    // FSR-only.
    viewBearing: 0,

    // Updatable
    isReady: false,
    updateEventName: SelfPlayer_Update,
    onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, SelfPlayer_Update),
    onReady: (game: BaseGameInterface) => createDefaultOnReady(game, SelfPlayer_Update)
  };
}

let lastCharacterID = '-';

/**
 * Initialize this model with the game engine.
 */
export function initPlayerState(game: BaseGameInterface, hordetest: HordeTestModel) {
  hordetest._devGame._cse_dev_defaultSelfPlayerState = initDefault();
  if (typeof Proxy !== 'undefined') {
    hordetest._devGame.selfPlayerEntityState = {
      ...defaultPlayerEntityStateModel(),
      isReady: true,
      updateEventName: Entity_Updated,
      onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, Entity_Updated),
      onReady: (game: BaseGameInterface) => createDefaultOnReady(game, Entity_Updated)
    };
    hordetest._devGame.selfPlayerState = new Proxy(
      {
        isReady: true,
        updateEventName: SelfPlayer_Update,
        onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, SelfPlayer_Update),
        onReady: (game: BaseGameInterface) => createDefaultOnReady(game, SelfPlayer_Update)
      },
      {
        get: (obj, key) => {
          if (key in hordetest._devGame._cse_dev_selfPlayerState) {
            if (typeof hordetest._devGame._cse_dev_selfPlayerState[key] === 'function') {
              return function (...args: any[]) {
                return hordetest._devGame._cse_dev_selfPlayerState[key](...args);
              };
            }
            return hordetest._devGame._cse_dev_selfPlayerState[key];
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
        }
      }
    ) as UpdatableSelfPlayerStateModel;
  }

  engineInit(
    game,
    SelfPlayer_Update,
    () => ({} as any),
    () => hordetest._devGame._cse_dev_selfPlayerState,
    (model: SelfPlayerStateModel) => {
      if (
        model &&
        model.characterID &&
        lastCharacterID != model.characterID &&
        model.characterID.length > 1 &&
        lastCharacterID === ''
      ) {
        game.reloadUI();
      }

      lastCharacterID = model.characterID;
      hordetest._devGame._cse_dev_selfPlayerState = model as UpdatableSelfPlayerStateModel;
    }
  );
}
