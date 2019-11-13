/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from'react';
import { styled } from '@csegames/linaria/react';
import { TopPlayer } from './testData';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(74, 74, 74, 0.3);
  margin-bottom: 4px;
  margin-right: 5px;
  min-height: 50px;
  height: 50px;
  padding: 0 20px;
`;

const ItemLeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RankText = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 12px;
  width: 40px;
`;

const ChampionImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background-color: black;
  object-fit: contain;
`;

const UserName = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 18px;
`;

const ChampionName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 12px;
  color: #6d6d6d;
`;

const StatValue = styled.div`
  display: flex;
  align-items: center;
  font-family: Lato;
  font-weight: bold;
  font-size: 18px;
  color: white;
`;

export interface Props {
  rank: number;
  player: TopPlayer;
}

export function ListItem(props: Props) {
  return (
    <Container>
      <ItemLeftSection>
        <RankText>{props.rank}</RankText>
        <ChampionImage src={props.player.championInfo.iconUrl} />
        <div>
          <UserName>{props.player.userName}</UserName>
          <ChampionName>{props.player.championInfo.name}</ChampionName>
        </div>
      </ItemLeftSection>

      <StatValue>{props.player.statNumber}</StatValue>
    </Container>
  );
}