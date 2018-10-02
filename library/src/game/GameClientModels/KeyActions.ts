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
  PlayerAbility1: number;
  PlayerAbility2: number;
  PlayerAbility3: number;
  PlayerAbility4: number;
  PlayerAbility5: number;
  PlayerAbility6: number;
  PlayerAbility7: number;
  PlayerAbility8: number;
  PlayerAbility9: number;
  PlayerAbility10: number;
  PlayerAbility11: number;
  PlayerAbility12: number;
  PlayerAbility13: number;
  PlayerAbility14: number;
  PlayerAbility15: number;
  PlayerAbility16: number;
  PlayerAbility17: number;
  PlayerAbility18: number;
  PlayerAbility19: number;
  PlayerAbility20: number;
  PlayerAbility21: number;
  PlayerAbility22: number;
  PlayerAbility23: number;
  PlayerAbility24: number;
  PlayerAbility25: number;
  PlayerAbility26: number;
  PlayerAbility27: number;
  PlayerAbility28: number;
  PlayerAbility29: number;
  PlayerAbility30: number;

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

export type KeyActions = KeyActionsModel & Updatable;

export const KeyActions_Update = 'keyActions.update';

function initDefault(): KeyActions {
  return new Proxy({
    isReady: false,
    _name: KeyActions_Update,
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
    () => _devGame.keyActions = initDefault(),
    () => game.keyActions,
    (model: KeyActionsModel) => _devGame.keyActions = model as KeyActions);

}
