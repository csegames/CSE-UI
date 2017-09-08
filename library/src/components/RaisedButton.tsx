/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 10:39:21
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 10:41:20
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface RaisedButtonStyle extends StyleDeclaration {
  button: React.CSSProperties;
  buttonDisabled: React.CSSProperties;
}

export const defaultRaisedButtonStyle: RaisedButtonStyle = {
  button: {
    padding: '5px 15px',
    backgroundColor: '#666',
    cursor: 'pointer',
    userSelect: 'none',
    webkitUserSelect: 'none',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1), background-color 0.3s cubic-bezier(.25,.8,.25,1)',
    ':hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      backgroundColor: '#777',
    },
    ':active': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      backgroundColor: '#AAA',
    },
  },

  buttonDisabled: {
    padding: '5px 15px',
    backgroundColor: '#555',
    color: '#777',
    cursor: 'default',
    userSelect: 'none',
    webkitUserSelect: 'none',
  },
};

export interface RaisedButtonProps {
  styles?: Partial<RaisedButtonStyle>;
  children?: React.ReactNode;
  disabled?: boolean;

  [id: string]: any;
}

export const RaisedButton = (props: RaisedButtonProps) => {
  const ss = StyleSheet.create(defaultRaisedButtonStyle);
  const custom = StyleSheet.create(props.styles || {});
  if (props.disabled) {
    return (
      <div className={css(ss.buttonDisabled, custom.buttonDisabled)}>
        {props.children}
      </div>
    );
  }
  return (
    <div className={css(ss.button, custom.button)} {...props}>
      {props.children}
    </div>
  );
};

export default RaisedButton;
