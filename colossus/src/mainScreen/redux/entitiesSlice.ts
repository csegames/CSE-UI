/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EntityContext } from '@csegames/library/dist/_baseGame/types/EntityContext';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import {
  BaseEntityState,
  PlayerEntityState
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FriendsList {
  [entityName: string]: PlayerEntityState; // TODO: track by accountID
}

export interface EntityList {
  [entityID: string]: PlayerEntityState;
}

export interface ObjectivesList {
  [entityID: string]: BaseEntityState;
}

const defaultPlayerState: PlayerEntityState = {
  characterKind: CharacterKind.User,
  accountID: '',
  classID: 0,
  resources: {},
  gender: 0,
  race: 0,
  currentDeaths: NaN,
  deathStartTime: 0,
  downedStateEndTime: NaN,
  killersName: null,
  killersRace: 0,
  lifeState: LifeState.Alive,
  maxDeaths: NaN,
  portraitURL: '',
  iconClass: '',
  scenarioID: null,
  scenarioRoundState: ScenarioRoundState.Uninitialized,
  isShielded: false,
  scenarioRoundStateEndTime: NaN,
  scenarioRoundStateStartTime: NaN,
  survivedTime: NaN,
  teamKills: 0,
  totalKills: 0,
  rank: 0,
  entityID: '',
  type: '',
  faction: 0,
  name: '',
  isAlive: true,
  statuses: {},
  objective: null
};

interface EntitiesState {
  friends: FriendsList;
  friendsPage: number;
  friendsPerPage: number;
  self: PlayerEntityState;
  selfID: EntityID;
  bosses: EntityList;
  objectives: ObjectivesList;
}

const DefaultEntitiesState: EntitiesState = {
  friends: {},
  friendsPage: 1,
  friendsPerPage: 12, //this should effectively be a const.
  self: defaultPlayerState,
  selfID: null,
  bosses: {},
  objectives: {}
};

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: DefaultEntitiesState,
  reducers: {
    addOrUpdateBoss: (state: EntitiesState, action: PayloadAction<PlayerEntityState>) => {
      state.bosses[action.payload.entityID] = action.payload;
    },
    addOrUpdateFriend: (state: EntitiesState, action: PayloadAction<PlayerEntityState>) => {
      state.friends[action.payload.name] = action.payload;
      if (action.payload.entityID == state.selfID) {
        state.self = action.payload;
      }
    },
    addOrUpdateObjective: (state: EntitiesState, action: PayloadAction<BaseEntityState>) => {
      state.objectives[action.payload.entityID] = action.payload;
    },
    clearBosses: (state: EntitiesState) => {
      state.bosses = {};
    },
    clearFriends: (state: EntitiesState) => {
      state.friends = {};
    },
    removeEntity: (state: EntitiesState, action: PayloadAction<string>) => {
      for (const [key, value] of Object.entries(state.friends)) {
        if (value?.entityID == action.payload) {
          delete state.friends[key];
          break;
        }
      }
      if (state.selfID == action.payload) {
        state.selfID = '';
        state.self = defaultPlayerState;
      }
      delete state.bosses[action.payload];
      delete state.objectives[action.payload];
    },
    setEntityContext: (state: EntitiesState, action: PayloadAction<{ context: EntityContext; entityID: EntityID }>) => {
      if (action.payload.context == 'player') {
        state.selfID = action.payload.entityID;
        for (const [, value] of Object.entries(state.friends)) {
          if (value?.entityID == action.payload.entityID) {
            state.self = value;
            break;
          }
        }
      }
    },
    updateFriendsPage: (state: EntitiesState, action: PayloadAction<number>) => {
      state.friendsPage = action.payload;
    }
  }
});

export const {
  addOrUpdateBoss,
  addOrUpdateFriend,
  addOrUpdateObjective,
  clearFriends,
  clearBosses,
  removeEntity,
  setEntityContext,
  updateFriendsPage
} = entitiesSlice.actions;
