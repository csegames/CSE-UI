/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';

import { abilitySlice } from './abilitySlice';
import { announcementsSlice } from './announcementsSlice';
import { baseGameSlice } from './baseGameSlice';
import { questSlice } from './questSlice';
import { championInfoSlice } from './championInfoSlice';
import { chatSlice } from './chatSlice';
import { gameOptionsSlice } from './gameOptionsSlice';
import { profileSlice } from './profileSlice';
import { entitiesSlice } from './entitiesSlice';
import { featureFlagsSlice } from './featureFlagsSlice';
import { initializationSlice } from './initializationSlice';
import { gameSlice } from './gameSlice';
import { gameStatsSlice } from './gameStatsSlice';
import { gameSettingsSlice } from './gameSettingsSlice';
import { keybindsSlice } from './keybindsSlice';
import { matchSlice } from './matchSlice';
import { navigationSlice } from './navigationSlice';
import { performanceDataSlice } from './performanceDataSlice';
import { playerSlice } from './playerSlice';
import { runesSlice } from './runesSlice';
import { storeSlice } from './storeSlice';
import { teamJoinSlice } from './teamJoinSlice';
import { userSlice } from './userSlice';
import { voiceChatSlice } from './voiceChatSlice';
import { fullScreenSelectSlice } from './fullScreenSelectSlice';
import { hudSlice } from './hudSlice';
import { tooltipSlice } from './tooltipSlice';
import { stringTableSlice } from './stringTableSlice';
import { scenariosSlice } from './scenariosSlice';
import { clockSlice } from './clockSlice';
import { localStorageSlice } from './localStorageSlice';

export const store = configureStore({
  reducer: {
    abilities: abilitySlice.reducer,
    announcements: announcementsSlice.reducer,
    baseGame: baseGameSlice.reducer,
    clock: clockSlice.reducer,
    championInfo: championInfoSlice.reducer,
    chat: chatSlice.reducer,
    entities: entitiesSlice.reducer,
    featureFlags: featureFlagsSlice.reducer,
    fullScreenSelect: fullScreenSelectSlice.reducer,
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
    performanceData: performanceDataSlice.reducer,
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
    voiceChat: voiceChatSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
