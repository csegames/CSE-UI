/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import initGameInterface, { initOutOfContextGame } from "./initGameInterface";
import initClientTasks from './clientTasks';
import { BaseDevGameInterface, BaseGameInterface } from "./BaseGameInterface";

declare global {
  interface Window {
    game: BaseGameInterface;
    _devGame: BaseDevGameInterface;
  }
}

function initUI() {
  if (!window.game) {
    (window as any).game = initOutOfContextGame();
    console.log('initializing base game out of context');
  }

  window._devGame = window.game as BaseDevGameInterface;

  if (game.ready) return;

  if (typeof engine !== 'undefined') {
    initGameInterface(engine.isAttached);
  } else {
    initGameInterface(false);
  }
}

export function initializeGame() {
  if (typeof engine !== 'undefined' && engine.isAttached && !window.game) {
    engine.on('Ready', () => {
      initUI();
    });
  }

  initUI();
  initClientTasks();
}
