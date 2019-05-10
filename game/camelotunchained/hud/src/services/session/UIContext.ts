/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import * as cseThemes from '../themes';

declare global {
  interface Resolution {
    width: number;
    height: number;
  }

  interface UIContext {
    resolution: Resolution;
    isUHD(): boolean;
    // Optional Settings a user can configure
    uiScale: number; // default 1, (0 - 1)
    forceUHD: boolean; // default false


    themes: ObjectMap<Theme>;
    currentTheme(): Theme;
    currentThemeKey: string;
  }
  const UIContext: React.Context<UIContext>;
  interface Window {
    UIContext: React.Context<UIContext>;
  }
}

function isUHD(this: UIContext) {
  if (!this) return false;
  return this.forceUHD || this.resolution.width > 1920;
}

function currentTheme(this: UIContext) {
  return this.themes[this.currentThemeKey] || this.themes['cse'];
}

// Call this method get a new object with the current UIContext values from the game. As this creates a new object, this
// should not be directly used when setting the value of UIContext.Provider as it will cause it to continuously render.
// Instead, use this to initialize state, then update the object based on events from the client
export function uiContextFromGame(): UIContext {

  const themes = {};
  Object.values(cseThemes).forEach((createThemeFn) => {
    const theme = createThemeFn();
    themes[theme.name] = theme;
  });

  window.currentTheme = Object.freeze(themes['cse']);

  return Object.freeze({
    resolution: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    uiScale: 1,
    forceUHD: false,
    isUHD,

    themes,
    currentTheme,
    currentThemeKey: 'cse',
  });
}

if (!window.UIContext) {
  window.UIContext = React.createContext<UIContext>(uiContextFromGame());
}
