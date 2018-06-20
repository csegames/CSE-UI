/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { PlayerState } from '@csegames/camelot-unchained/lib/core/clientInterface';
import { numEqualsCloseEnough } from '@csegames/camelot-unchained/lib/utils';
import { GroupMemberState } from '@csegames/camelot-unchained/lib/webAPI/definitions';
import { BodyParts } from './PlayerStatus';

export function isEqualPlayerState(a: PlayerState | GroupMemberState, b: PlayerState | GroupMemberState) {
  if (!a || !b) {
    return false;
  }

  if (a.id !== b.id) {
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
    if (!numEqualsCloseEnough(a.blood.current, b.blood.current)) {
      return false;
    }

    if (!numEqualsCloseEnough(a.blood.max, b.blood.max)) {
      return false;
    }
  }

  if (a.stamina) {
    if (!numEqualsCloseEnough(a.stamina.current, b.stamina.current)) {
      return false;
    }

    if (!numEqualsCloseEnough(a.stamina.max, b.stamina.max)) {
      return false;
    }
  }

  if (a.health) {
    for (let i = 0; i < BodyParts.Count; ++i) {
      if (a.health[i].wounds !== b.health[i].wounds) {
        return false;
      }

      if (!numEqualsCloseEnough(a.health[i].current, b.health[i].current)) {
        return false;
      }

      if (!numEqualsCloseEnough(a.health[i].max, b.health[i].max)) {
        return false;
      }
    }
  }

  if (a.statuses) {
    if (a.statuses.length !== b.statuses.length) {
      return false;
    }

    const aStatuses = (a.statuses as { id: number }[]).sort(statusSortMethod);
    const bStatuses = (b.statuses as { id: number }[]).sort(statusSortMethod);
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
