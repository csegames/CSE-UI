/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from 'react-emotion';
import { Archetype } from '../';
import SVGSprite from './SVGSprite';

const Icon = css`
  fill: white;
  height: 100%;
  width: 100%;
`;

export const ClassIcon = (props: {
  playerClass: Archetype;
}) => {
  switch (props.playerClass) {
    case Archetype.Blackguard:
      return <SVGSprite sprite='images/class-icons.svg#archer-class-icon' svgClass={Icon}/>;
    case Archetype.BlackKnight:
      return <SVGSprite sprite='images/class-icons.svg#heavy-class-icon' svgClass={Icon}/>;
    case Archetype.Empath:
      return <SVGSprite sprite='images/class-icons.svg#heal-class-icon' svgClass={Icon}/>;
    default:
      return <h1>Invalid Class</h1>;
  }
};

export default ClassIcon;
