/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {BuildPaneProps} from '../../lib/BuildPane';
import LightPreview from './components/LightPreview';
import ColorSelect from './components/ColorSelect';
const assign = require('object-assign');

export interface DropLightState {
  radius: number;
  intensity: number;
  red: number;
  green: number;
  blue: number;
}

class DropLight extends React.Component<BuildPaneProps, DropLightState> {

  constructor(props: BuildPaneProps) {
    super(props);
    this.state = {
      radius: 10,
      intensity: 20,
      red: 255,
      green: 0,
      blue: 0,
    };
  }
  
  radiusChanged = (event: any) => {
    this.setState(assign({}, this.state, {
      radius: parseInt(event.target.value, 10)
    }));
  }
  
  intensityChanged = (event: any) => {
    this.setState(assign({}, this.state, {
      intensity: parseInt(event.target.value, 10)
    }));
  }

  render() {
    return (
      <div className={`drop-light ${this.props.minimized ? 'minimized' : ''}`}>
        <LightPreview radius={this.state.radius} 
                      intensity={this.state.intensity}
                      red={this.state.red}
                      green={this.state.green}
                      blue={this.state.blue} />
        <div className='drop-light__controls'>
          radius
          <input type='number' name='radius' min='1' max='1000'
                 value={`${this.state.radius}`} onChange={this.radiusChanged}/>
          intensity
          <input type='number' name='radius' min='1' max='1000'
                 value={`${this.state.intensity}`} onChange={this.intensityChanged}/>           
        </div>
        <ColorSelect />
      </div>
    )
  }
}

export default DropLight;
