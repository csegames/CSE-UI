/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { events } from '../../../';
import * as React from 'react';

function fromText(text: string, keygen: () => number) : JSX.Element[] {
  return [
    <span
      key={keygen()}
      className={'chat-room-link'}
      onClick={() : void => { events.fire('chat-show-room', text.substr(1)); }}>
        {text.substr(1)}
    </span>,
  ];
}

function createRegExp() : RegExp {
  return /\B#[\S]+/g;
}

export default {
  fromText,
  createRegExp,
};
