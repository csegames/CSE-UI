/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultPlayerStateModel } from './EntityState';
import { createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/_Updatable';

import engineInit from '../../../_baseGame/GameClientModels/_Init';

declare global {
  type EnemyTargetState = AnyEntityState;
  type ImmutableEnemyTargetState = ImmutableEntityState;
}

export const EnemyTarget_Update = 'enemyTargetPlayerState.update';

function initDefault(): EnemyTargetState {
  return {
    ...defaultPlayerStateModel(),

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
    initDefault,
    () => camelotunchained._devGame.enemyTargetState,
    (model: AnyEntityState) => {
      camelotunchained._devGame.enemyTargetState = model as EnemyTargetState;
    });

}
