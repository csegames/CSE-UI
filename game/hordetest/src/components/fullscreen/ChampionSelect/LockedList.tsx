/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

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
      background: linear-gradient(to top, rgba(236, 156, 48, 0.7), transparent);
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
  players: { name: string, isLocked: boolean, image: string }[];
}

export function LockedList(props: Props) {
  return (
    <Container>
      {props.players.map((player) => {
        const lockedClass = player.isLocked ? 'locked' : '';
        return (
          <ListItem className={lockedClass}>
            <BGImage src={player.image} />
            <NameOfPlayer>{player.name} {player.isLocked ? 'is locked in' : ''}</NameOfPlayer>
          </ListItem>
        );
      })}
    </Container>
  );
}
