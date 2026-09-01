/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AbilityBookTabDef } from '../dataSources/manifest/abilityBookTabManifest';
import { AbilityComponentCategoryDef } from '../dataSources/manifest/abilityComponentCategoryManifest';
import { AbilityComponentDef } from '../dataSources/manifest/abilityComponentManifest';
import { AbilityDisplayDef } from '../dataSources/manifest/abilityDisplayManifest';
import { AbilityNetworkDef } from '../dataSources/manifest/abilityNetworkManifest';
import { ArmorCategoryDef } from '../dataSources/manifest/armorCategoryManifest';
import { BodyTypeDef } from '../dataSources/manifest/bodyTypeManifest';
import { ClassDef } from '../dataSources/manifest/classManifest';
import { CraftingJobDef } from '../dataSources/manifest/craftingJobManifest';
import { DamageTypeDef } from '../dataSources/manifest/damageTypeManifest';
import { EntityResourceDef } from '../dataSources/manifest/entityResourceManifest';
import { FactionDef } from '../dataSources/manifest/factionManifest';
import { GameSettingsDef } from '../dataSources/manifest/gameSettingsManifest';
import { GearSlotDef } from '../dataSources/manifest/gearSlotManifest';
import { IngredientEffectDef } from '../dataSources/manifest/ingredientEffectManifest';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { ItemModSetDef } from '../dataSources/manifest/itemModSetManifest';
import { ItemRecipeDef } from '../dataSources/manifest/itemRecipeManifest';
import { ItemTooltipCategoryDef } from '../dataSources/manifest/itemTooltipCategoryManifest';
import { RaceDef } from '../dataSources/manifest/raceManifest';
import { RequirementDef } from '../dataSources/manifest/requirementManifest';
import { StatLoadoutDef } from '../dataSources/manifest/statLoadoutManifest';
import { StatDef } from '../dataSources/manifest/statManifest';
import { StatusDef } from '../dataSources/manifest/statusManifest';
import { WeaponCategoryDef } from '../dataSources/manifest/weaponCategoryManifest';
import { WeaponClassDef } from '../dataSources/manifest/weaponClassManifest';
import { WeaponTypeDef } from '../dataSources/manifest/weaponTypeManifest';
import { ProgressionTrackDef } from '../dataSources/manifest/progressionTrackManifest';
import { QuestDef } from '../dataSources/manifest/questDefManifest';

export interface GameDefsState {
  abilityBookTabs: AbilityBookTabDef[];
  abilityComponents: Dictionary<AbilityComponentDef>;
  abilityComponentCategories: Dictionary<AbilityComponentCategoryDef>;
  abilityDisplayDefsByNumericID: Record<number, AbilityDisplayDef>;
  abilityDisplayDefsByStringID: Record<string, AbilityDisplayDef>;
  abilityNetworks: Dictionary<AbilityNetworkDef>;
  armorCategories: Record<string, ArmorCategoryDef>;
  bodyTypesByNumericID: Record<number, BodyTypeDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  classesByNumericID: Record<number, ClassDef>;
  classesByStringID: Record<string, ClassDef>;
  craftingJobs: Dictionary<CraftingJobDef>;
  damageTypesByNumericID: Record<number, DamageTypeDef>;
  damageTypesByStringID: Record<string, DamageTypeDef>;
  entityResourcesByNumericID: Record<number, EntityResourceDef>;
  entityResourcesByStringID: Record<string, EntityResourceDef>;
  factions: Record<string, FactionDef>;
  gearSlots: Record<string, GearSlotDef>;
  ingredientEffectsByStringID: Record<string, IngredientEffectDef>;
  ingredientEffectsByNumericID: Record<number, IngredientEffectDef>;
  itemRecipes: Record<string, ItemRecipeDef>;
  itemsByNumericID: Record<number, ItemDef>;
  itemsByStringID: Record<string, ItemDef>;
  itemModSetsByStringID: Record<string, ItemModSetDef>;
  itemModSetsByNumericID: Record<number, ItemModSetDef>;
  itemTooltipCategories: Record<string, ItemTooltipCategoryDef>;
  progressionTracks: Record<string, ProgressionTrackDef>;
  questDefs: Record<string, QuestDef>;
  racesByNumericID: Record<number, RaceDef>;
  racesByStringID: Record<string, RaceDef>;
  requirements: Dictionary<RequirementDef>;
  settings: GameSettingsDef;
  statLoadouts: Record<string, StatLoadoutDef>;
  stats: Record<string, StatDef>;
  statsByNumericID: Record<number, StatDef>;
  statusesByNumericID: Dictionary<StatusDef>;
  statusesByStringID: Dictionary<StatusDef>;
  tagAffixByNumericID: Record<number, string>;
  tagAffixIDByStringID: Record<string, number>;
  weaponCategories: Record<string, WeaponCategoryDef>;
  weaponClasses: Record<string, WeaponClassDef>;
  weaponTypes: Record<string, WeaponTypeDef>;
  shouldRefetchMyCharacterAbilities: boolean;
  useClientResourceManifests: boolean;
}

function buildDefaultGameDefsState() {
  const DefaultGameDefsState: GameDefsState = {
    abilityBookTabs: [],
    abilityComponentCategories: {},
    abilityComponents: {},
    abilityDisplayDefsByStringID: {},
    abilityDisplayDefsByNumericID: {},
    abilityNetworks: {},
    armorCategories: {},
    bodyTypesByNumericID: {},
    bodyTypesByStringID: {},
    classesByNumericID: {},
    classesByStringID: {},
    craftingJobs: {},
    damageTypesByNumericID: {},
    damageTypesByStringID: {},
    entityResourcesByNumericID: {},
    entityResourcesByStringID: {},
    factions: {},
    gearSlots: {},
    ingredientEffectsByStringID: {},
    ingredientEffectsByNumericID: {},
    itemRecipes: {},
    itemsByNumericID: {},
    itemsByStringID: {},
    itemModSetsByNumericID: {},
    itemModSetsByStringID: {},
    itemTooltipCategories: {},
    progressionTracks: {},
    questDefs: {},
    racesByNumericID: {},
    racesByStringID: {},
    requirements: {},
    settings: null,
    statLoadouts: {},
    stats: {},
    statsByNumericID: {},
    statusesByNumericID: {},
    statusesByStringID: {},
    tagAffixByNumericID: {},
    tagAffixIDByStringID: {},
    weaponCategories: {},
    weaponClasses: {},
    weaponTypes: {},
    shouldRefetchMyCharacterAbilities: false,
    useClientResourceManifests: true
  };

  return DefaultGameDefsState;
}

export const gameDefsSlice = createSlice({
  name: 'gameDefs',
  initialState: buildDefaultGameDefsState(),
  reducers: {
    updateAbilityBookTabs: (state: GameDefsState, action: PayloadAction<AbilityBookTabDef[]>) => {
      state.abilityBookTabs = action.payload ?? [];
    },
    updateAbilityDisplayDefs: (
      state: GameDefsState,
      action: PayloadAction<{
        abilityDisplayDefsByStringID: Record<string, AbilityDisplayDef>;
        abilityDisplayDefsByNumericID: Record<number, AbilityDisplayDef>;
      }>
    ) => {
      state.abilityDisplayDefsByStringID = action.payload.abilityDisplayDefsByStringID;
      state.abilityDisplayDefsByNumericID = action.payload.abilityDisplayDefsByNumericID;
    },
    updateAbilityNetworks: (state: GameDefsState, action: PayloadAction<Dictionary<AbilityNetworkDef>>) => {
      state.abilityNetworks = action.payload;
    },
    updateAbilityComponentCategories: (
      state: GameDefsState,
      action: PayloadAction<Dictionary<AbilityComponentCategoryDef>>
    ) => {
      state.abilityComponentCategories = action.payload;
    },
    updateAbilityComponents: (state: GameDefsState, action: PayloadAction<Dictionary<AbilityComponentDef>>) => {
      state.abilityComponents = action.payload;
    },
    updateArmorCategories: (state: GameDefsState, action: PayloadAction<Record<string, ArmorCategoryDef>>) => {
      state.armorCategories = action.payload ?? {};
    },
    updateBodyTypes: (
      state: GameDefsState,
      action: PayloadAction<[Record<string, BodyTypeDef>, Record<number, BodyTypeDef>]>
    ) => {
      const [byString, byNumber] = action.payload;
      state.bodyTypesByStringID = byString ?? {};
      state.bodyTypesByNumericID = byNumber ?? {};
    },
    updateClasses: (
      state: GameDefsState,
      action: PayloadAction<[Record<string, ClassDef>, Record<number, ClassDef>]>
    ) => {
      const [byString, byNumber] = action.payload;
      state.classesByStringID = byString ?? {};
      state.classesByNumericID = byNumber ?? {};
    },
    updateCraftingJobs: (state: GameDefsState, action: PayloadAction<Dictionary<CraftingJobDef>>) => {
      state.craftingJobs = action.payload;
    },
    updateDamageTypes: (
      state: GameDefsState,
      action: PayloadAction<[Record<string, DamageTypeDef>, Record<number, DamageTypeDef>]>
    ) => {
      const [byString, byNumber] = action.payload;
      state.damageTypesByStringID = byString ?? {};
      state.damageTypesByNumericID = byNumber ?? {};
    },
    updateEntityResources: (
      state: GameDefsState,
      action: PayloadAction<[Record<string, EntityResourceDef>, Record<number, EntityResourceDef>]>
    ) => {
      const [byString, byNumber] = action.payload;
      state.entityResourcesByStringID = byString ?? {};
      state.entityResourcesByNumericID = byNumber ?? {};
    },
    updateFactions: (state: GameDefsState, action: PayloadAction<Record<string, FactionDef>>) => {
      state.factions = action.payload ?? {};
    },
    updateGearSlots: (state: GameDefsState, action: PayloadAction<Record<string, GearSlotDef>>) => {
      state.gearSlots = action.payload ?? {};
    },
    updateIngredientEffects: (
      state: GameDefsState,
      action: PayloadAction<{
        ingredientEffectsByNumericID: Record<number, IngredientEffectDef>;
        ingredientEffectsByStringID: Record<string, IngredientEffectDef>;
      }>
    ) => {
      state.ingredientEffectsByNumericID = action.payload.ingredientEffectsByNumericID ?? {};
      state.ingredientEffectsByStringID = action.payload.ingredientEffectsByStringID ?? {};
    },
    updateItems: (state: GameDefsState, action: PayloadAction<[Record<string, ItemDef>, Record<number, ItemDef>]>) => {
      const [byString, byNumber] = action.payload;
      state.itemsByStringID = byString ?? {};
      state.itemsByNumericID = byNumber ?? {};
    },
    updateItemModSets: (
      state: GameDefsState,
      action: PayloadAction<{
        itemModSetsByNumericID: Record<number, ItemModSetDef>;
        itemModSetsByStringID: Record<number, ItemModSetDef>;
      }>
    ) => {
      state.itemModSetsByNumericID = action.payload.itemModSetsByNumericID ?? {};
      state.itemModSetsByStringID = action.payload.itemModSetsByStringID ?? {};
    },
    updateItemRecipes: (state: GameDefsState, action: PayloadAction<Record<string, ItemRecipeDef>>) => {
      const itemRecipes = action.payload;
      state.itemRecipes = itemRecipes ?? {};
    },
    updateItemTooltipCategories: (
      state: GameDefsState,
      action: PayloadAction<Record<string, ItemTooltipCategoryDef>>
    ) => {
      state.itemTooltipCategories = action.payload ?? {};
    },
    updateProgressionTracks: (state: GameDefsState, action: PayloadAction<Record<string, ProgressionTrackDef>>) => {
      state.progressionTracks = action.payload;
    },
    updateQuestDefs: (state: GameDefsState, action: PayloadAction<Record<string, QuestDef>>) => {
      state.questDefs = action.payload;
    },
    updateRaces: (state: GameDefsState, action: PayloadAction<[Record<string, RaceDef>, Record<number, RaceDef>]>) => {
      const [byString, byNumber] = action.payload;
      state.racesByStringID = byString ?? {};
      state.racesByNumericID = byNumber ?? {};
    },
    updateRequirements: (state: GameDefsState, action: PayloadAction<Dictionary<RequirementDef>>) => {
      state.requirements = action.payload;
    },
    updateSettings: (state: GameDefsState, action: PayloadAction<GameSettingsDef>) => {
      state.settings = action.payload;
    },
    updateStatLoadouts: (state: GameDefsState, action: PayloadAction<Record<string, StatLoadoutDef>>) => {
      state.statLoadouts = action.payload ?? {};
    },
    updateStats: (
      state: GameDefsState,
      action: PayloadAction<[Record<string, StatDef>, Record<number, StatDef>]>
    ) => {
      const [byString, byNumber] = action.payload;
      state.stats = byString ?? {};
      state.statsByNumericID = byNumber ?? {};
    },
    updateStatuses: (state: GameDefsState, action: PayloadAction<[Dictionary<StatusDef>, Dictionary<StatusDef>]>) => {
      const [statusesByStringID, statusesByNumericID] = action.payload;
      state.statusesByStringID = statusesByStringID;
      state.statusesByNumericID = statusesByNumericID;
    },
    updateTags: (state: GameDefsState, action: PayloadAction<[Record<number, string>, Record<string, number>]>) => {
      const [tagAffixByNumericID, tagAffixIDByStringID] = action.payload;
      state.tagAffixByNumericID = tagAffixByNumericID;
      state.tagAffixIDByStringID = tagAffixIDByStringID;
    },
    updateWeaponCategories: (state: GameDefsState, action: PayloadAction<Record<string, WeaponCategoryDef>>) => {
      state.weaponCategories = action.payload ?? {};
    },
    updateWeaponClasses: (state: GameDefsState, action: PayloadAction<Record<string, WeaponClassDef>>) => {
      state.weaponClasses = action.payload ?? {};
    },
    updateWeaponTypes: (state: GameDefsState, action: PayloadAction<Record<string, WeaponTypeDef>>) => {
      state.weaponTypes = action.payload ?? {};
    },
    setShouldRefetchMyCharacterAbilities: (state: GameDefsState, action: PayloadAction<boolean>) => {
      state.shouldRefetchMyCharacterAbilities = action.payload;
    },
    setUseClientResourceManifests: (state: GameDefsState, action: PayloadAction<boolean>) => {
      state.useClientResourceManifests = action.payload;
    }
  }
});

export const {
  setShouldRefetchMyCharacterAbilities,
  setUseClientResourceManifests,
  updateAbilityBookTabs,
  updateAbilityComponentCategories,
  updateAbilityComponents,
  updateAbilityDisplayDefs,
  updateAbilityNetworks,
  updateArmorCategories,
  updateBodyTypes,
  updateClasses,
  updateCraftingJobs,
  updateDamageTypes,
  updateEntityResources,
  updateFactions,
  updateGearSlots,
  updateIngredientEffects,
  updateItemRecipes,
  updateItems,
  updateItemModSets,
  updateItemTooltipCategories,
  updateProgressionTracks,
  updateQuestDefs,
  updateRaces,
  updateRequirements,
  updateSettings,
  updateStatLoadouts,
  updateStats,
  updateStatuses,
  updateTags,
  updateWeaponCategories,
  updateWeaponClasses,
  updateWeaponTypes
} = gameDefsSlice.actions;
