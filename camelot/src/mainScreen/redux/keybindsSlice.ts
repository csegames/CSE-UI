/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type KeybindsState = Dictionary<Keybind>;

function buildDefaultKeybindsState() {
  const DefaultKeybindsState: KeybindsState = {};
  return DefaultKeybindsState;
}

export const keybindsSlice = createSlice({
  name: 'keybinds',
  initialState: buildDefaultKeybindsState(),
  reducers: {
    setKeybinds: (state: KeybindsState, action: PayloadAction<KeybindsState>) => {
      // The payload comes directly from game.keybinds at the moment, so to be safe
      // let's make our own copy.
      const newState = { ...action.payload };
      // Full state replacement, so we return the new one instead of editing the old.
      return newState;
    },
    updateKeybind: (state: KeybindsState, action: PayloadAction<Keybind>) => {
      state[action.payload.id] = action.payload;
    }
  }
});

export const { setKeybinds, updateKeybind } = keybindsSlice.actions;
