/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Archetype } from '../';
import SVGSprite from './SVGSprite';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

const defaultStyle: ClassIconStyle = {
  icon: {
    fill: 'white',
    height: '100%',
    width: '100%',
  },
};

export interface ClassIconStyle {
  icon: React.CSSProperties;
}

export const ClassIcon = (props: {
  playerClass: Archetype;
  style?: Partial<ClassIconStyle>;
}) => {
  const ss = StyleSheet.create(merge(defaultStyle, props.style || {}));
  switch (this.props.playerClass) {
    case Archetype.Blackguard:
      return <SVGSprite sprite='images/class-icons.svg#archer-class-icon' svgClass={css(ss.icon)}/>;
    case Archetype.BlackKnight:
      return <SVGSprite sprite='images/class-icons.svg#heavy-class-icon' svgClass={css(ss.icon)}/>;
    case Archetype.Empath:
      return <SVGSprite sprite='images/class-icons.svg#heal-class-icon' svgClass={css(ss.icon)}/>;
    default:
      return <h1>Invalid Class</h1>;
  }
};

export default ClassIcon;
