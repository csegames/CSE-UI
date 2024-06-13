/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  PerkGQL,
  PerkRewardDefGQL,
  PurchaseDefGQL,
  QuestGQL,
  StringTableEntryDef,
  QuestDefGQL,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { isChampionEquipmentPerk, getPerkTypeLocalizedName } from '../../../../helpers/perkUtils';
import { QuestsByType } from '../../../../redux/questSlice';
import { battlePassLocalStore } from '../../../../localStorage/battlePassLocalStorage';
import { Dispatch } from '@reduxjs/toolkit';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { startProfileRefresh } from '../../../../redux/profileSlice';
import { InitTopic } from '../../../../redux/initializationSlice';
import { webConf } from '../../../../dataSources/networkConfiguration';

export interface PerkRewardDisplayData extends PerkRewardDefGQL {
  isPremium: boolean;
}

export function shouldShowBattlePassSplashScreen(bpID: string): boolean {
  // If there is no BP, don't splash.
  if ((bpID?.length ?? 0) < 1) {
    return false;
  }

  // Only show if the current BP has not been Splashed yet.
  const lastSplashedID = battlePassLocalStore.getLastSplashedBattlePassID();

  return lastSplashedID !== bpID;
}

export function shouldShowEndedBattlePassModal(bpID: string, questsProgress: QuestGQL[]): boolean {
  // Only show if the player has made progress in the BP.
  if (questsProgress.every((quest) => quest.id !== bpID)) {
    return false;
  }

  // Only show if the current BP ended modal has not been shown yet.
  const lastEndedID = battlePassLocalStore.getLastEndedBattlePassID();

  return lastEndedID !== bpID;
}

export function shouldShowClaimBattlePassModal(
  previousBattlePass: QuestDefGQL,
  currentBattlePass: QuestDefGQL,
  nextBattlePass: QuestDefGQL,
  initializationTopics: Dictionary<Boolean>,
  battlePassQuests: QuestDefGQL[],
  perks: PerkGQL[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): boolean {
  if (
    !initializationTopics[InitTopic.Store] ||
    !initializationTopics[InitTopic.Quests] ||
    !initializationTopics[InitTopic.ChampionInfo]
  ) {
    return false;
  }

  let displayedBattlePass: QuestDefGQL | null = null;
  if (!nextBattlePass || !isBattlePassVisible(nextBattlePass, serverTimeDeltaMS)) {
    displayedBattlePass = (currentBattlePass || previousBattlePass) ?? null;
  }

  let battlePassesToClaim = getBattlePassesWithUnclaimedRewards(battlePassQuests, perks, quests);
  if (displayedBattlePass) {
    battlePassesToClaim = battlePassesToClaim.filter((bpq) => bpq.id !== displayedBattlePass.id);
  }

  return battlePassesToClaim.length > 0;
}

export function hasExpiredBattlePassRewards(
  currentBattlePassID: string,
  battlePassQuests: QuestDefGQL[],
  perks: PerkGQL[],
  quests: QuestGQL[]
): boolean {
  const battlePasses = getBattlePassesWithUnclaimedRewards(battlePassQuests, perks, quests);

  return battlePasses.some((bpq) => bpq.id !== currentBattlePassID);
}

export function hasPremiumForBattlePass(bpq: QuestDefGQL, ownedPerks: PerkGQL[]): boolean {
  // If there is no BP, then you don't have a key for it.
  if (!bpq) {
    return false;
  }

  const premiumKeyId = bpq.premiumLock[0]?.perkID;

  const ownsPremiumKey = !!ownedPerks.find((perk) => {
    return perk.id === premiumKeyId && perk.qty > 0;
  });

  return ownsPremiumKey;
}

export function isBattlePassVisible(bpq: QuestDefGQL, serverTimeDeltaMS: number): boolean {
  const previewTime = new Date(bpq?.previewDate).getTime();
  const isBPVisible = getServerTimeMS(serverTimeDeltaMS) >= previewTime;
  return isBPVisible;
}

export function getBattlePassStartTimeMS(bpq: QuestDefGQL): number {
  const startDate = new Date(
    bpq.questLock?.find((lock) => {
      return !!lock.startTime;
    })?.startTime
  );
  return startDate.getTime();
}

export function getBattlePassEndTimeMS(bpq: QuestDefGQL): number {
  const endDate = new Date(
    bpq.questLock?.find((lock) => {
      return !!lock.endTime;
    })?.endTime
  );
  return endDate.getTime();
}

export function getCurrentBattlePass(battlePassQuests: QuestDefGQL[], serverTimeDeltaMS: number): QuestDefGQL {
  const serverTime = getServerTimeMS(serverTimeDeltaMS);
  const currentBattlePass = battlePassQuests?.find((bpq) => {
    const startTime = getBattlePassStartTimeMS(bpq);
    const endTime = getBattlePassEndTimeMS(bpq);

    return startTime <= serverTime && endTime > serverTime;
  });

  return currentBattlePass;
}

export function getNextBattlePass(battlePassQuests: QuestDefGQL[], serverTimeDeltaMS: number): QuestDefGQL {
  const serverTime = getServerTimeMS(serverTimeDeltaMS);
  const futureBattlePasses = getFutureBattlePasses(battlePassQuests, serverTimeDeltaMS);

  const next = futureBattlePasses.reduce((bestYet: QuestDefGQL, quest: QuestDefGQL) => {
    // If nothing yet, first is best!
    if (!bestYet) return quest;

    const bestYetStartTime = getBattlePassStartTimeMS(bestYet);
    const bestYetDelta = bestYetStartTime - serverTime;

    const questStartTime = getBattlePassStartTimeMS(quest);
    const questDelta = questStartTime - serverTime;

    return bestYetDelta < questDelta ? bestYet : quest;
  }, null);

  return next;
}

export function getPreviousBattlePasses(battlePassQuests: QuestDefGQL[], serverTimeDeltaMS: number): QuestDefGQL[] {
  const serverTime = getServerTimeMS(serverTimeDeltaMS);
  const previousBattlePasses = (battlePassQuests ?? [])?.filter((bpq) => {
    const endTime = getBattlePassEndTimeMS(bpq);
    return endTime <= serverTime;
  });

  return previousBattlePasses;
}

export function getFutureBattlePasses(battlePassQuests: QuestDefGQL[], serverTimeDeltaMS: number): QuestDefGQL[] {
  const serverTime = getServerTimeMS(serverTimeDeltaMS);
  const futureBattlePasses = (battlePassQuests ?? []).filter((bpq) => {
    const startTime = getBattlePassStartTimeMS(bpq);
    return startTime > serverTime;
  });

  return futureBattlePasses;
}

export function getMostRecentExpiredBattlePass(
  battlePassQuests: QuestDefGQL[],
  serverTimeDeltaMS: number
): QuestDefGQL {
  const serverTime = getServerTimeMS(serverTimeDeltaMS);
  const previousBattlePasses = getPreviousBattlePasses(battlePassQuests, serverTimeDeltaMS);

  const mostRecent = previousBattlePasses.reduce((bestYet: QuestDefGQL, quest: QuestDefGQL) => {
    // If nothing yet, first is best!
    if (!bestYet) return quest;

    const bestYetEndTime = getBattlePassEndTimeMS(bestYet);
    const bestYetDelta = serverTime - bestYetEndTime;

    const questEndTime = getBattlePassEndTimeMS(quest);
    const questDelta = serverTime - questEndTime;

    return bestYetDelta < questDelta ? bestYet : quest;
  }, null);

  // During development, we created some debug battlepasses whose history shouldn't be shown to the
  // players.  We may do something more thorough in the future, but for now we just filter them out.
  const noHistoryBattlePasses = ['battle_pass_season_01', 'battle_pass_season_01_test', 'battle_pass_001_test'];
  if (noHistoryBattlePasses.includes(mostRecent?.id)) {
    return null;
  }

  return mostRecent;
}

export function isPlayerPremiumForBattlePass(
  battlePassQuests: QuestDefGQL[],
  profilePerks: PerkGQL[],
  battlePassQuestId: string
): boolean {
  const battlePass = (battlePassQuests ?? []).find((bpq) => {
    return bpq.id === battlePassQuestId;
  });

  // If the id is invalid, we aren't premium for it.
  if (!battlePass) return false;

  // Beyond that, we are only premium if we have the matching premium key perk.
  const premiumKeyId = battlePass.premiumLock[0]?.perkID;
  const ownsPremiumKey = !!profilePerks.find((perk) => {
    return perk.id === premiumKeyId && perk.qty > 0;
  });

  return ownsPremiumKey;
}

export function getBattlePassesWithUnclaimedRewards(
  battlePassQuests: QuestDefGQL[],
  profilePerks: PerkGQL[],
  profileQuests: QuestGQL[]
): QuestDefGQL[] {
  const withUnclaimed = (battlePassQuests ?? []).filter((bpq) => {
    const progress = profileQuests.find((q) => {
      return q.id === bpq.id;
    });

    if (!progress) {
      return false;
    }

    // Any pending rewards from the Free track?
    if (progress.nextCollection < progress.currentQuestIndex) {
      return true;
    }

    // Any pending rewards from the Premium track?
    if (
      progress.nextCollectionPremium < progress.currentQuestIndex &&
      isPlayerPremiumForBattlePass(battlePassQuests, profilePerks, bpq.id)
    ) {
      return true;
    }

    return false;
  });

  return withUnclaimed;
}

export function getAllPendingBattlePassRewards(
  battlePassQuests: QuestDefGQL[],
  profilePerks: PerkGQL[],
  profileQuests: QuestGQL[]
): PerkRewardDisplayData[] {
  const rewardsByPerkId: Dictionary<PerkRewardDisplayData> = {};

  getBattlePassesWithUnclaimedRewards(battlePassQuests, profilePerks, profileQuests).forEach((bpq) => {
    const progress = profileQuests.find((q) => {
      return q.id === bpq.id;
    });

    if (!progress) {
      return;
    }

    // Any pending rewards from the Free track?
    for (let i = progress.nextCollection; i < progress.currentQuestIndex; ++i) {
      bpq.links[i].rewards.forEach((reward) => {
        // Merge duplicate rewards (mostly gems).
        const qty = reward.qty + (rewardsByPerkId[reward.perkID]?.qty ?? 0);
        rewardsByPerkId[reward.perkID] = {
          perkID: reward.perkID,
          qty,
          isPremium: false
        };
      });
    }
    // Any pending rewards from the Premium track?
    if (isPlayerPremiumForBattlePass(battlePassQuests, profilePerks, bpq.id)) {
      for (let i = progress.nextCollectionPremium; i < progress.currentQuestIndex; ++i) {
        bpq.links[i].premiumRewards.forEach((reward) => {
          // Merge duplicate rewards (mostly gems).
          const qty = reward.qty + (rewardsByPerkId[reward.perkID]?.qty ?? 0);
          rewardsByPerkId[reward.perkID] = {
            perkID: reward.perkID,
            qty,
            isPremium: true
          };
        });
      }
    }
  });

  return Object.values(rewardsByPerkId);
}

export function getAllPendingRewardsForQuest(
  quest: QuestDefGQL,
  battlePassQuests: QuestDefGQL[],
  profileQuests: QuestGQL[],
  profilePerks: PerkGQL[]
): PerkRewardDisplayData[] {
  const rewardsByPerkId: Dictionary<PerkRewardDisplayData> = {};

  const progress = profileQuests.find((q) => {
    return q.id === quest.id;
  });

  if (!quest || !progress) {
    return [];
  }

  // Any pending rewards from the Free track?
  for (let i = progress.nextCollection; i < progress.currentQuestIndex; ++i) {
    quest.links[i].rewards.forEach((reward) => {
      // Merge duplicate rewards (mostly gems).
      const qty = reward.qty + (rewardsByPerkId[reward.perkID]?.qty ?? 0);
      rewardsByPerkId[reward.perkID] = {
        perkID: reward.perkID,
        qty,
        isPremium: false
      };
    });
  }
  // Any pending rewards from the Premium track?
  // For now, this is only valid for BattlePass quests.
  if (isPlayerPremiumForBattlePass(battlePassQuests, profilePerks, quest.id)) {
    for (let i = progress.nextCollectionPremium; i < progress.currentQuestIndex; ++i) {
      quest.links[i].premiumRewards.forEach((reward) => {
        // Merge duplicate rewards (mostly gems).
        const qty = reward.qty + (rewardsByPerkId[reward.perkID]?.qty ?? 0);
        rewardsByPerkId[reward.perkID] = {
          perkID: reward.perkID,
          qty,
          isPremium: true
        };
      });
    }
  }

  return Object.values(rewardsByPerkId);
}

export function getRewardTypeText(
  reward: PerkRewardDefGQL,
  stringTable: Dictionary<StringTableEntryDef>,
  perksByID: Dictionary<PerkDefGQL>
): string {
  const perk = perksByID[reward?.perkID];
  if (!perk?.perkType) return '';

  if (isChampionEquipmentPerk(perk.perkType)) {
    return `${getPerkTypeLocalizedName(perk.perkType, stringTable)} ${
      perk.champion?.name ? ` - ${perk.champion.name}` : ''
    }`;
  } else {
    return getPerkTypeLocalizedName(perk.perkType, stringTable);
  }
}

export function getCurrentBattlePassPremiumPurchaseDef(
  battlePassQuests: QuestDefGQL[],
  purchases: PurchaseDefGQL[],
  serverTimeDeltaMS: number
): PurchaseDefGQL {
  const currentBattlePass = getCurrentBattlePass(battlePassQuests, serverTimeDeltaMS);
  if (!currentBattlePass) {
    // No current BattlePass?  No matching key to acquire.
    return null;
  }
  // Is there a PurchaseDef that grants the required key item for the current BattlePass?
  const premiumKeyId = currentBattlePass.premiumLock[0]?.perkID;
  const premiumPurchase = purchases.find((purchase) => {
    const keyPerk = purchase.perks.find((perk) => {
      return perk.perkID === premiumKeyId;
    });

    return !!keyPerk;
  });

  return premiumPurchase;
}

export function hasUncollectedDailyQuest(quests: QuestsByType, questsProgress: QuestGQL[]): boolean {
  return (
    hasUncollectedNonPremiumQuestInList(quests.DailyHard, questsProgress) ||
    hasUncollectedNonPremiumQuestInList(quests.DailyNormal, questsProgress)
  );
}

function hasUncollectedNonPremiumQuestInList(questList: QuestDefGQL[], questsProgress: QuestGQL[]): boolean {
  return (
    questList.find((quest) => {
      const progress = questsProgress.find((qp) => qp.id === quest.id);
      if (progress) {
        const isCompleted = progress.currentQuestIndex > 0;
        const isCollected = progress.nextCollection >= progress.currentQuestIndex;
        return isCompleted && !isCollected;
      }

      return false;
    }) != null
  );
}

export async function ensureBattlePassIsInitialized(
  battlepass: QuestDefGQL,
  quests: QuestGQL[],
  dispatch: Dispatch
): Promise<void> {
  const bpProgress = quests.find((p) => {
    return p.id === battlepass.id;
  });

  // If there is no current progress record for this battlepass, add one.
  // This should also activate daily quests for the player.
  if (!bpProgress) {
    const res = await ProfileAPI.AddQuest(webConf, battlepass.id);
    if (res.ok) {
      // Refetch the profile to get the quest records into Redux.
      dispatch(startProfileRefresh());
    } else {
      console.error(`Failed to initialize BattlePass (${battlepass.id})`);
    }
  }
}

/** If no claimable reward, returns the currently-in-progress tier (or last if max level).  Returns zero for no progress or invalid data. */
export function getTierOfLastClaimableBattlePassReward(
  battlepass: QuestDefGQL,
  quests: QuestGQL[],
  ownedPerks: PerkGQL[]
): number {
  const bpProgress = quests.find((p) => {
    return p.id === battlepass?.id;
  });

  // Can't find data to check.  Either there's an error or the user has no battlepass progress yet, so we start at the first tier.
  if (!battlepass || !bpProgress) {
    return 0;
  }

  const hasPremium = hasPremiumForBattlePass(battlepass, ownedPerks);

  // If the user has already claimed everything, just return the last tier.  Note that this assumes there is always a reward in the
  // final tier of both tracks.
  if (
    // Already claimed to end of free track?
    bpProgress.nextCollection >= battlepass.links.length &&
    // Has premium and has already claimed to end of premium track?
    (!hasPremium || bpProgress.nextCollectionPremium >= battlepass.links.length)
  ) {
    return battlepass.links.length - 1;
  }

  // Not all tiers are guaranteed to have a reward in them, so we need to iterate back from the current tier until we find a reward.
  let claimableFreeTier = -1;
  let claimablePremiumTier = -1;
  const lowestClaimableTier = Math.min(bpProgress.nextCollection, bpProgress.nextCollectionPremium);

  for (
    let i = bpProgress.currentQuestIndex - 1;
    i >= 0 && i >= lowestClaimableTier && claimableFreeTier === -1 && claimablePremiumTier === -1;
    --i
  ) {
    const link = battlepass.links[i];
    if (claimableFreeTier === -1 && i >= bpProgress.nextCollection && link.rewards?.length > 0) {
      claimableFreeTier = i;
    }
    if (
      hasPremium &&
      claimablePremiumTier === -1 &&
      i >= bpProgress.nextCollectionPremium &&
      link.premiumRewards?.length > 0
    ) {
      claimablePremiumTier = i;
    }
  }

  // If we get out here, then either we have found the index of the last claimable items on both the free and premium track, or else
  // there was nothing to claim.

  // If there was nothing to claim, then the tier we're currently on will be the next thing to claim.
  if (claimableFreeTier === -1 && claimablePremiumTier === -1) {
    return bpProgress.currentQuestIndex;
  }

  // Found something, so returning its index.
  if (!hasPremium) {
    return claimableFreeTier;
  } else {
    return Math.max(claimableFreeTier, claimablePremiumTier);
  }
}

/** If no claimable reward, returns the currently-in-progress tier (or last if max level).  Returns zero for no progress or invalid data. */
export function getTierOfFirstClaimableBattlePassReward(
  battlepass: QuestDefGQL,
  quests: QuestGQL[],
  ownedPerks: PerkGQL[]
): number {
  const bpProgress = quests.find((p) => {
    return p.id === battlepass?.id;
  });

  // Can't find data to check.  Either there's an error or the user has no battlepass progress yet, so we start at the first tier.
  if (!battlepass || !bpProgress) {
    return 0;
  }

  const hasPremium = hasPremiumForBattlePass(battlepass, ownedPerks);

  // If the user has already claimed everything, just return the last tier.  Note that this assumes there is always a reward in the
  // final tier of both tracks.
  if (
    // Already claimed to end of free track?
    bpProgress.nextCollection >= battlepass.links.length &&
    // Has premium and has already claimed to end of premium track?
    (!hasPremium || bpProgress.nextCollectionPremium >= battlepass.links.length)
  ) {
    return battlepass.links.length - 1;
  }

  // Not all tiers are guaranteed to have a reward in them, so we need to iterate forward from the lowest claimable tier until we find a reward.
  let claimableFreeTier: number = -1;
  let claimablePremiumTier: number = -1;
  const lowestClaimableTier = Math.min(bpProgress.nextCollection, bpProgress.nextCollectionPremium);

  for (
    let i = lowestClaimableTier;
    i < battlepass.links.length &&
    i < bpProgress.currentQuestIndex &&
    claimableFreeTier === -1 &&
    claimablePremiumTier === -1;
    ++i
  ) {
    const link = battlepass.links[i];
    if (claimableFreeTier === -1 && i >= bpProgress.nextCollection && link.rewards?.length > 0) {
      claimableFreeTier = i;
    }
    if (
      hasPremium &&
      claimablePremiumTier === -1 &&
      i >= bpProgress.nextCollectionPremium &&
      link.premiumRewards?.length > 0
    ) {
      claimablePremiumTier = i;
    }
  }

  // If we get out here, then either we have found the index of the first claimable items on both the free and premium track, or else
  // there was nothing to claim.

  if (claimableFreeTier === -1 && claimablePremiumTier === -1) {
    // If there was nothing to claim, then the tier we're currently on will be the next thing to claim.
    return bpProgress.currentQuestIndex;
  } else if (claimableFreeTier !== -1) {
    // If there was only a Free tier claimable, return that.
    return claimableFreeTier;
  } else if (claimablePremiumTier !== -1) {
    // If there was only a Premium tier claimable, return that.
    return claimablePremiumTier;
  } else {
    // If there were both, return the lower of the two.
    return Math.min(claimableFreeTier, claimablePremiumTier);
  }
}
