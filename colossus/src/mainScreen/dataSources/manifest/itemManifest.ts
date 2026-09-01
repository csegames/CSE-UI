/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ItemGameplayType } from '@csegames/library/dist/hordetest/game/types/ItemGameplayType';
import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateItemDefs } from '../../redux/gameSlice';

export interface ItemDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  gameplayType: ItemGameplayType;
  iconURL: string;
}

export const itemsManifestID = 'items';

export function processItems(dispatch: Dispatch, json: any, version: number): void {
  const itemsByNumericID: Record<number, ItemDef> = {};
  if (!isDataArray(json.defs, version, isItemData)) {
    console.error('Invalid item manifest file');
    return;
  }

  for (const item of json.defs) {
    switch (version) {
      case 1:
        itemsByNumericID[item.numericID] = {
          id: item.id,
          numericID: Number(item.numericID),
          name: item.name,
          description: item.description,
          gameplayType: item.gameplayType,
          iconURL: item.iconURL
        };
        break;
    }
  }

  dispatch(updateItemDefs(itemsByNumericID));
}

function isItemData(obj: any, version: number): obj is ItemDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 6 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'gameplayType' in obj &&
        'iconURL' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid Item object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Item version ${version}`);
      return null;
  }
}
