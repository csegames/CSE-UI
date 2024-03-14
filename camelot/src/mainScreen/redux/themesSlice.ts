/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultTheme } from '../themes/defaultTheme';
import { Theme } from '../themes/themeConstants';

interface ThemesState {
  currentTheme: Theme;
  themes: Dictionary<Theme>;
}

function buildDefaultThemesState() {
  const themes: Dictionary<Theme> = {
    [defaultTheme.name]: defaultTheme
  };
  const currentTheme = themes[defaultTheme.name];

  const DefaultThemesState: ThemesState = {
    currentTheme,
    themes
  };

  return DefaultThemesState;
}

export const themesSlice = createSlice({
  name: 'themes',
  initialState: buildDefaultThemesState(),
  reducers: {
    setCurrentTheme: (state: ThemesState, action: PayloadAction<string>) => {
      if (state.themes[action.payload] && state.currentTheme.name !== action.payload) {
        state.currentTheme = state.themes[action.payload];
      }
    }
  }
});

export const { setCurrentTheme } = themesSlice.actions;
