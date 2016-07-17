/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {client} from 'camelot-unchained';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem'
import {fireBuildingItemSelected} from '../../../../../../services/events';

import {GlobalState} from '../../services/session/reducer';
import * as lightService from '../../services/session/lights';
import {LightsState} from '../../services/session/lights';

import LightPreview from '../LightPreview';
import ColorSelect from '../ColorSelect';
import LightSelector from '../LightSelector';
import {Color} from '../../lib/Color';
import {Light} from '../../lib/Light';

function select(state: GlobalState): DropLightPaneProps {
  return {
    lightsState: state.lights,
    showSelector: state.lights.showLightSelector
  }
}

export interface DropLightPaneProps {
  dispatch?: (action: any) => void;
  lightsState?: LightsState;
  minimized?: boolean;
  showSelector?: boolean;
}

export interface DropLightPaneState {
}

class DropLightPane extends React.Component<DropLightPaneProps, DropLightPaneState> {

  constructor(props: DropLightPaneProps) {
    super(props);
    this.state = { preview: false };
  }

  radiusChanged = (event: any) => {
    const radius: number = parseInt(event.target.value, 10);
    this.props.dispatch(lightService.updateRadius(radius));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  intensityChanged = (event: any) => {
    const intensity: number = parseInt(event.target.value, 10);
    this.props.dispatch(lightService.updateIntensity(intensity));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  colorChanged = (color: Color) => {
    this.props.dispatch(lightService.updateColor(color));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  triggerDrop = (light: Light) => {
    client.DropLight(light.intensity, light.radius,
      light.color.red, light.color.green, light.color.blue);
  }

  selectLightAsBuildingItem(light: Light) {
    let item: BuildingItem = null;
    if (light != null) {
      const descr = "RGB: (" + light.color.red + ", " + light.color.green + ", " + light.color.blue + ") Intensity:" +
        light.intensity + " Radius:" + light.radius;

      item = {
        name: 'DropLight',
        description: descr,
        element: (<LightPreview light={light} />),
        id: light.index + '-' + BuildingItemType.Droplight,
        type: BuildingItemType.Droplight,
        select: () => { this.selectLight(light) }
      } as BuildingItem;
    }
    fireBuildingItemSelected(item);
  }

  selectLight = (light: Light) => {
    this.props.dispatch(lightService.selectLight(light));
  }

  triggerClear = () => {
    client.ResetLights();
  }

  toggleLightSelector = () => {
    this.props.dispatch(lightService.showSelector(!this.props.showSelector));
  }

  createLightRadius(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <div className="control">
        <span className="label">radius</span>
        <input type='number' min='1' max='100' step='1'
          value={`${light.radius}`} onChange={this.radiusChanged}/>
      </div>
    );
  }

  createLightIntensity(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <div className="control">
        <span className="label">intensity</span>
        <input type='number' min='1' max='100' step='1'
          value ={`${light.intensity}`} onChange={this.intensityChanged}/>
      </div>
    );
  }

  createColorControls(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <ColorSelect color={light.color} colorChanged={this.colorChanged} />
    )
  }

  createDropControls(light: Light) {
    return (
      <div className="drop-buttons">
        <button onClick={() => this.triggerDrop(light) } >Drop</button>
        <button onClick={this.triggerClear} >Clear</button>
      </div>
    );
  }

  render() {
    const light = this.props.lightsState.lights[this.props.lightsState.selectedIndex];

    return (
      <div className={`drop-light ${this.props.minimized ? 'minimized' : ''}`}>
        <LightPreview  selectLight={(light: Light) => this.toggleLightSelector() } light={light} />
        {this.createLightRadius(light) }
        {this.createLightIntensity(light) }
        {this.createColorControls(light) }
        {this.createDropControls(light) }
      </div>
    )
  }
}

export default connect(select)(DropLightPane);
