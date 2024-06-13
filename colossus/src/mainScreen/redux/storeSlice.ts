/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  PerkDefGQL,
  //  PerkRarity,
  //  PerkType,
  PurchaseDefGQL,
  QuestDefGQL,
  RMTPurchaseDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreStaticDataQueryResult } from '../dataSources/storeNetworkingConstants';

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
  // The current champion filter used by the Store.
  championIDFilter: string | null;
  // All of the possible purchase transactions.
  purchases: PurchaseDefGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  // Static data for all perk items.
  perks: PerkDefGQL[];
  // Indexed by perk.id for rapid lookup.
  perksByID: Dictionary<PerkDefGQL>;
  // Purchases that should be badged as "new".  Key is the purchase ID.
  newPurchases: Dictionary<boolean>;
  // Owned equipment that should be badged as "new".  Key is the perk ID.
  newEquipment: Dictionary<boolean>;
  // Map of the ids for currency perks that can be bought via RMT.
  rmtCurrencyIds: Dictionary<boolean>;
  // flag to show the store if there are new free rewards.
  hasPurchasables: boolean;
  // which quest we're attempting to spend XP on for the SpendQuestXPPotionsModal
  spendXPPotionQuest: QuestDefGQL;
  // What purchase should we attempt to process?
  purchaseIdToProcess: string;
  // If the next time we process a purchase we should suppress alerts
  suppressAlertStarOnNextPurchase: boolean;

  isDataFetched: boolean;
}

function generateDefaultStoreState() {
  const defaultStoreState: StoreState = {
    currentRoute: StoreRoute.None,
    championIDFilter: null,
    purchases: [],
    rmtPurchases: [],
    perks: [],
    perksByID: {},
    newPurchases: {},
    newEquipment: {},
    rmtCurrencyIds: {},
    hasPurchasables: false,
    isDataFetched: false,
    spendXPPotionQuest: null,
    purchaseIdToProcess: null,
    suppressAlertStarOnNextPurchase: false
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
      state.perks = action.payload.game.perks;
      state.isDataFetched = true;
    },
    updateStorePerksByID: (state: StoreState, action: PayloadAction<Dictionary<PerkDefGQL>>) => {
      state.perksByID = action.payload;
    },
    updateStoreCurrentRoute: (state: StoreState, action: PayloadAction<StoreRoute>) => {
      state.currentRoute = action.payload;
    },
    updateStoreChampionIDFilter: (state: StoreState, action: PayloadAction<string | null>) => {
      state.championIDFilter = action.payload;
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
    updateStoreRMTCurrencies: (state: StoreState, action: PayloadAction<Dictionary<boolean>>) => {
      state.rmtCurrencyIds = action.payload;
    },
    updateStoreHasPurchasables: (state: StoreState, action: PayloadAction<boolean>) => {
      state.hasPurchasables = action.payload;
    },
    updateSpendXPPotionQuest: (state: StoreState, action: PayloadAction<QuestDefGQL>) => {
      state.spendXPPotionQuest = action.payload;
    },
    setPurchaseIdToProcess: (state: StoreState, action: PayloadAction<[string, boolean]>) => {
      state.purchaseIdToProcess = action.payload[0];
      state.suppressAlertStarOnNextPurchase = action.payload[1];
    }
  }
});

export const {
  updateStoreStaticData,
  updateStorePerksByID,
  updateStoreCurrentRoute,
  updateStoreChampionIDFilter,
  updateStoreNewPurchases,
  updateStoreNewEquipment,
  updateStoreAddUnseenEquipment,
  updateStoreRemoveUnseenEquipment,
  updateStoreRMTCurrencies,
  updateStoreHasPurchasables,
  updateSpendXPPotionQuest,
  setPurchaseIdToProcess
} = storeSlice.actions;

// function generateDebugRMTCurrencyIDs(): Dictionary<boolean> {
//   return { test_perk_currency_1: true };
// }

// function generateDebugPurchases(): PurchaseDefGQL[] {
//   return [
//     {
//       id: 'debug_purchase_1',
//       name: 'Debug Purchase #1',
//       description: 'Debug Purchase',
//       iconURL: '',
//       locks: [],
//       perks: [
//         {
//           perk: {
//             id: 'weapon_ninja_ragnarok',
//             perkType: PerkType.Weapon,
//             name: 'Weapon Ninja Ragnarok',
//             description: '',
//             iconURL: 'images/perks/weapons/ninja-default.png',
//             rarity: PerkRarity.Unique,
//             isUnique: true,
//             champion: {
//               id: 'Ninja',
//               name: 'Yuki'
//             },
//             costume: null,
//             weapon: {
//               id: 'ninja_ragnarok'
//             },
//             videoURL: null,
//             portraitThumbnailURL: null,
//             portraitChampionSelectImageUrl: null
//           },
//           qty: 1
//         }
//       ],
//       costs: [
//         {
//           perk: {
//             id: 'test_perk_currency_1',
//             perkType: PerkType.Currency,
//             name: 'Gold!',
//             description: 'Ah, that sweet digital currency.  Genuine Nordic flavor!',
//             iconURL: 'images/hud/consumables/items-poison-trap.png',
//             rarity: PerkRarity.Default,
//             isUnique: false,
//             champion: null,
//             costume: null,
//             weapon: null,
//             videoURL: null,
//             portraitThumbnailURL: null,
//             portraitChampionSelectImageUrl: null
//           },
//           qty: 1000
//         }
//       ]
//     },
//     {
//       id: 'debug_purchase_2',
//       name: 'Debug Purchase #2',
//       description: 'Debug Purchase',
//       iconURL: '',
//       locks: [],
//       perks: [
//         {
//           perk: {
//             id: 'weapon_ninja_ragnarok',
//             perkType: PerkType.Weapon,
//             name: 'Weapon Ninja Ragnarok',
//             description: '',
//             iconURL: 'images/perks/weapons/ninja-default.png',
//             rarity: PerkRarity.Unique,
//             isUnique: true,
//             champion: {
//               id: 'Ninja',
//               name: 'Yuki'
//             },
//             costume: null,
//             weapon: {
//               id: 'ninja_ragnarok'
//             },
//             videoURL: null,
//             portraitThumbnailURL: null,
//             portraitChampionSelectImageUrl: null
//           },
//           qty: 1
//         }
//       ],
//       costs: [
//         {
//           perk: {
//             id: 'test_perk_currency_2',
//             perkType: PerkType.Currency,
//             name: 'Silver!',
//             description: 'Ah, that sweet digital currency.  Genuine Nordic flavor!',
//             iconURL: 'images/hud/consumables/items-poison-flask.png',
//             rarity: PerkRarity.Default,
//             isUnique: false,
//             champion: null,
//             costume: null,
//             weapon: null,
//             videoURL: null,
//             portraitThumbnailURL: null,
//             portraitChampionSelectImageUrl: null
//           },
//           qty: 1000
//         }
//       ]
//     }
//   ];
// }

// function generateDebugRMTPurchases(): RMTPurchaseDefGQL[] {
//   return [
//     {
//       id: 1,
//       name: 'RMT Purchase #1',
//       description: 'Debug RMT Purchase',
//       iconURL: '',
//       centCost: 999,
//       locks: [],
//       perks: [
//         {
//           perk: {
//             id: 'test_perk_currency_1',
//             perkType: PerkType.Currency,
//             name: 'Gold!',
//             description: 'Ah, that sweet digital currency.  Genuine Nordic flavor!',
//             iconURL: 'images/hud/consumables/items-poison-trap.png',
//             rarity: PerkRarity.Default,
//             isUnique: false,
//             champion: null,
//             costume: null,
//             weapon: null,
//             videoURL: null,
//             portraitThumbnailURL: null,
//             portraitChampionSelectImageUrl: null
//           },
//           qty: 1000
//         }
//       ]
//     }
//   ];
// }
