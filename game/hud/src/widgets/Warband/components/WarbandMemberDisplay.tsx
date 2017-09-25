/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { WarbandMember } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import PlayerStatusComponent from '../../../components/PlayerStatusComponent';

export interface Style extends StyleDeclaration {
  WarbandMemberDisplay: React.CSSProperties;
}

export const defaultStyle: Style = {
  WarbandMemberDisplay: {
    width: '200px',
    marginBottom: '10px',
    pointerEvents: 'all',
  },
};

export interface WarbandMemberDisplayProps {
  key: string | number;
  member: WarbandMember;
  isMini?: boolean;
}

export interface WarbandMemberDisplayState {
}

class WarbandMemberDisplay extends React.Component<WarbandMemberDisplayProps, WarbandMemberDisplayState> {

  constructor(props: WarbandMemberDisplayProps) {
    super(props);
  }

  public render() {
    const style = StyleSheet.create(defaultStyle);
    const leader = false; // this.props.member.rank == warbandRanks.LEADER;
    return (
      <div className={css(style.WarbandMemberDisplay)}>
        <PlayerStatusComponent
          containerClass='WarbandMemberDisplay__Health'
          playerStatus={this.props.member as any}
          isLeader={leader} events={[]}
        />
      </div>
    );
  }
}

export default WarbandMemberDisplay;
