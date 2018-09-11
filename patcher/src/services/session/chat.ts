/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseAction, defaultAction, merge } from '../../lib/reduxUtils';

const SHOW_CHAT = 'cse-patcher/chat/SHOW_CHAT';
const HIDE_CHAT = 'cse-patcher/chat/HIDE_CHAT';

export interface ChatAction extends BaseAction {}

export function showChat(): ChatAction {
  return {
    type: SHOW_CHAT,
    when: new Date(),
  };
}

export function hideChat(): ChatAction {
  return {
    type: HIDE_CHAT,
    when: new Date(),
  };
}

export interface ChatState {
  showChat: boolean;
}

function getInitialState(): ChatState {
  return {
    showChat: false,
  };
}

export default function reducer(state: ChatState = getInitialState(), action: ChatAction = defaultAction): ChatState {
  switch (action.type) {
    default: return state;
    case SHOW_CHAT: return merge(state, { showChat: true });
    case HIDE_CHAT: return merge(state, { showChat: false });
  }
}
