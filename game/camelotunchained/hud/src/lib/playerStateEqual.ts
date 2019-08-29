/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { BodyParts } from './PlayerStatus';

export function isEqualPlayerState(a: Player, b: Player) {
  if (!a || !b) {
    return false;
  }

  if (a.entityID !== b.entityID) {
    return false;
  }

  if (a.isAlive !== b.isAlive) {
    return false;
  }

  if (!a.health && b.health || a.health && !b.health) {
    return false;
  }

  if (!a.blood && b.blood || a.blood && !b.blood) {
    return false;
  }

  if (!a.stamina && b.stamina || a.stamina && !b.stamina) {
    return false;
  }

  if (!a.statuses && b.statuses || a.statuses && !b.statuses) {
    return false;
  }

  if (a.blood) {
    if (!Math.floatEquals(a.blood.current, b.blood.current)) {
      return false;
    }

    if (!Math.floatEquals(a.blood.max, b.blood.max)) {
      return false;
    }
  }

  if (a.stamina) {
    if (!Math.floatEquals(a.stamina.current, b.stamina.current)) {
      return false;
    }

    if (!Math.floatEquals(a.stamina.max, b.stamina.max)) {
      return false;
    }
  }

  if (a.health) {
    for (let i = 0; i < BodyParts.Count; ++i) {
      if (a.health[i] && b.health[i]) {
        if (a.health[i].wounds !== b.health[i].wounds) {
          return false;
        }

        if (!Math.floatEquals(a.health[i].current, b.health[i].current)) {
          return false;
        }

        if (!Math.floatEquals(a.health[i].max, b.health[i].max)) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  if (a.statuses) {
    const aStatuses = Object.values(a.statuses).sort(statusSortMethod);
    const bStatuses = Object.values(b.statuses).sort(statusSortMethod);
    for (let i = 0; i < aStatuses.length; ++i) {
      if (aStatuses[i] !== bStatuses[i]) {
        return false;
      }
    }
  }

  return true;
}

function statusSortMethod(a: {id: number}, b: {id: number}) {
  return a.id - b.id;
}
