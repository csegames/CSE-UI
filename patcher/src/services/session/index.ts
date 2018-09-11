/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux';

import routesReducer, { RoutesState } from './routes';
const routes = routesReducer;

import heroContentReducer, { HeroContentState } from './heroContent';
const heroContent = heroContentReducer;

import newsReducer, { NewsState } from './news';
const news = newsReducer;

import soundsReducer, { SoundsState } from './sounds';
const sounds = soundsReducer;

import chatReducer, { ChatState } from './chat';
const chat = chatReducer;

export default combineReducers({
  routes,
  heroContent,
  news,
  sounds,
  chat,
});

export interface GlobalState {
  routes: RoutesState;
  heroContent: HeroContentState;
  news: NewsState;
  sounds: SoundsState;
  chat: ChatState;
}
