/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useState, useContext, useEffect } from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';
import {
  IMatchmakingUpdate,
  MatchmakingUpdateType,
  MatchmakingServerReady,
} from '@csegames/library/lib/hordetest/graphql/schema';
import { query } from '@csegames/library/lib/_baseGame/graphql/query'

import { Header } from '../Header';
import { ChampionPick } from './ChampionPick';
import { ChampionInfo } from './ChampionInfo';
import { LockedList } from './LockedList';
import { LockIn } from './LockIn';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { MatchmakingContext, onMatchmakingUpdate } from 'context/MatchmakingContext';
import { InputContext } from 'context/InputContext';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionSelectContextProvider } from './context/ChampionSelectContext';
import { Error } from 'components/fullscreen/Error';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
`;

const HeaderItemContainer = styled.div`
  display: flex;
  flex: 1;

  &.align-center {
    justify-content: center;
  }
`;

const GameModeContainer = styled.div`
  margin-top: 30px;
  margin-left: 30px;
`;

const GameModeText = styled.div`
  font-size: 30px;
  line-height: 30px;
  font-family: Colus;
  text-transform: uppercase;
  color: white;
`;

const GameModeDifficulty = styled.div`
  font-size: 16px;
  line-height: 16px;
  font-family: Colus;
  text-transform: uppercase;
  color: #707070;
`;

const ChampionPickContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: fixed;
  z-index: 1;
  bottom: 150px;  
`;

const SelectedChampionBackground = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const SelectedChampionContainer = styled.div`
  position: absolute;
  width: 80%;
  height: 140%;
  pointer-events: none;
  top: 0;
  bottom: 0;
  right: 15%;
  left: auto;
  -webkit-mask-image: linear-gradient(to top, transparent 25%, black 65%);
`;

const SelectedChampionImage = styled.img`
  position: absolute;
  width: 80%;
  height: 80%;
  object-fit: contain;
  right: 5%;
`;

const ChampionInfoContainer = styled.div`
  position: absolute;
  left: 20%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LockedListContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 28px;
`;

const LockInPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 60px;
`;

const ConsoleNavIcon = styled.div`
  color: white;
  font-size: 30px;
  color: white;
  margin: 0 10px;
`;

export interface Props {
  gameMode: string;
  difficulty: string;
  onConnectToServer: (fromMatchmaking?: boolean) => void;
  onTimerEnd: () => void;
}

export interface Champion {
  id: string;
  name: string;
  image: string;
  previewImage?: string;
  abilities: { type: 'light' | 'heavy' | 'ultimate', name: string, iconClass: string }[];
}

export function ChampionSelect(props: Props) {
  const { champions, championCostumes } = useContext(ChampionInfoContext);
  const { matchID } = useContext(MatchmakingContext);
  const inputContext = useContext(InputContext);
  const colossusProfileContext = useContext(ColossusProfileContext);
  const [selectedChampion, setSelectedChampion] = useState(getDefaultSelectedChampion());
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    updateSelectedChampion(selectedChampion.id, getChampionCostumeInfo(selectedChampion.id).id);
  }, []);

  useEffect(() => {
    const matchmakingEVH = onMatchmakingUpdate(handleMatchmakingUpdate);

    return () => {
      matchmakingEVH.clear();
    };
  });

  function getDefaultSelectedChampion() {
    const colossusProfile = colossusProfileContext.colossusProfile;
    if (colossusProfile && colossusProfile.defaultChampion && colossusProfile.defaultChampion.championID) {
      const colossusProfileChampion = champions.find(c => c.id === colossusProfile.defaultChampion.championID);

      if (colossusProfileChampion) {
        return colossusProfileChampion;
      } else {
        console.error('User had a ColossusProfile default champion with an invalid championID');
      }
    }

    return champions[0];
  }

  function getChampionCostumeInfo(championID: string) {
    return championCostumes.find(c => c.requiredChampionID === championID);
  }

  function onChampionPick(championID: string) {
    if (this.isLocked) {
      return;
    }
    const champion = champions.find(c => championID === c.id);
    setSelectedChampion(champion);
    const costumeinfo = getChampionCostumeInfo(championID);
    updateSelectedChampion(championID, costumeinfo.id);
  }

  function handleMatchmakingUpdate(matchmakingUpdate: IMatchmakingUpdate) {
    if (matchmakingUpdate.type === MatchmakingUpdateType.ServerReady) {
      const { host, port } = matchmakingUpdate as MatchmakingServerReady;
      connect(host, port, 0);
    }
  }

  function connect(host: string, port: number, tries: number) {
    game.connectToServer(host, port);
    window.setTimeout(() => checkConnected(host, port, ++tries), 500);
  }

  async function checkConnected(host: string, port: number, tries: number) {
    if (game.isConnectedToServer) {
      props.onConnectToServer(true);
      return;
    }

    if (game.isConnectedOrConnectingToServer) {
      // check again in another timeout
      window.setTimeout(() => checkConnected(host, port, tries), 500);
      return;
    }

    // give up after 15 seconds / 30 tries
    if (tries > 30) {
      game.trigger('show-middle-modal', <Error title='Failed' message={'Failed to establish connection to game server.'} errorCode={1010} />);
      game.trigger('reset-fullscreen');
      return;
    }

    try {
      const response = await query<any>(gql`
        {
          serverState(server:"${host}:${port}", match: "${matchID}") {
            status
          }
        }`,   {
        url: game.webAPIHost + '/graphql',
        requestOptions: {
          headers: {
            Authorization: `Bearer ${game.accessToken}`,
            shardID: `${game.shardID}`,
            characterID: `${game.characterID},`
          },
        },
      });

      const status = response.data.serverState.status;
      if (status === 'Running' || status === 'Reserved') {
        // try again.
        connect(host, port, tries);
        return;
      } else {
        // fail out.
        game.trigger('show-middle-modal', <Error title='Failed' message={'Failed to establish connection to game server.'} errorCode={1011} />);
        // reset back to lobby
        game.trigger('reset-fullscreen');
      }
    } catch (err) {
      // failed to check status... so just fail out
      // reset back to lobby
      game.trigger('show-middle-modal', <Error title='Failed' message={'Failed to establish connection to game server.'} errorCode={1009} />);
      game.trigger('reset-fullscreen');
    }
  }


  async function updateSelectedChampion(championID: string, costumeID: string) {
    const request: SelectChampionRequest = {
      ChampionID: championID,
      ChampionMetaData: {
        costume: costumeID
      }
    };
    await webAPI.ChampionAPI.SelectChampion(webAPI.defaultConfig, request);
  }

  async function onLockIn() {
    setIsLocked(true);
    const res = await webAPI.ChampionAPI.LockInChampionSelection(webAPI.defaultConfig);
    if (!res.ok) {
      // TODO: Handle why this is not OK
      setIsLocked(false);
    }
  }

  const selectedChampionCostumeInfo = getChampionCostumeInfo(selectedChampion.id);
  return (
    <ChampionSelectContextProvider matchID={matchID}>
      <Container>
        <SelectedChampionBackground src={selectedChampionCostumeInfo.backgroundImageURL} />
        <HeaderContainer>
          <HeaderItemContainer>
            <GameModeContainer>
              <GameModeText>{props.gameMode}</GameModeText>
              <GameModeDifficulty>{props.difficulty}</GameModeDifficulty>
            </GameModeContainer>
          </HeaderItemContainer>
          <HeaderItemContainer className='align-center'>
            <Header isSelected>Select your champion</Header>
          </HeaderItemContainer>
          <HeaderItemContainer />
        </HeaderContainer>
        <ChampionPickContainer>
          {inputContext.isConsole && <ConsoleNavIcon className='icon-xb-lb' />}
          {champions.map((champion) => {
            const isSelected = champion.id === selectedChampion.id;
            const championCostumeInfo = getChampionCostumeInfo(champion.id);
            return (
              <ChampionPick
                isSelected={isSelected}
                id={champion.id}
                image={championCostumeInfo.thumbnailURL}
                onClick={onChampionPick}
              />
            );
          })}
          {inputContext.isConsole && <ConsoleNavIcon className='icon-xb-rb' />}
        </ChampionPickContainer>
        <SelectedChampionContainer>
          <SelectedChampionImage src={selectedChampionCostumeInfo.standingImageURL} />
        </SelectedChampionContainer>
        <ChampionInfoContainer>
          <ChampionInfo selectedChampion={selectedChampion} />
        </ChampionInfoContainer>
        <LockedListContainer>
          <LockedList />
        </LockedListContainer>
        <LockInPosition>
          <LockIn isLocked={isLocked} onLockIn={onLockIn} onTimerEnd={props.onTimerEnd} />
        </LockInPosition>
      </Container>
    </ChampionSelectContextProvider>
  );
}
