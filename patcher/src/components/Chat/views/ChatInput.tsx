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

type InputProps = {color: string;} & React.HTMLProps<HTMLInputElement>;
const Input = styled.input`
  color: ${(props: InputProps) => props.color};
`;

function getTarget(text: string, rooms: RoomsState, tab: ChatTab): [boolean, string, string] {
  if (!text.startsWith('/')) {
    return [false, text, rooms.getRoomIDFromShortcut(tab.activeShortcut)];
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
      try {
        const [isDM, message, target] = getTarget(e.currentTarget.value, rooms, props.parentTab);
        if (message && target) {
          if (isDM) {
            game.chat.sendDirectMessage(message, null, target);
          } else {
            game.chat.sendMessageToRoom(message, target);
          }
        }
      } catch {}

      // clear input
      setState({
        ...state,
        value: ''
      });
    }
  }

  return (
    <Input 
      disabled={!props.parentTab.allowChat()}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={state.value}
      color={theme.input.color}
      placeholder={'Click here to chat'}
    />
  );
}
