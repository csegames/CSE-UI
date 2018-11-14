/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';
import engineInit from './_Init';

/**
 * These key actions are numbers that reference actions that can be used with game.triggerKeyAction as well as relate
 * to the ID of a KeyBind
 */
export interface KeyActionsModel {
  CubeBuildingCopy: number;
  CubeBuildingPaste: number;
  CubeCommitBlock: number;
  CubeFlipBlockX: number;
  CubeFlipBlockY: number;
  CubeFlipBlockZ: number;
  CubeRedoBlockPlacement: number;
  CubeRotateBlockX: number;
  CubeRotateBlockY: number;
  CubeRotateBlockZ: number;
  CubeUndoBlockPlacement: number;

  PlayerCameraFreeToggle: number;
  UIToggleBuildingMode: number;
}

declare global {
  type KeyActions = KeyActionsModel & Updatable;
  type ImmutableKeyActions = DeepImmutableObject<KeyActions>;
}


export const KeyActions_Update = 'keyActions.update';

function initDefault(): KeyActions {

  return new Proxy({
    isReady: false,
    updateEventName: KeyActions_Update,
    onUpdated: createDefaultOnUpdated(KeyActions_Update),
    onReady: createDefaultOnReady(KeyActions_Update),
  }, {
    // default any unassigned value as 0
    get: (obj, key) => {
      if (key in obj) {
        return obj[key];
      } else {
        console.error('missing keyAction', key);
        return 0;
      }
    },
  }) as KeyActions;
}

export default function() {

  engineInit(
    KeyActions_Update,
    initDefault,
    () => game.keyActions,
    (model: KeyActionsModel) => _devGame.keyActions = model as KeyActions);

}
