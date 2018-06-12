/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { BasicItemStatsFragment } from './BasicItemStatsFragment';
import { AlloyStatsFragment } from './AlloyStatsFragment';
import { SubstanceStatsFragment } from './SubstanceStatsFragment';
import { WeaponStatsFragment } from './WeaponStatsFragment';
import { ArmorPartsFragment } from './ArmorPartsFragment';
import { ArmorBySubpartFragment } from './ArmorBySubpartFragment';
import { DurabilityStatsFragment } from './DurabilityStatsFragment';
import { BuildingBlockStatsFragment } from './BuildingBlockStatsFragment';

export const ItemStatsFragment = `
  item {
    ${BasicItemStatsFragment}
  }
  alloy {
    ${AlloyStatsFragment}
  }
  substance {
    ${SubstanceStatsFragment}
  }
  weapon {
    ${WeaponStatsFragment}
  }
  armor {
    ${ArmorPartsFragment}
  }
  armorBySubpart {
    ${ArmorBySubpartFragment}
  }
  durability {
    ${DurabilityStatsFragment}
  }
  block {
    ${BuildingBlockStatsFragment}
  }
`;
