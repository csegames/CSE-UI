/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {events} from '@csegames/camelot-unchained';

import * as React from 'react';

import ChatSession from './ChatSession';
import { chatState } from './ChatState';

function fromText(text: string, keygen: () => number) : JSX.Element[] {
  return [<span key={ keygen() } className='chat-nickname' onClick={ () => { events.fire('cse-chat-private-message', text); } }>{ text }</span >];
}

function createRegExp() : RegExp {
  let regex: string;
  const chat: ChatSession = chatState.get('chat');
  chat.getAllUsers().forEach((u: string) => {
    if (!regex) {
      regex = '\\b' + u + '\\b';
    } else {
      regex += '|\\b' + u + '\\b';
    }
  });
  return new RegExp(regex, 'g');
}

export default {
  fromText,
  createRegExp
}
