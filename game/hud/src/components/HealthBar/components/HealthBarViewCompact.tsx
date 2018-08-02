/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Faction, PlayerState, GroupMemberState } from '@csegames/camelot-unchained';

import { getFaction, getBodyPartsCurrentHealth } from '../lib/healthFunctions';
import { isEqualPlayerState } from 'lib/playerStateEqual';
import { BodyParts } from 'lib/PlayerStatus';
import ClassIndicator from './ClassIndicator';
import SmallBar from './SmallBar';
import BigBar from './BigBar';
import StaminaBar from './StaminaBar';
import BloodBall from './BloodBall';
import HealthSlideOut from './HealthSlideOut';
import Status from './Status';

const Container = styled('div')`
  position: relative;
  height: 301px;
  width: 506px;
  -webkit-animation: ${(props: any) => props.shouldShake ? 'shake-hard 0.15s forwards' : ''}
  animation: ${(props: any) => props.shouldShake ? 'shake-hard 0.15s forwards' : ''}
  filter: ${(props: any) => props.isAlive ? 'grayscale(0%)' : 'grayscale(100%)'};
  -webkit-filter: ${(props: any) => props.isAlive ? 'grayscale(0%)' : 'grayscale(100%)'};
`;

const NameContainer = styled('div')`
  position: absolute;
  top: 7px;
  left: 187px;
  display: flex;
  align-items: center;
  height: 79px;
  width: 505px;
  background: url(images/healthbar/regular/name-bg.png) no-repeat;
  background-size: contain;
  z-index: -1;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 79px;
    width: 505px;
    background: linear-gradient(to right, ${(props: any) => props.factionColor}, transparent 60%);
    opacity: 0.4;
    z-index: -1;
  }
`;

const Name = styled('div')`
  color: white;
  max-width: 375px;
  font-size: 32px;
  line-height: 32px;
  margin-left: 50px;
  overflow: hidden;
  word-wrap: break-word;
  text-shadow: 1px 1px #000;
`;

const ContainerOverlay = styled('div')`
  position: absolute;
  background: url(images/healthbar/regular/main_frame_compact.png);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const LeaderContainerOverlay = styled('div')`
  position: absolute;
  background: url(images/healthbar/regular/main-frame-compact-crown.png);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const HealthPillsContainer = styled('div')`
  position: absolute;
  top: 87px;
  left: 163px;
  width: 333px;
  height: 185px;
  pointer-events: all;
  cursor: pointer;
`;

export interface HealthBarViewProps {
  shouldShake: boolean;
  playerState: PlayerState | GroupMemberState;
}

export interface HealthBarViewState {
  mouseOver: boolean;
}

class HealthBarView extends React.Component<HealthBarViewProps, HealthBarViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseOver: false,
    };
  }

  public render() {
    const { playerState } = this.props;
    const factionColor = {
      [Faction.Arthurian]: '#581212',
      [Faction.Viking]: '#1B3A50',
      [Faction.TDD]: '#404515',
    };
    const faction = getFaction(playerState);
    return (
      <Container shouldShake={this.props.shouldShake} isAlive={this.props.playerState.isAlive}>
        <NameContainer factionColor={factionColor[faction]}>
          <Name>{this.props.playerState.name}</Name>
        </NameContainer>
        <ClassIndicator scale={1} top={15} left={140} width={75} height={75} borderRadius={37.5} faction={faction} />
        <BloodBall playerState={playerState} />
        <Status statuses={playerState ? playerState.statuses as any : null} />
        <HealthSlideOut
          isVisible={this.state.mouseOver}
          right={this.state.mouseOver ? -50 : -20}
          valueOpacity={this.state.mouseOver ? 1 : 0}
          height={208}
          currentStamina={playerState.stamina.current}
          bodyPartsCurrentHealth={getBodyPartsCurrentHealth(playerState)}
        />
        <HealthPillsContainer onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
          <SmallBar height={22} scale={1} bodyPart={BodyParts.RightArm} playerState={playerState} />
          <SmallBar height={22} scale={1} bodyPart={BodyParts.LeftArm} playerState={playerState} />
          <BigBar left={5} height={41} scale={1} bodyPart={BodyParts.Head} playerState={playerState} />
          <BigBar left={5} height={41} scale={1} bodyPart={BodyParts.Torso} playerState={playerState} />
          <SmallBar height={22} scale={1} bodyPart={BodyParts.RightLeg} playerState={playerState} />
          <SmallBar height={22} scale={1} bodyPart={BodyParts.LeftLeg} playerState={playerState} />
          <StaminaBar playerState={playerState} />
        </HealthPillsContainer>
        {
          (this.props.playerState as GroupMemberState).isLeader ? <LeaderContainerOverlay /> : <ContainerOverlay />
        }
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: HealthBarViewProps, nextState: HealthBarViewState) {
    return !isEqualPlayerState(nextProps.playerState, this.props.playerState) ||
      nextState.mouseOver !== this.state.mouseOver;
  }

  private handleMouseOver = () => {
    this.setState({ mouseOver: true });
  }

  private handleMouseOut = () => {
    this.setState({ mouseOver: false });
  }
}

export default HealthBarView;
