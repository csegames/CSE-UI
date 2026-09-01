/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateSettings } from '../../redux/gameDefsSlice';
import { TagState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';

export const gameSettingsManifestID = 'gamesettings';

export interface GameSettingsDef {
  minCharacterNameLength: number;
  maxCharacterNameLength: number;
  maxChatMessageLength: number;
  startingAttributePoints: number;
  itemLowQualityThreshold: number;
  abilityNameMinLength: number;
  abilityNameMaxLength: number;
  abilityDescriptionMaxLength: number;
  inventoryCapacityBase: number;
  accountBankCapacityBase: number;
  tradeCapacity: number;
  tradeGoldTaxFrac: number;
  tradeItemsReceivedTaxFrac: number;
  clientStatusRemovalRequiredTags: TagState[];
  clientStatusRemovalExcludedTags: TagState[];
  abilityProgressionRespecCostPerLevel: number;
}

export function processGameSettings(dispatch: Dispatch, json: any, version: number): void {
  if (!isGameSettingData(json, version)) {
    console.error('Invalid GameSetting manifest file');
    return;
  }

  switch (version) {
    case 1:
      const gameSettingsV1 = {
        minCharacterNameLength: json.minCharacterNameLength,
        maxCharacterNameLength: json.maxCharacterNameLength,
        maxChatMessageLength: json.maxChatMessageLength,
        startingAttributePoints: json.startingAttributePoints,
        itemLowQualityThreshold: json.itemLowQualityThreshold,
        abilityNameMinLength: json.abilityNameMinLength,
        abilityNameMaxLength: json.abilityNameMaxLength,
        abilityDescriptionMaxLength: json.abilityDescriptionMaxLength,
        inventoryCapacityBase: json.inventoryCapacityBase,
        accountBankCapacityBase: 0,
        tradeCapacity: 0,
        tradeGoldTaxFrac: 0,
        tradeItemsReceivedTaxFrac: 0,
        clientStatusRemovalRequiredTags: <TagState[]>[],
        clientStatusRemovalExcludedTags: <TagState[]>[],
        abilityProgressionRespecCostPerLevel: 0
      };
      dispatch(updateSettings(gameSettingsV1));
      break;
    case 2:
      const gameSettingsV2 = {
        minCharacterNameLength: json.minCharacterNameLength,
        maxCharacterNameLength: json.maxCharacterNameLength,
        maxChatMessageLength: json.maxChatMessageLength,
        startingAttributePoints: json.startingAttributePoints,
        itemLowQualityThreshold: json.itemLowQualityThreshold,
        abilityNameMinLength: json.abilityNameMinLength,
        abilityNameMaxLength: json.abilityNameMaxLength,
        abilityDescriptionMaxLength: json.abilityDescriptionMaxLength,
        inventoryCapacityBase: json.inventoryCapacityBase,
        accountBankCapacityBase: json.accountBankCapacityBase,
        tradeCapacity: json.tradeCapacity,
        tradeGoldTaxFrac: json.tradeGoldTaxFrac,
        tradeItemsReceivedTaxFrac: json.tradeItemsReceivedTaxFrac,
        clientStatusRemovalRequiredTags: <TagState[]>[],
        clientStatusRemovalExcludedTags: <TagState[]>[],
        abilityProgressionRespecCostPerLevel: 0
      };
      dispatch(updateSettings(gameSettingsV2));
      break;
    case 3:
      const gameSettingsV3 = {
        minCharacterNameLength: json.minCharacterNameLength,
        maxCharacterNameLength: json.maxCharacterNameLength,
        maxChatMessageLength: json.maxChatMessageLength,
        startingAttributePoints: json.startingAttributePoints,
        itemLowQualityThreshold: json.itemLowQualityThreshold,
        abilityNameMinLength: json.abilityNameMinLength,
        abilityNameMaxLength: json.abilityNameMaxLength,
        abilityDescriptionMaxLength: json.abilityDescriptionMaxLength,
        inventoryCapacityBase: json.inventoryCapacityBase,
        accountBankCapacityBase: json.accountBankCapacityBase,
        tradeCapacity: json.tradeCapacity,
        tradeGoldTaxFrac: json.tradeGoldTaxFrac,
        tradeItemsReceivedTaxFrac: json.tradeItemsReceivedTaxFrac,
        clientStatusRemovalRequiredTags: json.clientStatusRemovalRequiredTags,
        clientStatusRemovalExcludedTags: json.clientStatusRemovalExcludedTags,
        abilityProgressionRespecCostPerLevel: json.abilityProgressionRespecCostPerLevel
      };
      dispatch(updateSettings(gameSettingsV3));
      break;
  }
}

function isGameSettingData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectV1Type =
        Object.keys(obj).length === 9 &&
        'minCharacterNameLength' in obj &&
        'maxCharacterNameLength' in obj &&
        'maxChatMessageLength' in obj &&
        'startingAttributePoints' in obj &&
        'itemLowQualityThreshold' in obj &&
        'abilityNameMinLength' in obj &&
        'abilityNameMaxLength' in obj &&
        'abilityDescriptionMaxLength' in obj &&
        'inventoryCapacityBase' in obj;
      if (!isCorrectV1Type) {
        console.error(`Found invalid GameSettings object`, obj);
      }
      return isCorrectV1Type;
    case 2:
      const isCorrectV2Type =
        Object.keys(obj).length === 13 &&
        'minCharacterNameLength' in obj &&
        'maxCharacterNameLength' in obj &&
        'maxChatMessageLength' in obj &&
        'startingAttributePoints' in obj &&
        'itemLowQualityThreshold' in obj &&
        'abilityNameMinLength' in obj &&
        'abilityNameMaxLength' in obj &&
        'abilityDescriptionMaxLength' in obj &&
        'inventoryCapacityBase' in obj &&
        'accountBankCapacityBase' in obj &&
        'tradeCapacity' in obj &&
        'tradeGoldTaxFrac' in obj &&
        'tradeItemsReceivedTaxFrac' in obj;
      if (!isCorrectV2Type) {
        console.error(`Found invalid GameSettings object`, obj);
      }
      return isCorrectV2Type;
    case 3:
      const isCorrectV3Type =
        Object.keys(obj).length === 16 &&
        'minCharacterNameLength' in obj &&
        'maxCharacterNameLength' in obj &&
        'maxChatMessageLength' in obj &&
        'startingAttributePoints' in obj &&
        'itemLowQualityThreshold' in obj &&
        'abilityNameMinLength' in obj &&
        'abilityNameMaxLength' in obj &&
        'abilityDescriptionMaxLength' in obj &&
        'inventoryCapacityBase' in obj &&
        'accountBankCapacityBase' in obj &&
        'tradeCapacity' in obj &&
        'tradeGoldTaxFrac' in obj &&
        'tradeItemsReceivedTaxFrac' in obj &&
        'clientStatusRemovalRequiredTags' in obj &&
        'clientStatusRemovalExcludedTags' in obj &&
        'abilityProgressionRespecCostPerLevel' in obj;
      if (!isCorrectV3Type) {
        console.error(`Found invalid GameSettings object`, obj);
      }
      return isCorrectV3Type;
    default:
      console.error(`Found invalid GameSettings version ${version}`);
      return false;
  }
}
