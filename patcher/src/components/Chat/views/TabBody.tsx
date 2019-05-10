/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useRef, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import { useChatOptions } from '../state/optionsState';
import { useRoomsState } from '../state/roomsState';
import { ChatTab } from '../state/tabsState';
import { ChatInput } from './ChatInput';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  flex: 1 1 auto;
`;

const InputContainer = styled.div`
  flex: 0 0 2em;
  padding: 10px;
`;

interface Props {
  isActive: boolean;
  info: ChatTab;
}

// TabBody is the content of a tab, chat view & input
export function TabBody(props: Props) {

  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const contentEl = useRef(null);

  // initialize listeners
  

  return (
    <Container>
      <Content ref={contentEl}>

      </Content>
      <InputContainer>
        <ChatInput parentTab={props.info} isActive={props.isActive} />
      </InputContainer>
    </Container>
  );
}
