/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from '../../../_baseGame/GameClientModels/_Updatable';
import engineInit from '../../../_baseGame/GameClientModels/_Init';

/**
 * These key actions are numbers that reference actions that can be used with game.triggerKeyAction as well as relate
 * to the ID of a KeyBind
 */
export interface KeyActionsModel {
  SelectionModeToggle: number;
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
  CubeCycleSelectedBlockShape: number;
  CubeCycleSelectedBlockSubstance: number;

  PlayerCameraFreeToggle: number;
  UIToggleBuildingMode: number;
  UIHideToggle: number;
}

declare global {
  type KeyActions = KeyActionsModel & Updatable;
  type ImmutableKeyActions = DeepImmutableObject<KeyActions>;
}


export const KeyActions_Update = 'keyActions.update';

function initDefault(): KeyActions {
  if (typeof Proxy !== 'undefined') {
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
}

export default function() {

  engineInit(
    KeyActions_Update,
    initDefault,
    () => camelotunchained.game.keyActions,
    (model: KeyActionsModel) => camelotunchained._devGame.keyActions = model as KeyActions);

}
