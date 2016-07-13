/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Color} from '../../lib/Color';
import {Light} from '../../lib/Light';

export interface LightPreviewProps {
  light: Light
  selectLight?: (light: Light) => void;
  className?: string;
}

export interface LightPreviewState {
}

class LightPreview extends React.Component<LightPreviewProps, LightPreviewState> {
  private maxRadius: number = 100;
  private maxIntensity: number = 100;

  constructor(props: LightPreviewProps) {
    super(props);
  }

  selectLight = (light: Light) => {
    if (this.props.selectLight != undefined)
      this.props.selectLight(light);
  }


  render() {
    const maxR = this.maxRadius;
    const maxI = this.maxIntensity;
    const light = this.props.light;
    const color: Color = light.color;
    const rgb = `rgb(${color.red}, ${color.green}, ${color.blue})`;
    const rgbIntensity = `rgba(${color.red}, ${color.green}, ${color.blue}, ${light.intensity / (2 * maxI)})`
    return (
      <div
        onClick={() => this.selectLight(light)}
        className={'drop-light__preview ' + this.props.className}
        style={{ backgroundImage: `radial-gradient(50% 50%, ${rgb}, ${rgb} ${(light.radius / maxR) * 70}%, ${rgbIntensity} ${(light.radius / maxR) * 70 + 30}%, rgb(0,0,0) 200%)` }} />
    )
  }
}

export default LightPreview;
