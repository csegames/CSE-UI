/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { abilitySlice } from './abilitySlice';
import { announcementsSlice } from './announcementsSlice';
import { baseGameSlice } from './baseGameSlice';
import { championInfoSlice } from './championInfoSlice';
import { chatSlice } from './chatSlice';
import { clockSlice } from './clockSlice';
import { entitiesSlice } from './entitiesSlice';
import { featureFlagsSlice } from './featureFlagsSlice';
import { gameOptionsSlice } from './gameOptionsSlice';
import { gameSettingsSlice } from './gameSettingsSlice';
import { gameSlice } from './gameSlice';
import { gameStatsSlice } from './gameStatsSlice';
import { hudSlice } from './hudSlice';
import { initializationSlice } from './initializationSlice';
import { keybindsSlice } from './keybindsSlice';
import { localStorageSlice } from './localStorageSlice';
import { matchSlice } from './matchSlice';
import { navigationSlice } from './navigationSlice';
import { notificationsSlice } from './notificationsSlice';
import { playerSlice } from './playerSlice';
import { profileSlice } from './profileSlice';
import { questSlice } from './questSlice';
import { runesSlice } from './runesSlice';
import { scenariosSlice } from './scenariosSlice';
import { storeSlice } from './storeSlice';
import { stringTableSlice } from './stringTableSlice';
import { teamJoinSlice } from './teamJoinSlice';
import { tooltipSlice } from './tooltipSlice';
import { userSlice } from './userSlice';
import { voiceChatSlice } from './voiceChatSlice';
import { warningIconsSlice } from './warningIconsSlice';

export const store = configureStore({
  reducer: {
    abilities: abilitySlice.reducer,
    announcements: announcementsSlice.reducer,
    baseGame: baseGameSlice.reducer,
    championInfo: championInfoSlice.reducer,
    chat: chatSlice.reducer,
    clock: clockSlice.reducer,
    entities: entitiesSlice.reducer,
    featureFlags: featureFlagsSlice.reducer,
    game: gameSlice.reducer,
    gameOptions: gameOptionsSlice.reducer,
    gameSettings: gameSettingsSlice.reducer,
    gameStats: gameStatsSlice.reducer,
    hud: hudSlice.reducer,
    initialization: initializationSlice.reducer,
    keybinds: keybindsSlice.reducer,
    localStorage: localStorageSlice.reducer,
    match: matchSlice.reducer,
    navigation: navigationSlice.reducer,
    notifications: notificationsSlice.reducer,
    player: playerSlice.reducer,
    profile: profileSlice.reducer,
    quests: questSlice.reducer,
    runes: runesSlice.reducer,
    scenarios: scenariosSlice.reducer,
    store: storeSlice.reducer,
    stringTable: stringTableSlice.reducer,
    teamJoin: teamJoinSlice.reducer,
    tooltip: tooltipSlice.reducer,
    user: userSlice.reducer,
    voiceChat: voiceChatSlice.reducer,
    warningIcons: warningIconsSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
