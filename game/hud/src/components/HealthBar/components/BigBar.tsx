/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils, PlayerState } from '@csegames/camelot-unchained';
import { BodyParts } from '../../../lib/PlayerStatus';
import { getHealthPercent, getWoundsForBodyPart } from '../lib/healthFunctions';

const Container = styled('div')`
  position: relative;
  left: ${(props: any) => props.left}px;
  width: 100%;
  height: ${(props: any) => props.height}px;
  margin-bottom: 5px;
`;

const BarContainer = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #303030, #1D1D1D);
  box-shadow: inset 0 0 2px rgba(0,0,0,0.8);
  -webkit-transition: width 0.2s;
`;

const Bar = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to bottom, #0068FF, #104489);
  box-shadow: inset 0 0 5px #3693FF;
`;

const WoundContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: 5px;
  right: 0;
  bottom: 0;
  left: -1px;
  z-index: 10;
`;

const WoundPill = styled('div')`
  width: 111px;
  height: 44px;
  background: url(images/healthbar/regular/large_lock.png);
`;

export interface BigBarProps {
  left: number;
  height: number;
  bodyPart: BodyParts;
  playerState: PlayerState;
}

export interface BigBarState {
}

class BigBar extends React.Component<BigBarProps, BigBarState> {
  public render() {
    const healthPercent = getHealthPercent(this.props.playerState, this.props.bodyPart);
    const wounds = getWoundsForBodyPart(this.props.playerState, this.props.bodyPart);
    return (
      <Container height={this.props.height} left={this.props.left}>
        <BarContainer>
          <Bar style={{ width: healthPercent + '%' }} />
        </BarContainer>
        {wounds > 0 ?
          <WoundContainer>
            <WoundPill />
            {wounds >= 2 && <WoundPill />}
            {!this.props.playerState.isAlive && wounds >= 2 && <WoundPill />}
          </WoundContainer> : null
        }
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: BigBarProps, nextState: BigBarState) {
    return !utils.numEqualsCloseEnough(
      getHealthPercent(nextProps.playerState, this.props.bodyPart),
      getHealthPercent(this.props.playerState, this.props.bodyPart)) ||

      // Check wounds
      getWoundsForBodyPart(nextProps.playerState, this.props.bodyPart) !==
      getWoundsForBodyPart(this.props.playerState, this.props.bodyPart) ||

      // Check isAlive
      nextProps.playerState.isAlive !== this.props.playerState.isAlive;
  }
}

export default BigBar;
