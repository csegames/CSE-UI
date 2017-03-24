/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 15:09:14
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 12:12:41
 */

import gql from 'graphql-tag';

export default gql`
fragment WeaponStats on WeaponStats {
  piercingDamage
  piercingBleed
  piercingArmorPenetration
  slashingDamage
  slashingBleed
  slashingArmorPenetration
  crushingDamage
  fallbackCrushingDamage
  disruption
  deflectionAmount
  physicalProjectileSpeed
  knockbackAmount
  stability
  falloffMinDistance
  falloffMaxDistance
  falloffReduction
  deflectionRecovery
  staminaCost
  physicalPreparationTime
  physicalRecoveryTime
  range
}
`;

export interface WeaponStats {
  piercingDamage: number;
  piercingBleed: number;
  piercingArmorPenetration: number;
  slashingDamage: number;
  slashingBleed: number;
  slashingArmorPenetration: number;
  crushingDamage: number;
  fallbackCrushingDamage: number;
  disruption: number;
  deflectionAmount: number;
  physicalProjectileSpeed: number;
  knockbackAmount: number;
  stability: number;
  falloffMinDistance: number;
  falloffMaxDistance: number;
  falloffReduction: number;
  deflectionRecovery: number;
  staminaCost: number;
  physicalPreparationTime: number;
  physicalRecoveryTime: number;
  range: number;
}
