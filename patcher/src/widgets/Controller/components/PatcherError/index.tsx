/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { PatcherError } from '../../../../services/patcher';

const Alert = styled('div')`
  overflow: hidden;
  background-color: orange;
  color: black;
  padding: 3px 15px;
  position: relative;
  pointer-events: bounding-box;
  cursor: pointer;
  ::after {
    content: 'X';
    position: absolute;
    right: 0;
    height: 100%;
    width: 30px;
    pointer-events: none;
  }
`;

export interface PatcherErrorProps {
  errors: PatcherError[];
  onClear?: any;
}

/* tslint:disable:function-name */
function PatcherError(props: PatcherErrorProps) {
  if (props.errors.length === 0) return null;
  return <Alert onClick={props.onClear}>
    { props.errors.length > 1 ? `(1/${props.errors.length}) ` : '' }
    { props.errors[0].message }
  </Alert>;
}

export default PatcherError;
