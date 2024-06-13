/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { IDLookupTable } from '../redux/gameSlice';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  PerkDefGQL,
  ClassDefRef,
  ChampionInfo,
  QuestGQL,
  QuestDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { storeLocalStore } from '../localStorage/storeLocalStorage';
import { updateStoreRemoveUnseenEquipment } from '../redux/storeSlice';
import { Dispatch } from '@reduxjs/toolkit';

export function getCharacterClassStringIDForNumericID(classes: IDLookupTable<CharacterClassDef>, numericID: number) {
  const classDef = classes[numericID];
  if (classDef) {
    return classDef.stringID;
  }

  return null;
}

export function getThumbnailURLForChampion(
  championCostumes: ChampionCostumeInfo[],
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDefGQL>,
  champion: ClassDefRef
): string {
  if (champion) {
    const playerCostume: ChampionCostumeInfo = getWornCostumeForChampion(
      championCostumes,
      champions,
      perksByID,
      champion.id
    );
    if (playerCostume) {
      return playerCostume.thumbnailURL;
    }
  }

  return 'images/MissingAsset.png';
}

export function getEquippedEmotesForChampion(
  championID: string,
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDefGQL>,
  maxEmoteCount: number
): PerkDefGQL[] {
  const champ = champions.find((c) => c.championID == championID);
  const equippedEmotes = champ?.emotePerkIDs?.map((epid) => perksByID[epid] ?? null) ?? [];
  while (equippedEmotes.length < maxEmoteCount) {
    equippedEmotes.push(null);
  }
  return equippedEmotes;
}

export function getWornCostumeForChampion(
  championCostumes: ChampionCostumeInfo[],
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDefGQL>,
  championID: string
): ChampionCostumeInfo {
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

  return championCostumes.find((costume) => costume.id === costumePerk.costume.id);
}

export function getRaceIDFromCostumeForChampion(
  champions: ChampionGQL[],
  perksByID: Dictionary<PerkDefGQL>,
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

  return costumePerk?.costume?.numericID ?? 0;
}

export function findChampionQuestProgress(champion: ChampionInfo, quests: QuestGQL[]): QuestGQL {
  if (champion && quests) {
    return quests.find((quest) => quest.id === champion.questID);
  }

  return null;
}

export function findChampionQuest(champion: ChampionInfo, quests: QuestDefGQL[]): QuestDefGQL {
  if (champion && quests) {
    return quests.find((quest) => quest.id === champion.questID);
  }

  return null;
}

export function getChampionPerkUnlockQuestIndex(champion: ChampionInfo, quests: QuestDefGQL[], perkID: string): number {
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

export function hasUnseenPerkForChampion(
  champion: ChampionInfo,
  perkTypeFilter: PerkType,
  newEquipment: Dictionary<boolean>,
  perksByID: Dictionary<PerkDefGQL>,
  ownedPerks: Dictionary<number>
): boolean {
  const unseenPerk = Object.keys(newEquipment).find((perkID) => {
    // Does the perk exist?
    const matchingPerk = perksByID[perkID];
    if (!matchingPerk) {
      return false;
    }

    // if we're filtering perk types, then make sure this perk matches the filter
    if (perkTypeFilter != PerkType.Invalid && perkTypeFilter != matchingPerk.perkType) {
      return;
    }

    // Is the perk of a type that we badge for?
    if (
      matchingPerk.perkType !== PerkType.Weapon &&
      matchingPerk.perkType !== PerkType.Costume &&
      matchingPerk.perkType !== PerkType.Emote &&
      matchingPerk.perkType !== PerkType.Portrait &&
      matchingPerk.perkType !== PerkType.SprintFX &&
      matchingPerk.perkType !== PerkType.RuneMod
    ) {
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

  return unseenPerk !== undefined;
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
    const newEquipment = storeLocalStore.getUnseenEquipment();
    delete newEquipment[perkID];
    storeLocalStore.setUnseenEquipment(newEquipment);
  }
}
