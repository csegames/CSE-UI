/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Spinner } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

export interface LoadingContainerStyles extends StyleDeclaration {
  loadingContainer: React.CSSProperties;
}

export const defaultLoadingContainerStyle: LoadingContainerStyles = {
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    zIndex: 10,
  },
};

export interface LoadingContainerProps {
  styles?: Partial<LoadingContainerStyles>;
}

const LoadingContainer = (props: LoadingContainerProps) => {
  const ss = StyleSheet.create({ ...defaultLoadingContainerStyle, ...props.styles });
  return (
    <div className={css(ss.loadingContainer)}><Spinner /></div>
  );
};

export default LoadingContainer;
