/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts
import { KeyActions_Update } from '../GameClientModels/KeyActions';

enum MockKeyActions {
  CubeBuildingCopy,
  CubeBuildingPaste,
  CubeFlipBlockX,
  CubeFlipBlockY,
  CubeFlipBlockZ,
  CubeRotateBlockX,
  CubeRotateBlockY,
  CubeRotateBlockZ,
  CubeRedoBlockPlacement,
  CubeUndoBlockPlacement,
  UIToggleBuildingMode,
  PlayerCameraFreeToggle,
}

export function mockKeyActions() {
  console.log('MOCK.keyActions', 'initialize');
  camelotunchained._devGame.keyActions = {
    ...camelotunchained._devGame.keyActions,
    ...MockKeyActions,
  };
  engine.trigger(KeyActions_Update, camelotunchained._devGame.keyActions);
}
