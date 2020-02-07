/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { ContextProviders, FullScreenContextProviders } from '../context';
import { FullScreenNavContext, FullScreenNavContextState, fullScreenNavigateTo, Route } from 'context/FullScreenNavContext';
import { MatchmakingContext, MatchmakingContextState } from 'components/context/MatchmakingContext';
import { Chat } from './Chat';
import { initChat, disconnectChat } from './Chat/state/chat';
import { DevUI } from '../shared/DevUI';

// import { ChannelBar } from './ChannelBar';
import { MatchInfo } from './MatchInfo';
import { Crosshair } from './Crosshair';
import { DivineBarrierBar } from './DivineBarrierBar';
import { KillStreakCounter } from './KillStreakCounter';
import { PlayerTrackers } from './PlayerTrackers';
import { Respawn } from './Respawn';
import { Settings } from '../fullscreen/Settings';
import { FullScreen } from '../fullscreen';
import { PopupAnnouncement } from './Announcements/Popup';
import { ScenarioIntro } from './ScenarioIntro';
import { Compass } from './Compass';
import { Objectives } from './Objectives';
import { Console } from '../hud/Console';
import { SelfHealthBar } from './SelfHealthBar';
import { Consumables } from './Consumables';
import { FriendlyHealthBars } from './FriendlyHealthBars';
import { PlayerMessage } from './PlayerMessage';
import { RuneFullScreenEffects } from './FullScreenEffects/Runes';
import { MenuModal } from '../fullscreen/MenuModal';
import { LeftModal } from '../fullscreen/LeftModal';
import { RightModal } from '../fullscreen/RightModal';
import { Preloader } from '../fullscreen/Preloader';
import { CreditsScreen } from '../fullscreen/CreditsScreen';
import { ErrorComponent } from '../fullscreen/Error';
import { AllFailComponent } from '../fullscreen/AllFail';
import { ActionAlert } from '../shared/ActionAlert';
import { ExtraButtons } from './ExtraButtons';
import { UrgentMessage } from './UrgentMessage';
import { Mocks } from './Mocks';

// import { LowHealthFullScreenEffects } from './FullScreenEffects/LowHealth';


const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MatchInfoPosition = styled.div`
  position: fixed;
  top: 60px;
  right: 5px;
  pointer-events: none;
  z-index: -1;
`;

const KillStreakPosition = styled.div`
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 318px;
`;

const PopupAnnouncementsPosition = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ScenarioIntroPosition = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;


const DivineBarrierBarPosition = styled.div`
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CrosshairPosition = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const UrgentMessagePosition = styled.div`
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
`;

const SelfHealthBarPosition = styled.div`
  position: fixed;
  left: 5%;
  bottom: 3%;
`;

const ConsumablesPosition = styled.div`
  position: fixed;
  right: 40px;
  bottom: 3%;
`;

const FriendlyHealthBarsPosition = styled.div`
  position: fixed;
  left: 5px;
  top: 5px;

  display: flex;
  align-items: flex-start;
`;

const CompassPosition =  styled.div`
  position: fixed;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 85px;
  pointer-events: none;
`;

// const WeaponButtonsContainer = styled.div`
//   display: flex;
//   margin-left: 15px;
// `;

// const ShieldBarPosition = styled.div`
//   position: fixed;
//   top: calc(50% - 100px);
//   left: 50%;
//   transform: translate(-50%, -50%);
// `;

const PlayerMessagePosition = styled.div`
  position: fixed;
  left: 50%;
  bottom: 260px;
  transform: translateX(-50%);
  pointer-events: none;
`;

const AnnouncementsPosition = styled.div`
  position: fixed;
  top: 11%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
`;

const PlayerTrackersPosition = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const SettingsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const ExtraButtonsPosition = styled.div`
  position: fixed;
  left: 5px;
  bottom: 0px;
`;

interface Props {
  fullScreenNavContext: FullScreenNavContextState;
  matchmakingContext: MatchmakingContextState;
}

export interface State {
  isLoadingFinished: boolean;
  isLobbyVisible: boolean;
  isCreditsScreenVisible: boolean;
  scenarioID: string;
  hasTotalApiNetworkFailure: boolean;
  hasPartialApiNetworkFailure: boolean;
}

// tslint:disable-next-line:function-name
class HUDWithInjectedContext extends React.Component<Props, State> {
  private showEVH: EventHandle;
  private hideEVH: EventHandle;
  private creditsScreenShowEVH: EventHandle;
  private creditsScreenHideEVH: EventHandle;
  private resetEVH: EventHandle;
  private scenarioEndedEVH: EventHandle;
  private networkFailureEVH: EventHandle;
  private loadTimeout: number;
  private extraLoadTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingFinished: false,
      // Show the lobby by default if we are not connected or connecting to a game server
      isLobbyVisible: !game.isConnectedOrConnectingToServer,
      isCreditsScreenVisible: false,
      scenarioID: '',
      hasTotalApiNetworkFailure: false,
      hasPartialApiNetworkFailure: false,
    }
  }

  public render() {
    if (this.state.isLobbyVisible) {
      return (
        <FullScreenContextProviders>
          <FullScreen
            scenarioID={this.state.scenarioID}
            hasTotalApiNetworkFailure={this.state.hasTotalApiNetworkFailure}
            hasPartialApiNetworkFailure={this.state.hasPartialApiNetworkFailure}
            onSelectionTimeOver={this.beginWaitingForAServerFromMatchmaking}
          />

          {!this.state.isLoadingFinished ?
            <Preloader
              onLoadComplete={this.handleLoadComplete}
              onTotalApiNetworkFailure={this.onTotalApiNetworkFailure}
              onPartialApiNetworkFailure={this.onPartialApiNetworkFailure}
            />
          : null}
          <MenuModal />
          <LeftModal />
          <RightModal />
          <ActionAlert />
          {this.state.isCreditsScreenVisible && <CreditsScreen />}
        </FullScreenContextProviders>
      );
    }

    return (
      <ContextProviders>
        <Container>
          {/* <LowHealthFullScreenEffects /> */}
          <RuneFullScreenEffects />
          <DevUI />
          <ExtraButtonsPosition>
            <ExtraButtons />
          </ExtraButtonsPosition>

          <Mocks />
          <Console />

          <CompassPosition>
            <Compass />
          </CompassPosition>

          <PopupAnnouncementsPosition>
            <PopupAnnouncement />
          </PopupAnnouncementsPosition>

          <ScenarioIntroPosition>
            <ScenarioIntro />
          </ScenarioIntroPosition>

          <DivineBarrierBarPosition>
            <DivineBarrierBar />
          </DivineBarrierBarPosition>

          <CrosshairPosition>
            <Crosshair />
          </CrosshairPosition>

          <UrgentMessagePosition>
            <UrgentMessage />
          </UrgentMessagePosition>

          <MatchInfoPosition>
            <MatchInfo />
          </MatchInfoPosition>

          <KillStreakPosition>
            <KillStreakCounter />
          </KillStreakPosition>

          {/* <ShieldBarPosition>
            <ShieldBar current={95} max={100} />
          </ShieldBarPosition> */}

          <PlayerMessagePosition>
            <PlayerMessage />
          </PlayerMessagePosition>

          <AnnouncementsPosition>
            <Objectives />
          </AnnouncementsPosition>

          <SelfHealthBarPosition>
            <SelfHealthBar />
          </SelfHealthBarPosition>

          <ConsumablesPosition>
            <Consumables />
          </ConsumablesPosition>

          <FriendlyHealthBarsPosition>
            <FriendlyHealthBars />
          </FriendlyHealthBarsPosition>

          <Chat />

          <PlayerTrackersPosition>
            <PlayerTrackers />
          </PlayerTrackersPosition>

          <Respawn onLeaveMatch={this.resetFullscreen} />

          <SettingsContainer>
            <Settings />
          </SettingsContainer>

          {!this.state.isLoadingFinished ?
            <Preloader
              onTotalApiNetworkFailure={this.onTotalApiNetworkFailure}
              onPartialApiNetworkFailure={this.onPartialApiNetworkFailure}
              onLoadComplete={this.handleLoadComplete}
            /> :
          null}
          <MenuModal />
          <LeftModal />
          <RightModal />
          <ActionAlert />
        </Container>
      </ContextProviders>
    );
  }

  public componentDidMount() {
    this.showEVH = game.on('show-fullscreen', this.showLobby);
    this.hideEVH = game.on('hide-fullscreen', this.hideLobby);
    this.resetEVH = game.on('reset-fullscreen', this.resetFullscreen);
    this.creditsScreenShowEVH = game.on('show-credits-screen', this.showCreditsScreen);
    this.creditsScreenHideEVH = game.on('hide-credits-screen', this.hideCreditsScreen);
    this.networkFailureEVH = game.onNetworkFailure(this.handleNetworkFailure);
    this.scenarioEndedEVH = hordetest.game.onScenarioRoundEnded(this.handleScenarioRoundEnded);

    // Set a timeout of 10s if we fire a ReadyForDisplay
    this.loadTimeout = window.setTimeout(() => {
      console.error('Load completed before Preloader said it was. Is something getting stuck in Preloader?');
      this.handleLoadComplete();
    }, 10000);

    if (game.isConnectedOrConnectingToServer) {
      this.beginWaitingForAServerFromMatchmaking();
      initChat((this.props.matchmakingContext && this.props.matchmakingContext.host) || game.serverHost);
    }
  }

  public componentWillUnmount() {
    this.showEVH.clear();
    this.hideEVH.clear();
    this.resetEVH.clear();
    this.scenarioEndedEVH.clear();
    this.networkFailureEVH.clear();
    this.creditsScreenShowEVH.clear();
    this.creditsScreenHideEVH.clear();

    if (this.extraLoadTimeout) {

    }
  }

  private showLobby = () => {
    console.log("Showing lobby");
    this.setState({ isLobbyVisible: true });

    console.log('Trying to disconnect from chat');
    disconnectChat();
  }

  private hideLobby = () => {
    console.log("Hiding lobby");
    this.setState({ isLobbyVisible: false }, () => {
      fullScreenNavigateTo(Route.Start);
    });
    game.trigger('hide-middle-modal');
  }

  private showCreditsScreen = () => {
    this.setState({ isCreditsScreenVisible: true });
  }

  private hideCreditsScreen = () => {
    this.setState({ isCreditsScreenVisible: false });
  }

  private beginWaitingForAServerFromMatchmaking = () => {
    //Show the loading screen and if we dont receive either a server ready or an error after 4 minutes
    //then assume a network failure has happened.
    //At the moment, the webapi has a 3 minute timeout on finding a server
    if (this.props.matchmakingContext.isWaitingOnServer) {
      const fourminutes = 4 * 60 * 1000;
      console.log("Waiting on server. Force loading the loadingscreen");
      game.playGameSound(SoundEvents.PLAY_USER_FLOW_LOADING_SCREEN);
      game.trigger("forceshow-loadingscreen", "We're trying to create a server for you! Hang tight", fourminutes, () => {
        if (this.props.matchmakingContext.isWaitingOnServer) {
          console.log("Timeout on Waiting on server. Returning to lobby with error");
          this.handleNetworkFailure("A server could not be found. Please try again later.", 9007);
          this.props.matchmakingContext.onWaitingForServerHandled()
        }
      });
    }

    //TODO TIMEOUT HERE

    //And lets hide the lobby
    this.hideLobby();
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, didEnd: boolean) => {
    if (didEnd) {
      console.log("Scenario round ended")
      fullScreenNavigateTo(Route.EndGameStats);
      this.setState({ isLobbyVisible: true, scenarioID });
      game.playGameSound(SoundEvents.PLAY_SCENARIO_END);

      console.log('Trying to disconnect from chat');
      disconnectChat();
    }
  }

  private handleNetworkFailure = (errorMsg: string, errorCode: number) => {
    // Add a failsafe in case we get a network failure event when the game server cleanly shuts down.
    if (this.props.fullScreenNavContext.currentRoute === Route.EndGameStats) {
      console.log("Network failure came in. Not showing because on end game stats");
      return;
    }

    if (!game.isConnectedToServer) {
      console.log(`Handling network failure:(${errorCode}) ${errorMsg}...`);
      this.resetFullscreen();
      game.trigger('show-middle-modal', <ErrorComponent title='Network Failure' message={errorMsg} errorCode={errorCode} />, true);
    }
  }

  private resetFullscreen = () => {
    if (!game.isConnectedOrConnectingToServer || game.isDisconnectingFromAllServers) {
      console.log("Reset fullscreen to start with lobby and no loading screen");
      fullScreenNavigateTo(Route.Start);
      this.showLobby();
      game.trigger("clearforceshow-loadingscreen");
    }
    else {
      console.log("Tried to reset fullscreen while connected or connecting to a game! If we did that, we would pop the lobby up during a game. Ignoring request");
    }
  }

  private handleLoadComplete = () => {
    console.log('Preloading complete');
    this.extraLoadTimeout = window.setTimeout(() => {
      this.setState({ isLoadingFinished: true });
      console.log('engine triggering OnReadyForDisplay');
      engine.trigger('OnReadyForDisplay');
      window.clearTimeout(this.loadTimeout);
    }, 3000);
  }

  private onTotalApiNetworkFailure = () => {
    // We probably want different tiers of error handling
    console.log('There is a total network failure!');
    this.setState({ hasTotalApiNetworkFailure: true });
    game.trigger('show-middle-modal', <AllFailComponent />, true);
  }

  private onPartialApiNetworkFailure = () => {
    // We probably want different tiers of error handling
    console.log('There is a partial network failure');
    this.setState({ hasPartialApiNetworkFailure: true });
  }
}

export function HUD() {
  const fullScreenNavContext = useContext(FullScreenNavContext);
  const matchmakingContext = useContext(MatchmakingContext);
  return (
    <HUDWithInjectedContext fullScreenNavContext={fullScreenNavContext} matchmakingContext={matchmakingContext} />
  );
}
