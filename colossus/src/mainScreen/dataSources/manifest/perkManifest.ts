/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { QuestType } from './questManifest';
import { updateStorePerksByID } from '../../redux/storeSlice';
import { updateSelectedRuneMods } from '../../redux/profileSlice';
import { calculateSelectedRuneMods } from '../../helpers/perkUtils';
import { RootState } from '../../redux/store';

export const perkManifestID = 'perks';

// keep in sync with PerkDef.cs
export enum PerkType {
  Invalid = 'Invalid',
  Currency = 'Currency',
  Costume = 'Costume',
  Key = 'Key',
  Portrait = 'Portrait',
  Weapon = 'Weapon',
  CurrentBattlePassXP = 'CurrentBattlePassXP',
  Emote = 'Emote',
  RuneMod = 'RuneMod',
  QuestXP = 'QuestXP',
  SprintFX = 'SprintFX',
  RuneModTierKey = 'RuneModTierKey',
  StatusMod = 'StatusMod',
  StatMod = 'StatMod'
}

// keep in sync with PerkDef.cs
export enum PerkRarity {
  Default = 'Default',
  Common = 'Common',
  Rare = 'Rare',
  Unique = 'Unique'
}

// keep in sync with LAEOp.cs
export enum LAEOp {
  Add = 'Add',
  Multiply = 'Multiply',
  AddPercent = 'AddPercent',
  UpperBoundValue = 'UpperBoundValue',
  LowerBoundValue = 'LowerBoundValue',
  UpperBoundMultiplier = 'UpperBoundMultiplier',
  LowerBoundMultiplier = 'LowerBoundMultiplier',
  Set = 'Set'
}

export interface PerkDef {
  id: string;
  perkType: PerkType;
  name: string;
  description: string;
  iconURL: string;
  iconClass: string;
  iconClassColor: string;
  backgroundURL: string;
  videoURL: string;
  rarity: PerkRarity;
  isUnique: boolean;
  championID: string;
  portraitThumbnailURL: string;
  portraitChampionSelectImageUrl: string;
  weaponID: string;
  costumeID: string;
  runeModTier: number;
  questType: QuestType;
  xpAmount: number;
  sortOrder: number;
  showIfUnowned: boolean;
  statOperation: LAEOp;
  statID: string;
  statAmount: number;
}

export function processPerks(dispatch: Dispatch, json: any, version: number, reduxState: RootState): void {
  if (!isDataArray(json.defs, version, isPerkData)) {
    console.error('Invalid perk manifest file');
    return;
  }

  var perksByID: Dictionary<PerkDef> = {};
  var perks: PerkDef[] = [];

  for (const perk of json.defs) {
    switch (version) {
      case 1:
        perksByID[perk.id] = {
          id: perk.id,
          perkType: perk.perkType,
          name: perk.name,
          description: perk.description,
          iconURL: perk.iconURL,
          iconClass: perk.iconClass,
          iconClassColor: perk.iconClassColor,
          backgroundURL: perk.backgroundURL,
          videoURL: perk.videoURL,
          rarity: perk.rarity,
          isUnique: perk.isUnique,
          championID: perk.championID,
          portraitThumbnailURL: perk.portraitThumbnailURL,
          portraitChampionSelectImageUrl: perk.portraitChampionSelectImageUrl,
          weaponID: perk.weaponID,
          costumeID: perk.costumeID,
          runeModTier: perk.runeModTier,
          questType: perk.questType,
          xpAmount: perk.xpAmount,
          sortOrder: perk.sortOrder,
          showIfUnowned: perk.showIfUnowned,
          statOperation: perk.statOperation,
          statID: perk.statID,
          statAmount: perk.statAmount
        };

        perks.push(perksByID[perk.id]);
        break;
    }
  }

  dispatch(updateStorePerksByID({ perksByID: perksByID, perks: perks }));

  // this function gets called from multiple sevices, but will only be made after both the
  // perks and profile has loaded.
  dispatch(updateSelectedRuneMods(calculateSelectedRuneMods(perksByID, reduxState?.profile?.champions)));
}

function isPerkData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 24 &&
        'id' in obj &&
        'perkType' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconURL' in obj &&
        'iconClass' in obj &&
        'iconClassColor' in obj &&
        'backgroundURL' in obj &&
        'videoURL' in obj &&
        'rarity' in obj &&
        'isUnique' in obj &&
        'championID' in obj &&
        'portraitThumbnailURL' in obj &&
        'portraitChampionSelectImageUrl' in obj &&
        'weaponID' in obj &&
        'costumeID' in obj &&
        'runeModTier' in obj &&
        'questType' in obj &&
        'xpAmount' in obj &&
        'sortOrder' in obj &&
        'showIfUnowned' in obj &&
        'statOperation' in obj &&
        'statID' in obj &&
        'statAmount' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Perk object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Perk version ${version}`);
      return false;
  }
}
