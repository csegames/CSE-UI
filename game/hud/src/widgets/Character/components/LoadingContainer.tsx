/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 10:13:18
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-27 10:19:13
 */

import * as React from 'react';
import { Spinner } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

export interface LoadingContainerStyles extends StyleDeclaration {
  loadingContainer: React.CSSProperties;
}

export const defaultLoadingContainerStyle: LoadingContainerStyles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
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
