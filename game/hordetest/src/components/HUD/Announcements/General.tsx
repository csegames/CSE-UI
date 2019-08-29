/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const GeneralContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: 20px;
  border-image: linear-gradient(to left, white 90%, transparent);
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 2px;
  border-style: solid;
  border-image-slice: 1;
`;

const Title = styled.div`
  font-size: 20px;
  color: white;
  font-family: Colus;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
`;

const Icon = styled.div`
  font-size: 30px;
  color: white;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.7);
  margin-left: 15px;
`;

export interface Props {
  text: string;
  iconClass: string;
}

export function General(props: Props) {
  return (
    <GeneralContainer>
      <Title>{props.text}</Title>
      <Icon className={props.iconClass} />
    </GeneralContainer>
  );
}
