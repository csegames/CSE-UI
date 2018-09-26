/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerStateModel, defaultPlayerStateModel } from './_EntityState';
import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';

import engineInit from './_Init';

type Vec3 = { x: number; y: number; z: number; };
/**
 * State data extension of PlayerStateModel for the Players enemy target
 */
export interface EnemyTargetPlayerStateModel extends PlayerStateModel {

  /**
   * Unique identification string for the player character.
   */
  characterID: string;

  /**
   * Indicates whether the player currently has an active friendly target.
   */
  isActive: boolean;

  /**
   * Players coordinates in world space.
   * NOTE: Only available during beta testing
   */
  position: Vec3;
}

export type EnemyTargetState = EnemyTargetPlayerStateModel & Updatable;

export const EnemyTarget_Update = 'enemyTargetPlayerState.update';

function initDefault(): EnemyTargetState {
  return {
    ...defaultPlayerStateModel(),

    characterID: '',
    isActive: false,
    position: { x: 0, y: 0, z: 0 },

    isReady: false,
    name: EnemyTarget_Update,
    onUpdated: createDefaultOnUpdated(EnemyTarget_Update),
    onReady: createDefaultOnReady(EnemyTarget_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  engineInit(
    EnemyTarget_Update,
    () => __devGame.enemyTargetState = initDefault(),
    () => game.enemyTargetState,
    (model: EnemyTargetPlayerStateModel) => __devGame.enemyTargetState = model as EnemyTargetState);

}
