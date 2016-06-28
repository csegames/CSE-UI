/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from 'camelot-unchained';

export interface PlayerAction {
  type: string;
  error?: string;
}




export interface PlayerState {
  
}

const initialState = {
  
}

export default function reducer(state: PlayerState = initialState,
                                action: PlayerAction = {type: null}) : PlayerState {
  switch(action.type) {
    default: return state;
  }
}
