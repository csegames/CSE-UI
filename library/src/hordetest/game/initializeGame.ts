/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import initGameInterface, { initOutOfContextGame } from './initGameInterface';

import { GameInterface, DevGameInterface } from './GameInterface';
import initCoherentRecording from '../../_baseGame/coherent';
import { initEventForwarding } from './engineEvents';

declare global {
  interface Window {
    hordetest: {
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
  if (!window.hordetest || !window.hordetest.game) {
    (window as any).hordetest = {};
    (window as any).hordetest.game = initOutOfContextGame();
    console.log('initializing hordetest game out of context');
  }

  window.hordetest._devGame = window.hordetest.game as DevGameInterface;

  if (game.ready) return;

  if (typeof engine !== 'undefined') {
    initGameInterface(engine.isAttached);
  } else {
    initGameInterface(false);
  }
}

let initial = true;
export default function() {
  initCoherentRecording();
  if (typeof engine !== 'undefined' && engine.isAttached && (!window.hordetest || !window.hordetest.game)) {
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
}
