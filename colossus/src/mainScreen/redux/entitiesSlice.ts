/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  BaseEntityStateModel,
  PlayerEntityStateModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FriendsList {
  [entityName: string]: PlayerEntityStateModel;
}

export interface EntityList {
  [entityID: string]: PlayerEntityStateModel;
}

export interface ObjectivesList {
  [entityID: string]: BaseEntityStateModel;
}

interface FriendUpdate {
  name: string;
  delta: Partial<PlayerEntityStateModel>;
}

interface BossUpdate {
  entityID: string;
  delta: Partial<PlayerEntityStateModel>;
}

interface ObjectiveUpdate {
  entityID: string;
  delta: Partial<BaseEntityStateModel>;
}

interface EntitiesState {
  friends: FriendsList;
  friendsPage: number;
  friendsPerPage: number;
  bosses: EntityList;
  objectives: ObjectivesList;
}

const DefaultEntitiesState: EntitiesState = {
  friends: {},
  friendsPage: 1,
  friendsPerPage: 12, //this should effectively be a const.
  bosses: {},
  objectives: {}
};

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: DefaultEntitiesState,
  reducers: {
    addFriend: (state: EntitiesState, action: PayloadAction<PlayerEntityStateModel>) => {
      state.friends[action.payload.name] = action.payload;
    },
    updateFriend: (state: EntitiesState, action: PayloadAction<FriendUpdate>) => {
      state.friends[action.payload.name] = {
        ...state.friends[action.payload.name],
        ...action.payload.delta
      };
    },
    removeFriend: (state: EntitiesState, action: PayloadAction<string>) => {
      delete state.friends[action.payload];
    },
    clearFriends: (state: EntitiesState) => {
      state.friends = {};
    },
    updateFriendsPage: (state: EntitiesState, action: PayloadAction<number>) => {
      state.friendsPage = action.payload;
    },
    addBoss: (state: EntitiesState, action: PayloadAction<PlayerEntityStateModel>) => {
      state.bosses[action.payload.entityID] = action.payload;
    },
    updateBoss: (state: EntitiesState, action: PayloadAction<BossUpdate>) => {
      state.bosses[action.payload.entityID] = {
        ...state.bosses[action.payload.entityID],
        ...action.payload.delta
      };
    },
    removeBoss: (state: EntitiesState, action: PayloadAction<string>) => {
      delete state.bosses[action.payload];
    },
    clearBosses: (state: EntitiesState) => {
      state.bosses = {};
    },
    addObjective: (state: EntitiesState, action: PayloadAction<BaseEntityStateModel>) => {
      state.objectives[action.payload.entityID] = action.payload;
    },
    updateObjective: (state: EntitiesState, action: PayloadAction<ObjectiveUpdate>) => {
      state.objectives[action.payload.entityID] = {
        ...state.objectives[action.payload.entityID],
        ...action.payload.delta
      };
    },
    removeObjective: (state: EntitiesState, action: PayloadAction<string>) => {
      delete state.objectives[action.payload];
    }
  }
});

export const {
  addFriend,
  updateFriend,
  removeFriend,
  clearFriends,
  updateFriendsPage,
  addBoss,
  updateBoss,
  removeBoss,
  clearBosses,
  addObjective,
  updateObjective,
  removeObjective
} = entitiesSlice.actions;
