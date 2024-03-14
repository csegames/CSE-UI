/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  CharacterStatField,
  ClassDefGQL,
  EquippedItem,
  Item,
  ItemActionUIReaction,
  ItemResourceGQL,
  ItemType,
  RaceDefGQL,
  StatGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  ItemAPI,
  ItemPermissions,
  MoveItemRequest,
  MoveItemRequestLocation,
  MoveItemRequestLocationType,
  Faction,
  ItemActionParameters
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { ItemResourceID, ItemStatID } from './itemData';
import { InventoryStackSplit, moveInventoryItems, setShouldInventoryRefresh } from '../../redux/inventorySlice';
import { moveEquippedItems, setShouldEquippedItemsRefresh } from '../../redux/equippedItemsSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { addErrorNotice } from '../../redux/errorNoticesSlice';
import { webConf } from '../../dataSources/networkConfiguration';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { hideContextMenu } from '../../redux/contextMenuSlice';
import { addMenuWidgetExiting } from '../../redux/hudSlice';
import { WIDGET_NAME_INVENTORY } from '../inventory/Inventory';
import { game } from '@csegames/library/dist/_baseGame';
import { UIReaction } from '@csegames/library/dist/camelotunchained/game/types/ItemActions';

enum EquipmentRequirementOperator {
  Equals = 'Equals',
  NotEquals = 'NotEquals'
}

interface EquipRequirement {
  Faction?: string;
  Race?: string;
  Class?: string;
  Tag?: string;
  Operator: EquipmentRequirementOperator;
}

export const refreshItems = (dispatch: Dispatch): void => {
  dispatch(setShouldInventoryRefresh(true));
  dispatch(setShouldEquippedItemsRefresh(true));
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
      const equippedItem = equippedItems.find((equippedItem) =>
        equippedItem.item.location.equipped.gearSlots.find((gearSlot) => gearSlot.id === gearSlotID)
      );
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
          return gearSlot.id;
        }
      }
    }
  }
  return null;
};

export const isItemDroppable = (item: Item): number => {
  if (!item || !item.permissibleHolder || !item.permissibleHolder.userPermissions) {
    return ItemPermissions.All;
  }
  return item.permissibleHolder.userPermissions & ItemPermissions.Ground;
};

export const getItemUnitCount = (item: Item): number => {
  return getItemStatValue(item, ItemStatID.UnitCount) || 1;
};

export const getItemLocation = (item: Item): MoveItemRequestLocation => {
  return {
    BoneAlias: undefined,
    BuildingID: undefined,
    CharacterID: item.location.inventory?.characterID ?? item.location.equipped?.characterID,
    ContainerID: '0000000000000000000000',
    DrawerID: undefined,
    EntityID: '0000000000000000000000',
    GearSlotIDs: item.location.equipped?.gearSlots?.map((gearSlot) => gearSlot.id) ?? [],
    Location: item.location.equipped ? MoveItemRequestLocationType.Equipment : MoveItemRequestLocationType.Inventory,
    Position: item.location.inventory?.position ?? -1,
    Rotation: undefined,
    VoxSlot: 'Invalid',
    WorldPosition: undefined
  };
};

export const getInventoryIndexLocation = (inventoryIndex: number, characterID: string): MoveItemRequestLocation => {
  return {
    BoneAlias: undefined,
    BuildingID: undefined,
    CharacterID: characterID,
    ContainerID: '0000000000000000000000',
    DrawerID: undefined,
    EntityID: '0000000000000000000000',
    GearSlotIDs: [],
    Location: MoveItemRequestLocationType.Inventory,
    Position: inventoryIndex,
    Rotation: undefined,
    VoxSlot: 'Invalid',
    WorldPosition: undefined
  };
};

export const getGearSlotIDLocation = (gearSlotID: string, characterID: string): MoveItemRequestLocation => {
  return {
    BoneAlias: undefined,
    BuildingID: undefined,
    CharacterID: characterID,
    ContainerID: '0000000000000000000000',
    DrawerID: undefined,
    EntityID: '0000000000000000000000',
    GearSlotIDs: [gearSlotID],
    Location: MoveItemRequestLocationType.Equipment,
    Position: -1,
    Rotation: undefined,
    VoxSlot: 'Invalid',
    WorldPosition: undefined
  };
};

export const getGroundLocation = (): MoveItemRequestLocation => ({
  BoneAlias: undefined,
  BuildingID: undefined,
  CharacterID: undefined,
  ContainerID: '0000000000000000000000',
  DrawerID: undefined,
  EntityID: '0000000000000000000000',
  GearSlotIDs: [],
  Location: MoveItemRequestLocationType.Ground,
  Position: -1,
  Rotation: undefined,
  VoxSlot: 'Invalid',
  WorldPosition: undefined
});

export const canItemsStack = (itemA: Item, itemB: Item): boolean => {
  if (itemA.staticDefinition.id !== itemB.staticDefinition.id) {
    return false;
  }

  // If either of these items are restricted to a scenario, they both have to be restricted to the same scenario.
  if (
    itemA.scenarioRelationship?.restrictedToScenario !== itemB.scenarioRelationship?.restrictedToScenario ||
    itemA.scenarioRelationship?.scenarioID !== itemB.scenarioRelationship?.scenarioID
  ) {
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

    let targetItem: Item | null = null;
    if (move.To.Location === MoveItemRequestLocationType.Inventory) {
      targetItem = inventoryItems.find(
        (inventoryItem) => inventoryItem.location.inventory.position === move.To.Position
      );
    }
    if (move.To.Location === MoveItemRequestLocationType.Equipment) {
      targetItem = equippedItems.find((equippedItem) =>
        equippedItem.item.location.equipped.gearSlots.some((gearSlot) => move.To.GearSlotIDs.includes(gearSlot.id))
      )?.item;
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

    if (move.To.Location === MoveItemRequestLocationType.Equipment) {
      // Equipping to wrong equip slot
      if (
        item.staticDefinition.gearSlotSets.every((gearSlotSet) =>
          gearSlotSet.gearSlots.every((gearSlot) => gearSlot.id !== move.To.GearSlotIDs[0])
        )
      ) {
        errors.push(`${item.staticDefinition.name} cannot be equipped to ${move.To.GearSlotIDs[0]}.`);
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
  inventoryPendingRefreshes: number,
  equippedItemsPendingRefreshes: number,
  stackSplit: InventoryStackSplit | null,
  dispatch: Dispatch
): void => {
  // Don't allow multiple simultaneous moves
  if (movePromise || inventoryPendingRefreshes > 0 || equippedItemsPendingRefreshes > 0) {
    return;
  }
  // Filter out same-location moves
  const filteredMoves = moves.filter(
    (move) => move.From.Location !== move.To.Location || move.From.Position !== move.To.Position
  );
  if (filteredMoves.length === 0) {
    return;
  }
  const movesErrors = getMoveErrors(
    filteredMoves,
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
    const payload = filteredMoves.map((move): [MoveItemRequest, Item] => {
      switch (move.From.Location) {
        case MoveItemRequestLocationType.Inventory:
          return [move, inventoryItems.find((item) => item.id === move.MoveItemID)];
        case MoveItemRequestLocationType.Equipment:
          return [
            move,
            equippedItems.find((equippedItem) =>
              equippedItem.item.location.equipped.gearSlots.some((gearSlot) =>
                move.From.GearSlotIDs.includes(gearSlot.id)
              )
            ).item
          ];
      }
    });
    dispatch(moveInventoryItems(payload));
    dispatch(moveEquippedItems(payload));
    movePromise =
      filteredMoves.length === 1
        ? ItemAPI.MoveItems(webConf, filteredMoves[0])
        : ItemAPI.BatchMoveItems(webConf, filteredMoves);
    movePromise.finally((): void => {
      movePromise = null;
      refreshItems(dispatch);
    });
  }
};

export const performItemAction = (
  itemID: string,
  numericItemDefID: number,
  actionID: string,
  uiReaction: ItemActionUIReaction | UIReaction,
  entityID: string,
  actionParameters: ItemActionParameters | null,
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
      ItemAPI.PerformItemAction(webConf, itemID, entityID, actionID, actionParameters)
        .then((res): void => {
          if (!res.ok) {
            const data = JSON.parse(res.data);
            if (data.FieldCodes && data.FieldCodes.length > 0) {
              dispatch(addErrorNotice(data.FieldCodes[0].Message));
            } else {
              dispatch(addErrorNotice('An error occured.'));
            }
          }
          handleUIReaction();
        })
        .catch((): void => {
          dispatch(addErrorNotice('An error occured.'));
        })
        .finally((): void => {
          refreshItems(dispatch);
        });
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

  for (let i: number = 0; hiddenItems.length > 0; i++) {
    if (items.every((item) => item.location.inventory.position !== i)) {
      const startLocation: MoveItemRequestLocation = getItemLocation(hiddenItems[0]);
      const targetLocation: MoveItemRequestLocation = getInventoryIndexLocation(i, startLocation.CharacterID);
      moves.push({
        MoveItemID: hiddenItems[0].id,
        StackHash: hiddenItems[0].stackHash,
        UnitCount: -1,
        From: startLocation,
        To: targetLocation
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
    inventoryPendingRefreshes,
    equippedItemsPendingRefreshes,
    stackSplit,
    dispatch
  );
};
