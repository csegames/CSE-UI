/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  Updatable,
  initUpdatable,
  executeUpdateCallbacks,
  createDefaultOnReady,
  createDefaultOnUpdated
} from './Updatable';
import { withDefaults } from '../utils/withDefaults';
import { _devGame } from '..';
import { engine } from '../engine';
import { BaseDevGameInterface, BaseGameInterface } from '../BaseGameInterface';

export const IsAutoRunning_Update = 'isAutoRunning.update';

interface IsAutoRunningStateModel {
  isAutoRunning: boolean;
}

type IsAutoRunningStateUpdatable = Readonly<IsAutoRunningStateModel> & Updatable;
export interface IsAutoRunningState extends IsAutoRunningStateUpdatable {}

function initDefault(): IsAutoRunningState {
  return {
    isAutoRunning: false,
    isReady: false,
    updateEventName: IsAutoRunning_Update,
    onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, IsAutoRunning_Update),
    onReady: (game: BaseGameInterface) => createDefaultOnReady(game, IsAutoRunning_Update)
  }; // Updatable
}

/**
 * Initialize this model with the game engine.
 */

function init(_devGame: BaseDevGameInterface) {
  _devGame.isAutoRunningState = withDefaults({ isAutoRunning: (_devGame as any).isAutoRunning }, initDefault(), true);
  initUpdatable(_devGame.isAutoRunningState);
}

function onReceiveIsAutoRunningStateUpdate(isAutoRunning: boolean) {
  if (_devGame.debug) {
    console.groupCollapsed(`Client > ${IsAutoRunning_Update}`);
    try {
      console.log(isAutoRunning);
    } catch {}
    console.groupEnd();
  }

  if (!_devGame.isAutoRunningState) {
    _devGame.isAutoRunningState = withDefaults({ isAutoRunning }, initDefault(), false);
    // init Updatable.
    initUpdatable(_devGame.usingGamepadState);
  } else {
    _devGame.isAutoRunningState = withDefaults({ isAutoRunning }, initDefault(), false);
  }

  executeUpdateCallbacks(_devGame, _devGame.isAutoRunningState);
}

export default function (_devGame: BaseDevGameInterface) {
  init(_devGame);
  engine.on(IsAutoRunning_Update, onReceiveIsAutoRunningStateUpdate);
}
