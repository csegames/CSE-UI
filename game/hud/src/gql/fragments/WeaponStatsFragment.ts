/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

export const WeaponStatsFragment = gql`
  fragment WeaponStats on WeaponStat_Single {
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
