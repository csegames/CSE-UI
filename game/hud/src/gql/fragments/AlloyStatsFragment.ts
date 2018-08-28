/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

export const AlloyStatsFragment = gql`
  fragment AlloyStats on AlloyStat_Single {
    unitHealth
    unitMass
    massBonus
    encumbranceBonus
    maxRepairPointsBonus
    maxHealthBonus
    healthLossPerUseBonus
    weightBonus
    strengthRequirementBonus
    dexterityRequirementBonus
    vitalityRequirementBonus
    enduranceRequirementBonus
    attunementRequirementBonus
    willRequirementBonus
    faithRequirementBonus
    resonanceRequirementBonus
    fractureThresholdBonus
    fractureChanceBonus
    densityBonus
    malleabilityBonus
    meltingPointBonus
    hardnessBonus
    fractureBonus
    armorClassBonus
    resistSlashingBonus
    resistPiercingBonus
    resistCrushingBonus
    resistAcidBonus
    resistPoisonBonus
    resistDiseaseBonus
    resistEarthBonus
    resistWaterBonus
    resistFireBonus
    resistAirBonus
    resistLightningBonus
    resistFrostBonus
    resistLifeBonus
    resistMindBonus
    resistSpiritBonus
    resistRadiantBonus
    resistDeathBonus
    resistShadowBonus
    resistChaosBonus
    resistVoidBonus
    resistArcaneBonus
    mitigateBonus
    piercingDamageBonus
    piercingArmorPenetrationBonus
    falloffMinDistanceBonus
    falloffReductionBonus
    slashingDamageBonus
    slashingBleedBonus
    slashingArmorPenetrationBonus
    crushingDamageBonus
    fallbackCrushingDamageBonus
    distruptionBonus
    stabilityBonus
    deflectionAmountBonus
    deflectionRecoveryBonus
    knockbackAmountBonus
    staminaCostBonus
    physicalPreparationTimeBonus
    physicalRecoveryTimeBonus
  }
`;
