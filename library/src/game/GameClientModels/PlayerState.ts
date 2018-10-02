/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerStateModel, defaultPlayerStateModel } from './_EntityState';
import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';

import engineInit from './_Init';

export const SelfPlayer_Update = 'selfPlayerState.update';

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
   * Identifer of the zone the player is in
   */
  zoneID: string;

  /**
   * Request to respawn at a specific location if a spawnLocationID is provided.
   * This method will only respawn the player if they are in a respawnable state, eg. dead
   * @param {String - optional} spawnLocationID The identifier for a spawn location.
   */
  respawn: (spawnLocationID?: string) => void;

  /**
   * Attempts to unstuck the player character by resetting the entity position to the default spawn point
   */
  stuck: () => void;

  /**
   * Request the player switch to a  new zone
   * @param {Number} zoneID Identifer of the zone to change to
   */
  changeZone: (zoneID: number) => void;

  /**
   * Request to equip an item.
   * @param {String} itemID The id of the item to equip.
   */
  equipItem: (itemID: string) => void;

  /**
   * Request to unequip an item.
   * @param {String} itemID The id of the item to unequip.
   */
  unequipItem: (itemID: string) => void;

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

export type SelfPlayerState = SelfPlayerStateModel & Updatable;


function noOp(...args: any[]): any {}

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
    zoneID: 'unknown',

    respawn: noOp,
    stuck: noOp,
    changeZone: noOp,
    equipItem: noOp,
    unequipItem: noOp,

    requestFriendlyTarget: noOp,
    requestEnemyTarget: noOp,

    // Updatable
    isReady: false,
    _name: SelfPlayer_Update,
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
    () => _devGame.selfPlayerState = initDefault(),
    () => game.selfPlayerState,
    (model: SelfPlayerStateModel) => _devGame.selfPlayerState = model as SelfPlayerState);

}
