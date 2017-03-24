/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 16:05:58
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 16:08:21
 */

import gql from 'graphql-tag';

import SubstanceStatsFragment, { SubstanceStats } from './SubstanceStats';
import AlloyStatsFragment, { AlloyStats } from './AlloyStats';
import DurabilityStatsFragment, { DurabilityStats } from './DurabilityStats';
import WeaponStatsFragment, { WeaponStats } from './WeaponStats';

export default gql`
fragment WeaponItemStats on WeaponItemStats {
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
  weapon {
    ...WeaponStats
  }
}
`;

export interface WeaponItemStats {
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
  
}
