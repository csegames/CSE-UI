/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import * as React from 'react';
import { StyleSheet, cssAphrodite, merge, minimize, MinimizeStyles } from '../styles';

interface MinimizeProps {
  onMinimize: () => void;
  minimized: boolean;
  style?: Partial<MinimizeStyles>;
}

const Minimize = (props: MinimizeProps) => {
  const ss = StyleSheet.create(merge({}, minimize, props.style));
  return (
    <span
      className={cssAphrodite(ss.minimize, props.minimized ? ss.maximized : ss.minimized)}
      onClick={props.onMinimize}/>
  );
};

export default Minimize;
