/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';

export interface SpinnerStyle {
  spinner: React.CSSProperties;
}

const spin = keyframes`
  from: {
    transform: rotate(0deg);
  }
  to: {
    transform: rotate(360deg)
  }
`;

const SpinnerView = styled('div')`
  border-radius: 50%;
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 0.25rem solid rgba(255, 255, 255, 0.2);
  border-top-color: #ECECEC;
  transition: all 0.3s;
  animation-name: ${spin};
  -webkkit-animation-name: ${spin};
  animation-duration: 1s;
  -webkit-animation-duration: 1s;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -webkit-backface-visibility: hidden;
  &:hover {
    border-top-color: #3FD0B0;
  }
`;

export interface SpinnerProps {
  styles?: Partial<SpinnerStyle>;
}

export const Spinner = (props: SpinnerProps) => {
  const customStyles = props.styles || {};
  return (
    <SpinnerView style={customStyles.spinner} />
  );
};

export default Spinner;
