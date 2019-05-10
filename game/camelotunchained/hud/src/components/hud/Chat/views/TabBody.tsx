/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { ChatTab } from '../state/tabsState';
import { ChatInput } from './ChatInput';
import { ScrollView } from './ScrollView';

type ContainerProps = {width: number; height: number} & React.HTMLProps<HTMLDivElement>;
const Container = styled.div`
  width: ${(props: ContainerProps) => props.width}px;
  height: ${(props: ContainerProps) => props.height}px;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
`;

const InputContainer = styled.div`
  flex: 0 0 2em;
  width: 100%;
`;

interface Props {
  isActive: boolean;
  info: ChatTab;
}

// TabBody is the content of a tab, chat view & input
export function TabBody(props: Props) {
  return (
    <Container width={500} height={300}>
      <ScrollView
        minLineHeight={21}
        tab={props.info}
      />
      <InputContainer>
        <ChatInput parentTab={props.info} isActive={props.isActive} />
      </InputContainer>
    </Container>
  );
}
