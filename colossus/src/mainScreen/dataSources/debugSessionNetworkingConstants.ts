/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type DebugSessionQueryResult = Pick<CUQuery, 'debugSession'>;
export type DebugSessionSubscriptionResult = Pick<CUSubscription, 'debugSessionUpdates'>;

export const debugSessionSubscription = gql`
  subscription DebugSessionSubscription {
    debugSessionUpdates {
      type
      ... on SessionRemoved {
        roundID
      }
      ... on SessionUpdated {
        session {
          roundID
          createdBy {
            displayName
            id
          }
          created
          configured
          allocated
          started
          ended
          completed
          revision
          gameServerAddress
          scenarioID
          overrideSheetID
          overrideTabID
          zoneID
          error {
            system
            type
            fields {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const debugSessionQuery = gql`
  query DebugSessionQuery {
    debugSession {
      currentSessions {
        roundID
        createdBy {
          displayName
          id
        }
        created
        configured
        allocated
        started
        ended
        completed
        revision
        gameServerAddress
        scenarioID
        overrideSheetID
        overrideTabID
        zoneID
        error {
          system
          type
          fields {
            name
            value
          }
        }
      }
    }
  }
`;
