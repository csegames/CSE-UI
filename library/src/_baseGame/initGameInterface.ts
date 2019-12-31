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
import initLoadingState from './GameClientModels/LoadingState';
import initUsingGamepadState from './GameClientModels/UsingGamepadState';
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
      makeClientPromise(game => game._cse_dev_listenForKeyBindingTask());
    _devGame.setOptionsAsync =
      makeClientPromise((game, options) => game._cse_dev_setOptions(options));
    _devGame.testOptionAsync =
      makeClientPromise((game, option) => game._cse_dev_testOption(option));
    _devGame.takeScreenshotAsync =
      makeClientPromise(game => game._cse_dev_takeScreenshot());
      // Building API Tasks
    _devGame.building.setModeAsync =
      makeClientPromise((game, mode) => game.building._cse_dev_setMode(mode));
    _devGame.building.selectBlockAsync =
      makeClientPromise((game, id) => game.building._cse_dev_selectBlock(id));
    _devGame.building.selectBlueprintAsync =
      makeClientPromise((game, id) => game.building._cse_dev_selectBlueprint(id));
    _devGame.building.selectPotentialItemAsync =
      makeClientPromise((game, id) => game.building._cse_dev_selectPotentialItem(id));
    _devGame.building.deleteBlueprintAsync =
      makeClientPromise((game, id) => game.building._cse_dev_deleteBlueprint(id));
    _devGame.building.createBlueprintFromSelectionAsync
      = makeClientPromise((game, name) => game.building._cse_dev_createBlueprintFromSelection(name));
    _devGame.building.replaceMaterialsAsync
      = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceMaterials(sID, rID, inS));
    _devGame.building.replaceShapesAsync
      = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceShapes(sID, rID, inS));

    // EVENTS
    _devGame.onSystemMessage = onSystemMessage;
    _devGame.sendSystemMessage = sendSystemMessage;
    _devGame.onReady = onReady;
    _devGame.on = events_on;
    _devGame.once = events_once;
    _devGame.trigger = events_trigger;
    _devGame.off = events_off;
    _devGame.engineEvents = engineEvents;

    initEventForwarding();
    initCUAPIShim();
    initLoadingState();
    initUsingGamepadState();
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
    characterID: 'test-characterID',
    pktHash: '',
    accessToken: 'developer',
    webAPIHost: 'https://hatcheryapi.camelotunchained.com',
    serverHost: 'https://hatcheryd.camelotunchained.com',
    options: {},
    keybinds: {},
    worldTime: 0,
    fps: 0,

    reloadUI: noOp,
    quit: noOp,
    sendSlashCommand: noOp,
    triggerKeyAction: noOp,
    playGameSound: noOp,

    setKeybind: noOp,
    clearKeybind: noOp,
    resetKeybinds: noOp,
    resetOptions: noOp,
    setWaitingForSelect: noOp,
    gamepadSelectBinding: {
      name: 'Gamepad Select',
      value: -1,
      iconClass: '',
    },
    building: {
      mode: BuildingMode.NotBuilding,
      activePlotID: 'none',
      canEditActivePlot: false,
      activeBlockID: 0,
      activeBlueprintID: 0,
      activeMaterialID: 0,
      activePotentialItemID: 0,
      blueprints: {},
      materials: {},
      potentialItems: {},
    },

    itemPlacementMode: {
      isActive: false,
      activeTransformMode: null,
      requestStart: noOp,
      requestCommit: noOp,
      requestReset: noOp,
      requestCancel: noOp,
      requestChangeTransformMode: noOp,
    },

    dropLight: {
      drop: noOp,
      removeLast: noOp,
      clearAll: noOp,
    },

    connectToServer: noOp,
    isConnectedOrConnectingToServer: false,
    isConnectedToServer: false,
    isDisconnectingFromAllServers: false,
  };

  return withOverrides({
    ...model,
    isClientAttached: false,
    debug: false,
    apiVersion: 1,
    building: {
      ...model.building,
      setModeAsync: noOp,
      selectBlockAsync: noOp,
      selectBlueprintAsync: noOp,
      selectPotentialItemAsync: noOp,
      createBlueprintFromSelectionAsync: noOp,
      deleteBlueprintAsync: noOp,
      replaceMaterialsAsync: noOp,
      replaceShapesAsync: noOp,
    },
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

function onSystemMessage(callback: (message: string) => any) {
  return game.on('systemMessage', callback);
}

function sendSystemMessage(message: string) {
  game.trigger('systemMessage', message);
}