/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { PlayerState, GroupMemberState } from '@csegames/camelot-unchained';

import { isEqualPlayerState } from 'lib/playerStateEqual';
import { BodyParts } from 'lib/PlayerStatus';
import { getBloodPercent, getStaminaPercent, getFaction, getBodyPartsCurrentHealth } from '../lib/healthFunctions';
import ClassIndicator from './ClassIndicator';
import SmallBar from './SmallBar';
import BigBar from './BigBar';
import HealthSlideOut from './HealthSlideOut';
import Status from './Status';

const Container = styled('div')`
  position: relative;
  height: 301px;
  width: 623px;
  -webkit-animation: ${(props: any) => props.shouldShake ? 'shake-hard 0.15s forwards' : ''}
  animation: ${(props: any) => props.shouldShake ? 'shake-hard 0.15s forwards' : ''}
  filter: ${(props: any) => props.isAlive ? 'grayscale(0%)' : 'grayscale(100%)'};
  -webkit-filter: ${(props: any) => props.isAlive ? 'grayscale(0%)' : 'grayscale(100%)'};
`;

const ContentContainer = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  left: 118px;
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
`;

const Name = styled('div')`
  color: white;
  max-width: 375px;
  font-size: 32px;
  line-height: 32px;
  margin-left: 50px;
  overflow: hidden;
  word-wrap: break-word;
`;

const ContainerOverlay = styled('div')`
  position: absolute;
  background: url(images/healthbar/regular/main_frame.png);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const BloodBall = styled('div')`
  position: absolute;
  left: 30px;
  bottom: 25px;
  width: 105px;
  height: 105px;
  border-radius: 52.5px;
  background: #440000;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 52.5px;
    background: #E30000;
    -webkit-mask-image: linear-gradient(to top, black ${(props: any) => props.percent.toFixed(1)}%,
      transparent ${(props: any) => props.percent.toFixed(1)}%);
    -webkit-mask-size: 100% 100%;
  }
`;

// const BloodCount = styled('div')`
//   position: absolute;
//   left: 15px;
//   bottom: -20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   width: 76px;
//   height: 22px;
//   background: url(images/healthbar/regular/blood_number.png);
//   z-index: 10;
// `;

const HealthPillsContainer = styled('div')`
  position: absolute;
  top: 87px;
  left: 163px;
  width: 333px;
  height: 185px;
  pointer-events: all;
  cursor: pointer;
`;

const StaminaBar = styled('div')`
  position: relative;
  width: 104%;
  height: 15px;
  left: -25px;
  background: linear-gradient(to top, #303030, #1D1D1D);
  -webkit-mask-image: url(images/healthbar/regular/stamina_mask.png);
  -webkit-mask-size: 100% 100%;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: ${(props: any) => props.percent}%;
    transition: width 0.1s;
    -webkit-transition: width 0.1s;
    height: 100%;
    background: linear-gradient(to top, #C2FFC8, #4CB856);
  }
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
    const bloodPercent = getBloodPercent(playerState);
    const staminaPercent = getStaminaPercent(playerState);
    const faction = getFaction(playerState);
    return (
      <Container
      shouldShake={this.props.shouldShake}
      isAlive={playerState.isAlive}>
        <ContentContainer>
          <NameContainer>
            <Name>{playerState.name}</Name>
          </NameContainer>
          <ClassIndicator scale={1} top={15} left={140} width={70} height={70} borderRadius={35} faction={faction} />
          <BloodBall percent={bloodPercent}>
            {/* <BloodCount>{this.props.currentBlood}</BloodCount> */}
          </BloodBall>
          <Status statuses={playerState ? playerState.statuses as any : null} />
          <HealthSlideOut
            isVisible={this.state.mouseOver}
            valueOpacity={this.state.mouseOver ? 1 : 0}
            right={this.state.mouseOver ? 70 : 100}
            height={208}
            currentStamina={playerState.stamina.current}
            bodyPartsCurrentHealth={getBodyPartsCurrentHealth(playerState)}
          />
          <HealthPillsContainer onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
            <SmallBar height={21} scale={1} bodyPart={BodyParts.RightArm} playerState={playerState} />
            <SmallBar height={21} scale={1} bodyPart={BodyParts.LeftArm} playerState={playerState} />
            <BigBar left={5} height={41} scale={1} bodyPart={BodyParts.Head} playerState={playerState} />
            <BigBar left={5} height={41} scale={1} bodyPart={BodyParts.Torso} playerState={playerState} />
            <SmallBar height={21} scale={1} bodyPart={BodyParts.RightLeg} playerState={playerState} />
            <SmallBar height={21} scale={1} bodyPart={BodyParts.LeftLeg} playerState={playerState} />
            <StaminaBar percent={staminaPercent} />
          </HealthPillsContainer>
        </ContentContainer>
        <ContainerOverlay />
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: HealthBarViewProps, nextState: HealthBarViewState) {
    return !isEqualPlayerState(this.props.playerState, nextProps.playerState) ||
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
