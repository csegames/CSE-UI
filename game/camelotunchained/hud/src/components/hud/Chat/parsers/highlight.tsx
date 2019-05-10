/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser } from './parseText';

function createRegExp(highlights: string[]): RegExp {
  let regex: string;
  highlights.forEach((h: string) => {
    if (!regex) {
      regex = '(?:^|\\s)@?' + h + ':?(?:$|\\s)';
    } else {
      regex += '|(?:^|\\s)@?' + h + ':?(?:$|\\s)';
    }
  });
  return new RegExp(regex, 'g');
}

export function parseHighlight(text: string, opts: OptionsState, next: Parser): [string, JSX.Element] {
  if (!opts.parsing.highlight || opts.parsing.highlightKeywords.length <= 0) {
    return [text, null];
  }
  const regex = createRegExp(opts.parsing.highlightKeywords);
  const match = regex.exec(text);
  if (!match) {
    return [text, null];
  }
  // game.trigger('chat-play-sound-highlight');
  return [
    null,
    <span key={genID()} className={'chat-room-highlight'}>{next(text, opts, next)}</span>
  ];
}