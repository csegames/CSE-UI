/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConsumableItemsState } from '@csegames/library/dist/hordetest/game/GameClientModels/ConsumableItemsState';
import { CharacterClassDef, CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { ObjectiveDetailCategory, ObjectiveDetailMessageState } from '@csegames/library/dist/_baseGame/types/Objective';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { GameInterface } from '@csegames/library/dist/hordetest/game/GameInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusDef } from '../dataSources/manifest/statusManifest';
import { StatDef } from '../dataSources/manifest/statManifest';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { AbilityDisplayDef } from '../dataSources/manifest/abilityDisplayManifest';
import { KillStreakDef } from '../dataSources/manifest/killStreakManifest';

export interface IDLookupTable<T> {
  [id: number]: T;
}

export interface ObjectiveDetailsList {
  [messageID: string]: ObjectiveDetailMessageState;
}

interface CustomGameReduxState {
  statDefs: Dictionary<StatDef>;
  statusDefsByID: Dictionary<StatusDef>;
  statusDefsByNumericID: IDLookupTable<StatusDef>; //hold a list of StatusDefinitions keyed by ID instead of as a blind array.
  abilityDisplayDefsByID: IDLookupTable<AbilityDisplayDef>;
  abilityDisplayDefsByNumericID: IDLookupTable<AbilityDisplayDef>;
  characterClassDefs: IDLookupTable<CharacterClassDef>; //hold a list of character class definitions by id.
  objectiveDetailsPrimary: ObjectiveDetailsList;
  objectiveDetailsQuest: ObjectiveDetailsList;
  characterRaceDefs: IDLookupTable<CharacterRaceDef>;
  playerDirections: Dictionary<EntityDirection>; // character name -> direction
  entityDirections: Dictionary<EntityDirection>; // entityID -> direction
  killStreaks: KillStreakDef[];
  useClientResourceManifests: boolean;
  itemsByID: Dictionary<ItemDef>;
  gameDefsLoaded: boolean; // this not a LoadingTopic because gameDef data loads from a manifest. This manifest come from a coherent event, which currently goes off too late to be a loadingTopic
  consumableItemsState: ConsumableItemsState;
}

type GameReduxState = CustomGameReduxState & Partial<GameInterface>;

export function createDefaultItem(itemIndex: number): any {
  return {
    id: 0
  };
}

const DefaultGameState: GameReduxState = {
  //CustomGameReduxState Fields
  statDefs: {},
  statusDefsByID: {},
  statusDefsByNumericID: {},
  abilityDisplayDefsByID: {},
  abilityDisplayDefsByNumericID: {},
  characterClassDefs: {},
  objectiveDetailsPrimary: {},
  objectiveDetailsQuest: {},
  characterRaceDefs: {},
  //GameInterfaceFields
  consumableItemsState: {
    activeIndex: 0,
    items: {
      0: createDefaultItem(0),
      1: createDefaultItem(1),
      2: createDefaultItem(2),
      3: createDefaultItem(3),
      4: createDefaultItem(4)
    }
  },
  playerDirections: {},
  entityDirections: {},
  itemsByID: {},
  killStreaks: [],
  useClientResourceManifests: true,
  gameDefsLoaded: false
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: DefaultGameState,
  reducers: {
    updateAbilityDisplayDefs: {
      reducer: (
        state: GameReduxState,
        action: PayloadAction<{
          abilityDisplayDefsByID: Dictionary<AbilityDisplayDef>;
          abilityDisplayDefsByNumericID: IDLookupTable<AbilityDisplayDef>;
        }>
      ) => {
        state.abilityDisplayDefsByID = action.payload.abilityDisplayDefsByID;
        state.abilityDisplayDefsByNumericID = action.payload.abilityDisplayDefsByNumericID;
      },
      prepare: (
        abilityDisplayDefsByID: Dictionary<AbilityDisplayDef>,
        abilityDisplayDefsByNumericID: IDLookupTable<AbilityDisplayDef>
      ) => {
        return {
          payload: {
            abilityDisplayDefsByID,
            abilityDisplayDefsByNumericID
          }
        };
      }
    },
    updateClassDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<CharacterClassDef>>) => {
      state.characterClassDefs = action.payload;
    },
    updateRaceDefs: (state: GameReduxState, action: PayloadAction<IDLookupTable<CharacterRaceDef>>) => {
      state.characterRaceDefs = action.payload;
    },
    updateStatDefs: (state: GameReduxState, action: PayloadAction<Dictionary<StatDef>>) => {
      state.statDefs = action.payload;
    },
    updateStatusDefs: (
      state: GameReduxState,
      action: PayloadAction<{
        statusDefsByID: Dictionary<StatusDef>;
        statusDefsByNumericID: IDLookupTable<StatusDef>;
      }>
    ) => {
      state.statusDefsByID = action.payload.statusDefsByID;
      state.statusDefsByNumericID = action.payload.statusDefsByNumericID;
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
    updateConsumables: (state: GameReduxState, action: PayloadAction<ConsumableItemsState>) => {
      // ensure we have all 5 item slots represented
      const items = {
        ...state.consumableItemsState.items,
        ...action.payload.items
      };

      state.consumableItemsState = {
        ...state.consumableItemsState,
        ...items
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
    },
    setUseClientResourceManifests: (state: GameReduxState, action: PayloadAction<boolean>) => {
      state.useClientResourceManifests = action.payload;
    },
    updateItemDefs: (state: GameReduxState, action: PayloadAction<Dictionary<ItemDef>>) => {
      state.itemsByID = action.payload;
    },
    updateKillStreaks: (state: GameReduxState, action: PayloadAction<KillStreakDef[]>) => {
      state.killStreaks = action.payload;
    },
    setGameDefsLoaded: (state: GameReduxState) => {
      state.gameDefsLoaded = true;
    }
  }
});

export const {
  updateAbilityDisplayDefs,
  updateClassDefs,
  updateItemDefs,
  updateRaceDefs,
  updateStatDefs,
  updateStatusDefs,
  updateObjectiveDetails,
  removeObjectiveDetails,
  updateConsumables,
  updateCharacterRaceDefinitions,
  updatePlayerDirections,
  removePlayerDirections,
  updateEntityDirections,
  removeEntityDirections,
  setUseClientResourceManifests,
  updateKillStreaks,
  setGameDefsLoaded
} = gameSlice.actions;
