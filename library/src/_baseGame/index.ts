/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import initGameInterface, { initOutOfContextGame } from './initGameInterface';
import { BaseDevGameInterface, BaseGameInterface } from './BaseGameInterface';
import { engine } from './engine';

const LoadTimeoutSeconds = 60;

// Allow (only) this code to check for global injection from coherent
// TODO : pass BaseGameInterface as part of the Ready event
// (must drop legacy CU project first)
declare global {
  interface Window {
    game?: BaseGameInterface;
  }
}

let _devGame: BaseDevGameInterface;
let resolvedGame: BaseDevGameInterface;

function initializeGame(): Promise<BaseGameInterface> {
  engine.on('beginEventRecording', () => engine.beginEventRecording());
  engine.on('endEventRecording', () => engine.endEventRecording());
  engine.on('saveEventRecord', (path?: string) => engine.saveEventRecord(path));
  engine.on('replayEvents', (timeScale?: number, path?: string) => engine.replayEvents(timeScale, path));

  if (!engine.isAttached) {
    console.log('initializing base game out of context');
    return Promise.resolve(initializeDevGame(initOutOfContextGame()));
  }

  return window.game ? Promise.resolve(initializeDevGame(window.game)) : waitForGame();
}

function waitForGame(): Promise<BaseGameInterface> {
  return new Promise<BaseGameInterface>(
    (
      resolve: (gameOut: BaseGameInterface | PromiseLike<BaseGameInterface>) => void,
      reject: (reason?: any) => void
    ) => {
      // 'Ready' is overloaded, until this has been fixed we need to sanity check that the
      // signal we received is actually meant to tell us the game has been set.
      const onReady = (...args: any[]) => {
        if (!window.game) {
          return;
        }
        console.log('Coherent game object ready');
        window.clearTimeout(timeout);
        handle.clear();
        resolve(initializeDevGame(window.game));
      };
      const onTimeout = () => {
        handle.clear();
        reject(new Error(`Game load timed out after ${Math.floor(LoadTimeoutSeconds)} seconds`));
      };
      const timeout = window.setTimeout(onTimeout, LoadTimeoutSeconds * 1000);
      const handle = engine.on('Ready', onReady);
    }
  );
}

// FIXME : this should Proxy over a BaseGameModel instead of overwriting
// the properties of the native object maintained by Coherent
function initializeDevGame(source: BaseGameInterface): BaseDevGameInterface {
  if (_devGame) {
    throw new Error('Game initialization has run twice');
  }
  _devGame = initGameInterface(source, engine.isAttached);
  resolvedGame = _devGame;
  return _devGame;
}

const loadingPromise = initializeGame();
function loadGame(): Promise<BaseGameInterface> {
  return loadingPromise;
}

export { loadGame, resolvedGame as game, _devGame };
