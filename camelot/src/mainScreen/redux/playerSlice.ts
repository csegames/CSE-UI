/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelfPlayerStateModel } from '@csegames/library/dist/_baseGame/GameClientModels/SelfPlayerState';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/camelotunchained/game/types/CharacterKind';
import { DefaultBaseEntityState } from './entitiesSlice';

// SelfPlayerStateModel, oddly enough, does NOT inherit from PlayerEntityStateModel.  We are just
// combining them for convenience here to keep the data structure as flat as possible.
type FullPlayerState = SelfPlayerStateModel & PlayerEntityStateModel;

const DefaultSelfPlayerState: SelfPlayerStateModel = {
  shardID: 0,
  characterID: '',
  accountID: '',
  entityID: '',
  zoneID: '',
  controlledEntityID: '',
  facing: { pitch: 0, yaw: 0 },
  cameraFacing: { pitch: 0, yaw: 0 },
  viewBearing: 0,
  viewOrigin: { x: 0, y: 0, z: 0 },
  // TODO: Move these functions out of Redux entirely.  Let them live on the client function interface... is that what 'game' will become?
  respawn: () => {},
  requestEnemyTarget: () => {
    return false;
  },
  requestFriendlyTarget: () => {
    return false;
  }
};

const DefaultPlayerEntityStateModel: PlayerEntityStateModel = {
  ...DefaultBaseEntityState,

  type: 'player',
  characterKind: CharacterKind.User,
  accountID: '',
  race: 0,
  gender: 0,
  classID: 0,
  wounds: 0,
  controlledEntityID: ''
};

const DefaultPlayerState: FullPlayerState = {
  ...DefaultSelfPlayerState,
  ...DefaultPlayerEntityStateModel
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: DefaultPlayerState,
  reducers: {
    updatePlayerDelta: (state: FullPlayerState, action: PayloadAction<Partial<FullPlayerState>>) => {
      Object.assign(state, action.payload);
    }
  }
});

export const { updatePlayerDelta } = playerSlice.actions;
