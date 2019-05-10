/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { ChatInput } from './ChatInput';
import { ScrollView } from './ScrollView';
import { useChatViews } from '../state/viewsState';

type ContainerProps = {width: number; height: number} & React.HTMLProps<HTMLDivElement>;
const Container = styled.div`
  width: ${(props: ContainerProps) => props.width}px;
  height: ${(props: ContainerProps) => props.height}px;
  min-height: 0px;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  flex: 0 0 2em;
  width: 100%;
`;

interface Props {
  isActive: boolean;
  viewId: string;
}

// ChatView is the content of a tab, chat view & input
export function ChatView(props: Props) {
  const [viewsState] = useChatViews();
  return (
    <Container width={500} height={200}>
      <ScrollView
        minLineHeight={21}
        view={viewsState.views[props.viewId]}
      />
      <InputContainer>
        <ChatInput view={viewsState.views[props.viewId]} isActive={props.isActive} />
      </InputContainer>
    </Container>
  );
}
