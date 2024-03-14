/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProfileLockDefGQL, PurchaseDefGQL, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

export function arePurchaseLocksMatched(locks: ProfileLockDefGQL[], ownedPerks: Dictionary<number>): boolean {
  const now = new Date().getTime();

  const startLock = locks.find((p) => {
    return p.startTime && p.startTime.length > 0;
  });
  const endLock = locks.find((p) => {
    return p.endTime && p.endTime.length > 0;
  });
  const perkLocks = locks.filter((p) => {
    return p.perkID;
  });

  // Is the date valid?
  const isAfterStartDate =
    startLock == undefined || (startLock.startTime && new Date(startLock.startTime).getTime() <= now);
  const isBeforeEndDate = endLock == undefined || (endLock.endTime && new Date(endLock.endTime).getTime() >= now);

  // Do we have all prerequisite items?
  const matchesPerkLocks =
    perkLocks.filter((lock) => {
      return ownedPerks[lock.perkID] && ownedPerks[lock.perkID] > 0;
    }).length === perkLocks.length;

  return isAfterStartDate && isBeforeEndDate && matchesPerkLocks;
}

/** Checks if a particular purchase can be shown in the Store right now, */
export function isPurchaseable(
  purchase: PurchaseDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): boolean {
  // If any perk in the purchase is Unique and already owned, then the user cannot repurchase.
  const partiallyOwned =
    purchase.perks.find((perkReward) => {
      const perk = perksByID[perkReward.perkID];
      return perk.isUnique && ownedPerks[perk.id] && ownedPerks[perk.id] > 0;
    }) !== undefined;

  if (partiallyOwned) {
    return false;
  }

  // Is the purchase locked for any reason?
  return arePurchaseLocksMatched(purchase.locks, ownedPerks);
}

export function isFreeReward(purchase: PurchaseDefGQL): boolean {
  return purchase.costs.length === 0 || purchase.costs[0].qty === 0;
}

export const BUX_PERK_ID = 'hard_currency';
