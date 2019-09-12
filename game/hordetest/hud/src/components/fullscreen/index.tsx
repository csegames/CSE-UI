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
import { Button } from './Button';
import { RightModal } from './RightModal';
import { GameStats } from './GameStats';

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

const OpenFullScreenButton = styled.div`
  position: fixed;
  top: 5px;
  left: 90px;
  pointer-events: all;
  cursor: pointer;
  color: white;
  background-color: orange;
  padding: 5px;

  &:hover {
    filter: brightness(110%);
  }
`;

export enum Route {
  Start,
  ChampionSelect,
  EndGameStats,
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
      isVisible: false,
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
        <ChatPosition>
          <Chat accessToken={game.accessToken} />
        </ChatPosition>
        <RightModal />
      </Container>
    ) : <OpenFullScreenButton onClick={this.show}>Open Full Screen</OpenFullScreenButton>
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
      case Route.EndGameStats: {
        return (
          <GameStats onLeaveClick={this.onLeaveGameStats} />
        );
      }
    }
  }

  private show = () => {
    this.setState({ isVisible: true });
  }

  private hide = () => {
    this.setState({ isVisible: false });
  }

  private onReady = () => {
    this.setState({ currentRoute: Route.ChampionSelect });
  }

  private onLockIn = () => {
    this.setState({ currentRoute: Route.EndGameStats });
  }

  private onLeaveGameStats = () => {
    this.setState({ currentRoute: Route.Start });
  }
}
