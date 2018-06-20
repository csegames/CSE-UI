/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { PlayerState, Faction, GroupMemberState } from '@csegames/camelot-unchained';
import { BodyParts } from '../../../lib/PlayerStatus';

export function getHealthPercent(playerState: PlayerState | GroupMemberState, bodyPart: BodyParts) {
  if (!playerState || !playerState.health || !playerState.health[bodyPart]) {
    return 0;
  }

  const bodyPartHealth = playerState.health[bodyPart];
  return (bodyPartHealth.current / bodyPartHealth.max) * 100;
}

export function getWoundsForBodyPart(playerState: PlayerState | GroupMemberState, bodyPart: BodyParts) {
  if (!playerState || !playerState.health || !playerState.health[bodyPart]) {
    return 0;
  }

  return playerState.health[bodyPart].wounds;
}

export function getBloodPercent(playerState: PlayerState | GroupMemberState) {
  if (!playerState || !playerState.blood) {
    return 0;
  }

  return (playerState.blood.current / playerState.blood.max) * 100;
}

export function getStaminaPercent(playerState: PlayerState | GroupMemberState) {
  if (!playerState || !playerState.stamina) {
    return 0;
  }

  return (playerState.stamina.current / playerState.stamina.max) * 100;
}

export function getFaction(playerState: PlayerState | GroupMemberState) {
  if (!playerState || !playerState.faction) {
    return Faction.Factionless;
  }

  return playerState.faction;
}
