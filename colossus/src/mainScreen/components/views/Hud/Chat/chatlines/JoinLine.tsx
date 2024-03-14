/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { chat } from '@csegames/library/dist/_baseGame/chat/chat_proto';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { getTokenizedStringTableValue } from '../../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const StringIDChatJoined = 'ChatJoined';

interface ReactProps {
  msg: chat.RoomJoined;
}

interface InjectedProps {
  showJoins: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AJoinLine extends React.Component<Props> {
  render() {
    const tokens = {
      NAME: this.props.msg.name
    };

    if (this.props.showJoins) {
      return (
        <span style={{ color: 'green' }}>
          {getTokenizedStringTableValue(StringIDChatJoined, this.props.stringTable, tokens)}
        </span>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { showJoins } = state.chat.options;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    showJoins,
    stringTable
  };
}

export const JoinLine = connect(mapStateToProps)(AJoinLine);
