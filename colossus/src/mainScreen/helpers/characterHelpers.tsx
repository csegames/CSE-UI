/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChampionGQL, QuestGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { updateStoreRemoveUnseenEquipment } from '../redux/storeSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { CostumeDef } from '../dataSources/manifest/costumeManifest';
import { PerkDef, PerkType } from '../dataSources/manifest/perkManifest';
import { ChampionDef } from '../dataSources/manifest/championManifest';
import { QuestDef } from '../dataSources/manifest/questManifest';

export function getThumbnailURLForChampion(
  championCostumes: CostumeDef[],
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDef>,
  champion: ChampionDef
): string {
  if (champion) {
    const playerCostume: CostumeDef = getWornCostumeForChampion(championCostumes, champions, perksByID, champion.id);
    if (playerCostume) {
      return playerCostume.thumbnailURL;
    }
  }

  return 'images/MissingAsset.png';
}

export function getEquippedEmotesForChampion(
  championID: string,
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDef>,
  maxEmoteCount: number
): PerkDef[] {
  const champ = champions.find((c) => c.championID == championID);
  const equippedEmotes = champ?.emotePerkIDs?.map((epid) => perksByID[epid] ?? null) ?? [];
  while (equippedEmotes.length < maxEmoteCount) {
    equippedEmotes.push(null);
  }
  return equippedEmotes;
}

export function getWornCostumeForChampion(
  championCostumes: CostumeDef[],
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDef>,
  championID: string
): CostumeDef {
  if (!championID) {
    return null;
  }

  const playerChampion = champions.find((championGQL) => championGQL.championID === championID);
  if (!playerChampion) {
    return null;
  }

  const costumePerk = perksByID[playerChampion.costumePerkID];
  if (!costumePerk) {
    return null;
  }

  return championCostumes.find((costume) => costume.id === costumePerk.costumeID);
}

export function getRaceIDFromCostumeForChampion(
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDef>,
  costumes: Dictionary<CostumeDef>,
  championID: string
): number {
  if (!championID) {
    return 0;
  }

  const playerChampion = champions.find((championGQL) => championGQL.championID === championID);
  if (!playerChampion) {
    return 0;
  }

  const costumePerk = perksByID[playerChampion.costumePerkID];
  const costume = costumes[costumePerk?.costumeID];

  return costume?.numericID ?? 0;
}

export function findChampionQuestProgress(champion: ChampionDef, quests: QuestGQL[]): QuestGQL {
  if (champion && quests) {
    return quests.find((quest) => quest.id === champion.questID);
  }

  return null;
}

export function findChampionQuest(champion: ChampionDef, quests: QuestDef[]): QuestDef {
  if (champion && quests) {
    return quests.find((quest) => quest.id === champion.questID);
  }

  return null;
}

export function getChampionPerkUnlockQuestIndex(champion: ChampionDef, quests: QuestDef[], perkID: string): number {
  const quest = findChampionQuest(champion, quests);

  if (quest) {
    for (let i = 0; i < quest.links.length; i++) {
      if (quest.links[i].rewards.find((reward) => reward.perkID === perkID)) {
        return i;
      }
    }
  }
  return -1;
}

export function isChampionPendingLevelUp(champion: ChampionDef, quests: QuestGQL[]): boolean {
  // If this champion's quest has not been claimed to the current link...
  const questGQL = findChampionQuestProgress(champion, quests);
  if (questGQL && questGQL.currentQuestIndex > questGQL.nextCollection) {
    return true;
  }

  return false;
}

export function isPerkUnseen(
  perkID: string,
  newEquipment: Dictionary<boolean>,
  ownedPerks: Dictionary<number>
): boolean {
  // Is the perk marked as unseen?
  if (newEquipment[perkID] === undefined) {
    return false;
  }

  // If the user doesn't have the item, it doesn't count as new (maybe they sold it before looking at it).
  // We clean this case up more permanently in storeNetworking.tsx, initializeUnseenEquipment().
  if (ownedPerks[perkID] === undefined || ownedPerks[perkID] < 1) {
    return false;
  }

  return true;
}

export function markEquipmentSeen(
  perkID: string,
  newEquipment: Dictionary<boolean>,
  ownedPerks: Dictionary<number>,
  dispatch: Dispatch
) {
  if (isPerkUnseen(perkID, newEquipment, ownedPerks)) {
    // Redux.
    dispatch(updateStoreRemoveUnseenEquipment(perkID));
    // Local Storage.
    const newEquipment = clientAPI.getUnseenEquipment();
    delete newEquipment[perkID];
    clientAPI.setUnseenEquipment(newEquipment);
  }
}

export function getUnlockedRuneModTierForChampion(
  champion: ChampionDef,
  perksByID: Dictionary<PerkDef>,
  ownedPerks: Dictionary<number>
): number {
  if (!champion) {
    return 1;
  }

  const runeModTier = Object.entries(ownedPerks).reduce<number>((highestTier, [perkID, count]) => {
    // No matter what the perk is, if you don't have it, it isn't what we want.
    if (count <= 0) {
      return highestTier;
    }

    const perk = perksByID[perkID];
    // If it's not a tier key, we don't care about it.
    if (perk?.perkType !== PerkType.RuneModTierKey) {
      return highestTier;
    }

    // If it's not for this champion, we don't care about it.
    if (perk?.championID !== champion.id) {
      return highestTier;
    }

    return Math.max(perk?.runeModTier ?? highestTier, highestTier);
  }, 1); // Always have at least tier 1 unlocked.

  return runeModTier;
}
