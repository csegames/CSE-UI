/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { abilitiesSlice } from './abilitiesSlice';
import { alertsSlice } from './alertsSlice';
import { chatSlice } from './chatSlice';
import { combatSlice } from './combatSlice';
import { contextMenuSlice } from './contextMenuSlice';
import { dragAndDropSlice } from './dragAndDropSlice';
import { entitiesSlice } from './entitiesSlice';
import { equippedItemsSlice } from './equippedItemsSlice';
import { errorNoticesSlice } from './errorNoticesSlice';
import { gameDefsSlice } from './gameDefsSlice';
import { hudSlice } from './hudSlice';
import { initializationSlice } from './initializationSlice';
import { inventorySlice } from './inventorySlice';
import { keyActionsSlice } from './keyActionsSlice';
import { keybindsSlice } from './keybindsSlice';
import { modalsSlice } from './modalsSlice';
import { playerSlice } from './playerSlice';
import { popUpAnnouncementsSlice } from './popUpAnnouncementsSlice';
import { scenarioSlice } from './scenarioSlice';
import { themesSlice } from './themesSlice';
import { toastersSlice } from './toastersSlice';
import { tooltipSlice } from './tooltipSlice';
import { warbandSlice } from './warbandSlice';
import { zonesSlice } from './zonesSlice';

export const store = configureStore({
  reducer: {
    abilities: abilitiesSlice.reducer,
    alerts: alertsSlice.reducer,
    chat: chatSlice.reducer,
    combat: combatSlice.reducer,
    contextMenu: contextMenuSlice.reducer,
    dragAndDrop: dragAndDropSlice.reducer,
    entities: entitiesSlice.reducer,
    equippedItems: equippedItemsSlice.reducer,
    errorNotices: errorNoticesSlice.reducer,
    gameDefs: gameDefsSlice.reducer,
    hud: hudSlice.reducer,
    initialization: initializationSlice.reducer,
    inventory: inventorySlice.reducer,
    keyActions: keyActionsSlice.reducer,
    keybinds: keybindsSlice.reducer,
    modals: modalsSlice.reducer,
    player: playerSlice.reducer,
    popUpAnnouncements: popUpAnnouncementsSlice.reducer,
    scenario: scenarioSlice.reducer,
    themes: themesSlice.reducer,
    toasters: toastersSlice.reducer,
    tooltip: tooltipSlice.reducer,
    warband: warbandSlice.reducer,
    zones: zonesSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
