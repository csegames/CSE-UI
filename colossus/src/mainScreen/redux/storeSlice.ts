/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PurchaseDefGQL, RMTPurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreStaticDataQueryResult } from '../dataSources/storeNetworkingConstants';
import { QuestDef } from '../dataSources/manifest/questManifest';
import { PerkDef } from '../dataSources/manifest/perkManifest';

export enum StoreRoute {
  None,
  Rewards,
  Bundles,
  Weapons,
  Skins,
  Emotes,
  Portraits,
  SprintFX,
  QuestXP
}

export interface StoreState {
  // The active tab on the Store right now.
  currentRoute: StoreRoute;
  // The current champion filters used by the Store.  If not empty, only included champion items will be shown.
  championIDFilters: string[];
  // If true, fully-owned purchases will not be shown in the Store.
  hideOwnedPurchases: boolean;
  // All of the possible purchase transactions.
  purchases: PurchaseDefGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  // Static data for all perk items.
  perks: PerkDef[];
  // Indexed by perk.id for rapid lookup.
  perksByID: Dictionary<PerkDef>;
  // Purchases that should be badged as "new".  Key is the purchase ID.
  newPurchases: Dictionary<boolean>;
  // Owned equipment that should be badged as "new".  Key is the perk ID.
  newEquipment: Dictionary<boolean>;
  // flag to show the store if there are new free rewards.
  hasPurchasables: boolean;
  // which quest we're attempting to spend XP on for the SpendQuestXPPotionsModal
  spendXPPotionQuest: QuestDef;
  // What purchase should we attempt to process?
  purchaseIdToProcess: string;
  // If the next time we process a purchase we should suppress alerts
  suppressAlertStarOnNextPurchase: boolean;
  // Used by ConfirmPurchase to display reward previews.
  confirmPurchaseSelectedRewardIndex: number;

  isDataFetched: boolean;
}

function generateDefaultStoreState() {
  const defaultStoreState: StoreState = {
    currentRoute: StoreRoute.None,
    championIDFilters: [],
    hideOwnedPurchases: false,
    purchases: [],
    rmtPurchases: [],
    perks: [],
    perksByID: {},
    newPurchases: {},
    newEquipment: {},
    hasPurchasables: false,
    isDataFetched: false,
    spendXPPotionQuest: null,
    purchaseIdToProcess: null,
    suppressAlertStarOnNextPurchase: false,
    confirmPurchaseSelectedRewardIndex: 0
  }; // Unfiltered by default.
  return defaultStoreState;
}

export const storeSlice = createSlice({
  name: 'store',
  initialState: generateDefaultStoreState(),
  reducers: {
    updateStoreStaticData: (state: StoreState, action: PayloadAction<StoreStaticDataQueryResult>) => {
      state.purchases = action.payload.game.purchases;
      state.rmtPurchases = action.payload.game.rMTPurchases;
      state.isDataFetched = true;
    },
    updateStorePerksByID: (state: StoreState, action: PayloadAction<{
      perks: PerkDef[];
      perksByID: Dictionary<PerkDef>;
    }>) => {
      state.perks = action.payload.perks
      state.perksByID = action.payload.perksByID;
    },
    updateStoreCurrentRoute: (state: StoreState, action: PayloadAction<StoreRoute>) => {
      state.currentRoute = action.payload;
    },
    updateStoreChampionIDFilters: (state: StoreState, action: PayloadAction<string[]>) => {
      state.championIDFilters = action.payload;
    },
    updateStoreHideOwnedPurchases: (state: StoreState, action: PayloadAction<boolean>) => {
      state.hideOwnedPurchases = action.payload;
    },
    updateStoreNewPurchases: (state: StoreState, action: PayloadAction<Dictionary<boolean>>) => {
      state.newPurchases = action.payload;
    },
    updateStoreNewEquipment: (state: StoreState, action: PayloadAction<Dictionary<boolean>>) => {
      state.newEquipment = action.payload;
    },
    updateStoreAddUnseenEquipment: (state: StoreState, action: PayloadAction<string>) => {
      state.newEquipment[action.payload] = true;
    },
    updateStoreRemoveUnseenEquipment: (state: StoreState, action: PayloadAction<string>) => {
      delete state.newEquipment[action.payload];
    },
    updateStoreHasPurchasables: (state: StoreState, action: PayloadAction<boolean>) => {
      state.hasPurchasables = action.payload;
    },
    updateSpendXPPotionQuest: (state: StoreState, action: PayloadAction<QuestDef>) => {
      state.spendXPPotionQuest = action.payload;
    },
    setPurchaseIdToProcess: (state: StoreState, action: PayloadAction<[string, boolean]>) => {
      state.purchaseIdToProcess = action.payload[0];
      state.suppressAlertStarOnNextPurchase = action.payload[1];
    },
    updateConfirmPurchaseSelectedRewardIndex: (state: StoreState, action: PayloadAction<number>) => {
      state.confirmPurchaseSelectedRewardIndex = action.payload;
    }
  }
});

export const {
  updateStoreStaticData,
  updateStorePerksByID,
  updateStoreCurrentRoute,
  updateStoreChampionIDFilters,
  updateStoreHideOwnedPurchases,
  updateStoreNewPurchases,
  updateStoreNewEquipment,
  updateStoreAddUnseenEquipment,
  updateStoreRemoveUnseenEquipment,
  updateStoreHasPurchasables,
  updateSpendXPPotionQuest,
  setPurchaseIdToProcess,
  updateConfirmPurchaseSelectedRewardIndex
} = storeSlice.actions;
