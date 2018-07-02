/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from 'react-emotion';
import * as CSS from '../../lib/css-helper';

export const Field = styled('div')`
  position: relative;
  &.right-align {
    text-align: right;
  }
  &.half-width {
    width: 50%;
  }
  &.quarter-width {
    width: 25%;
  }
  &.expand {
    ${CSS.EXPAND_TO_FIT}
  }
  &.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.fixed-height {
    height: 33px;
    min-height: 33px;
    max-height: 33px;
    line-height: 33px;
  }
  &.is-row {
    ${CSS.IS_ROW}
  }
  &.is-column {
    ${CSS.IS_COLUMN}
  }
  &.at-end {
    ${CSS.IS_ROW}
    justify-content: flex-end;
    padding-right: 20px;
    box-sizing: border-box!important;
  }
`;
