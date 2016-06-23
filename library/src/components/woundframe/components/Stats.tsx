/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Stat } from './Stat';

export interface StatsState { }
export interface StatsProps {
  blood: number,
  bloodMax: number,
  stamina: number,
  staminaMax: number,
  panic: number,
  panicMax: number,
  temp: number,
  tempMax: number
}

export class Stats extends React.Component<StatsProps, StatsState> {
  constructor(props: StatsProps) {
    super(props);
  }
  render() {
    return (
      <div className="stats">
        <Stat type="blood" value={this.props.blood} max={this.props.bloodMax}/>
        <Stat type="stamina" value={this.props.stamina} max={this.props.staminaMax}/>
        <Stat type="panic" value={this.props.panic} max={this.props.panicMax}/>
        <Stat type="temp" value={this.props.temp} max={this.props.tempMax}/>
      </div>
    );
  }
}

export default Stats;
