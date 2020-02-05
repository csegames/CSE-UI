/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { LoadingAnimIcon } from './LoadingAnimIcon';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/fullscreen/loadingscreen/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-color: black;
`;

const Logo = styled.div`
  position: fixed;
  left: 60px;
  bottom: 32px;
  width: 252px;
  height: 66px;
  background-image: url(../images/fullscreen/loadingscreen/logo.png);
  background-size: contain;
  background-repeat: no-repeat;
`;

const LoadingTextPosition = styled.div`
  position: fixed;
  right: 20px;
  bottom: 10px;
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  width: fit-content;
  text-align: right;
  font-size: 17px;
  color: white;
  font-family: Colus;
  margin-right: 30px;
`;

export interface Props {
}

export interface State {
  loadingState: LoadingState;
  forceMessage: string | null;
}

export class LoadingScreen extends React.Component<Props, State> {
  private loadingStateHandle: EventHandle;
  private forceShowScreen: EventHandle;
  private forceHideScreen: EventHandle;
  private currentForcedScreenContinuationHandle: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: null,
      forceMessage: null,
    };
  }

  public render() {
    return (this.state.loadingState && this.state.loadingState.visible) || this.state.forceMessage ? (
      <Container>
        <Logo />
        <LoadingTextPosition>
          {this.state.forceMessage ?
          <Text>{this.state.forceMessage}</Text>
          :
          <Text>{this.state.loadingState.message}</Text>
          }
          <LoadingAnimIcon />
        </LoadingTextPosition>
      </Container>
    ) : null;
  }

  private clearForcedScreenContinuation() {
    if (this.currentForcedScreenContinuationHandle) {
      clearTimeout(this.currentForcedScreenContinuationHandle);
      this.currentForcedScreenContinuationHandle = null;
    }
  }

  public componentDidMount() {
    this.forceShowScreen = game.on('forceshow-loadingscreen', (message:string, delay:number, continuation:Function) => {
      console.log(`Forcing loading screen to show with ${message}`);
      this.setState({forceMessage: message})
      this.clearForcedScreenContinuation();
      this.currentForcedScreenContinuationHandle = setTimeout(continuation, delay);
    });

    this.forceHideScreen = game.on("clearforceshow-loadingscreen", () => { 
      console.log("Removing forced loading screen msg");
      this.setState({forceMessage: null})
      this.clearForcedScreenContinuation();
    })

    this.loadingStateHandle = game.loadingState.onUpdated(() => {
      this.setState({ loadingState: game.loadingState, forceMessage: null }, () => {
        console.log(`Explicit loading screen update: ${this.state.loadingState.message}`);
      });
      this.clearForcedScreenContinuation();
    });
  }

  public componentWillUnmount() {
    this.forceShowScreen.clear();
    this.forceShowScreen = null;

    this.forceHideScreen.clear();
    this.forceHideScreen = null;

    this.loadingStateHandle.clear();
    this.loadingStateHandle = null;

    this.clearForcedScreenContinuation();
  }
}
