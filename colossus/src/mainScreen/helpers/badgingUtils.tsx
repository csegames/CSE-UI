/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  ChampionInfo,
  PerkDefGQL,
  PerkGQL,
  PerkType,
  ProgressionNodeDef,
  PurchaseDefGQL,
  QuestDefGQL,
  QuestGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { isChampionPendingLevelUp, isPerkUnseen } from './characterHelpers';
import { isChampionEquipmentPerk } from './perkUtils';
import { game } from '@csegames/library/dist/_baseGame';
import { ExplanationBuilder, ExplainedValue } from '@csegames/library/dist/_baseGame/types/ExplainedValue';
import { isFreeReward, isPurchaseable } from './storeHelpers';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { getAllPendingBattlePassRewards } from '../components/views/Lobby/BattlePass/BattlePassUtils';
import { QuestsByType } from '../redux/questSlice';
import { getProgressionNodeStatus } from '../components/overlays/Progression/ProgressionNodeDisplay';
import { Overlay, OverlayInstance } from '../redux/navigationSlice';
import { Dispatch } from '@reduxjs/toolkit';
import {
  updateSeenProgressionNodesForChampion,
  updateUnseenUnlockedProgressionNodesForChampion
} from '../redux/profileSlice';

export function isBadgeRelatedPerk(perk: PerkDefGQL, champions: ChampionInfo[]): boolean {
  // No perk, no badges.
  if (!perk) {
    return false;
  }

  // Equipment perks cause badging on the champion page.
  if (isChampionEquipmentPerk(perk.perkType)) {
    return true;
  }

  // RuneTierKeys cause badging on the champion page.
  if (perk.perkType === PerkType.RuneModTierKey) {
    return true;
  }

  // RuneKeys cause badging on the champion page.
  if (!!champions.find((c) => c.runeModUnlockCurrencyID === perk.id)) {
    return true;
  }

  return false;
}

export function getIsBadgedForUnseenRuneKeys(
  champion: ChampionInfo,
  newEquipment: Dictionary<boolean>,
  ownedPerks: Dictionary<number>,
  perksByID: Dictionary<PerkDefGQL>
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Unseen Rune Keys - ${champion.name}`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);

  // Is this champion's RuneKey in the "unseen" items list?
  const hasUnseenRuneKey = isPerkUnseen(champion.runeModUnlockCurrencyID, newEquipment, ownedPerks);
  builder.addRow(`\xa0\xa0Unseen RuneKey detected? ${hasUnseenRuneKey}`);

  // Is one of this champion's RuneTierKeys in the "unseen" items list?
  const hasUnseenRuneTierKey =
    Object.keys(newEquipment).find((perkID) => {
      const perk = perksByID[perkID];
      if (perk.perkType === PerkType.RuneModTierKey && perk.champion.id === champion.id) {
        return true;
      }
    })?.length > 0;
  builder.addRow(`\xa0\xa0Unseen RuneTierKey detected? ${hasUnseenRuneTierKey}`);

  builder.setValue(hasUnseenRuneKey || hasUnseenRuneTierKey);
  return builder.getExplainedValue();
}

export function getIsBadgedForUnseenChampionEquipment(
  champion: ChampionInfo,
  champions: ChampionInfo[],
  perkTypeFilter: PerkType,
  newEquipment: Dictionary<boolean>,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Unseen Equipment - ${champion.name}`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);

  const unseenPerks = Object.keys(newEquipment).filter((perkID) => {
    // Does the perk exist?
    const matchingPerk = perksByID[perkID];
    if (!matchingPerk) {
      return false;
    }

    // If we're filtering perk types, then make sure this perk matches the filter.
    if (perkTypeFilter != PerkType.Invalid && perkTypeFilter != matchingPerk.perkType) {
      return;
    }

    // Is the perk of a type that we badge for?
    if (!isBadgeRelatedPerk(matchingPerk, champions)) {
      return false;
    }

    // Does the champion match?
    if (matchingPerk.champion && champion.id !== matchingPerk.champion.id) {
      return false;
    }

    // If the user doesn't have the item, it doesn't count as new (maybe they sold it before looking at it).
    // We clean this case up more permanently in storeNetworking.tsx, initializeUnseenEquipment().
    if (ownedPerks[perkID] === undefined || ownedPerks[perkID] < 1) {
      return false;
    }

    return true;
  });
  const hasUnseenEquipment = unseenPerks.length > 0;
  builder.addRow(`\xa0\xa0Unseen Equipment detected? ${hasUnseenEquipment}`);
  unseenPerks.forEach((perkID) => {
    builder.addRow(`\xa0\xa0\xa0\xa0${perkID}`);
  });

  builder.setValue(hasUnseenEquipment);
  return builder.getExplainedValue();
}

export function getIsBadgedForChampionSelect(
  champion: ChampionInfo,
  champions: ChampionInfo[],
  newEquipment: Dictionary<boolean>,
  ownedPerks: Dictionary<number>,
  perksByID: Dictionary<PerkDefGQL>,
  quests: QuestGQL[]
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Champion Select - ${champion.name}`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);
  // ChampionSelect is badged for a champion if any of the champion sub-parts are badged.

  // Does this champion have unacknowledged level-up rewards to claim?
  // This can happen if the user doesn't see the MatchSummary screen (crashes mid-match, etc.).
  const isPendingLevelUp = isChampionPendingLevelUp(champion, quests);
  builder.addRow(`\xa0\xa0Is pending level up? ${isPendingLevelUp}`);

  // Progression sub-badge.
  const isBadgedForProgressionEV = getIsBadgedForChampionProgression(champion);
  builder.addRow(isBadgedForProgressionEV);

  // RuneMods sub-badge.
  const isBadgedForUnseenRuneKeysEV = getIsBadgedForUnseenRuneKeys(champion, newEquipment, ownedPerks, perksByID);
  builder.addRow(isBadgedForUnseenRuneKeysEV);

  // Champion equipment / cosmetics sub-badge.
  const isBadgedForUnseenChampionEquipmentEV = getIsBadgedForUnseenChampionEquipment(
    champion,
    champions,
    PerkType.Invalid, // Means we check for unseen equipment of ANY approved perkType.
    newEquipment,
    perksByID,
    ownedPerks
  );
  builder.addRow(isBadgedForUnseenChampionEquipmentEV);

  builder.setValue(
    isPendingLevelUp ||
      isBadgedForUnseenRuneKeysEV.value ||
      isBadgedForUnseenChampionEquipmentEV.value ||
      isBadgedForProgressionEV.value
  );
  return builder.getExplainedValue();
}

export function getIsBadgedForAnyChampion(
  champions: ChampionInfo[],
  newEquipment: Dictionary<boolean>,
  ownedPerks: Dictionary<number>,
  perksByID: Dictionary<PerkDefGQL>,
  quests: QuestGQL[]
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Champion Select`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);
  // Is any champion badged because of sub-badges in ChampionSelect?
  let hasAnySubBadges: boolean = false;
  for (let champion of champions) {
    const isBadgedForChampionSelectEV = getIsBadgedForChampionSelect(
      champion,
      champions,
      newEquipment,
      ownedPerks,
      perksByID,
      quests
    );
    builder.addRow(isBadgedForChampionSelectEV);
    hasAnySubBadges = hasAnySubBadges || isBadgedForChampionSelectEV.value;
  }

  builder.setValue(hasAnySubBadges);
  return builder.getExplainedValue();
}

export function getIsBadgedForStore(
  purchases: PurchaseDefGQL[],
  newPurchases: Dictionary<boolean>,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Store`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);

  // If there are any unclaimed rewards, badge the store tab.
  const unclaimedRewards = purchases.filter((purchase) => {
    return (
      isFreeReward(purchase) &&
      isPurchaseable(purchase, perksByID, ownedPerks, progressionNodes, quests, serverTimeDeltaMS)
    );
  });
  const hasUnclaimedRewards = unclaimedRewards.length > 0;
  builder.addRow(`\xa0\xa0Has unclaimed Rewards? ${hasUnclaimedRewards}`);
  if (hasUnclaimedRewards) {
    unclaimedRewards.forEach((purchase) => {
      builder.addRow(`\xa0\xa0\xa0\xa0${purchase.id}`);
    });
  }

  // If there are any unlocked "new" purchaseables in the Store, badge the store tab.
  const unseenPurchaseableIDs = Object.keys(newPurchases).filter((newPurchaseID) => {
    const purchase = purchases.find((p) => p.id === newPurchaseID);
    // We're only interested in "new" purchases that exist and can be shown to the user in the Store.
    return !!purchase && isPurchaseable(purchase, perksByID, ownedPerks, progressionNodes, quests, serverTimeDeltaMS);
  });
  const hasUnseenPurchaseables = unclaimedRewards.length > 0;
  builder.addRow(`\xa0\xa0Has unseen purchaseables? ${hasUnseenPurchaseables}`);
  if (hasUnseenPurchaseables) {
    unseenPurchaseableIDs.forEach((purchaseID) => {
      builder.addRow(`\xa0\xa0\xa0\xa0${purchaseID}`);
    });
  }

  builder.setValue(hasUnclaimedRewards || hasUnseenPurchaseables);
  return builder.getExplainedValue();
}

export function getIsBadgedForBattlePass(
  currentBattlePass: QuestDefGQL,
  questDefs: QuestsByType,
  perks: PerkGQL[],
  quests: QuestGQL[]
): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(`Battle Pass`, false, !game.isPublicBuild);
  builder.addRow(`TRUE if any of the following are true`);

  // If there is a new, unseen-as-of-yet BattlePass, badge it!
  const hasUnseenBattlePass = clientAPI.getLastSeenBattlePassID() === currentBattlePass?.id;
  builder.addRow(`\xa0\xa0Has active unseen BattlePass? ${hasUnseenBattlePass}`);
  if (hasUnseenBattlePass) {
    builder.addRow(`\xa0\xa0\xa0\xa0${currentBattlePass.id}`);
  }

  // If there are unclaimed rewards, we need a badge.
  const pendingBattlePassRewards = getAllPendingBattlePassRewards(questDefs?.BattlePass, perks, quests);
  const hasPendingBattlePassRewards = pendingBattlePassRewards?.length > 0;
  builder.addRow(`\xa0\xa0Has unclaimed BattlePass rewards? ${hasPendingBattlePassRewards}`);
  if (hasPendingBattlePassRewards) {
    pendingBattlePassRewards.forEach((reward) => {
      builder.addRow(`\xa0\xa0\xa0\xa0${reward.qty}× ${reward.perkID}`);
    });
  }

  builder.setValue(hasUnseenBattlePass || hasPendingBattlePassRewards);
  return builder.getExplainedValue();
}

export function getIsBadgedForChampionProgression(champion: ChampionInfo): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(
    `Champion Progression - ${champion.name}`,
    false,
    !game.isPublicBuild
  );
  builder.addRow(`TRUE if any of the following are true`);

  const unseenNodesEV = getIsBadgedForUnseenProgressionNodes(champion);
  builder.addRow(unseenNodesEV);

  builder.setValue(unseenNodesEV.value);
  return builder.getExplainedValue();
}

/** Returns the ids of any ProgressionNodeDefs that have become available for purchase since the ProgressionTree was last viewed. */
export function detectNewProgressionNodeUnlocks(
  progressionNodeDefsByChampionID: Dictionary<ProgressionNodeDef[]>,
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number,
  overlays: OverlayInstance[],
  dispatch: Dispatch
): void {
  // If we're already on the ProgressionTree page, we don't need to badge anything (for when the
  // user unlocks nodes by activating other nodes).
  const isOnTree = overlays.find((o) => o.data === Overlay.ProgressionTree);

  // For each champion...
  Object.keys(progressionNodeDefsByChampionID).forEach((championID) => {
    // Check which nodes are currently "available".
    const defs = progressionNodeDefsByChampionID[championID] ?? [];
    const availableNodeIDs = defs
      .filter((def) => {
        const status = getProgressionNodeStatus(def, ownedPerks, progressionNodes, quests, serverTimeDeltaMS);
        return status === 'available';
      })
      .map((n) => n.id);

    const seen = clientAPI.getSeenProgressionNodesForChampion(championID);
    if (seen.length === 0) {
      // If none have been seen, then ALL currently available nodes have been seen.  That way a new player doesn't
      // get swamped with badges.
      clientAPI.setSeenProgressionNodesForChampion(championID, availableNodeIDs);
      dispatch(updateSeenProgressionNodesForChampion(championID, availableNodeIDs));
    } else {
      const unseenNodeIDs = availableNodeIDs.filter((nid) => !seen.includes(nid));
      const prevUnseenNodeIDs = clientAPI.getUnseenUnlockedProgressionNodesForChampion(championID);
      if (isOnTree) {
        // If we're already on the ProgressionTree page, we don't need to badge anything (for when the
        // user unlocks nodes by activating other nodes), so we just mark newly available nodes as "seen".
        const newUnseenNodeIDs = unseenNodeIDs.filter((nid) => !prevUnseenNodeIDs.includes(nid));
        const allSeenNodeIDs = seen.concat(newUnseenNodeIDs);
        clientAPI.setSeenProgressionNodesForChampion(championID, allSeenNodeIDs);
        dispatch(updateSeenProgressionNodesForChampion(championID, allSeenNodeIDs));
      } else {
        // Compare to the list of already seen.
        clientAPI.setUnseenUnlockedProgressionNodesForChampion(championID, unseenNodeIDs);
        dispatch(updateUnseenUnlockedProgressionNodesForChampion(championID, unseenNodeIDs));
      }
    }
  });
}

export function getIsBadgedForUnseenProgressionNodes(champion: ChampionInfo): ExplainedValue<boolean> {
  const builder = new ExplanationBuilder<boolean>(
    `Unseen Progression Nodes - ${champion.name}`,
    false,
    !game.isPublicBuild
  );

  // Grab the list of unseen unlocked nodes for this champion from clientAPI.
  const unseenUnlockedNodeIDs: string[] = clientAPI.getUnseenUnlockedProgressionNodesForChampion(champion.id);
  const hasUnseenUnlockedProgressionNodes = unseenUnlockedNodeIDs.length > 0;

  builder.addRow(`\xa0\xa0Has unseen unlocked ProgressionNodes? ${hasUnseenUnlockedProgressionNodes}`);
  unseenUnlockedNodeIDs.forEach((nodeID) => {
    builder.addRow(`\xa0\xa0\xa0\xa0${nodeID}`);
  });

  builder.setValue(hasUnseenUnlockedProgressionNodes);
  return builder.getExplainedValue();
}
