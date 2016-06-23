/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import locationsReducer from './locations';
let location = locationsReducer; // because reasons...

import chatReducer from './chat';
let chat = chatReducer;

import channelsReducer from './channels';
let channels = channelsReducer;

import newsReducer from './news';
let news = newsReducer;

import patcherAlertsReducer from './patcherAlerts';
let alerts = patcherAlertsReducer;

import heroContentReducer from './heroContent';
let heroContent = heroContentReducer;

import soundsReducer from './sounds';
let soundMuted = soundsReducer;

import musicReducer from './music';
let musicMuted = musicReducer;

import serversReducer from './servers';
let servers = serversReducer;

import charactersReducer from './characters';
let characters = charactersReducer;

export default combineReducers({
  location,
  chat,
  channels,
  news,
  alerts,
  heroContent,
  soundMuted,
  musicMuted,
  servers,
  characters,
});

/**
 * Global State
 * {
 *    location: {
 *      location: Route,  -- header route location (default Routes.HERO)
 *    },
 *    chat: {
 *      showChat: boolean, -- is chat visible (default false)
 *    },
 *    channels: {
 *      currentChannel: number, -- currently selected channel (default -1 for no channel)
 *      channels: [Channels], -- array of channels from the patcher (default [])
 *    },
 *    news: {
 *      isFetching: boolean, -- are we currently fetching post data? (default false)
 *      didInvalidate: boolean, -- did the user or app request a refresh of data? (default false)
 *      lastUpdated: Date, -- date of last update to news (default null),
 *      nextPage: number, -- next page to be fetched by the fetchNextPage action (default 0)
 *      posts: Array<Post>, -- array of post to be displayed (default [])
 *      error?: ResponseError, -- last response error if any (default undefined)
 *    },
 *    alerts: {
 *      isFetching: boolean, -- are we currently fetching alert data? (default false)
 *      lastUpdated: Date, -- date of the last update to alerts (default null)
 *      alerts: Array<PatcherAlert>, -- array of alerts to be displayed (default [])
 *      error?: ResponseError, -- last response error if any (default undefined)
 *    },
 *    heroItems: {
 *      isFetching: boolean, -- are we currently fetching hero item data? (default false)
 *      lastUpdated: Date, -- date of the last update to hero items (default null)
 *      items: Array<HeroItem>, -- array of hero items to be displayed (default [])
 *      error?: ResponseError, -- last response error if any (default undefined)
 *    },
 *    soundMuted: boolean,
 *    musicMuted: boolean,
 *    servers: {
 *      isFetching: boolean, -- are we currently fetching server data? (default false)
 *      lastUpdated: Date, -- date of the last update to servers (default null)
 *      servers: Array<Server>, -- array of online servers (default [])
 *      currentServer: number, -- index of currently selected server
 *      error?: ResponseError, -- last response error if any (default undefined)
 *    },
 *    characters: {
 *      isFetching: boolean, -- are we currently fetching character data? (default false)
 *      lastUpdated: Date, -- date of the last update to characters (default null)
 *      characters: Array<restAPI.SimpleCharacter>, -- array of characters (default [])
 *      selectedCharacterId: string -- id of currently selected character (default '')
 *      error?: ResponseError, -- last response error if any (default undefined)
 *    },
 * }
 */