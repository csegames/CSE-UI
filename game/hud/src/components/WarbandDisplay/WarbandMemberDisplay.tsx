/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { WarbandMember } from '@csegames/camelot-unchained/lib/webAPI/definitions';
import styled from 'react-emotion';

import HealthBar from '../HealthBar';

const Container = styled('div')`
  margin-bottom: 10px;
  pointer-events: all;
`;

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
    if (!this.props.member) return null;
    return (
      <Container key={this.props.member.characterID}>
        <HealthBar type='mini' playerState={this.props.member as any} />
      </Container>
    );
  }
}

export default WarbandMemberDisplay;
