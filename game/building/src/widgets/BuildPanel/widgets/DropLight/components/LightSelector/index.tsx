/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import LightPreview from '../LightPreview';
import {Light} from '../../lib/Light';

export interface LightSelectorProps {
  lights: Light[];
  selectLight: (light: Light) => void;
  selected: Light;
}

export interface LightSelectorState {
}

class LightSelector extends React.Component<LightSelectorProps, LightSelectorState> {

  constructor(props: LightSelectorProps) {
    super(props);
  }

  selectLight = (light: Light) => {
    if (this.props.selectLight != undefined)
      this.props.selectLight(light);
  }

  generateLightPreview = (light: Light, selected: boolean) => {
    return (
      <LightPreview key={'custom' + light.index}
        className={selected ? 'active' : ''}
        selectLight={this.selectLight}
        light={light} />
    )
  }

  generatePresetLightPreview = (light: Light, selected: boolean) => {
    return (
      <div key={'preset' + light.index} className="preset-light">
        <LightPreview
          className={selected ? 'active' : ''}
          selectLight={this.selectLight}
          light={light} />
        <div>{light.presetName}</div>
      </div>
    )
  }

  render() {
    const customLights: Light[] = this.props.lights.filter((light: Light) => !light.preset);
    const presetLights: Light[] = this.props.lights.filter((light: Light) => light.preset);

    return (
      <div className='light-selector'>
        <div>Custom</div>
        {customLights.map((light: Light) => this.generateLightPreview(light, this.props.selected === light)) }

        <div>Presets</div>
        {presetLights.map((light: Light) => this.generatePresetLightPreview(light, this.props.selected === light)) }
      </div>
    )
  }
}

export default LightSelector;
