/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { useChatPanes } from '../state/panesState';
import { ChatView } from './ChatView';

type ContainerProps = { width: number; height: number; bottom: number; left: number; };
const Container = styled.div`
  color: #999;
  position: absolute;
  bottom: ${(props: ContainerProps) => props.bottom}px;
  left: ${(props: ContainerProps) => props.left}px;
  width: ${(props: ContainerProps) => props.width}px;
  height: ${(props: ContainerProps) => props.height}px;
`;

export interface Props {
  pane: string;
}

export function Pane(props: Props) {
  const [panes] = useChatPanes();

  const pane = panes.panes[props.pane];

  const [state] = useState({
    currentBody: pane.views[0],
  });

  return (
    <Container id={'chat-pane-' + props.pane} {...pane.position}>
      <ChatView
        isActive={true}
        viewId={state.currentBody}
      />
    </Container>
  );
}
