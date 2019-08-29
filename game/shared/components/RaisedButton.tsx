/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

export interface RaisedButtonStyle {
  button: React.CSSProperties;
  buttonDisabled: React.CSSProperties;
}

const Button = styled('div')`
  padding: 5px 15px;
  background-color: #666;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    background-color: #777;
  }
  &:active {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    background-color: #AAA;
  }
`;

const ButtonDisabled = styled('div')`
  padding: 5px 15px;
  background-color: #555;
  color: #777;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
`;

export interface RaisedButtonProps {
  styles?: Partial<RaisedButtonStyle>;
  children?: React.ReactNode;
  disabled?: boolean;

  [id: string]: any;
}

export const RaisedButton = (props: RaisedButtonProps) => {
  const customStyles = props.styles;
  if (props.disabled) {
    return (
      <ButtonDisabled>
        {props.children}
      </ButtonDisabled>
    );
  }
  return (
    <Button {...props}>
      {props.children}
    </Button>
  );
};

export default RaisedButton;
