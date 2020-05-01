/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { InputContext, InputContextState } from 'context/InputContext';
import { MatchmakingContext, MatchmakingContextState } from 'context/MatchmakingContext';
import { LoadingButton } from '../LoadingButton';

const Container = styled.div`
`;

const LockInButton = css`
  font-size: 20px;
  padding: 10px 70px;
  font-family: Colus;
  outline: 1px solid rgba(255, 255, 255, 0.3);
  outline-offset: -5px;
`;

const LockInText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  margin-top: 0;
  font-size: 20px;
  line-height: 20px;
  font-family: Colus;
  color: white;
  text-align: center;
`;

const ConsoleButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ConsoleIcon = styled.span`
  font-size: 24px;
  margin-right: 5px;
  color: white;
`;

export interface ComponentProps {
  isLocked: boolean;
  onLockIn: () => void;
  onSelectionTimeOver: () => void;
}

interface Props extends ComponentProps {
  matchmakingContext: MatchmakingContextState;
  inputContext: InputContextState;
}

export interface State {
  timer: number;
  currentPercentage: number;
}

class LockInWithInjectedContext extends React.Component<Props, State> {
  private percentageInterval: number;
  private lastCurrentTime: number;
  private timeElapsed: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      timer: props.matchmakingContext.secondsToWait,
      currentPercentage: 100,
    };
  }

  public render() {
    return (
      <Container>
        {!this.props.inputContext.isConsole ?
          <LoadingButton
            disabled={this.props.isLocked}
            current={this.state.currentPercentage}
            max={100}
            styles={LockInButton}
            onClick={this.props.onLockIn}
            text={
              <ConsoleButton>
                <LockInText>Lock In</LockInText>
                <TextContainer>
                  0:{this.state.timer.toString().length === 1 ? `0${this.state.timer}` : this.state.timer}
                </TextContainer>
              </ConsoleButton>
            }
          /> :
          <LoadingButton
            disabled={this.props.isLocked}
            current={this.state.currentPercentage}
            max={100}
            styles={LockInButton}
            onClick={this.props.onLockIn}
            text={
              <ConsoleButton>
                <LockInText>
                  <ConsoleIcon className='icon-xb-a' /> Lock In
                </LockInText>
                <TextContainer>
                  0:{this.state.timer.toString().length === 1 ? `0${this.state.timer}` : this.state.timer}
                </TextContainer>
              </ConsoleButton>
            }
          />
        }
      </Container>
    );
  }

  public componentDidMount() {
    this.startBarTimer();
  }

  public componentWillUnmount() {
    this.stopBarTimer();
  }

  private startBarTimer = () => {
    this.lastCurrentTime = Date.now();
    this.timeElapsed = 0;

    this.percentageInterval = window.setInterval(this.handleBarTimer, 60);
  }

  private stopBarTimer = () => {
    window.clearInterval(this.percentageInterval);
    this.percentageInterval = null;
    this.timeElapsed = null;
    this.lastCurrentTime = null;
  }

  private handleBarTimer = () => {
    const currentTime = Date.now();

    const lastUpdateTimeElapsed = currentTime - this.lastCurrentTime;
    this.timeElapsed += lastUpdateTimeElapsed;
    this.lastCurrentTime = currentTime;

    const msToWait = this.props.matchmakingContext.secondsToWait * 1000;

    if (this.timeElapsed >= msToWait) {
      this.stopBarTimer();
      this.props.onSelectionTimeOver();
      this.setState({ timer: 0, currentPercentage: 0 });
      return;
    }

    this.setState({
      timer: this.props.matchmakingContext.secondsToWait - Math.round(this.timeElapsed / 1000),
      currentPercentage: 100 - (this.timeElapsed / msToWait) * 100,
    });
  }
}

export function LockIn(props: ComponentProps) {
  const matchmakingContext = useContext(MatchmakingContext);
  const inputContext = useContext(InputContext);

  return (
    <LockInWithInjectedContext
      {...props}
      matchmakingContext={matchmakingContext}
      inputContext={inputContext}
    />
  );
}
