/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateItems } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';
import { ItemAction } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemStatID } from '../../components/items/itemData';

export const itemsManifestID = 'items';

// Keep in sync with ItemType.cs
export enum ItemType {
  Basic = 'Basic',
  Vox = 'Vox',
  Ammo = 'Ammo',
  Armor = 'Armor',
  Weapon = 'Weapon',
  Block = 'Block',
  Alloy = 'Alloy',
  Substance = 'Substance',
  SiegeEngine = 'SiegeEngine',
  Infusion = 'Infusion',
  DragonsWeb = 'DragonsWeb',
  AlchemyContainer = 'AlchemyContainer',
  Solvent = 'Solvent',
  Reagent = 'Reagent',
  ResourceNode = 'ResourceNode',
  HarvestTool = 'HarvestTool',
  PlotDeed = 'PlotDeed',
  Component = 'Component',
  VoxUpgradeModule = 'VoxUpgradeModule',
  CraftingMaterial = 'CraftingMaterial',
  Currency = 'Currency',
  Placeable = 'Placeable'
}

export interface ItemDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  tags: string[];
  itemType: ItemType;
  isDeployable: boolean;
  isStackableItem: boolean;
  iconUrl: string;
  gearSlotSets: string[][];
  equipRequirements: string;
  weaponConfig: WeaponConfig;
  armorConfig: ArmorConfig;
  craftingStationConfig: CraftingStationConfig;
  defStats: Record<ItemStatID, number>;
  containerDrawers: ContainerDrawer[];
  actions: ItemAction[];
}

export interface ContainerDrawer {
  contentsRequirementID: string;
  maxItemPositions: number;
}

export interface WeaponConfig {
  weaponCategoryDefID: string;
  weaponClassDefID: string;
  weaponTypeDefID: string;
  damageTypeDefID: string;
}

export interface ArmorConfig {
  armorCategoryDefID: string;
}

export interface CraftingStationConfig {
  allowableJobDefs: string[];
  maxRecipeLevel: number;
}

export function processItems(dispatch: Dispatch, json: any, version: number): void {
  const itemsByStringID: Record<string, ItemDef> = {};
  const itemsByNumericID: Record<number, ItemDef> = {};

  if (!isDataArray(json.defs, version, isItemData)) {
    console.error('Invalid items manifest file');
    return;
  }

  for (const item of json.defs) {
    switch (version) {
      case 1:
        const itemDef: ItemDef = {
          actions: item.actions,
          armorConfig: item.armorConfig,
          containerDrawers: item.containerDrawers,
          craftingStationConfig: item.craftingStationConfig,
          defStats: item.defStats,
          description: item.description,
          equipRequirements: item.equipRequirements,
          gearSlotSets: item.gearSlotSets,
          iconUrl: item.iconUrl,
          id: item.id,
          isDeployable: item.isDeployable,
          isStackableItem: item.isStackableItem,
          itemType: item.itemType,
          name: item.name,
          numericID: Number(item.numericID),
          tags: item.tags,
          weaponConfig: item.weaponConfig
        };
        itemsByStringID[item.id] = itemDef;
        itemsByNumericID[item.numericID] = itemDef;
        break;
    }
  }

  dispatch(updateItems([itemsByStringID, itemsByNumericID]));
}

function isItemData(obj: any, version: number): obj is ItemDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 17 &&
        'actions' in obj &&
        'armorConfig' in obj &&
        'containerDrawers' in obj &&
        'craftingStationConfig' in obj &&
        'defStats' in obj &&
        'description' in obj &&
        'equipRequirements' in obj &&
        'gearSlotSets' in obj &&
        'iconUrl' in obj &&
        'id' in obj &&
        'isDeployable' in obj &&
        'isStackableItem' in obj &&
        'itemType' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'tags' in obj &&
        'weaponConfig' in obj;

      if (!isCorrectType || !Array.isArray(obj.containerDrawers)) {
        return false;
      } else {
        for (const drawer of obj.containerDrawers) {
          const drawerCorrectType =
            Object.keys(drawer).length === 2 && 'contentsRequirementID' in drawer && 'maxItemPositions' in drawer;
          if (!drawerCorrectType) {
            console.error(`Found invalid Item containerDrawer object`, drawer);
            return false;
          }
        }
      }

      return isCorrectType;
    default:
      console.error(`Found invalid Item version ${version}`);
      return false;
  }
}
