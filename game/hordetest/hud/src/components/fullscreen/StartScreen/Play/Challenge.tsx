/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ResourceBar } from 'components/shared/ResourceBar';

const Container = styled.div`
  background-color: #09121a;
  padding: 4px 7px;
`;

const Text = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 16px;
  color: white;
`;

const ResourceBarContainer = styled.div`
  height: 9px;
`;

const SpecialText = styled.span`
  color: #4c93e1;
`;

export interface Props {
  styles?: string;
  challengeText: string;
  progress: CurrentMax;
}

export function Challenge(props: Props) {
  return (
    <Container className={props.styles || ''}>
      <Text>{props.challengeText}</Text>
      <ResourceBarContainer>
        <ResourceBar
          type='blue'
          hideText
          current={props.progress.current}
          max={props.progress.max}
        />
      </ResourceBarContainer>
      <Text><SpecialText>{props.progress.current}</SpecialText> / {props.progress.max}</Text>
    </Container>
  );
}
