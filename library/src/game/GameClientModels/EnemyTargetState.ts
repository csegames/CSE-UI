/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultPlayerStateModel } from './EntityState';
import { createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';

import engineInit from './_Init';

declare global {
  type EnemyTargetState = AnyEntityState &
  {
    /**
     * Indicates whether the player currently has an active friendly target.
     */
    isActive: boolean;
  };
}

export const EnemyTarget_Update = 'enemyTargetPlayerState.update';

function initDefault(): EnemyTargetState {
  return {
    ...defaultPlayerStateModel(),

    characterID: '',
    isActive: false,
    position: { x: 0, y: 0, z: 0 },

    isReady: false,
    updateEventName: EnemyTarget_Update,
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
    () => _devGame.enemyTargetState = initDefault(),
    () => game.enemyTargetState,
    (model: AnyEntityState) => {
      _devGame.enemyTargetState = model as EnemyTargetState;
      _devGame.enemyTargetState.isActive = model.entityID.length > 0;
    });

}
