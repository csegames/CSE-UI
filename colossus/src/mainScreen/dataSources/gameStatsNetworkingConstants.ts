/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type StatsQueryResult = Pick<CUQuery, 'overmindsummary'>;
export type StatsSubscriptionResult = Pick<CUSubscription, 'scenarioAlerts'>;

export const statsQuery = gql`
  query GameStatsQuery($scenarioID: String!, $shardID: Int!) {
    overmindsummary(id: $scenarioID, shard: $shardID) {
      id
      shardID
      scenarioID
      resolution
      startTime
      totalRunTime
      winningTeamIDs
      scenarioScore
      scorePanels {
        instance {
          score
          rank
        }
        def {
          displayName
          backgroundImage
          rankImageWon
          rankImageLost
          ranks {
            description
          }
        }
      }
      characterSummaries {
        accountID
        classID
        teamID
        damageApplied
        damageTaken
        deathCount
        kills
        level
        longestKillStreak
        longestLife
        questProgress {
          id
          progressAdded
          previousIndex
          previousProgress
          progressDetails {
            name
            amount
          }
        }
        raceID
        userName
        thumbsUpReward
        score
        reviveAssistCount
        portraitPerkID
      }
      mVPs {
        accountID
        mVPName
        mVPDescription
      }
    }
  }
`;

export const statsSubscription = gql`
  subscription GameStatsSubscription($scenarioID: String!) {
    scenarioAlerts(scenarioID: $scenarioID) {
      targetID
      category
      when

      ... on OvermindSummaryAlert {
        summary {
          characterSummaries {
            accountID
            thumbsUpReward
          }
        }
      }
    }
  }
`;
