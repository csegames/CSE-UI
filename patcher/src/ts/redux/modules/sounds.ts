/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const localStorageKey = 'cse-patcher-sounds';

// action types
const MUTE_SOUNDS = 'cse-patcher/sounds/MUTE_SOUNDS';
const UNMUTE_SOUNDS = 'cse-patcher/sounds/UNMUTE_SOUNDS';

// sync actions
export function muteSounds(): any {
  localStorage.setItem(localStorageKey, JSON.stringify(true));
  return {
    type: MUTE_SOUNDS
  };
}

export function unMuteSounds(): any {
  localStorage.setItem(localStorageKey, JSON.stringify(false));
  return {
    type: UNMUTE_SOUNDS
  };
}

// reducer
const initialState = JSON.parse(localStorage.getItem(localStorageKey)) || false;

export default function reducer(state: any = initialState, action: any = {}) {
  switch(action.type) {
    case MUTE_SOUNDS:
      return true;
    case UNMUTE_SOUNDS:
      return false;
    default: return state;
  }
}
