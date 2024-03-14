/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { hordetest } from '@csegames/library/dist/hordetest';
import { ConsumableItemsStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/ConsumableItemsState';
import { CharacterClassDef, CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { ConsumableItem } from '@csegames/library/dist/hordetest/game/types/Consumables';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { StatusDef } from '@csegames/library/dist/_baseGame/types/StatusDef';
import { ObjectiveDetailCategory, ObjectiveDetailMessageState } from '@csegames/library/dist/_baseGame/types/Objective';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { GameInterface } from '@csegames/library/dist/hordetest/game/GameInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AbilityDisplayDef } from '@csegames/library/dist/_baseGame/types/AbilityTypes';

export interface IDLookupTable<T> {
  [id: number]: T;
}

export interface ObjectiveDetailsList {
  [messageID: string]: ObjectiveDetailMessageState;
}

interface CustomGameReduxState {
  statusDefs: IDLookupTable<StatusDef>; //hold a list of StatusDefinitions keyed by ID instead of as a blind array.
  abilityDisplayDefs: IDLookupTable<AbilityDisplayDef>;
  characterClassDefs: IDLookupTable<CharacterClassDef>; //hold a list of character class definitions by id.
  objectiveDetailsPrimary: ObjectiveDetailsList;
  objectiveDetailsQuest: ObjectiveDetailsList;
  characterRaceDefs: IDLookupTable<CharacterRaceDef>;
  playerDirections: Dictionary<EntityDirection>; // character name -> direction
  entityDirections: Dictionary<EntityDirection>; // entityID -> direction
}

type GameReduxState = CustomGameReduxState & Partial<GameInterface>;

export function createDefaultItem(itemIndex: number): any {
  const currentItem: ConsumableItem = hordetest.game.consumableItemsState
    ? hordetest.game.consumableItemsState.items[itemIndex]
    : undefined;

  return {
    name: currentItem ? currentItem.name : '',
    iconClass: currentItem ? currentItem.iconClass : '',
    iconUrl: currentItem ? currentItem.iconUrl : ''
  };
}

const DefaultGameState: GameReduxState = {
  //CustomGameReduxState Fields
  statusDefs: {},
  abilityDisplayDefs: {},
  characterClassDefs: {},
  objectiveDetailsPrimary: {},
  objectiveDetailsQuest: {},
  characterRaceDefs: {},
  //GameInterfaceFields
  entities: {},
  consumableItemsState: {
    activeIndex: hordetest.game.consumableItemsState ? hordetest.game.consumableItemsState.activeIndex : 0,
    items: {
      0: createDefaultItem(0),
      1: createDefaultItem(1),
      2: createDefaultItem(2),
      3: createDefaultItem(3),
      4: createDefaultItem(4)
    },
    // should I use this key?
    isReady: false,
    // unused keys
    updateEventName: null,
    onUpdated: null,
    onReady: null
  },
  playerDirections: {},
  entityDirections: {}
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: DefaultGameState,
  reducers: {
    updateAbilityDisplayDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<AbilityDisplayDef>>) => {
      state.abilityDisplayDefs = action.payload;
    },
    updateClassDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<CharacterClassDef>>) => {
      state.characterClassDefs = action.payload;
    },
    updateRaceDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<CharacterRaceDef>>) => {
      state.characterRaceDefs = action.payload;
    },
    updateStatusDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<StatusDef>>) => {
      state.statusDefs = action.payload;
    },
    updateObjectiveDetails: (state: GameReduxState, action: PayloadAction<ObjectiveDetailsList>) => {
      for (const messageID in action.payload) {
        const obj = action.payload[messageID];
        if (obj.category === ObjectiveDetailCategory.Primary) {
          state.objectiveDetailsPrimary[messageID] = obj;
        } else {
          state.objectiveDetailsQuest[messageID] = obj;
        }
      }
    },
    removeObjectiveDetails: (state: GameReduxState, action: PayloadAction<string[]>) => {
      action.payload.forEach((messageID) => {
        delete state.objectiveDetailsPrimary[messageID];
        delete state.objectiveDetailsQuest[messageID];
      });
    },
    updateConsumables: (state: GameReduxState, action: PayloadAction<Partial<ConsumableItemsStateModel>>) => {
      // Doing this up front so it doesn't get stomped before we read out the old item list.
      const items = {
        ...state.consumableItemsState.items,
        ...action.payload.items
      };
      // Have to stomp on this because it is based off of a readonly interface.
      state.consumableItemsState = {
        ...state.consumableItemsState,
        ...action.payload,
        items
      };
    },
    updateCharacterRaceDefinitions: (state: GameReduxState, action: PayloadAction<IDLookupTable<CharacterRaceDef>>) => {
      state.characterRaceDefs = action.payload;
    },
    updatePlayerDirections: (state: GameReduxState, action: PayloadAction<IDLookupTable<EntityDirection>>) => {
      Object.entries(action.payload).forEach((entry: [string, EntityDirection]) => {
        state.playerDirections[entry[0]] = entry[1];
      });
    },
    removePlayerDirections: (state: GameReduxState, action: PayloadAction<string[]>) => {
      action.payload.forEach((directionID) => {
        delete state.playerDirections[directionID];
      });
    },
    updateEntityDirections: (state: GameReduxState, action: PayloadAction<IDLookupTable<EntityDirection>>) => {
      Object.entries(action.payload).forEach((entry: [string, EntityDirection]) => {
        state.entityDirections[entry[0]] = entry[1];
      });
    },
    removeEntityDirections: (state: GameReduxState, action: PayloadAction<string[]>) => {
      action.payload.forEach((directionID) => {
        delete state.entityDirections[directionID];
      });
    }
  }
});

export const {
  updateAbilityDisplayDefs,
  updateClassDefs,
  updateRaceDefs,
  updateStatusDefs,
  updateObjectiveDetails,
  removeObjectiveDetails,
  updateConsumables,
  updateCharacterRaceDefinitions,
  updatePlayerDirections,
  removePlayerDirections,
  updateEntityDirections,
  removeEntityDirections
} = gameSlice.actions;
