/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import DisplayName from './components/DisplayName';
import Doll from './components/Doll';
import Stats from './components/Stats';
import Buffs from './components/Buffs';
import WoundColors from './classes/WoundColors';

export class WoundsProps {
  name: string;
  injuries: any[];
  health: number;
  healthMax: number;
  stamina: number;
  staminaMax: number;
  panic: number;
  panicMax: number;
  temp: number;
  tempMax: number;
}

export class WoundsState { }

class WoundFrame extends React.Component<WoundsProps, WoundsState> {
  constructor(props: WoundsProps) {
    super(props);
  }
  render() {
    return (
      <div>
        <DisplayName name={this.props.name} />
        <Doll injuries={this.props.injuries} />
        <Buffs type="boon"/>
        <Buffs type="bane"/>
        <Stats
          blood={this.props.health} bloodMax={this.props.healthMax}
          stamina={this.props.stamina} staminaMax={this.props.staminaMax}
          panic={this.props.panic} panicMax={this.props.panicMax} //15 55
          temp={this.props.temp} tempMax={this.props.tempMax} // 72 96
          />
      </div>
    );
  }
}

export default WoundFrame;
