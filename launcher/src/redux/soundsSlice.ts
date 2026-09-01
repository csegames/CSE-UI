/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import Store from '../lib/local-storage';

const keyPlaySound = 'playSound';
const keyPlayMusic = 'playMusic';
const localStore = new Store('cse-patcher-sounds-v3');

interface SoundsReduxState {
  playMusic: boolean;
  playSound: boolean;
}

function getDefaultState(): SoundsReduxState {
  const defaultState: SoundsReduxState = {
    playMusic: localStore.get<boolean>(keyPlayMusic) ?? true,
    playSound: localStore.get<boolean>(keyPlaySound) ?? true
  };

  return defaultState;
}

export const soundsSlice = createSlice({
  name: 'sounds',
  initialState: getDefaultState(),
  reducers: {
    muteSounds: (state: SoundsReduxState) => {
      localStore.set(keyPlaySound, false);
      state.playSound = false;
    },
    unmuteSounds: (state: SoundsReduxState) => {
      localStore.set(keyPlaySound, true);
      state.playSound = true;
    },
    muteMusic: (state: SoundsReduxState) => {
      localStore.set(keyPlayMusic, false);
      state.playMusic = false;
    },
    unmuteMusic: (state: SoundsReduxState) => {
      localStore.set(keyPlayMusic, true);
      state.playMusic = true;
    }
  }
});

export const { muteMusic, unmuteMusic, muteSounds, unmuteSounds } = soundsSlice.actions;
