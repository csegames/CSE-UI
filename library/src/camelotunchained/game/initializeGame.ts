/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import initGameInterface, { initOutOfContextGame } from './initGameInterface';

import { runMocks } from './mock';
import { GameInterface, GameModel, DevGameInterface } from './GameInterface';
import initClientTasks from '../../_baseGame/clientTasks';
import initCoherentRecording from '../../_baseGame/coherent';
import { initEventForwarding } from './engineEvents';

declare global {
  interface Window {
    gameClient: GameModel;
    camelotunchained: {
      game: GameInterface;
      _devGame: DevGameInterface;
    };
  }
}

/**
 * Initializes the game client <-> UI communication layer.
 * This method should be called before the initial React render call.
 */
function initUI() {
  if (!window.camelotunchained || !window.camelotunchained.game) {
    (window as any).camelotunchained = {};
    (window as any).camelotunchained.game = initOutOfContextGame();
    console.log('initializing camelot unchained game out of context');
  }

  window.camelotunchained._devGame = window.camelotunchained.game as DevGameInterface;

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

let initial = true;
export default function() {
  initCoherentRecording();
  if (typeof engine !== 'undefined' && engine.isAttached && (!window.camelotunchained || !window.camelotunchained.game)) {
    engine.on('Ready', () => {
      _devGame.ready = false;
      initUI();
      if (initial) {
        initEventForwarding();
      }
      initial = false;
    });
  }
  initUI();
  initClientTasks();
}
