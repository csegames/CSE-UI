/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 18:43:00
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 18:43:00
 */

import * as React from 'react';
import { archetype } from 'camelot-unchained';
import SVGSprite from './SVGSprite';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

const defaultStyle: ClassIconStyle = {
  icon: {
    fill: 'white',
    height: '100%',
    width: '100%',
  },
}

export interface ClassIconStyle {
  icon: React.CSSProperties;
}

export default (props: {
  playerClass: archetype;
  style?: Partial<ClassIconStyle>;
}) => {
  const ss = StyleSheet.create(merge(defaultStyle, props.style || {}));
  switch (this.props.playerClass) {
    case archetype.BLACKGUARD:
      return <SVGSprite sprite='images/class-icons.svg#archer-class-icon' svgClass={css(ss.icon)} />;
    case archetype.BLACKKNIGHT:
      return <SVGSprite sprite='images/class-icons.svg#heavy-class-icon' svgClass={css(ss.icon)} />;
    case archetype.EMPATH:
      return <SVGSprite sprite='images/class-icons.svg#heal-class-icon' svgClass={css(ss.icon)} />;
    default: return <h1>Invalid Class</h1>;
  }
}
