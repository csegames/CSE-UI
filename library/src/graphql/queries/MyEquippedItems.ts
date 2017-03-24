/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-08 10:09:12
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-08 10:22:18
 */

import gql from 'graphql-tag';
import ArmorStatsFragment, { ArmorStats } from '../fragments/items/ArmorStats';

export default gql`
query MyEquippedItems {
  myEquippedItems {
    id
    name
    itemType
    stats {
      ... on ArmorItemStats {
        armor {
          ...ArmorStats
        }
      }
      ... on WeaponItemStats {
        weapon {
          piercingDamage
          slashingDamage
          crushingDamage
        }
      }
    }
  }
}
${ArmorStatsFragment}`;

export interface MyEquippedItemsQuery {
  myEquippedItems: {
    id: string,
    name: string,
    itemType: string,
    stats: {
      armor: ArmorStats,
      weapon: {
        piercingDamage: number,
        slashingDamage: number,
        crushingDamage: number,
      },
    },
  }[];
}
