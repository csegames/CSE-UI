/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * The only purpose of this file is to make it so I'm less annoyed about the fact that we have a perfectly good set of const strings in EngineEvents files to use as keys for keybinds,
 * and they get thrown away when populating the base game interface.  This is to remedy that.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { Binding, Keybind, KeybindSection } from '@csegames/library/dist/_baseGame/types/Keybind';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Until the game client is changed to populate the base game interface with a dictionary of keybinds (where the key is the engineEvents key)
// this should be the only place in the HUD where we do the stupidity of having to search for a keybind by its description.
// If the keybind isn't found, we make a dummy for it, with the description so that it can be initialized when the UI inits fully
function getKeybind(keyDescription: string): Keybind {
  const keybind = Object.values(game.keybinds).find((k) => k.description === keyDescription) as Keybind;
  if (keybind) {
    return keybind;
  }

  return { id: 0, description: keyDescription, category: 'game', section: KeybindSection.None, order: 0, binds: null };
}

export interface KeybindsState {
  [engineEventKey: string]: Keybind;
}

export enum KeybindIDs {
  UICycleTeam = 'UICycleTeam',
  UseConsumable = 'UseConsumable',
  NextConsumable = 'NextConsumable',
  PriorConsumable = 'PriorConsumable',
  UISelect = 'UISelect',
  PlayerObserverCamForwardCycle = 'PlayerObserverCamForwardCycle',
  PlayerObserverCamPrevCycle = 'PlayerObserverCamPrevCycle',
  PrimaryAbility = 'PrimaryAbility',
  SecondaryAbility = 'SecondaryAbility',
  WeakAbility = 'WeakAbility',
  StrongAbility = 'StrongAbility',
  UltimateAbility = 'UltimateAbility',
  SkipEpilogue = 'SkipEpilogue'
}

interface KeybindUpdate {
  key: string;
  keybind: Keybind;
}

// in order to look up the keybinds, we're looking them up by description.  This is far from what
// you'd call ideal, however this is the only place that should be using this string as a lookup because
// after this point they will be looked up by their KeybindID
const defaultKeybindsState: KeybindsState = {
  [KeybindIDs.UICycleTeam]: getKeybind('Cycle Team'),
  [KeybindIDs.UseConsumable]: getKeybind('Use consumable (hold for preview if thrown/placed)'),
  [KeybindIDs.NextConsumable]: getKeybind('Next consumable'),
  [KeybindIDs.PriorConsumable]: getKeybind('Prior consumable'),
  [KeybindIDs.UISelect]: getKeybind('Select'),
  [KeybindIDs.PlayerObserverCamForwardCycle]: getKeybind('Cycle To Next Observer Camera'),
  [KeybindIDs.PlayerObserverCamPrevCycle]: getKeybind('Cycle To Prev Observer Camera'),
  [KeybindIDs.PrimaryAbility]: getKeybind('Primary attack'),
  [KeybindIDs.SecondaryAbility]: getKeybind('Secondary attack'),
  [KeybindIDs.WeakAbility]: getKeybind('Ability 1 (weak)'),
  [KeybindIDs.StrongAbility]: getKeybind('Ability 2 (strong)'),
  [KeybindIDs.UltimateAbility]: getKeybind('Ability 3 (ultimate)'),
  [KeybindIDs.SkipEpilogue]: getKeybind('Skip Epilogue')
};

export const keybindsSlice = createSlice({
  name: 'keybinds',
  initialState: defaultKeybindsState,
  reducers: {
    setKeybind: (state: KeybindsState, action: PayloadAction<any>) => {
      throw 'updating keybinds via redux not implemented yet.';
    },
    updateKeybinds: (state: KeybindsState, action: PayloadAction<KeybindUpdate>) => {
      state[action.payload.key] = action.payload.keybind;
    }
  }
});

export const { setKeybind, updateKeybinds } = keybindsSlice.actions;

export function getActiveBindForKey(usingGamepad: boolean, keybind: Keybind): Binding {
  if (keybind && keybind.binds) {
    return keybind.binds.find((bind) => {
      const isMouseBind = bind && (bind.value == 1 || bind.value == 2);
      if (usingGamepad) {
        return !isMouseBind && bind.iconClass;
      } else {
        return !bind.iconClass || isMouseBind;
      }
    });
  }

  return null;
}
