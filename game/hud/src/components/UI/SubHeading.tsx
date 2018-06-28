/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CONFIG from './config';
import { DIALOG_FONT } from './TabbedDialog/config';

export const H1 = styled('div')`
  font-size: 12px;
  ${DIALOG_FONT};
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  text-transform: uppercase;
  border-bottom: 1px solid ${CONFIG.NORMAL_TEXT_COLOR};
  border-image: linear-gradient(to right,${CONFIG.NORMAL_TEXT_COLOR} 0%, rgba(0,0,0,0) 75%) 0 0 1 0;
  margin: 20px 0 6px 0;
  min-height: 16px;
  box-sizing: content-box!important;
  &:first-child {
    margin-top: 10px;
  }
`;

interface SubHeadingProps {
  children?: any;
}

/* tslint:disable:function-name */
export function SubHeading(props: SubHeadingProps) {
  return (
    <H1>{props.children}</H1>
  );
}
