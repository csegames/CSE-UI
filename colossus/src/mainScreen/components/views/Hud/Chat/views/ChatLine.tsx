/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as chat_proto from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { parseText } from '../parsers/parseText';
import { chat } from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { TimedMessage } from '@csegames/library/dist/_baseGame/chat/CSEChat';
import { RootState } from '../../../../../redux/store';
import { connect } from 'react-redux';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ChatOptionsState, RoomState } from '../../../../../redux/chatSlice';
import { getTokenizedStringTableValue } from '../../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { GameOptionIDs } from '../../../../../redux/gameOptionsSlice';
import { filterDirtyWords } from '@csegames/library/dist/_baseGame/utils/textUtils';

const Line = 'Chat-Views-ChatLine-Line';
const Time = 'Chat-Views-ChatLine-Time';
const Room = 'Chat-Views-ChatLine-Room';
const Author = 'Chat-Views-ChatLine-Author';

const Content = 'Chat-Views-ChatLine-Content';

// Loc Tokens
const StringIDDMFrom = 'ChatDMFrom';
const StringIDDMTo = 'ChatDMTo';

interface ReactProps {
  message: TimedMessage;
  key: string | number;
}

interface InjectedProps {
  chatline: {
    color: {
      timestamp: string;
      author: string;
      content: string;
      cseAuthor: string; // color UCE names differently
      dm: string; // color Direct Messages differently.
    };
    fontFamily: string;
  };
  rooms: Dictionary<RoomState>;
  options: ChatOptionsState;
  stringTable: Dictionary<StringTableEntryDef>;
  myUserName: string;
  gameOptions: Dictionary<GameOption>;
}

type Props = ReactProps & InjectedProps;

class AChatLine extends React.Component<Props> {
  render() {
    const isRoom = this.props.message.type === chat.ChatMessage.MessageTypes.Room;
    const isDM = this.props.message.type === chat_proto.chat.ChatMessage.MessageTypes.Direct;
    const isMyDM = isDM && this.props.message.senderName === this.props.myUserName;
    const room = isRoom ? this.props.rooms[this.props.message.targetID] : null;
    const fromCSE = this.props.message.senderFlag === chat.ChatMessage.SenderFlag.CSE;
    let authorColor = fromCSE ? this.props.chatline.color.cseAuthor : this.props.chatline.color.author;
    let messageColor = this.props.chatline.color.content;
    let senderText = this.props.message.senderName;
    if (isDM) {
      authorColor = this.props.chatline.color.dm;
      messageColor = this.props.chatline.color.dm;

      if (isMyDM) {
        senderText = getTokenizedStringTableValue(StringIDDMTo, this.props.stringTable, {
          RECIPIENT: this.props.message.targetName
        });
      } else {
        senderText = getTokenizedStringTableValue(StringIDDMFrom, this.props.stringTable, {
          SENDER: this.props.message.senderName
        });
      }
    }

    const isAnnouncement = this.props.message.type === chat.ChatMessage.MessageTypes.Announcement;
    const optBlockOffensiveWords = this.props.gameOptions[GameOptionIDs.BlockOffensiveWords]?.value ?? true;
    const messageText =
      isAnnouncement == false && optBlockOffensiveWords == true
        ? filterDirtyWords(this.props.message.content)
        : this.props.message.content;

    return (
      <div className={`${Line} ${isDM ? 'dm' : ''}`} key={this.props.message.when.getTime()}>
        {this.props.options.markup.timestamps && (
          <span className={Time} style={{ color: this.props.chatline.color.timestamp }}>
            {this.props.message.when.toLocaleTimeString()}
            &nbsp;
          </span>
        )}
        {isRoom && this.props.options.markup.roomNames && (
          <span className={Room} style={{ color: room.color }}>
            [{this.props.options.markup.roomNames ? `${room.name} (${room.shortcuts[0]})` : room.shortcuts[0]}
            ]&nbsp;
          </span>
        )}
        {this.props.message.senderName && (
          <React.Fragment>
            <span className={Author} style={{ color: authorColor }}>
              {senderText}
            </span>
            &gt;&nbsp;
          </React.Fragment>
        )}
        <span className={Content} style={{ color: messageColor }}>
          {parseText(messageText, this.props.options)}
        </span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { options, rooms, theme } = state.chat;
  const { chatline } = theme;
  const { stringTable } = state.stringTable;
  const { gameOptions } = state.gameOptions;
  const myUserName = state.player.name;

  return {
    ...ownProps,
    chatline,
    rooms,
    options,
    stringTable,
    myUserName,
    gameOptions
  };
}

export const ChatLine = connect(mapStateToProps)(AChatLine);
