/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Game Data Store holds mostly static game data that is initially fetched from the API server on UI load.
 */
import { useState } from 'react';
import { query } from '../../../_baseGame/graphql/query';
import { CUQuery, Ability, StatusDef } from '../../../_baseGame/graphql/schema';

const queryString = `
{
  myCharacter {
    abilities {
      id
      name
      icon
      description
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
      statusTags
      stacking {
        group
        refreshTimedDurations
        removalOrder
      }
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

    items {
      id
      description
      name
      iconUrl
      itemType
      numericItemDefID
      isStackableItem
      deploySettings {
        isDoor
        snapToGround
        rotateYaw
        rotatePitch
        rotateRoll
      }
      gearSlotSets {
        gearSlots {
          id
        }
      }
      substanceDefinition {
        id
        minQuality
        maxQuality
      }
      isVox
    }
  }
}
`;

type QueryResult = Pick<CUQuery, 'status' | 'game' | 'myCharacter'>;

declare global {
  interface GameDataStore extends QueryResult {
    init(): void;
    refetch(): Promise<GameDataStore>;
    getStatusInfo(id: number): any;
    getAbilityInfo(id: number): Ability | null;
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
          characterID: camelotunchained.game.selfPlayerState.characterID,
          Authorization: 'Bearer ' + game.accessToken,
          shardID: String(game.shardID),
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

function getStatusInfo(this: InternalGameDataStore, id: number): StatusDef {
  if (!this.status || !this.status.statuses) return null;
  const info = this.status.statuses.find(value => value.numericID === id);
  return info || null;
}

function getAbilityInfo(this: InternalGameDataStore, id: number) {
  if (!this.myCharacter || !this.myCharacter.abilities) return null;
  const info = this.myCharacter.abilities.find(skill => skill.id === id);
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
    getAbilityInfo,
    onUpdated,
  };

  return store as GameDataStore;
}
