/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-05 20:53:01
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:51:23
 */

import * as React from 'react';
import { StyleSheet, css, merge, labelStyles, LabelStyles } from '../styles';

interface LabelProps {
  children?: any;
  style?: Partial<LabelStyles>;
}

const Label = (props: LabelProps) => {
  const ss = StyleSheet.create(merge({}, labelStyles, props.style));
  return (
    <span className={css(ss.label)}>{props.children}:</span>
  );
};

export default Label;
