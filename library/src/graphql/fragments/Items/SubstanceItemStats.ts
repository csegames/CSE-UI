/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 16:01:02
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 16:03:35
 */

import gql from 'graphql-tag';
import SubstanceStatsFragment, { SubstanceStats } from './SubstanceStats';

export default gql`
fragment SubstanceItemStats on SubstanceItemStats {
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
}
${SubstanceStatsFragment}
`;

export interface SubstanceItemStats {
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
}
