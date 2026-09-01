/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { abilitiesSlice } from './abilitiesSlice';
import { charactersSlice } from './charactersSlice';
import { clockSlice } from './clockSlice';
import { combatSlice } from './combatSlice';
import { contextMenuSlice } from './contextMenuSlice';
import { craftingSlice } from './craftingSlice';
import { dragAndDropSlice } from './dragAndDropSlice';
import { entitiesSlice } from './entitiesSlice';
import { errorNoticesSlice } from './errorNoticesSlice';
import { gameDefsSlice } from './gameDefsSlice';
import { gameSettingsSlice } from './gameSettingsSlice';
import { guildSlice } from './guildSlice';
import { hudSlice } from './hudSlice';
import { inventorySlice } from './inventorySlice';
import { keyActionsSlice } from './keyActionsSlice';
import { keybindsSlice } from './keybindsSlice';
import { loadingSlice } from './loadingSlice';
import { mailSlice } from './mailSlice';
import { modalsSlice } from './modalsSlice';
import { partySlice } from './partySlice';
import { performanceWarningsSlice } from './performanceWarningsSlice';
import { popUpAnnouncementsSlice } from './popUpAnnouncementsSlice';
import { stringTableSlice } from './stringTableSlice';
import { toastersSlice } from './toastersSlice';
import { tooltipSlice } from './tooltipSlice';
import { warbandSlice } from './warbandSlice';
import { zonesSlice } from './zonesSlice';
import { questSlice } from './questSlice';
import { tradeSlice } from './tradeSlice';
import { notificationsSlice } from './notificationsSlice';

export const store = configureStore({
  reducer: {
    abilities: abilitiesSlice.reducer,
    characters: charactersSlice.reducer,
    clock: clockSlice.reducer,
    combat: combatSlice.reducer,
    contextMenu: contextMenuSlice.reducer,
    crafting: craftingSlice.reducer,
    dragAndDrop: dragAndDropSlice.reducer,
    entities: entitiesSlice.reducer,
    errorNotices: errorNoticesSlice.reducer,
    gameDefs: gameDefsSlice.reducer,
    gameSettings: gameSettingsSlice.reducer,
    guild: guildSlice.reducer,
    hud: hudSlice.reducer,
    loading: loadingSlice.reducer,
    inventory: inventorySlice.reducer,
    keyActions: keyActionsSlice.reducer,
    keybinds: keybindsSlice.reducer,
    mail: mailSlice.reducer,
    modals: modalsSlice.reducer,
    notifications: notificationsSlice.reducer,
    party: partySlice.reducer,
    performanceWarnings: performanceWarningsSlice.reducer,
    popUpAnnouncements: popUpAnnouncementsSlice.reducer,
    quests: questSlice.reducer,
    stringTable: stringTableSlice.reducer,
    toasters: toastersSlice.reducer,
    trade: tradeSlice.reducer,
    tooltip: tooltipSlice.reducer,
    warband: warbandSlice.reducer,
    zones: zonesSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    // Default includes Thunk.
    getDefaultMiddleware({
      // This allows us to use any data types we want in our slices, not just TS basics.
      serializableCheck: false
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AddDispatch {
  dispatch: AppDispatch;
}
