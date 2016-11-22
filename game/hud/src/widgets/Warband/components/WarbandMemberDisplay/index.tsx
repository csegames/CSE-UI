/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {WarbandMember, warbandRanks} from 'camelot-unchained';

import PlayerStatusComponent from '../../../../components/PlayerStatusComponent';
import {PlayerStatus, BodyParts} from '../../../../lib/PlayerStatus';

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

  renderMembers = () => {
  }

  render() {
    const mini = this.props.isMini || false;
    const leader = this.props.member.rank == warbandRanks.LEADER;

    return (
      <div key={this.props.key} className={`WarbandMemberDisplay ${mini ? 'mini': ''} ${this.props.containerClass}`}>
        <PlayerStatusComponent containerClass='WarbandMemberDisplay__Health' playerStatus={this.props.member} isLeader={leader} events={[]}/>
      </div>
    )
  }
}

export default WarbandMemberDisplay;
