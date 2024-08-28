/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  ChampionGQL,
  ChampionInfo,
  PerkDefGQL,
  PerkType,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { getStringTableValue } from './stringTableHelpers';
import { updateStoreAddUnseenEquipment } from '../redux/storeSlice';
import { isBadgeRelatedPerk } from './badgingUtils';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const StringIDPerkTypesCurrency = 'PerkTypesCurrency';
const StringIDPerkTypesCostume = 'PerkTypesCostume';
const StringIDPerkTypesWeapon = 'PerkTypesWeapon';
const StringIDPerkTypesSprintFX = 'PerkTypesSprintFX';
const StringIDPerkTypesPortrait = 'PerkTypesPortrait';
const StringIDPerkTypesEmote = 'PerkTypesEmote';
const StringIDPerkTypesRuneMod = 'PerkTypesRuneMod';

export function isChampionEquipmentPerk(perkType: PerkType): boolean {
  return (
    perkType == PerkType.Costume ||
    perkType == PerkType.Weapon ||
    perkType == PerkType.SprintFX ||
    perkType == PerkType.Portrait ||
    perkType == PerkType.Emote ||
    perkType == PerkType.RuneMod
  );
}

export function getPerkTypeLocalizedName(perkType: PerkType, stringTable: Dictionary<StringTableEntryDef>): string {
  switch (perkType) {
    case PerkType.Currency: {
      return getStringTableValue(StringIDPerkTypesCurrency, stringTable);
    }
    case PerkType.Costume: {
      return getStringTableValue(StringIDPerkTypesCostume, stringTable);
    }
    case PerkType.Weapon: {
      return getStringTableValue(StringIDPerkTypesWeapon, stringTable);
    }
    case PerkType.SprintFX: {
      return getStringTableValue(StringIDPerkTypesSprintFX, stringTable);
    }
    case PerkType.Portrait: {
      return getStringTableValue(StringIDPerkTypesPortrait, stringTable);
    }
    case PerkType.Emote: {
      return getStringTableValue(StringIDPerkTypesEmote, stringTable);
    }
    case PerkType.RuneMod: {
      return getStringTableValue(StringIDPerkTypesRuneMod, stringTable);
    }
    default: {
      return '';
    }
  }
}

export function calculateSelectedRuneMods(
  runeMods: Dictionary<PerkDefGQL>,
  champions: ChampionGQL[]
): Dictionary<PerkDefGQL[]> {
  const selectedRuneModsByChamp: Dictionary<PerkDefGQL[]> = {};

  // Check to see if all the expected data exists, and has values stored in it.
  if (!runeMods || Object.keys(runeMods).length === 0 || !champions || champions.length === 0) {
    return selectedRuneModsByChamp;
  }

  // Find the selected Runes and update the redux store.
  for (let i: number = 0; i < champions.length; i++) {
    const selectedRuneMods =
      (champions[i].runeModPerkIDs &&
        champions[i].runeModPerkIDs.length > 0 &&
        champions[i].runeModPerkIDs.map((epid) => {
          return runeMods[epid] || null;
        })) ||
      [];
    if (!selectedRuneMods || selectedRuneMods.length < 1 || !selectedRuneMods[0] || !selectedRuneMods[0].runeModTier) {
      // if there are null values in the selectedRuneMods, return the entire list as null to avoid errors down stream.
      selectedRuneModsByChamp[champions[i].championID] = null;
    } else {
      selectedRuneModsByChamp[champions[i].championID] = selectedRuneMods;
    }
  }

  return selectedRuneModsByChamp;
}

export function createAlertsForCollectedQuestProgress(
  questDef: QuestDefGQL,
  questProgress: QuestGQL,
  perksByID: Dictionary<PerkDefGQL>,
  champions: ChampionInfo[],
  dispatch: Dispatch
) {
  if (!questDef || !questProgress) {
    return;
  }

  // The "alerts" in question primarily mean info to decide whether or not to show badges in the UI.

  // clientAPI is used to track "unseen" items between sessions.
  const allUnseenEquipment = clientAPI.getUnseenEquipment();

  for (let i = questProgress.nextCollection; i < questProgress.currentQuestIndex; ++i) {
    questDef.links[i].rewards.forEach((r) => {
      const perkDef = perksByID[r.perkID];
      if (perkDef && isBadgeRelatedPerk(perkDef, champions)) {
        dispatch(updateStoreAddUnseenEquipment(perkDef.id));
        allUnseenEquipment[r.perkID] = true;
      }
    });
  }

  for (let i = questProgress.nextCollectionPremium; i < questProgress.currentQuestIndex; ++i) {
    questDef.links[i].premiumRewards.forEach((r) => {
      const perkDef = perksByID[r.perkID];
      if (perkDef && isBadgeRelatedPerk(perkDef, champions)) {
        dispatch(updateStoreAddUnseenEquipment(perkDef.id));
        allUnseenEquipment[r.perkID] = true;
      }
    });
  }

  clientAPI.setUnseenEquipment(allUnseenEquipment);
}
