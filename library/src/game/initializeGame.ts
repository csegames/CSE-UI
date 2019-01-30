/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import initGameInterface, { initOutOfContextGame } from './initGameInterface';

import { runMocks } from './mock';
import { GameInterface, GameModel, DevGameInterface } from './GameInterface';
import initClientTasks from './clientTasks';
import initCoherentRecording from './coherent';

declare global {
  interface Window {
    gameClient: GameModel;
    game: GameInterface;
    _devGame: DevGameInterface;
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

  window._devGame = window.game as DevGameInterface;

  if (game.ready) return;

  if (typeof engine !== 'undefined') {
    initGameInterface(engine.isAttached);
  } else {
    initGameInterface(false);
  }

  // Run mocks if mocking is enabled
  if (process.env.CUUI_ENABLE_MOCK) {
    (window as any).mockEngine = engine;
    runMocks();
  }
}

export default function() {
  initCoherentRecording();
  if (typeof engine !== 'undefined' && engine.isAttached && !window.game) {
    engine.on('Ready', () => {
      _devGame.ready = false;
      initUI();
    });
  }
  initUI();
  initClientTasks();
}
