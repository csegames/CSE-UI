/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { ContextProviders, FullScreenContextProviders } from '../context';
import { FullScreenNavContext, FullScreenNavContextState, fullScreenNavigateTo, Route } from 'context/FullScreenNavContext';
// import { Chat } from 'cseshared/components/Chat';
import { Chat } from './Chat';
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
import { LoadingScreen } from '../fullscreen/LoadingScreen';
import { ImagePreloader } from './ImagePreloader';
import { SelfHealthBar } from './SelfHealthBar';
import { Consumables } from './Consumables';
import { FriendlyHealthBars } from './FriendlyHealthBars';
import { PlayerMessage } from './PlayerMessage';
import { RuneFullScreenEffects } from './FullScreenEffects/Runes';
import { MenuModal } from '../fullscreen/MenuModal';
import { LeftModal } from '../fullscreen/LeftModal';
import { RightModal } from '../fullscreen/RightModal';
import { MiddleModal } from '../fullscreen/MiddleModal';

import { Error } from '../fullscreen/Error';
import { ActionAlert } from '../shared/ActionAlert';
import { ExtraButtons } from './ExtraButtons';
import { UrgentMessage } from './UrgentMessage';
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
  top: 80px;
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
  bottom: 130px;
  right: 0;
  pointer-events: none;
`;

const PlayerTrackersPosition = styled.div`
  position: fixed;w
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
}

export interface State {
  isLobbyVisible: boolean;
  scenarioID: string;
}

// tslint:disable-next-line:function-name
class HUDWithInjectedContext extends React.Component<Props, State> {
  private showEVH: EventHandle;
  private hideEVH: EventHandle;
  private resetEVH: EventHandle;
  private scenarioEndedEVH: EventHandle;
  private networkFailureEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      // Show the lobby by default if we are not connected or connecting to a game server
      isLobbyVisible: !game.isConnectedOrConnectingToServer,
      scenarioID: '',
    }
  }

  public render() {
    if (this.state.isLobbyVisible) {
      return (
        <FullScreenContextProviders>
          <FullScreen scenarioID={this.state.scenarioID} onConnectToServer={this.onConnectToServer} />

          <MenuModal />
          <LeftModal />
          <RightModal />
          <MiddleModal />
          <ActionAlert />
          <LoadingScreen />
        </FullScreenContextProviders>
      );
    }

    return (
      <ContextProviders>
        <Container>
          <ImagePreloader />
          {/* <LowHealthFullScreenEffects /> */}
          <RuneFullScreenEffects />
          <DevUI />
          <ExtraButtonsPosition>
            <ExtraButtons />
          </ExtraButtonsPosition>

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

          <Respawn />

          <SettingsContainer>
            <Settings />
          </SettingsContainer>

          <MenuModal />
          <LeftModal />
          <RightModal />
          <MiddleModal />
          <ActionAlert />
          <LoadingScreen />
        </Container>
      </ContextProviders>
    );
  }

  public componentDidMount() {
    this.showEVH = game.on('show-fullscreen', this.showLobby);
    this.hideEVH = game.on('hide-fullscreen', this.hideLobby);
    this.resetEVH = game.on('reset-fullscreen', this.resetFullscreen);
    this.networkFailureEVH = game.onNetworkFailure(this.handleNetworkFailure);

    if (game.isConnectedOrConnectingToServer) {
      this.onConnectToServer();
    }
  }

  public componentWillUnmount() {
    this.showEVH.clear();
    this.hideEVH.clear();
    this.resetEVH.clear();
    this.scenarioEndedEVH.clear();
    this.networkFailureEVH.clear();
  }

  private showLobby = () => {
    this.setState({ isLobbyVisible: true });
  }

  private hideLobby = () => {
    this.setState({ isLobbyVisible: false }, () => {
      fullScreenNavigateTo(Route.Start);
    });
    game.trigger('hide-middle-modal');
  }

  private onConnectToServer = () => {
    this.scenarioEndedEVH = hordetest.game.onScenarioRoundEnded(this.handleScenarioRoundEnded);
    this.hideLobby();
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, didEnd: boolean) => {
    if (didEnd) {
      fullScreenNavigateTo(Route.EndGameStats);
      this.setState({ isLobbyVisible: true, scenarioID });
      game.playGameSound(SoundEvents.PLAY_SCENARIO_END);
    }
  }

  private handleNetworkFailure = (errorMsg: string, errorCode: number) => {
    // Add a failsafe in case we get a network failure event when the game server cleanly shuts down.
    if (this.props.fullScreenNavContext.currentRoute === Route.EndGameStats) {
      return;
    }

    if (!game.isConnectedToServer) {
      this.resetFullscreen();
      game.trigger('show-middle-modal', <Error title='Network Failure' message={errorMsg} errorCode={errorCode} />);
    }
  }

  private resetFullscreen = () => {
    fullScreenNavigateTo(Route.Start);
    this.showLobby();
  }
}

export function HUD() {
  const fullScreenNavContext = useContext(FullScreenNavContext);
  return (
    <HUDWithInjectedContext fullScreenNavContext={fullScreenNavContext} />
  );
}
