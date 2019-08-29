/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

export const DamageTypeValuesFragment = gql`
  fragment DamageTypeValues on DamageType_Single {
    slashing
    piercing
    crushing
    physical
    acid
    poison
    disease
    earth
    water
    fire
    air
    lightning
    frost
    elemental
    life
    mind
    spirit
    radiant
    light
    death
    shadow
    chaos
    void
    dark
    arcane
  }
`;
