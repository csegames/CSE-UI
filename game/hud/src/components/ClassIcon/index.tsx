/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {archetype} from 'camelot-unchained';
import SVGSprite from  '../SVGSprite';

export interface ClassIconProps {
  playerClass: archetype;
}

export interface ClassIconState {
}

class ClassIcon extends React.Component<ClassIconProps, ClassIconState> {

  constructor(props: ClassIconProps) {
    super(props);
  }

  render() {
    switch(this.props.playerClass) {
      case archetype.BLACKGUARD:
        return <SVGSprite sprite='images/class-icons.svg#archer-class-icon'
                   svgClass='player-status-bar__class-icon' />;
      case archetype.BLACKKNIGHT:
        return <SVGSprite sprite='images/class-icons.svg#heavy-class-icon'
                   svgClass='player-status-bar__class-icon' />;
      case archetype.EMPATH:
        return <SVGSprite sprite='images/class-icons.svg#heal-class-icon'
                   svgClass='player-status-bar__class-icon' />;           
      default: return <h1>Invalid Class</h1>;
    }
  }
}

export default ClassIcon;
