/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Pane } from './views/Pane';
import { ChatPaneState } from '../../../../redux/chatSlice';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';

const Screen = 'Chat-Screen';

interface ReactProps {}

interface InjectedProps {
  panesArr: ChatPaneState[];
}

type Props = ReactProps & InjectedProps;

class Chat extends React.Component<Props> {
  public render() {
    return (
      <div id={'chat'} className={Screen}>
        {this.props.panesArr.map((pane) => (
          <Pane key={pane.id} paneID={pane.id} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { panes } = state.chat;
  const panesArr = Object.values(panes);
  return {
    ...ownProps,
    panesArr
  };
}

export default connect(mapStateToProps)(Chat);
