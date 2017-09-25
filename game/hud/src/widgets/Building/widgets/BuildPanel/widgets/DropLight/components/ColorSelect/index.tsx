/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Color } from '../../lib/Color';

// tslint:disable
const colorOps = require('color-ops');

export interface ColorSelectProps {
  colorChanged: (color: Color) => void;
  color: Color;
}

export interface ColorSelectState {
}

class ColorSelect extends React.Component<ColorSelectProps, ColorSelectState> {

  constructor(props: ColorSelectProps) {
    super(props);
    this.state = { hue: 0 };
  }

  public render() {
    const opsColor = this.getOpsColor(this.props.color);
    const hue = colorOps.hue(opsColor);

    return (
      <div className='color-picker'>
        <input className='hue' type='range' min='0' max='359' step='1'
          value={`${hue}`} onChange={this.hueChanged}/>
        <div>
          <div className='control'>R: <input className='red-input' type='number' min='0' max='255' step='1'
            value={`${this.props.color.red}`} onChange={this.redChanged}/></div>
          <div className='control'>G: <input className='green-input' type='number' min='0' max='255' step='1'
            value={`${this.props.color.green}`} onChange={this.greenChanged}/></div>
          <div className='control'>B: <input className='blue-input' type='number' min='0' max='255' step='1'
            value={`${this.props.color.blue}`} onChange={this.blueChanged}/></div>
        </div>
      </div>
    );
  }

  private hueChanged = (event: any) => {
    const hue: number = parseInt(event.target.value, 10);
    const color: Color = this.updateHue(hue, this.props.color);
    this.props.colorChanged(color);
  }

  private redChanged = (event: any) => {
    const red: number = parseInt(event.target.value, 10);
    this.props.colorChanged({ red, green: this.props.color.green, blue: this.props.color.blue } as Color);
  }

  private greenChanged = (event: any) => {
    const green: number = parseInt(event.target.value, 10);
    this.props.colorChanged({ red: this.props.color.red, green, blue: this.props.color.blue } as Color);
  }

  private blueChanged = (event: any) => {
    const blue: number = parseInt(event.target.value, 10);
    this.props.colorChanged({ red: this.props.color.red, green: this.props.color.green, blue } as Color);
  }

  private updateHue(hue: number, color: Color): Color {
    const opsColor = this.getOpsColor(color);
    const hslColor = colorOps.toHSL(opsColor);
    const newColor = colorOps.hsl(hue, hslColor.s, hslColor.l);

    return {
      red: Math.round(newColor[0]),
      green: Math.round(newColor[1]),
      blue: Math.round(newColor[2]),
    } as Color;
  }

  private getOpsColor(color: Color) {
    return colorOps.rgb(color.red, color.green, color.blue);
  }
}

export default ColorSelect;
