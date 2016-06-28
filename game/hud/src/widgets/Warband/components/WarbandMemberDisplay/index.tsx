/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype, WarbandMember, WarbandMemberRank} from 'camelot-unchained';

import PlayerStatusBar, {PlayerStatusStyle} from '../../../../components/PlayerStatusBar';

export interface WarbandMemberDisplayProps {
  key: string | number;
  member: WarbandMember;
  containerClass?: string;
  isMini?: boolean;
}

export interface WarbandMemberDisplayState {
}

class WarbandMemberDisplay extends React.Component<WarbandMemberDisplayProps, WarbandMemberDisplayState> {

  constructor(props: WarbandMemberDisplayProps) {
    super(props);
  }

  render() {
    const mini = this.props.isMini || false;
    const leader = this.props.member.rank == WarbandMemberRank.Leader;

    let bar:any = null;
    if (mini) {
      bar = <PlayerStatusBar containerClass='WarbandMemberDisplayHealth__bar mini'
                         style={PlayerStatusStyle.MiniParty}
                         playerStatus={this.props.member}
                         isLeader={leader} />;
    } else {
      bar = <PlayerStatusBar containerClass='WarbandMemberDisplayHealth__bar'
                         style={PlayerStatusStyle.FullParty}
                         playerStatus={this.props.member}
                         isLeader={leader} />;
    } 

    return (
      <div key={this.props.key} className={`WarbandMemberDisplay ${mini ? 'mini': ''} ${this.props.containerClass}`}>
        {bar}
      </div>
    )
  }
}

export default WarbandMemberDisplay;
