/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { WarbandContext, WarbandContextState } from 'components/context/WarbandContext';
import { UnitFrame } from '../UnitFrame';
import { showFriendlyTargetContextMenu } from 'actions/contextMenu';

const Container = styled.div`
  position:relative;
  margin-bottom: 10px;
  pointer-events: all;
  flex: 0 1 auto;
  min-height:0px;
`;

interface InjectedProps {
  warbandContext: WarbandContextState;
}

export interface WarbandMemberDisplayProps {
  key: string | number;
  member: GroupMemberState;
  isMini?: boolean;
}

export interface WarbandMemberDisplayState {
}

class WarbandMemberDisplayWithInjectedContext extends React.Component<WarbandMemberDisplayProps & InjectedProps, WarbandMemberDisplayState> {
  constructor(props: WarbandMemberDisplayProps & InjectedProps) {
    super(props);
  }

  public render() {
    if (!this.props.member) return null;
    return (
      <UIContext.Consumer>
        {uiContext => 
          <Container style={{height: uiContext.isUHD() ? "101px" : "51px"}}
            key={this.props.member.entityID}
            onClick={this.onClickContainer}
            onMouseDown={this.handleContextMenu}
            className='warbandMemberDisplay_Container'>
            <UnitFrame entityState={this.props.member as any} warband leader={this.props.member.isLeader} />
          </Container>
        }
      </UIContext.Consumer>
    );
  }

  private onClickContainer = (event: React.MouseEvent) => {
    // if right click, return
    if (event.button === 2) return;

    event.preventDefault();
    camelotunchained.game.selfPlayerState.requestFriendlyTarget(this.props.member.entityID);
  }

  private handleContextMenu = (event: React.MouseEvent) => {
    if (event.button === 2) {
      showFriendlyTargetContextMenu(this.props.member, this.props.warbandContext, event);
    }
  }
}

export function WarbandMemberDisplay(props: WarbandMemberDisplayProps) {
  const warbandContext = useContext(WarbandContext);

  return (
    <WarbandMemberDisplayWithInjectedContext {...props} warbandContext={warbandContext} />
  );
}
