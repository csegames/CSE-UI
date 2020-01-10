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
  color: #4E4E4E;
  font-family: Lato;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Code = styled.div`
  font-size: 22px;
  color: #2C2C2C;
  font-family: Lato;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ButtonStyle = css`
  font-size: 26px;
  padding: 15px 25px;
`;

export interface Props {
  title: string;
  message: string;
  errorCode: number;
}

const hideMiddleModal = () => {
  game.trigger('hide-middle-modal');
}

export function Error(props: Props) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <Message>{props.message}</Message>
      <Code>Error Code: #{props.errorCode}</Code>
      <Button type='gray' text='Continue' styles={ButtonStyle} onClick={hideMiddleModal} />
    </Container>
  );
}
