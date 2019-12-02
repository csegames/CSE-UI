/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GameModel, GameInterface } from './GameInterface';
import initPlayerState from './GameClientModels/PlayerState';
import initEntityState from './GameClientModels/EntityState';
import initAbilityState from './GameClientModels/AbilityState';
import initAbilityBarState from './GameClientModels/AbilityBarState';
import initConsumableItemsState from './GameClientModels/ConsumableItemsState';
import { QueryOptions } from '../../_baseGame/graphql/query';

export default function(isAttached: boolean) {
  _devGame.graphQL = {
    ..._devGame.graphQL,
    defaultOptions: defaultGraphQLOptions,
  };

  hordetest._devGame.abilityStates = {};

  // Entity state
  hordetest._devGame.entities = {};
  initEntityState();

  // INIT MODELS
  initPlayerState();
  initAbilityState();
  initAbilityBarState();
  initConsumableItemsState();


  hordetest._devGame.classes = (_devGame as any).classes;
  hordetest._devGame.races = (_devGame as any).races;

  // READY!
  _devGame.ready = true;
}

function noOp(...args: any[]): any {}

/**
 * Creates a game object for replacement use when not running in the context of the game client.
 */
export function initOutOfContextGame(): Partial<GameInterface> {
  const model: GameModel = {
    gamepadSelectBinding: { name: 'Gamepad Select', value: -1 },
    setWaitingForSelect: noOp,
  };

  return withOverrides({
    ...model,
    entities: {},
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

/* -------------------------------------------------- */
/* GRAPHQL                                            */
/* -------------------------------------------------- */

function defaultGraphQLOptions(): Partial<QueryOptions> {
  return {
    url: game.graphQL.host(),
    requestOptions: {
      headers: {
        Authorization: 'Bearer ' + game.accessToken,
        characterID: hordetest.game.selfPlayerState ? hordetest.game.selfPlayerState.characterID : '',
        shardID: String(game.shardID),
      },
    },
  };
}
