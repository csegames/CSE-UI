/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-24 10:40:00
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-20 17:10:17
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

const defaultStyles: WatermarkStyle = {
  watermark: {
    width: '340px',
    height: '20px',
    lineHeight: '20px',
    position: 'fixed',
    left: '50%',
    top: '15px',
    transform: 'translateX(-50%)',
    color: '#fff',
    fontSize: '13px',
    fontFamily: '\'Merriweather Sans\', sans-serif',
    fontWeight: 'bold',
    textAlign: 'right',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    '-webkit-touch-callout': 'none',
    userSelect: 'none',
    cursor: 'default',
  },
};

export interface WatermarkStyle {
  watermark: React.CSSProperties;
}

export default (props: {
  style?: Partial<WatermarkStyle>;
}) => {
  const ss = StyleSheet.create(merge(defaultStyles, props.style || {}));
  return <i className={css(ss.watermark)}>Engine/Tech Alpha - Do not stream or distribute.</i>;
};
