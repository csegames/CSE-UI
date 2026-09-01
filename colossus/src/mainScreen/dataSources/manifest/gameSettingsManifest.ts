/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateGameSettings } from '../../redux/gameSettingsSlice';

export const gameSettingsManifestID = 'gamesettings';

// Keep in Sync with storeTab.cs
export enum StoreTab {
  Invalid = 'Invalid',
  Bundle = 'Bundle',
  Costume = 'Costume',
  Weapon = 'Weapon',
  SprintFX = 'SprintFX',
  Emote = 'Emote',
  Portrait = 'Portrait',
  QuestXP = 'QuestXP'
}

export interface StoreTabConfig {
  tab: StoreTab;
  layout: number;
}

export interface GameSettingsDef {
  storeTabConfigs: StoreTabConfig[];
  expensivePurchaseGemThreshold: number;
  maxEmoteCount: number;
  dailyQuestResetsAllowed: number;
  normalDailyQuestCount: number;
  hardDailyQuestCount: number;
  runeModTiers: number;
}

export function processGameSettings(dispatch: Dispatch, json: any, version: number): void {
  if (!isGameSettingData(json, version)) {
    console.error('Invalid GameSetting manifest file');
    return;
  }

  switch (version) {
    case 1:
      const gameSettings = {
        storeTabConfigs: json.storeTabConfigs,
        expensivePurchaseGemThreshold: json.expensivePurchaseGemThreshold,
        maxEmoteCount: json.maxEmoteCount,
        dailyQuestResetsAllowed: json.dailyQuestResetsAllowed,
        normalDailyQuestCount: json.normalDailyQuestCount,
        hardDailyQuestCount: json.hardDailyQuestCount,
        runeModTiers: json.runeModTiers
      };
      dispatch(updateGameSettings(gameSettings));
      break;
  }
}

function isGameSettingData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 7 &&
        'storeTabConfigs' in obj &&
        'expensivePurchaseGemThreshold' in obj &&
        'maxEmoteCount' in obj &&
        'dailyQuestResetsAllowed' in obj &&
        'normalDailyQuestCount' in obj &&
        'hardDailyQuestCount' in obj &&
        'runeModTiers' in obj;
      if (!isCorrectType || !Array.isArray(obj.storeTabConfigs)) {
        console.error(`Found invalid GameSettings object`, obj);
      } else {
        for (const tab of obj.storeTabConfigs) {
          const tabCorrectType = Object.keys(tab).length === 2 && 'tab' in tab && 'layout' in tab;
          if (!tabCorrectType) {
            console.error(`Found invalid GameSettings tab object`, tab);
            return false;
          }
        }
      }

      if (!isCorrectType) {
        console.error(`Found invalid GameSettings object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid GameSettings version ${version}`);
      return false;
  }
}
