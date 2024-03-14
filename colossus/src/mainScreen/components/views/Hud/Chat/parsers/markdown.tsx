/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Parser } from './parseText';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { ChatOptionsState } from '../../../../../redux/chatSlice';

export function parseMarkdown(text: string, opts: ChatOptionsState, next: Parser): [string, JSX.Element] {
  if (!opts.parsing.markdown) {
    return [text, null];
  }

  const regex = /(^|)(?:(\*\*|\*)([^\*]+)\2)|(?:(__|_)([^_]+)\4)($|)/g;
  const match = regex.exec(text);
  if (!match) {
    return [text, null];
  }

  const before = text.substr(0, match.index);
  const after = text.substr(match.index).replace(match[0], '');
  const content = match[3] || match[5];
  const isItalic = (match[2] && match[2].length === 1) || (match[4] && match[4].length === 1);
  return [
    before,
    <>
      {isItalic ? <i key={genID()}>{next(content, opts, next)}</i> : <b key={genID()}>{next(content, opts, next)}</b>}
      {next(after, opts, next)}
    </>
  ];
}
