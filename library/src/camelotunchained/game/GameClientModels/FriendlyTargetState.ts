/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defaultPlayerStateModel } from './EntityState';
import { createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/_Updatable';

import engineInit from '../../../_baseGame/GameClientModels/_Init';

declare global {
  type FriendlyTargetState = AnyEntityState;
  type ImmutableFriendlyTargetState = ImmutableEntityState;
}

export const FriendlyTarget_Update = 'friendlyTargetPlayerState.update';

function initDefault(): FriendlyTargetState {
  return {
    ...defaultPlayerStateModel(),

    position: { x: 0, y: 0, z: 0 },
    isReady: false,
    updateEventName: FriendlyTarget_Update,
    onUpdated: createDefaultOnUpdated(FriendlyTarget_Update),
    onReady: createDefaultOnReady(FriendlyTarget_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  engineInit(
    FriendlyTarget_Update,
    initDefault,
    () => camelotunchained._devGame.friendlyTargetState,
    (model: AnyEntityState) => {
      camelotunchained._devGame.friendlyTargetState = model as FriendlyTargetState;
    });

}
