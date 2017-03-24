/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 15:13:11
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:20:12
 */

import gql from 'graphql-tag';

import DamageTypeValuesFragment, { DamageTypeValues } from './DamageTypeValues';

export default gql`
fragment ArmorPartStats on ArmorPartStats {
  armorClass
  resistances {
    ...DamageTypeValues
  }
  mitigations {
    ...DamageTypeValues
  }
}
${DamageTypeValuesFragment}
`;

export interface ArmorPartStats {
  armorClass?: number;
  resistances?: DamageTypeValues;
  mitigations?: DamageTypeValues;
}
