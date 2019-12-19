/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

// import { Chat } from 'cushared/components/Chat';
import { StartScreen } from './StartScreen';
import { ChampionSelect } from './ChampionSelect';
import { Button } from './Button';
import { GameStats } from './GameStats';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../images/fullscreen/fullscreen-scene-bg.png);
  background-size: cover;
`;

const HideButton = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  cursor: pointer;
  z-index: 10;
`;

// const ChatPosition = styled.div`
//   position: fixed;
//   left: 0px;
//   bottom: 50px;
//   width: 480px;
//   height: 240px;
// `;

export enum Route {
  Start,
  ChampionSelect,
  EndGameStats,
}

export interface Props {
  scenarioID: string;
  onConnectToServer: () => void;
}

export interface State {
  isChatVisible: boolean;
  currentRoute: Route;
}

export class FullScreen extends React.Component<Props, State> {
  private showChatEVH: EventHandle;
  private hideChatEVH: EventHandle;
  private navigateEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      isChatVisible: true,
      currentRoute: props.scenarioID ? Route.EndGameStats : Route.Start,
    };
  }

  public render() {
    return (
      <Container>
        {this.renderRoute()}
        <HideButton onClick={() => game.trigger('hide-fullscreen')}>
          <Button type='blue' text='Hide Full Screen UI' />
        </HideButton>
        {/* {this.state.isChatVisible &&
          <ChatPosition>
            <Chat accessToken={game.accessToken} />
          </ChatPosition>
        } */}
      </Container>
    );
  }

  private renderRoute = () => {
    switch (this.state.currentRoute) {
      case Route.Start: {
        return (
          <StartScreen />
        );
      }
      case Route.ChampionSelect: {
        return (
          <ChampionSelect
            gameMode={'Survival'}
            difficulty={'Normal'}
            onConnectToServer={this.props.onConnectToServer}
          />
        );
      }
      case Route.EndGameStats: {
        return (
          <GameStats scenarioID={this.props.scenarioID} onLeaveClick={this.goToStart} />
        );
      }
    }
  }

  public componentDidMount() {
    this.showChatEVH = game.on('show-fullscreen-chat', this.handleShowFullScreenChat);
    this.hideChatEVH = game.on('hide-fullscreen-chat', this.handleHideFullScreenChat);
    this.navigateEVH = game.on('fullscreen-navigate', this.navigateTo);
  }

  public componentWillUnmount() {
    this.showChatEVH.clear();
    this.hideChatEVH.clear();
    this.navigateEVH.clear();
  }

  private goToStart = () => {
    this.navigateTo(Route.Start);
  }

  private handleShowFullScreenChat = () => {
    this.setState({ isChatVisible: true });
  }

  private handleHideFullScreenChat = () => {
    this.setState({ isChatVisible: false });
  }

  private navigateTo = (route: Route) => {
    this.setState({ currentRoute: route });
  }
}
