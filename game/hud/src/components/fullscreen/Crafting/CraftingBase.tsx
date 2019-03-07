/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { findIndex, filter, includes } from 'lodash';
import { webAPI } from '@csegames/camelot-unchained';
import { nullVal } from 'fullscreen/lib/constants';
import { getRecipeType, recipeTypeToVoxJob } from './lib/utils';
import { InventoryDataTransfer } from 'fullscreen/lib/itemEvents';
import {
  getItemInventoryPosition,
  getItemContainerPosition,
  itemHasContainerPosition,
  firstStackSlot,
  getItemWithNewUnitCount,
  getIcon,
  isStackedItem,
  isCraftingItem,
  isContainerItem,
} from 'fullscreen/lib/utils';
import {
  CraftingBaseQuery,
  InventoryItem,
  SubItemSlot,
  BlockRecipes,
  PurifyRecipes,
  GrindRecipes,
  ShapeRecipes,
  MakeRecipes,
  VoxJobGroupLog,
  VoxJobLog,
  VoxJobState,
} from 'gql/interfaces';
import { SlotNumberToItem, DrawerSlotNumberToItem } from 'fullscreen/ItemShared/InventoryBase';
import { ContainerSlotItemDef, SlotType } from 'fullscreen/lib/itemInterfaces';
import { State as VoxInventoryState } from './components/VoxInventory/VoxInventoryView';
import VoxInventoryRow from './components/VoxInventory/VoxInventoryRow';

declare const toastr: any;

export enum RecipeType {
  None = 'none',
  Block = 'block',
  Purify = 'purify',
  Grind = 'grind',
  Shape = 'shape',
  Make = 'make',
  Salvage = 'salvage',
  Repair = 'repair',
}

export enum SubstanceType {
  Wood = 'Wood',
  Metal = 'Metal',
  Stone = 'Stone',
  Leather = 'Leather',
  Cloth = 'Cloth',
  Flesh = 'Flesh',
}

export enum AlloyType {
  Metal = 'Metal',
  Stone = 'Stone',
  Leather = 'Leather',
  Cloth = 'Cloth',
  Wood = 'Wood',
}

export interface ItemIdToAvailablePattern {
  [itemId: string]: {
    type: RecipeType;
    availablePatterns: string[];
  };
}

export interface JobTypeToAvailablePatterns {
  [type: string]: RecipeData[];
}

export interface JobIdentifierToVoxJobGroupLog {
  [identifier: string]: VoxJobGroupLog.Fragment;
}

export interface JobInstanceIdToVoxJobLog {
  [jobInstanceId: string]: VoxJobLog.Fragment;
}

export interface JobIdToJobState {
  [jobId: string]: {
    jobState: VoxJobState;
    jobNumber: number;
    jobType: VoxJobType;
    jobIdentifier: string;
  };
}

export interface InputItem {
  item: InventoryItem.Fragment;
  slot: SubItemSlot;
}

export type IngredientDef = MakeRecipes.Ingredients | BlockRecipes.Ingredients |
  PurifyRecipes.IngredientItem | ShapeRecipes.Ingredients | GrindRecipes.IngredientItem;

export interface ItemIdToIngredientDefInfo {
  [itemId: string]: {
    recipeId: string;
    ingredient: IngredientDef;
  }[];
}

export interface RecipeData {
  type: RecipeType;
  def?: CraftingRecipeDefRef;
}

export interface RecipeIdToRecipe {
  [recipeId: string]: RecipeData;
}

export type CraftingRecipeDefRef = CraftingBaseQuery.BlockRecipes | CraftingBaseQuery.GrindRecipes |
  CraftingBaseQuery.MakeRecipes | CraftingBaseQuery.PurifyRecipes | CraftingBaseQuery.ShapeRecipes;

export function initializeContextState(crafting: CraftingBaseQuery.Crafting) {
  const recipeIdToRecipe: RecipeIdToRecipe = {};
  const jobTypeToAvailablePatterns: JobTypeToAvailablePatterns = {};
  const jobIdentifierToVoxJobGroupLog: JobIdentifierToVoxJobGroupLog = {};
  let itemIdToAvailablePattern: ItemIdToAvailablePattern = {};
  let itemIdToIngredientDefInfo: ItemIdToIngredientDefInfo = {};
  Object.keys(crafting).forEach((craftingKey) => {
    if (includes(craftingKey.toLowerCase(), 'recipes')) {
      crafting[craftingKey].forEach((recipe: CraftingRecipeDefRef) => {
        // Add recipe to recipeIdToRecipe
        const recipeType = getRecipeType(craftingKey);
        const recipeData: RecipeData = {
          type: recipeType,
          def: recipe,
        };

        recipeIdToRecipe[recipe.id] = recipeData;

        const jobType = recipeTypeToVoxJob(recipeType);
        if (jobTypeToAvailablePatterns[jobType]) {
          jobTypeToAvailablePatterns[jobType].push(recipeData);
        } else {
          jobTypeToAvailablePatterns[jobType] = [recipeData];
        }

        // Add ingredient items to itemToAvailablePattern
        switch (craftingKey) {
          case 'blockRecipes': {
            (recipe as CraftingBaseQuery.BlockRecipes).ingredients.forEach((ingredientDef) => {
              itemIdToAvailablePattern =
                createOrPushAvailablePattern(
                  itemIdToAvailablePattern,
                  ingredientDef.ingredient.id,
                  RecipeType.Block,
                  recipe.id,
                );
              itemIdToIngredientDefInfo =
                createOrPushIngredientDefInfo(
                  itemIdToIngredientDefInfo,
                  ingredientDef.ingredient.id,
                  recipe.id,
                  ingredientDef,
                );
            });
            break;
          }

          case 'purifyRecipes': {
            const item = (recipe as CraftingBaseQuery.PurifyRecipes).ingredientItem;
            itemIdToAvailablePattern =
              createOrPushAvailablePattern(
                itemIdToAvailablePattern,
                item.id,
                RecipeType.Purify,
                recipe.id,
              );
            itemIdToIngredientDefInfo =
              createOrPushIngredientDefInfo(
                itemIdToIngredientDefInfo,
                item.id,
                recipe.id,
                item,
              );
            break;
          }

          case 'grindRecipes': {
            const item = (recipe as CraftingBaseQuery.GrindRecipes).ingredientItem;
            itemIdToAvailablePattern =
              createOrPushAvailablePattern(
                itemIdToAvailablePattern,
                item.id,
                RecipeType.Grind,
                recipe.id,
              );
            itemIdToIngredientDefInfo =
              createOrPushIngredientDefInfo(
                itemIdToIngredientDefInfo,
                item.id,
                recipe.id,
                item,
              );
            break;
          }

          case 'shapeRecipes': {
            (recipe as CraftingBaseQuery.ShapeRecipes).ingredients.forEach((ingredientDef) => {
              itemIdToAvailablePattern =
                createOrPushAvailablePattern(
                  itemIdToAvailablePattern,
                  ingredientDef.ingredient.id,
                  RecipeType.Shape,
                  recipe.id,
                );
              itemIdToIngredientDefInfo =
                createOrPushIngredientDefInfo(
                  itemIdToIngredientDefInfo,
                  ingredientDef.ingredient.id,
                  recipe.id,
                  ingredientDef,
                );
            });
            break;
          }

          case 'makeRecipes': {
            (recipe as CraftingBaseQuery.MakeRecipes).ingredients.forEach((ingredientDef) => {
              itemIdToAvailablePattern =
                createOrPushAvailablePattern(
                  itemIdToAvailablePattern,
                  ingredientDef.ingredient.id,
                  RecipeType.Shape,
                  recipe.id,
                );
              itemIdToIngredientDefInfo =
                createOrPushIngredientDefInfo(
                  itemIdToIngredientDefInfo,
                  ingredientDef.ingredient.id,
                  recipe.id,
                  ingredientDef,
                );
            });
            break;
          }
        }
      });
    } else if (craftingKey === 'voxJobGroupLogs') {
      crafting[craftingKey].forEach((groupLog) => {
        jobIdentifierToVoxJobGroupLog[groupLog.jobIdentifier] = groupLog;
      });
    }
  });

  return {
    crafting,
    itemIdToAvailablePattern,
    itemIdToIngredientDefInfo,
    recipeIdToRecipe,
    jobTypeToAvailablePatterns,
    jobIdentifierToVoxJobGroupLog,
  };
}

function createOrPushAvailablePattern(itemIdToAvailablePattern: ItemIdToAvailablePattern,
                                      ingredientItemId: string,
                                      recipeType: RecipeType,
                                      recipeId: string) {
  if (!itemIdToAvailablePattern[ingredientItemId]) {
    itemIdToAvailablePattern[ingredientItemId] = {
      type: recipeType,
      availablePatterns: [recipeId],
    };
  } else {
    itemIdToAvailablePattern[ingredientItemId] = {
      type: recipeType,
      availablePatterns: itemIdToAvailablePattern[ingredientItemId].availablePatterns.concat(recipeId),
    };
  }

  return itemIdToAvailablePattern;
}

function createOrPushIngredientDefInfo(itemIdToIngredientDefInfo: ItemIdToIngredientDefInfo,
                                        ingredientItemId: string,
                                        recipeId: string,
                                        ingredientDef: IngredientDef) {
  if (itemIdToIngredientDefInfo[ingredientItemId]) {
    itemIdToIngredientDefInfo[ingredientItemId].push({
      recipeId,
      ingredient: ingredientDef,
    });
  } else {
    itemIdToIngredientDefInfo[ingredientItemId] = [{
      recipeId,
      ingredient: ingredientDef,
    }];
  }

  return itemIdToIngredientDefInfo;
}

export function addInputItemClient(inputItems: InputItem[],
                                    item: InventoryItem.Fragment,
                                    slot: SubItemSlot,
                                    amount?: number) {
  const alreadyExistingItemIndex =
    findIndex(inputItems, inputItem => inputItem.item.staticDefinition.id + inputItem.item.stats.item.quality ===
      item.staticDefinition.id + item.stats.item.quality);

  let newInputItem = item;
  if (amount) {
    if (alreadyExistingItemIndex !== -1) {
      newInputItem = getItemWithNewUnitCount(item, inputItems[alreadyExistingItemIndex].item.stats.item.unitCount + amount);
    } else {
      newInputItem = getItemWithNewUnitCount(item, amount);
    }
  }

  let newInputItems = [...inputItems];
  if (alreadyExistingItemIndex !== -1) {
    // Replace existing item with new unitCount
    newInputItems[alreadyExistingItemIndex] = {
      item: newInputItem,
      slot,
    };
  } else {
    // Add item to inputItems
    newInputItems = [...inputItems, { item: newInputItem, slot }];
  }

  return {
    inputItems: newInputItems,
  };
}

export async function addInputItemServer(inputItems: InputItem[],
                                          item: InventoryItem.Fragment,
                                          unitCount: number,
                                          slot: SubItemSlot,
                                          voxEntityID: string,
                                          voxContainerID: string) {
  const moveItemRequest = {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: unitCount || item.stats.item.unitCount || -1,
    to: {
      position: nullVal,
      entityID: voxEntityID,
      containerID: voxContainerID,
      gearSlotIDs: [] as any,
      location: 'Vox',
      voxSlot: slot,
    },
    from: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: itemHasContainerPosition(item) ? getItemContainerPosition(item) : getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };

  const res = await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    moveItemRequest as any,
  );
  if (!res.ok) {
    const data = JSON.parse(res.data);
    if (data.FieldCodes && data.FieldCodes.length > 0) {
      toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
    } else {
      toastr.error('There was a problem trying to add that item', 'Oh No!!', { timeout: 5000 });
    }
    return {
      res,
      inputItems,
    };
  }

  if (res.ok) {
    const moveItemResult = tryParseJSON<{ FieldCodes: { Result: MoveItemResult }[] }>(res.data, true);
    if (moveItemResult && moveItemResult.FieldCodes && moveItemResult.FieldCodes[0] && moveItemResult.FieldCodes[0].Result) {
      const data: MoveItemResult = moveItemResult.FieldCodes[0].Result;

      // We need to update the id, unitCount, and position of the new item
      const movingItem: InventoryItem.Fragment = {
        ...item,
        id: data.MovedItemIDs[0],
      };

      const updatedState = addInputItemClient(inputItems, movingItem, slot, unitCount);
      return {
        res,
        inputItems: updatedState.inputItems,
      };
    }
  }
}

export function removeInputItemClient(inputItems: InputItem[],
                                      item: InventoryItem.Fragment,
                                      unitCount?: number) {
  if (!unitCount) {
    const newInputItems = filter(inputItems, _item => _item.item.id !== item.id);
    return {
      inputItems: newInputItems,
    };
  } else {
    const inputItemIndex = findIndex(inputItems, inputItem => inputItem.item.id === item.id);
    const newInputItems = [...inputItems];
    newInputItems[inputItemIndex] = {
      item: getItemWithNewUnitCount(item, item.stats.item.unitCount - unitCount),
      slot: newInputItems[inputItemIndex].slot,
    };
    return {
      inputItems: newInputItems,
    };
  }
}

export async function removeInputItemServer(item: InventoryItem.Fragment,
                                            slot: SubItemSlot,
                                            voxEntityID: string,
                                            voxContainerID: string,
                                            slotNumberToItem: SlotNumberToItem,
                                            unitCount?: number) {
  const moveItemRequest = {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: unitCount || item.stats.item.unitCount || -1,
    to: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: firstStackSlot(item, slotNumberToItem),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
    from: {
      position: nullVal,
      entityID: voxEntityID,
      characterID: nullVal,
      containerID: voxContainerID,
      gearSlotIDs: [] as any,
      location: 'Vox',
      voxSlot: slot,
    },
  };

  return await webAPI.ItemAPI.MoveItems(
    webAPI.defaultConfig,
    game.shardID,
    game.selfPlayerState.characterID,
    moveItemRequest as any,
  );
}

export function setSelectedRecipeClient(recipe: RecipeData) {
  return {
    selectedRecipe: recipe,
  };
}

export async function swapSelectedRecipeServer(recipe: RecipeData, voxEntityID: string) {
  try {
    const jobType = recipeTypeToVoxJob(recipe.type);
    const res = await webAPI.CraftingAPI.SwapVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      jobType,
      recipe.def ? recipe.def.id : '',
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function setSelectedJobTypeServer(recipe: RecipeData, voxEntityID: string) {
  try {
    const jobType = recipeTypeToVoxJob(recipe.type);
    const res = await webAPI.CraftingAPI.AppendVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      jobType,
      recipe.def ? recipe.def.id : '',
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function setRecipeIDServer(recipeID: string, voxEntityID: string) {
  try {
    const res = await webAPI.CraftingAPI.SetRecipeID(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      recipeID,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function setItemCountServer(itemCount: number, voxEntityID: string) {
  try {
    const res = await webAPI.CraftingAPI.SetVoxItemCount(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      itemCount,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function setQualityServer(quality: number, voxEntityID: string) {
  try {
    const res = await webAPI.CraftingAPI.SetQuality(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      quality,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function clearJobServer(voxEntityID: string, jobInstanceID: string) {
  try {
    const res = await webAPI.CraftingAPI.ClearVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      jobInstanceID,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function startJobServer(voxEntityID: string) {
  try {
    const res = await webAPI.CraftingAPI.StartVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function cancelJobServer(voxEntityID: string) {
  try {
    const res = await webAPI.CraftingAPI.CancelVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function collectJobServer(voxEntityID: string, jobInstanceID: string) {
  try {
    const res = await webAPI.CraftingAPI.CollectFinishedVoxJob(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      jobInstanceID,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function setCustomNameServer(voxEntityID: string, customName: string) {
  try {
    const res = await webAPI.CraftingAPI.SetCustomItemName(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      voxEntityID,
      customName,
    );
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function moveItemToVoxInventory(dataTransfer: InventoryDataTransfer,
                                              voxEntityID: string,
                                              voxContainerID: string,
                                              position: number) {
  const { item, unitCount } = dataTransfer;
  const moveItemRequest = {
    moveItemID: item.id,
    stackHash: item.stackHash,
    unitCount: unitCount || item.stats.item.unitCount || -1,
    to: {
      position,
      entityID: voxEntityID,
      containerID: voxContainerID,
      // drawerID: 'default',
      gearSlotIDs: [] as any,
      location: 'Container',
    },
    from: {
      entityID: nullVal,
      characterID: game.selfPlayerState.characterID,
      position: itemHasContainerPosition(item) ? getItemContainerPosition(item) : getItemInventoryPosition(item),
      containerID: nullVal,
      gearSlotIDs: [] as any,
      location: 'Inventory',
      voxSlot: 'Invalid',
    },
  };

  try {
    const res = await webAPI.ItemAPI.MoveItems(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      moveItemRequest as any,
    );

    return res;
  } catch (e) {
    console.error(e);
  }
}

export function createRowElementsForVoxInventory(state: VoxInventoryState, slotNumberToItem: DrawerSlotNumberToItem) {
  const rows: JSX.Element[] = [];
  const rowData: ContainerSlotItemDef[][] = [];
  let slotIndex = 0;
  for (let rowIndex = 0; rowIndex < state.rowCount; rowIndex++) {
    const rowItems: ContainerSlotItemDef[] = [];
    for (let i = 0; i < state.slotsPerRow; i++) {
      const item = slotNumberToItem[slotIndex] && slotNumberToItem[slotIndex].item;

      if (!item || !item.staticDefinition) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: slotIndex, location: 'inContainer' },
        });

        slotIndex++;
        continue;
      }

      if (isContainerItem(item)) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: getIcon(item),
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer' },
          item,
        });

        slotIndex++;
        continue;
      }

      if (isCraftingItem(item)) {
        const count = item.stats.item.unitCount;
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: getIcon(item),
          groupStackHashID: item.id,
          itemID: item.id,
          item,
          slotIndex: { position: slotIndex, location: 'inContainer' },
          disabled: count === 0,
        });

        slotIndex++;
        continue;
      }

      if (isStackedItem(item)) {
        const count = item.stats.item.unitCount;
        rowItems.push({
          slotType: SlotType.Stack,
          icon: getIcon(item),
          itemID: item.id,
          slotIndex: { position: slotIndex, location: 'inContainer' },
          item,
          disabled: count === 0,
        });

        slotIndex++;
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: getIcon(item),
        itemID: item.id,
        slotIndex: { position: slotIndex, location: 'inContainer' },
        item,
      });
      slotIndex++;
    }

    rows.push((
      <VoxInventoryRow key={rowIndex} items={rowItems} />
    ));
    rowData.push(rowItems);
  }


  return {
    rows,
    rowData,
  };
}

