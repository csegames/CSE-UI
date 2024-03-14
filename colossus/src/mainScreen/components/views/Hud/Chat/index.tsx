/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { initChat } from './state/chat';
import { Pane } from './views/Pane';
import { chat } from './state/chat';
import { ChatPaneState } from '../../../../redux/chatSlice';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { game } from '@csegames/library/dist/_baseGame';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';

const Screen = 'Chat-Screen';

interface ReactProps {
  slashCommands: SlashCommandRegistry<RootState>;
}

interface InjectedProps {
  panesArr: ChatPaneState[];
  host: string;
}

type Props = ReactProps & InjectedProps;

class Chat extends React.Component<Props> {
  private chatInitTimeout: number;
  public render() {
    return (
      <div id={'chat'} className={Screen}>
        {this.props.panesArr.map((pane) => (
          <Pane slashCommands={this.props.slashCommands} key={pane.id} paneID={pane.id} />
        ))}
      </div>
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

  private tryInitChat() {
    let inittedChat = false;
    if (game.isConnectedToServer) {
      if (!chat || !chat.connected) {
        var host = game.serverHost;
        if (this.props.host) {
          host = this.props.host;
        }

        inittedChat = initChat(game, host);
      }
    }

    if (!inittedChat) {
      // Retry to init chat every second
      this.chatInitTimeout = window.setTimeout(this.tryInitChat.bind(this), 1000);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { panes } = state.chat;
  const panesArr = Object.values(panes);
  const host = state.match.currentRound?.serverName;
  return {
    ...ownProps,
    host,
    panesArr
  };
}

export default connect(mapStateToProps)(Chat);
