/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { initChat } from './state/chat';
import { useChatPanes } from './state/panesState';
import { Pane } from './views/Pane';
import { MatchmakingContext } from 'context/MatchmakingContext';

const Screen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
`;

export interface Props {
}

export function Chat(props: Props) {
  const [panes] = useChatPanes();
  const matchmakingContext = useContext(MatchmakingContext);
  const panesArr = Object.values(panes.panes);

  if (game.isConnectedToServer) {
    if (!window.chat || !window.chat.connected) {
      var host = game.serverHost
      if (matchmakingContext && matchmakingContext.host) {
        console.log(`Using matchmaking host ${host} for chat`);
        host = matchmakingContext.host
      }

      initChat(host);
    }

    return (
      <Screen id='chat'>
        {panesArr.map(pane => <Pane key={pane.id} pane={pane.id} />)}
      </Screen>
    );
  } else {
    return null;
  }
}
