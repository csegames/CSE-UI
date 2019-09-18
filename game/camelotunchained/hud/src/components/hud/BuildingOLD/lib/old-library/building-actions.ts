/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function changeMode(mode: BuildingMode) {
  game.building.setModeAsync(mode);
}

export function commit() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeCommitBlock);
}

export function undo() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeUndoBlockPlacement);
}

export function redo() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeRedoBlockPlacement);
}

export function rotateX() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeRotateBlockX);
}

export function rotateY() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeRotateBlockY);
}

export function rotateZ() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeRotateBlockZ);
}

export function flipX() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeFlipBlockX);
}

export function flipY() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeFlipBlockY);
}

export function flipZ() {
  game.triggerKeyAction(camelotunchained.game.keyActions.CubeFlipBlockZ);
}
