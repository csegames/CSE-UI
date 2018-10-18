/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import initGameInterface, { initOutOfContextGame } from './initGameInterface';

import { runMocks } from './mock';
import { GameInterface, GameModel, GameModelTasks } from './GameInterface';
import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';
import initClientTasks from './clientTasks';

declare global {
  interface Window {
    gameClient: GameModel;
    game: GameInterface;
    _devGame: InternalGameInterfaceExt & GameModelTasks;
  }
}

/**
 * Initializes the game client <-> UI communication layer.
 * This method should be called before the initial React render call.
 */
function initUI() {

  if (!window.game) {
    (window as any).game = initOutOfContextGame();
    console.log('initializing game out of context');
  }

  if (!window._devGame) {
    window._devGame = window.game as InternalGameInterfaceExt & GameModelTasks;
  }

  if (game.ready) return;
  initGameInterface(engine.isAttached);

  // Run mocks if mocking is enabled
  if (process.env.CUUI_ENABLE_MOCK) {
    (window as any).mockEngine = engine;
    runMocks();
  }
}

export default function() {
  console.log('initializing game engine');
  if (engine.isAttached && !window.game) {
    engine.on('Ready', () => {
      _devGame.ready = false;
      initUI();
    });
  }
  initUI();
  initClientTasks();
}
