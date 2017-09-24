/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 10:39:21
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-16 19:03:22
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface FlatButtonStyle extends StyleDeclaration {
  button: React.CSSProperties;
}

export const defaultFlatButtonStyle: FlatButtonStyle = {
  button: {
    padding: '5px 15px',
    cursor: 'pointer',
    userSelect: 'none',
    webkitUserSelect: 'none',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
};

export interface FlatButtonProps {
  styles?: Partial<FlatButtonStyle>;
  children?: React.ReactNode;

  [id: string]: any;
}

export const FlatButton = (props: FlatButtonProps) => {
  const ss = StyleSheet.create(defaultFlatButtonStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.button, custom.button)} {...props}>
      {props.children}
    </div>
  );
};

export default FlatButton;
