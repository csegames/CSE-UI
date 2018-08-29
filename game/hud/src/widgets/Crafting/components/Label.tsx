/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, cssAphrodite, merge, labelStyles, LabelStyles } from '../styles';

interface LabelProps {
  children?: any;
  style?: Partial<LabelStyles>;
}

const Label = (props: LabelProps) => {
  const ss = StyleSheet.create(merge({}, labelStyles, props.style));
  return (
    <span className={cssAphrodite(ss.label)}>{props.children}:</span>
  );
};

export default Label;
