/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as _ from 'lodash';
import { utils, PlayerState } from '@csegames/camelot-unchained';
import { getStaminaPercent, getHealthPercent, getBloodPercent } from '../components/HealthBar/lib/healthFunctions';
import { BodyParts } from './PlayerStatus';

export function isEqualPlayerState(playerStateOne: PlayerState, playerStateTwo: PlayerState) {
  if (!playerStateOne || !playerStateTwo) {
    return false;
  }

  const headHealthEqual = playerStateOne.health[BodyParts.Head] && playerStateTwo.health[BodyParts.Head] ?
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.Head),
      getHealthPercent(playerStateTwo, BodyParts.Head),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.health[BodyParts.Head].max,
      playerStateTwo.health[BodyParts.Head].max,
    ) : false;

  const torsoHealthEqual = playerStateOne.health[BodyParts.Torso] && playerStateTwo.health[BodyParts.Torso] &&
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.Torso),
      getHealthPercent(playerStateTwo, BodyParts.Torso),
    ) &&
    utils.numEqualsCloseEnough(playerStateOne.health[BodyParts.Torso].max, playerStateTwo.health[BodyParts.Torso].max);

  const rightArmHealthEqual = playerStateOne.health[BodyParts.RightArm] && playerStateTwo.health[BodyParts.RightArm] &&
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.RightArm),
      getHealthPercent(playerStateTwo, BodyParts.RightArm),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.health[BodyParts.RightArm].max,
      playerStateTwo.health[BodyParts.RightArm].max,
    );

  const leftArmHealthEqual = playerStateOne.health[BodyParts.LeftArm] && playerStateTwo.health[BodyParts.LeftArm] &&
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.LeftArm),
      getHealthPercent(playerStateTwo, BodyParts.LeftArm),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.health[BodyParts.LeftArm].max,
      playerStateTwo.health[BodyParts.LeftArm].max,
    );

  const rightLegHealthEqual = playerStateOne.health[BodyParts.RightLeg] && playerStateTwo.health[BodyParts.RightLeg] &&
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.RightLeg),
      getHealthPercent(playerStateTwo, BodyParts.RightLeg),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.health[BodyParts.RightLeg].max,
      playerStateTwo.health[BodyParts.RightLeg].max,
    );

  const leftLegHealthEqual = playerStateOne.health[BodyParts.LeftLeg] && playerStateTwo.health[BodyParts.LeftLeg] &&
    utils.numEqualsCloseEnough(
      getHealthPercent(playerStateOne, BodyParts.LeftLeg),
      getHealthPercent(playerStateTwo, BodyParts.LeftLeg),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.health[BodyParts.LeftLeg].max,
      playerStateTwo.health[BodyParts.LeftLeg].max,
    );

  const staminaEqual = playerStateOne.stamina && playerStateTwo.stamina &&
    utils.numEqualsCloseEnough(
      getStaminaPercent(playerStateOne),
      getStaminaPercent(playerStateTwo),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.stamina.max,
      playerStateTwo.stamina.max,
    );

  const bloodEqual = playerStateOne.blood && playerStateTwo.blood &&
    utils.numEqualsCloseEnough(
      getBloodPercent(playerStateOne),
      getBloodPercent(playerStateTwo),
    ) &&
    utils.numEqualsCloseEnough(
      playerStateOne.blood.max,
      playerStateTwo.blood.max,
    );

  const playerStateDoesEqual = playerStateOne.id === playerStateTwo.id &&
    // Check current health
    headHealthEqual && torsoHealthEqual && rightArmHealthEqual && leftArmHealthEqual && rightLegHealthEqual &&
      leftLegHealthEqual && staminaEqual && bloodEqual &&

      // Check status changes
      isEqualStatusEffects(playerStateOne, playerStateTwo) &&

      // Check if is alive
      playerStateOne.isAlive === playerStateTwo.isAlive;

  return playerStateDoesEqual;
}

export function isEqualStatusEffects(playerStateOne: PlayerState, playerStateTwo: PlayerState) {
  if (!playerStateOne.statuses || !playerStateTwo.statuses) {
    return false;
  }

  const pOneStatusIds = _.sortBy(playerStateOne.statuses.map(status => status.id), id => id);
  const pTwoStatusIds = _.sortBy(playerStateTwo.statuses.map(status => status.id), id => id);
  return playerStateOne.statuses.length === playerStateTwo.statuses.length ||
    _.isEqual(pOneStatusIds, pTwoStatusIds);
}
