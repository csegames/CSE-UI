/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux';

///////////////////////////////////////////////////////////////////////////

const SHOW_CHAT = 'cse-patcher/locations/SHOW_CHAT';
const SET_CHAT_LATENCY = 'cse-patcher/locations/SET_CHAT_LATENCY';

///////////////////////////////////////////////////////////////////////////

export function showChat(shouldShow: boolean = true) {
  return {
    type: SHOW_CHAT,
    showChat: shouldShow
  };
}

export function hideChat() {
  return {
    type: SHOW_CHAT,
    showChat: false
  };
}


function visibility(state: any = { showChat: false }, action: any = {}) {
  switch(action.type) {
    case SHOW_CHAT:
      return Object.assign({}, state, { showChat: action.showChat });
  }
  return state;
}

///////////////////////////////////////////////////////////////////////////

export function setLatency(ms: number = 0) {
  return {
    type: SET_CHAT_LATENCY,
    latency: ms
  }
}

function netstats(state: any = { latency: 0 }, action: any = {}) {
  switch(action.type) {
    case SET_CHAT_LATENCY:
      return Object.assign({}, state, { latency: action.latency });
  }
  return state
}

///////////////////////////////////////////////////////////////////////////

const rootReducer = combineReducers({
  visibility, 
  netstats
});

export default rootReducer;