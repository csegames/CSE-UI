/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import { useChatTheme } from '../theme';
import { ChatTab } from '../state/tabsState';
import { useChatOptions } from '../state/optionsState';
import { useRoomsState, RoomsState } from '../state/roomsState';
import { useChat } from '../state/chat';

type InputProps = { color: string; fontFamily: string; } & React.HTMLProps<HTMLInputElement>;
const Input = styled.textarea`
  resize: none;
  color: ${(props: InputProps) => props.color};
  font-family: ${(props: InputProps) => props.fontFamily};
  font-size: 16px;
  padding: 0px 8px;
  width: calc(100% - 16px);
  background: transparent;
  border: 0px;
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
`;

function getTarget(text: string, rooms: RoomsState, tab: ChatTab): [boolean, string, string] {
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

  return [false, split[1].trim(), rooms.getRoomIDFromShortcut(shortcut)];
}

export interface Props {
  parentTab: ChatTab;
  isActive: boolean;
}

export function ChatInput(props: Props) {
  const theme = useChatTheme();
  const chat = useChat();
  const [opts] = useChatOptions();
  const [rooms] = useRoomsState(opts);
  const [state, setState] = useState({
    value: '',
  });

  useEffect(() => {
    const handles: EventHandle[] = [];
    handles.push(game.onBeginChat(m => setState({...state, value: m})));
    handles.push(game.onPushChat(m => setState({...state, value: state.value + m})));

    return () => handles.forEach(h => h.clear());
  }, [props.isActive]);

  function onChange(e: React.FormEvent<HTMLInputElement>) {
    setState({
      ...state,
      value: e.currentTarget.value,
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      try {
        const [isDM, message, target] = getTarget(e.currentTarget.value, rooms, props.parentTab);
        if (message && target) {
          if (isDM) {
            chat.sendDirectMessage(message, null, target);
          } else {
            chat.sendMessageToRoom(message, target);
          }
        }
      } catch(err) {
        console.log(err)
      }

      // clear input
      setState({
        ...state,
        value: ''
      });
    }
  }

  return (
    <Input 
      rows={1}
      disabled={!props.parentTab.allowChat()}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={state.value}
      color={theme.input.color}
      fontFamily={theme.input.fontFamily}
      placeholder={'Click here to chat'}
    />
  );
}
