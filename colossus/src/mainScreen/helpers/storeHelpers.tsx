/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  ProfileLockDefGQL,
  PurchaseDefGQL,
  PerkDefGQL,
  CostDefGQL,
  QuestGQL,
  ProgressionNodeDef,
  StringTableEntryDef,
  ChampionInfo,
  QuestDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { getTokenizedStringTableValue } from './stringTableHelpers';
import dateFormat from 'dateformat';

const StringIDLocksRequiredItem = 'LocksRequiredItem';
const StringIDLocksForbiddenItem = 'LocksForbiddenItem';
const StringIDLocksBeforeDate = 'LocksBeforeDate';
const StringIDLocksAfterDate = 'LocksAfterDate';
const StringIDLocksChampionQuestAtLevel = 'LocksChampionQuestAtLevel';
const StringIDLocksChampionQuestBeforeLevel = 'LocksChampionQuestBeforeLevel';
const StringIDLocksGenericQuestAtLevel = 'LocksGenericQuestAtLevel';
const StringIDLocksGenericQuestBeforeLevel = 'LocksGenericQuestBeforeLevel';
const StringIDLocksProgressionNodeActive = 'LocksProgressionNodeActive';
const StringIDLocksProgressionNodeInactive = 'LocksProgressionNodeInactive';

// The logic in this funtion should VERY closely match the logic in the server function LockHelpers.CheckLock
export function isLockFulfilled(
  lock: ProfileLockDefGQL,
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): boolean {
  const now = getServerTimeMS(serverTimeDeltaMS);

  if (lock.perkID && lock.perkID.length > 0) {
    const perkCount = ownedPerks[lock.perkID] ?? 0;
    if ((lock.invertConditions == false && perkCount == 0) || (lock.invertConditions && perkCount != 0)) {
      return false;
    }
  }

  if (lock.startTime && lock.startTime.length > 0) {
    const startTime = new Date(lock.startTime).getTime();
    if ((lock.invertConditions == false && now < startTime) || (lock.invertConditions == true && now >= startTime)) {
      return false;
    }
  }

  if (lock.endTime && lock.endTime.length > 0) {
    const endTime = new Date(lock.endTime).getTime();
    if ((lock.invertConditions == false && now > endTime) || (lock.invertConditions == true && now <= endTime)) {
      return false;
    }
  }

  if (lock.questID && lock.questID.length > 0) {
    const questLevel = (quests.find((q) => q.id == lock.questID)?.currentQuestIndex ?? 0) + 1;
    if (
      (lock.invertConditions == false && questLevel < lock.questLevel) ||
      (lock.invertConditions == true && questLevel >= lock.questLevel)
    ) {
      return false;
    }
  }

  if (lock.progressionNodeID && lock.progressionNodeID.length > 0) {
    const hasNode = progressionNodes.includes(lock.progressionNodeID);

    if ((lock.invertConditions == false && hasNode == false) || (lock.invertConditions == true && hasNode == true)) {
      return false;
    }
  }

  return true;
}

export function areLocksFulfilled(
  locks: ProfileLockDefGQL[],
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): boolean {
  for (var i = 0; i < locks.length; ++i) {
    const lock = locks[i];
    if (!isLockFulfilled(lock, ownedPerks, progressionNodes, quests, serverTimeDeltaMS)) {
      return false;
    }
  }

  return true;
}

export function getLockDescription(
  lock: ProfileLockDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  questsById: Dictionary<QuestDefGQL>,
  champions: ChampionInfo[],
  progressionNodeDefsByID: Dictionary<ProgressionNodeDef>,
  stringTable: Dictionary<StringTableEntryDef>
): string {
  if (lock.perkID && lock.perkID.length > 0) {
    // This lock requires either that you do or don't have a particular perk.
    const perk = perksByID[lock.perkID];
    return getTokenizedStringTableValue(
      lock.invertConditions ? StringIDLocksForbiddenItem : StringIDLocksRequiredItem,
      stringTable,
      { ITEM: perk.name }
    );
  }

  if (lock.startTime && lock.startTime.length > 0) {
    // This lock requires either that you are before or after a particular time.
    const start = new Date(lock.startTime);
    return getTokenizedStringTableValue(
      lock.invertConditions ? StringIDLocksBeforeDate : StringIDLocksAfterDate,
      stringTable,
      { DATE: dateFormat(start, 'h:MM TT mmmm d, yyyy') }
    );
  }

  if (lock.endTime && lock.endTime.length > 0) {
    // This lock requires either that you are before or after a particular time.
    const end = new Date(lock.endTime);
    return getTokenizedStringTableValue(
      lock.invertConditions ? StringIDLocksAfterDate : StringIDLocksBeforeDate,
      stringTable,
      { DATE: dateFormat(end, 'h:MM TT mmmm d, yyyy') }
    );
  }

  if (lock.questID && lock.questID.length > 0) {
    // This lock requires you to be at or before a certain step in a particular quest chain.
    // Different text for champion quests.
    const isChampionQuest = !!champions.find((c) => c.id === lock.questID);

    let stringID: string;
    let NAME: string;
    if (isChampionQuest) {
      stringID = lock.invertConditions ? StringIDLocksChampionQuestBeforeLevel : StringIDLocksChampionQuestAtLevel;
      NAME = champions.find((c) => c.id === lock.questID)?.name ?? '';
    } else {
      const questDef = questsById[lock.questID];
      stringID = lock.invertConditions ? StringIDLocksGenericQuestBeforeLevel : StringIDLocksGenericQuestAtLevel;
      NAME = questDef?.name ?? lock.questID;
    }

    return getTokenizedStringTableValue(stringID, stringTable, { LEVEL: lock.questLevel.toString(), NAME });
  }

  if (lock.progressionNodeID && lock.progressionNodeID.length > 0) {
    // This lock required either that you do or don't have a particular progression node active.
    const node = progressionNodeDefsByID[lock.progressionNodeID];
    return getTokenizedStringTableValue(
      lock.invertConditions ? StringIDLocksProgressionNodeInactive : StringIDLocksProgressionNodeActive,
      stringTable,
      { NAME: node.name }
    );
  }

  console.error(`Found undisplayable Lock`, lock);
  return '';
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
  hasBundleDiscount: boolean;
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

  const ownedUniquePerkIDs = allUniquePerkIds.filter((perkId) => {
    return (ownedPerks[perkId] ?? 0) > 0;
  });

  let status: OwnershipStatus = OwnershipStatus.Unowned;
  if (ownedUniquePerkIDs.length === 0) {
    status = OwnershipStatus.Unowned;
  } else if (ownedUniquePerkIDs.length < allUniquePerkIds.length) {
    status = OwnershipStatus.PartiallyOwned;
  } else {
    status = OwnershipStatus.FullyOwned;
  }

  const hasBundleDiscount =
    status === OwnershipStatus.PartiallyOwned &&
    !!ownedUniquePerkIDs.find((perkID) => {
      const ownedPerkReward = purchase.perks.find((reward) => reward.perkID === perkID);
      return ownedPerkReward.bundleDiscountPerkQty > 0;
    });

  const data: PurchaseOwnershipData = {
    status,
    allUniquePerkIDs: allUniquePerkIds,
    ownedUniquePerkIDs: ownedUniquePerkIDs,
    hasBundleDiscount
  };
  return data;
}

/** Checks if a particular purchase can be shown in the Store right now, */
export function isPurchaseable(
  purchase: PurchaseDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): boolean {
  // If all Unique perks in the purchase are already owned (skins, emotes, etc.), then the user cannot repurchase.
  const data = getPurchaseOwnershipData(purchase, perksByID, ownedPerks);
  if (data.status === OwnershipStatus.FullyOwned) {
    return false;
  }

  // Is the purchase locked for any reason?
  return areLocksFulfilled(purchase.locks, ownedPerks, progressionNodes, quests, serverTimeDeltaMS);
}

export function isFreeReward(purchase: PurchaseDefGQL): boolean {
  return purchase.costs.length === 0 || purchase.costs[0].qty === 0;
}

export function getFinalPurchaseCost(
  purchase: PurchaseDefGQL,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): CostDefGQL[] {
  // Only bundles have discounts (for when you already own part of the bundle), so if this isn't a bundle,
  // the final cost will be the original cost.
  if (purchase.perks.length === 1) {
    return purchase.costs;
  }

  // Bundle discounts are granted for unique, pre-owned items.
  const discounts: Dictionary<number> = {};
  purchase.perks.forEach((reward) => {
    if (reward.bundleDiscountPerkQty > 0) {
      const perk = perksByID[reward.perkID];
      if (perk.isUnique && ownedPerks[reward.perkID] > 0) {
        discounts[reward.bundleDiscountPerkID] =
          (discounts[reward.bundleDiscountPerkID] ?? 0) + reward.bundleDiscountPerkQty;
      }
    }
  });

  // Cloning the original costs so we can decrement them.
  const finalCosts: CostDefGQL[] = purchase.costs.map((c) => {
    const cost: CostDefGQL = { perkID: c.perkID, qty: Math.max(0, c.qty - (discounts[c.perkID] ?? 0)) };
    return cost;
  });

  return finalCosts;
}

export const BUX_PERK_ID = 'hard_currency';
