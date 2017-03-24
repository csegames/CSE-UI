/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 15:12:51
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:17:22
 */

import gql from 'graphql-tag';

export default gql`
fragment DamageTypeValues on DamageTypeValues {
  none
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
  other
  sYSTEM
  all
}
`;

export interface DamageTypeValues {
  none: number;
  slashing: number;
  piercing: number;
  crushing: number;
  physical: number;
  acid: number;
  poison: number;
  disease: number;
  earth: number;
  water: number;
  fire: number;
  air: number;
  lightning: number;
  frost: number;
  elemental: number;
  life: number;
  mind: number;
  spirit: number;
  radiant: number;
  light: number;
  death: number;
  shadow: number;
  chaos: number;
  void: number;
  dark: number;
  arcane: number;
  other: number;
  sYSTEM: number;
  all: number;
}
