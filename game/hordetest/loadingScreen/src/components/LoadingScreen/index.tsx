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
  background-image: url(../images/bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: black;
`;

const LoadingTextPosition = styled.div`
  position: fixed;
  right: 20px;
  bottom: 10px;
  display: flex;
  align-items: center;
  opacity: 0;

  &.animate {
    animation: fadeIn 0.5s forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
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
  playTransitionAnimation: boolean;
}

export class LoadingScreen extends React.Component<Props, State> {
  private loadingStateHandle: EventHandle;
  private preloadAssetsTimeout: number;
  private readyStateTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: null,
      playTransitionAnimation: true,
    };
  }

  public render() {
    return this.state.loadingState && this.state.loadingState.visible ? (
      <Container>
        <LoadingTextPosition className={this.state.playTransitionAnimation ? 'animate' : ''}>
          <Text>{this.state.loadingState.message}</Text>

          <LoadingAnimIcon />
        </LoadingTextPosition>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.handleReadyState();
    this.loadingStateHandle = game.loadingState.onUpdated(() => {
      this.setState({ loadingState: game.loadingState });
    });
  }

  public componentWillUnmount() {
    this.loadingStateHandle.clear();
    this.loadingStateHandle = null;

    window.clearTimeout(this.preloadAssetsTimeout);
    window.clearTimeout(this.readyStateTimeout);
  }

  private handleReadyState = () => {
    this.preloadAssetsTimeout = window.setTimeout(() => {
      this.setState({ playTransitionAnimation: false });
    }, 1000);

    this.readyStateTimeout = window.setTimeout(() => {
      engine.trigger('OnReadyForDisplay');
      this.setState({ playTransitionAnimation: true });
    }, 3000);
  }
}
