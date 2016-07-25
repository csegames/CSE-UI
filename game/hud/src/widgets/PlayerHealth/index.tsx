/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {WarbandMember, archetype} from 'camelot-unchained';

import PlayerStatusBar, {PlayerStatusStyle} from '../../components/PlayerStatusBar';

export interface TargetHealthProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface TargetHealthState {
}

class TargetHealth extends React.Component<TargetHealthProps, TargetHealthState> {

  constructor(props: TargetHealthProps) {
    super(props);
  }

  render() {

    const mini = this.props.isMini || false;

    let bar:any = null;
    if (mini) {
      bar = <PlayerStatusBar containerClass='PlayerHealth__bar--mini'
                         style={PlayerStatusStyle.MiniSelf}
                         playerStatus={null}/>;
    } else {
      bar = <PlayerStatusBar containerClass='PlayerHealth__bar'
                         style={PlayerStatusStyle.FullSelf}
                         playerStatus={null}/>;
    } 

    return (
      <div className={`player-health ${this.props.containerClass}`}>
        {bar}
      </div>
    )
  }
}

export default TargetHealth;
