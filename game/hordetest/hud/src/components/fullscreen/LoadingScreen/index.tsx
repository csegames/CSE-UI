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

const LoadingAnimIconPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 75px;
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
}

export interface State {
  loadingState: LoadingState;
}

export class LoadingScreen extends React.Component<Props, State> {
  private loadingStateHandle: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: null,
    };
  }

  public render() {
    return this.state.loadingState && this.state.loadingState.visible ? (
      <Container>
        <Logo />
        <LoadingAnimIconPosition>
          <LoadingAnimIcon />
        </LoadingAnimIconPosition>
        <LoadingText>{this.state.loadingState.message}</LoadingText>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.loadingStateHandle = game.loadingState.onUpdated(() => {
      this.setState({ loadingState: game.loadingState });
    });
  }

  public componentWillUnmount() {
    this.loadingStateHandle.clear();
    this.loadingStateHandle = null;
  }
}
