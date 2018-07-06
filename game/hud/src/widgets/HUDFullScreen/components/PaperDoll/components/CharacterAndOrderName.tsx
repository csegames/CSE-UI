/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  padding-left: 20px;
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
`;

const Text = styled('div')`
  margin: 0;
  padding: 0;
  font-family: Caudex;
  font-size: 24px;
  letter-spacing: 2px;
  color: #EEEEED;
`;

export interface CharacterNameProps {
  characterName: string;
  // orderName: string;
}

const CharacterAndOrderName = (props: CharacterNameProps) => {
  const { characterName } = props;
  return (
    <Container>
      <Text>{characterName}</Text>
    </Container>
  );
};

export default CharacterAndOrderName;
