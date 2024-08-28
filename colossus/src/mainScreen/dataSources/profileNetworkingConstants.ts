/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery } from '@csegames/library/dist/hordetest/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type ProfileQueryResult = Pick<CUQuery, 'colossusProfile'>;

export const profileQuery = gql`
  query ProfileContextQuery {
    colossusProfile {
      champions {
        costumePerkID
        emotePerkIDs
        portraitPerkID
        runeModPerkIDs
        sprintFXPerkID
        weaponPerkID
        championID
        stats {
          damageApplied
          damageTaken
          deathCount
          kills
          longestKillStreak
          longestLife
          matchesPlayed
          thumbsUp
          totalPlayTime
          mostDamageAppliedInMatch
        }
      }

      dailyQuestResets
      defaultChampionID
      progressionNodes

      lifetimeStats {
        damageApplied
        damageTaken
        deathCount
        kills
        longestKillStreak
        longestLife
        matchesPlayed
        maxScore
        maxScenarioScore
        thumbsUp
        totalPlayTime
        mostDamageAppliedInMatch
        mostDamageTakenInMatch
        mostKillsInMatch
        scenarioID
        totalScore
        totalScenarioScore
        wins
      }

      perks {
        id
        qty
      }

      quests {
        currentQuestIndex
        currentQuestProgress
        granted
        id
        nextCollection
        nextCollectionPremium
        questStatus
        totalProgress
      }

      timeOffsetSeconds
    }
  }
`;
