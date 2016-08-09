/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype, race, gender, WarbandMember, WarbandMemberRank} from 'camelot-unchained';

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

function fakePlayer(): PlayerStatus {
  return {
    name: 'CSE-JB-Party',
    avatar: 'http://camelotunchained.com/upload/jb.png',
    race: race.HUMANMALEV,
    gender: gender.MALE,
    archetype: archetype.WINTERSSHADOW,
    characterID: '',
    health: [{
      current: 10000,
      maximum: 10000
    },{
      current: 10000,
      maximum: 10000
    },{
      current: 10000,
      maximum: 10000
    },{
      current: 10000,
      maximum: 10000
    },{
      current: 10000,
      maximum: 10000
    },{
      current: 10000,
      maximum: 10000
    }],
    stamina: {
      current: 1000,
      maximum: 2000
    },
    wounds: [0, 0, 0, 0, 0, 0],
    blood: {
      current: 15000,
      maximum: 15000
    },
    panic: {
      current: 1,
      maximum: 3
    },
    temperature: {
      current: 50,
      freezingThreshold: 0,
      burningThreshold: 100
    }
  }
}

class WarbandMemberDisplay extends React.Component<WarbandMemberDisplayProps, WarbandMemberDisplayState> {

  constructor(props: WarbandMemberDisplayProps) {
    super(props);
  }

  renderMembers = () => {
  }

  render() {
    const mini = this.props.isMini || false;
    const leader = this.props.member.rank == WarbandMemberRank.Leader;

    return (
      <div key={this.props.key} className={`WarbandMemberDisplay ${mini ? 'mini': ''} ${this.props.containerClass}`}>
        <PlayerStatusComponent containerClass='WarbandMemberDisplay__Health' playerStatus={this.props.member} events={[]}/>
      </div>
    )
  }
}

export default WarbandMemberDisplay;
