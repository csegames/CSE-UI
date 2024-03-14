/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { CUQuery } from '@csegames/library/dist/hordetest/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

// Specify the subset of keys from CUQuery that we are interested in.
export type QuestStaticDataQueryResult = Pick2<CUQuery, 'game', 'quests'>;

export const questStaticDataQuery = gql`
  query QuestStaticDataQuery {
    game {
      quests {
        description
        id
        displaySubQuests
        previewDate
        comingSoonImage
        currentBackgroundImage
        endedSplashImage
        expiredImage
        startedSplashImage
        links {
          premiumRewards {
            perkID
            qty
          }
          progress
          rewardImageOverride
          rewardNameOverride
          rewardDescriptionOverride
          premiumRewardImageOverride
          premiumRewardNameOverride
          premiumRewardDescriptionOverride
          rewards {
            perkID
            qty
          }
        }
        name
        premiumLock {
          endTime
          perkID
          startTime
        }
        questLock {
          endTime
          perkID
          startTime
        }
        questType
        subQuestIDs
        shortName
      }
    }
  }
`;
