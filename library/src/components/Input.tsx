/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import client from '../core/client';

export interface InputStyle {
  inputWrapper: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

const InputWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`;

const InputView = styled('input')`
  flex: 1;
  padding: 5px 15px;
  background-color: transparent;
  background: rgba(0, 0, 0, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  color: #8F8F8F;
  font-size: 1em;
  line-height: 1em;
  box-shadow: inset 0px 0px 2px 0px rgba(200, 200, 200, 0.1);
  &::-webkit-input-placeholder {
    font-size: 1em;
    line-height: 1em;
  }
  &::placeholder {
    font-size: 1em;
    line-height: 1em;
  }
`;

const Label = styled('label')`
  flex: 1;
`;

export interface InputProps {
  styles?: Partial<InputStyle>;
  label?: string;
  inputRef?: (r: HTMLInputElement) => void;
  type: string;

  [id: string]: any;
}

export const Input = (props: Partial<InputProps>) => {
  const { styles, ...inputProps } = props;
  const customStyles = props.styles || {};
  return (
    <InputWrapper style={customStyles.inputWrapper}>
      {props.label ? <Label style={customStyles.label}>{props.label}</Label> : null}
      <InputView
        innerRef={r => props.inputRef ? props.inputRef(r) : null}
        onClick={() => client.RequestInputOwnership()}
        onBlur={() => client.ReleaseInputOwnership()}
        style={styles.input}
        {...inputProps}
      />
    </InputWrapper>
  );
};

export default Input;
