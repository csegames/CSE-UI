/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

export type StatsSubscriptionResult = Pick<CUSubscription, 'overmindSummaries'>;

export const statsSubscription = gql`
  subscription GameStatsSubscription {
    overmindSummaries {
      id
      scenarioID
      matchID
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
