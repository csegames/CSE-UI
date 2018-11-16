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

const Container = styled('div')`
  position: relative;
  left: ${({ scale }: {scale: number}) => (-5 * scale).toFixed(1)}px;
  width: 100%;
  height: ${(props: any) => props.height}px;
  margin-bottom: ${({ scale }: {scale: number}) => (3 * scale).toFixed(1)}px;
`;

const BarContainer = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
  background: linear-gradient(to bottom, #00A4F1, #00A4F1);
  box-shadow: inset 0 0 ${({ scale }: {scale: number}) => (5 * scale).toFixed(1)}px #4AD8FF;

  &.isDead {
    background: #555;
  }
`;

const WoundContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: ${({ scale }: {scale: number}) => (5 * scale).toFixed(1)}px;
  right: 0;
  bottom: 0;
  left: ${({ scale }: {scale: number}) => (14 * scale).toFixed(1)}px;
  z-index: 10;
`;

const WoundPill = styled('div')`
  width: ${({ scale }: {scale: number}) => (104 * scale).toFixed(1)}px;
  height: ${({ scale }: {scale: number}) => (17 * scale).toFixed(1)}px;
  background: url(images/healthbar/regular/small_lock.png);
  background-size: contain;
`;

export interface SmallBarProps {
  height: number;
  bodyPart: BodyParts;
  playerState: Player;
  scale: number;
}

export interface SmallBarState {
}

class SmallBar extends React.Component<SmallBarProps, SmallBarState> {
  private healthPercentCache: number;
  public render() {
    const { playerState, bodyPart } = this.props;
    const healthPercent = getHealthPercent(playerState, bodyPart);
    const wounds = getWoundsForBodyPart(playerState, bodyPart);
    return (
      <Container height={this.props.height} scale={this.props.scale}>
        <BarContainer scale={this.props.scale}>
          <Bar
            style={{ width: healthPercent + '%' }}
            scale={this.props.scale}
            className={!playerState.isAlive ? 'isDead' : ''}
          />
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

  public shouldComponentUpdate(nextProps: SmallBarProps, nextState: SmallBarState) {
    return !this.healthPercentCache ||
      !getHealthPercent(nextProps.playerState, this.props.bodyPart).floatEquals(this.healthPercentCache) ||

      // Check wounds
      getWoundsForBodyPart(nextProps.playerState, this.props.bodyPart) !==
      getWoundsForBodyPart(this.props.playerState, this.props.bodyPart) ||

      // Check isAlive
      nextProps.playerState.isAlive !== this.props.playerState.isAlive;
  }

  public componentDidUpdate() {
    this.healthPercentCache = getHealthPercent(this.props.playerState, this.props.bodyPart);
  }
}

export default SmallBar;
