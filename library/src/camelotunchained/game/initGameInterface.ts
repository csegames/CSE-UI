/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI';
import initSignalR from '../signalR';

import { GameModel, GameInterface } from './GameInterface';

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

import initGameDataStore from './store';
import { QueryOptions } from '../../_baseGame/graphql/query';

export default function(isAttached: boolean) {
  _devGame.graphQL = {
    ..._devGame.graphQL,
    defaultOptions: defaultGraphQLOptions,
  };

  camelotunchained._devGame.webAPI = webAPI;

  camelotunchained._devGame.signalRHost = signalRHost;

  camelotunchained._devGame.abilityStates = {};

  camelotunchained._devGame.engineEvents = engineEvents;
  camelotunchained._devGame.getKeybindSafe = getKeybindSafe;

  // Building API Tasks
  camelotunchained._devGame.building.setModeAsync =
    makeClientPromise((game, mode) => game.building._cse_dev_setMode(mode));
  camelotunchained._devGame.building.selectBlockAsync =
    makeClientPromise((game, id) => game.building._cse_dev_selectBlock(id));
  camelotunchained._devGame.building.selectBlueprintAsync =
    makeClientPromise((game, id) => game.building._cse_dev_selectBlueprint(id));
  camelotunchained._devGame.building.selectPotentialItemAsync =
    makeClientPromise((game, id) => game.building._cse_dev_selectPotentialItem(id));
  camelotunchained._devGame.building.deleteBlueprintAsync =
    makeClientPromise((game, id) => game.building._cse_dev_deleteBlueprint(id));
  camelotunchained._devGame.building.createBlueprintFromSelectionAsync
    = makeClientPromise((game, name) => game.building._cse_dev_createBlueprintFromSelection(name));
  camelotunchained._devGame.building.replaceMaterialsAsync
    = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceMaterials(sID, rID, inS));
  camelotunchained._devGame.building.replaceShapesAsync
    = makeClientPromise((game, sID, rID, inS) => game.building._cse_dev_replaceShapes(sID, rID, inS));

  // Entity state
  camelotunchained._devGame.entities = {};
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
  camelotunchained._devGame.signalR = initSignalR();

  camelotunchained._devGame.store = initGameDataStore();

  initAnnouncementRouting();

  // READY!
  _devGame.ready = true;
}

/**
 * Creates a game object for replacement use when not running in the context of the game client.
 */
export function initOutOfContextGame(): Partial<GameInterface> {
  const model: GameModel = {
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

    _cse_dev_beginTriggerKeyActionLoop: noOp,
    _cse_dev_endTriggerKeyActionLoop: noOp,
  };

  return withOverrides({
    ...model,
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

function defaultGraphQLOptions(): Partial<QueryOptions> {
  return {
    url: game.graphQL.host(),
    requestOptions: {
      headers: {
        Authorization: 'Bearer ' + game.accessToken,
        characterID: camelotunchained.game.selfPlayerState ? camelotunchained.game.selfPlayerState.characterID : '',
        shardID: String(game.shardID),
      },
    },
  };
}

/**
 * Announcement Handling
 */

function initAnnouncementRouting() {
  if (camelotunchained._devGame._cse_dev_announcementRouterHandle) {
    camelotunchained._devGame._cse_dev_announcementRouterHandle.clear();
  }

  camelotunchained._devGame.onPassiveAlert = onPassiveAlert;
  camelotunchained._devGame.sendPassiveAlert = sendPassiveAlert;
  _devGame.onSystemMessage = onSystemMessage;
  _devGame.sendSystemMessage = sendSystemMessage;

  game.on(camelotunchained.game.engineEvents.EE_OnAnnouncement,
    (type: AnnouncementType, message: string) => {
    if ((type & AnnouncementType.Text) !== 0) {
      game.sendSystemMessage(message);
    }
    if ((type & AnnouncementType.PassiveAlert) !== 0) {
      camelotunchained.game.sendPassiveAlert(message);
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
