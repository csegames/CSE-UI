/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';

export const Key = styled('span')`
  display: flex;
  ${CSS.HORIZONTALLY_CENTERED}
  width: fit-content;
  height: fit-content;
  box-sizing: border-box!important;
  background-color: rgb(7,7,7);
  background: radial-gradient(ellipse at center, rgba(12,12,12,1) 0%,rgba(7,7,7,1) 100%);
  text-align: center;
  padding: 0 12px;
  margin: 2px 5px;
  min-width: 10px;
  font-size: 13px;
  ${CSS.ALLOW_MOUSE}
  min-height: 23px;
  min-width: 35px;
  &.unassigned {
    color: rgb(32,32,32);
  }
`;
