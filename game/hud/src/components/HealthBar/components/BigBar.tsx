/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import { BodyParts } from 'lib/PlayerStatus';
import { getHealthPercent, getWoundsForBodyPart } from '../lib/healthFunctions';
import { PlayerState } from 'components/HealthBar';

const Container = styled('div')`
  position: relative;
  left: ${(props: any) => props.left.toFixed(1)}px;
  width: 100%;
  height: ${(props: any) => props.height.toFixed(1)}px;
  margin-bottom: ${({ scale }: { scale: number }) => (3 * scale).toFixed(1)}px;
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
  box-shadow: inset 0 0 ${({ scale }: {scale: number}) => (2 * scale).toFixed(1)}px rgba(0,0,0,0.8);
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
  box-shadow: inset 0 0 ${({ scale }: {scale: number}) => (5 * scale).toFixed(1)}px #3693FF;
`;

const WoundContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: ${({ scale }: {scale: number}) => (5 * scale).toFixed(1)}px;
  right: 0;
  bottom: 0;
  left: ${({ scale }: {scale: number}) => (-1 * scale).toFixed(1)}px;
  z-index: 10;
`;

const WoundPill = styled('div')`
  width: ${({ scale }: {scale: number}) => (111 * scale).toFixed(1)}px;
  height: ${({ scale }: {scale: number}) => (44 * scale).toFixed(1)}px;
  background: url(images/healthbar/regular/large_lock.png);
  background-size: contain;
`;

export interface BigBarProps {
  left: number;
  height: number;
  bodyPart: BodyParts;
  playerState: PlayerState;
  scale: number;
}

export interface BigBarState {
}

class BigBar extends React.Component<BigBarProps, BigBarState> {
  public render() {
    const healthPercent = getHealthPercent(this.props.playerState, this.props.bodyPart);
    const wounds = getWoundsForBodyPart(this.props.playerState, this.props.bodyPart);
    return (
      <Container height={this.props.height} left={this.props.left} scale={this.props.scale}>
        <BarContainer scale={this.props.scale}>
          <Bar style={{ width: healthPercent + '%' }} scale={this.props.scale}/>
        </BarContainer>
        {wounds > 0 ?
          <WoundContainer scale={this.props.scale}>
            <WoundPill scale={this.props.scale}/>
            {wounds >= 2 && <WoundPill scale={this.props.scale}/>}
            {!this.props.playerState.isAlive && wounds >= 2 && <WoundPill scale={this.props.scale}/>}
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
