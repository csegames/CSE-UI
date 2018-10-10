/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function changeMode(mode: BuildingMode) {
  game.plot.setBuildingMode(mode);
}

export function commit() {
  game.triggerKeyAction(game.keyActions.CubeCommitBlock);
}

export function undo() {
  game.triggerKeyAction(game.keyActions.CubeUndoBlockPlacement);
}

export function redo() {
  game.triggerKeyAction(game.keyActions.CubeRedoBlockPlacement);
}

export function rotateX() {
  game.triggerKeyAction(game.keyActions.CubeRotateBlockX);
}

export function rotateY() {
  game.triggerKeyAction(game.keyActions.CubeRotateBlockY);
}

export function rotateZ() {
  game.triggerKeyAction(game.keyActions.CubeRotateBlockZ);
}

export function flipX() {
  game.triggerKeyAction(game.keyActions.CubeFlipBlockX);
}

export function flipY() {
  game.triggerKeyAction(game.keyActions.CubeFlipBlockY);
}

export function flipZ() {
  game.triggerKeyAction(game.keyActions.CubeFlipBlockZ);
}
