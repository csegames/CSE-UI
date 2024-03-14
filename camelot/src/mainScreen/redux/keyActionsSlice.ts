/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeyActionsModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/KeyActions';

export interface KeyActionsState extends KeyActionsModel {}

function buildDefaultKeyActionsState() {
  const DefaultKeyActionsState: KeyActionsState = {
    SelectionModeToggle: 0,
    CubeBuildingCopy: 0,
    CubeBuildingPaste: 0,
    CubeCommitBlock: 0,
    CubeFlipBlockX: 0,
    CubeFlipBlockY: 0,
    CubeFlipBlockZ: 0,
    CubeRedoBlockPlacement: 0,
    CubeRotateBlockX: 0,
    CubeRotateBlockY: 0,
    CubeRotateBlockZ: 0,
    CubeUndoBlockPlacement: 0,
    CubeCycleSelectedBlockShape: 0,
    CubeCycleSelectedBlockSubstance: 0,
    PlayerCameraFreeToggle: 0,
    UIToggleBuildingMode: 0,
    UIHideToggle: 0
  };

  return DefaultKeyActionsState;
}

export const keyActionsSlice = createSlice({
  name: 'keyActions',
  initialState: buildDefaultKeyActionsState(),
  reducers: {
    updateKeyActions: (state: KeyActionsState, action: PayloadAction<KeyActionsModel>) => {
      Object.assign(state, action.payload);
    }
  }
});

export const { updateKeyActions } = keyActionsSlice.actions;
