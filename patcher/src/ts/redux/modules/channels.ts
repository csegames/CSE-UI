/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {patcher, Channel} from '../../api/PatcherAPI';

// action types
const CHANGE_CHANNEL = 'cse-patcher/locations/CHANGE_CHANNEL';
const REQUEST_CHANNELS = 'cse-patcher/locations/REQUEST_CHANNELS';

// sync actions
export function changeChannel(channel: Channel): any {
  return {
    type: CHANGE_CHANNEL,
    channel: channel
  };
}

export function requestChannels(): any {
  let channels = patcher.getAllChannels();
  if (channels == null || typeof(channels) == 'undefined') channels = <Array<Channel>>[];
  return {
    type: REQUEST_CHANNELS,
    channels: channels
  };
}

// reducer
export interface ChannelState {
  selectedChannel?: Channel;
  channels?: Array<Channel>;
}

const initialState : ChannelState = {
  selectedChannel: null,
  channels: <Array<Channel>>[]
}

export default function reducer(state: ChannelState = initialState, action: any = {}) {
  switch(action.type) {
    case CHANGE_CHANNEL:
      return Object.assign({}, state, {
        selectedChannel: action.channel
      });
    case REQUEST_CHANNELS:
      return Object.assign({}, state, {
        channels: action.channels,
        selectedChannel: state.selectedChannel == null ? action.channels[0] : state.selectedChannel
      });  
    default: return state;
  }
}
