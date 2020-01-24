/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { FullScreenNavContext, FullScreenNavContextState, Route, fullScreenNavigateTo } from 'context/FullScreenNavContext';
import { StartScreen } from './StartScreen';
import { ChampionSelect } from './ChampionSelect';
import { Button } from './Button';
import { GameStats } from './GameStats';
import { Settings } from './Settings';
import { IntroVideo } from './IntroVideo';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../images/fullscreen/fullscreen-scene-bg.jpg);
  background-size: cover;
`;

const HideButton = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  cursor: pointer;
  z-index: 10;
`;

const SettingsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
`;

// const ChatPosition = styled.div`
//   position: fixed;
//   left: 0px;
//   bottom: 50px;
//   width: 480px;
//   height: 240px;
// `;

interface InjectedProps {
  fullScreenNavContext: FullScreenNavContextState;
}

export interface ComponentProps {
  scenarioID: string;
  onConnectToServer: (fromMatchmaking?: boolean) => void;
}

type Props = InjectedProps & ComponentProps;

export interface State {
  isChatVisible: boolean;
}

class FullScreenWithInjectedContext extends React.Component<Props, State> {
  private showChatEVH: EventHandle;
  private hideChatEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      isChatVisible: true,
    };
  }

  public render() {
    return (
      <Container>
        {this.renderRoute()}
        <HideButton onClick={() => game.trigger('hide-fullscreen')}>
          <Button type='blue' text='Hide Full Screen UI' />
        </HideButton>
        <SettingsContainer>
          <Settings />
        </SettingsContainer>
        {/* {this.state.isChatVisible &&
          <ChatPosition>
          </ChatPosition>
        } */}
      </Container>
    );
  }

  public componentDidMount() {
    this.showChatEVH = game.on('show-fullscreen-chat', this.handleShowFullScreenChat);
    this.hideChatEVH = game.on('hide-fullscreen-chat', this.handleHideFullScreenChat);
  }

  public componentWillUnmount() {
    this.showChatEVH.clear();
    this.hideChatEVH.clear();
  }

  private renderRoute = () => {
    switch (this.props.fullScreenNavContext.currentRoute) {
      case Route.IntroVideo: {
        return (
          <IntroVideo onIntroVideoEnd={this.goToStart} />
        );
      }
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
            onTimerEnd={this.props.onConnectToServer}
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

  private goToStart = () => {
    fullScreenNavigateTo(Route.Start);
  }

  private handleShowFullScreenChat = () => {
    this.setState({ isChatVisible: true });
  }

  private handleHideFullScreenChat = () => {
    this.setState({ isChatVisible: false });
  }
}

export function FullScreen(props: ComponentProps) {
  const fullScreenNavContext = useContext(FullScreenNavContext);
  return (
    <FullScreenWithInjectedContext {...props} fullScreenNavContext={fullScreenNavContext} />
  );
}
