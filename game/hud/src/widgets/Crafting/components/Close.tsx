/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, cssAphrodite, merge, close, CloseStyles } from '../styles';

interface CloseProps {
  onClose: () => void;
  style?: Partial<CloseStyles>;
}

const Close = (props: CloseProps) => {
  const ss = StyleSheet.create(merge({}, close, props.style));
  return (
    <span className={'cu-window-close ' + cssAphrodite(ss.close)} onClick={props.onClose}></span>
  );
};

export default Close;
