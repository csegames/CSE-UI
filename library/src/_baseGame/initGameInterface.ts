/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Callback, EventEmitter } from './types/EventEmitter';
import { initClientTasks, makeClientPromise } from './clientTasks';
import { BaseGameModel, BaseGameInterface, BaseDevGameInterface } from './BaseGameInterface';
import { BuildingMode } from './types/Building';

import initEventForwarding from './engineEvents';
import initUsingGamepadState from './GameClientModels/UsingGamepadState';
import initIsAutoRunningState from './GameClientModels/IsAutoRunningState';
import { ListenerHandle } from './listenerHandle';

let isEmitterVerbose = false;
let globalEmitter = new EventEmitter((...params: any[]) => {
  if (isEmitterVerbose) console.log(...params);
});

export default function (game: BaseGameInterface, isAttached: boolean) {
  // FIXME : decorating the coherent interface this way is bad. The
  // functionality of devGame should be an actual decorator or a
  // distinct object.
  const _devGame: BaseDevGameInterface = game as BaseDevGameInterface;
  _devGame.ready = false;
  _devGame.debug = false;
  _devGame.setDebug = (value: boolean) => {
    _devGame.debug = value;
    isEmitterVerbose = value;
  };
  _devGame.isClientAttached = isAttached;

  // TASKS
  _devGame._activeTasks = {};
  _devGame.listenForKeyBindingAsync = makeClientPromise((game) => game._cse_dev_listenForKeyBindingTask());
  _devGame.setOptionsAsync = makeClientPromise((game, options) => game._cse_dev_setOptions(options));
  _devGame.testOptionAsync = makeClientPromise((game, option) => game._cse_dev_testOption(option));
  _devGame.takeScreenshotAsync = makeClientPromise((game) => game._cse_dev_takeScreenshot());
  // Building API Tasks
  _devGame.building.setModeAsync = makeClientPromise((game, mode) => game.building._cse_dev_setMode(mode));
  _devGame.building.selectBlockAsync = makeClientPromise((game, id) => game.building._cse_dev_selectBlock(id));
  _devGame.building.selectBlueprintAsync = makeClientPromise((game, id) => game.building._cse_dev_selectBlueprint(id));
  _devGame.building.selectPotentialItemAsync = makeClientPromise((game, id) =>
    game.building._cse_dev_selectPotentialItem(id)
  );
  _devGame.building.deleteBlueprintAsync = makeClientPromise((game, id) => game.building._cse_dev_deleteBlueprint(id));
  _devGame.building.createBlueprintFromSelectionAsync = makeClientPromise((game, name) =>
    game.building._cse_dev_createBlueprintFromSelection(name)
  );
  _devGame.building.replaceMaterialsAsync = makeClientPromise((game, sID, rID, inS) =>
    game.building._cse_dev_replaceMaterials(sID, rID, inS)
  );
  _devGame.building.replaceShapesAsync = makeClientPromise((game, sID, rID, inS) =>
    game.building._cse_dev_replaceShapes(sID, rID, inS)
  );

  // EVENTS
  _devGame.onReady = (callback: () => any) => {
    if (_devGame.ready) callback();
    return globalEmitter.on('Ready', callback);
  };
  _devGame.on = globalEmitter.on.bind(globalEmitter);
  _devGame.once = globalEmitter.listenOnce.bind(globalEmitter);
  _devGame.trigger = globalEmitter.trigger.bind(globalEmitter);
  _devGame.off = globalEmitter.trigger.bind(globalEmitter);

  initClientTasks();
  initEventForwarding(_devGame);
  initUsingGamepadState(_devGame);
  initIsAutoRunningState(_devGame);

  return _devGame;
}

export function initOutOfContextGame(): BaseGameInterface {
  const model: BaseGameModel = {
    patchResourceChannel: 4,
    characterID: 'test-characterID',
    pktHash: '',
    accessToken: 'developer',
    webAPIHost: 'https://hatcheryapi.camelotunchained.com',
    serverHost: 'https://hatcheryd.camelotunchained.com',
    options: {},
    keybinds: {},
    worldTime: 0,
    fps: 0,
    npcCount: 0,
    isPublicBuild: true,
    buildNumber: 0,
    showPerfHUD: true,
    isCUBE: false,
    uiMockMode: 0,

    reloadUI: noOp,
    quit: noOp,
    sendSlashCommand: noOp,
    tabComplete: noOp,
    addOfflineCharacter: noOp,
    removeOfflineCharacter: noOp,
    setOfflineCharacterAnimation: noOp,
    triggerKeyAction: noOp,
    playGameSound: noOp,

    setKeybind: noOp,
    clearKeybind: noOp,
    resetKeybinds: noOp,
    resetOptions: noOp,
    releaseMouseCapture: noOp,
    setMenuInputMode: noOp,
    setWaitingForSelect: noOp,
    setSelectedEmoteIndex: noOp,

    gamepadSelectBinding: {
      name: 'Gamepad Select',
      value: -1,
      iconClass: ''
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
      potentialItems: {}
    },

    itemPlacementMode: {
      isActive: false,
      activeTransformMode: null,
      requestStart: noOp,
      requestCommit: noOp,
      requestReset: noOp,
      requestCancel: noOp,
      requestChangeTransformMode: noOp
    },

    dropLight: {
      drop: noOp,
      removeLast: noOp,
      clearAll: noOp
    },

    map: {
      backgroundImageURL: '',
      scale: 1,
      positionOffset: { x: 0, y: 0 }
    },

    connectToServer: noOp,
    disconnectFromAllServers: noOp,
    isAutoConnectEnabled: false,
    isConnectedOrConnectingToServer: false,
    isConnectedToServer: false,
    isDisconnectingFromAllServers: false,

    actions: {
      inEditMode: false,
      requestedEditMode: false,
      requestEditMode: noOp,
      assignSlottedAction: noOp,
      assignKeybind: noOp,
      setActiveAnchorGroup: noOp,
      activateSlottedAction: noOp,
      clearSlottedAction: noOp,
      removeAnchor: noOp
    },

    startSteamPurchase: noOp,
    canStartSteamPurchase: false,
    isSteamOverlayEnabled: false,
    isSteamBuild: false
  };

  const mockEmitter = new EventEmitter();
  let debug = false;

  return {
    ...model,
    ready: true,
    onBeginChat: (callback: (msg: string) => {}) => mockEmitter.on('beginChat', callback),
    beginChat: (msg: string) => mockEmitter.trigger('beginChat', msg),
    onPushChat: (callback: (msg: string) => {}) => mockEmitter.on('pushChat', callback),
    pushChat: (msg: string) => mockEmitter.trigger('pushChat', msg),
    onReady: mockOnReady,
    debug,
    setDebug: (value: boolean) => (debug = value),
    onCombatEvent: noOp,
    onConsoleText: noOp,
    onKeybindChanged: noOp,
    onGameOptionChanged: noOp,
    getKeybindSafe: noOp,
    onControllerSelect: noOp,
    onNetworkFailure: noOp,
    onAnchorVisibilityChanged: noOp,
    onSteamPurchaseComplete: noOp,
    onMenuControllerEvent: noOp,
    resetOptions: noOp,
    resetKeybinds: noOp,
    listenForKeyBindingAsync: noOp,
    setOptionsAsync: noOp,
    on: (topic: string, callback: Callback) => mockEmitter.on(topic, callback),
    off: (handle: any) => mockEmitter.off(handle as number | ListenerHandle),
    testOptionAsync: noOp,
    takeScreenshotAsync: noOp,
    once: (topic: string, callback: Callback) => mockEmitter.listenOnce(topic, callback),
    trigger: (name: string, ...args: any[]) => mockEmitter.trigger(name, ...args),
    usingGamepad: false,
    usingGamepadState: {
      usingGamepad: false,
      isReady: true,
      updateEventName: '',
      onUpdated: (game: BaseGameInterface) => noOp,
      onReady: (game: BaseGameInterface) => mockOnReady
    },
    isAutoRunning: false,
    isAutoRunningState: {
      isAutoRunning: false,
      isReady: true,
      updateEventName: '',
      onUpdated: (game: BaseGameInterface) => noOp,
      onReady: (game: BaseGameInterface) => mockOnReady
    },
    selectedEmoteIndex: 0,
    isAutoConnectEnabled: false,
    isSteamBuild: false,
    isClientAttached: false,
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
      replaceShapesAsync: noOp
    }
  };
}

function noOp(...args: any[]): any {}

function mockOnReady(callback: () => any): ListenerHandle {
  window.setTimeout(callback);
  return {
    close() {}
  };
}
