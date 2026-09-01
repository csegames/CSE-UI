/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Euler3f, Vec3f } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { MoveItemRequestLocationType, Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { ItemResourceID, ItemStatID } from '../components/items/itemData';
import { InventoryStackSplit } from '../redux/inventorySlice';
import { Dispatch } from '@reduxjs/toolkit';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { hideContextMenu } from '../redux/contextMenuSlice';
import { addConditionalWidgetExiting } from '../redux/hudSlice';
import { WIDGET_ID_INVENTORY } from '../components/inventory/Inventory';
import { game } from '@csegames/library/dist/_baseGame';
import { UIReaction } from '@csegames/library/dist/camelotunchained/game/types/ItemActions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ClassDef } from '../dataSources/manifest/classManifest';
import { ItemDef, ItemType } from '../dataSources/manifest/itemManifest';
import { RaceDef } from '../dataSources/manifest/raceManifest';
import { EntityResource, EntityStat } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { StatDef } from '../dataSources/manifest/statManifest';
import {
  Item,
  ItemActionUIReaction,
  ItemLocationType,
  ItemStat
} from '@csegames/library/dist/camelotunchained/game/types/Items';
import { EntityResourceDef } from '../dataSources/manifest/entityResourceManifest';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue, getTokenizedStringTableValue, StringIDGeneralError } from './stringTableHelpers';
import { showToaster, ToasterParams } from '../redux/toastersSlice';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { getStringFromTagAffixIDs } from './tagHelpers';
import { RecipeIngredient, RequirementKind } from '../dataSources/manifest/itemRecipeManifest';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { GameDefsState } from '../redux/gameDefsSlice';

// String IDs
const StringIDItemIconErrorSplitOccupied = 'ItemIconErrorSplitOccupied';
const StringIDItemIconErrorSplitDiffering = 'ItemIconErrorSplitDiffering';
const StringIDItemIconErrorEquipSlot = 'ItemIconErrorEquipSlot';
const StringIDItemIconErrorEquipRequirementEquals = 'ItemIconErrorEquipRequirementEquals';
const StringIDItemIconErrorEquipRequirementNotEquals = 'ItemIconErrorEquipRequirementNotEquals';
const StringIDItemIconErrorEquipRequirementTagsInclude = 'ItemIconErrorEquipRequirementTagsInclude';
const StringIDItemIconErrorEquipRequirementTagsExclude = 'ItemIconErrorEquipRequirementTagsExclude';
const StringIDItemIconErrorEquipStat = 'ItemIconErrorEquipStat';
const StringIDItemIconErrorFaction = 'ItemIconErrorFaction';
const StringIDItemIconErrorRace = 'ItemIconErrorRace';
const StringIDItemIconErrorClass = 'ItemIconErrorClass';

const LowDurabilityThreshold = 0.3;

export enum CurrencyID {
  Gold = 'cur_gold'
}

export function getCurrency(id: CurrencyID, wallet: Item[], itemDefs: Record<number, ItemDef>): Item | undefined {
  const item = wallet.find((i) => {
    const def = itemDefs[i.defID];
    return def?.id === id;
  });
  return item;
}

export enum EquipmentRequirementOperator {
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
  /** When items are swapped, the server handles them from a single move request, but our local
   * Redux data handles them as two separate moves, so we need to know which MoveItemRequests
   * shouldn't be sent along to the server.
   */
  IsLocalOnly?: boolean;
}

interface TagRequirement {
  Affixes: number[];
  IsValid: boolean;
  Source: {
    file: string;
    File: string;
    line: number;
    Line: number;
  };
}

export interface EquipRequirement {
  Faction?: string;
  Race?: string;
  Class?: string;
  Tag?: string | TagRequirement;
  Operator: EquipmentRequirementOperator;
}

// Resolves from a real Item's defID, or from itemDefID for preview-only items with no Item instance
// (e.g. a crafting recipe's output).
export const getItemDefFromProps = (
  defs: GameDefsState,
  item: Item | undefined,
  itemDefID: string | undefined
): ItemDef | undefined => defs.itemsByNumericID[item?.defID ?? -1] ?? defs.itemsByStringID[itemDefID ?? ''];

export const isItemStatRenderable = (
  item: Item,
  itemStat: StatDef,
  equippedItems: Item[],
  itemsByNumericID: Record<number, ItemDef>
): boolean =>
  !!getItemStatValue(item, itemStat) || !!getItemStatCompareValue(item, itemStat, equippedItems, itemsByNumericID);

function byID(itemID: string) {
  return (item: Item) => item.instanceID === itemID;
}

// will return null if all searches fail
export const findItem = (
  itemInstanceID: string,
  inventoryItems: Item[],
  equippedItems: Item[],
  accountBankItems: Item[]
): Item | null =>
  inventoryItems.find(byID(itemInstanceID)) ??
  equippedItems.find(byID(itemInstanceID)) ??
  accountBankItems.find(byID(itemInstanceID)) ??
  null;

export const getItemStat = (item: Item | undefined, itemStat: StatDef): ItemStat | null => {
  if (!item) {
    return null;
  }
  return item.stats.find((stat) => stat.id == itemStat?.numericID) ?? null;
};

export const getItemStatValue = (item: Item | undefined, itemStat: StatDef): number =>
  getItemStat(item, itemStat)?.value ?? 0;

export const getItemStatCompareValue = (
  item: Item | undefined,
  itemStat: StatDef,
  equippedItems: Item[],
  itemsByNumericID: Record<number, ItemDef>
): number | null => {
  if (item && item.location.type != ItemLocationType.Equipped) {
    const gearSlotID = getItemGearSlotID(itemsByNumericID[item.defID]);
    if (gearSlotID) {
      const equippedItem = getItemEquippedInGearSlot(equippedItems, itemsByNumericID, gearSlotID);
      const statValue = getItemStatValue(equippedItem, itemStat);
      return getItemStatValue(item, itemStat) - statValue;
    }
  }
  return null;
};

export const getItemResource = (item: Item, resourceDef: EntityResourceDef): EntityResource | null =>
  (item?.resources ?? []).find((resource) => resource.id == resourceDef?.id) ?? null;

export const getItemResourceByID = (item: Item | undefined, resourceID: EntityResourceIDs): EntityResource | null =>
  (item?.resources ?? [])?.find((resource) => resource.id == resourceID) ?? null;

export const getItemResourceValue = (item: Item, resourceDef: EntityResourceDef): number =>
  getItemResource(item, resourceDef)?.current ?? 0;

export const getEquippedGearSlotSet = (item: Item, itemDef: ItemDef | undefined): string[] => {
  if (!item || !itemDef) {
    return [];
  }

  return itemDef.gearSlotSets[item.location.position] ?? [];
};

export function getItemIsLowDurability(item: Item): boolean {
  const durability = getItemResourceByID(item, EntityResourceIDs.Durability);
  return !!durability && durability.current / durability.max < LowDurabilityThreshold;
}

export function getItemIsBroken(item: Item): boolean {
  const durability = getItemResourceByID(item, EntityResourceIDs.Durability);
  return !!durability && durability.current <= 0;
}

export const getItemEquippedInGearSlot = (
  equippedItems: Item[],
  itemsByNumericID: Record<number, ItemDef>,
  gearSlotID: string
): Item | undefined =>
  equippedItems.find((equippedItem) =>
    getEquippedGearSlotSet(equippedItem, itemsByNumericID[equippedItem.defID]).includes(gearSlotID)
  );

// One pass over equippedItems instead of one find() per gear slot rendered. Use for hot render loops
// (e.g. Equipped.tsx); getItemEquippedInGearSlot's other call sites are infrequent single lookups.
// First-match-wins per gear slot, matching getItemEquippedInGearSlot's find() semantics, in case
// equippedItems ever transiently contains two items claiming the same slot mid-swap.
export const buildEquippedItemsByGearSlot = (
  equippedItems: Item[],
  itemsByNumericID: Record<number, ItemDef>
): Record<string, Item> => {
  const itemsByGearSlot: Record<string, Item> = {};
  for (const equippedItem of equippedItems) {
    const gearSlotIDs = getEquippedGearSlotSet(equippedItem, itemsByNumericID[equippedItem.defID]);
    for (const gearSlotID of gearSlotIDs) {
      if (!itemsByGearSlot[gearSlotID]) {
        itemsByGearSlot[gearSlotID] = equippedItem;
      }
    }
  }
  return itemsByGearSlot;
};

export const getItemGearSlotID = (itemDef: ItemDef): string | null => {
  for (const gearSlotSet of itemDef?.gearSlotSets ?? []) {
    if (gearSlotSet) {
      for (const gearSlot of gearSlotSet) {
        if (gearSlot) {
          return gearSlot;
        }
      }
    }
  }
  return null;
};

// Unlike getItemGearSlotID, checks every slot across all gearSlotSets combos, so dual-capacity gear
// (rings, earrings, dual-wield) finds both equipped items.
export const getItemComparisonEquippedItems = (
  itemDef: ItemDef | undefined,
  equippedItems: Item[],
  itemsByNumericID: Record<number, ItemDef>
): Item[] => {
  // Coherent (Chrome 46) doesn't support Array.prototype.flat(); flatten manually.
  const gearSlotIDs = new Set<string>();
  for (const gearSlotSet of itemDef?.gearSlotSets ?? []) {
    for (const gearSlotID of gearSlotSet ?? []) {
      if (gearSlotID) {
        gearSlotIDs.add(gearSlotID);
      }
    }
  }

  const seenInstanceIDs = new Set<string>();
  const comparisonItems: Item[] = [];
  for (const gearSlotID of gearSlotIDs) {
    const equippedItem = getItemEquippedInGearSlot(equippedItems, itemsByNumericID, gearSlotID);
    if (equippedItem && !seenInstanceIDs.has(equippedItem.instanceID)) {
      seenInstanceIDs.add(equippedItem.instanceID);
      comparisonItems.push(equippedItem);
    }
  }
  return comparisonItems;
};

export const ProficiencyTagPrefix = 'Proficiency.';

function parseEquipRequirements(itemDef: ItemDef | undefined): EquipRequirement[] {
  if (!itemDef?.equipRequirements) {
    return [];
  }
  try {
    return JSON.parse(itemDef.equipRequirements);
  } catch {
    return [];
  }
}

export function hasUnmetTagRequirement(
  itemDef: ItemDef | undefined,
  tagPrefix: string,
  entityTags: string[],
  defs: GameDefsState
): boolean {
  const requirements = parseEquipRequirements(itemDef);
  return requirements.some((requirement) => {
    if (!requirement.Tag) {
      return false;
    }
    const requiredTag =
      typeof requirement.Tag === 'string'
        ? requirement.Tag
        : getStringFromTagAffixIDs(requirement.Tag.Affixes, defs.tagAffixByNumericID);
    if (!requiredTag.startsWith(tagPrefix)) {
      return false;
    }
    const hasTag = entityTags.includes(requiredTag);
    const satisfied = requirement.Operator === EquipmentRequirementOperator.Equals ? hasTag : !hasTag;
    return !satisfied;
  });
}

export const isItemDroppable = (item: Item): boolean => {
  // todo - this permission check has been turned off when the item networking moved to the proxy
  // it will probably get changed into a totally new from, after which this check will need to be re-enabled
  // additionally, these two checks isItemDroppable/isItemTrashable don't actually cover all the situations
  // in the game that need to be checked permission wise.
  return false;
  //return !!(item.userPermissions & ItemPermissions.Ground);
};

export const isItemTrashable = (item: Item): boolean => {
  // todo - this permission check has been turned off when the item networking moved to the proxy
  // it will probably get changed into a totally new from, after which this check will need to be re-enabled
  // additionally, these two checks isItemDroppable/isItemTrashable don't actually cover all the situations
  // in the game that need to be checked permission wise.
  return true;
  //return !!(item.userPermissions & ItemPermissions.Trash);
};

export const getItemsUnitCount = (items?: Item[]): number => {
  return items?.reduce<number>((soFar: number, item: Item) => soFar + item.unitCount, 0) ?? 0;
};

export const canItemsStack = (
  itemA: Item,
  itemB: Item,
  itemsByNumericID: Record<number, ItemDef>,
  statDefsByStringID: Dictionary<StatDef>,
  resourceDefsByStringID: Dictionary<EntityResourceDef>
): boolean => {
  if (itemA.defID !== itemB.defID) {
    return false;
  }

  const itemDef = itemsByNumericID[itemA.defID];
  if (!itemDef) {
    return false;
  }

  // Infusions, reagents, and solvents stack if they are the same item type
  if (
    itemDef.itemType == ItemType.Infusion ||
    itemDef.itemType == ItemType.Solvent ||
    itemDef.itemType == ItemType.Reagent
  ) {
    return true;
  }

  // Two alchemy containers of the same type can stack as long as they are both empty
  if (
    itemDef.itemType == ItemType.AlchemyContainer &&
    getItemResourceValue(itemA, resourceDefsByStringID[ItemResourceID.Doses]) == 0 &&
    getItemResourceValue(itemB, resourceDefsByStringID[ItemResourceID.Doses]) == 0
  ) {
    return true;
  }

  if (
    (itemDef.itemType === ItemType.Substance ||
      itemDef.itemType === ItemType.Block ||
      itemDef.itemType === ItemType.CraftingMaterial) &&
    getItemStatValue(itemA, statDefsByStringID[ItemStatID.Quality]) ===
      getItemStatValue(itemB, statDefsByStringID[ItemStatID.Quality])
  ) {
    return true;
  }

  if (itemDef.itemType === ItemType.Ammo || itemDef.itemType === ItemType.Alloy) {
    return itemA.stackHash === itemB.stackHash;
  }

  // Currency of the same type can always stack
  if (itemDef.itemType === ItemType.Currency) {
    return true;
  }

  return false;
};

export const getMoveErrors = (
  moves: MoveItemRequest[],
  inventoryItems: Item[],
  equippedItems: Item[],
  accountBankItems: Item[],
  factionID: Faction,
  race: RaceDef,
  classGQL: ClassDef,
  entityTags: string[],
  myStats: Record<number, EntityStat>,
  stackSplit: InventoryStackSplit | null,
  stringTable: Record<string, StringTableEntryDef>,
  defs: GameDefsState
): string[] => {
  const errors: string[] = [];

  const isEquipping = !!moves.find((move) => move.LocationTo === MoveItemRequestLocationType.Equipment);

  for (const move of moves) {
    const item = findItem(move.MoveItemID, inventoryItems, equippedItems, accountBankItems);

    // find the item we'd be combining this moved item with (if any)
    let targetItem: Item | undefined = undefined;
    if (move.LocationTo === MoveItemRequestLocationType.Inventory) {
      targetItem = inventoryItems.find((inventoryItem) => inventoryItem.location.position === move.PositionTo);
    } else if (move.LocationTo === MoveItemRequestLocationType.AccountBank) {
      targetItem = accountBankItems.find((accountBankItem) => accountBankItem.location.position === move.PositionTo);
    } else if (move.LocationTo === MoveItemRequestLocationType.Equipment) {
      targetItem = getItemEquippedInGearSlot(equippedItems, defs.itemsByNumericID, move.GearSlotIDTo);
    }

    const itemDef = defs.itemsByNumericID[item?.defID ?? -1];

    // Splitting a stack to an occupied slot
    if (item && item.instanceID === stackSplit?.itemInstanceID && targetItem) {
      errors.push(
        getTokenizedStringTableValue(StringIDItemIconErrorSplitOccupied, stringTable, {
          ITEM: itemDef?.name
        })
      );
    }
    // Splitting a stack to same item but incompatible stacks.
    // If we are equipping something (like swapping out a damaged item for an identical but unbroken one), then this is a
    // replacement rather than a split, so it's not an error.
    else if (
      !isEquipping &&
      targetItem &&
      item?.defID === targetItem.defID &&
      itemDef?.isStackableItem &&
      !canItemsStack(item, targetItem, defs.itemsByNumericID, defs.stats, defs.entityResourcesByStringID)
    ) {
      errors.push(
        getTokenizedStringTableValue(StringIDItemIconErrorSplitDiffering, stringTable, {
          ITEM: itemDef?.name
        })
      );
    }

    if (move.LocationTo === MoveItemRequestLocationType.Equipment) {
      // Equipping to wrong equip slot
      if (
        itemDef?.gearSlotSets.every((gearSlotSet) => gearSlotSet.every((gearSlot) => gearSlot !== move.GearSlotIDTo))
      ) {
        errors.push(
          getTokenizedStringTableValue(StringIDItemIconErrorEquipSlot, stringTable, {
            ITEM: itemDef?.name,
            SLOT: move.GearSlotIDTo
          })
        );
      }
      // Equipping with incompatible faction, race, class or race tags
      const requirements = parseEquipRequirements(itemDef);
      for (const requirement of requirements) {
        let characterValue: string | null = null;
        let itemValue: string = '';
        let noun: string = '';
        if (requirement.Faction) {
          characterValue = Faction[factionID];
          itemValue = requirement.Faction;
          noun = getStringTableValue(StringIDItemIconErrorFaction, stringTable);
        } else if (requirement.Race) {
          characterValue = race?.id;
          itemValue = requirement.Race;
          noun = getStringTableValue(StringIDItemIconErrorRace, stringTable);
        } else if (requirement.Class) {
          characterValue = classGQL?.id;
          itemValue = requirement.Class;
          noun = getStringTableValue(StringIDItemIconErrorClass, stringTable);
        } else if (requirement.Tag) {
          const requiredTag =
            typeof requirement.Tag === 'string'
              ? requirement.Tag // String tag.
              : getStringFromTagAffixIDs(requirement.Tag.Affixes, defs.tagAffixByNumericID); // Minimized tag.
          characterValue = entityTags.includes(requiredTag) ? requiredTag : null;
          itemValue = requiredTag;
        }
        switch (requirement.Operator) {
          case EquipmentRequirementOperator.Equals:
            if (characterValue !== itemValue) {
              if (requirement.Tag) {
                errors.push(
                  getTokenizedStringTableValue(StringIDItemIconErrorEquipRequirementTagsInclude, stringTable, {
                    ITEM: itemDef?.name,
                    REQUIREMENT: itemValue
                  })
                );
              } else {
                errors.push(
                  getTokenizedStringTableValue(StringIDItemIconErrorEquipRequirementEquals, stringTable, {
                    ITEM: itemDef?.name,
                    REQUIREMENT: itemValue,
                    NOUN: noun
                  })
                );
              }
            }
            break;
          case EquipmentRequirementOperator.NotEquals:
            if (characterValue === itemValue) {
              if (requirement.Tag) {
                errors.push(
                  getTokenizedStringTableValue(StringIDItemIconErrorEquipRequirementTagsExclude, stringTable, {
                    ITEM: itemDef?.name,
                    REQUIREMENT: itemValue
                  })
                );
              } else {
                errors.push(
                  getTokenizedStringTableValue(StringIDItemIconErrorEquipRequirementNotEquals, stringTable, {
                    ITEM: itemDef?.name,
                    REQUIREMENT: itemValue,
                    NOUN: noun
                  })
                );
              }
            }
            break;
        }
      }
      // Equipping with missing stat requirements
      for (const itemStat of item?.stats ?? []) {
        const itemStatDef = defs.statsByNumericID[itemStat.id];
        if (itemStatDef) {
          const playerStat: StatDef | undefined = Object.values(defs.stats).find(
            (s) => s.itemRequirementStatID == itemStatDef.id
          );

          if (playerStat) {
            const myStat = myStats[playerStat.numericID];
            if (myStat?.value < itemStat.value) {
              errors.push(
                getTokenizedStringTableValue(StringIDItemIconErrorEquipStat, stringTable, {
                  ITEM: itemDef?.name,
                  STAT_VALUE: String(itemStat.value),
                  STAT_NAME: playerStat.name
                })
              );
            }
          }
        }
      }
    }
  }
  return errors;
};

export const attemptItemMoves = (
  moves: MoveItemRequest[],
  inventoryItems: Item[],
  equippedItems: Item[],
  accountBankItems: Item[],
  factionID: Faction,
  race: RaceDef,
  classDef: ClassDef,
  entityTags: string[],
  myStats: Record<number, EntityStat>,
  stackSplit: InventoryStackSplit | null,
  stringTable: Record<string, StringTableEntryDef>,
  defs: GameDefsState,
  dispatch: Dispatch
): void => {
  const movesErrors = getMoveErrors(
    moves,
    inventoryItems,
    equippedItems,
    accountBankItems,
    factionID,
    race,
    classDef,
    entityTags,
    myStats,
    stackSplit,
    stringTable,
    defs
  );

  if (movesErrors.length > 0) {
    for (const movesError of movesErrors) {
      const params: ToasterParams = {
        id: genID(),
        content: {
          title: getStringTableValue(StringIDGeneralError, stringTable),
          message: movesError,
          isError: true
        }
      };
      dispatch(showToaster(params));
    }
  } else {
    for (var i = 0; i < moves.length; ++i) {
      const move = moves[i];
      // When items swap positions, the server handles them from a single move request, but
      // our Redux setup uses two separate requests.  This check ensures that we don't send
      // the local-only request unnecessarily, since it will be a no-op.
      if (!move.IsLocalOnly) {
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
          defs.gearSlots[move.GearSlotIDTo]?.numericID ?? 0,
          move.WorldPositionTo,
          move.RotationTo,
          move.BoneAliasTo
        );
      }
    }
  }
};

export const performItemAction = (
  itemID: string,
  numericItemDefID: number,
  actionID: string,
  uiReaction: ItemActionUIReaction | UIReaction,
  entityID: string,
  boneAlias: number,
  dispatch: Dispatch
): void => {
  dispatch(hideContextMenu());
  if (uiReaction === ItemActionUIReaction.PlacementMode || uiReaction === UIReaction.PlacementMode) {
    dispatch(addConditionalWidgetExiting(WIDGET_ID_INVENTORY));
    game.itemPlacementMode.requestStart(numericItemDefID, itemID, actionID);
  } else {
    const handleUIReaction = (): void => {
      switch (uiReaction) {
        case ItemActionUIReaction.CloseInventory:
        case UIReaction.CloseInventory: {
          dispatch(addConditionalWidgetExiting(WIDGET_ID_INVENTORY));
          break;
        }
      }
    };
    if (actionID) {
      clientAPI.performItemAction(itemID, entityID, actionID, null, null, boneAlias);
    } else {
      handleUIReaction();
    }
  }
};

export const useInventoryItem = (itemID: string, dispatch: Dispatch, targetItemInstanceID?: string): void => {
  dispatch(hideContextMenu());
  clientAPI.useInventoryItem(itemID, targetItemInstanceID ?? '');
};

export function doesItemMatchIngredient(
  item: Item,
  ingredient: RecipeIngredient,
  itemsByStringID: Record<string, ItemDef>,
  itemStatsByStringID: Record<string, StatDef>
): boolean {
  const { requirements } = ingredient;

  let isMatch = true;

  requirements.forEach((req) => {
    if (!isMatch) {
      return;
    }

    switch (req.Kind) {
      case RequirementKind.ItemID: {
        const requiredItemDef = itemsByStringID[req.ItemDef];
        isMatch = requiredItemDef.numericID === item.defID;
        break;
      }
      case RequirementKind.ItemStat: {
        const statValue = getItemStatValue(item, itemStatsByStringID[req.Stat]);
        isMatch = statValue >= req.MinVal;
        break;
      }
    }
  });

  return isMatch;
}

export function getItemCountForIngredient(ingredient: RecipeIngredient, items: Item[], defs: GameDefsState): number {
  return items.reduce<number>((soFar: number, item: Item) => {
    if (doesItemMatchIngredient(item, ingredient, defs.itemsByStringID, defs.stats)) {
      soFar += item.unitCount;
    }

    return soFar;
  }, 0);
}
