/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  Facing2fDegrees,
  SelfPlayerStateModel
} from '@csegames/library/dist/_baseGame/GameClientModels/SelfPlayerState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Vec3f } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import {
  EntityResource,
  PlayerEntityStateModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';

// SelfPlayerStateModel, oddly enough, does NOT inherit from PlayerEntityStateModel.  We are just
// combining them for convenience here to keep the data structure as flat as possible.
export type FullPlayerState = SelfPlayerStateModel & PlayerEntityStateModel;

const DefaultPlayerState: FullPlayerState = {
  facing: {
    yaw: NaN,
    pitch: NaN
  },
  viewBearing: 0, //used for the compass and for objectives.
  viewOrigin: {
    x: 0,
    y: 0,
    z: 0
  },
  wounds: NaN,
  totalKills: 0,
  teamKills: 0,
  isAlive: true,
  position: {
    x: NaN,
    y: NaN,
    z: NaN
  },
  resources: {},
  statuses: {},
  classID: 0,
  scenarioRoundState: ScenarioRoundState.Uninitialized,
  scenarioID: null,
  scenarioRoundStateStartTime: NaN,
  objective: null,

  // These fields are here in case I need to check them later for updates, to incorporate them into the new update flow.
  scenarioRoundStateEndTime: NaN,
  survivedTime: NaN,
  currentDeaths: NaN,
  maxDeaths: NaN,

  name: '',

  // These fields are only here to satisfy the type definition.  I don't believe they ever actually update in a way that significantly impacts gameplay.
  type: '',
  accountID: '',
  characterID: '',
  entityID: '',
  zoneID: '',
  controlledEntityID: '',
  cameraFacing: { pitch: 0, yaw: 0 },
  requestEnemyTarget: undefined,
  requestFriendlyTarget: undefined,
  portraitURL: '',
  iconClass: '',
  faction: 0,
  isShielded: false,

  respawn: undefined, // This field is normally a callback, however this instance's implementation of 'respawn' should never be called, so it's left undefined here.
  characterKind: CharacterKind.User,
  race: 0,
  gender: 0,
  killersRace: 0,
  killersName: null,
  lifeState: LifeState.Alive,
  deathStartTime: 0,
  downedStateEndTime: NaN
};

export function getBearingDegreesForWorldLocation(worldLocation: Vec3f, viewOrigin: Vec3f): number {
  const radiansToDegrees = (valueRads: number): number => (valueRads * 180) / Math.PI;
  const vectorLength = (vec: Vec3f): number => Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
  const vectorNormalize = (vec: Vec3f): Vec3f => {
    const invLength = 1.0 / vectorLength(vec);
    return { x: vec.x * invLength, y: vec.y * invLength, z: vec.z * invLength };
  };

  const bearingFromYawDegrees = (yawDegrees: number): number => {
    yawDegrees = 90.0 - yawDegrees;
    while (yawDegrees < 0.0) {
      yawDegrees += 360.0;
    }
    return yawDegrees;
  };

  const direction: Vec3f = vectorNormalize({
    x: worldLocation.x - viewOrigin.x,
    y: worldLocation.y - viewOrigin.y,
    z: worldLocation.z - viewOrigin.z
  });

  return bearingFromYawDegrees(radiansToDegrees(Math.atan2(direction.y, direction.x)));
}

export const playerSlice = createSlice({
  name: 'player',
  initialState: DefaultPlayerState,
  reducers: {
    updatePlayerEntityID: (state: FullPlayerState, action: PayloadAction<string>) => {
      state.entityID = action.payload;
    },
    updatePlayerFacing: (state: FullPlayerState, action: PayloadAction<Facing2fDegrees>) => {
      state.facing = action.payload;
    },
    updatePlayerViewBearing: (state: FullPlayerState, action: PayloadAction<number>) => {
      state.viewBearing = action.payload;
    },
    updatePlayerViewOrigin: (state: FullPlayerState, action: PayloadAction<Vec3f>) => {
      state.viewOrigin = action.payload;
    },
    updatePlayerPosition: (state: FullPlayerState, action: PayloadAction<Vec3f>) => {
      state.position = action.payload;
    },
    updatePlayerStatuses: (state: FullPlayerState, action: PayloadAction<ArrayMap<Status>>) => {
      state.statuses = action.payload;
    },
    updatePlayerClassID: (state: FullPlayerState, action: PayloadAction<number>) => {
      state.classID = action.payload;
    },
    updateScenarioRoundState: (state: FullPlayerState, action: PayloadAction<ScenarioRoundState>) => {
      state.scenarioRoundState = action.payload;
    },
    updateScenarioStartTime: (state: FullPlayerState, action: PayloadAction<number>) => {
      state.scenarioRoundStateStartTime = action.payload;
    },
    updatePlayerTotalKills: (state: FullPlayerState, action: PayloadAction<number>) => {
      state.totalKills = action.payload;
    },
    updatePlayerTeamKills: (state: FullPlayerState, action: PayloadAction<number>) => {
      state.teamKills = action.payload;
    },
    updatePlayerIsAlive: (state: FullPlayerState, action: PayloadAction<boolean>) => {
      state.isAlive = action.payload;
    },
    updatePlayerResources: (state: FullPlayerState, action: PayloadAction<ArrayMap<EntityResource>>) => {
      state.resources = action.payload;
    },
    updatePlayerDelta: (state: FullPlayerState, action: PayloadAction<Partial<FullPlayerState>>) => {
      const newState: FullPlayerState = {
        ...state,
        ...action.payload
      };
      // Only need a return when completely replacing the old state.
      return newState;
    }
  }
});

export const {
  updatePlayerEntityID,
  updatePlayerFacing,
  updatePlayerViewBearing,
  updatePlayerViewOrigin,
  updatePlayerPosition,
  updatePlayerStatuses,
  updatePlayerClassID,
  updateScenarioRoundState,
  updateScenarioStartTime,
  updatePlayerTotalKills,
  updatePlayerTeamKills,
  updatePlayerIsAlive,
  updatePlayerResources,
  updatePlayerDelta
} = playerSlice.actions;
