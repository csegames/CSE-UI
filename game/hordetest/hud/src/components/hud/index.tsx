/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { ContextProviders, FullScreenContextProviders } from '../context';
import { Chat } from 'cushared/components/Chat';
import { DevUI } from 'cushared/components/DevUI';

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
import { Compass } from './Compass';
import { Objectives } from './Objectives';
import { Console } from '../HUD/Console';
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
import { ActionAlert } from '../shared/ActionAlert';
import { ExtraButtons } from './ExtraButtons';
// import { LowHealthFullScreenEffects } from './FullScreenEffects/LowHealth';

const Container = styled.div`
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

const ChatPosition = styled.div`
  position: fixed;
  left: 0px;
  bottom: 220px;
  width: 480px;
  height: 240px;
`;

const SelfHealthBarPosition = styled.div`
  position: fixed;
  left: 40px;
  bottom: 20px;
`;

const ConsumablesPosition = styled.div`
  position: fixed;
  right: 40px;
  bottom: 20px;
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
  top: 20px;
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
  top: 500px;
  left: 5px;
`;

export interface Props {
}

export interface State {
  isLobbyVisible: boolean;
  scenarioID: string;
}

// tslint:disable-next-line:function-name
export class HUD extends React.Component<Props, State> {
  private showEVH: EventHandle;
  private hideEVH: EventHandle;
  private scenarioEndedEVH: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      // Show the lobby by default if we are connected or connecting to a game server
      isLobbyVisible: !game.isConnectedOrConnectingToServer,
      scenarioID: '',
    }
  }

  public render() {
    if (this.state.isLobbyVisible) {
      return (
        <FullScreenContextProviders>
          <FullScreen onConnectToServer={this.onConnectToServer} />
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

          <DivineBarrierBarPosition>
            <DivineBarrierBar />
          </DivineBarrierBarPosition>

          <CrosshairPosition>
            <Crosshair />
          </CrosshairPosition>

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

          <ChatPosition>
            <Chat accessToken={game.accessToken} />
          </ChatPosition>

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
    this.showEVH = game.on('show-fullscreen', this.show);
    this.hideEVH = game.on('hide-fullscreen', this.hide);
  }

  public componentWillUnmount() {
    this.showEVH.clear();
    this.hideEVH.clear();
    this.scenarioEndedEVH.clear();
  }

  private show = () => {
    this.setState({ isLobbyVisible: true });
  }

  private hide = () => {
    this.setState({ isLobbyVisible: false });
    game.trigger('hide-middle-modal');
  }

  private onConnectToServer = () => {
    this.scenarioEndedEVH = hordetest.game.onScenarioRoundEnded(this.handleScenarioRoundEnded);
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, didEnd: boolean) => {
    if (didEnd) {
      this.setState({ isLobbyVisible: true, scenarioID });
      game.playGameSound(SoundEvents.PLAY_SCENARIO_END);
    }
  }
}
