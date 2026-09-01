/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { blogSlice } from './blogSlice';
import { configureStore } from '@reduxjs/toolkit';
import { channelsSlice } from './channelsSlice';
import { downloadSlice } from './downloadSlice';
import { hudSlice } from './hudSlice';
import { installablesSlice } from './installablesSlice';
import { launchableSlice } from './launchablesSlice';
import { loginSlice } from './loginSlice';
import { modalsSlice } from './modalsSlice';
import { navigationSlice } from './navigationSlice';
import { soundsSlice } from './soundsSlice';

export const store = configureStore({
  reducer: {
    blog: blogSlice.reducer,
    channels: channelsSlice.reducer,
    download: downloadSlice.reducer,
    hud: hudSlice.reducer,
    installables: installablesSlice.reducer,
    launchables: launchableSlice.reducer,
    login: loginSlice.reducer,
    modals: modalsSlice.reducer,
    navigation: navigationSlice.reducer,
    sounds: soundsSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
