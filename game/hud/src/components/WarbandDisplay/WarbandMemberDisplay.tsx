/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { GroupMemberState } from '@csegames/camelot-unchained/lib/webAPI/definitions';
import styled from 'react-emotion';
import { client } from '@csegames/camelot-unchained';

import HealthBar from '../HealthBar';
import { showFriendlyTargetContextMenu } from 'actions/contextMenu';

const Container = styled('div')`
  margin-bottom: 10px;
  pointer-events: all;
`;

export interface WarbandMemberDisplayProps {
  key: string | number;
  member: GroupMemberState;
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
      <Container
        key={this.props.member.id}
        onClick={this.onClickContainer}
        onContextMenu={this.handleContextMenu}>
        <HealthBar type='mini' playerState={this.props.member} />
      </Container>
    );
  }

  private onClickContainer = (event: MouseEvent) => {
    // if right click, return
    if (event.button === 2) return;

    event.preventDefault();
    client.RequestFriendlyTargetEntityID(this.props.member.id);
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    showFriendlyTargetContextMenu(this.props.member, event);
  }
}

export default WarbandMemberDisplay;
