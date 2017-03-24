/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 16:08:45
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 16:11:52
 */

import gql from 'graphql-tag';

import SubstanceStatsFragment, { SubstanceStats } from './SubstanceStats';
import AlloyStatsFragment, { AlloyStats } from './AlloyStats';
import DurabilityStatsFragment, { DurabilityStats } from './DurabilityStats';
import ArmorStatsFragment, { ArmorStats } from './ArmorStats';

export default gql`
fragment ArmorItemStats on ArmorItemStats {
  quality
  mass
  massPCF
  encumbrance
  hardness
  malleability
  meltingPoint
  density
  agilityRequirement
  dexterityRequirement
  strengthRequirement
  unitCount
  substance {
    ...SubstanceStats
  }
  alloy {
    ...AlloyStats
  }
  durability {
    ...DurabilityStats
  }
  armor {
    ...ArmorStats
  }
}
${SubstanceStatsFragment}
${AlloyStatsFragment}
${DurabilityStatsFragment}
${ArmorStatsFragment}
`;

export interface ArmorItemStats {
  quality: number;
  mass: number;
  massPCF: number;
  encumbrance: number;
  hardness: number;
  malleability: number;
  meltingPoint: number;
  density: number;
  agilityRequirement: number;
  dexterityRequirement: number;
  strengthRequirement: number;
  unitCount: number;
  substance: SubstanceStats;
  alloy: AlloyStats;
  durability: DurabilityStats;
  armor: ArmorStats;
}
