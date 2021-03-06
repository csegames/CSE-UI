/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
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
  margin-bottom: 20px;
`;

const ButtonStyle = css`
  font-size: 26px;
  padding: 15px 25px;
`;

export interface Props {

}

export function AllFailComponent(props: Props) {
  function onQuitClick() {
    game.quit();
  }

  return (
    <Container>
      <Title>Please try again in a bit!</Title>
      <Message>We are having technical difficulties.</Message>
      <Button type='gray' text='Quit' styles={ButtonStyle} onClick={onQuitClick} />
    </Container>
  );
}
