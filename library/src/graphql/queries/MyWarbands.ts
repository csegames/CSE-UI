/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:43:14
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-18 11:39:34
 */

import gql from 'graphql-tag';

import FullWarbandFragment, {FullWarband} from '../fragments/FullWarband';

export default gql`
query MyWarbands {
  myWarbands {
    ...FullWarband
  }
}
${FullWarbandFragment}
`;

export interface MyWarbandsQuery {
  myWarbands : FullWarband[];
}
