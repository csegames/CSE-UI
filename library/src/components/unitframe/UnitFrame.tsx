/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import Portrait from './components/Portrait';
import Name from './components/Name';
import HealthBar from './components/HealthBar';
import HealthText from './components/HealthText';
import StaminaBar from './components/StaminaBar';
import StaminaText from './components/StaminaText';
import Effects from './components/Effects';
import Injuries from './components/Injuries';

const UnitFrame = React.createClass<any, any>({
  getInitialState: function() {
    return {
      healthWidth: 0,
      staminaWidth: 0,
    };
  },
  componentDidMount: function() {
    // get runtime widths of the health and stamina bars.
    this.setState({
      healthWidth: this.refs.healthText.getDOMNode().offsetWidth,
      staminaWidth: this.refs.staminaText.getDOMNode().offsetWidth
    });
  },
  render: function() {
    let portrait: any, injuries: any, visible: any;

    // work out the amount of health and stamina to show
    const healthWidth = this.props.maxHealth ? (this.props.health / this.props.maxHealth) * this.state.healthWidth : 0;
    const staminaWidth = this.props.maxStamina ? (this.props.stamina / this.props.maxStamina) * this.state.staminaWidth : 0;

    // If this unit frame includes a race (name) display a portrait.
    if (this.props.race !== undefined) {
      portrait = <Portrait race={this.props.race}/>;
    }

    // If the unit frame has an active target, make sure it is visible.
    // By default Target Unit Frames are not visible (see styles)
    if (this.props.name) {
      visible = { visibility: 'visible' };
    }

    if (this.props.injuries && this.props.injuries.length) {
      injuries = <Injuries injuries={this.props.injuries}/>
    }

    // Render the unit frame
    return (
      <div id="unitframe" className={this.props.className} style={visible}>
        {portrait}
        <Name name={this.props.name}/>
        <HealthBar width={healthWidth} />
        <HealthText ref="healthText" health={this.props.health} maxHealth={this.props.maxHealth} />
        <StaminaBar width={staminaWidth} />
        <StaminaText ref="staminaText" stamina={this.props.stamina} maxStamina={this.props.maxStamina} />
        {injuries}
        <Effects/>
      </div>
    );
  }
});

export default UnitFrame;
