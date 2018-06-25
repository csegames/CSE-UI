/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { PatcherError } from '../../../../services/patcher';

const Background = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
  z-index: 100;
`;

const Dialog = styled('div')`
  overflow: hidden;
  background: repeating-linear-gradient(45deg, #600000, #600000 2px, #6F0000 2px, #6F0000 5px);
  border-top: 3px solid #600000;
  border-bottom: 3px solid #600000;
  color: #ececec;
  padding: 3px 15px;
  position: fixed;
  left: 25%;
  top: 25%;
  bottom: 25%;
  right: 25%;
  text-align: center;
  z-index: 101;
  overflow-y: auto;
`;

export interface FatalErrorProps {
  errors: PatcherError[];
}

/* tslint:disable:function-name */
function FatalError(props: FatalErrorProps) {
  if (props.errors.length === 0) return null;
  return (
    <Background>
      <Dialog>
        { props.errors.map((error: PatcherError) => <div>{error.message}</div>) }
        <div>Please Restart the Patcher</div>
      </Dialog>
    </Background>
  );
}

export default FatalError;
