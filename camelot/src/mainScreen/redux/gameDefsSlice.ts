/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  AbilityComponentDefRef,
  AbilityNetworkDef,
  AbilityNetworkRequirementGQL,
  CharacterStatField,
  FactionDef,
  GameSettingsDef,
  GearSlotDefRef,
  ItemDefRef,
  EntityResourceDefinitionGQL,
  ItemStatDefinitionGQL,
  ItemTooltipCategoryDef,
  StatDefinitionGQL,
  StatusDef,
  SubstanceDefRef,
  DamageTypeDefGQL,
  ClassDefGQL,
  RaceDefGQL,
  GenderDefGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import {
  AbilityBookTabsData,
  AbilityNetworksData,
  UserClassesData
} from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AbilityDisplayData {
  id: number;
  name: string;
  description: string;
  icon: string;
  readOnly: boolean;
  abilityComponentIds: string[];
  abilityNetworkId: string | null;
}

export type AbilityNetworkDefData = AbilityNetworkDef & AbilityNetworksData;

// The GQL type references ItemDefRef, which becomes an infinite recursion, so we
// replace the full ItemDefRef with an ID that we can look up separately.
export interface SubstanceDefRefData extends Omit<SubstanceDefRef, 'purifyItemDef'> {
  purifyItemDefId: string;
}

// To prevent recursion, we replace the SubstanceDefRef with a version that doesn't
// directly link back to an ItemDefRef.
export interface ItemDefRefData extends Omit<ItemDefRef, 'substanceDefinition'> {
  substanceDefinition: SubstanceDefRefData;
}

export interface FactionData extends FactionDef {
  defaultArchetypeFrameURL: string;
  nameplateBackgroundURL: string;
  nameplateMainFrameURL: string;
  nameplateMiniFrameURL: string;
  nameplateProfilePictureURL: string;
  emptyAbilitySlotURL: string;
  groupIconURLs: string[];
  abilityBuilderBackgroundURL: string;
  scoreboardBackgroundColor: string;
  scoreboardTextColor: string;
  paperdollBackgroundImage: string;
  paperdollBaseImage: string;
}

// To prevent recursion, we replace the component refs with a simple id that we can look up in the AbilityComponents list.
export interface AbilityNetworkRequirementsGQLData
  extends Omit<AbilityNetworkRequirementGQL, 'excludeComponent' | 'requireComponent'> {
  excludeComponentId: string | null;
  requireComponentId: string | null;
}

export interface AbilityComponentDefRefData extends Omit<AbilityComponentDefRef, 'networkRequirements'> {
  networkRequirements: AbilityNetworkRequirementsGQLData[];
}

interface GameDefsState {
  abilityBookTabs: AbilityBookTabsData[];
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  /** Static data relevant to displaying abilities in the UI (icon, etc.). */
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  /** URLs for all approved icons that can be used when building abilities. */
  abilityIconURLs: string[];
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  classesByStringID: Dictionary<ClassDefGQL>;
  classesByNumericID: Dictionary<ClassDefGQL>;
  classDynamicAssets: Dictionary<UserClassesData>;
  damageTypes: Dictionary<DamageTypeDefGQL>;
  entityResources: Dictionary<EntityResourceDefinitionGQL>;
  factions: Dictionary<FactionData>;
  gearSlots: Dictionary<GearSlotDefRef>;
  itemStats: Dictionary<ItemStatDefinitionGQL>;
  itemTooltipCategories: Dictionary<ItemTooltipCategoryDef>;
  items: Dictionary<ItemDefRefData>;
  racesByStringID: Dictionary<RaceDefGQL>;
  racesByNumericID: Dictionary<RaceDefGQL>;
  gendersByStringID: Dictionary<GenderDefGQL>;
  gendersByNumericID: Dictionary<GenderDefGQL>;
  myStats: Dictionary<CharacterStatField>;
  settings: GameSettingsDef;
  stats: Dictionary<StatDefinitionGQL>;
  statusesByStringID: Dictionary<StatusDef>;
  statusesByNumericID: Dictionary<StatusDef>;
  shouldRefetchMyCharacterAbilities: boolean;
}

function buildDefaultGameDefsState() {
  const DefaultGameDefsState: GameDefsState = {
    abilityBookTabs: [],
    abilityComponents: {},
    abilityDisplayData: {},
    abilityIconURLs: [],
    abilityNetworks: {},
    classesByStringID: {},
    classesByNumericID: {},
    classDynamicAssets: {},
    damageTypes: {},
    entityResources: {},
    factions: {},
    gearSlots: {},
    itemStats: {},
    itemTooltipCategories: {},
    items: {},
    myStats: {},
    racesByStringID: {},
    racesByNumericID: {},
    gendersByStringID: {},
    gendersByNumericID: {},
    settings: null,
    stats: {},
    statusesByStringID: {},
    statusesByNumericID: {},
    shouldRefetchMyCharacterAbilities: false
  };

  return DefaultGameDefsState;
}

export const gameDefsSlice = createSlice({
  name: 'gameDefs',
  initialState: buildDefaultGameDefsState(),
  reducers: {
    updateAbilityBookTabs: (state: GameDefsState, action: PayloadAction<AbilityBookTabsData[]>) => {
      state.abilityBookTabs = action.payload ?? [];
    },
    updateClasses: (state: GameDefsState, action: PayloadAction<[Dictionary<ClassDefGQL>, Dictionary<ClassDefGQL>]>) => {
      const [byString, byNumber] = action.payload;
      state.classesByStringID = byString ?? {};
      state.classesByNumericID = byNumber ?? {};
    },
    updateClassDynamicAssets: (state: GameDefsState, action: PayloadAction<Dictionary<UserClassesData>>) => {
      state.classDynamicAssets = action.payload ?? {};
    },
    updateRaces: (state: GameDefsState, action: PayloadAction<[Dictionary<RaceDefGQL>, Dictionary<RaceDefGQL>]>) => {
      const [byString, byNumber] = action.payload;
      state.racesByStringID = byString ?? {};
      state.racesByNumericID = byNumber ?? {};
    },
    updateGenders: (state: GameDefsState, action: PayloadAction<[Dictionary<GenderDefGQL>, Dictionary<GenderDefGQL>]>) => {
      const [byString, byNumber] = action.payload;
      state.gendersByStringID = byString ?? {};
      state.gendersByNumericID = byNumber ?? {};
    },
    updateEntityResources: (state: GameDefsState, action: PayloadAction<Dictionary<EntityResourceDefinitionGQL>>) => {
      state.entityResources = action.payload ?? {};
    },
    updateFactions: (state: GameDefsState, action: PayloadAction<Dictionary<FactionData>>) => {
      state.factions = action.payload ?? {};
    },
    updateGearSlots: (state: GameDefsState, action: PayloadAction<Dictionary<GearSlotDefRef>>) => {
      state.gearSlots = action.payload ?? {};
    },
    updateItems: (state: GameDefsState, action: PayloadAction<Dictionary<ItemDefRefData>>) => {
      state.items = action.payload ?? {};
    },
    updateItemStats: (state: GameDefsState, action: PayloadAction<Dictionary<ItemStatDefinitionGQL>>) => {
      state.itemStats = action.payload ?? {};
    },
    updateItemTooltipCategories: (state: GameDefsState, action: PayloadAction<Dictionary<ItemTooltipCategoryDef>>) => {
      state.itemTooltipCategories = action.payload ?? {};
    },
    updateMyStats: (state: GameDefsState, action: PayloadAction<Dictionary<CharacterStatField>>) => {
      state.myStats = action.payload ?? {};
    },
    updateSettings: (state: GameDefsState, action: PayloadAction<GameSettingsDef>) => {
      state.settings = action.payload;
    },
    updateStats: (state: GameDefsState, action: PayloadAction<Dictionary<StatDefinitionGQL>>) => {
      state.stats = action.payload ?? {};
    },
    updateStatuses: (state: GameDefsState, action: PayloadAction<[Dictionary<StatusDef>, Dictionary<StatusDef>]>) => {
      const [statusesByStringID, statusesByNumericID] = action.payload;
      state.statusesByStringID = statusesByStringID;
      state.statusesByNumericID = statusesByNumericID;
    },
    updateAbilityDisplayData: (state: GameDefsState, action: PayloadAction<AbilityDisplayData>) => {
      state.abilityDisplayData[action.payload.id] = action.payload;
    },
    deleteAbilityDisplayData: (state: GameDefsState, action: PayloadAction<number>) => {
      delete state.abilityDisplayData[action.payload];
    },
    updateAbilityNetworks: (state: GameDefsState, action: PayloadAction<Dictionary<AbilityNetworkDefData>>) => {
      state.abilityNetworks = action.payload;
    },
    updateAbilityComponents: (state: GameDefsState, action: PayloadAction<Dictionary<AbilityComponentDefRefData>>) => {
      state.abilityComponents = action.payload;
    },
    updateAbilityIconURLs: (state: GameDefsState, action: PayloadAction<string[]>) => {
      state.abilityIconURLs = action.payload;
    },
    updateDamageTypes: (state: GameDefsState, action: PayloadAction<Dictionary<DamageTypeDefGQL>>) => {
      state.damageTypes = action.payload;
    },
    setShouldRefetchMyCharacterAbilities: (state: GameDefsState, action: PayloadAction<boolean>) => {
      state.shouldRefetchMyCharacterAbilities = action.payload;
    }
  }
});

export const {
  updateAbilityBookTabs,
  updateClasses,
  updateClassDynamicAssets,
  updateRaces,
  updateGenders,
  updateEntityResources,
  updateFactions,
  updateGearSlots,
  updateItems,
  updateItemStats,
  updateItemTooltipCategories,
  updateMyStats,
  updateSettings,
  updateStats,
  updateStatuses,
  updateAbilityDisplayData,
  deleteAbilityDisplayData,
  updateAbilityComponents,
  updateAbilityNetworks,
  updateAbilityIconURLs,
  updateDamageTypes,
  setShouldRefetchMyCharacterAbilities
} = gameDefsSlice.actions;
