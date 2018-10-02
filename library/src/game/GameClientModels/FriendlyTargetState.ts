/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerStateModel, defaultPlayerStateModel, SiegeStateModel } from './_EntityState';
import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';

import engineInit from './_Init';

type Vec3 = { x: number; y: number; z: number; };
/**
 * State data extension of PlayerStateModel for the Players friendly target
 */
export interface FriendlyTargetPlayerStateModel extends PlayerStateModel {

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

export type FriendlyTargetState = (FriendlyTargetPlayerStateModel | SiegeStateModel) & Updatable;

export const FriendlyTarget_Update = 'friendlyTargetPlayerState.update';

function initDefault(): FriendlyTargetState {
  return {
    ...defaultPlayerStateModel(),

    characterID: '',
    isActive: false,
    position: { x: 0, y: 0, z: 0 },

    isReady: false,
    _name: FriendlyTarget_Update,
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
    () => _devGame.friendlyTargetState = initDefault(),
    () => game.friendlyTargetState,
    (model: FriendlyTargetPlayerStateModel) => _devGame.friendlyTargetState = model as FriendlyTargetState);

}
