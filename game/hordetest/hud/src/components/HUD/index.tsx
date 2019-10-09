/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { Chat } from 'cushared/components/Chat';
import { DevUI } from 'cushared/components/DevUI';
import { GameMenu } from 'cushared/components/GameMenu';
import { Settings } from 'cushared/components/Settings';

import { HealthBar } from './HealthBar';
// import { ChannelBar } from './ChannelBar';
import { MatchInfo } from './MatchInfo';
import { Crosshair } from './Crosshair';
import { ActionButtons } from './ActionButtons';
import { KillStreakCounter } from './KillStreakCounter';
import { UltimateReady } from './UltimateReady';
import { PlayerTrackers } from './PlayerTrackers';
import { Respawn } from './Respawn';
import { FullScreen } from 'components/fullscreen';
import { Console } from 'components/HUD/Console';
import { LoadingScreen } from 'components/fullscreen/LoadingScreen';

import { ImagePreloader } from './ImagePreloader';
import { PopupAnnouncement } from './Announcements/Popup';
import { Compass } from './Compass';
import { ActiveObjectives } from './ActiveObjectives';
import { ContextProviders } from 'components/context';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ReloadButtonContainer = styled.div`
  position: fixed;
  top: 5px;
  left: 5px;
  pointer-events: all;
  cursor: pointer;
  color: white;
  background-color: orange;
  padding: 5px;

  &:hover {
    filter: brightness(110%);
  }
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
  transform: translateY(-50%);
  left: 20px;
`;

const PopupAnnouncementsPosition = styled.div`
  position: fixed;
  top: 25%;
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
  bottom: 50px;
  width: 480px;
  height: 240px;
`;

const GameMenuPosition = styled.div`
  position: fixed;
  left: 50%;
  top: 35%;
  transform: translate(-50%, 50%);
`;

const SettingsPosition = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const SettingsContainer = styled.div`
  position: relative;
  width: 1040px;
  height: 710px;
`;

const HealthBarPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;

  display: flex;
  align-items: center;
`;

const CompassPosition =  styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 55px;
  pointer-events: none;
`;

// const WeaponButtonsContainer = styled.div`
//   display: flex;
//   margin-left: 15px;
// `;

const ActionsContainer = styled.div`
  position: fixed;
  right: 25px;
  bottom: 10px;
`;

// const ShieldBarPosition = styled.div`
//   position: fixed;
//   top: calc(50% - 100px);
//   left: 50%;
//   transform: translate(-50%, -50%);
// `;

const UltimateReadyPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 130px;
  pointer-events: none;
`;

// const ChannelBarPosition = styled.div`
//   position: fixed;
//   left: 50%;
//   bottom: 230px;
//   transform: translateX(-50%);
//   pointer-events: none;
// `;

const AnnouncementsPosition = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  pointer-events: none;
`;

const RespawnPosition = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

export interface Props {
}

// tslint:disable-next-line:function-name
export function HUD(props: Props) {
  return (
    <ContextProviders>
      <Container>
        <ImagePreloader />
        <DevUI />
        <ReloadButtonContainer>
          <div onClick={() => game.reloadUI()}>Reload UI</div>
        </ReloadButtonContainer>

        <CompassPosition>
          <Compass />
        </CompassPosition>

        <PopupAnnouncementsPosition>
          <PopupAnnouncement />
        </PopupAnnouncementsPosition>

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

        <UltimateReadyPosition>
          <UltimateReady />
        </UltimateReadyPosition>

        {/* <ChannelBarPosition>
          <ChannelBar channelType={'Bandage'} current={60} max={100} />
        </ChannelBarPosition> */}

        <AnnouncementsPosition>
          <ActiveObjectives />
        </AnnouncementsPosition>

        <HealthBarPosition>
          <HealthBar />
        </HealthBarPosition>

        <ActionsContainer>
          <ActionButtons />
        </ActionsContainer>

        <ChatPosition>
          <Chat accessToken={game.accessToken} />
        </ChatPosition>

        <GameMenuPosition>
          <GameMenu />
        </GameMenuPosition>

        <SettingsPosition>
          <SettingsContainer>
            <Settings />
          </SettingsContainer>
        </SettingsPosition>

        <RespawnPosition>
          <Respawn />
        </RespawnPosition>

        <PlayerTrackersPosition>
          <PlayerTrackers />
        </PlayerTrackersPosition>

        <FullScreen />
        <Console />
        <LoadingScreen />
      </Container>
    </ContextProviders>
  );
}
