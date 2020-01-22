/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StatusContextState } from 'context/StatusContext';

export function findBlockingStatuses(statuses: ArrayMap<Status>, statusContext: StatusContextState) {
  return Object.values(statuses).filter((s) => {
    const statusDef = statusContext.statusDefs.find(def => def.numericID === s.id);
    if (!statusDef || !statusDef.blocksAbilities) {
      return false;
    }

    return true;
  });
}

export function findMostBlockingStatus(blockingStatuses: Status[]) {
  // A player can have multiple blocking statuses applied to them at a given time ex) You're stunned and frozen
  // Find the status with the most amount of time left to show in the UI
  return blockingStatuses.sort((a, b) => {
    const remainingDurationA = getStatusRemainingDuration(a.duration, a.startTime);
    const remainingDurationB = getStatusRemainingDuration(b.duration, b.startTime);
    return remainingDurationB - remainingDurationA;
  })[0];
}

export function getStatusRemainingDuration(fullDuration: number, startTime: number) {
  return fullDuration - (game.worldTime - startTime);
}
