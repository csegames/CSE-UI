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

export enum OwnershipStatus {
  Unowned,
  PartiallyOwned,
  FullyOwned
}

export interface PurchaseOwnershipData {
  status: OwnershipStatus;
  allUniquePerkIDs: string[];
  ownedUniquePerkIDs: string[];
}

export function getPurchaseOwnershipData(
  purchase: PurchaseDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): PurchaseOwnershipData {
  // Ownership status is based only on the "unique" items offered by a purchase.
  const allUniquePerkIds = purchase.perks
    .filter((perkReward) => {
      const perk = perksByID[perkReward.perkID];
      return perk?.isUnique;
    })
    .map((r) => r.perkID);

  const ownedUniquePerkIds = allUniquePerkIds.filter((perkId) => {
    return (ownedPerks[perkId] ?? 0) > 0;
  });

  let status: OwnershipStatus = OwnershipStatus.Unowned;
  if (ownedUniquePerkIds.length === 0) {
    status = OwnershipStatus.Unowned;
  } else if (ownedUniquePerkIds.length < allUniquePerkIds.length) {
    status = OwnershipStatus.PartiallyOwned;
  } else {
    status = OwnershipStatus.FullyOwned;
  }

  const data: PurchaseOwnershipData = {
    status,
    allUniquePerkIDs: allUniquePerkIds,
    ownedUniquePerkIDs: ownedUniquePerkIds
  };
  return data;
}

/** Checks if a particular purchase can be shown in the Store right now, */
export function isPurchaseable(
  purchase: PurchaseDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): boolean {
  // If all Unique perks in the purchase are already owned (skins, emotes, etc.), then the user cannot repurchase.
  const data = getPurchaseOwnershipData(purchase, perksByID, ownedPerks);
  if (data.status === OwnershipStatus.FullyOwned) {
    return false;
  }

  // Is the purchase locked for any reason?
  return arePurchaseLocksMatched(purchase.locks, ownedPerks);
}

export function isFreeReward(purchase: PurchaseDefGQL): boolean {
  return purchase.costs.length === 0 || purchase.costs[0].qty === 0;
}

export const BUX_PERK_ID = 'hard_currency';
