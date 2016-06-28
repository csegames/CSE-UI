/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype} from 'camelot-unchained';

import PlayerStatusBar, {PlayerStatusStyle} from '../../components/PlayerStatusBar';

export interface PlayerHealthProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface PlayerHealthState {
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {

  constructor(props: PlayerHealthProps) {
    super(props);
  }

  render() {
    
    var player = new Player();
    player.archetype = archetype.BLACKGUARD;

    const mini = this.props.isMini || false;

    let bar:any = null;
    if (mini) {
      bar = <PlayerStatusBar containerClass='TargetHealth__bar mini'
                         style={PlayerStatusStyle.MiniTarget}
                         player={player}/>;
    } else {
      bar = <PlayerStatusBar containerClass='TargetHealth__bar'
                         style={PlayerStatusStyle.FullTarget}
                         player={player}/>;
    } 

    return (
      <div className={`TargetHealth ${mini ? 'mini': ''} ${this.props.containerClass}`}>
        {bar}
      </div>
    )
  }
}

export default PlayerHealth;
