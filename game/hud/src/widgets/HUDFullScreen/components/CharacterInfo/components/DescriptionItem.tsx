/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import { colors } from '../../../lib/constants';

const DescriptionItem = styled('div')`
  display: flex;
  justify-content: space-between;
  position: relative;
  cursor: default;
  padding: 0 5px;
  height: 25px;
  background-color: rgba(55, 47, 45, 0.5);
  box-shadow: inset 0px 0px 3px rgba(0,0,0,0.5);
  opacity: 0.8;
  border-right: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  border-bottom: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  color: #C57C30;
  &:hover {
    backgroundColor: ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  }
`;

export default DescriptionItem;
