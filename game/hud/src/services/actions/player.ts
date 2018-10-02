/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SelfPlayerState, DeepImmutableObject } from '@csegames/camelot-unchained';

const stateKey = 'player-state';
function getStateObject(): DeepImmutableObject<SelfPlayerState> {
  if (!window[stateKey]) {
    window[stateKey] = {
      id: '',
    };
  }
  return window[stateKey];
}

export function setPlayerState(state: DeepImmutableObject<SelfPlayerState>) {
  window[stateKey] = state;
}

export function getPlayerEntityID() {
  return getStateObject().entityID;
}

export function getLastPlayerState() {
  return getStateObject();
}
