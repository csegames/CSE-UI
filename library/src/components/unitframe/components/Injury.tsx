/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import InjuryLocation from './InjuryLocation';
import InjuryBar from './InjuryBar';
import InjuryText from './InjuryText';
import InjuryWounds from './InjuryWounds';

// Display list of injuries.  Only injuries not 100% are shown
const Injury = React.createClass<any, any>({
  getInitialState: function() {
    return {
      healthWidth: 0,
    };
  },
  componentDidMount: function() {
    // get runtime widths of the health and stamina bars.
    this.setState({
      healthWidth: this.refs.injuryText.getDOMNode().offsetWidth,
    });
  },
  render: function() {
    const injury = this.props.injury;
    const width = injury.maxHealth ? (injury.health / injury.maxHealth) * this.state.healthWidth : 0;
    return (
      <div id={"injury-" + injury.part} className="cse-injury">
        <InjuryLocation part={injury.part}/>
        <InjuryBar width={width}/>
        <InjuryText ref="injuryText" health={injury.health} maxHealth={injury.maxHealth}/>
        <InjuryWounds wounds={injury.wounds}/>
      </div>
    );
  }
});

export default Injury;
