/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts
import { KeyActions_Update } from '../GameClientModels/KeyActions';

enum MockKeyActions {
  // Cube
  CubeScreenShot,
  CubeBuildingCopy,
  CubeBuildingPaste,
  CubeFlipBlockX,
  CubeFlipBlockY,
  CubeFlipBlockZ,
  CubeRotateBlockX,
  CubeRotateBlockY,
  CubeRotateBlockZ,
  CubeCycleSelectedBlockShape,
  CubeCycleSelectedBlockSubstance,
  CubeRedoBlockPlacement,
  CubeUndoBlockPlacement,
  CubeCommitBlock,
  CubeSelectBlocks,
  CubeSaveBuilding,
  CubePlotWindow,
  CubeBlockLeftMove,
  CubeBlockRightMove,
  CubeBlockForwardMove,
  CubeBlockBackwardMove,
  CubeBlockUpMove,
  CubeBlockDownMove,
  CubeMouseCapture,
  CubeShowStability,
  CubeHideStability,
  // CubeApplyStability,

  // UI
  UIMenu,
  UIChat,
  UIInventoryWindow,
  UIEquippedGearWindow,
  UIMapWindow,
  UIAbilityBuilderWindow,
  UISpellbookWindow,
  UIToggleBuildingMode,
  UICommand,
  UIChatModifier,
  UIToggleTileDebug,
  UIPerfReset,
  UIToggleDiagnostic,
  UIRecordingToggle,

  // Player
  PlayerTargetSelf,
  PlayerTargetClearTargets,
  PlayerTargetClosestFriend,
  PlayerTargetCycleFriends,
  PlayerTargetClosestEnemy,
  PlayerTargetCycleEnemies,
  PlayerClickTarget,
  PlayerClickInteract,
  PlayerTriggerAbility,
  PlayerCancel,
  PlayerBandage,
  PlayerJump,
  PlayerTurnRight,
  PlayerTurnLeft,
  PlayerRight,
  PlayerLeft,
  PlayerBack,
  PlayerForward,
  PlayerAutorun,
  PlayerFly,
  PlayerPickup,
  PlayerUp,
  PlayerDown,
  PlayerMovementModifier,
  PlayerMoveBoost,
  PlayerToggleAiming,
  CameraToggleAimingCursor,
  CameraCaptureAimingCursor,
  PlayerCameraFreeToggle,
  PlayerCameraFreePlayerToggle,

  // camera
  CameraMouseCameraCapture,
  CameraMouseMoveCapture,

  // editor
  EditorFocus,
  EditorToggleMove,
  EditorRotate,
  EditorScale,
  EditorMouseLeft,
  EditorMouseRight,
  EditorMouseMiddle,
  EditorUp,
  EditorDown,
  EditorRight,
  EditorLeft,
  EditorBack,
  EditorForward,
  EditorModifier,
  EditorBoost,

  // gizmos
  GizmoDrag,
}

export function mockKeyActions() {
  console.log('MOCK.keyActions', 'initialize');
  _devGame.keyActions = {
    ..._devGame.keyActions,
    ...MockKeyActions,
  };
  engine.trigger(KeyActions_Update, _devGame.keyActions);
}
