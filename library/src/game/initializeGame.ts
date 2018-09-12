/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import initGameInterface, { initOutOfContextGame } from './initGameInterface';

import { runMocks } from './mock';
import { GameInterface } from './GameInterface';
import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';

declare global {
  interface Window {
    game: GameInterface;
    __devGame: InternalGameInterfaceExt;
  }
}

/**
 * Initializes the game client <-> UI communication layer.
 * This method should be called before the initial React render call.
 */
function initUI() {

  if (!game) {
    console.warn('Initializing UI for out of context execution.');
    (window as any).game = initOutOfContextGame();
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
  if (engine.isAttached) {
    engine.on('Ready', initUI);
  } else {
    initUI();
  }
}
