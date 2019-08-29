/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { Chat } from 'cushared/components/Chat';
import { StartScreen } from './StartScreen';
import { ChampionSelect } from './ChampionSelect';
import { LoadingScreen } from './LoadingScreen';
import { Button } from './Button';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../images/fullscreen/tempbg.png);
  background-size: cover;
`;

const HideButton = styled.div`
  position: fixed;
  bottom: 300px;
  left: 5px;
  cursor: pointer;
  z-index: 10;
`;

const ChatPosition = styled.div`
  position: fixed;
  left: 0px;
  bottom: 50px;
  width: 480px;
  height: 240px;
`;

export enum Route {
  Start,
  ChampionSelect,
  Loading,
}

export interface Props {
}

export interface State {
  isVisible: boolean;
  currentRoute: Route;
}

export class FullScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: true,
      currentRoute: Route.Start,
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container>
        {this.renderRoute()}
        <HideButton onClick={this.hide}>
          <Button type='blue' text='Hide Full Screen UI' />
        </HideButton>
        {this.state.currentRoute !== Route.Loading &&
          <ChatPosition>
            <Chat accessToken={game.accessToken} />
          </ChatPosition>
        }
      </Container>
    ) : null
  }

  public componentDidMount() {

  }

  private renderRoute = () => {
    switch (this.state.currentRoute) {
      case Route.Start: {
        return (
          <StartScreen onReady={this.onReady} />
        );
      };
      case Route.ChampionSelect: {
        return (
          <ChampionSelect gameMode={'Survival'} difficulty={'Normal'} onLockIn={this.onLockIn} />
        );
      };
      case Route.Loading: {
        return (
          <LoadingScreen loadingDuration={3000} onFinishLoading={this.onFinishLoading} />
        );
      }
    }
  }


  private hide = () => {
    this.setState({ isVisible: false });
  }

  private onReady = () => {
    this.setState({ currentRoute: Route.ChampionSelect });
  }

  private onLockIn = () => {
    this.setState({ currentRoute: Route.Loading });
  }

  private onFinishLoading = () => {
    this.setState({ currentRoute: Route.Start, isVisible: false });
  }
}
