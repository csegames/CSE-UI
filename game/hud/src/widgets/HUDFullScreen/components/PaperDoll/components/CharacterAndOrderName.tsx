/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

const Text = styled('p')`
  margin: 0;
  padding: 0;
  color: #6F7581;
  font-size: 26px;
  font-weight: bold;
`;

export interface CharacterNameProps {
  characterName: string;
  orderName: string;
}

const CharacterAndOrderName = (props: CharacterNameProps) => {
  const { characterName, orderName } = props;
  return (
    <Text>{characterName} {orderName && `<${orderName}>`}</Text>
  );
};

export default CharacterAndOrderName;
