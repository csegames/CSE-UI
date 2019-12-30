/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useMemo } from 'react';
import { styled } from '@csegames/linaria/react';

import { useChatOptions } from '../state/optionsState';
import { useRoomsState } from '../state/roomsState';
import { useChatTheme } from '../theme';
import { parseText } from '../parsers/parseText';

const Line = styled.div`
  padding: 0px 8px;
  width: calc(100% - 16px);
`;

type TimeProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Time = styled.span`
  color: ${(props: TimeProps) => props.color};
  font-size: 0.8em;
`;

type RoomProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Room = styled.span`
  color: ${(props: RoomProps) => props.color};
  font-size: 0.8em;
`;

type AuthorProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Author = styled.span`
  color: ${(props: AuthorProps) => props.color};
  font-size: 1em;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

type ContentProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Content = styled.span`
  color: ${(props: ContentProps) => props.color};
  font-size: 1em;
`;

export interface Props {
  message: ChatMessage;
  key: string | number;
}

export function ChatLine(props: Props) {
  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const {chatline} = useChatTheme();

  // render the line only once regardless of state changes to options or rooms, but re-render if theme changes
  return useMemo(() => {
    const isRoom = props.message.type === ChatMessage_MessageTypes.Room;
    const room = isRoom ? rooms.rooms[props.message.targetID] : null;
    const fromCSE = props.message.senderFlag === ChatMessage_SenderFlag.CSE;
    return (
      <Line key={props.message.when.getTime()}>
        {
          opts.markup.timestamps && 
            <Time color={chatline.color.timestamp}>
              {props.message.when.toLocaleTimeString()}
            </Time>
        }
        &nbsp;
        {
          isRoom && 
            <Room color={rooms.getColor(room, opts)}>
              [{opts.markup.roomNames ? `${room.name} (${room.shortcut[0]})`  : room.shortcut[0]}]
            </Room>
        }
        &nbsp;
        <Author 
          color={fromCSE ? chatline.color.cseAuthor : chatline.color.author}
          onClick={() => console.log(`clicked ${props.message.senderName}`)}
        >
          {props.message.senderName}
        </Author>
        :&nbsp;
        <Content color={chatline.color.content}>
          {parseText(props.message.content, opts)}
        </Content>
      </Line>
    );
  }, [chatline]);
}
