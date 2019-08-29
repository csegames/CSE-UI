/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ResourceBar } from '../../shared/ResourceBar';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/fullscreen/loadingscreen/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
`;

const Logo = styled.div`
  position: fixed;
  left: 60px;
  bottom: 32px;
  width: 197px;
  height: 53px;
  background-image: url(../images/fullscreen/loadingscreen/temp-logo.png);
  background-size: contain;
`;

const LoadingBarContainer = styled.div`
  position: fixed;
  width: 40%;
  padding: 10px;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-image: url(../images/fullscreen/loadingscreen/loading-border.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingBarStyles = css`
  height: 15px;
`;

const LoadingText = styled.div`
  position: fixed;
  right: 60px;
  bottom: 32px;
  width: fit-content;
  text-align: right;
  font-size: 19px;
  color: white;
  font-family: Colus;
`;

export interface Props {
  // in miliseconds
  loadingDuration: number;
  onFinishLoading: () => void;
}

export interface State {
  currentPercentage: number;
}

export class LoadingScreen extends React.Component<Props, State> {
  private timerInterval: number;
  private timeElapsed: number;
  private lastCurrentTime: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPercentage: 0,
    };
  }

  public render() {
    return (
      <Container>
        <Logo />
        <LoadingBarContainer>
          <ResourceBar
            type='orange'
            containerStyles={LoadingBarStyles}
            current={this.state.currentPercentage}
            max={100}
          />
        </LoadingBarContainer>
        <LoadingText>Loading Text...</LoadingText>
      </Container>
    );
  }

  public componentDidMount() {
    this.startTimer();
  }

  private startTimer = () => {
    this.lastCurrentTime = Date.now();
    this.timeElapsed = 0;

    this.timerInterval = window.setInterval(this.handleTimer, 60);
  }

  private stopTimer = () => {
    window.clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.timeElapsed = null;
    this.lastCurrentTime = null;
  }

  private handleTimer = () => {
    const currentTime = Date.now();

    const lastUpdateTimeElapsed = currentTime - this.lastCurrentTime;
    this.timeElapsed += lastUpdateTimeElapsed;
    this.lastCurrentTime = currentTime;

    if (this.timeElapsed >= this.props.loadingDuration) {
      this.stopTimer();
      this.setState({ currentPercentage: 100 });
      this.props.onFinishLoading();
      return;
    }

    this.setState({ currentPercentage: (this.timeElapsed / this.props.loadingDuration) * 100 });
  }
}
