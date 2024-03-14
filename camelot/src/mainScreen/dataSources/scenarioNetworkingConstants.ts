/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type ScenarioQueryResult = Pick<CUQuery, 'myScenarioQueue'>;

export const scenarioQueueQuery = gql`
  query ScenarioQueueQuery {
    myScenarioQueue {
      availableMatches {
        id
        name
        icon
        isQueued
        isInScenario
        inScenarioID
        gamesInProgress
        charactersNeededToStartNextGameByFaction {
          tdd
          viking
          arthurian
        }
        totalBackfillsNeededByFaction {
          tdd
          viking
          arthurian
        }
      }
    }
  }
`;
