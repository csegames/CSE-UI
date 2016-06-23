/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface StatState { }
export interface StatProps {
  type: string,
  value: number,
  max: number
}

export class Stat extends React.Component<StatProps, StatState> {
  constructor(props: StatProps) {
    super(props);
  }
  render() {
    const pct: number = this.props.value / this.props.max * 100;
    return (
      <div className={"stat " + this.props.type}>
        <label>{this.props.type[0].toUpperCase() + this.props.type.substr(1)}</label>
        <div className="bar">
          <div className="fill" style={{ width: pct + '%' }}>
          </div>
        </div>
      </div>
    );
  }
}

export default Stat;
