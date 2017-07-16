/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:43:16
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-29 15:59:49
 */

import gql from 'graphql-tag';

import CUCharacterFragment, { CUCharacter } from '../fragments/CUCharacter';
import FullOrderFragment, { FullOrder } from '../fragments/FullOrder';

export default gql`
query MySocial {
  myCharacter {
    ...CUCharacter
  }
  myOrder {
    ...FullOrder
  }
}
${CUCharacterFragment}
${FullOrderFragment}
`;

export interface MySocialQuery {
  myCharacter: CUCharacter;
  myOrder: FullOrder;
}
