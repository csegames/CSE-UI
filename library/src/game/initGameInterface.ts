/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Callback } from './GameClientModels/_Updatable';
import { createEventEmitter } from '../utils/EventEmitter';
import { GameModel, GameInterface } from './GameInterface';

import * as engineEvents from './engineEvents';

import initLoadingState, { LoadingState } from './GameClientModels/LoadingState';
import initPlayerState from './GameClientModels/PlayerState';
import initEnemytargetState from './GameClientModels/EnemytargetState';
import initFriendlytargetState from './GameClientModels/FriendlytargetState';
import initOptions from './GameClientModels/Options';

export default function(isAttached: boolean) {
  // if (engine.isAttached && window.gameClient) {
  //   for (const key in window.gameClient) {
  //     console.log(`defining property ${key} on game`);
  //     Object.defineProperty(game, key, {
  //       get: () => {
  //         return window.gameClient[key];
  //       },
  //       enumerable: true,
  //       configurable: true,
  //     });
  //   }
  // }

  let oldEmitter = null;
  if (window.__devGame) {
    // This is a re-initialization, so try and maintain the same event emitter
    oldEmitter = __devGame.__eventEmitter;
  }
  __devGame.ready = false;
  __devGame.isClientAttached = isAttached;
  __devGame.onReady = onReady;

  __devGame.onBeginChat = onBeginChat;
  __devGame.onSystemMessage = onSystemMessage;

  // EVENTS
  __devGame.__eventEmitter = oldEmitter || createEventEmitter();
  __devGame.on = events_on;
  __devGame.once = events_once;
  __devGame.trigger = events_trigger;
  __devGame.off = events_off;

  // init engine event forwarding
  forwardEngineEvents();

  // INIT MODELS
  initLoadingState();
  initPlayerState();
  initEnemytargetState();
  initFriendlytargetState();
  initOptions();

  // READY!
  __devGame.ready = true;
  game.trigger('ready');
}

// Augment Array with remove method.
declare global {
  interface Array<T> {
    remove(element: T): T[];
  }
}

/**
 * Creates a game object for replacement use when not running in the context of the game client.
 */
export function initOutOfContextGame(): Partial<GameInterface> {
  const model: GameModel = {
    patchResourceChannel: 4,
    shardID: 1,
    pktHash: '',
    accessToken: 'developer',
    webAPIHost: 'https://hatcheryapi.camelotunchained.com',
    serverHost: 'hatcheryd.camelotunchained.com',

    reloadUI: noOp,
    quit: noOp,
    crashTheGame: noOp,
    dropLight: noOp,
    resetLights: noOp,
    removeLight: noOp,
    sendSlashCommand: noOp,
  };

  return withOverrides({
    ...model,
    ready: false,
    isClientAttached: false,
    debug: false,
    apiVersion: 1,
  });
}

/**
 * Override default GameModel out of context values with those supplied via a dev.config.js file
 * during in-browser development.
 * @param model The default GameModel
 */
function withOverrides(model: Partial<GameInterface>) {
  const m = model;
  const overrides = ((window as any).cuOverrides || {}) as GameModel;
  for (const key in model) {
    m[key] = overrides[key] || model[key];
  }
  return m;
}

function noOp(...args: any[]) {}

/**
 * Removes the first instance of an element from an array.
 * @param {T} element The element to remove from the Array
 * @return {Array<T>} Returns a reference to the array with the removed item.
 */
Array.prototype.remove = function<T>(element: T): T[] {
  const index = this.findIndex(i => i === element);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
};

/* -------------------------------------------------- */
/* GAME                                               */
/* -------------------------------------------------- */

function onReady(callback: () => any) {
  if (game.ready) {
    callback();
  }

  return events_on('ready', callback);
}

function onBeginChat(callback: (message: string) => any) {
  return events_on(engineEvents.EE_BeginChat, callback);
}

function onSystemMessage(callback: (message: string) => any) {
  return events_on(engineEvents.EE_SystemMessage, callback);
}


/* -------------------------------------------------- */
/* EVENTS                                             */
/* -------------------------------------------------- */

function forwardEngineEvents() {
  for (const key in engineEvents) {
    engine.on(key, (...args: any[]) => game.trigger(key, ...args));
  }
}

function events_on(name: string, callback: Callback) {
  return __devGame.__eventEmitter.addListener(name, false, callback);
}

function events_once(name: string, callback: Callback) {
  return __devGame.__eventEmitter.addListener(name, true, callback);
}

function events_trigger(name: string, ...args: any[]) {
  __devGame.__eventEmitter.emit(name, ...args);
}

function events_off(handle: number | EventHandle) {
  if (typeof handle === 'number') {
    __devGame.__eventEmitter.removeListener(handle);
  } else {
    __devGame.__eventEmitter.removeListener(handle.id);
  }
}
