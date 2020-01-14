/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { ChampionSelectContext } from './context/ChampionSelectContext';

const Container = styled.div`
`;

const ListItem = styled.div`
  position: relative;
  height: 100px;
  width: 315px;
  border: 2px solid #373434;
  margin-bottom: 7px;
  background-color: rgba(0, 0, 0, 0.9);
  background-size: cover;

  &.locked {
    border: 2px solid #ec9c30;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to top, rgba(49, 95, 183, 0.7), transparent);
    }
  }
`;

const BGImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NameOfPlayer = styled.div`
  position: absolute;
  font-family: Lato;
  font-weight: bold;
  font-size: 16px;
  color: white;
  left: 10px;
  bottom: 7px;
`;

export interface Props {
}

export function LockedList(props: Props) {
  const { playerStates } = useContext(ChampionSelectContext);
  const championContext = useContext(ChampionInfoContext);

  return (
    <Container>
      {Object.values(playerStates).map((player) => {
        const lockedClass = player.isLocked ? 'locked' : '';
        const championID = player.championID ? player.championID : '';
        const isLocked = player.isLocked ? true : false;
        const championCostumeInfo = championContext.championCostumes.find(c => c.requiredChampionID === championID);
        const championInfo = championContext.champions.find(c => c.id === championID);

        return (
          <ListItem className={lockedClass}>
            <BGImage src={championCostumeInfo.championSelectImageURL} />
            <NameOfPlayer>
              {player.characterID ? `${player.characterID} -` : ''} {championInfo.name} {isLocked ? 'is locked in' : ''}
            </NameOfPlayer>
          </ListItem>
        );
      })}
    </Container>
  );
}
