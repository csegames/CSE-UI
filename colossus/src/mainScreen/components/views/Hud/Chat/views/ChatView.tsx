/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { ChatInput } from './ChatInput';
import { ChatScrollView } from './ChatScrollView';
import { connect } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { TabState } from '../../../../../redux/chatSlice';

const Container = 'Chat-Views-ChatView-Container';

const InputContainer = 'Chat-Views-ChatView-InputContainer';

interface ReactProps {
  viewId: string;
}

interface InjectedProps {
  tab: TabState;
}

type Props = ReactProps & InjectedProps;

// ChatView is the content of a tab, chat view & input
class AChatView extends React.Component<Props> {
  public render() {
    const tab: TabState = this.props.tab;
    return (
      <div className={Container}>
        <ChatScrollView minLineHeight={21} tab={tab} />
        <div className={InputContainer}>
          <ChatInput tab={tab} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { tabs } = state.chat;
  const tab = tabs[ownProps.viewId];

  return {
    ...ownProps,
    tab
  };
}

export const ChatView = connect(mapStateToProps)(AChatView);
