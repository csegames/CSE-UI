/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
