/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { MatchmakingContext } from 'context/MatchmakingContext';
import { Button } from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-size: 40px;
  color: white;
  font-family: Colus;
  margin-bottom: 10px;
`;

const Message = styled.div`
  font-size: 22px;
  color: #7d7d7d;
  font-family: Lato;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ButtonStyle = css`
  margin-top: 10px;
  font-size: 26px;
  padding: 15px 25px;
`;

export function ReconnectComponent() {
  const matchmakingContext = useContext(MatchmakingContext);

  function onConnectClick() {
    if (matchmakingContext.host && matchmakingContext.port) {
      console.log(`Reconnect triggered. Trying to connect to ${matchmakingContext.host}:${matchmakingContext.port}`);
      matchmakingContext.tryConnect(matchmakingContext.host, matchmakingContext.port, 0);
      onConnectSuccess();
    }
  }

  function onConnectSuccess() {
    game.trigger('hide-middle-modal');
    game.trigger('hide-fullscreen');
  }

  return (
    <Container>
      <Title>Reconnect</Title>
      <Message>You are already connected to a server.</Message>

      <Button type='blue' text='Connect' styles={ButtonStyle} onClick={onConnectClick} />
    </Container>
  );
}
