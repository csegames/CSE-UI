/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AnyEntityStateModel,
  BaseEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityID } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { EntityContext } from '@csegames/library/dist/_baseGame/types/EntityContext';

export interface ContextUpdate {
  context: EntityContext;
  entityID: EntityID;
}

export const DefaultBaseEntityState: BaseEntityStateModel = {
  faction: Faction.Arthurian,
  entityID: '',
  name: '',
  isAlive: true,
  position: {
    x: NaN,
    y: NaN,
    z: NaN
  },
  statuses: {},
  resources: {},
  type: '',
  objective: null
};

interface EntitiesState {
  entities: Dictionary<AnyEntityStateModel>;
  enemyTarget: AnyEntityStateModel;
  enemyTargetID: EntityID;
  friendlyTarget: AnyEntityStateModel;
  friendlyTargetID: EntityID;
}

const DefaultEntitiesState: EntitiesState = {
  entities: {},
  enemyTarget: null,
  enemyTargetID: null,
  friendlyTarget: null,
  friendlyTargetID: null
};

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: DefaultEntitiesState,
  reducers: {
    addOrUpdateEntity: (state: EntitiesState, action: PayloadAction<AnyEntityStateModel>) => {
      state.entities[action.payload.entityID] = action.payload;
      if (state.enemyTargetID === action.payload.entityID) {
        state.enemyTarget = action.payload;
      }
      if (state.friendlyTargetID === action.payload.entityID) {
        state.friendlyTarget = action.payload;
      }
    },
    removeEntity: (state: EntitiesState, action: PayloadAction<string>) => {
      if (state.entities[action.payload]) {
        delete state.entities[action.payload];
      }
      if (state.enemyTargetID === action.payload) {
        state.enemyTarget = null;
        state.enemyTargetID = null;
      }
      if (state.friendlyTargetID === action.payload) {
        state.friendlyTarget = null;
        state.friendlyTargetID = null;
      }
    },
    setEntityContext: (state: EntitiesState, action: PayloadAction<ContextUpdate>) => {
      const entityID = action.payload.entityID;
      switch (action.payload.context) {
        case 'player':
          // this is redundant with SelfPlayerState
          break;
        case 'target.enemy':
          state.enemyTargetID = entityID;
          state.enemyTarget = entityID ? state.entities[entityID] : null;
          break;
        case 'target.friendly':
          state.friendlyTargetID = entityID;
          state.friendlyTarget = entityID ? state.entities[entityID] : null;
          break;
      }
    }
  }
});

export const { addOrUpdateEntity, removeEntity, setEntityContext } = entitiesSlice.actions;
