/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI';
import * as graphQL from '../graphql';
import * as signalR from '../signalR';

import { createEventEmitter } from '../utils/EventEmitter';
import { GameModel, GameInterface, GameModelTasks } from './GameInterface';

import initEventForwarding from './engineEvents';

import initLoadingState from './GameClientModels/LoadingState';
import initPlayerState from './GameClientModels/PlayerState';
import initEnemytargetState from './GameClientModels/EnemytargetState';
import initFriendlytargetState from './GameClientModels/FriendlytargetState';
import initPlotState from './GameClientModels/Plot';
import initKeyActions from './GameClientModels/KeyActions';
import initAbilityState from './GameClientModels/AbilityState';
import initAbilityBarState from './GameClientModels/AbilityBarState';
import { makeClientPromise } from './clientTasks';

export default function(isAttached: boolean) {
  let oldEmitter = null;
  if (window._devGame) {
    // This is a re-initialization, so try and maintain the same event emitter
    oldEmitter = _devGame._eventEmitter;
  }
  _devGame.ready = false;
  _devGame.isClientAttached = isAttached;

  _devGame.webAPI = webAPI;
  _devGame.graphQL = graphQL;
  _devGame.signalR = signalR;

  _devGame.signalRHost = signalRHost;

  // TASKS
  _devGame.listenForKeyBindingAsync = makeClientPromise(_devGame._cse_dev_listenForKeyBindingTask);
  _devGame.setOptionsAsync = makeClientPromise(_devGame._cse_dev_setOptions);
  _devGame.testOptionAsync = makeClientPromise(_devGame._cse_dev_testOption);
  _devGame.takeScreenshotAsync = makeClientPromise(_devGame._cse_dev_takeScreenshot);

  // EVENTS
  _devGame._eventEmitter = oldEmitter || createEventEmitter();
  _devGame.onReady = onReady;
  _devGame.on = events_on;
  _devGame.once = events_once;
  _devGame.trigger = events_trigger;
  _devGame.off = events_off;

  initEventForwarding();

  // INIT MODELS
  initLoadingState();
  initPlayerState();
  initEnemytargetState();
  initFriendlytargetState();
  initPlotState();
  initKeyActions();
  initAbilityState();
  initAbilityBarState();

  // READY!
  _devGame.ready = true;
  game.trigger('ready');
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
    options: [],
    keybinds: [],

    reloadUI: noOp,
    quit: noOp,
    sendSlashCommand: noOp,
    triggerKeyAction: noOp,
    playGameSound: noOp,

    setKeybind: noOp,
    setKeybinds: noOp,
    clearKeybind: noOp,
    resetKeybinds: noOp,
    resetOptions: noOp,

    startItemPlacement: noOp,
    commitItemPlacement: noOp,
    cancelItemPlacement: noOp,
    resetItemPlacement: noOp,
    changeItemPlacementMode: noOp,

    _cse_dev_beginTriggerKeyActionLoop: noOp,
    _cse_dev_endTriggerKeyActionLoop: noOp,
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

function noOp(...args: any[]): any {}

/* -------------------------------------------------- */
/* GAME                                               */
/* -------------------------------------------------- */

function onReady(callback: () => any) {
  if (game.ready) {
    callback();
  }

  return events_on('ready', callback);
}

function signalRHost() {
  return game.webAPIHost + '/signalr';
}

/* -------------------------------------------------- */
/* EVENTS                                             */
/* -------------------------------------------------- */

function events_on(name: string, callback: Callback) {
  return _devGame._eventEmitter.addListener(name, false, callback);
}

function events_once(name: string, callback: Callback) {
  return _devGame._eventEmitter.addListener(name, true, callback);
}

function events_trigger(name: string, ...args: any[]) {
  _devGame._eventEmitter.emit(name, ...args);
}

function events_off(handle: number | EventHandle) {
  if (typeof handle === 'number') {
    _devGame._eventEmitter.removeListener(handle);
  } else {
    _devGame._eventEmitter.removeListener(handle.id);
  }
}
