/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import client from '../core/client';

export interface InputStyle extends StyleDeclaration {
  inputWrapper: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

export const defaultInputStyle: InputStyle = {
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  input: {
    flex: '1 1 auto',
    padding: '5px 15px',
    backgroundColor: 'transparent',
    background: 'rgba(0, 0, 0, 0.1)',
    border: 'solid 1px rgba(255, 255, 255, 0.2)',
    color: '#8f8f8f',
    fontSize: '1em',
    lineHeight: '1em',
    boxShadow: 'inset 0px 0px 2px 0px rgba(200,200,200,.1)',
    '::-webkit-input-placeholder': {
      fontSize: '1em',
      lineHeight: '1em',
    },
    '::placeholder': {
      fontSize: '1em',
      lineHeight: '1em',
    },
  },

  label: {
    flex: '1 1 auto',
  },
};

export interface InputProps {
  styles?: Partial<InputStyle>;
  label?: string;
  inputRef?: (r: HTMLInputElement) => void;
  type: string;

  [id: string]: any;
}

export const Input = (props: Partial<InputProps>) => {
  const ss = StyleSheet.create(defaultInputStyle);
  const { styles, ...inputProps } = props;
  const custom = StyleSheet.create(styles || {});
  return (
    <div className={css(ss.inputWrapper, custom.inputWrapper)}>
      {props.label ? <label className={css(ss.label, custom.label)}>{props.label}</label> : null}
      <input
        ref={r => props.inputRef ? props.inputRef(r) : null}
        onClick={() => client.RequestInputOwnership()}
        onBlur={() => client.ReleaseInputOwnership()}
        className={css(ss.input, custom.input)}
        {...inputProps}
      />
    </div>
  );
};

export default Input;
