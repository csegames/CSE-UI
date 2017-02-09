/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:43:16
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 11:53:36
 */

import gql from 'graphql-tag';

import FullCharacterFragment, { FullCharacter } from '../fragments/fullCharacter';
import FullOrderFragment, { FullOrder } from '../fragments/fullOrder';
import FullWarbandFragment, { FullWarband } from '../fragments/fullWarband';

export default gql`
query MySocial {
  myCharacter {
    ...FullCharacter
  }
  myOrder {
    ...FullOrder
  }
  myWarbands {
    ...FullWarband
  }
}
${FullCharacterFragment}
${FullOrderFragment}
${FullWarbandFragment}
`;

export interface MySocialQuery {
  myCharacter: FullCharacter;
  myOrder: FullOrder;
  myWarbands: FullWarband[];
}
