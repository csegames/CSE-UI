/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type ZoneInstanceQueryResult = Pick<CUQuery, 'zoneInstance'>;
export type ZoneInstanceSubscriptionResult = Pick<CUSubscription, 'zoneInstanceUpdates'>;

export const zoneInstanceSubscription = gql`
  subscription ZoneInstanceSubscription {
    zoneInstanceUpdates {
      type
      ... on ZoneInstanceRemoved {
        roundID
      }
      ... on ZoneInstanceUpdated {
        zoneInstance {
          roundID
          completed
          ended
          created
          error {
            system
            type
            fields {
              name
              value
            }
          }
          revision
          gameServerAddress
          restrictToFaction
          zoneInstanceID
          zoneName
        }
      }
      ... on QueueEntryRemoved {
        queueID
        entryID
        error {
          system
          type
          fields {
            name
            value
          }
        }
      }
      ... on QueueEntryUpdated {
        entry {
          entryID
          queueID
        }
      }
    }
  }
`;

export const zoneInstanceQuery = gql`
  query ZoneInstanceStatusQuery {
    zoneInstance {
      currentRounds {
        roundID
        completed
        ended
        created
        error {
          system
          type
          fields {
            name
            value
          }
        }
        revision
        gameServerAddress
        restrictToFaction
        zoneInstanceID
        zoneName
      }
      currentQueues {
        entryID
        queueID
      }
      zoneInstanceAccess
    }
  }
`;
