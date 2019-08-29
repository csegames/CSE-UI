/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

import { BasicItemStatsFragment } from './BasicItemStatsFragment';
import { AlloyStatsFragment } from './AlloyStatsFragment';
import { SubstanceStatsFragment } from './SubstanceStatsFragment';
import { WeaponStatsFragment } from './WeaponStatsFragment';
import { DurabilityStatsFragment } from './DurabilityStatsFragment';
import { BuildingBlockStatsFragment } from './BuildingBlockStatsFragment';
import { DamageTypeValuesFragment } from './DamageTypeValuesFragment';

export const ItemStatsFragment = gql`
  fragment ItemStats on ItemStatsDescription {
    item {
      ...BasicItemStats
    }
    alloy {
      ...AlloyStats
    }
    substance {
      ...SubstanceStats
    }
    weapon {
      ...WeaponStats
    }
    armor {
      armorClass
    }
    durability {
      ...DurabilityStats
    }
    block {
      ...BuildingBlockStats
    }
    resistances {
      ...DamageTypeValues
    }
  }
  ${BasicItemStatsFragment}
  ${AlloyStatsFragment}
  ${SubstanceStatsFragment}
  ${WeaponStatsFragment}
  ${DurabilityStatsFragment}
  ${BuildingBlockStatsFragment}
  ${DamageTypeValuesFragment}
`;
