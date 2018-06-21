/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {events} from '@csegames/camelot-unchained';

import * as React from 'react';

function fromText(text: string, keygen: () => number) : JSX.Element[] {
  //events.fire('chat-play-sound-highlight');
  return [<span key={keygen()} className={'chat-room-highlight'}>{text}</span>];
}

function createRegExp(highlight: string[]) : RegExp {
  let regex: string;
  highlight.forEach((h: string) => {
    if (!regex) {
      regex = '(?:^|\\s)@?' + h + ':?(?:$|\\s)';
    } else {
      regex += '|(?:^|\\s)@?' + h + ':?(?:$|\\s)';
    }
  });
  return new RegExp(regex, 'g');
}

export default {
  fromText,
  createRegExp
}
