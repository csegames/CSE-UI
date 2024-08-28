/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { CUQuery } from '@csegames/library/dist/hordetest/graphql/schema';

export type ChampionInfoQueryResult = Pick<CUQuery, 'champions' | 'championCostumes' | 'serverTimestamp' | 'game'>;

export const championInfoQuery = gql`
  query ChampionInfoContextQuery {
    championCostumes {
      description
      id
      name
      requiredChampionID
      standingImageURL
      championSelectImageURL
      championSelectedFlareImageURL
      thumbnailURL
      cardImageURL
      backgroundImageURL
    }

    champions {
      id
      name
      description
      championSelectSound
      uIColor
      questID
      runeModUnlockCurrencyID
      progressionCurrencyID
      abilities {
        name
        iconClass
        description
      }
    }

    game {
      progressionNodes {
        championID
        childrenIDs
        costs {
          perkID
          qty
        }
        icon
        id
        locks {
          endTime
          perkID
          questID
          questLevel
          startTime
          progressionNodeID
          invertConditions
        }
        name
        parentIDs
        positionX
        positionY
        rewards {
          perkID
          qty
        }
      }
    }

    serverTimestamp
  }
`;
