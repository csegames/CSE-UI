/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 12:50:22
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:41:00
 */

import gql from 'graphql-tag';

import ItemStatsFragment, { ItemStats } from './ItemStats';
import SubstanceStatsFragment, { SubstanceStats } from './SubstanceStats';
import AlloyStatsFragment, { AlloyStats } from './AlloyStats';
import DurabilityStatsFragment, { DurabilityStats } from './DurabilityStats';
import WeaponStatsFragment, { WeaponStats } from './WeaponStats';
import ArmorStatsFragment, { ArmorStats } from './ArmorStats';

export default gql`
fragment FullItem on Item {
  id
  name
  itemType
  stats {
    ... on ItemStatsInterface {
      ... on BasicItemStats {
        ...ItemStats
      }
      ... on SubstanceItemStats {
        ...ItemStats
        substance {
          ...SubstanceStats
        }
      }
      ... on AlloyItemStats {
        ...ItemStats
        substance {
          ...SubstanceStats
        }
        alloy {
          ...SubstanceStats
        }
      }
      ... on WeaponItemStats {
        ...ItemStats
        substance {
          ...SubstanceStats
        }
        alloy {
          ...AlloyStats
        }
        durability {
          ...DurabilityStats
        }
        weapon {
          ...WeaponStats
        }
      }
      ... on ArmorItemStats {
        ...ItemStats
        armor {
          ...ArmorStats
        }
      }
    }
  }
}
${ItemStatsFragment}
${SubstanceStatsFragment}
${AlloyStatsFragment}
${ArmorStatsFragment}
${WeaponStatsFragment}
${DurabilityStatsFragment}
`;

export interface FullItem {
  id: string;
  name: string;
  stats: ItemStats;
  itemType: string;
}
