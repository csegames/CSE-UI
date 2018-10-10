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

import LightPreview from '../LightPreview';
import ColorSelect from '../ColorSelect';
import { Color } from '../../lib/Color';
import { Light } from '../../lib/Light';

function select(state: GlobalState) {
  return {
    lightsState: state.lights,
    showSelector: state.lights.showLightSelector,
  };
}

export interface DropLightPaneStateToPropsInfo {
  lightsState?: lightService.LightsState;
  showSelector?: boolean;
}

export interface DropLightPanePropsInfo {
  dispatch: (action: any) => void;
  lightsState: lightService.LightsState;
  showSelector: boolean;
  minimized?: boolean;
}

export type DropLightPaneProps = DropLightPaneStateToPropsInfo & DropLightPanePropsInfo;

export interface DropLightPaneState {
}

class DropLightPane extends React.Component<DropLightPaneProps, DropLightPaneState> {

  constructor(props: DropLightPaneProps) {
    super(props);
    this.state = { preview: false };
  }

  public render() {
    const light = this.props.lightsState.lights[this.props.lightsState.selectedIndex];

    return (
      <div className={`drop-light ${this.props.minimized ? 'minimized' : ''}`}>
        <LightPreview  selectLight={(light: Light) => this.toggleLightSelector() } light={light} />
        {this.createLightRadius(light) }
        {this.createLightIntensity(light) }
        {this.createColorControls(light) }
        {this.createDropControls(light) }
      </div>
    );
  }

  private radiusChanged = (event: any) => {
    const radius: number = parseInt(event.target.value, 10);
    this.props.dispatch(lightService.updateRadius(radius));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  private intensityChanged = (event: any) => {
    const intensity: number = parseInt(event.target.value, 10);
    this.props.dispatch(lightService.updateIntensity(intensity));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  private colorChanged = (color: Color) => {
    this.props.dispatch(lightService.updateColor(color));
    this.selectLightAsBuildingItem(this.props.lightsState.lights[this.props.lightsState.selectedIndex]);
  }

  private triggerDrop = (light: Light) => {
    game.plot.dropLight(light.intensity, light.radius, light.color.red, light.color.green, light.color.blue);
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
        select: () => { this.selectLight(light); },
      } as BuildingItem;
    }
    fireBuildingItemSelected(item);
  }

  private selectLight = (light: Light) => {
    this.props.dispatch(lightService.selectLight(light));
    this.selectLightAsBuildingItem(light);
  }

  private triggerRemove = () => {
    game.plot.removeLight();
  }

  private triggerClear = () => {
    game.plot.resetLights();
  }

  private toggleLightSelector = () => {
    this.props.dispatch(lightService.showSelector(!this.props.showSelector));
  }

  private createLightRadius(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <div className='control'>
        <span className='label'>radius</span>
        <input className='label-input' type='number' min='1' max='100' step='1'
          value={`${light.radius}`} onChange={this.radiusChanged}/>
      </div>
    );
  }

  private createLightIntensity(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <div className='control'>
        <span className='label'>intensity</span>
        <input className='label-input' type='number' min='1' max='100' step='1'
          value ={`${light.intensity}`} onChange={this.intensityChanged}/>
      </div>
    );
  }

  private createColorControls(light: Light) {
    if (this.props.minimized || light.preset) return null;

    return (
      <ColorSelect color={light.color} colorChanged={this.colorChanged} />
    );
  }

  private createDropControls(light: Light) {
    return (
      <div className='drop-buttons'>
        <button onClick={() => this.triggerDrop(light) } >Drop</button>
        <button onClick={this.triggerRemove}>Remove</button>
        <button onClick={this.triggerClear}>Clear All</button>
      </div>
    );
  }
}

export default connect(select)(DropLightPane);
