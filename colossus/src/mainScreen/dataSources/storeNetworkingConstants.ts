/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { CUQuery } from '@csegames/library/dist/hordetest/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

// Specify the subset of keys from CUQuery that we are interested in.
export type StoreStaticDataQueryResult = Pick2<
  CUQuery,
  'game',
  'purchases' | 'rMTPurchases' | 'perks' | 'runeModLevels' | 'runeModDisplay'
>;

export const storeStaticDataQuery = gql`
  query StoreStaticDataQuery {
    game {
      runeModDisplay {
        icon
        runeCount
      }
      runeModLevels
      purchases {
        id
        name
        description
        iconURL
        sortOrder
        costs {
          perkID
          qty
        }
        locks {
          endTime
          perkID
          startTime
        }
        perks {
          perkID
          qty
        }
      }
      rMTPurchases {
        id
        name
        description
        iconURL
        centCost
        locks {
          endTime
          perkID
          startTime
        }
        perks {
          perkID
          qty
        }
      }
      perks {
        champion {
          id
          name
        }
        costume {
          description
          id
          name
        }
        description
        iconURL
        iconClass
        iconClassColor
        backgroundURL
        id
        isUnique
        name
        perkType
        portraitChampionSelectImageUrl
        portraitThumbnailURL
        showIfUnowned
        rarity
        videoURL
        questType
        runeModLevel
        xPAmount
        weapon {
          id
        }
      }
    }
  }
`;
