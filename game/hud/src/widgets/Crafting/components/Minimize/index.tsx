/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-17 14:16:42
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-17 17:37:00
 */


import * as React from 'react';
import { StyleSheet, css, merge, minimize, MinimizeStyles } from '../../styles';

interface MinimizeProps {
  onMinimize: () => void;
  minimized: boolean;
  style?: Partial<MinimizeStyles>;
}

const Minimize = (props: MinimizeProps) => {
  const ss = StyleSheet.create(merge({}, minimize, props.style));
  return (
    <span
      className={
        'minimize '
        + css(ss.container, props.minimized ? ss.maximize : ss.minimize)
      }
      onClick={props.onMinimize}/>
  );
};

export default Minimize;
