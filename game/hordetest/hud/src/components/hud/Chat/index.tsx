/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { initChat } from './state/chat';
import { useChatPanes, ChatPane } from './state/panesState';
import { Pane } from './views/Pane';
import { MatchmakingContext, MatchmakingContextState } from 'context/MatchmakingContext';

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

interface Props {
  panesArr: ChatPane[];
  matchmakingContext: MatchmakingContextState;
}

class ChatWithInjectedProps extends React.Component<Props> {
  private chatInitTimeout: number;
  public render() {
    return (
      <Screen id='chat'>
        {this.props.panesArr.map(pane => <Pane key={pane.id} pane={pane.id} />)}
      </Screen>
    );
  }

  public componentDidMount() {
    this.tryInitChat();
  }

  public componentWillUnmount() {
    if (this.chatInitTimeout) {
      window.clearTimeout(this.chatInitTimeout);
      this.chatInitTimeout = null;
    }
  }

  private tryInitChat = () => {
    let inittedChat = false;
    if (game.isConnectedToServer) {
      if (!window.chat || !window.chat.connected) {
        var host = game.serverHost
        if (this.props.matchmakingContext && this.props.matchmakingContext.host) {
          host = this.props.matchmakingContext.host
        }

        inittedChat = initChat(host);
      }
    }

    if (!inittedChat) {
      // Retry to init chat every second
      this.chatInitTimeout = window.setTimeout(this.tryInitChat, 1000);
    }
  }
}

export function Chat() {
  const [panes] = useChatPanes();
  const matchmakingContext = useContext(MatchmakingContext);
  const panesArr = Object.values(panes.panes);

  return (
    <ChatWithInjectedProps matchmakingContext={matchmakingContext} panesArr={panesArr} />
  );
}
