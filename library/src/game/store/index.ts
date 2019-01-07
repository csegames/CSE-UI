/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Game Data Store holds mostly static game data that is initially fetched from the API server on UI load.
 */
import { useState } from 'react';
import { query } from '../../graphql/query';
import { CUQuery, StatusDef_Deprecated, Skill } from '../../graphql/schema';

const queryString = `
{
  myCharacter {
    skills {
      id
      name
      icon
      notes
      tracks
    }
  }

  status {
	  statuses {
	    id
	    numericID
	    iconURL
	    description
	    name
	  }
	}

  game {
    stats {
      id
      name
      description
      statType
      showAtCharacterCreation
      addPointsAtCharacterCreation
      operation
    }

    baseStatValues {
      stat
      amount
    }

    raceStatMods {
      race
      statBonuses {
        stat
        amount
      }
    }
  }
}
`;

type QueryResult = Pick<CUQuery, 'status' | 'game' | 'myCharacter'>;

declare global {
  interface GameDataStore extends QueryResult {
    init(): void;
    refetch(): Promise<GameDataStore>;
    getStatusInfo(id: number): StatusDef_Deprecated | null;
    getSkillInfo(id: number): Skill | null;
    onUpdated(callback: Callback): EventHandle;
  }

  interface GameInterface {
    store: GameDataStore;
  }
}

interface InternalGameDataStore extends GameDataStore {
  _initialized: boolean;
  _updatedEvent: 'gameDataStore.update';
}

async function fetchData(this: InternalGameDataStore) {

  try {
    const result = await query<QueryResult>({
      query: queryString,
    }, {
      url: game.webAPIHost + '/graphql',
      requestOptions: {
        headers: {
          characterID: game.selfPlayerState.characterID,
          Authorization: 'Bearer ' + game.accessToken,
        },
      },
    });

    if (result.ok) {
      merge(this, result.data);
      game.trigger(this._updatedEvent, this);
    }

  } catch (error) {
    console.warn(error);
  }

  return this;
}

function initialize(this: InternalGameDataStore) {
  if (this._initialized) return;
  this._initialized = true;
  this.refetch();
}

function getStatusInfo(this: InternalGameDataStore, id: number) {
  if (!this.status || !this.status.statuses) return null;
  const info = this.status.statuses.find(value => value.numericID === id);
  return info || null;
}

function getSkillInfo(this: InternalGameDataStore, id: number) {
  if (!this.myCharacter || !this.myCharacter.skills) return null;
  const info = this.myCharacter.skills.find(skill => skill.id === id);
  return info || null;
}

function onUpdated(this: InternalGameDataStore, callback: Callback): EventHandle {
  return game.on(this._updatedEvent, callback);
}

/**
 * Creates a new GameDataStore
 */
export default function(): GameDataStore {
  const store: InternalGameDataStore = {
    _initialized: false,
    _updatedEvent: 'gameDataStore.update',
    init: initialize,
    refetch: fetchData,
    myCharacter: null,
    status: null,
    game: null,
    getStatusInfo,
    getSkillInfo,
    onUpdated,
  };

  return store as GameDataStore;
}
