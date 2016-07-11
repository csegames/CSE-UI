/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ColorSelectProps {
}

export interface ColorSelectState {
}

class ColorSelect extends React.Component<ColorSelectProps, ColorSelectState> {

  constructor(props: ColorSelectProps) {
    super(props);
  }
  
  renderColorBar = () => {
    let hueStop: any;
    let hueBarRect: any;
    for(let row = 0; row <= 300; ++row) {
      
    }
    return (
      <canvas />   
    )
  }

  render() {
    return (
      <div className='color-picker'>
        {this.renderColorBar()}
      </div>
    )
  }
}

export default ColorSelect;
