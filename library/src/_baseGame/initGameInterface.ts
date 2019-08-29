/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createEventEmitter, EventEmitter } from './utils/EventEmitter';
import { makeClientPromise } from './clientTasks';
import { BaseGameModel, BaseGameInterface } from './BaseGameInterface';
import { query } from './graphql/query';
import { subscribe } from './graphql/subscription';

import initEventForwarding from './engineEvents';
import initCUAPIShim from './cuAPIShim';
// tslint:disable-next-line:no-duplicate-imports
import * as engineEvents from './engineEvents';


export default function (isAttached: boolean) {
    _devGame.ready = false;
    _devGame.isClientAttached = isAttached;
    _devGame.graphQL = {
      query,
      subscribe,
      host: graphQLHost,
    } as any;

    // TASKS
    _devGame._activeTasks = {};
    _devGame.listenForKeyBindingAsync =
      makeClientPromise(game => game._cse_dev_listenForKeybindingTask());
    _devGame.setOptionsAsync =
      makeClientPromise((game, options) => game._cse_dev_setOptions(options));
    _devGame.testOptionAsync =
      makeClientPromise((game, option) => game._cse_dev_testOption(option));
    _devGame.takeScreenshotAsync =
      makeClientPromise(game => game._cse_dev_takeScreenshot());

    // EVENTS
    _devGame.onReady = onReady;
    _devGame.on = events_on;
    _devGame.once = events_once;
    _devGame.trigger = events_trigger;
    _devGame.off = events_off;
    _devGame.engineEvents = engineEvents;

    initEventForwarding();
    initCUAPIShim();
}

function onReady(callback: () => any) {
  if (game.ready) {
    callback();
  }

  return events_on('ready', callback);
}

/* -------------------------------------------------- */
/* EVENTS                                             */
/* -------------------------------------------------- */

declare global {
  interface Window {
    _cse_dev_eventEmitter: EventEmitter;
  }
}
if (!window._cse_dev_eventEmitter) {
  window._cse_dev_eventEmitter = createEventEmitter();
}

function events_on(name: string, callback: Callback) {
  return window._cse_dev_eventEmitter.addListener(name, false, callback);
}

function events_once(name: string, callback: Callback) {
  return window._cse_dev_eventEmitter.addListener(name, true, callback);
}

function events_trigger(name: string, ...args: any[]) {
  window._cse_dev_eventEmitter.emit(name, ...args);
}

function events_off(handle: number | EventHandle) {
  if (typeof handle === 'undefined') {
    console.error('Tried to remove a listener with an undefined handle');
    return;
  }
  if (typeof handle === 'number') {
    window._cse_dev_eventEmitter.removeListener(handle);
  } else {
    window._cse_dev_eventEmitter.removeListener(handle.id);
  }
}

export function initOutOfContextGame(): Partial<BaseGameInterface> {
  const model: BaseGameModel = {
    patchResourceChannel: 4,
    shardID: 1,
    pktHash: '',
    accessToken: 'developer',
    webAPIHost: 'https://hatcheryapi.camelotunchained.com',
    serverHost: 'https://hatcheryd.camelotunchained.com',
    options: {},
    keybinds: {},
    worldTime: 0,

    reloadUI: noOp,
    quit: noOp,
    sendSlashCommand: noOp,
    triggerKeyAction: noOp,
    playGameSound: noOp,

    setKeybind: noOp,
    clearKeybind: noOp,
    resetKeybinds: noOp,
    resetOptions: noOp,
  };

  return withOverrides({
    ...model,
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
function withOverrides(model: Partial<BaseGameInterface>) {
  const m = model;
  const overrides = ((window as any).cuOverrides || {}) as BaseGameModel;
  for (const key in model) {
    m[key] = overrides[key] || model[key];
  }
  return m;
}

function noOp(...args: any[]): any {}

function graphQLHost() {
  return game.webAPIHost + '/graphql';
}
