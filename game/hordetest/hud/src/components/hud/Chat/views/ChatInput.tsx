/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@csegames/linaria/react';
import { parseMessageForSlashCommand } from '@csegames/library/lib/_baseGame';

import { useChatTheme } from '../theme';
import { View } from '../state/viewsState';
import { useChatOptions } from '../state/optionsState';
import { useRoomsState, RoomsState } from '../state/roomsState';
import { useChat } from '../state/chat';

type InputProps = { color: string; fontFamily: string; } & React.HTMLProps<HTMLInputElement>;
const Input = styled.textarea`
  resize: none;
  color: ${(props: InputProps) => props.color};
  font-family: ${(props: InputProps) => props.fontFamily};
  font-size: 20px;
  padding: 0px 8px;
  width: calc(100% - 16px);
  background: transparent;
  border: 0px;
  text-shadow: 1px 2px 2px #474747;
  pointer-events: auto !important;
  :focus {
    border: 0px;
    outline: none !important;
  }
  &::-webkit-scrollbar {
    width: 7px !important;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #222, #333, #222) !important;
    box-shadow: none !important;
  }
  &::placeholder {
    color: white;
    font-weight: 900;
    font-size: 20px;
    text-shadow: 2px 3px 2px #474747;
  }
`;

function getTarget(text: string, rooms: RoomsState, tab: View): [boolean, string, string] {
  if (!text.startsWith('/')) {
    return [false, text, tab.activeFilter];
  }

  var split = text.split(/ (.+)/);
  var shortcut = split[0];
  if (shortcut === '/dm' || shortcut === '/pm' || shortcut === '/r') {
    const dmSplit = split[1].trimLeft().split(/ (.+)/);
    const name = dmSplit[0].trim();
    const message = dmSplit[1].trim();
    return [true, message, name];
  }

  return [false, split[1] ? split[1].trim() : '', rooms.getRoomIDFromShortcut(shortcut)];
}

const SENT_HISTORY_LENGTH = 20;

export interface Props {
  view: View;
  isActive: boolean;
}

export function ChatInput(props: Props) {
  const theme = useChatTheme();
  const chat = useChat();
  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const [value, setValue] = useState('');
  const sentMessages = useRef(new CircularArray<string>(SENT_HISTORY_LENGTH));
  let sentHistoryIndex = useRef(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handles: EventHandle[] = [];
    handles.push(game.onBeginChat(m => {
      setValue(v => {
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(inputRef.current.value.length,inputRef.current.value.length);
          }, 1);
        }
        return m;
      });
    }));
    return () => handles.forEach(h => h.clear());
  }, [props.isActive]);

  function onChange(e: React.FormEvent<HTMLInputElement>) {
    setValue(e.currentTarget.value);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Handle shift + up-arrow (38)
    if (e.shiftKey && e.keyCode === 38) {
      e.preventDefault();
      sentHistoryIndex.current++;
      if (sentHistoryIndex.current >= sentMessages.current.length) {
        sentHistoryIndex.current = 0;
      }
      setValue(sentMessages.current.get(sentHistoryIndex.current));
    }

    // Handle shift + down-arrow (40)
    if (e.shiftKey && e.keyCode === 40) {
      e.preventDefault();
      sentHistoryIndex.current--;
      if (sentHistoryIndex.current < 0) {
        sentHistoryIndex.current = sentMessages.current.length;
      }
      setValue(sentMessages.current.get(sentHistoryIndex.current));
    }

    // Enter
    if (e.keyCode === 13) {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      try {
        const val = e.currentTarget.value;
        const [isDM, message, target] = getTarget(val, rooms, props.view);
        if (message && target) {
          if (isDM) {
            chat.sendDirectMessage(message, null, target);
          } else {
            chat.sendMessageToRoom(message, target);
          }
          sentMessages.current.push(val)
        } else if (val.startsWith('/') && !target) {
          const cmd = val.replace('/', '');
          if (parseMessageForSlashCommand(cmd)) {
            sentMessages.current.push(val)
          } else {
            game.sendSlashCommand(cmd);
            sentMessages.current.push(val)
          }
        }
      } catch(err) {
        console.log(err)
      }

      // clear input
      setValue('');
      sentHistoryIndex.current = -1

      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  return (
    <Input
      ref={inputRef}
      rows={1}
      disabled={!props.view.allowChat()}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      color={theme.input.color}
      fontFamily={theme.input.fontFamily}
      placeholder={'Press enter to chat'}
    />
  );
}
