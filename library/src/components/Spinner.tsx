/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface SpinnerStyle extends StyleDeclaration {
  spinner: React.CSSProperties;
}

const spin = {
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
};


export const defaultSpinnerStyle: SpinnerStyle = {
  spinner: {
    borderRadius: '50%',
    display: 'inline-block',
    width: '1em',
    height: '1em',
    border: '.25rem solid rgba(255, 255, 255, 0.2)',
    borderTopColor: '#ececec',
    transition: 'all .3s',
    animationName: spin,
    WebkitAnimationName: spin,
    animationDuration: '1s',
    WebkitAnimationDuration: '1s',
    animationIterationCount: 'infinite',
    WebkitAnimatiionIterationCount: 'infinite',
    WebkitBackfaceVisibility: 'hidden',
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
