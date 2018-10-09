/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const stateKey = 'player-state';
function getStateObject(): Player {
  if (!window[stateKey]) {
    window[stateKey] = {
      id: '',
    };
  }
  return window[stateKey];
}

export function setPlayerState(state: Player) {
  window[stateKey] = state;
}

export function getPlayerEntityID() {
  return getStateObject().entityID;
}

export function getLastPlayerState() {
  return getStateObject();
}
