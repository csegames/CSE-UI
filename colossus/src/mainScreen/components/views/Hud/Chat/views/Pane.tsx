/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ChatView } from './ChatView';
import { connect } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { ChatPaneState } from '../../../../../redux/chatSlice';

const Container = 'Chat-Views-Pane-Container';

interface ReactProps {
  paneID: string;
}

interface InjectedProps {
  paneState: ChatPaneState;
}

type Props = ReactProps & InjectedProps;

class APane extends React.Component<Props> {
  render() {
    const containerStyle = {
      bottom: `${this.props.paneState.position.bottom}vmin`,
      left: `${this.props.paneState.position.left}%`,
      width: `${this.props.paneState.position.width}vmin`,
      height: `${this.props.paneState.position.height}vmin`
    };

    return (
      <div className={Container} id={'chat-pane-' + this.props.paneID} style={containerStyle}>
        <ChatView viewId={this.props.paneState.activeTab} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { panes } = state.chat;
  const paneState = panes[ownProps.paneID];
  return {
    ...ownProps,
    paneState
  };
}

export const Pane = connect(mapStateToProps)(APane);
