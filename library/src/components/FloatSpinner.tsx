/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 10:39:21
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-16 18:02:05
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import Spinner from './Spinner';
import { merge } from 'lodash';

export interface FloatSpinnerStyle extends StyleDeclaration {
  spinner: React.CSSProperties;
}

export const defaultFloatSpinnerStyle: FloatSpinnerStyle = {
  spinner: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 99999,
  },
};

export interface FloatSpinnerProps {
  styles?: Partial<FloatSpinnerStyle>;
}

export const FloatSpinner = (props: FloatSpinnerProps) => {
  return <Spinner styles={merge(defaultFloatSpinnerStyle, props.styles || {})} />;
};

export default FloatSpinner;
