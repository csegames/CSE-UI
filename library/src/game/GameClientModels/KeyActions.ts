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
  // Cube
  CubeScreenShot: number;
  CubeBuildingCopy: number;
  CubeBuildingPaste: number;
  CubeFlipBlockX: number;
  CubeFlipBlockY: number;
  CubeFlipBlockZ: number;
  CubeRotateBlockX: number;
  CubeRotateBlockY: number;
  CubeRotateBlockZ: number;
  CubeCycleSelectedBlockShape: number;
  CubeCycleSelectedBlockSubstance: number;
  CubeRedoBlockPlacement: number;
  CubeUndoBlockPlacement: number;
  CubeCommitBlock: number;
  CubeSelectBlocks: number;
  CubeSaveBuilding: number;
  CubePlotWindow: number;
  CubeBlockLeftMove: number;
  CubeBlockRightMove: number;
  CubeBlockForwardMove: number;
  CubeBlockBackwardMove: number;
  CubeBlockUpMove: number;
  CubeBlockDownMove: number;
  CubeMouseCapture: number;
  CubeShowStability: number;
  CubeHideStability: number;
  // CubeApplyStability,

  // UI
  UIMenu: number;
  UIChat: number;
  UIInventoryWindow: number;
  UIEquippedGearWindow: number;
  UIMapWindow: number;
  UIAbilityBuilderWindow: number;
  UISpellbookWindow: number;
  UIToggleBuildingMode: number;
  UICommand: number;
  UIChatModifier: number;
  UIToggleTileDebug: number;
  UIPerfReset: number;
  UIToggleDiagnostic: number;
  UIRecordingToggle: number;

  // Player
  PlayerTargetSelf: number;
  PlayerTargetClearTargets: number;
  PlayerTargetClosestFriend: number;
  PlayerTargetCycleFriends: number;
  PlayerTargetClosestEnemy: number;
  PlayerTargetCycleEnemies: number;
  PlayerClickTarget: number;
  PlayerClickInteract: number;
  PlayerTriggerAbility: number;
  PlayerCancel: number;
  PlayerBandage: number;
  PlayerJump: number;
  PlayerTurnRight: number;
  PlayerTurnLeft: number;
  PlayerRight: number;
  PlayerLeft: number;
  PlayerBack: number;
  PlayerForward: number;
  PlayerAutorun: number;
  PlayerFly: number;
  PlayerPickup: number;
  PlayerUp: number;
  PlayerDown: number;
  PlayerMovementModifier: number;
  PlayerMoveBoost: number;
  PlayerToggleAiming: number;
  CameraToggleAimingCursor: number;
  CameraCaptureAimingCursor: number;
  PlayerCameraFreeToggle: number;
  PlayerCameraFreePlayerToggle: number;

  // camera
  CameraMouseCameraCapture: number;
  CameraMouseMoveCapture: number;

  // editor
  EditorFocus: number;
  EditorToggleMove: number;
  EditorRotate: number;
  EditorScale: number;
  EditorMouseLeft: number;
  EditorMouseRight: number;
  EditorMouseMiddle: number;
  EditorUp: number;
  EditorDown: number;
  EditorRight: number;
  EditorLeft: number;
  EditorBack: number;
  EditorForward: number;
  EditorModifier: number;
  EditorBoost: number;

  // gizmos
  GizmoDrag: number;
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
