/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface SlideIndicatorBarProps {
  currentValue: number;
  maxValue: number;
  containerClass?: string;
  indicatorClass?: string;
}

export interface SlideIndicatorBarState {
}

class SlideIndicatorBar extends React.Component<SlideIndicatorBarProps, SlideIndicatorBarState> {

  constructor(props: SlideIndicatorBarProps) {
    super(props);
  }

  render() {
    return (
      <div className={`player-status-bar__slide-indicator-bar ${this.props.containerClass || ''}`}>
        <div className={`player-status-bar__slide-indicator-bar--indicator ${this.props.indicatorClass || ''}`}
             style={{left:`${(this.props.currentValue / this.props.maxValue)*100}%`}} />
      </div>
    )
  }
}

export default SlideIndicatorBar;
