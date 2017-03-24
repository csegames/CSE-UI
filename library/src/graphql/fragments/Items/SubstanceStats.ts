/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 14:59:16
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:03:08
 */

import gql from 'graphql-tag';

export default gql`
fragment SubstanceStats on SubstanceStats {
  hardness
  impactToughness
  fractureChance
  malleability
  massPCF
  density
  meltingPoint
  thermConductivity
  slashingResistance
  piercingResistance
  crushingResistance
  acidResistance
  poisonResistance
  diseaseResistance
  earthResistance
  waterResistance
  fireResistance
  airResistance
  lightningResistance
  frostResistance
  lifeResistance
  mindResistance
  spiritResistance
  radiantResistance
  deathResistance
  shadowResistance
  chaosResistance
  voidResistance
  arcaneResistance
  magicalResistance
  hardnessFactor
  strengthFactor
  fractureFactor
  massFactor
}
`;

export interface SubstanceStats {
  hardness: number;
  impactToughness: number;
  fractureChance: number;
  malleability: number;
  massPCF: number;
  density: number;
  meltingPoint: number;
  thermConductivity: number;
  slashingResistance: number;
  piercingResistance: number;
  crushingResistance: number;
  acidResistance: number;
  poisonResistance: number;
  diseaseResistance: number;
  earthResistance: number;
  waterResistance: number;
  fireResistance: number;
  airResistance: number;
  lightningResistance: number;
  frostResistance: number;
  lifeResistance: number;
  mindResistance: number;
  spiritResistance: number;
  radiantResistance: number;
  deathResistance: number;
  shadowResistance: number;
  chaosResistance: number;
  voidResistance: number;
  arcaneResistance: number;
  magicalResistance: number;
  hardnessFactor: number;
  strengthFactor: number;
  fractureFactor: number;
  massFactor: number;
}
