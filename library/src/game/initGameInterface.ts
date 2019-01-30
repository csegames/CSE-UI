/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI';
import initSignalR from '../signalR';

import { createEventEmitter, EventEmitter } from '../utils/EventEmitter';
import { GameModel, GameInterface } from './GameInterface';

import initEventForwarding from './engineEvents';
// tslint:disable-next-line:no-duplicate-imports
import * as engineEvents from './engineEvents';

import initLoadingState from './GameClientModels/LoadingState';
import initPlayerState from './GameClientModels/PlayerState';
import initEntityState from './GameClientModels/EntityState';
import initEnemyTargetState from './GameClientModels/EnemyTargetState';
import initFriendlyTargetState from './GameClientModels/FriendlyTargetState';
import initKeyActions from './GameClientModels/KeyActions';
import initAbilityState from './GameClientModels/AbilityState';
import initAbilityBarState from './GameClientModels/AbilityBarState';
import initOfflineZoneSelectState from './GameClientModels/OfflineZoneSelectState';
import { makeClientPromise } from './clientTasks';

import initCUAPIShim from './cuAPIShim';

import initGameDataStore from './store';

import { query, QueryOptions } from '../graphql/query';
import { subscribe } from '../graphql/subscription';

export default function(isAttached: boolean) {
  _devGame.ready = false;
  _devGame.isClientAttached = isAttached;

  _devGame.webAPI = webAPI;

  _devGame.graphQL = {
    query,
    subscribe,
    host: graphQLHost,
    defaultOptions: defaultGraphQLOptions,
  };

  _devGame.signalRHost = signalRHost;

  _devGame.abilityStates = {};

  _devGame.engineEvents = engineEvents;
  _devGame.getKeybindSafe = getKeybindSafe;


  // TASKS
  _devGame._activeTasks = {};
  _devGame.listenForKeyBindingAsync = makeClientPromise(game => game._cse_dev_listenForKeyBindingTask());
  _devGame.setOptionsAsync = makeClientPromise((game, options) => game._cse_dev_setOptions(options));
  _devGame.testOptionAsync = makeClientPromise((game, option) => game._cse_dev_testOption(option));
  _devGame.takeScreenshotAsync = makeClientPromise(game => game._cse_dev_takeScreenshot());

  // Building API Tasks
  _devGame.building.setModeAsync = makeClientPromise((game, mode) => game.building._cse_dev_setMode(mode));
  _devGame.building.selectBlockAsync = makeClientPromise((game, id) => game.building._cse_dev_selectBlock(id));
  _devGame.building.selectBlueprintAsync = makeClientPromise((game, id) => game.building._cse_dev_selectBlueprint(id));
  _devGame.building.selectPotentialItemAsync =
    makeClientPromise((game, id) => game.building._cse_dev_selectPotentialItem(id));
  _devGame.building.deleteBlueprintAsync = makeClientPromise((game, id) => game.building._cse_dev_deleteBlueprint(id));
  _devGame.building.createBlueprintFromSelectionAsync
    = makeClientPromise((game, name) => game.building._cse_dev_createBlueprintFromSelection(name));
  _devGame.building.replaceMaterialsAsync
    = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceMaterials(sID, rID, inS));
  _devGame.building.replaceShapesAsync
    = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceShapes(sID, rID, inS));

  // EVENTS
  _devGame.onReady = onReady;
  _devGame.on = events_on;
  _devGame.once = events_once;
  _devGame.trigger = events_trigger;
  _devGame.off = events_off;

  initEventForwarding();

  // Entity state
  _devGame.entities = {};
  initEntityState();

  // INIT MODELS
  initLoadingState();
  initPlayerState();
  initEnemyTargetState();
  initFriendlyTargetState();
  initKeyActions();
  initAbilityState();
  initAbilityBarState();
  initOfflineZoneSelectState();

  // INIT Services
  _devGame.signalR = initSignalR();

  _devGame.store = initGameDataStore();

  initCUAPIShim();
  initAnnouncementRouting();

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
    serverHost: 'https://hatcheryd.camelotunchained.com',
    options: {},
    keybinds: {},
    worldTime: 0,

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

    dropLight: {
      drop: noOp,
      removeLast: noOp,
      clearAll: noOp,
    },

    reloadUI: noOp,
    quit: noOp,
    sendSlashCommand: noOp,
    triggerKeyAction: noOp,
    playGameSound: noOp,

    setKeybind: noOp,
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

    entities: {},

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

function getKeybindSafe(id: number): Keybind {
  if (game.keybinds[id]) {
    return cloneDeep(game.keybinds[id]) as Keybind;
  }
  return {
    id,
    description: 'unknown',
    category: 'miscellaneous',
    binds: [{ name: '', value: 0 },{ name: '', value: 0 },{ name: '', value: 0 }],
  };
}

/* -------------------------------------------------- */
/* GRAPHQL                                            */
/* -------------------------------------------------- */

function graphQLHost() {
  return game.webAPIHost + '/graphql';
}

function defaultGraphQLOptions(): Partial<QueryOptions> {
  return {
    url: game.graphQL.host(),
    requestOptions: {
      headers: {
        Authorization: 'Bearer ' + game.accessToken,
        characterID: game.selfPlayerState ? game.selfPlayerState.characterID : '',
        shardID: String(game.shardID),
      },
    },
  };
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

/**
 * Announcement Handling
 */

function initAnnouncementRouting() {
  if (_devGame._cse_dev_announcementRouterHandle) {
    _devGame._cse_dev_announcementRouterHandle.clear();
  }

  _devGame.onPassiveAlert = onPassiveAlert;
  _devGame.sendPassiveAlert = sendPassiveAlert;
  _devGame.onSystemMessage = onSystemMessage;
  _devGame.sendSystemMessage = sendSystemMessage;

  game.on(game.engineEvents.EE_OnAnnouncement, (type: AnnouncementType, message: string) => {
    if ((type & AnnouncementType.Text) !== 0) {
      game.sendSystemMessage(message);
    }
    if ((type & AnnouncementType.PassiveAlert) !== 0) {
      game.sendPassiveAlert(message);
    }
  });
}

function onPassiveAlert(callback: (message: string) => any) {
  return game.on('passiveAlert', callback);
}

function sendPassiveAlert(message: string) {
  game.trigger('passiveAlert', message);
}

function onSystemMessage(callback: (message: string) => any) {
  return game.on('systemMessage', callback);
}

function sendSystemMessage(message: string) {
  game.trigger('systemMessage', message);
}
