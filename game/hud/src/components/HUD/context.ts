/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { query } from '@csegames/camelot-unchained/lib/graphql/query';
import { useConfig } from '@csegames/camelot-unchained/lib/graphql/react';
import { Skill, CUQuery, ItemDefRef } from 'gql/interfaces';

export const HUDGraphQLQueryConfig = () => ({
  url: game.webAPIHost + '/graphql',
  requestOptions: {
    headers: {
      Authorization: `Bearer ${game.accessToken}`,
      shardID: `${game.shardID}`,
      characterID: game.selfPlayerState.characterID,
    },
  },
});

export const HUDGraphQLSubscriptionConfig = () => ({
  url: game.webAPIHost.replace('http', 'ws') + '/graphql',
  initPayload: {
    shardID: game.shardID,
    Authorization: `Bearer ${game.accessToken}`,
    characterID: game.selfPlayerState.characterID,
  },
});

// Initialize config used accross all gql requests
useConfig(HUDGraphQLQueryConfig, HUDGraphQLSubscriptionConfig);

export interface HUDGraphQLQueryResult<T> {
  ok: boolean;
  statusText: string;
  statusCode: number;
  data: T;
  refetch: () => void;
}

export interface HUDContextState {
  skills: HUDGraphQLQueryResult<Skill[]>;
  itemDefRefs: HUDGraphQLQueryResult<ItemDefRef[]>;
}

const defaultQueryResultInfo = {
  ok: false,
  statusText: '',
  refetch: () => {},
  statusCode: 0,
};

export const defaultContextState: HUDContextState = {
  skills: {
    ...defaultQueryResultInfo,
    data: [],
  },
  itemDefRefs: {
    ...defaultQueryResultInfo,
    data: [],
  },
};

export const HUDContext = React.createContext(defaultContextState);

export const skillsQuery = `
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
  }
`;

export async function fetchSkills(): Promise<HUDGraphQLQueryResult<Skill[]>> {
  const res = await query<Pick<CUQuery, 'myCharacter'>>({
    query: skillsQuery,
    operationName: null,
    namedQuery: null,
    variables: {},
  }, HUDGraphQLQueryConfig());
  const skills = res.data && res.data.myCharacter ? res.data.myCharacter.skills : [];
  return {
    ...res,
    data: skills,
    refetch: fetchSkills,
  };
}

export const itemDefRefsQuery = `
  {
    game {
      items {
        id
        description
        name
        iconUrl
        itemType
        defaultResourceID
        numericItemDefID
        isStackableItem
        deploySettings {
          resourceID
          isDoor
          snapToGround
          rotateYaw
          rotatePitch
          rotateRoll
        }
        gearSlotSets {
          gearSlots {
            id
            subpartIDs
          }
        }
        isVox
      }
    }
  }
`;

export async function fetchItemDefRefs() {
  const res = await query<Pick<CUQuery, 'game'>>({
    query: itemDefRefsQuery,
    operationName: null,
    namedQuery: null,
    variables: {},
  }, HUDGraphQLQueryConfig());

  return {
    ...res,
    data: res.data && res.data.game ? res.data.game.items : [],
    refetch: fetchItemDefRefs,
  };
}
