/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 10:39:21
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-28 10:59:33
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface SpinnerStyle extends StyleDeclaration {
  spinner: React.CSSProperties;
}

export const defaultSpinnerStyle: SpinnerStyle = {
  spinner: {
    borderRadius: '50%',
    display: 'inline-block',
    width: '1em',
    height: '1em',
    border: '.25rem solid rgba(255, 255, 255, 0.2)',
    borderTopColor: '#ececec',
    ':hover': {
      borderTopColor: '#3fd0b0',
    },
  },
};

export interface SpinnerProps {
  styles?: Partial<SpinnerStyle>;
}

export const Spinner = (props: SpinnerProps) => {
  const ss = StyleSheet.create(defaultSpinnerStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.spinner, custom.spinner)}></div>
  );
};

export default Spinner;
