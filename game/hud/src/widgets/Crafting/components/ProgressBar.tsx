/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-17 11:15:50
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:51:58
 */

import * as React from 'react';
import {StyleSheet, css, merge, progressBar, ProgressBarStyles} from '../styles';

interface ProgressBarProps {
  total: number;
  current: number;
  color: string;
  style?: Partial<ProgressBarStyles>;
}


const ProgressBar = (props: ProgressBarProps) => {
  const ss = StyleSheet.create(merge({}, progressBar, props.style));
  return <div className={css(ss.progressBar)} style={{
    width: (100 - (props.current / props.total * 100)).toFixed(2) + '%',
    backgroundColor: props.color,
  }}/>;
};

export default ProgressBar;
