/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';

export const PopupDialog = styled('div')`
  position: absolute;
  ${CSS.IS_COLUMN}
`;

export const Container = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT}
  padding: 20px;
  overflow: auto;
  padding-top: 0;
`;
