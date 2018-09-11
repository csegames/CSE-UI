/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseAction, defaultAction, merge } from '../../lib/reduxUtils';

const localStorageKey = 'cse-patcher-sounds-v2';

const MUTE_SOUNDS = 'cse-patcher/sounds/MUTE_SOUNDS';
const UNMUTE_SOUNDS = 'cse-patcher/sounds/UNMUTE_SOUNDS';
const MUTE_MUSIC = 'cse-patcher/sounds/MUTE_MUSIC';
const UNMUTE_MUSIC = 'cse-patcher/sounds/UNMUTE_MUSIC';

export interface SoundsAction extends BaseAction {}

export interface SoundsState {
  playMusic: boolean;
  playSound: boolean;
}

export function muteSounds(state: SoundsState): SoundsAction {
  localStorage.setItem(localStorageKey, JSON.stringify(merge(state, { playSound: false })));
  return {
    type: MUTE_SOUNDS,
    when: new Date(),
  };
}

export function unMuteSounds(state: SoundsState): SoundsAction {
  localStorage.setItem(localStorageKey, JSON.stringify(merge(state, { playSound: true })));
  return {
    type: UNMUTE_SOUNDS,
    when: new Date(),
  };
}

export function muteMusic(state: SoundsState): SoundsAction {
  localStorage.setItem(localStorageKey, JSON.stringify(merge(state, { playMusic: false })));
  return {
    type: MUTE_MUSIC,
    when: new Date(),
  };
}

export function unMuteMusic(state: SoundsState): SoundsAction {
  localStorage.setItem(localStorageKey, JSON.stringify(merge(state, { playMusic: true })));
  return {
    type: UNMUTE_MUSIC,
    when: new Date(),
  };
}

function getInitialState(): SoundsState {
  const initialState: SoundsState = {
    playMusic: true,
    playSound: true,
  };
  try {
    const savedState = JSON.parse(localStorage.getItem(localStorageKey));
    Object.assign(initialState, savedState);
  } catch (error) {
    // Unable to read saved sound settings. Use defaults.
  }

  return initialState;
}

export default function reducer(state: SoundsState = getInitialState(), action: SoundsAction = defaultAction): SoundsState {
  switch (action.type) {
    default: return state;
    case MUTE_SOUNDS:
      return merge(state, { playSound: false });
    case UNMUTE_SOUNDS:
      return merge(state, { playSound: true });
    case MUTE_MUSIC:
      return merge(state, { playMusic: false });
    case UNMUTE_MUSIC:
      return merge(state, { playMusic: true });
  }
}
