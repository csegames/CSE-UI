/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type ShardCharactersQueryResult = Pick<CUQuery, 'shardCharacters' | 'characterRestrictions'>;
export type CharactersSubscriptionResult = Pick<CUSubscription, 'characterUpdates'>;
export type CharacterRestrictionsSubscriptionResult = Pick<CUSubscription, 'characterRestrictions'>;

export const shardCharactersQuery = gql`
  query ShardCharactersQuery {
    characterRestrictions {
      maxSlots
      allowCrossFaction
    }
    shardCharacters {
      bodyTypeID
      classID
      factionID
      id
      lastLogin
      name
      raceID
    }
  }
`;

export const charactersSubscription = gql`
  subscription CharactersSubscription {
    characterUpdates {
      type
      ... on CharacterUpdate {
        character {
          bodyTypeID
          classID
          factionID
          id
          lastLogin
          name
          raceID
        }
      }
      ... on CharacterRemovedUpdate {
        characterID
      }
    }
  }
`;

export const characterRestrictionsSubscription = gql`
  subscription CharacterRestrictionsSubscription {
    characterRestrictions {
      maxSlots
      allowCrossFaction
    }
  } 
`;
