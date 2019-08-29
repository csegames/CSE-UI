/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { skins } from './testData';

const Container = styled.div`

`;

const SkinItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

export interface Props {
}

export function SkinsList(props: Props) {
  return (
    <Container>
      {skins.map((skin) => {
        return (
          <SkinItem key={skin.id}>{skin.name}</SkinItem>
        )
      })}
    </Container>
  );
}
