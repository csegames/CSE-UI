/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const localStorageKey = 'cse-patcher-music';

// action types
const MUTE_MUSIC = 'cse-patcher/music/MUTE_MUSIC';
const UNMUTE_MUSIC = 'cse-patcher/music/UNMUTE_MUSIC';

// sync actions
export function muteMusic(): any {
  localStorage.setItem(localStorageKey, JSON.stringify(true));
  return {
    type: MUTE_MUSIC
  };
}

export function unMuteMusic(): any {
  localStorage.setItem(localStorageKey, JSON.stringify(false));
  return {
    type: UNMUTE_MUSIC
  };
}

// reducer
const initialState = JSON.parse(localStorage.getItem(localStorageKey)) || false;

export default function reducer(state: any = initialState, action: any = {}) {
  switch(action.type) {
    case MUTE_MUSIC:
      return true;
    case UNMUTE_MUSIC:
      return false;
    default: return state;
  }
}
