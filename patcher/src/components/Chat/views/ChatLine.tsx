/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { useChatOptions } from '../state/optionsState';
import { useRoomsState } from '../state/roomsState';
import { useChatTheme } from '../theme';
import { parseText } from '../parsers/parseText';

type TimeProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Time = styled.span`
  color: ${(props: TimeProps) => props.color};
`;

type RoomProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Room = styled.span`
  color: ${(props: RoomProps) => props.color};
`;

type AuthorProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Author = styled.span`
  color: ${(props: AuthorProps) => props.color};
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

type ContentProps = {color: string;} & React.HTMLProps<HTMLSpanElement>;
const Content = styled.span`
  color: ${(props: ContentProps) => props.color};
`;

export interface Props {
  message: ChatMessage;
  key: string | number;
}

export function ChatLine(props: Props) {
  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const {chatline} = useChatTheme();

  const isRoom = props.message.type === ChatMessage_MessageTypes.Room;
  const room = isRoom ? rooms.rooms[props.message.targetID] : null;
  const fromCSE = props.message.senderFlag === ChatMessage_SenderFlag.CSE;

  return (
    <>
      {
        opts.markup.timestamps && 
          <Time color={chatline.color.timestamp}>
            {props.message.when.toLocaleTimeString()}
          </Time>
      }
      {
        isRoom && 
          <Room color={rooms.getColor(room, opts)}>
            [{opts.markup.roomNames ? room.name : room.shortcut[0]}]
          </Room>
      }
      <Author 
        color={fromCSE ? chatline.color.cseAuthor : chatline.color.author}
        onClick={() => console.log(`clicked ${props.message.senderName}`)}
      >
        {props.message.senderName}
      </Author>
      <Content color={chatline.color.content}>
        {parseText(props.message.content, opts)}
      </Content>
    </>
  )
}
