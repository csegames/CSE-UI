/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { ChampionSelectContext, ChampionSelectPlayer } from './context/ChampionSelectContext';


const Container = styled.div`
  &.left {
    opacity: 0;
    margin-left: -10%;
    animation: slideIn 0.6s forwards;

    @keyframes slideIn {
      from {
        opacity: 0;
        margin-left: -10%;
      }
      to {
        opacity: 1;
        margin-left: 0;
      }
    }
  }

  &.right {
    opacity: 0;
    margin-right: -10%;
    animation: slideIn 0.6s forwards;

    @keyframes slideIn {
      from {
        opacity: 0;
        margin-right: -10%;
      }
      to {
        opacity: 1;
        margin-right: 0;
      }
    }
  }
`;

const ListItem = styled.div`
  position: relative;
  height: 100px;
  width: 315px;
  border: 2px solid #373434;
  margin-bottom: 7px;
  background-color: rgba(0, 0, 0, 0.9);
  background-size: cover;
  filter: grayscale(100%) brightness(.4);
  -webkit-mask-image: linear-gradient(to left, transparent 15%, black 55%);

  &.self {
    filter: grayscale(90%);
  }

  &.locked {
    filter: grayscale(0%) brightness(1.3);
    border: 2px rgb(102, 216, 255) solid;
    outline: 1px solid rgba(88, 238, 255, 0.35);
    outline-offset: -6px;
    margin-left: -15px;
    transition: .2s all ease;
    &.left {
      margin-left: 15px;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to top, rgba(49, 95, 183, 0.4), transparent);
    }
  }

  &.left {
    margin-left: 0px;
    -webkit-mask-image: linear-gradient(to right, transparent 15%, black 55%);
  }

  &.left div {
    left: auto;
    right: 10px;
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
  text-shadow: 2px 2px 2px black;
`;

export interface Props {
  type: 'left' | 'right';
}

export function LockedList(props: Props) {
  const championContext = useContext(ChampionInfoContext);
  const championSelectContext = useContext(ChampionSelectContext);

  function getPlayerChampion(player: ChampionSelectPlayer) {
    if (player.championID) {
      const championInfo = championContext.champions.find(c => c.id === player.championID);

      if (championInfo) {
        return championInfo;
      }
    }

    // We don't have a championID for that player for some reason.
    // Just default to having the first champion in the list because that's the only valid case where this should happen.
    return championContext.champions[0];
  }

  function getPlayerStateList() {
    const playerStates = Object.values(championSelectContext.playerStates);
    if (props.type === 'right') {
      return playerStates.slice(0, 5);
    } else if (props.type === 'left' && playerStates.length > 5) {
      return playerStates.slice(5, 10);
    } else {
      return [];
    }
  }

  const playerStateList = getPlayerStateList();
  const typeClass = props.type === 'left' ? 'left' : 'right';
  return playerStateList.length > 0 ? (
    <Container className={typeClass}>
      {playerStateList.map((player) => {
        const lockedClass = player.isLocked ? 'locked' : '';
        const championInfo = getPlayerChampion(player);
        const championCostumeInfo = championContext.championCostumes.find(c => c.requiredChampionID === championInfo.id);

        return (
          <ListItem className={`${lockedClass} ${typeClass}`}>
            <BGImage src={championCostumeInfo ? championCostumeInfo.championSelectImageURL : ""} />
            <NameOfPlayer>
              {player.displayName ? `${player.displayName} -` : ''} {championInfo ? championInfo.name : ''}
            </NameOfPlayer>
          </ListItem>
        );
      })}
    </Container>
  ) : null;
}
