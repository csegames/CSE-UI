/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  CharacterStatField,
  ClassDefGQL,
  EquippedItem,
  Euler3f,
  GearSlot,
  Item,
  ItemActionUIReaction,
  ItemResourceGQL,
  ItemType,
  RaceDefGQL,
  StatGQL,
  Vec3f
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  ItemPermissions,
  MoveItemRequestLocationType,
  Faction
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { ItemResourceID, ItemStatID } from './itemData';
import { InventoryStackSplit, moveInventoryItems } from '../../redux/inventorySlice';
import { moveEquippedItems } from '../../redux/equippedItemsSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { addErrorNotice } from '../../redux/errorNoticesSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { hideContextMenu } from '../../redux/contextMenuSlice';
import { addMenuWidgetExiting } from '../../redux/hudSlice';
import { WIDGET_NAME_INVENTORY } from '../inventory/Inventory';
import { game } from '@csegames/library/dist/_baseGame';
import { UIReaction } from '@csegames/library/dist/camelotunchained/game/types/ItemActions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { refreshInventory } from '../../dataSources/inventoryService';
import { refreshEquippedItems } from '../../dataSources/equippedItemsService';

enum EquipmentRequirementOperator {
  Equals = 'Equals',
  NotEquals = 'NotEquals'
}

export interface MoveItemRequest {
  MoveItemID: string;
  UnitCount: number;
  EntityIDFrom: string;
  CharacterIDFrom: string;
  BoneAliasFrom: number;
  LocationTo: MoveItemRequestLocationType;
  EntityIDTo: string;
  CharacterIDTo: string;
  PositionTo: number;
  ContainerIDTo: string;
  DrawerIndexTo: number;
  GearSlotIDTo: string;
  WorldPositionTo: Vec3f;
  RotationTo: Euler3f;
  BoneAliasTo: number;
}

interface EquipRequirement {
  Faction?: string;
  Race?: string;
  Class?: string;
  Tag?: string;
  Operator: EquipmentRequirementOperator;
}

export const refreshItems = (): void => {
  refreshInventory();
  refreshEquippedItems();
};

export const isItemStatRenderable = (
  item: Item,
  itemStatID: ItemStatID,
  equippedItems: (EquippedItem | null)[]
): boolean => !!getItemStatValue(item, itemStatID) || !!getItemStatCompareValue(item, itemStatID, equippedItems);

export const findItem = (
  itemID: string,
  inventoryItems: Item[],
  equippedItems: (EquippedItem | null)[]
): Item | null => {
  const inventoryItem = inventoryItems.find((inventoryItem): boolean => inventoryItem.id === itemID);
  if (inventoryItem) {
    return inventoryItem;
  }
  const equippedItem = equippedItems.find((equippedItem) => equippedItem.item.id === itemID)?.item;
  if (equippedItem) {
    return equippedItem;
  }
  return null;
};

export const getItemStat = (item: Item, itemStatID: ItemStatID): StatGQL | null =>
  item.statList.find(({ statID }) => statID === itemStatID) ?? null;

export const getItemStatValue = (item: Item, itemStatID: ItemStatID): number =>
  getItemStat(item, itemStatID)?.value ?? 0;

export const getItemStatCompareValue = (
  item: Item,
  itemStatID: ItemStatID,
  equippedItems: (EquippedItem | null)[]
): number | null => {
  if (!item.location.equipped) {
    const gearSlotID = getItemGearSlotID(item);
    if (gearSlotID) {
      const equippedItem = equippedItems.find((equippedItem) => equippedItem.gearSlots.includes(gearSlotID));
      const statValue = equippedItem?.item?.statList?.find(({ statID }) => statID === itemStatID)?.value ?? 0;
      return getItemStatValue(item, itemStatID) - statValue;
    }
  }
  return null;
};

export const getItemResource = (item: Item, resourceID: ItemResourceID): ItemResourceGQL | null =>
  item.resourceList.find(({ id }) => id === resourceID) ?? null;

export const getItemResourceValue = (item: Item, resourceID: ItemResourceID): number =>
  getItemResource(item, resourceID)?.currentValue ?? 0;

export const getItemGearSlotID = (item: Item): string | null => {
  for (const gearSlotSet of item.staticDefinition.gearSlotSets) {
    if (gearSlotSet && gearSlotSet.gearSlots) {
      for (const gearSlot of gearSlotSet.gearSlots) {
        if (gearSlot) {
          return gearSlot;
        }
      }
    }
  }
  return null;
};

export const isItemDroppable = (item: Item): boolean => {
  if (!item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return true;
  }
  return !!(item.permissibleHolder.userPermissions & ItemPermissions.Ground);
};

export const isItemTrashable = (item: Item): boolean => {
  if (!item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return true;
  }
  return !!(item.permissibleHolder.userPermissions & ItemPermissions.Trash);
};

export const getItemUnitCount = (item: Item): number => {
  return getItemStatValue(item, ItemStatID.UnitCount) || 1;
};

export const canItemsStack = (itemA: Item, itemB: Item): boolean => {
  if (itemA.staticDefinition.id !== itemB.staticDefinition.id) {
    return false;
  }

  // Infusions, reagents, and solvents stack if they are the same item type
  if (
    itemA.staticDefinition.itemType == ItemType.Infusion ||
    itemA.staticDefinition.itemType == ItemType.Solvent ||
    itemA.staticDefinition.itemType == ItemType.Reagent
  ) {
    return true;
  }

  // Two alchemy containers of the same type can stack as long as they are both empty
  if (
    itemA.staticDefinition.itemType == ItemType.AlchemyContainer &&
    getItemResource(itemA, ItemResourceID.Doses).currentValue == 0 &&
    getItemResource(itemB, ItemResourceID.Doses).currentValue == 0
  ) {
    return true;
  }

  if (
    (itemA.staticDefinition.itemType === ItemType.Substance || itemA.staticDefinition.itemType === ItemType.Block) &&
    getItemStatValue(itemA, ItemStatID.Quality) === getItemStatValue(itemB, ItemStatID.Quality)
  ) {
    return true;
  }

  if (itemA.staticDefinition.itemType === ItemType.Ammo || itemA.staticDefinition.itemType === ItemType.Alloy) {
    return itemA.stackHash === itemB.stackHash;
  }

  return false;
};

export const getMoveErrors = (
  moves: MoveItemRequest[],
  inventoryItems: Item[],
  equippedItems: EquippedItem[],
  factionID: Faction,
  race: RaceDefGQL,
  classGQL: ClassDefGQL,
  raceTags: string[],
  myStats: Dictionary<CharacterStatField>,
  stackSplit: InventoryStackSplit | null
): string[] => {
  const errors: string[] = [];
  for (const move of moves) {
    const item = findItem(move.MoveItemID, inventoryItems, equippedItems);

    // find the item we'd be combining this moved item with (if any)
    let targetItem: Item | null = null;
    if (move.LocationTo === MoveItemRequestLocationType.Inventory) {
      targetItem = inventoryItems.find(
        (inventoryItem) => inventoryItem.location.inventory.position === move.PositionTo
      );
    } else if (move.LocationTo === MoveItemRequestLocationType.Equipment) {
      targetItem = equippedItems.find((equippedItem) => equippedItem.gearSlots.includes(move.GearSlotIDTo))?.item;
    }

    // Splitting a stack to an occupied slot
    if (item.id === stackSplit?.itemID && targetItem) {
      errors.push(`${item.staticDefinition.name} cannot be split into an occupied slot.`);
    }
    // Splitting a stack to same item but incompatible stacks
    else if (
      targetItem &&
      item.staticDefinition.id === targetItem.staticDefinition.id &&
      !canItemsStack(item, targetItem)
    ) {
      errors.push(`Differing ${item.staticDefinition.name} stacks cannot be combined.`);
    }

    if (move.LocationTo === MoveItemRequestLocationType.Equipment) {
      // Equipping to wrong equip slot
      if (
        item.staticDefinition.gearSlotSets.every((gearSlotSet) =>
          gearSlotSet.gearSlots.every((gearSlot) => gearSlot !== move.GearSlotIDTo)
        )
      ) {
        errors.push(`${item.staticDefinition.name} cannot be equipped to ${move.GearSlotIDTo}.`);
      }
      // Equipping with incompatible faction, race, class or race tags
      const requirements: EquipRequirement[] = JSON.parse(item.staticDefinition.equipRequirements);
      for (const requirement of requirements) {
        let characterValue: string | null;
        let itemValue: string;
        let noun: string;
        if (requirement.Faction) {
          characterValue = Faction[factionID];
          itemValue = requirement.Faction;
          noun = 'faction';
        } else if (requirement.Race) {
          characterValue = race?.id;
          itemValue = requirement.Race;
          noun = 'race';
        } else if (requirement.Class) {
          characterValue = classGQL?.id;
          itemValue = requirement.Class;
          noun = 'class';
        } else if (requirement.Tag) {
          characterValue = raceTags.includes(requirement.Tag) ? requirement.Tag : null;
          itemValue = requirement.Tag;
          noun = 'races';
        }
        switch (requirement.Operator) {
          case EquipmentRequirementOperator.Equals:
            if (characterValue !== itemValue) {
              errors.push(`${item.staticDefinition.name} can only be equipped by ${itemValue} ${noun}.`);
            }
            break;
          case EquipmentRequirementOperator.NotEquals:
            if (characterValue === itemValue) {
              errors.push(`${item.staticDefinition.name} cannot be equipped by ${itemValue} ${noun}.`);
            }
            break;
        }
      }
      // Equipping with missing stat requirements
      for (const itemStat of item.statList) {
        if (itemStat.statID.endsWith('Requirement')) {
          const myStat = myStats[itemStat.statID.substring(0, itemStat.statID.lastIndexOf('Requirement'))];
          if (myStat.value < itemStat.value) {
            errors.push(`${item.staticDefinition.name} requires ${itemStat.value} ${myStat.stat} to equip.`);
          }
        }
      }
    }
  }
  return errors;
};

let movePromise: Promise<RequestResult> = null;

export const attemptItemMoves = (
  moves: MoveItemRequest[],
  inventoryItems: Item[],
  equippedItems: EquippedItem[],
  factionID: Faction,
  race: RaceDefGQL,
  classGQL: ClassDefGQL,
  raceTags: string[],
  myStats: Dictionary<CharacterStatField>,
  gearSlots: Dictionary<GearSlot>,
  inventoryPendingRefreshes: number,
  equippedItemsPendingRefreshes: number,
  stackSplit: InventoryStackSplit | null,
  dispatch: Dispatch
): void => {
  // Don't allow multiple simultaneous moves
  if (movePromise || inventoryPendingRefreshes > 0 || equippedItemsPendingRefreshes > 0) {
    return;
  }

  const movesErrors = getMoveErrors(
    moves,
    inventoryItems,
    equippedItems,
    factionID,
    race,
    classGQL,
    raceTags,
    myStats,
    stackSplit
  );

  if (movesErrors.length > 0) {
    for (const movesError of movesErrors) {
      dispatch(addErrorNotice(movesError));
    }
  } else {
    const payload = moves.map((move): [MoveItemRequest, Item] => {
      const item =
        inventoryItems.find((item) => item.id === move.MoveItemID) ??
        equippedItems.find((item) => item.item.id == move.MoveItemID)?.item;
      return [move, item];
    });

    dispatch(moveInventoryItems(payload));
    dispatch(moveEquippedItems(payload));

    for (var i = 0; i < moves.length; ++i) {
      const move = moves[i];
      clientAPI.moveItem(
        move.MoveItemID,
        move.UnitCount,
        move.EntityIDFrom,
        move.CharacterIDFrom,
        move.BoneAliasFrom,
        move.LocationTo,
        move.EntityIDTo,
        move.CharacterIDTo,
        move.PositionTo,
        move.ContainerIDTo,
        move.DrawerIndexTo,
        gearSlots[move.GearSlotIDTo]?.numericID ?? 0,
        move.WorldPositionTo,
        move.RotationTo,
        move.BoneAliasTo
      );
    }

    refreshItems();
  }
};

export const performItemAction = (
  itemID: string,
  numericItemDefID: number,
  actionID: string,
  uiReaction: ItemActionUIReaction | UIReaction,
  entityID: string,
  worldPosition: Vec3f,
  rotation: Euler3f,
  boneAlias: number,
  dispatch: Dispatch
): void => {
  dispatch(hideContextMenu());
  if (uiReaction === ItemActionUIReaction.PlacementMode || uiReaction === UIReaction.PlacementMode) {
    dispatch(addMenuWidgetExiting(WIDGET_NAME_INVENTORY));
    game.itemPlacementMode.requestStart(numericItemDefID, itemID, actionID);
  } else {
    const handleUIReaction = (): void => {
      switch (uiReaction) {
        case ItemActionUIReaction.CloseInventory:
        case UIReaction.CloseInventory: {
          dispatch(addMenuWidgetExiting(WIDGET_NAME_INVENTORY));
          break;
        }
      }
    };
    if (actionID) {
      clientAPI.performItemAction(itemID, entityID, actionID, worldPosition, rotation, boneAlias);
    } else {
      handleUIReaction();
    }
  }
};

export const moveHiddenItems = (
  items: Item[],
  racesByNumericID: Dictionary<RaceDefGQL>,
  classesByNumericID: Dictionary<ClassDefGQL>,
  faction: Faction,
  race: number,
  classID: number,
  inventoryItems: Item[],
  equippedItems: EquippedItem[],
  myStats: Dictionary<CharacterStatField>,
  gearSlots: Dictionary<GearSlot>,
  stackSplit: InventoryStackSplit,
  inventoryPendingRefreshes: number,
  equippedItemsPendingRefreshes: number,
  dispatch: Dispatch
): void => {
  const moves: MoveItemRequest[] = [];
  const hiddenItems: Item[] = [];

  for (const item of items) {
    if (item.location.inventory.position === -1) {
      hiddenItems.push(item);
    }
  }

  if (hiddenItems.length === 0) {
    return;
  }

  for (let i: number = 0; hiddenItems.length > 0; i++) {
    if (items.every((item) => item.location.inventory.position !== i)) {
      const item = hiddenItems[0];
      const characterID = item.location.inventory.characterID;
      moves.push({
        MoveItemID: item.id,
        UnitCount: -1,
        EntityIDFrom: '0000000000000000000000',
        CharacterIDFrom: characterID,
        BoneAliasFrom: 0,
        LocationTo: MoveItemRequestLocationType.Inventory,
        EntityIDTo: '0000000000000000000000',
        CharacterIDTo: characterID,
        PositionTo: i,
        ContainerIDTo: '0000000000000000000000',
        DrawerIndexTo: 0,
        GearSlotIDTo: null,
        WorldPositionTo: null,
        RotationTo: null,
        BoneAliasTo: 0
      });

      hiddenItems.shift();
    }
  }

  const raceDef = racesByNumericID[race];
  const classDef = classesByNumericID[classID];

  attemptItemMoves(
    moves,
    inventoryItems,
    equippedItems,
    faction,
    raceDef,
    classDef,
    raceDef?.raceTags ?? [],
    myStats,
    gearSlots,
    inventoryPendingRefreshes,
    equippedItemsPendingRefreshes,
    stackSplit,
    dispatch
  );
};
