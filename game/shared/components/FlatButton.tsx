/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

export interface FlatButtonStyle {
  button: React.CSSProperties;
}

const Button = styled('div')`
  padding: 5px 15px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export interface FlatButtonProps {
  styles?: Partial<FlatButtonStyle>;
  children?: React.ReactNode;

  [id: string]: any;
}

export const FlatButton = (props: FlatButtonProps) => {
  const customStyles = props.styles || {};
  return (
    <Button {...props} style={customStyles.button}>
      {props.children}
    </Button>
  );
};

export default FlatButton;
