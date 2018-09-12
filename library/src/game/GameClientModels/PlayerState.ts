/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerStateModel, defaultPlayerStateModel } from './_EntityState';
import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';

import engineInit from './_Init';

/**
 * State data extension of PlayerStateModel for the player
 */
export interface SelfPlayerStateModel extends PlayerStateModel {

  /**
   * Unique identification string for the player character.
   */
  characterID: string;

  /**
   * Players coordinates in world space according to the server.
   */
  serverPosition: Vec3F;

  /**
   * Players facing direction in radians?.
   */
  facing: number;

  /**
   * Players velocity.
   */
  velocity: Vec3F;

  /**
   * Players speed in meters / second.
   */
  speed: number;

  /**
   * Players speed in x & z direction only, in meters / second.
   */
  horizontalSpeed: number;

  /**
   * The angle between the collision object and a vector pointing straight down from the Player origin
   */
  downCollisionAngle: number;
  terrainCollisionAngle: number;

  /**
   * Request to respawn at a specific location if a spawnLocationID is provided.
   * This method will only respawn the player if they are in a respawnable state, eg. dead
   * @param {String - optional} spawnLocationID The identifier for a spawn location.
   */
  readonly respawn: (spawnLocationID?: string) => void;

  /**
   * Request to equip an item.
   * @param {String} itemID The id of the item to equip.
   */
  readonly equipItem: (itemID: string) => void;

  /**
   * Request to unequip an item.
   * @param {String} itemID The id of the item to unequip.
   */
  readonly unequipItem: (itemID: string) => void;
}

export type SelfPlayerState = SelfPlayerStateModel & Updatable;

export const SelfPlayer_Update = 'selfPlayerState.update';

function noOp(...args: any[]) {}

function initDefault(): SelfPlayerState {
  return {
    ...defaultPlayerStateModel(),

    characterID: '',
    serverPosition: { x: 0, y: 0, z: 0 },
    facing: 0,
    velocity: { x: 0, y: 0, z: 0 },
    speed: 0,
    horizontalSpeed: 0,
    downCollisionAngle: 0,
    terrainCollisionAngle: 0,

    respawn: noOp,
    equipItem: noOp,
    unequipItem: noOp,

    isReady: false,
    name: SelfPlayer_Update,
    onUpdated: createDefaultOnUpdated(SelfPlayer_Update),
    onReady: createDefaultOnReady(SelfPlayer_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  engineInit(
    SelfPlayer_Update,
    () => __devGame.selfPlayerState = initDefault(),
    () => game.selfPlayerState,
    (model: SelfPlayerStateModel) => __devGame.selfPlayerState = model as SelfPlayerState);

}
