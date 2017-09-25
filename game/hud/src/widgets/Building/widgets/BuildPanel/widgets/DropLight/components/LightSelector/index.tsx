/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

import { BuildingItem, BuildingItemType } from '../../../../../../lib/BuildingItem';
import { fireBuildingItemSelected } from '../../../../../../services/events';

import { GlobalState } from '../../services/session/reducer';
import * as lightService from '../../services/session/lights';
import { Light } from '../../lib/Light';
import LightPreview from '../LightPreview';

function select(state: GlobalState) {
  return {
    lights: state.lights.lights,
    selected: state.lights.lights[state.lights.selectedIndex],
    show: state.lights.showLightSelector,
  };
}

export interface LightSelectorProps {
  dispatch: any;
  lights: Light[];
  selected: Light;
  show: boolean;
}

export interface LightSelectorState {
}

class LightSelector extends React.Component<LightSelectorProps, LightSelectorState> {

  constructor(props: LightSelectorProps) {
    super(props);
  }

  public render() {
    if (!this.props.show) return null;

    const customLights: Light[] = this.props.lights.filter((light: Light) => !light.preset);
    const presetLights: Light[] = this.props.lights.filter((light: Light) => light.preset);

    return (
      <div className='light-selector'>
        <div>Custom</div>
        {customLights.map((light: Light) => this.generateLightPreview(light, this.props.selected === light)) }

        <div>Presets</div>
        {presetLights.map((light: Light) => this.generatePresetLightPreview(light, this.props.selected === light)) }
      </div>
    );
  }

  private selectLightAsBuildingItem(light: Light) {
    let item: BuildingItem = null;
    if (light != null) {
      const descr = 'RGB: (" + light.color.red + ", " + light.color.green + ", " + light.color.blue + ") Intensity:' +
        light.intensity + ' Radius:' + light.radius;

      item = {
        name: 'DropLight',
        description: descr,
        element: (<LightPreview light={light} />),
        id: light.index + '-' + BuildingItemType.Droplight,
        type: BuildingItemType.Droplight,
        select: () => this.selectLight(light),
      } as BuildingItem;
    }
    fireBuildingItemSelected(item);
  }

  private selectLight = (light: Light) => {
    this.props.dispatch(lightService.selectLight(light));
    this.selectLightAsBuildingItem(light);
  }

  private generateLightPreview = (light: Light, selected: boolean) => {
    return (
      <LightPreview key={'custom' + light.index}
        className={selected ? 'active' : ''}
        selectLight={this.selectLight}
        light={light} />
    );
  }

  private generatePresetLightPreview = (light: Light, selected: boolean) => {
    return (
      <div key={'preset' + light.index} className='preset-light'>
        <LightPreview
          className={selected ? 'active' : ''}
          selectLight={this.selectLight}
          light={light} />
        <div>{light.presetName}</div>
      </div>
    );
  }
}

export default connect(select)(LightSelector);
