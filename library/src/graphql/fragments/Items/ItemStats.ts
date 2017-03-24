/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 14:56:32
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 14:59:02
 */

import gql from 'graphql-tag';

export default gql`
fragment ItemStats on ItemStatsInterface {
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
}
`;

export interface ItemStats {
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
