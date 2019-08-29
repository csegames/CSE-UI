/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100% - 95px);
`;

const PlayerContainer = styled.div`
  width: 50%;
  height: 100%;
  background-image: url(../images/fullscreen/startscreen/human-m-blackguard.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

export interface Player {
  id: string;
  image: string;
}

export interface Props {
  players: Player[];
}

export function PlayerView(props: Props) {
  return (
    <Container>
      {props.players.map((player) => {
        return (
          <PlayerContainer key={player.id} />
        );
      })}
    </Container>
  );
}
