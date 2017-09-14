/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-24 23:51:05
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:50:01
 */

import * as React from 'react';
import { StyleSheet, css, merge, close, CloseStyles } from '../styles';

interface CloseProps {
  onClose: () => void;
  style?: Partial<CloseStyles>;
}

const Close = (props: CloseProps) => {
  const ss = StyleSheet.create(merge({}, close, props.style));
  return (
    <span className={'cu-window-close ' + css(ss.close)} onClick={props.onClose}></span>
  );
};

export default Close;
