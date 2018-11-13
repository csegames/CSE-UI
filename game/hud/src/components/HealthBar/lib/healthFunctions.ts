/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { BodyParts } from 'lib/PlayerStatus';

export function getHealthPercent(playerState: Player, bodyPart: BodyParts) {
  if (!playerState || !playerState.health || !playerState.health[bodyPart]) {
    return 0;
  }

  const bodyPartHealth = playerState.health[bodyPart];
  return (bodyPartHealth.current / bodyPartHealth.max) * 100;
}

export function getWoundsForBodyPart(playerState: Player, bodyPart: BodyParts) {
  if (!playerState || !playerState.health || !playerState.health[bodyPart]) {
    return 0;
  }

  return playerState.health[bodyPart].wounds;
}

export function getBloodPercent(playerState: Player) {
  if (isPlayer(playerState)) {
    if (playerState) {
      if (!playerState || !playerState.blood) {
        return 0;
      }
    }
    return (playerState.blood.current / playerState.blood.max) * 100;
  } else {
    return 0;
  }
}

export function getCurrentStamina(playerState: Player) {
  if (isPlayer(playerState)) {
    return playerState.stamina.current;
  } else {
    return 0;
  }
}

export function getStaminaPercent(playerState: Player) {
  if (isPlayer(playerState)) {
    if (!playerState || !playerState.stamina) {
      return 0;
    }
    return (playerState.stamina.current / playerState.stamina.max) * 100;
  } else {
    return 0;
  }
}

export function getFaction(playerState: Entity) {
  if (!playerState || !playerState.faction) {
    return Faction.Factionless;
  }

  return playerState.faction;
}

export function getBodyPartsCurrentHealth(playerState: Entity) {
  if (isPlayer(playerState)) {
    return Object.values(playerState.health).map(h => h.current);
  } else if (isSiege(playerState)) {
    return [playerState.health.current];
  }
}
