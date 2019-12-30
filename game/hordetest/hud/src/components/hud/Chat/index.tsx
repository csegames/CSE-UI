/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { useChatPanes } from './state/panesState';
import { Pane } from './views/Pane';

const Screen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
`;

export interface Props {
}

export function Chat(props: Props) {
  const [panes] = useChatPanes();

  // const [minimized, setMinimized] = useState(false);
  const panesArr = Object.values(panes.panes);
  return (
    <Screen id='chat'>
      {panesArr.map(pane => <Pane key={pane.id} pane={pane.id} />)}
    </Screen>
  );
}
