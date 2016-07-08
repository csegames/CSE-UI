/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface LightPreviewProps {
  radius: number;
  intensity: number;
  red: number;
  green: number;
  blue: number;  
}

export interface LightPreviewState {
}

class LightPreview extends React.Component<LightPreviewProps, LightPreviewState> {

  constructor(props: LightPreviewProps) {
    super(props);
  }

  render() {
    var rgb = `rgb(${this.props.red}, ${this.props.green}, ${this.props.blue})`;
    var rgbIntensity = `rgba(${this.props.red}, ${this.props.green}, ${this.props.blue}, ${this.props.intensity/200})`
    return (
      <div className='drop-light__preview' style={{backgroundImage: `radial-gradient(50% 50%, ${rgb}, ${rgb} ${(this.props.radius/100)*70}%, ${rgbIntensity} ${(this.props.radius/100)*70 + 30}%, rgb(0,0,0) 200%)`}} />
    )
  }
}

export default LightPreview;
