/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Vec3f } from '../types/localDefinitions';

// All GameClientModels files should purely provide the correct interface for the objects
// that the associated client event passes to the UI.  The correct fields can be identified
// by looking at CoherentBind() function of the corresponding C++ type, usually in UIBindings.cpp

export type Facing2fDegrees = {
  yaw: number;
  pitch: number;
};

export interface SelfPlayerStateModel {
  accountID: string;
  characterID: string;
  zoneID: string;
  entityID: string;
  controlledEntityID: string;
  facing: Facing2fDegrees;
  cameraFacing: Facing2fDegrees;
  viewOrigin: Vec3f;
  viewBearing: number;

  /**
   * Request to respawn at a specific location if a spawnLocationID is provided.
   * This method will only respawn the player if they are in a respawnable state, eg. dead
   * @param {String - optional} spawnLocationID The identifier for a spawn location.
   */
  respawn: (spawnLocationID?: string) => void;

  /**
   * Request the client target an entityID as a friendly target
   * @param {String} entityID Hex entityID of a friendly entity to target
   */
  requestFriendlyTarget: (entityID: string) => void;

  /**
   * Request the client target an entityID as an enemy target
   * @param {String} entityID Hex entityID of a enemy entity to target
   */
  requestEnemyTarget: (entityID: string) => void;
}
