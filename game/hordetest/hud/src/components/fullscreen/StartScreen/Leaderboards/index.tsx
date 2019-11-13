/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { List } from './List';

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const ListContainer = styled.div`
  width: calc(50% - 100px);
  height: calc(100% - 150px);
  padding-left: 100px;
  padding-bottom: 150px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 80%;
  object-fit: contain;
`;

export interface Props {
}

export function Leaderboards(props: Props) {
  return (
    <Container>
      <ListContainer>
        <List />
      </ListContainer>
      <ImageContainer>
        <Image src='images/hud/champions/amazon.png' />
      </ImageContainer>
    </Container>
  );
}
